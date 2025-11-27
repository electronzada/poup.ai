import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/get-server-session'

// GET /api/transactions/[id] - Obter transação específica
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = params
    
    const transaction = await prisma.transaction.findFirst({
      where: { 
        id,
        userId: user.id
      },
      include: {
        account: true,
        category: true
      }
    })

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Error fetching transaction:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    )
  }
}

// PUT /api/transactions/[id] - Atualizar transação
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { amount, type, description, date, notes, tags, accountId, categoryId } = body

    // Validações específicas com mensagens claras
    const missingFields: string[] = []
    
    if (!description || (typeof description === 'string' && description.trim() === '')) {
      missingFields.push('descrição')
    }
    
    if (!amount || amount === '') {
      missingFields.push('valor')
    }
    
    if (!categoryId) {
      missingFields.push('categoria')
    }
    
    if (!accountId) {
      missingFields.push('conta')
    }
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Campos obrigatórios não preenchidos: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    if (!type) {
      return NextResponse.json(
        { error: 'Tipo de transação é obrigatório' },
        { status: 400 }
      )
    }

    if (!['income', 'expense', 'transfer'].includes(type)) {
      return NextResponse.json(
        { error: 'Tipo inválido. Use: income, expense ou transfer' },
        { status: 400 }
      )
    }

    // Validar valor numérico
    const amountValue = typeof amount === 'number' ? amount : Number.parseFloat(amount)
    
    if (isNaN(amountValue)) {
      return NextResponse.json(
        { error: 'O valor deve ser um número válido' },
        { status: 400 }
      )
    }

    if (amountValue <= 0) {
      return NextResponse.json(
        { error: 'O valor deve ser maior que zero' },
        { status: 400 }
      )
    }

    if (amountValue < 0) {
      return NextResponse.json(
        { error: 'Não são permitidos valores negativos' },
        { status: 400 }
      )
    }

    // Verificar se a transação existe e pertence ao usuário
    const existingTransaction = await prisma.transaction.findFirst({
      where: { 
        id,
        userId: user.id
      },
      include: { account: true }
    })

    if (!existingTransaction) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se a conta e categoria pertencem ao usuário
    const [account, category] = await Promise.all([
      prisma.account.findFirst({
        where: { id: accountId, userId: user.id }
      }),
      prisma.category.findFirst({
        where: { id: categoryId, userId: user.id }
      })
    ])

    if (!account) {
      return NextResponse.json(
        { error: 'Conta não encontrada ou não pertence ao usuário' },
        { status: 404 }
      )
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Categoria não encontrada ou não pertence ao usuário' },
        { status: 404 }
      )
    }

    // Atualizar a transação
    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount: amountValue,
        type,
        description: typeof description === 'string' ? description.trim() : description,
        date: date ? new Date(date) : existingTransaction.date,
        notes,
        tags: tags || [],
        accountId,
        categoryId
      },
      include: {
        account: true,
        category: true
      }
    })

    // Se mudou a conta ou o valor, atualizar saldos
    if (existingTransaction.accountId !== accountId || existingTransaction.amount !== amountValue) {
      // Reverter saldo da conta antiga
      const oldAccount = await prisma.account.findFirst({
        where: { 
          id: existingTransaction.accountId,
          userId: user.id
        }
      })

      if (oldAccount) {
        const oldBalance = existingTransaction.type === 'income' 
          ? oldAccount.balance - existingTransaction.amount 
          : oldAccount.balance + existingTransaction.amount

        await prisma.account.update({
          where: { id: existingTransaction.accountId },
          data: { balance: oldBalance }
        })
      }

      // Aplicar novo saldo na conta nova (já validado acima)
      const newAccount = account

      if (newAccount) {
        const newBalance = type === 'income' 
          ? newAccount.balance + amountValue 
          : newAccount.balance - amountValue

        await prisma.account.update({
          where: { id: accountId },
          data: { balance: newBalance }
        })
      }
    }

    return NextResponse.json(updatedTransaction)
  } catch (error) {
    console.error('Error updating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    )
  }
}

// DELETE /api/transactions/[id] - Excluir transação
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = params

    // Buscar a transação para reverter o saldo da conta
    const transaction = await prisma.transaction.findFirst({
      where: { 
        id,
        userId: user.id
      },
      include: { account: true }
    })

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
        { status: 404 }
      )
    }

    // Recalcular o saldo da conta baseado em todas as transações restantes
    const account = await prisma.account.findFirst({
      where: { 
        id: transaction.accountId,
        userId: user.id
      }
    })

    if (account) {
      // Buscar todas as transações da conta (incluindo a que será excluída)
      const allTransactions = await prisma.transaction.findMany({
        where: {
          accountId: transaction.accountId,
          userId: user.id
        }
      })

      // Calcular o saldo inicial: saldo atual - impacto de todas as transações existentes
      // Isso nos dá o saldo que a conta tinha antes de qualquer transação
      let calculatedInitialBalance = account.balance
      allTransactions.forEach(t => {
        if (t.type === 'income') {
          calculatedInitialBalance -= t.amount
        } else if (t.type === 'expense') {
          calculatedInitialBalance += t.amount
        }
      })

      // Buscar todas as transações restantes (exceto a que será excluída)
      const remainingTransactions = allTransactions.filter(t => t.id !== id)

      // Calcular o novo saldo: saldo inicial + impacto das transações restantes
      let newBalance = calculatedInitialBalance
      remainingTransactions.forEach(t => {
        if (t.type === 'income') {
          newBalance += t.amount
        } else if (t.type === 'expense') {
          newBalance -= t.amount
        }
      })

      await prisma.account.update({
        where: { id: transaction.accountId },
        data: { balance: newBalance }
      })
    }

    // Excluir a transação
    await prisma.transaction.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Transação excluída com sucesso' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    )
  }
}
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

    // Validação básica
    if (!amount || !type || !description || !accountId || !categoryId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: amount, type, description, accountId, categoryId' },
        { status: 400 }
      )
    }

    if (!['income', 'expense', 'transfer'].includes(type)) {
      return NextResponse.json(
        { error: 'Tipo inválido. Use: income, expense ou transfer' },
        { status: 400 }
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Valor deve ser maior que zero' },
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
        amount,
        type,
        description,
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
    if (existingTransaction.accountId !== accountId || existingTransaction.amount !== amount) {
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
          ? newAccount.balance + amount 
          : newAccount.balance - amount

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

    // Reverter o saldo da conta
    const account = await prisma.account.findFirst({
      where: { 
        id: transaction.accountId,
        userId: user.id
      }
    })

    if (account) {
      const newBalance = transaction.type === 'income' 
        ? account.balance - transaction.amount 
        : account.balance + transaction.amount

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
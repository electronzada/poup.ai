import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/get-server-session'

// GET /api/transactions - Listar todas as transações
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100') // Aumentado para reduzir paginação
    const accountIds = searchParams.getAll('accountId')
    const categoryIds = searchParams.getAll('categoryId')
    const type = searchParams.get('type')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {
      userId: user.id
    }
    
    // Suportar múltiplos accountIds
    if (accountIds.length > 0) {
      where.accountId = accountIds.length === 1 ? accountIds[0] : { in: accountIds }
    }
    
    // Suportar múltiplos categoryIds
    if (categoryIds.length > 0) {
      where.categoryId = categoryIds.length === 1 ? categoryIds[0] : { in: categoryIds }
    }
    
    if (type) where.type = type
    
    // Filtrar por data da transação (date)
    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = new Date(startDate)
      if (endDate) where.date.lte = new Date(endDate)
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        select: {
          id: true,
          date: true,
          description: true,
          amount: true,
          type: true,
          notes: true,
          tags: true,
          account: {
            select: {
              id: true,
              name: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              color: true
            }
          }
        },
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.transaction.count({ where })
    ])

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

// POST /api/transactions - Criar nova transação
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

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

    const transaction = await prisma.transaction.create({
      data: {
        amount: amountValue,
        type,
        description: typeof description === 'string' ? description.trim() : description,
        date: date ? new Date(date) : new Date(),
        notes,
        tags: tags || [],
        accountId,
        categoryId,
        userId: user.id
      },
      include: {
        account: true,
        category: true
      }
    })

    if (account) {
      const newBalance = type === 'income' 
        ? account.balance + amountValue 
        : account.balance - amountValue

      await prisma.account.update({
        where: { id: accountId },
        data: { balance: newBalance }
      })
    }

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/get-server-session'

// GET /api/budgets - Listar todos os orçamentos
export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const budgets = await prisma.budget.findMany({
      where: { userId: user.id },
      include: {
        category: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(budgets)
  } catch (error) {
    console.error('Error fetching budgets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    )
  }
}

// POST /api/budgets - Criar novo orçamento
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
    const { name, amount, period, startDate, endDate, categoryId } = body

    // Verificar se a categoria pertence ao usuário
    const category = await prisma.category.findFirst({
      where: { 
        id: categoryId,
        userId: user.id
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Categoria não encontrada ou não pertence ao usuário' },
        { status: 404 }
      )
    }

    const budget = await prisma.budget.create({
      data: {
        name,
        amount,
        period,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        categoryId,
        userId: user.id
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(budget, { status: 201 })
  } catch (error) {
    console.error('Error creating budget:', error)
    return NextResponse.json(
      { error: 'Failed to create budget' },
      { status: 500 }
    )
  }
}

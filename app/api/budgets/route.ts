import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/budgets - Listar todos os orçamentos
export async function GET() {
  try {
    const budgets = await prisma.budget.findMany({
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
    const body = await request.json()
    const { name, amount, period, startDate, endDate, categoryId } = body

    const budget = await prisma.budget.create({
      data: {
        name,
        amount,
        period,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        categoryId
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

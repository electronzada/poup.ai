import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/budgets/[id] - Buscar orçamento específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const budget = await prisma.budget.findUnique({
      where: { id: params.id },
      include: {
        category: true
      }
    })

    if (!budget) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(budget)
  } catch (error) {
    console.error('Error fetching budget:', error)
    return NextResponse.json(
      { error: 'Failed to fetch budget' },
      { status: 500 }
    )
  }
}

// PUT /api/budgets/[id] - Atualizar orçamento
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, amount, period, startDate, endDate, isActive, categoryId } = body

    const budget = await prisma.budget.update({
      where: { id: params.id },
      data: {
        name,
        amount,
        period,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        isActive,
        categoryId
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(budget)
  } catch (error) {
    console.error('Error updating budget:', error)
    return NextResponse.json(
      { error: 'Failed to update budget' },
      { status: 500 }
    )
  }
}

// DELETE /api/budgets/[id] - Deletar orçamento
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.budget.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Budget deleted successfully' })
  } catch (error) {
    console.error('Error deleting budget:', error)
    return NextResponse.json(
      { error: 'Failed to delete budget' },
      { status: 500 }
    )
  }
}

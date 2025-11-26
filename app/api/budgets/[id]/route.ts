import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/get-server-session'

// GET /api/budgets/[id] - Buscar orçamento específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const budget = await prisma.budget.findFirst({
      where: { 
        id: params.id,
        userId: user.id
      },
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
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, amount, period, startDate, endDate, isActive, categoryId } = body

    // Verificar se o budget existe e pertence ao usuário
    const existingBudget = await prisma.budget.findFirst({
      where: { 
        id: params.id,
        userId: user.id
      }
    })

    if (!existingBudget) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      )
    }

    // Se categoryId foi fornecido, verificar se pertence ao usuário
    if (categoryId) {
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
    }

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
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar se o budget existe e pertence ao usuário
    const budget = await prisma.budget.findFirst({
      where: { 
        id: params.id,
        userId: user.id
      }
    })

    if (!budget) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      )
    }

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

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/goals - Listar todas as metas
export async function GET() {
  try {
    const goals = await prisma.goal.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(goals)
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    )
  }
}

// POST /api/goals - Criar nova meta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, targetAmount, currentAmount, targetDate, description } = body

    const goal = await prisma.goal.create({
      data: {
        name,
        targetAmount,
        currentAmount: currentAmount || 0,
        targetDate: new Date(targetDate),
        description
      }
    })

    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    )
  }
}

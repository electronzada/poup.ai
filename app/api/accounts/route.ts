import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/get-server-session'

// GET /api/accounts - Listar todas as contas
export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const accounts = await prisma.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(accounts)
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    )
  }
}

// POST /api/accounts - Criar nova conta
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
    const { name, type, balance, currency, description } = body

    // Validação básica
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: name, type' },
        { status: 400 }
      )
    }

    if (!['checking', 'savings', 'credit', 'investment'].includes(type)) {
      return NextResponse.json(
        { error: 'Tipo inválido. Use: checking, savings, credit ou investment' },
        { status: 400 }
      )
    }

    const account = await prisma.account.create({
      data: {
        name,
        type,
        balance: balance || 0,
        currency: currency || 'BRL',
        description,
        userId: user.id
      }
    })

    return NextResponse.json(account, { status: 201 })
  } catch (error) {
    console.error('Error creating account:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}

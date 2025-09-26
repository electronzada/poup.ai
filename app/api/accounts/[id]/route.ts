import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/accounts/[id] - Obter conta específica
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    const account = await prisma.account.findUnique({
      where: { id }
    })

    if (!account) {
      return NextResponse.json(
        { error: 'Conta não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(account)
  } catch (error) {
    console.error('Error fetching account:', error)
    return NextResponse.json(
      { error: 'Failed to fetch account' },
      { status: 500 }
    )
  }
}

// PUT /api/accounts/[id] - Atualizar conta
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, type, currency, description, isActive } = body

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

    // Verificar se a conta existe
    const existingAccount = await prisma.account.findUnique({
      where: { id }
    })

    if (!existingAccount) {
      return NextResponse.json(
        { error: 'Conta não encontrada' },
        { status: 404 }
      )
    }

    // Atualizar a conta
    const updatedAccount = await prisma.account.update({
      where: { id },
      data: {
        name,
        type,
        currency: currency || existingAccount.currency,
        description,
        isActive: isActive !== undefined ? isActive : existingAccount.isActive
      }
    })

    return NextResponse.json(updatedAccount)
  } catch (error) {
    console.error('Error updating account:', error)
    return NextResponse.json(
      { error: 'Failed to update account' },
      { status: 500 }
    )
  }
}

// DELETE /api/accounts/[id] - Excluir conta
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Verificar se a conta existe
    const account = await prisma.account.findUnique({
      where: { id }
    })

    if (!account) {
      return NextResponse.json(
        { error: 'Conta não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se há transações associadas
    const transactionCount = await prisma.transaction.count({
      where: { accountId: id }
    })

    if (transactionCount > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir conta com transações associadas' },
        { status: 400 }
      )
    }

    // Excluir a conta
    await prisma.account.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Conta excluída com sucesso' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}
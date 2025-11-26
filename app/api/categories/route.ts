import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/get-server-session'

// GET /api/categories - Listar todas as categorias
export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const categories = await prisma.category.findMany({
      where: { userId: user.id },
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/categories - Criar nova categoria
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user || !user.id) {
      return NextResponse.json(
        { error: 'Não autorizado. Por favor, faça login novamente.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, type, color, icon, description } = body

    // Validação básica
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: name, type' },
        { status: 400 }
      )
    }

    if (!['income', 'expense', 'transfer'].includes(type)) {
      return NextResponse.json(
        { error: 'Tipo inválido. Use: income, expense ou transfer' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        type,
        color,
        icon,
        description,
        userId: user.id
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    console.error('Error creating category:', error)
    
    // Tratar erros específicos do Prisma
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Já existe uma categoria com este nome para o seu usuário' },
        { status: 400 }
      )
    }
    
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Usuário inválido' },
        { status: 400 }
      )
    }

    // Retornar mensagem de erro mais específica se disponível
    const errorMessage = error.message || 'Failed to create category'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

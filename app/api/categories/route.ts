import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/categories - Listar todas as categorias
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
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
        description
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

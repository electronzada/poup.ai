import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/get-server-session'

// GET /api/dashboard/stats - Obter estatísticas do dashboard
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
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const dateFilter: any = {}
    if (startDate) dateFilter.gte = new Date(startDate)
    if (endDate) dateFilter.lte = new Date(endDate)

    const userFilter = { userId: user.id }

    // Estatísticas básicas
    const [
      totalAccounts,
      totalTransactions,
      totalIncome,
      totalExpenses,
      accounts,
      recentTransactions,
      categoryStats
    ] = await Promise.all([
      prisma.account.count({ where: { ...userFilter, isActive: true } }),
      prisma.transaction.count({
        where: {
          ...userFilter,
          ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
        }
      }),
      prisma.transaction.aggregate({
        where: {
          ...userFilter,
          type: 'income',
          ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
        },
        _sum: { amount: true }
      }),
      prisma.transaction.aggregate({
        where: {
          ...userFilter,
          type: 'expense',
          ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
        },
        _sum: { amount: true }
      }),
      prisma.account.findMany({
        where: { ...userFilter, isActive: true },
        select: {
          id: true,
          name: true,
          balance: true,
          type: true,
          currency: true
        }
      }),
      prisma.transaction.findMany({
        where: {
          ...userFilter,
          ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
        },
        include: {
          account: { select: { name: true } },
          category: { select: { name: true, color: true } }
        },
        orderBy: { date: 'desc' },
        take: 10
      }),
      prisma.transaction.groupBy({
        by: ['categoryId'],
        where: {
          ...userFilter,
          type: 'expense',
          ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
        },
        _sum: { amount: true },
        _count: { id: true },
        orderBy: { _sum: { amount: 'desc' } },
        take: 5
      })
    ])

    // Buscar detalhes das categorias
    const categoryDetails = await prisma.category.findMany({
      where: {
        ...userFilter,
        id: { in: categoryStats.map(stat => stat.categoryId) }
      },
      select: { id: true, name: true, color: true }
    })

    const categoryStatsWithDetails = categoryStats.map(stat => {
      const category = categoryDetails.find(cat => cat.id === stat.categoryId)
      return {
        categoryId: stat.categoryId,
        categoryName: category?.name || 'Unknown',
        categoryColor: category?.color || '#000000',
        totalAmount: stat._sum.amount || 0,
        transactionCount: stat._count.id
      }
    })

    // Calcular saldo total
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

    // Calcular lucro líquido
    const netIncome = (totalIncome._sum.amount || 0) - (totalExpenses._sum.amount || 0)

    const stats = {
      overview: {
        totalAccounts,
        totalTransactions,
        totalBalance,
        totalIncome: totalIncome._sum.amount || 0,
        totalExpenses: totalExpenses._sum.amount || 0,
        netIncome
      },
      accounts,
      recentTransactions,
      categoryStats: categoryStatsWithDetails
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}

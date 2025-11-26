import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest } from 'next/server'

export async function getCurrentUser(request?: NextRequest) {
  try {
    // Para NextAuth v4, getServerSession funciona automaticamente em rotas da API
    // quando chamado sem parâmetros, ele usa os headers/cookies da requisição atual
    const session = await getServerSession(authOptions as any)
    
    if (!session) {
      console.log('No session found')
      return null
    }

    if (!session.user) {
      return null
    }

    if (!session.user.id) {
      return null
    }

    return {
      id: session.user.id,
      email: session.user.email || undefined,
      name: session.user.name || undefined
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}


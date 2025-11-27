import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

// Evitar que esta rota seja tratada como estática
export const dynamic = 'force-dynamic'

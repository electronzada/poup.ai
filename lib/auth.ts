import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export const authOptions = {
	providers: [
		Credentials({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Senha', type: 'password' }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null
				const user = await prisma.user.findUnique({ where: { email: credentials.email } })
				if (!user || !user.passwordHash) return null
				const valid = await bcrypt.compare(credentials.password, user.passwordHash)
				if (!valid) return null
				return { id: user.id, name: user.name || null, email: user.email, image: user.image || null }
			}
		})
	],
	session: { strategy: 'jwt' as const },
	callbacks: {
		async jwt({ token, user }) {
			// Quando há um novo login, user está presente
			if (user) {
				token.id = user.id
				token.email = user.email
				token.name = user.name
			}
			// Se não há user mas token.id existe, mantém (sessão existente)
			// Se não há nenhum dos dois, retorna token vazio
			return token
		},
		async session({ session, token }) {
			// Garantir que o id sempre seja passado da sessão
			if (token && token.id) {
				session.user.id = token.id as string
			}
			if (token?.email) {
				session.user.email = token.email as string
			}
			if (token?.name) {
				session.user.name = token.name as string
			}
			return session
		}
	},
	pages: {
		signIn: '/login'
	}
}

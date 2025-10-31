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
	pages: {
		signIn: '/login'
	}
}

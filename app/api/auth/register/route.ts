import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { name, email, password } = body as { name?: string; email?: string; password?: string }
		if (!email || !password) {
			return NextResponse.json({ error: 'Campos obrigatórios: email, password' }, { status: 400 })
		}

		const existing = await prisma.user.findUnique({ where: { email } })
		if (existing) {
			return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 400 })
		}

		const passwordHash = await bcrypt.hash(password, 10)
		const user = await prisma.user.create({ data: { name: name || null, email, passwordHash } })
		return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 })
	} catch (error) {
		console.error('Error registering user:', error)
		return NextResponse.json({ error: 'Falha ao registrar usuário' }, { status: 500 })
	}
}

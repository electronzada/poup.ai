import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Função para validar email
const isValidEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}

// Função para validar senha (mínimo 8 caracteres e pelo menos 1 caractere especial)
const isValidPassword = (password: string): boolean => {
	if (password.length < 8) return false
	const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
	return specialCharRegex.test(password)
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { name, email, password } = body as { name?: string; email?: string; password?: string }
		
		// Validações básicas
		if (!email || !password) {
			return NextResponse.json({ error: 'Campos obrigatórios: email, password' }, { status: 400 })
		}

		// Validar formato do email
		if (!isValidEmail(email)) {
			return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
		}

		// Validar senha
		if (!isValidPassword(password)) {
			return NextResponse.json({ 
				error: 'Senha deve ter no mínimo 8 caracteres e pelo menos 1 caractere especial' 
			}, { status: 400 })
		}

		// Verificar se email já existe
		const existing = await prisma.user.findUnique({ where: { email } })
		if (existing) {
			return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 400 })
		}

		// Criar usuário
		const passwordHash = await bcrypt.hash(password, 10)
		const user = await prisma.user.create({ data: { name: name || null, email, passwordHash } })
		return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 })
	} catch (error) {
		console.error('Error registering user:', error)
		return NextResponse.json({ error: 'Falha ao registrar usuário' }, { status: 500 })
	}
}

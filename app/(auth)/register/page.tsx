"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'

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

export default function RegisterPage() {
	const router = useRouter()
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [emailError, setEmailError] = useState<string | null>(null)
	const [passwordError, setPasswordError] = useState<string | null>(null)
	const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null)

	const validateForm = (): boolean => {
		let isValid = true
		
		// Validar email
		if (!email) {
			setEmailError('Email é obrigatório')
			isValid = false
		} else if (!isValidEmail(email)) {
			setEmailError('Email inválido')
			isValid = false
		} else {
			setEmailError(null)
		}

		// Validar senha
		if (!password) {
			setPasswordError('Senha é obrigatória')
			isValid = false
		} else if (!isValidPassword(password)) {
			setPasswordError('Senha deve ter no mínimo 8 caracteres e pelo menos 1 caractere especial')
			isValid = false
		} else {
			setPasswordError(null)
		}

		// Validar confirmação de senha
		if (!confirmPassword) {
			setConfirmPasswordError('Confirmação de senha é obrigatória')
			isValid = false
		} else if (password !== confirmPassword) {
			setConfirmPasswordError('As senhas não coincidem')
			isValid = false
		} else {
			setConfirmPasswordError(null)
		}

		return isValid
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		
		if (!validateForm()) {
			return
		}

		setLoading(true)
		try {
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, password })
			})
			if (!res.ok) {
				const data = await res.json().catch(() => null)
				throw new Error(data?.error || 'Falha ao registrar')
			}
			router.push('/login')
		} catch (err: any) {
			setError(err?.message || 'Erro inesperado')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-[70vh] flex items-center justify-center px-4 py-6 sm:py-10">
			<div className="w-full max-w-md">
				<div className="text-center mb-6 sm:mb-8">
					<div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl">
						{/* poup.ai logo */}
						<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
							<defs>
								<linearGradient id="grad-reg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
									<stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25"/>
									<stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.9"/>
								</linearGradient>
							</defs>
							<rect x="2" y="2" width="44" height="44" rx="12" fill="url(#grad-reg)"/>
							{/* large dollar sign */}
							<text x="24" y="24" textAnchor="middle" dominantBaseline="middle" fontSize="28" fontWeight="800" fill="white" fontFamily="Inter, ui-sans-serif, system-ui">$</text>
						</svg>
					</div>
					<h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Poup.ai</h1>
					<p className="text-sm sm:text-base text-muted-foreground mt-1">Crie sua conta para começar</p>
				</div>
				<div className="rounded-xl border bg-card p-4 sm:p-6 shadow-sm">
					<h2 className="text-lg sm:text-xl font-semibold mb-4">Criar conta</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Nome</Label>
							<Input 
								id="name" 
								value={name} 
								onChange={(e) => setName(e.target.value)} 
								autoComplete="name"
								className="w-full"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input 
								id="email" 
								type="email" 
								value={email} 
								onChange={(e) => {
									setEmail(e.target.value)
									if (emailError) setEmailError(null)
								}} 
								required 
								aria-invalid={!!emailError}
								autoComplete="email"
								className="w-full"
							/>
							{emailError && <p className="text-xs sm:text-sm text-destructive">{emailError}</p>}
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Senha</Label>
							<PasswordInput 
								id="password" 
								value={password} 
								onChange={(e) => {
									setPassword(e.target.value)
									if (passwordError) setPasswordError(null)
								}} 
								required 
								aria-invalid={!!passwordError}
								autoComplete="new-password"
								className="w-full"
							/>
							{passwordError && <p className="text-xs sm:text-sm text-destructive">{passwordError}</p>}
							<p className="text-xs text-muted-foreground">
								Mínimo 8 caracteres e pelo menos 1 caractere especial
							</p>
						</div>
						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirmar Senha</Label>
							<PasswordInput 
								id="confirmPassword" 
								value={confirmPassword} 
								onChange={(e) => {
									setConfirmPassword(e.target.value)
									if (confirmPasswordError) setConfirmPasswordError(null)
								}} 
								required 
								aria-invalid={!!confirmPasswordError}
								autoComplete="new-password"
								className="w-full"
							/>
							{confirmPasswordError && <p className="text-xs sm:text-sm text-destructive">{confirmPasswordError}</p>}
						</div>
						{error && <p className="text-xs sm:text-sm text-destructive">{error}</p>}
						<Button className="w-full" type="submit" disabled={loading}>
							{loading ? 'Criando...' : 'Criar conta'}
						</Button>
					</form>
				</div>
			</div>
		</div>
	)
}

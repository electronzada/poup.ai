"use client"

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import Link from 'next/link'

export default function LoginPage() {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setLoading(true)
		const res = await signIn('credentials', { email, password, redirect: false })
		setLoading(false)
		if (res?.ok) {
			router.push('/')
		} else {
			setError('Credenciais inválidas')
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
								<linearGradient id="grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
									<stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25"/>
									<stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.9"/>
								</linearGradient>
							</defs>
							<rect x="2" y="2" width="44" height="44" rx="12" fill="url(#grad)"/>
							{/* large dollar sign */}
							<text x="24" y="24" textAnchor="middle" dominantBaseline="middle" fontSize="28" fontWeight="800" fill="white" fontFamily="Inter, ui-sans-serif, system-ui">$</text>
						</svg>
					</div>
					<h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Poup.ai</h1>
					<p className="text-sm sm:text-base text-muted-foreground mt-1">Acesse sua conta para continuar</p>
				</div>
				<div className="rounded-xl border bg-card p-4 sm:p-6 shadow-sm">
					<h2 className="text-lg sm:text-xl font-semibold mb-4">Entrar</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input 
								id="email" 
								type="email" 
								value={email} 
								onChange={(e) => setEmail(e.target.value)} 
								required 
								autoComplete="email"
								className="w-full"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Senha</Label>
							<PasswordInput 
								id="password" 
								value={password} 
								onChange={(e) => setPassword(e.target.value)} 
								required 
								autoComplete="current-password"
								className="w-full"
							/>
							<div className="flex justify-end mt-1">
								<Link 
									href="/forgot-password" 
									className="text-xs sm:text-sm text-primary hover:underline"
								>
									Esqueceu a senha?
								</Link>
							</div>
						</div>
						{error && <p className="text-sm text-destructive">{error}</p>}
						<Button className="w-full" type="submit" disabled={loading}>
							{loading ? 'Entrando...' : 'Entrar'}
						</Button>
					</form>
					<p className="mt-4 text-xs sm:text-sm text-muted-foreground text-center">
						Não tem uma conta?{' '}
						<Link className="text-primary hover:underline" href="/register">Crie sua conta</Link>
					</p>
				</div>
			</div>
		</div>
	)
}

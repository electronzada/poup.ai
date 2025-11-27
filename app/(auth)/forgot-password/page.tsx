"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState('')
	const [loading, setLoading] = useState(false)
	const [submitted, setSubmitted] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		// TODO: Implementar envio de email para redefinição de senha
		// Por enquanto, apenas simula o envio
		setTimeout(() => {
			setLoading(false)
			setSubmitted(true)
		}, 1000)
	}

	return (
		<div className="min-h-[70vh] flex items-center justify-center">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl">
						<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
							<defs>
								<linearGradient id="grad-forgot" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
									<stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25"/>
									<stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.9"/>
								</linearGradient>
							</defs>
							<rect x="2" y="2" width="44" height="44" rx="12" fill="url(#grad-forgot)"/>
							<text x="24" y="24" textAnchor="middle" dominantBaseline="middle" fontSize="28" fontWeight="800" fill="white" fontFamily="Inter, ui-sans-serif, system-ui">$</text>
						</svg>
					</div>
					<h1 className="text-3xl font-extrabold tracking-tight">Poup.ai</h1>
					<p className="text-muted-foreground mt-1">Redefinir senha</p>
				</div>
				<div className="rounded-xl border bg-card p-6 shadow-sm">
					<h2 className="text-xl font-semibold mb-4">Esqueceu sua senha?</h2>
					{submitted ? (
						<div className="space-y-4">
							<p className="text-sm text-muted-foreground">
								Se o email fornecido estiver cadastrado, você receberá um link para redefinir sua senha.
							</p>
							<Link href="/login">
								<Button className="w-full" variant="outline">
									Voltar para o login
								</Button>
							</Link>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input 
									id="email" 
									type="email" 
									value={email} 
									onChange={(e) => setEmail(e.target.value)} 
									required 
									placeholder="Digite seu email"
								/>
								<p className="text-xs text-muted-foreground">
									Enviaremos um link para redefinir sua senha no email cadastrado.
								</p>
							</div>
							<Button className="w-full" type="submit" disabled={loading}>
								{loading ? 'Enviando...' : 'Enviar link de redefinição'}
							</Button>
							<Link href="/login">
								<Button className="w-full" variant="outline" type="button">
									Voltar para o login
								</Button>
							</Link>
						</form>
					)}
				</div>
			</div>
		</div>
	)
}


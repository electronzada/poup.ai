const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function clearDatabase() {
	console.log('🧹 Limpando TODAS as coleções (mock/seed) ...\n')

	try {
		// Ordem importa por causa de relações
		console.log('🔄 Removendo transactions...')
		await prisma.transaction.deleteMany()

		console.log('🔄 Removendo budgets...')
		await prisma.budget.deleteMany()

		console.log('🔄 Removendo goals...')
		await prisma.goal.deleteMany()

		console.log('🔄 Removendo categories...')
		await prisma.category.deleteMany()

		console.log('🔄 Removendo accounts...')
		await prisma.account.deleteMany()

		console.log('\n✅ Limpeza concluída com sucesso!')
	} catch (error) {
		console.error('❌ Erro durante a limpeza:', error.message)
	} finally {
		await prisma.$disconnect()
		console.log('\n🔌 Conexão encerrada.')
	}
}

clearDatabase()

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedDatabase() {
  console.log('🌱 Iniciando seed do banco de dados...\n')
  
  try {
    // Limpar dados existentes (opcional)
    console.log('🔄 Limpando dados existentes...')
    await prisma.transaction.deleteMany()
    await prisma.budget.deleteMany()
    await prisma.goal.deleteMany()
    await prisma.category.deleteMany()
    await prisma.account.deleteMany()
    console.log('✅ Dados limpos!')
    
    // Criar contas
    console.log('\n🔄 Criando contas...')
    const accounts = await Promise.all([
      prisma.account.create({
        data: {
          name: 'Conta Corrente',
          type: 'checking',
          balance: 2500.00,
          currency: 'BRL',
          description: 'Conta principal para gastos do dia a dia'
        }
      }),
      prisma.account.create({
        data: {
          name: 'Conta Poupança',
          type: 'savings',
          balance: 15000.00,
          currency: 'BRL',
          description: 'Poupança para emergências e investimentos'
        }
      }),
      prisma.account.create({
        data: {
          name: 'Cartão de Crédito',
          type: 'credit',
          balance: -1200.00,
          currency: 'BRL',
          description: 'Cartão de crédito principal'
        }
      })
    ])
    console.log(`✅ ${accounts.length} contas criadas!`)
    
    // Criar categorias
    console.log('\n🔄 Criando categorias...')
    const categories = await Promise.all([
      // Receitas
      prisma.category.create({
        data: {
          name: 'Salário',
          type: 'income',
          color: '#16A34A',
          icon: 'dollar-sign',
          description: 'Salário e rendimentos fixos'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Freelance',
          type: 'income',
          color: '#16A34A',
          icon: 'laptop',
          description: 'Trabalhos freelancer'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Investimentos',
          type: 'income',
          color: '#16A34A',
          icon: 'trending-up',
          description: 'Rendimentos de investimentos'
        }
      }),
      
      // Despesas
      prisma.category.create({
        data: {
          name: 'Alimentação',
          type: 'expense',
          color: '#EF4444',
          icon: 'utensils',
          description: 'Gastos com comida e bebida'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Transporte',
          type: 'expense',
          color: '#EF4444',
          icon: 'car',
          description: 'Gasolina, transporte público, Uber'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Moradia',
          type: 'expense',
          color: '#EF4444',
          icon: 'home',
          description: 'Aluguel, condomínio, IPTU'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Saúde',
          type: 'expense',
          color: '#EF4444',
          icon: 'heart',
          description: 'Plano de saúde, medicamentos'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Educação',
          type: 'expense',
          color: '#EF4444',
          icon: 'book',
          description: 'Cursos, livros, educação'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Lazer',
          type: 'expense',
          color: '#EF4444',
          icon: 'gamepad2',
          description: 'Cinema, jogos, entretenimento'
        }
      }),
      
      // Transferências
      prisma.category.create({
        data: {
          name: 'Transferência',
          type: 'transfer',
          color: '#0EA5E9',
          icon: 'arrow-left-right',
          description: 'Transferências entre contas'
        }
      })
    ])
    console.log(`✅ ${categories.length} categorias criadas!`)
    
    // Criar transações
    console.log('\n🔄 Criando transações...')
    const transactions = await Promise.all([
      // Receitas
      prisma.transaction.create({
        data: {
          amount: 5000.00,
          type: 'income',
          description: 'Salário mensal',
          date: new Date('2024-01-01'),
          accountId: accounts[0].id,
          categoryId: categories[0].id
        }
      }),
      prisma.transaction.create({
        data: {
          amount: 1200.00,
          type: 'income',
          description: 'Projeto freelance',
          date: new Date('2024-01-15'),
          accountId: accounts[0].id,
          categoryId: categories[1].id
        }
      }),
      prisma.transaction.create({
        data: {
          amount: 300.00,
          type: 'income',
          description: 'Dividendos',
          date: new Date('2024-01-20'),
          accountId: accounts[1].id,
          categoryId: categories[2].id
        }
      }),
      
      // Despesas
      prisma.transaction.create({
        data: {
          amount: 800.00,
          type: 'expense',
          description: 'Supermercado',
          date: new Date('2024-01-05'),
          accountId: accounts[0].id,
          categoryId: categories[3].id
        }
      }),
      prisma.transaction.create({
        data: {
          amount: 200.00,
          type: 'expense',
          description: 'Gasolina',
          date: new Date('2024-01-10'),
          accountId: accounts[0].id,
          categoryId: categories[4].id
        }
      }),
      prisma.transaction.create({
        data: {
          amount: 1200.00,
          type: 'expense',
          description: 'Aluguel',
          date: new Date('2024-01-01'),
          accountId: accounts[0].id,
          categoryId: categories[5].id
        }
      }),
      prisma.transaction.create({
        data: {
          amount: 400.00,
          type: 'expense',
          description: 'Plano de saúde',
          date: new Date('2024-01-01'),
          accountId: accounts[0].id,
          categoryId: categories[6].id
        }
      }),
      prisma.transaction.create({
        data: {
          amount: 150.00,
          type: 'expense',
          description: 'Curso online',
          date: new Date('2024-01-12'),
          accountId: accounts[0].id,
          categoryId: categories[7].id
        }
      }),
      prisma.transaction.create({
        data: {
          amount: 80.00,
          type: 'expense',
          description: 'Cinema',
          date: new Date('2024-01-18'),
          accountId: accounts[0].id,
          categoryId: categories[8].id
        }
      }),
      
      // Transferências
      prisma.transaction.create({
        data: {
          amount: 1000.00,
          type: 'transfer',
          description: 'Transferência para poupança',
          date: new Date('2024-01-25'),
          accountId: accounts[0].id,
          categoryId: categories[9].id
        }
      })
    ])
    console.log(`✅ ${transactions.length} transações criadas!`)
    
    // Criar orçamentos
    console.log('\n🔄 Criando orçamentos...')
    const budgets = await Promise.all([
      prisma.budget.create({
        data: {
          name: 'Orçamento Alimentação',
          amount: 1000.00,
          spent: 800.00,
          period: 'monthly',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-31'),
          categoryId: categories[3].id
        }
      }),
      prisma.budget.create({
        data: {
          name: 'Orçamento Transporte',
          amount: 300.00,
          spent: 200.00,
          period: 'monthly',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-31'),
          categoryId: categories[4].id
        }
      })
    ])
    console.log(`✅ ${budgets.length} orçamentos criados!`)
    
    // Criar metas
    console.log('\n🔄 Criando metas...')
    const goals = await Promise.all([
      prisma.goal.create({
        data: {
          name: 'Viagem para Europa',
          targetAmount: 15000.00,
          currentAmount: 8500.00,
          targetDate: new Date('2024-12-31'),
          description: 'Economizar para viagem de férias'
        }
      }),
      prisma.goal.create({
        data: {
          name: 'Reserva de Emergência',
          targetAmount: 20000.00,
          currentAmount: 15000.00,
          targetDate: new Date('2024-06-30'),
          description: 'Fundo de emergência equivalente a 6 meses de gastos'
        }
      })
    ])
    console.log(`✅ ${goals.length} metas criadas!`)
    
    console.log('\n🎉 Seed do banco de dados concluído com sucesso!')
    console.log('\n📊 Resumo dos dados criados:')
    console.log(`   - Contas: ${accounts.length}`)
    console.log(`   - Categorias: ${categories.length}`)
    console.log(`   - Transações: ${transactions.length}`)
    console.log(`   - Orçamentos: ${budgets.length}`)
    console.log(`   - Metas: ${goals.length}`)
    
    console.log('\n🌐 Acesse o dashboard em: http://localhost:3001')
    console.log('🔧 Abra o Prisma Studio: npx prisma studio')
    
  } catch (error) {
    console.error('❌ Erro durante o seed:', error.message)
  } finally {
    await prisma.$disconnect()
    console.log('\n🔌 Conexão encerrada.')
  }
}

// Executar seed
seedDatabase()

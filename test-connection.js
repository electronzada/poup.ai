const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  console.log('🔄 Testando conexão com MongoDB...\n')
  
  try {
    // Testar conexão
    await prisma.$connect()
    console.log('✅ Conexão com MongoDB estabelecida!')
    
    // Testar criação de uma conta
    console.log('\n🔄 Criando conta de teste...')
    const account = await prisma.account.create({
      data: {
        name: 'Conta Corrente - Teste',
        type: 'checking',
        balance: 1500.00,
        currency: 'BRL',
        description: 'Conta criada para teste de conexão'
      }
    })
    console.log('✅ Conta criada:', {
      id: account.id,
      name: account.name,
      balance: account.balance
    })
    
    // Testar criação de uma categoria
    console.log('\n🔄 Criando categoria de teste...')
    const category = await prisma.category.create({
      data: {
        name: 'Alimentação',
        type: 'expense',
        color: '#EF4444',
        icon: 'utensils',
        description: 'Gastos com alimentação'
      }
    })
    console.log('✅ Categoria criada:', {
      id: category.id,
      name: category.name,
      type: category.type
    })
    
    // Testar criação de uma transação
    console.log('\n🔄 Criando transação de teste...')
    const transaction = await prisma.transaction.create({
      data: {
        amount: 50.00,
        type: 'expense',
        description: 'Almoço no restaurante',
        date: new Date(),
        accountId: account.id,
        categoryId: category.id
      }
    })
    console.log('✅ Transação criada:', {
      id: transaction.id,
      amount: transaction.amount,
      description: transaction.description
    })
    
    // Listar contas
    console.log('\n🔄 Listando contas...')
    const accounts = await prisma.account.findMany()
    console.log(`✅ ${accounts.length} conta(s) encontrada(s):`)
    accounts.forEach(acc => {
      console.log(`   - ${acc.name}: R$ ${acc.balance.toFixed(2)}`)
    })
    
    // Listar categorias
    console.log('\n🔄 Listando categorias...')
    const categories = await prisma.category.findMany()
    console.log(`✅ ${categories.length} categoria(s) encontrada(s):`)
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.type})`)
    })
    
    // Listar transações
    console.log('\n🔄 Listando transações...')
    const transactions = await prisma.transaction.findMany({
      include: {
        account: { select: { name: true } },
        category: { select: { name: true } }
      }
    })
    console.log(`✅ ${transactions.length} transação(ões) encontrada(s):`)
    transactions.forEach(trans => {
      console.log(`   - ${trans.description}: R$ ${trans.amount.toFixed(2)} (${trans.account.name} → ${trans.category.name})`)
    })
    
    console.log('\n🎉 Teste de conexão concluído com sucesso!')
    console.log('\n📊 Resumo:')
    console.log(`   - Contas: ${accounts.length}`)
    console.log(`   - Categorias: ${categories.length}`)
    console.log(`   - Transações: ${transactions.length}`)
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message)
    
    if (error.code === 'P1001') {
      console.log('\n💡 Dica: Verifique se:')
      console.log('   - O arquivo .env.local está configurado')
      console.log('   - A string de conexão está correta')
      console.log('   - O cluster MongoDB está ativo')
      console.log('   - Seu IP está na whitelist')
    }
    
    if (error.code === 'P1017') {
      console.log('\n💡 Dica: Verifique se:')
      console.log('   - O usuário e senha estão corretos')
      console.log('   - O usuário tem permissões de leitura/escrita')
    }
    
  } finally {
    await prisma.$disconnect()
    console.log('\n🔌 Conexão encerrada.')
  }
}

// Executar teste
testConnection()

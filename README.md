# 💰 Financial Dashboard

Um dashboard financeiro completo construído com Next.js, TypeScript, Tailwind CSS e MongoDB.

## 🚀 Funcionalidades

- **Dashboard Principal**: Visão geral das finanças com KPIs e gráficos
- **Gestão de Transações**: Criar, editar e excluir lançamentos financeiros
- **Categorias**: Organize suas receitas e despesas por categorias
- **Contas**: Gerencie múltiplas contas bancárias
- **Relatórios**: Visualize gráficos de receitas, despesas e saldo
- **Design Responsivo**: Interface moderna e adaptável

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: MongoDB com Prisma ORM
- **UI Components**: shadcn/ui
- **Ícones**: Lucide React
- **Gráficos**: Recharts

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- MongoDB (local ou Atlas)

## 🔧 Instalação

1. **Clone o repositório**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd financial-dashboard
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   
   Crie um arquivo `.env` na raiz do projeto:
   ```env
   DATABASE_URL="sua_string_de_conexao_mongodb"
   NEXTAUTH_SECRET="sua-chave-secreta-aqui"
   ```

4. **Configure o banco de dados**
   ```bash
   # Sincronize o schema com o MongoDB
   npx prisma db push
   
   # Popule o banco com dados de exemplo
   npm run db:seed
   ```

5. **Execute o projeto**
   ```bash
   npm run dev
   ```

6. **Acesse a aplicação**
   
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📊 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run db:seed` - Popula o banco com dados de exemplo
- `npm run db:studio` - Abre o Prisma Studio

## 🗄️ Estrutura do Banco de Dados

### Modelos Principais

- **Account**: Contas bancárias
- **Category**: Categorias de receitas/despesas
- **Transaction**: Transações financeiras
- **Budget**: Orçamentos por categoria
- **Goal**: Metas financeiras

## 🎨 Design System

O projeto utiliza um sistema de design "Clean & Trust" com:

- **Cores Semânticas**: Verde para receitas, vermelho para despesas
- **Tipografia**: Inter como fonte principal
- **Componentes**: shadcn/ui para consistência
- **Ícones**: Lucide React para padronização

## 🔐 Configuração do MongoDB

### MongoDB Atlas (Recomendado)

1. Crie uma conta no [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crie um novo cluster
3. Configure o acesso de rede (0.0.0.0/0 para desenvolvimento)
4. Crie um usuário de banco de dados
5. Copie a string de conexão para o arquivo `.env`

### MongoDB Local

1. Instale o MongoDB localmente
2. Inicie o serviço MongoDB
3. Use a string: `mongodb://localhost:27017/financial-dashboard`

## 📱 Funcionalidades por Página

### Dashboard (`/`)
- KPIs principais (receitas, despesas, saldo)
- Gráficos de fluxo financeiro
- Filtros por período

### Lançamentos (`/lancamentos`)
- Lista de todas as transações
- Criar nova transação
- Editar/excluir transações
- Filtros por conta e categoria

### Categorias (`/categorias`)
- Gerenciar categorias de receitas/despesas
- Criar/editar/excluir categorias
- Visualizar gastos por categoria

### Contas (`/contas`)
- Gerenciar contas bancárias
- Visualizar saldos
- Criar/editar contas

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas

- **Netlify**: Configure build command e publish directory
- **Railway**: Conecte o repositório e configure as env vars
- **DigitalOcean**: Use App Platform

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique se todas as dependências estão instaladas
2. Confirme se o MongoDB está rodando
3. Verifique as variáveis de ambiente
4. Abra uma issue no repositório

---

**Desenvolvido com ❤️ usando Next.js e MongoDB**

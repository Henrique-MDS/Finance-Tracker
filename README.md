# 💰 Finance Tracker

Aplicação web completa para **gerenciamento financeiro pessoal**, desenvolvida com foco em organização de receitas e despesas, acompanhamento do saldo, análise financeira por meio de gráficos e geração de relatórios.

O projeto foi construído como uma aplicação **full stack**, utilizando React e TypeScript no frontend e Supabase/PostgreSQL como backend e banco de dados. Durante o desenvolvimento, foram aplicados conceitos de **autenticação, autorização, modelagem de banco de dados, operações CRUD, funções SQL, validação de dados, gerenciamento de estado, visualização de dados, segurança e deploy em produção**.

## 🚀 Funcionalidades

* 🔐 Autenticação e gerenciamento de usuários
* 🔑 Autenticação multifator (MFA/TOTP)
* 💰 Cadastro, edição e exclusão de receitas e despesas
* 🏷️ Gerenciamento de categorias
* 📊 Dashboard financeiro
* 📈 Gráficos para análise de receitas, despesas e saldo
* 📅 Filtros por período
* 💵 Cálculo e acompanhamento de saldo
* 🎯 Gerenciamento de metas financeiras
* 🔄 Transações recorrentes
* ⚙️ Geração automática de transações recorrentes
* 📋 Relatórios financeiros
* 📥 Exportação de dados/relatórios
* 👤 Perfil do usuário
* 🖼️ Upload e gerenciamento de avatar
* 📱 Interface responsiva
* ✅ Validação de formulários
* 🔒 Controle de acesso aos dados por usuário

## 🛠️ Tecnologias

### Frontend

* **React**
* **TypeScript**
* **Vite**
* **React Router**
* **Tailwind CSS**
* **Shadcn/UI**
* **Radix UI**
* **Lucide React**
* **Recharts**
* **date-fns**

### Backend e Banco de Dados

* **Supabase**
* **PostgreSQL**
* **Supabase Auth**
* **Supabase Storage**
* **PostgreSQL Functions / RPC**
* **PL/pgSQL**
* **Row Level Security (RLS)**

### Bibliotecas e ferramentas

* **React Query**
* **jsPDF**
* **Vitest**
* **React Testing Library**
* **ESLint**
* **Git / GitHub**
* **Vercel**

## 🧠 Conceitos e habilidades aplicados

### Frontend

O desenvolvimento envolveu a construção de uma interface utilizando **React com TypeScript**, trabalhando com:

* Componentização
* Hooks (`useState`, `useEffect`, etc.)
* Props e interfaces TypeScript
* Componentes reutilizáveis
* Formulários controlados
* Validação de dados
* Renderização condicional
* Gerenciamento de estado
* Rotas protegidas
* Manipulação de datas
* Responsividade
* Design de interfaces
* Acessibilidade
* Feedback visual para operações
* Tratamento de estados de carregamento e erro

### TypeScript

O projeto utiliza TypeScript para aumentar a segurança e previsibilidade do código através de:

* Tipagem de componentes
* Interfaces e tipos personalizados
* Tipagem de estados
* Tipagem de respostas da API
* Tipagem de funções
* Tratamento de valores opcionais e nulos
* Validação e conversão de dados
* Uso de tipos fornecidos pelo Supabase

### Banco de dados

A aplicação utiliza PostgreSQL através do Supabase, exigindo conhecimentos de:

* Modelagem relacional
* Criação de tabelas
* Chaves primárias e estrangeiras
* Relacionamentos entre entidades
* Constraints
* Tipos de dados
* Índices
* Queries SQL
* `JOIN`
* `GROUP BY`
* Agregações
* Subqueries
* `INSERT`, `UPDATE`, `DELETE` e `SELECT`
* Funções PostgreSQL
* PL/pgSQL
* Procedures e RPCs
* Tratamento de valores `NULL`
* Integridade referencial

### Segurança

Foram aplicados conceitos de segurança para garantir que os usuários tenham acesso somente aos seus próprios dados:

* Supabase Auth
* Autenticação baseada em sessão
* Rotas protegidas
* MFA utilizando TOTP
* Row Level Security (RLS)
* Políticas de acesso no PostgreSQL
* Associação dos registros ao usuário autenticado
* Controle de permissões
* Validação de dados no frontend e backend

### Supabase

O Supabase foi utilizado como infraestrutura principal do backend, envolvendo:

* Supabase Authentication
* Gerenciamento de sessões
* MFA/TOTP
* PostgreSQL
* RPCs
* Storage
* Row Level Security
* Queries através do Supabase Client
* Integração entre frontend e banco de dados

### Visualização de dados

Para transformar os dados financeiros em informações úteis, foram utilizados conceitos de:

* Agregação de dados
* Processamento de séries temporais
* Agrupamento por período
* Cálculo de receitas e despesas
* Cálculo de saldo
* Gráficos de barras
* Gráficos de pizza
* Indicadores financeiros
* Filtros por data

A biblioteca **Recharts** foi utilizada para construir os componentes de visualização.

### Transações recorrentes

Um dos recursos mais complexos da aplicação é o gerenciamento de **transações recorrentes**, envolvendo:

* Definição de frequência
* Validação de datas
* Controle de dia de execução
* Frequências diária, semanal, mensal e anual
* Determinação da próxima execução
* Validação de período inicial e final
* Geração automática de transações
* Prevenção de execuções duplicadas
* Integração entre regras de negócio e banco de dados

### Relatórios

O sistema também possui recursos para análise e exportação de informações financeiras, envolvendo:

* Consultas SQL específicas para relatórios
* Processamento dos dados
* Filtragem por período
* Agrupamento de informações
* Geração de gráficos
* Exportação para PDF
* Captura de elementos da interface com `html2canvas`
* Geração de documentos com `jsPDF`

## 🏗️ Arquitetura

A aplicação segue uma arquitetura baseada em separação de responsabilidades:

```text
Frontend
│
├── React
├── TypeScript
├── React Router
├── Tailwind CSS
├── Shadcn/UI
│
├── Components
├── Pages
├── Hooks
├── Utils
└── Services
        │
        ▼
    Supabase Client
        │
        ├── Authentication
        ├── Storage
        │
        ▼
    PostgreSQL
        │
        ├── Tables
        ├── Relationships
        ├── RLS Policies
        └── Functions / RPC
```

Essa estrutura permite separar a **interface**, **regras de negócio**, **acesso aos dados** e **camada de persistência**.

## 📚 Principais conhecimentos desenvolvidos

O desenvolvimento deste projeto envolveu conhecimentos práticos em:

* Desenvolvimento Frontend moderno
* Desenvolvimento Full Stack
* React
* TypeScript
* PostgreSQL
* SQL
* PL/pgSQL
* Supabase
* Autenticação
* MFA/TOTP
* Segurança de aplicações web
* RLS
* APIs
* CRUD
* Modelagem de dados
* Componentização
* Gerenciamento de estado
* Formulários e validações
* Manipulação de datas
* Visualização de dados
* Geração de relatórios
* Exportação de arquivos
* Testes automatizados
* Git e GitHub
* Deploy
* Vercel
* Debugging e resolução de problemas

## 🎯 Objetivo do projeto

O Finance Tracker foi desenvolvido não apenas como uma aplicação de controle financeiro, mas também como um projeto prático para consolidar conhecimentos de **desenvolvimento web moderno, arquitetura de aplicações, banco de dados, segurança e engenharia de software**.

O projeto permitiu trabalhar desde a construção da interface e experiência do usuário até a implementação das regras de negócio, persistência dos dados, autenticação, segurança e disponibilização da aplicação em produção.

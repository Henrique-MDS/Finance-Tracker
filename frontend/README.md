# Finance Tracker — Frontend

Frontend do **Finance Tracker**, uma aplicação de gerenciamento financeiro pessoal construída com **React**, **TypeScript** e **Vite**, utilizando **Supabase** (Auth, Storage e PostgreSQL) como backend.

Para uma visão geral completa do projeto (funcionalidades, arquitetura, conceitos aplicados), veja o [README principal](../README.md).

## 🛠️ Stack

* React 19 + TypeScript
* Vite
* React Router DOM
* Tailwind CSS + Shadcn/UI (Radix UI, `cmdk`, `vaul`)
* Recharts (gráficos)
* Supabase JS (`@supabase/supabase-js`)
* jsPDF + html2canvas + react-to-print (exportação de relatórios em PDF)
* date-fns (manipulação de datas)
* react-hot-toast (notificações)

## ⚙️ Configuração

### Pré-requisitos

* Node.js
* Um projeto Supabase (URL e chave publicável)

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do frontend com:

```env
VITE_SUPABASE_URL=<url-do-projeto-supabase>
VITE_SUPABASE_PUBLISHABLE_KEY=<chave-publicavel-do-supabase>
```

### Instalação e execução

```bash
npm install
npm run dev
```

### Scripts disponíveis

| Script            | Descrição                                  |
| ------------------ | ------------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento (Vite) |
| `npm run build`   | Type-check (`tsc -b`) e build de produção   |
| `npm run lint`    | Executa o ESLint                            |
| `npm run preview` | Serve o build de produção localmente        |

## 📁 Estrutura do projeto

```text
src/
├── App.tsx            # Layout raiz (rotas filhas + navbar)
├── routes.tsx          # Definição das rotas (React Router)
├── components/         # Componentes e páginas, organizados por domínio
│   ├── Login_Register/ # Login, cadastro
│   ├── Transactions/    # Transações
│   ├── Categories/      # Categorias
│   ├── Recurrent/       # Transações recorrentes
│   ├── Goals/           # Metas financeiras
│   ├── Reports/         # Relatórios e exportação em PDF
│   ├── Settings/        # Configurações e MFA
│   ├── Graphs/          # Gráficos (Recharts)
│   ├── ResumeCards/     # Cards de resumo (dashboard)
│   └── ui/              # Componentes gerados pelo Shadcn/UI
├── Utils/               # Funções utilitárias (acesso a dados via Supabase, formatação, validação, auth)
├── hooks/               # Hooks customizados
├── services/            # Cliente do Supabase (services/supabase.ts)
├── types/               # Tipos TypeScript compartilhados
├── postgresql/          # Referência do schema do banco (não executado pelo app)
│   ├── Table_schema/    # Definições das tabelas
│   ├── Funcoes/          # Funções/RPCs em PL/pgSQL
│   ├── Triggers/         # Triggers
│   ├── Policies/         # Políticas de Row Level Security
│   ├── cron/             # Agendamento (pg_cron) das transações recorrentes
│   └── type/             # Tipos customizados do PostgreSQL
└── documentation/       # Anotações internas sobre componentes e utilitários
```

## 🧭 Rotas

| Rota           | Página                       | Protegida |
| -------------- | ----------------------------- | :-------: |
| `/`            | Dashboard (`components/home`) | ✅ |
| `/Transactions`| Transações                    | ✅ |
| `/Categories`  | Categorias                    | ✅ |
| `/Recurrent`   | Transações recorrentes        | ✅ |
| `/Reports`     | Relatórios                    | ✅ |
| `/Goals`       | Metas financeiras             | ✅ |
| `/Settings`    | Configurações                 | ✅ |
| `/Login`       | Login                         | — |
| `/Register`    | Cadastro                      | — |
| `/mfa`         | Verificação MFA               | — |
| `*`            | 404                            | — |

Rotas protegidas usam o componente `Utils/protectedRoute.tsx`, que valida a sessão via `AuthContext`.

## 🗄️ Banco de dados

O schema do PostgreSQL (tabelas, funções, triggers, policies de RLS e o job de `pg_cron` que processa as transações recorrentes diariamente) é mantido, para referência, em [`src/postgresql`](src/postgresql). Esses arquivos documentam a estrutura provisionada no projeto Supabase — eles não são executados automaticamente pela aplicação; qualquer alteração precisa ser aplicada manualmente no editor SQL do Supabase.

## 🚀 Deploy

O projeto está configurado para deploy na **Vercel**. O arquivo [`vercel.json`](vercel.json) reescreve todas as rotas para `index.html`, necessário para o roteamento client-side do React Router funcionar corretamente em uma SPA.

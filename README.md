# MetroAcesso — Frontend

Painel de controle web do sistema **MetroAcesso**, desenvolvido como trabalho de conclusão de curso. A aplicação permite o gerenciamento de usuários PCD (Pessoas com Deficiência), agentes de atendimento, estações de metrô e tags RFID, além de oferecer dashboards específicos por perfil de acesso.

O repositório do backend está disponível em: [github.com/SENAI-Anchieta-DEV/bgjkr-metro-acesso-backend](https://github.com/SENAI-Anchieta-DEV/bgjkr-metro-acesso-backend)

---

## Tecnologias

- **React 19** com Vite 8
- **React Router DOM 7** — roteamento declarativo com rotas protegidas por papel
- **Axios** — cliente HTTP com interceptadores de autenticação JWT
- **Firebase Hosting** — deploy da aplicação

---

## Pré-requisitos

- Node.js 18 ou superior
- npm 9 ou superior
- Backend do MetroAcesso em execução (ver repositório acima)

---

## Instalação e execução

```bash
# Clone o repositório
git clone https://github.com/SENAI-Anchieta-DEV/bgjkr-metro-acesso-frontend.git
cd bgjkr-metro-acesso-frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente (ver seção abaixo)
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
VITE_API_BASE_URL=http://localhost:8080
```

| Variável | Descrição |
|---|---|
| `VITE_API_BASE_URL` | URL base da API do backend |

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção na pasta `dist/` |
| `npm run preview` | Pré-visualiza o build de produção localmente |
| `npm run lint` | Executa o ESLint no código-fonte |

---

## Estrutura do projeto

```
src/
├── app/
│   ├── providers/       # Provedores globais (AuthProvider)
│   ├── router/          # Configuração de rotas e ProtectedRoute
│   └── shell/           # Layouts: DashboardLayout e LandingPage
├── core/
│   ├── api/             # httpClient (Axios) com interceptadores JWT
│   ├── config/          # Leitura de variáveis de ambiente
│   ├── hooks/           # Hooks utilitários (useFetch, useAsync)
│   └── utils/           # Helpers de erro
└── features/
    ├── auth/            # Contexto, hook useAuth e serviço de login/logout
    ├── estacoes/        # Gestão de estações (listagem, cadastro, edição)
    ├── sensores/        # Monitoramento de acessos e alertas em tempo real
    ├── tags/            # Gestão de tags RFID
    ├── usuarios/        # Dashboards e formulários para PCD, Agente e Admin
    └── validacoes/      # Fila de validação de formulários PCD pendentes
```

---

## Perfis de acesso

O sistema possui três papéis com experiências distintas, controlados por rotas protegidas:

| Papel | Acesso |
|---|---|
| `ADMINISTRADOR` | Gestão completa: usuários, estações, tags RFID e validações de cadastro |
| `AGENTE_ATENDIMENTO` | Dashboard de monitoramento da estação, alertas de PCDs e atendimentos |
| `USUARIO_PCD` | Visualização do próprio cartão de acesso, tag RFID vinculada e perfil |

O redirecionamento pós-login é feito automaticamente com base no papel do usuário autenticado.

---

## Autenticação

A autenticação é baseada em **JWT**. O token é armazenado no `localStorage` sob a chave `@MetroAcesso:token` e injetado automaticamente em todas as requisições pelo interceptador do Axios. Em caso de resposta `401` ou `403` fora das telas públicas, a sessão é encerrada e o usuário é redirecionado para `/login`.

---

## Deploy

O projeto está configurado para deploy no **Firebase Hosting**. Todas as rotas são reescritas para `index.html`, garantindo o funcionamento do roteamento client-side.

```bash
# Gerar build de produção
npm run build

# Fazer deploy (requer Firebase CLI instalado e autenticado)
firebase deploy
```

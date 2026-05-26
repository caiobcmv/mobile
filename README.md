# 🎓 Portal de Atividades Complementares (SENAC)

Este repositório contém a solução completa para o gerenciamento de atividades complementares acadêmicas das Faculdades SENAC. O sistema permite que alunos enviem comprovantes pelo celular, coordenadores analisem submissões e administradores configurem cursos e limites de horas.

---

## 📂 Estrutura do Repositório

O projeto é dividido em dois módulos principais:

```text
mobile/ (Raiz do repositório)
├── sistema-horas-complementares/   → Backend (Node.js/Express) + Painel Web Admin (HTML/CSS/JS)
│   ├── src/                        → Código-fonte da API Express
│   ├── frontend/                   → Dashboard Web para Administradores e Coordenadores
│   ├── schema.sql                  → Estrutura do banco de dados PostgreSQL
│   └── data_insert.sql             → Script para popular banco com dados de teste
│
└── aaa/
    └── Sistema-de-horas-mobile/    → Cliente Mobile (React Native + Expo SDK 54 + TypeScript)
```

---

## 🌐 Endereços e Acessos em Produção (Web)

O sistema está 100% configurado e hospedado na nuvem:

*   **API & Painel Administrativo Web (Render):**
    👉 [https://sistema-horas-api.onrender.com/pages/index.html](https://sistema-horas-api.onrender.com/pages/index.html)
*   **Banco de Dados (Neon PostgreSQL):** Hospedado de forma segura na nuvem Neon e conectado ao servidor.
*   **Aplicativo Mobile (Vercel):** Hospedado como uma aplicação web (PWA) no painel da Vercel.

### 🔑 Conta Administrativa de Teste:
*   **E-mail:** `admin@senac.com`
*   **Senha:** `123456`
*   **Perfil:** SUPER ADM

---

## 🚀 Como Rodar Localmente

### 1. Backend e Painel Web Admin
Entre na pasta correspondente, configure o arquivo `.env` e inicie o servidor:
```bash
cd sistema-horas-complementares
npm install
npm run dev
```
O backend rodará em `http://localhost:3001` e a interface administrativa local estará disponível em `http://localhost:3001/pages/index.html`.

### 2. Aplicativo Mobile (Expo)
Entre na pasta do aplicativo mobile, instale as dependências e inicie o Metro Bundler:
```bash
cd aaa/Sistema-de-horas-mobile
npm install
npm start
```
Escaneie o QR Code gerado utilizando o aplicativo **Expo Go** no seu celular para testar.

---

## 🛠️ Detalhes da Configuração de Deploy

### Banco de Dados (Neon.tech)
O banco foi configurado importando a estrutura do arquivo `schema.sql` e, posteriormente, populado com dados iniciais através do `data_insert.sql`. As conexões utilizam o protocolo seguro SSL habilitado automaticamente em produção.

### Servidor (Render.com)
Hospedado conectando este repositório do GitHub com as seguintes definições:
*   **Root Directory:** `sistema-horas-complementares`
*   **Build Command:** `npm install`
*   **Start Command:** `node src/server.js`
*   **Variaveis de ambiente:** `DATABASE_URL` (conexão do Neon) e `JWT_SECRET` (token de segurança).

### Aplicativo Mobile na Web (Vercel)
Configurado a partir do Expo Web para rodar direto no navegador:
*   **Root Directory:** `aaa/Sistema-de-horas-mobile`
*   **Build Command:** `npx expo export --platform web`
*   **Output Directory:** `dist`

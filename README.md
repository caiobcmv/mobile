# 📚 Sistema de Horas Complementares — SENAC

Sistema web para gestão de atividades complementares dos alunos do SENAC, com painéis para **Aluno**, **Coordenador** e **Super Admin**.

---

## 🗂️ Estrutura do Projeto

```
/
├── backend/                  # API Node.js + Express
├── frontend/                 # Páginas HTML/CSS/JS
└── Sistema-de-horas-mobile/  # Aplicativo Mobile React Native + Expo
```

---

## ⚙️ Pré-requisitos

| Ferramenta | Versão mínima |
|---|---|
| [Node.js](https://nodejs.org) | v18+ |
| [PostgreSQL](https://www.postgresql.org/) | v14+ |
| pgAdmin (opcional, recomendado) | qualquer |

---

## 🗄️ Configuração do Banco de Dados

### 1. Crie o banco no PostgreSQL

```sql
CREATE DATABASE atividades_complementares_senac;
```

### 2. Execute os scripts SQL na ordem

Abra o pgAdmin (ou `psql`) e execute os arquivos da pasta `backend/`:

```
1. schema.sql       → Cria todas as tabelas
2. data_insert.sql  → Insere dados iniciais (cursos, categorias, usuários)
```

> ⚠️ O `data_insert.sql` já possui usuários com senha `123456` (em bcrypt). Não é necessário gerar hashes manualmente.

---

## 🚀 Executando o Backend

### 1. Instale as dependências

```bash
cd backend
npm install
```

### 2. Configure as variáveis de ambiente

O arquivo `.env` já está configurado. Verifique se as credenciais do PostgreSQL estão corretas:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=atividades_complementares_senac
DB_USER=postgres
DB_PASSWORD=123456
JWT_SECRET=minha_chave_secreta_super_longa_123456
```

### 3. Inicie o servidor

```bash
npm start        # Produção
npm run dev      # Desenvolvimento (reinicia automaticamente com nodemon)
```

> Servidor disponível em: **http://localhost:3001**

---

## 🌐 Acessando o Sistema

Após iniciar o backend, abra no navegador:

```
http://localhost:3001/pages/index.html
```

---

## 👥 Usuários de Teste

| Perfil | E-mail | Senha |
|---|---|---|
| **Aluno** | `ana@aluno.senac.com` | `123456` |
| **Coordenador** | `ricardo@senac.com` | `123456` |
| **Super Admin** | `admin@senac.com` | `123456` |
| **Coord. Teste** *(primeiro acesso)* | `coord.teste@senac.com` | `123456` |

---

## 🔐 Testando a Tela de Primeiro Acesso

O sistema exibe uma tela de redefinição de senha quando o usuário entra pela **primeira vez**.

### Para testar:

```bash
cd backend
npm run reset-teste
```

Depois faça login com:
- **E-mail:** `coord.teste@senac.com`
- **Senha:** `123456`

A tela de **Primeiro Acesso** será exibida automaticamente. Após definir a nova senha, o usuário é redirecionado ao dashboard.

> ▶️ Rode `npm run reset-teste` quantas vezes quiser para repetir o teste.

---

## 📋 Scripts Disponíveis (pasta `backend/`)

| Comando | Descrição |
|---|---|
| `npm start` | Inicia o servidor em modo produção |
| `npm run dev` | Inicia com hot-reload via nodemon |
| `npm run reset-teste` | Cria/reseta o coordenador de teste para primeiro acesso |

---

## 🔒 Perfis e Acessos

| Perfil | Acesso |
|---|---|
| **Aluno** | Submete atividades, acompanha horas, baixa certificados |
| **Coordenador** | Analisa submissões, gerencia alunos e regras de horas |
| **Super Admin** | Gerencia cursos, coordenadores e configurações globais |

---

## 🛠️ Tecnologias

- **Backend:** Node.js, Express, PostgreSQL, JWT, bcryptjs, Multer
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Banco:** PostgreSQL 14+

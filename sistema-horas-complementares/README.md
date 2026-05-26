# Sistema de Gestão de Atividades Complementares

Sistema web para digitalizar e automatizar o processo de gestão de atividades complementares do SENAC, eliminando planilhas manuais e e-mails descentralizados.

---

## Sobre o Projeto

As Instituições de Ensino Superior exigem o cumprimento de atividades complementares para integralização curricular. Atualmente, esse processo é predominantemente manual e descentralizado, envolvendo planilhas, documentos físicos e trocas de e-mail entre alunos e coordenadores.

Essa solução digitaliza todo o processo, oferecendo:
- Submissão e acompanhamento de atividades pelos alunos
- Validação e análise de certificados pelos coordenadores
- Gestão completa de cursos e usuários pelo Super Admin
- Dashboard com métricas em tempo real

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Backend | Node.js + Express |
| Banco de Dados | PostgreSQL |
| Autenticação | JWT (JSON Web Token) |
| Upload de Arquivos | Multer |
| E-mails | Nodemailer |
| Frontend | HTML + CSS + JavaScript |

---

## Estrutura do Projeto

```
sistema-horas-complementares/
├── src/
│   ├── config/
│   │   └── database.js         → Conexão com PostgreSQL
│   ├── controllers/
│   │   ├── authController.js   → Login e setup
│   │   ├── adminController.js  → Funções do Super Admin
│   │   └── coordenadorController.js → Funções do Coordenador
│   ├── middleware/
│   │   └── auth.js             → Autenticação JWT
│   └── routes/
│       ├── authRoutes.js       → Rotas de autenticação
│       ├── admin.js            → Rotas do Super Admin
│       ├── coordenador.js      → Rotas do Coordenador
│       └── aluno.js            → Rotas do Aluno
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── uploads/                    → Arquivos enviados
├── .env.example
├── package.json
└── README.md
```

---

## Perfis de Usuário

| Perfil | Permissões |
|--------|-----------|
| **Super Admin** | Cadastrar cursos, coordenadores e configurar o sistema |
| **Coordenador** | Gerenciar alunos, validar e reprovar submissões |
| **Aluno** | Submeter atividades e acompanhar o status *(Entrega 2)* |

---

## Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+

### 1. Clonar o repositório
```bash
git clone https://github.com/LorenaLira05/sistema-horas-complementares.git
cd sistema-horas-complementares
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
```
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=atividades_complementares
DB_USER=postgres
DB_PASSWORD=sua_senha
JWT_SECRET=sua_chave_secreta
```

### 4. Criar o banco de dados
Rode o script `schema.sql` no seu banco de dados local. Você também pode rodar `data_insert.sql` para popular com os dados de teste locais.

### 5. Iniciar o servidor
```bash
npm run dev
```

Acesse: **http://localhost:3001**

---

## Hospedagem na Web (Deploy)

O projeto está configurado para deploy em produção utilizando serviços gratuitos:

### 1. Banco de Dados (PostgreSQL) — Neon.tech
1. Crie uma conta no **[Neon.tech](https://neon.tech/)** e um projeto.
2. Copie a URL de conexão (`postgresql://...`).
3. No painel do Neon, abra o **SQL Editor**, cole o conteúdo de `schema.sql` e execute para criar as tabelas.
4. Para popular com dados de teste locais, cole e execute o conteúdo de `data_insert.sql`.

### 2. Backend + Frontend (Express) — Render.com
1. Crie uma conta no **[Render.com](https://render.com/)** e conecte seu GitHub.
2. Crie um novo **Web Service** conectado ao seu repositório.
3. Configure os campos:
   - **Root Directory**: `sistema-horas-complementares`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
4. Em **Advanced**, adicione as variáveis de ambiente:
   - `DATABASE_URL` = *(A URL do Neon)*
   - `JWT_SECRET` = *(Sua chave secreta para tokens JWT)*
5. Conclua o deploy. O Render servirá a API e o painel web admin (na URL gerada `/pages/index.html`).

### 3. Aplicativo Mobile (Expo)
1. Atualize o arquivo `aaa/Sistema-de-horas-mobile/src/constants/index.ts` alterando `API_BASE_URL` para a URL gerada pelo Render.

---

## Rotas da API

### Autenticação
| Método | Rota | Descrição | Perfil |
|--------|------|-----------|--------|
| POST | `/auth/login` | Login | Público |
| POST | `/auth/setup` | Criar Super Admin | Público (1x) |

### Admin
| Método | Rota | Descrição | Perfil |
|--------|------|-----------|--------|
| GET | `/admin/cursos` | Listar cursos | Super Admin |
| POST | `/admin/curso` | Criar curso | Super Admin |
| GET | `/admin/coordenadores` | Listar coordenadores | Super Admin |
| POST | `/admin/coordenador` | Cadastrar coordenador | Super Admin |

### Coordenador
| Método | Rota | Descrição | Perfil |
|--------|------|-----------|--------|
| POST | `/coordenador/aluno` | Cadastrar aluno | Coordenador |
| GET | `/coordenador/alunos/:curso_id` | Listar alunos | Coordenador |
| GET | `/coordenador/submissoes/:curso_id` | Ver submissões pendentes | Coordenador |
| PATCH | `/coordenador/validar/:id` | Aprovar ou reprovar | Coordenador |
| POST | `/coordenador/regras` | Criar regra | Coordenador |
| GET | `/coordenador/regras/:curso_id` | Listar regras | Coordenador |

---

## Funcionalidades Implementadas

- [x] Autenticação com JWT
- [x] Controle de perfis (Super Admin, Coordenador)
- [x] Cadastro e listagem de cursos
- [x] Cadastro de coordenadores com senha protegida
- [x] Cadastro de alunos
- [x] Regras de atividades por curso
- [x] Validação e reprovação de submissões
- [x] Segurança — coordenador acessa apenas seu próprio curso
- [x] Logs e rastreabilidade
- [x] E-mails automáticos
- [x] Upload de certificados
- [x] Dashboard de métricas
- [x] Filtros e paginação nas submissões

## Em Desenvolvimento
- [x] Frontend conectado ao backend 
- [ ] OCR para leitura de certificados 

---

## Licença

Este projeto foi desenvolvido para fins acadêmicos

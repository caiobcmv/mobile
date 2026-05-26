# 🎓 Portal de Atividades Complementares (Faculdades SENAC)

Sistema completo (API Backend, Painel Web Admin e Aplicativo Mobile) desenvolvido para digitalizar e automatizar o processo de gestão de atividades complementares acadêmicas do SENAC, eliminando o uso de planilhas manuais e e-mails descentralizados.

---

## 📂 Estrutura do Repositório

O projeto é estruturado em duas partes principais:

```text
mobile/ (Raiz do repositório)
├── README.md                       → Este arquivo unificado de documentação
├── sistema-horas-complementares/   → API Backend (Node/Express) + Painel Web Admin (HTML/CSS/JS)
└── aaa/
    └── Sistema-de-horas-mobile/    → Aplicativo Mobile (React Native + Expo SDK 54)
```

---

## 🌐 Endereços e Acessos em Produção (Web)

O servidor e banco de dados estão hospedados e ativos na internet:

*   **API & Painel Administrativo Web (Render):**
    👉 [https://sistema-horas-api.onrender.com/pages/index.html](https://sistema-horas-api.onrender.com/pages/index.html)
*   **Banco de Dados (Neon PostgreSQL):** Conectado ao servidor através de canal SSL seguro.

### 🔑 Contas Administrativas / Testes:
*   **Super Admin:** `admin@senac.com` | Senha: `123456`
*   **Coordenador:** `ricardo@senac.com` | Senha: `123456`
*   **Aluno (Lucas):** `lucas@aluno.senac.com` | Senha: `123456`

---

## 🖥️ Módulo 1: Backend e Painel Web Admin (`sistema-horas-complementares`)

O backend é um servidor robusto que gerencia a lógica de negócios, banco de dados, autenticação de usuários, uploads e notificações por e-mail. Ele também serve estaticamente o painel web admin para coordenadores e o super administrador.

### Tecnologias Utilizadas
*   **Servidor:** Node.js + Express
*   **Banco de Dados:** PostgreSQL (módulo `pg`)
*   **Autenticação:** JWT (JSON Web Token) e Criptografia `bcryptjs`
*   **Upload de Arquivos:** Multer
*   **E-mails:** Nodemailer

### Como Configurar e Rodar Localmente
1. Acesse o diretório do backend:
   ```bash
   cd sistema-horas-complementares
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie e configure o arquivo `.env` com suas credenciais locais:
   ```env
   PORT=3001
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=atividades_complementares_senac
   DB_USER=postgres
   DB_PASSWORD=sua_senha
   JWT_SECRET=minha_chave_secreta_longa
   ```
4. Configure o banco de dados local executando o arquivo `schema.sql`. Opcionalmente, execute `data_insert.sql` para preencher com dados de teste.
5. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   Acesse a interface administrativa local em: `http://localhost:3001/pages/index.html`

### Estrutura de Rotas da API
*   **Autenticação (`/auth`):**
    *   `POST /auth/login` - Efetua o login de usuários (todos os perfis).
    *   `POST /auth/setup` - Inicializa o primeiro Super Admin do sistema.
*   **Super Admin (`/admin`):**
    *   `GET /admin/cursos` / `POST /admin/curso` - Gerencia os cursos da instituição.
    *   `GET /admin/coordenadores` / `POST /admin/coordenador` - Gerencia o cadastro de coordenadores.
*   **Coordenador (`/coordenador`):**
    *   `POST /coordenador/aluno` - Cadastra alunos no curso.
    *   `GET /coordenador/alunos/:curso_id` - Lista alunos vinculados ao curso.
    *   `GET /coordenador/submissoes/:curso_id` - Lista submissões pendentes de validação.
    *   `PATCH /coordenador/validar/:id` - Aprova, reprova ou devolve submissões para ajuste.
    *   `POST /coordenador/regras` - Cria regras de limites de horas por categoria para um curso.
*   **Aluno (`/aluno`):**
    *   `POST /aluno/submeter` - Envia uma atividade complementar com certificado em anexo.
    *   `GET /aluno/minhas-submissoes` - Histórico de atividades enviadas pelo aluno.
    *   `GET /aluno/resumo-horas` - Gráficos e progresso de horas integralizadas por categoria.

---

## 📱 Módulo 2: Aplicativo Mobile (`aaa/Sistema-de-horas-mobile`)

O aplicativo móvel é o canal exclusivo do aluno para solicitar validação de horas, enviar imagens/PDFs de certificados e acompanhar o andamento dos processos direto do smartphone.

### Tecnologias Utilizadas
*   **Framework:** React Native + Expo (SDK 54) + TypeScript
*   **Navegação:** React Navigation (Native Stack)
*   **Comunicação API:** Axios (com interceptores para anexar o token de autenticação)
*   **Armazenamento Local:** AsyncStorage (persistência de sessão de login)

### Telas Implementadas
1.  **Boas-vindas (`WelcomeScreen`):** Apresentação visual, logo e botão inicial.
2.  **Primeiro Acesso (`FirstAccessScreen`):** Tela para registro de novos alunos.
3.  **Login (`LoginScreen`):** Autenticação com e-mail/CPF e senha.
4.  **Painel Principal (`DashboardScreen`):** Progresso geral de horas complementares em formato de barra de progresso gráfica.
5.  **Enviar Atividade (`SubmitHoursScreen`):** Formulário de envio de comprovantes, seleção de categoria, cálculo automático e anexo de documentos.
6.  **Perfil (`ProfileScreen`):** Dados cadastrais do aluno e opção de logout.

### Como Rodar o Aplicativo Mobile
1. Acesse o diretório do aplicativo:
   ```bash
   cd aaa/Sistema-de-horas-mobile
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Garanta que o aplicativo aponta para o servidor correto no arquivo `src/constants/index.ts`:
   *   **Para rodar localmente:** configure com o IP local da sua máquina (ex: `http://192.168.x.x:3001`).
   *   **Para rodar apontando para a nuvem:** configure com a URL do Render:
       ```typescript
       export const API_BASE_URL = 'https://sistema-horas-api.onrender.com';
       ```
4. Inicie o Metro Bundler do Expo:
   ```bash
   npm start
   ```
5. Abra o aplicativo **Expo Go** no seu celular (Android ou iOS) e escaneie o código QR gerado no terminal para carregar o aplicativo.
   *   *Para rodar no emulador de computador:* pressione `a` para emulador Android ou `i` para simulador iOS.

---

## ⚙️ Detalhes da Configuração na Nuvem (Deploy)

### Hospedagem do Banco de Dados (Neon.tech)
Hospedado no Neon (PostgreSQL na nuvem). 
*   **Estrutura (schema.sql):** Configurado a partir de dados em série (`BIGSERIAL`), gerindo o autoincremento e os relacionamentos de chaves estrangeiras automaticamente.
*   **Dados Iniciais (data_insert.sql):** Popula a estrutura com perfis (`super_admin`, `coordinator`, `student`), cursos, categorias e submissões padrão de teste.

### Hospedagem da API + Web Frontend (Render.com)
Hospedado de forma integrada:
*   **Root Directory:** `sistema-horas-complementares`
*   **Build Command:** `npm install`
*   **Start Command:** `node src/server.js`
*   **Environment Variables:**
    *   `DATABASE_URL`: String de conexão fornecida pelo Neon com o parâmetro `?sslmode=require` anexado.
    *   `JWT_SECRET`: Senha utilizada pelo servidor para encriptar e validar as assinaturas dos tokens de login.

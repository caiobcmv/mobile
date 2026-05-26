# 🎓 Portal de Atividades Complementares (Faculdades SENAC)

 Aplicativo Mobile (`aaa/Sistema-de-horas-mobile`)

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

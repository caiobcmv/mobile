# 📱 Portal Acadêmico SENAC - Guia de Integração e Execução

Este guia consolida todas as modificações, integrações e passos necessários para executar o aplicativo **Mobile** conectado ao seu **Backend** local.

---

## 🛠️ O que foi Desenvolvido

### 1. 📐 Ajuste de Layout Superior (Safe Area View)
Aplicamos de forma sistemática a `SafeAreaView` da biblioteca `react-native-safe-area-context` na parte superior de todas as 12 telas do aplicativo.

* **Objetivo**: Evitar que cabeçalhos e elementos fiquem ocultos atrás do notch, câmera ou da barra de status (especialmente em dispositivos Android com status bar translúcida).
* **Solução**: Restringimos os limites usando a propriedade `edges={['top']}`. Isso garante o espaçamento correto no topo enquanto preserva o comportamento natural na parte inferior de cada tela.

Telas ajustadas:
* `WelcomeScreen`, `FirstAccessScreen`, `LoginScreen`, `SelectCourseScreen`, `DashboardScreen`, `HoursListScreen`, `HourDetailScreen`, `SubmitHoursScreen`, `SubmitDocumentScreen`, `SubmitSuccessScreen`, `NotificationsScreen`, `ProfileScreen`.

---

### 2. 🔌 Ajuste de Rede e Comunicação (Mobile ↔ Backend)
* **IP da Rede Local**: Editamos o arquivo [constants/index.ts](file:///c:/Users/User/Desktop/mobile/aaa/Sistema-de-horas-mobile/src/constants/index.ts) para apontar para a máquina host usando o endereço de IP da rede (`192.168.0.3` na porta `3001`):
  ```typescript
  export const API_BASE_URL = 'http://192.168.0.3:3001';
  ```
  *(Celulares físicos e emuladores precisam do IP real da máquina na mesma rede Wi-Fi para acessar o servidor local em vez de usar `localhost`).*
* **Banco de Dados (.env)**: Resolvemos o erro `500 SASL SCRAM client password must be a string` copiando o arquivo `.env` para a **raiz** da pasta do backend `sistema-horas-complementares`. Isso permitiu que o pacote `dotenv` injetasse corretamente as 6 variáveis de configuração do PostgreSQL ao iniciar o servidor.

---

### 3. 🎯 Tela de Boas-Vindas Dinâmica (WelcomeScreen)
Atualizamos os botões no rodapé da primeira tela ([WelcomeScreen.tsx](file:///c:/Users/User/Desktop/mobile/aaa/Sistema-de-horas-mobile/src/screens/welcome/WelcomeScreen.tsx)) para dividir os fluxos de acesso:
* **Primeiro Acesso**: Botão azul primário que direciona para a criação da senha inicial (`FirstAccessScreen`).
* **Já tenho uma conta**: Botão secundário elegante (*outlined*) que direciona direto para a tela de `LoginScreen`.

---

### 4. 🔑 Tela de Login, Validações e Máscaras
* **Máscara Inteligente**: O campo "Matrícula ou E-mail" em [LoginScreen.tsx](file:///c:/Users/User/Desktop/mobile/aaa/Sistema-de-horas-mobile/src/screens/auth/LoginScreen.tsx) detecta se o usuário está digitando apenas números. Se for numérico (Matrícula), o input limita a entrada automaticamente a **10 dígitos**; se contiver letras ou `@`, permite formato de e-mail livre.
* **Erros de Senha e Credenciais**: Integramos a chamada real de login. Caso as credenciais inseridas estejam erradas, a tela captura a mensagem `"Email ou senha incorretos."` vinda do banco de dados e exibe-a em vermelho acima do botão de login.

---

### 5. 📊 Integração Dinâmica das Telas Mobile com a API
* **Dashboard**: Consome os endpoints `/aluno/resumo-horas` e `/aluno/meus-dados` para mostrar o nome real do aluno, curso, progresso de horas validadas (com barra de progresso visual), horas pendentes e a contagem real de envios.
* **Lista de Atividades**: A lista é populada dinamicamente chamando `/aluno/submissoes` do banco de dados. Criamos um mapeador (*mapper*) para converter a entidade do banco de dados `HourSubmission` para a interface `ActivityMock` consumida pelas telas.
* **Perfil do Usuário**: Mostra e-mail e estatísticas reais do aluno. Integramos o botão "Sair" com a lógica de `logout()` do hook `useAuth()` para limpar os tokens da sessão e do `AsyncStorage`.
* **Criação de Submissões**:
  * Adicionamos o campo **Título da Atividade** no formulário de preenchimento.
  * O dropdown de categorias em [SubmitHoursScreen.tsx](file:///c:/Users/User/Desktop/mobile/aaa/Sistema-de-horas-mobile/src/screens/hours/SubmitHoursScreen.tsx) agora lista dinamicamente as categorias e regras vinculadas ao curso do aluno logado.
  * O botão de confirmação em [SubmitDocumentScreen.tsx](file:///c:/Users/User/Desktop/mobile/aaa/Sistema-de-horas-mobile/src/screens/hours/SubmitDocumentScreen.tsx) dispara a gravação real chamando `hoursService.create(...)`, inserindo a nova linha na tabela `submissions` do banco PostgreSQL.

---

## 🚀 Como Iniciar e Testar o Sistema Completo

### Passo 1: Iniciar o Backend
Abra um terminal na raiz do diretório `sistema-horas-complementares` e execute:
```bash
npm run dev
```
O console confirmará: `Servidor rodando na porta 3001` e `injecting env (6) from .env`.

### Passo 2: Iniciar o Mobile (Metro Bundler)
Abra outro terminal na pasta `aaa/Sistema-de-horas-mobile` e execute:
```bash
npm run start
```
* Escaneie o QR Code com o aplicativo **Expo Go** no seu smartphone (conectado na mesma rede Wi-Fi que o seu PC).
* Ou pressione **`a`** para rodar no Emulador Android, ou **`i`** no Simulador iOS.

### Passo 3: Credenciais Reais de Teste (PostgreSQL)
Você pode efetuar login no app utilizando uma das contas reais já preenchidas no banco de dados local:
* **Usuário**: `lucas@aluno.senac.com` | **Senha**: `123456`
* **Usuário**: `ana@aluno.senac.com` | **Senha**: `123456`

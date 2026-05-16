<div align="center">

# 📱 Sistema de Horas Mobile

> Aplicativo mobile para registro, submissão e acompanhamento de horas complementares acadêmicas.

![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.16-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

</div>

---

## 📋 Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Rodando o Projeto](#-rodando-o-projeto)
- [Arquitetura de Pastas](#-arquitetura-de-pastas)
- [Camadas da Aplicação](#-camadas-da-aplicação)
- [Dependências](#-dependências)
- [Scripts Disponíveis](#-scripts-disponíveis)

---

## 📖 Sobre o Projeto

O **Sistema de Horas Mobile** é o cliente mobile de um sistema de gestão de horas complementares. Ele permite que alunos submetam atividades para aprovação, coordenadores avaliem as submissões e o superadmin gerencie toda a plataforma — tudo pelo celular.

---

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

| Ferramenta | Versão mínima | Download |
|---|---|---|
| Node.js | 18.x ou superior | [nodejs.org](https://nodejs.org) |
| npm | 9.x ou superior | Incluído com Node.js |
| Expo CLI | Última versão | `npm install -g expo-cli` |
| Expo Go (celular) | Qualquer | [App Store](https://apps.apple.com/app/expo-go/id982107779) / [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) |

> **Android Studio / Xcode** são necessários apenas para rodar em emulador local.

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/sistema-de-horas-mobile.git
cd sistema-de-horas-mobile
```

### 2. Instale as dependências

```bash
npm install
```

Isso instalará todas as dependências listadas no `package.json`, incluindo:
- Expo SDK
- React Navigation
- Axios
- AsyncStorage
- React Native Screens e Safe Area Context

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
API_BASE_URL=https://sua-api.com/api
```

> Edite também `src/constants/index.ts` com a URL correta da sua API enquanto a integração com `.env` não estiver configurada.

---

## ▶️ Rodando o Projeto

### No celular (recomendado para desenvolvimento)

```bash
npm start
```

Escaneie o QR Code exibido no terminal com o app **Expo Go**.

### No emulador Android

```bash
npm run android
```

### No simulador iOS (somente macOS)

```bash
npm run ios
```

### No navegador (limitado)

```bash
npm run web
```

---

## 🗂️ Arquitetura de Pastas

```
sistema-de-horas-mobile/
│
├── App.tsx                    # Entry point — monta o RootNavigator
├── index.ts                   # Registro do app no Expo
├── app.json                   # Configurações do Expo (nome, ícone, splash…)
├── tsconfig.json              # Configuração do TypeScript
├── package.json               # Dependências e scripts
│
└── src/                       # Todo o código-fonte da aplicação
    │
    ├── assets/                # Arquivos estáticos
    │   ├── fonts/             # Fontes customizadas (.ttf, .otf)
    │   ├── icons/             # Ícones SVG/PNG
    │   └── images/            # Imagens estáticas
    │
    ├── components/            # Componentes de UI reutilizáveis
    │   ├── common/            # Button, Input, Badge, Avatar…
    │   ├── forms/             # FormField, DatePicker, Picker…
    │   └── layout/            # Header, Card, Container, Divider…
    │
    ├── constants/
    │   └── index.ts           # URL da API, chaves do storage, categorias
    │
    ├── hooks/
    │   ├── useApi.ts          # Hook genérico para chamadas HTTP
    │   ├── useAuth.ts         # Autenticação + persistência de sessão
    │   └── index.ts           # Barrel export
    │
    ├── navigation/
    │   └── RootNavigator.tsx  # Rotas Auth ↔ App (Stack Navigator)
    │
    ├── screens/               # Telas do app (uma pasta por domínio)
    │   ├── auth/
    │   │   └── LoginScreen.tsx
    │   ├── dashboard/
    │   │   └── DashboardScreen.tsx
    │   ├── hours/
    │   │   └── SubmitHoursScreen.tsx
    │   ├── profile/
    │   │   └── ProfileScreen.tsx
    │   └── index.ts           # Barrel export de todas as telas
    │
    ├── services/
    │   └── api/
    │       ├── client.ts      # Instância Axios + interceptors de auth
    │       ├── authService.ts # Login, logout, forgot-password
    │       ├── hoursService.ts# CRUD de submissões de horas
    │       └── index.ts       # Barrel export
    │
    ├── store/
    │   └── slices/            # Slices Redux Toolkit (estado global)
    │
    ├── types/
    │   └── index.ts           # Interfaces globais: User, HourSubmission…
    │
    └── utils/
        ├── formatDate.ts      # formatDate, formatDateTime, formatHours
        ├── validators.ts      # isValidEmail, isStrongPassword, isRequired
        └── index.ts           # Barrel export
```

---

## 🧱 Camadas da Aplicação

A arquitetura segue o princípio de **separação de responsabilidades**, onde cada camada tem um papel bem definido:

```
┌─────────────────────────────────────────────┐
│                  screens/                   │  ← UI + orquestração
├─────────────────────────────────────────────┤
│               components/                   │  ← Peças de UI reutilizáveis
├─────────────────────────────────────────────┤
│        hooks/          navigation/          │  ← Lógica stateful + rotas
├─────────────────────────────────────────────┤
│              services/api/                  │  ← Comunicação com o backend
├─────────────────────────────────────────────┤
│     constants/   types/   utils/   store/   │  ← Base compartilhada
└─────────────────────────────────────────────┘
```

| Camada | Responsabilidade |
|---|---|
| `screens/` | Montar a UI de cada página; coordenar componentes e hooks |
| `components/` | Peças de UI isoladas, sem lógica de negócio |
| `navigation/` | Definição de rotas e proteção de acesso por autenticação |
| `hooks/` | Lógica stateful reutilizável entre telas |
| `services/api/` | Única camada que conhece a API; contém Axios + interceptors |
| `store/` | Estado global da aplicação via Redux Toolkit |
| `types/` | Contratos TypeScript compartilhados entre todas as camadas |
| `constants/` | Valores de configuração e constantes da aplicação |
| `utils/` | Funções puras e sem estado (formatação, validação) |

### Fluxo de dados

```
Screen → Hook → Service (Axios) → API REST
  ↑                                   |
  └──────────── response ─────────────┘
```

---

## 🏛️ Padrão Arquitetural

O projeto utiliza a **Feature-Layered Architecture** — uma combinação de dois padrões consagrados:

### Layered Architecture (Arquitetura em Camadas)

Cada pasta representa uma **camada com responsabilidade única**, e a comunicação flui sempre de cima para baixo. Uma camada superior pode conhecer a inferior, mas nunca o contrário:

```
screens        →  só conhece components e hooks
hooks          →  só conhece services e types
services/api   →  só conhece o backend via HTTP
utils / types  →  base compartilhada, sem dependências internas
```

### Domain-based Folders (Pastas por Domínio)

Dentro das camadas, os arquivos são agrupados por **contexto de negócio**, facilitando localizar e escalar cada funcionalidade de forma independente:

```
screens/auth/            → domínio: autenticação
screens/hours/           → domínio: horas complementares
screens/dashboard/       → domínio: painel principal
services/api/authService.ts   → serviço do domínio auth
services/api/hoursService.ts  → serviço do domínio horas
```

### Por que essa arquitetura?

| Vantagem | Motivo |
|---|---|
| **Escalável** | Adicionar uma nova tela não afeta as demais |
| **Testável** | Cada camada pode ser testada de forma isolada |
| **Manutenível** | Fácil saber onde fica cada responsabilidade |
| **Padrão de mercado** | Adotado pela maioria dos projetos React Native profissionais |

> **Em resumo:** não é Clean Architecture (mais complexa), nem simples MVC — é um meio-termo ideal para apps mobile de médio porte, focado em clareza e produtividade.

---

## 📦 Dependências

### Produção

| Pacote | Versão | Finalidade |
|---|---|---|
| `expo` | ~54.0.33 | Plataforma base do projeto |
| `react-native` | 0.81.5 | Framework mobile |
| `react` | 19.1.0 | Biblioteca de UI |
| `axios` | ^1.16.1 | Cliente HTTP com interceptors |
| `@react-navigation/native` | ^7.2.4 | Navegação entre telas |
| `@react-navigation/native-stack` | ^7.15.1 | Stack Navigator nativo |
| `react-native-screens` | ~4.16.0 | Otimização de telas nativas |
| `react-native-safe-area-context` | ~5.6.0 | Área segura (notch, barra de status) |
| `@react-native-async-storage/async-storage` | ^2.2.0 | Persistência local (token, sessão) |
| `expo-status-bar` | ~3.0.9 | Controle da barra de status |

### Desenvolvimento

| Pacote | Versão | Finalidade |
|---|---|---|
| `typescript` | ~5.9.2 | Tipagem estática |
| `@types/react` | ~19.1.0 | Tipos do React |

---

## 🔧 Scripts Disponíveis

```bash
# Inicia o servidor de desenvolvimento Expo
npm start

# Abre no emulador Android
npm run android

# Abre no simulador iOS
npm run ios

# Abre no navegador
npm run web

# Verifica erros de TypeScript
npx tsc --noEmit
```

---

## 📄 Licença

Este projeto é de uso acadêmico e privado.

---

<div align="center">
  Feito com ❤️ usando React Native + Expo
</div>

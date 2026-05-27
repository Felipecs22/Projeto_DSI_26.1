# 🎮 Playscope — React Native / Expo

App mobile de gerenciamento e descoberta de jogos.

---

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI: `npm install -g expo-cli`
- App **Expo Go** no celular (iOS ou Android) — ou emulador

---

## Instalação e execução

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o Expo
npx expo start
```

Escaneie o QR Code com o app **Expo Go** ou pressione:
- `a` → emulador Android
- `i` → simulador iOS

---

## Estrutura do projeto

```
src/
├── components/
│   ├── CategoryButton.jsx      # Botão de filtro (pill)
│   ├── GameCard.jsx            # Card vertical de jogo (grid)
│   ├── GameCardHorizontal.jsx  # Card horizontal (carrossel)
│   ├── GameStatusButton.jsx    # Botão de status outlined
│   ├── LogoIcon.jsx            # Ícone do logo Playscope
│   ├── ProfileAvatar.jsx       # Avatares: Ninja, Robô, Cowboy
│   ├── ReviewCard.jsx          # Card de review de usuário
│   ├── SearchBar.jsx           # Barra de busca
│   ├── SectionTitle.jsx        # Título de seção com subtítulo
│   ├── StarRating.jsx          # Avaliação em estrelas
│   └── StatusModal.jsx         # Bottom sheet de status do jogo
│
├── constants/
│   ├── colors.js               # Design tokens / paleta de cores
│   └── data.js                 # Dados mock (jogos, reviews, news…)
│
├── navigation/
│   └── AppNavigator.tsx        # Stack + Bottom Tabs
│
└── screens/
    ├── LoginScreen.tsx
    ├── RegisterScreen.tsx
    ├── HomeScreen.tsx
    ├── MyGamesScreen.tsx
    ├── CommunityScreen.tsx
    ├── FriendsScreen.tsx
    ├── NewsScreen.tsx
    └── ProfileScreen.tsx
```

---

## Telas

| Tela | Funcionalidade |
|------|---------------|
| Login | E-mail + senha, link para cadastro |
| Registro | 5 campos, validação básica |
| Início | Recomendações, Em Alta, filtro por Tags |
| Meus Jogos | Biblioteca com 6 filtros de status + StatusModal |
| Comunidade | Jogos mais jogados + reviews recentes |
| Amigos | Lista, reviews e feed de atividade |
| Perfil | Avatar (Ninja/Robô/Cowboy), edição de dados, preferências, segurança, zona de perigo |

---

## Dependências principais

```json
"@react-navigation/bottom-tabs"
"@react-navigation/native"
"@react-navigation/native-stack"
"expo": "~54.0.0"
"react-native": "0.81.5"
"react-native-safe-area-context"
"react-native-screens"
```

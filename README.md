# Playscope — React Native / Expo

App mobile de gerenciamento e descoberta de jogos com catálogo real Steam.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Mobile | React Native 0.81 + Expo 54 |
| Navegação | React Navigation 7 (Stack + Bottom Tabs) |
| Backend | Firebase (Auth + Firestore + Storage) |
| Catálogo | Dataset Steam (600 jogos, local) |
| Mapas | OpenStreetMap via react-native-maps + Nominatim |
| Arquitetura | OOP: Models + Services + Repositories |

---

## Pré-requisitos

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Aplicativo **Expo Go** instalado no celular (Android ou iOS)

---

## Instalação e execução

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npx expo start

# 3. Escanear o QR Code com o Expo Go (Android) ou câmera (iOS)
```

---

## Estrutura

```
src/
├── models/           # Classes: Game, User, Review, UserGame, FriendRelation, GamingPlace
├── services/         # AuthService, GameService, LibraryService, ReviewService,
│                     # FriendService, PlacesService, StorageService
├── repositories/     # BaseRepository, UserRepo, LibraryRepo, ReviewRepo,
│                     # FriendRepo, PlacesRepository
├── context/          # AuthContext, ThemeContext, ToastContext
├── data/             # games_data.json (600 jogos Steam reais)
├── constants/        # colors.js, data.js (tags etc.)
├── components/       # GameCard, StarRating, StatusModal, ProfileAvatar...
├── screens/          # 9 telas completas
└── navigation/       # AppNavigator
```

---

## Telas

| Tela | Funcionalidades |
|------|----------------|
| Login | Firebase Auth real com validação e tratamento de erros |
| Registro | Cria conta Firebase + perfil Firestore |
| Home | Catálogo local, busca em tempo real com debounce, filtro por tags, detalhes e reviews |
| Meus Jogos | Biblioteca Firestore, CRUD real, filtros por status e ordenação |
| Comunidade | Reviews públicas e jogos populares da comunidade |
| Mapa | Lojas de games e LAN houses próximas via OpenStreetMap, slider de raio e filtros |
| Amigos | Busca por @username, convites, lista real de amigos e reviews dos amigos |
| Perfil | Foto de perfil (galeria ou avatar), preferências persistidas e stats reais |

---

## Funcionalidades principais

- **Autenticação completa** — login, cadastro, logout e redefinição de senha via Firebase Auth
- **Biblioteca pessoal** — adicionar jogos, definir status (Jogando, Concluído, Pausado, Abandonado, Na Fila) e remover
- **Reviews** — escrever, editar e excluir avaliações com nota de 0 a 5
- **Sistema de amizade** — buscar usuários, enviar e receber convites, aceitar ou recusar, remover amigos
- **Mapa de locais** — encontrar lojas de games e LAN houses próximas com slider de raio (500m a 5km)
- **Foto de perfil** — upload da galeria para o Firebase Storage ou escolha entre avatares predefinidos
- **Tema** — modo claro e escuro com persistência
- **Toast de feedback** — confirmação visual em todas as ações de escrita

---

## Arquitetura

O projeto segue o padrão **Repository + Service Layer**, com todas as regras de negócio encapsuladas em Services e o acesso ao banco isolado em Repositories. As telas nunca acessam o Firebase diretamente.

```
Tela → Service → Repository → Firebase / API externa
```

Os Services seguem o padrão **Singleton** (`getInstance()`). Os Repositories herdam de um `BaseRepository<T>` genérico em TypeScript.

---

## Firebase

| Serviço | Uso |
|---------|-----|
| Authentication | Login, cadastro e gerenciamento de sessão |
| Firestore | Usuários, biblioteca, reviews e amizades |
| Storage | Upload de fotos de perfil (`avatars/{userId}/profile.jpg`) |

---

## Variáveis de ambiente

As credenciais do Firebase ficam em `src/services/firebase.config.ts`. Para rodar o projeto, configure esse arquivo com os dados do seu projeto Firebase.

# 🎮 Playscope — React Native / Expo

App mobile de gerenciamento e descoberta de jogos com catálogo real Steam.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Mobile | React Native 0.81 + Expo 54 |
| Navegação | React Navigation 7 (Stack + Bottom Tabs) |
| Backend | Firebase (Auth + Firestore + Storage) |
| Catálogo | Dataset Steam (600 jogos, local) |
| Arquitetura | OOP: Models + Services + Repositories |

---

## Instalação rápida

```bash
npm install
npx expo start
```

> Para usar Firebase: veja `FIREBASE_SETUP.md`
> Para testar sem Firebase: botão `⚙️ Entrar sem Firebase (dev)` na tela de Login

---

## Estrutura

```
src/
├── models/           # Classes: Game, User, Review, UserGame
├── services/         # AuthService, GameService, StorageService
├── repositories/     # BaseRepository, UserRepo, LibraryRepo, ReviewRepo
├── context/          # AuthContext (React Context)
├── data/             # games_data.json (600 jogos Steam reais)
├── constants/        # colors.js, data.js (tags etc.)
├── components/       # GameCard, StarRating, StatusModal, ProfileAvatar...
├── screens/          # 8 telas completas
└── navigation/       # AppNavigator
```

---

## Telas

| Tela | Funcionalidades |
|------|----------------|
| Login | Firebase Auth real + modo dev |
| Registro | Cria conta Firebase + perfil Firestore |
| Home | Catálogo Steam, busca em tempo real, filtro por tags |
| Meus Jogos | Biblioteca Firestore, 6 filtros de status |
| Comunidade | Reviews e jogos populares |
| Amigos | Feed de atividade |
| Novidades | Últimas notícias |
| Perfil | Avatar (Ninja/Robô/Cowboy), edição Firestore, upload Storage |

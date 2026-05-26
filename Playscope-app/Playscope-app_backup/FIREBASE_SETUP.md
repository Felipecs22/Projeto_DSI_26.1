# 🔥 Configuração do Firebase

## 1. Criar projeto no Firebase Console

1. Acesse https://console.firebase.google.com
2. Clique em **Adicionar projeto**
3. Dê um nome (ex: `playscope`)
4. Desative Google Analytics (opcional) → **Criar projeto**

## 2. Adicionar app Web

1. Na tela do projeto → ícone `</>` (Web)
2. Dê um apelido (ex: `playscope-rn`)
3. Clique em **Registrar app**
4. Copie o objeto `firebaseConfig` mostrado

## 3. Colar credenciais no projeto

Abra `src/services/firebase.config.ts` e substitua:

```ts
const firebaseConfig = {
  apiKey:            'SUA_API_KEY',
  authDomain:        'seu-projeto.firebaseapp.com',
  projectId:         'seu-projeto',
  messagingSenderId: 'SEU_SENDER_ID',
  appId:             'SEU_APP_ID',
};
```

## 4. Ativar Authentication

1. Firebase Console → **Authentication** → **Começar**
2. Aba **Sign-in method** → habilitar **E-mail/senha** → Salvar

## 5. Criar Firestore Database

1. Firebase Console → **Firestore Database** → **Criar banco de dados**
2. Selecione **Modo de teste** (regras abertas por 30 dias)
3. Escolha a região mais próxima (ex: `southamerica-east1`)

## 6. Regras de segurança (produção futura)

### Firestore
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    match /userGames/{doc} {
      allow create: if request.auth != null &&
        request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
    match /reviews/{doc} {
      allow read: if true;
      allow write: if request.auth != null &&
        request.resource.data.userId == request.auth.uid;
    }
  }
}
```

## 7. Instalar dependências e rodar

```bash
npm install
npx expo start
```

> O app agora depende de Authentication + Firestore configurados para login, biblioteca, reviews e preferências.

/**
 * Firebase Configuration
 *
 * COMO CONFIGURAR:
 * 1. Acesse https://console.firebase.google.com
 * 2. Crie ou abra seu projeto
 * 3. Vá em Project Settings → General → Your apps → Add app (Web)
 * 4. Copie o firebaseConfig gerado e cole aqui abaixo
 *
 * Serviços necessários no console:
 *  - Authentication  → Email/Password habilitado
 *  - Firestore       → criar banco (modo test por ora)
 *  - Storage         → ativar bucket padrão
 */

import { initializeApp, getApps } from 'firebase/app';
import { getAuth }                 from 'firebase/auth';
import { getFirestore }            from 'firebase/firestore';
import { getStorage }              from 'firebase/storage';

// ─── SUBSTITUA com suas credenciais do Firebase Console ───────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyDsua-L0-MyZZ6qF1JqT2iMqa5jPwN2QuU",
  authDomain: "playscope-rn.firebaseapp.com",
  projectId: "playscope-rn",
  storageBucket: "playscope-rn.firebasestorage.app",
  messagingSenderId: "16345909061",
  appId: "1:16345909061:web:1ff0c892af1fb98d50602c"
};
// ─────────────────────────────────────────────────────────────────────────────

// Evita inicialização duplicada (hot-reload do Expo)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);
export default app;

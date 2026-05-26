/**
 * AuthService — encapsula toda a lógica de autenticação Firebase.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './firebase.config';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';

export class AuthService {
  private static instance: AuthService;
  private userRepo = new UserRepository();

  /** Singleton */
  static getInstance(): AuthService {
    if (!AuthService.instance) AuthService.instance = new AuthService();
    return AuthService.instance;
  }

  /**
   * Cadastra novo usuário e cria perfil no Firestore.
   */
  async register(
    email: string,
    password: string,
    displayName: string,
    username: string,
  ): Promise<User> {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });

      const user = new User({
        uid:         cred.user.uid,
        displayName,
        username,
        email,
        createdAt:   new Date().toISOString(),
      });

      await this.userRepo.save(user);
      return user;
    } catch (error: any) {
      throw this.mapError(error);
    }
  }

  /**
   * Autentica usuário existente.
   */
  async login(email: string, password: string): Promise<User> {
    try {
      const cred     = await signInWithEmailAndPassword(auth, email, password);
      const existing = await this.userRepo.findById(cred.user.uid);

      if (existing) return existing;

      // Cria perfil caso não exista ainda (migração)
      const user = new User({
        uid:         cred.user.uid,
        displayName: cred.user.displayName ?? '',
        email:       cred.user.email       ?? email,
      });
      await this.userRepo.save(user);
      return user;
    } catch (error: any) {
      throw this.mapError(error);
    }
  }

  /**
   * Encerra a sessão.
   */
  async logout(): Promise<void> {
    await signOut(auth);
  }

  /**
   * Observador de mudança de estado de autenticação.
   * Retorna função de unsubscribe.
   */
  onAuthChanged(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  /** Usuário atualmente autenticado (Firebase) */
  get currentFirebaseUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  private mapError(error: any): Error {
    const code    = error?.code ?? '';
    const messages: Record<string, string> = {
      'auth/email-already-in-use':    'Este e-mail já está em uso.',
      'auth/invalid-email':           'E-mail inválido.',
      'auth/weak-password':           'A senha deve ter pelo menos 6 caracteres.',
      'auth/user-not-found':          'Usuário não encontrado.',
      'auth/wrong-password':          'Senha incorreta.',
      'auth/invalid-credential':      'E-mail ou senha incorretos.',
      'auth/too-many-requests':       'Muitas tentativas. Tente novamente mais tarde.',
      'auth/network-request-failed':  'Erro de conexão. Verifique sua internet.',
    };
    return new Error(messages[code] ?? error?.message ?? 'Erro desconhecido.');
  }
}

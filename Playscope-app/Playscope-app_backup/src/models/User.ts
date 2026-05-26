/**
 * User — representa o perfil do usuário autenticado.
 */
export class User {
  readonly uid: string;
  displayName: string;
  username: string;
  email: string;
  bio: string;
  avatarId: string | null;       // 'ninja' | 'robot' | 'cowboy' | null
  photoURL: string | null;       // URL do Firebase Storage
  readonly createdAt: string;

  // Preferências
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    publicActivity: boolean;
    publicLibrary: boolean;
  };

  constructor(data: {
    uid: string;
    displayName?: string;
    username?: string;
    email?: string;
    bio?: string;
    avatarId?: string | null;
    photoURL?: string | null;
    createdAt?: string;
    preferences?: Partial<User['preferences']>;
  }) {
    this.uid         = data.uid;
    this.displayName = data.displayName ?? 'Jogador';
    this.username    = data.username    ?? '@jogador';
    this.email       = data.email       ?? '';
    this.bio         = data.bio         ?? '';
    this.avatarId    = data.avatarId    ?? null;
    this.photoURL    = data.photoURL    ?? null;
    this.createdAt   = data.createdAt   ?? new Date().toISOString();
    this.preferences = {
      notifications:  true,
      darkMode:       true,
      publicActivity: true,
      publicLibrary:  true,
      ...(data.preferences ?? {}),
    };
  }

  /** Iniciais para fallback de avatar */
  get initials(): string {
    return this.displayName
      .split(' ')
      .map(w => w[0] ?? '')
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  toJSON(): Record<string, unknown> {
    return {
      uid:         this.uid,
      displayName: this.displayName,
      username:    this.username,
      email:       this.email,
      bio:         this.bio,
      avatarId:    this.avatarId,
      photoURL:    this.photoURL,
      createdAt:   this.createdAt,
      preferences: this.preferences,
    };
  }

  static fromJSON(data: Record<string, any>): User {
    return new User(data as any);
  }
}

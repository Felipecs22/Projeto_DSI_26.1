import { BaseRepository } from './BaseRepository';
import { User } from '../models/User';

export class UserRepository extends BaseRepository<User> {
  protected collectionName = 'users';

  protected toModel(data: Record<string, any>): User {
    return User.fromJSON(data);
  }

  /** Salva o perfil completo do usuário */
  async saveUser(user: User): Promise<void> {
    await super.save(user.uid, user.toJSON());
  }

  async findByUsername(username: string): Promise<User | null> {
    const normalized = User.normalizeUsername(username);
    const usernameLower = normalized.toLowerCase();
    const rawTrimmed = username.trim();
    const rawWithoutAt = rawTrimmed.replace(/^@/, '');

    const users = await this.findWhere('usernameLower', '==', usernameLower);
    if (users[0]) return users[0];

    const exactNormalized = await this.findWhere('username', '==', normalized);
    if (exactNormalized[0]) return exactNormalized[0];

    if (rawTrimmed && rawTrimmed !== normalized) {
      const rawMatches = await this.findWhere('username', '==', rawTrimmed);
      if (rawMatches[0]) return rawMatches[0];
    }

    if (rawWithoutAt && rawWithoutAt !== rawTrimmed) {
      const noAtMatches = await this.findWhere('username', '==', rawWithoutAt);
      if (noAtMatches[0]) return noAtMatches[0];
    }

    const allUsers = await this.findAll();
    return allUsers.find((user) => {
      const normalizedUser = User.normalizeUsername(user.username).toLowerCase();
      return normalizedUser === usernameLower;
    }) ?? null;
  }

  /** Atualiza campos específicos do perfil */
  async updateProfile(
    uid: string,
    fields: {
      displayName?: string;
      username?: string;
      email?: string;
      bio?: string;
      avatarId?: string | null;
      photoURL?: string | null;
    },
  ): Promise<void> {
    const payload: Record<string, unknown> = { ...fields };

    if (fields.username) {
      payload.username = User.normalizeUsername(fields.username);
      payload.usernameLower = User.normalizeUsername(fields.username).toLowerCase();
    }

    await super.update(uid, payload as any);
  }

  /** Atualiza preferências */
  async updatePreferences(
    uid: string,
    prefs: Partial<User['preferences']>,
  ): Promise<void> {
    const prefObj: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(prefs)) {
      prefObj[`preferences.${key}`] = val;
    }
    await super.update(uid, prefObj);
  }
}

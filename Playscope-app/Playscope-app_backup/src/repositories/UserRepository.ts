import { BaseRepository } from './BaseRepository';
import { User } from '../models/User';

export class UserRepository extends BaseRepository<User> {
  protected collectionName = 'users';

  protected toModel(data: Record<string, any>): User {
    return User.fromJSON(data);
  }

  /** Salva o perfil completo do usuário */
  async save(user: User): Promise<void> {
    await super.save(user.uid, user.toJSON());
  }

  /** Atualiza campos específicos do perfil */
  async updateProfile(
    uid: string,
    fields: {
      displayName?: string;
      username?: string;
      bio?: string;
      avatarId?: string | null;
      photoURL?: string | null;
    },
  ): Promise<void> {
    await super.update(uid, fields as any);
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

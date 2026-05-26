import { BaseRepository } from './BaseRepository';
import { UserGame, type GameStatus } from '../models/UserGame';

export class LibraryRepository extends BaseRepository<UserGame> {
  protected collectionName = 'library';

  protected toModel(data: Record<string, any>): UserGame {
    return UserGame.fromJSON(data);
  }

  /** Retorna todos os jogos da biblioteca de um usuário */
  async getUserLibrary(userId: string): Promise<UserGame[]> {
    return this.findWhere('userId', '==', userId);
  }

  /** Retorna jogos filtrados por status */
  async getByStatus(userId: string, status: GameStatus): Promise<UserGame[]> {
    const all = await this.getUserLibrary(userId);
    return all.filter(g => g.status === status);
  }

  /** Adiciona ou atualiza um jogo na biblioteca */
  async upsert(userGame: UserGame): Promise<void> {
    const docId = `${userGame.userId}_${userGame.gameId}`;
    await super.save(docId, { ...userGame.toJSON(), id: docId });
  }

  /** Atualiza somente o status de um jogo */
  async updateStatus(userId: string, gameId: string, status: GameStatus): Promise<void> {
    const docId = `${userId}_${gameId}`;
    await super.update(docId, {
      status,
      updatedAt: new Date().toISOString(),
    });
  }

  /** Remove jogo da biblioteca */
  async remove(userId: string, gameId: string): Promise<void> {
    const docId = `${userId}_${gameId}`;
    await super.delete(docId);
  }

  /** Verifica se jogo já está na biblioteca */
  async exists(userId: string, gameId: string): Promise<boolean> {
    const docId = `${userId}_${gameId}`;
    const result = await this.findById(docId);
    return result !== null;
  }
}

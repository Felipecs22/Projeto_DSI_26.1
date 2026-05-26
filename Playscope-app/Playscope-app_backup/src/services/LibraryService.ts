import { Game } from '../models/Game';
import { User } from '../models/User';
import { GameStatus, UserGame } from '../models/UserGame';
import { LibraryRepository } from '../repositories/LibraryRepository';

export interface LibraryStats {
  jogando: number;
  jogados: number;
  pausados: number;
  abandonados: number;
  fila: number;
  total: number;
}

const EMPTY_STATS: LibraryStats = {
  jogando: 0,
  jogados: 0,
  pausados: 0,
  abandonados: 0,
  fila: 0,
  total: 0,
};

export class LibraryService {
  private static instance: LibraryService;
  private repository = new LibraryRepository();

  static getInstance(): LibraryService {
    if (!LibraryService.instance) {
      LibraryService.instance = new LibraryService();
    }

    return LibraryService.instance;
  }

  async getUserLibrary(userId: string): Promise<UserGame[]> {
    const items = await this.repository.getUserLibrary(userId);
    return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async getUserGame(userId: string, gameId: string): Promise<UserGame | null> {
    return this.repository.findUserGame(userId, gameId);
  }

  async saveGame(user: User, game: Game, status: GameStatus): Promise<void> {
    const existing = await this.repository.findUserGame(user.uid, game.id);

    const userGame = new UserGame({
      id: `${user.uid}_${game.id}`,
      userId: user.uid,
      gameId: game.id,
      gameName: game.name,
      gameImage: game.image,
      gameGenres: game.genres,
      status,
      addedAt: existing?.addedAt,
      updatedAt: new Date().toISOString(),
    });

    await this.repository.upsert(userGame);
  }

  async updateStatus(userId: string, gameId: string, status: GameStatus): Promise<void> {
    await this.repository.updateStatus(userId, gameId, status);
  }

  async removeGame(userId: string, gameId: string): Promise<void> {
    await this.repository.remove(userId, gameId);
  }

  async clearUserLibrary(userId: string): Promise<void> {
    const library = await this.getUserLibrary(userId);

    await Promise.all(
      library.map((item) => this.repository.remove(userId, item.gameId)),
    );
  }

  getStats(library: UserGame[]): LibraryStats {
    return library.reduce<LibraryStats>((acc, item) => {
      acc[item.status] += 1;
      acc.total += 1;
      return acc;
    }, { ...EMPTY_STATS });
  }
}

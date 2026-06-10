/**
 * UserGame — relação entre usuário e jogo (status na biblioteca).
 */

export type GameStatus = 'jogando' | 'jogados' | 'pausados' | 'abandonados' | 'fila';

export class UserGame {
  readonly id: string;          // Firestore doc id (== gameId para simplicidade)
  readonly userId: string;
  readonly gameId: string;
  readonly gameName: string;
  readonly gameImage: string;
  readonly gameGenres: string;
  status: GameStatus;
  readonly addedAt: string;
  updatedAt: string;

  constructor(data: {
    id?: string;
    userId: string;
    gameId: string;
    gameName: string;
    gameImage: string;
    gameGenres: string;
    status: GameStatus;
    addedAt?: string;
    updatedAt?: string;
  }) {
    this.id         = data.id       ?? data.gameId;
    this.userId     = data.userId;
    this.gameId     = data.gameId;
    this.gameName   = data.gameName;
    this.gameImage  = data.gameImage;
    this.gameGenres = data.gameGenres;
    this.status     = data.status;
    this.addedAt    = data.addedAt  ?? new Date().toISOString();
    this.updatedAt  = data.updatedAt ?? this.addedAt;
  }

  toJSON(): Record<string, unknown> {
    return {
      id:         this.id,
      userId:     this.userId,
      gameId:     this.gameId,
      gameName:   this.gameName,
      gameImage:  this.gameImage,
      gameGenres: this.gameGenres,
      status:     this.status,
      addedAt:    this.addedAt,
      updatedAt:  this.updatedAt,
    };
  }

  static fromJSON(data: Record<string, any>): UserGame {
    return new UserGame(data as any);
  }
}

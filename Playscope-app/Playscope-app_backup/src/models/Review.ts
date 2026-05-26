/**
 * Review — avaliação de um jogo feita por um usuário.
 */
export class Review {
  readonly id: string;
  readonly userId: string;
  readonly gameId: string;
  readonly gameName: string;
  readonly username: string;
  readonly userDisplayName: string;
  rating: number;     // 1–5
  text: string;
  readonly createdAt: string;
  updatedAt: string;

  constructor(data: {
    id?: string;
    userId: string;
    gameId: string;
    gameName: string;
    username: string;
    userDisplayName?: string;
    rating: number;
    text: string;
    createdAt?: string;
    updatedAt?: string;
  }) {
    this.id        = data.id        ?? `${data.userId}_${data.gameId}`;
    this.userId    = data.userId;
    this.gameId    = data.gameId;
    this.gameName  = data.gameName;
    this.username  = data.username;
    this.userDisplayName = data.userDisplayName ?? data.username;
    this.rating    = Math.min(5, Math.max(1, data.rating));
    this.text      = data.text;
    this.createdAt = data.createdAt ?? new Date().toISOString();
    this.updatedAt = data.updatedAt ?? this.createdAt;
  }

  get ratingLabel(): string {
    return `${this.rating}/5`;
  }

  toJSON(): Record<string, unknown> {
    return {
      id:        this.id,
      userId:    this.userId,
      gameId:    this.gameId,
      gameName:  this.gameName,
      username:  this.username,
      userDisplayName: this.userDisplayName,
      rating:    this.rating,
      text:      this.text,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromJSON(data: Record<string, any>): Review {
    return new Review(data as any);
  }
}

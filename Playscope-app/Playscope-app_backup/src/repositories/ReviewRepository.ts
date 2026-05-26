import { BaseRepository } from './BaseRepository';
import { Review } from '../models/Review';

export class ReviewRepository extends BaseRepository<Review> {
  protected collectionName = 'reviews';

  protected toModel(data: Record<string, any>): Review {
    return Review.fromJSON(data);
  }

  /** Cria ou atualiza uma review */
  async upsert(review: Review): Promise<void> {
    await super.save(review.id, review.toJSON());
  }

  /** Reviews de um usuário */
  async getUserReviews(userId: string): Promise<Review[]> {
    return this.findWhere('userId', '==', userId);
  }

  /** Reviews de um jogo */
  async getGameReviews(gameId: string, limitTo = 20): Promise<Review[]> {
    return this.findWhere('gameId', '==', gameId, { limitTo });
  }

  async getUserGameReview(userId: string, gameId: string): Promise<Review | null> {
    return this.findById(`${userId}_${gameId}`);
  }

  /** Exclui uma review */
  async deleteReview(reviewId: string): Promise<void> {
    await super.delete(reviewId);
  }
}

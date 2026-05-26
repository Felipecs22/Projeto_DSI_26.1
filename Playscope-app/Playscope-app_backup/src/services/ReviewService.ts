import { Game } from '../models/Game';
import { Review } from '../models/Review';
import { User } from '../models/User';
import { ReviewRepository } from '../repositories/ReviewRepository';

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
}

export class ReviewService {
  private static instance: ReviewService;
  private repository = new ReviewRepository();

  static getInstance(): ReviewService {
    if (!ReviewService.instance) {
      ReviewService.instance = new ReviewService();
    }

    return ReviewService.instance;
  }

  async saveReview(user: User, game: Game, rating: number, text: string): Promise<void> {
    const existing = await this.repository.getUserGameReview(user.uid, game.id);

    const review = new Review({
      id: `${user.uid}_${game.id}`,
      userId: user.uid,
      gameId: game.id,
      gameName: game.name,
      username: user.username,
      userDisplayName: user.displayName,
      rating,
      text: text.trim(),
      createdAt: existing?.createdAt,
      updatedAt: new Date().toISOString(),
    });

    await this.repository.upsert(review);
  }

  async deleteReview(reviewId: string): Promise<void> {
    await this.repository.deleteReview(reviewId);
  }

  async deleteUserReviews(userId: string): Promise<void> {
    const reviews = await this.getUserReviews(userId);
    await Promise.all(reviews.map((review) => this.repository.deleteReview(review.id)));
  }

  async getUserReviews(userId: string): Promise<Review[]> {
    const reviews = await this.repository.getUserReviews(userId);
    return reviews.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async getGameReviews(gameId: string): Promise<Review[]> {
    const reviews = await this.repository.getGameReviews(gameId, 50);
    return reviews.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async getUserGameReview(userId: string, gameId: string): Promise<Review | null> {
    return this.repository.getUserGameReview(userId, gameId);
  }

  getSummary(reviews: Review[]): ReviewSummary {
    if (reviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);

    return {
      averageRating: Number((total / reviews.length).toFixed(1)),
      totalReviews: reviews.length,
    };
  }
}

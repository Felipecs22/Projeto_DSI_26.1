import { Game } from '../models/Game';
import { Review } from '../models/Review';
import { User } from '../models/User';
import { ReviewRepository } from '../repositories/ReviewRepository';
import { UserRepository } from '../repositories/UserRepository';

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
}

export class ReviewService {
  private static instance: ReviewService;
  private repository = new ReviewRepository();
  private userRepository = new UserRepository();

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

  async getRecentPublicReviews(limitTo = 10): Promise<Review[]> {
    const reviews = await this.repository.findAll();
    const sortedReviews = reviews
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, Math.max(limitTo * 3, limitTo));

    const authorIds = [...new Set(sortedReviews.map((review) => review.userId))];
    const authors = await Promise.all(authorIds.map((userId) => this.userRepository.findById(userId)));
    const authorMap = new Map(
      authors
        .filter((user): user is User => user !== null)
        .map((user) => [user.uid, user]),
    );

    return sortedReviews
      .filter((review) => authorMap.get(review.userId)?.preferences.publicActivity)
      .map((review) => {
        const author = authorMap.get(review.userId);
        if (!author) return review;

        return new Review({
          ...review,
          username: author.username,
          userDisplayName: author.displayName,
        });
      })
      .slice(0, limitTo);
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

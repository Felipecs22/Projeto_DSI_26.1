import { FriendRelation } from '../models/FriendRelation';
import { Review } from '../models/Review';
import { User } from '../models/User';
import { LibraryService, type LibraryStats } from './LibraryService';
import { FriendRepository } from '../repositories/FriendRepository';
import { ReviewRepository } from '../repositories/ReviewRepository';
import { UserRepository } from '../repositories/UserRepository';

export interface FriendListItem {
  relation: FriendRelation;
  user: User;
}

export interface FriendProfileSnapshot {
  user: User;
  stats: LibraryStats;
  reviewCount: number;
}

export class FriendService {
  private static instance: FriendService;
  private friendRepo = new FriendRepository();
  private userRepo = new UserRepository();
  private reviewRepo = new ReviewRepository();
  private libraryService = LibraryService.getInstance();

  static getInstance(): FriendService {
    if (!FriendService.instance) {
      FriendService.instance = new FriendService();
    }

    return FriendService.instance;
  }

  async searchUserByUsername(currentUserId: string, username: string): Promise<User | null> {
    const normalized = User.normalizeUsername(username);
    const foundUser = await this.userRepo.findByUsername(normalized);

    if (!foundUser || foundUser.uid === currentUserId) {
      return null;
    }

    return foundUser;
  }

  async sendFriendRequest(currentUser: User, targetUser: User): Promise<void> {
    const relationId = FriendRelation.buildId(currentUser.uid, targetUser.uid);
    const existing = await this.friendRepo.findById(relationId);

    if (existing?.status === 'accepted') {
      throw new Error('Vocês já são amigos.');
    }

    if (existing?.status === 'pending') {
      if (existing.requestedTo === currentUser.uid) {
        throw new Error('Esse usuário já enviou um convite para você.');
      }

      throw new Error('Convite já enviado.');
    }

    const relation = new FriendRelation({
      id: relationId,
      memberIds: [currentUser.uid, targetUser.uid],
      requestedBy: currentUser.uid,
      requestedTo: targetUser.uid,
      status: 'pending',
      createdAt: existing?.createdAt,
      respondedAt: null,
      updatedAt: new Date().toISOString(),
    });

    await this.friendRepo.saveRelation(relation);
  }

  async acceptRequest(currentUserId: string, relationId: string): Promise<void> {
    const relation = await this.friendRepo.findById(relationId);

    if (!relation || relation.requestedTo !== currentUserId) {
      throw new Error('Convite inválido.');
    }

    await this.friendRepo.updateStatus(relationId, 'accepted', new Date().toISOString());
  }

  async declineRequest(currentUserId: string, relationId: string): Promise<void> {
    const relation = await this.friendRepo.findById(relationId);

    if (!relation || relation.requestedTo !== currentUserId) {
      throw new Error('Convite inválido.');
    }

    await this.friendRepo.updateStatus(relationId, 'declined', new Date().toISOString());
  }

  async removeFriend(currentUserId: string, relationId: string): Promise<void> {
    const relation = await this.friendRepo.findById(relationId);

    if (!relation || !relation.memberIds.includes(currentUserId)) {
      throw new Error('Amizade inválida.');
    }

    await this.friendRepo.delete(relationId);
  }

  async getFriends(currentUserId: string): Promise<FriendListItem[]> {
    const relations = await this.friendRepo.getUserRelations(currentUserId);
    const accepted = relations.filter((relation) => relation.status === 'accepted');
    return this.attachUsers(currentUserId, accepted);
  }

  async getReceivedRequests(currentUserId: string): Promise<FriendListItem[]> {
    const relations = await this.friendRepo.getUserRelations(currentUserId);
    const received = relations.filter(
      (relation) => relation.status === 'pending' && relation.requestedTo === currentUserId,
    );
    return this.attachUsers(currentUserId, received);
  }

  async getSentRequests(currentUserId: string): Promise<FriendListItem[]> {
    const relations = await this.friendRepo.getUserRelations(currentUserId);
    const sent = relations.filter(
      (relation) => relation.status === 'pending' && relation.requestedBy === currentUserId,
    );
    return this.attachUsers(currentUserId, sent);
  }

  async getFriendReviews(currentUserId: string): Promise<Review[]> {
    const friends = await this.getFriends(currentUserId);
    const publicFriends = friends.filter(({ user }) => user.preferences.publicActivity);

    const reviews = await Promise.all(
      publicFriends.map(({ user }) => this.reviewRepo.getUserReviews(user.uid)),
    );

    const userMap = new Map(publicFriends.map(({ user }) => [user.uid, user]));

    return reviews
      .flat()
      .map((review) => {
        const author = userMap.get(review.userId);
        if (!author) return review;

        return new Review({
          ...review,
          username: author.username,
          userDisplayName: author.displayName,
        });
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async getFriendProfile(currentUserId: string, friendId: string): Promise<FriendProfileSnapshot> {
    const relationId = FriendRelation.buildId(currentUserId, friendId);
    const relation = await this.friendRepo.findById(relationId);

    if (!relation || relation.status !== 'accepted') {
      throw new Error('Esse usuário não está na sua lista de amigos.');
    }

    const friend = await this.userRepo.findById(friendId);

    if (!friend) {
      throw new Error('Perfil do amigo não encontrado.');
    }

    const [library, reviews] = await Promise.all([
      this.libraryService.getUserLibrary(friendId),
      this.reviewRepo.getUserReviews(friendId),
    ]);

    return {
      user: friend,
      stats: this.libraryService.getStats(library),
      reviewCount: reviews.length,
    };
  }

  async clearUserRelations(userId: string): Promise<void> {
    const relations = await this.friendRepo.getUserRelations(userId);
    await Promise.all(relations.map((relation) => this.friendRepo.delete(relation.id)));
  }

  private async attachUsers(currentUserId: string, relations: FriendRelation[]): Promise<FriendListItem[]> {
    const items = await Promise.all(
      relations.map(async (relation) => {
        const otherUser = await this.userRepo.findById(relation.getOtherUserId(currentUserId));
        if (!otherUser) return null;
        return { relation, user: otherUser };
      }),
    );

    return items
      .filter((item): item is FriendListItem => item !== null)
      .sort((a, b) => a.user.displayName.localeCompare(b.user.displayName));
  }
}

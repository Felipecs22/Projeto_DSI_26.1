import { BaseRepository } from './BaseRepository';
import { FriendRelation, FriendRelationStatus } from '../models/FriendRelation';

export class FriendRepository extends BaseRepository<FriendRelation> {
  protected collectionName = 'friendRelations';

  protected toModel(data: Record<string, any>): FriendRelation {
    return FriendRelation.fromJSON(data);
  }

  async saveRelation(relation: FriendRelation): Promise<void> {
    await super.save(relation.id, relation.toJSON());
  }

  async getUserRelations(userId: string): Promise<FriendRelation[]> {
    return this.findWhere('memberIds', 'array-contains', userId);
  }

  async updateStatus(
    relationId: string,
    status: FriendRelationStatus,
    respondedAt?: string | null,
  ): Promise<void> {
    await super.update(relationId, {
      status,
      updatedAt: new Date().toISOString(),
      respondedAt: respondedAt ?? null,
    });
  }
}

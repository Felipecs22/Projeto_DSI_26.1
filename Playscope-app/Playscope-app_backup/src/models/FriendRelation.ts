export type FriendRelationStatus = 'pending' | 'accepted' | 'declined';

export class FriendRelation {
  readonly id: string;
  readonly memberIds: [string, string];
  requestedBy: string;
  requestedTo: string;
  status: FriendRelationStatus;
  readonly createdAt: string;
  updatedAt: string;
  respondedAt: string | null;

  constructor(data: {
    id?: string;
    memberIds: [string, string] | string[];
    requestedBy: string;
    requestedTo: string;
    status: FriendRelationStatus;
    createdAt?: string;
    updatedAt?: string;
    respondedAt?: string | null;
  }) {
    const [a, b] = FriendRelation.normalizeMemberIds(data.memberIds);
    this.id = data.id ?? FriendRelation.buildId(a, b);
    this.memberIds = [a, b];
    this.requestedBy = data.requestedBy;
    this.requestedTo = data.requestedTo;
    this.status = data.status;
    this.createdAt = data.createdAt ?? new Date().toISOString();
    this.updatedAt = data.updatedAt ?? this.createdAt;
    this.respondedAt = data.respondedAt ?? null;
  }

  static buildId(userA: string, userB: string): string {
    return FriendRelation.normalizeMemberIds([userA, userB]).join('_');
  }

  static normalizeMemberIds(memberIds: string[] | [string, string]): [string, string] {
    const normalized = [...memberIds].sort();
    return [normalized[0], normalized[1]];
  }

  getOtherUserId(userId: string): string {
    return this.memberIds[0] === userId ? this.memberIds[1] : this.memberIds[0];
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      memberIds: this.memberIds,
      requestedBy: this.requestedBy,
      requestedTo: this.requestedTo,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      respondedAt: this.respondedAt,
    };
  }

  static fromJSON(data: Record<string, any>): FriendRelation {
    return new FriendRelation(data as any);
  }
}

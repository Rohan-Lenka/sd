export enum ContentStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  REJECTED = 'REJECTED',
  SCHEDULED = 'SCHEDULED',
  ARCHIVED = 'ARCHIVED',
}

export const ContentStatusValues = [
  ContentStatus.DRAFT,
  ContentStatus.PENDING,
  ContentStatus.APPROVED,
  ContentStatus.PUBLISHED,
  ContentStatus.REJECTED,
  ContentStatus.SCHEDULED,
  ContentStatus.ARCHIVED,
];

export interface Snippet {
  id: number;
  markdown: string;
  userId?: string;
  createdAt: Date;
  expiresAt?: Date;
  expirationHours?: number;
  shareCode: string;
}

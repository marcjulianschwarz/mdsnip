import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DBService } from 'src/db.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class SessionService {
  private readonly logger: Logger = new Logger(SessionService.name);

  constructor(private readonly dbService: DBService) {}

  async createSession(userId: string, user: User) {
    const sessionId = randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    this.createSessionDB(sessionId, userId, user, expiresAt);
    return sessionId;
  }

  createSessionDB(
    sessionId: string,
    userId: string,
    data: any,
    expiresAt: Date,
  ) {
    this.logger.debug(`Adding new session to database for ${userId}`);
    const query =
      'INSERT INTO sessions (id, user_id, data, expires_at) VALUES ($1, $2, $3, $4)';
    this.dbService.pool.query(query, [sessionId, userId, data, expiresAt]);
  }

  async getSession(sessionId: string) {
    const query =
      'SELECT * FROM sessions WHERE id = $1 AND expires_at > NOW() AND deleted_at IS NULL';
    const result = await this.dbService.pool.query(query, [sessionId]);
    return result.rows[0];
  }

  async deleteSession(sessionId: string) {
    const query = 'UPDATE sessions SET deleted_at = NOW() WHERE id = $1';
    await this.dbService.pool.query(query, [sessionId]);
  }

  async cleanupSessions() {
    const query = 'DELETE FROM sessions WHERE expires_at < NOW()';
    await this.dbService.pool.query(query);
  }
}

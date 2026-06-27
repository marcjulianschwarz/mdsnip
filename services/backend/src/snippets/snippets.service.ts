import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DBService } from 'src/db.service';
import { Snippet } from './snippets.entity';
import { compare, hash } from 'bcrypt';

@Injectable()
export class SnippetsService {
  private readonly logger: Logger = new Logger(SnippetsService.name);

  constructor(private readonly dbService: DBService) {}

  private randomId(length: number = 8) {
    const alphabet =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from(
      { length },
      () => alphabet[Math.floor(Math.random() * alphabet.length)],
    ).join('');
  }

  async createSnippet(
    markdown: string,
    userId?: string,
    expirationHours?: number,
    password?: string,
  ): Promise<Snippet> {
    const client = await this.dbService.pool.connect();

    try {
      await client.query('BEGIN');

      let shareCode: string | null = null;
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        shareCode = this.randomId(8);

        const checkResult = await client.query(
          'SELECT id FROM snippets WHERE share_code = $1',
          [shareCode],
        );

        if (checkResult.rows.length === 0) {
          break;
        } else {
          attempts++;
        }
      }

      if (attempts == maxAttempts || !shareCode) {
        throw new HttpException(
          'Failed to generate unique shareCode',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const createdAt = new Date(Date.now());
      const expiresAt = expirationHours
        ? new Date(createdAt.getTime() + expirationHours * 60 * 60 * 1000)
        : null;

      const passwordHash = password ? await hash(password, 10) : null;

      const query = `
            INSERT INTO snippets (
              markdown,
              share_code,
              user_id,
              created_at,
              expires_at,
              expiration_hours,
              password_hash
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING
              id,
              markdown,
              share_code AS "shareCode",
              created_at AS "createdAt",
              user_id AS "userId",
              expires_at AS "expiresAt",
              expiration_hours AS "expirationHours",
              password_hash AS "passwordHash"
          `;

      const result = await client.query<Snippet>(query, [
        markdown,
        shareCode,
        userId || null,
        createdAt,
        expiresAt,
        expirationHours || null,
        passwordHash,
      ]);
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async updateSnippet(
    snippetId: string,
    data: {
      markdown?: string;
      expirationHours?: number | null;
      password?: string | null;
    },
  ): Promise<Snippet> {
    const client = await this.dbService.pool.connect();

    try {
      await client.query('BEGIN');

      // First check if snippet exists
      const checkQuery = `
        SELECT id, expires_at, created_at 
        FROM snippets 
        WHERE id = $1
      `;
      const checkResult = await client.query(checkQuery, [snippetId]);

      if (checkResult.rows.length === 0) {
        throw new HttpException('Snippet not found', HttpStatus.NOT_FOUND);
      }

      // Calculate new expiration if expirationHours is provided
      let expiresAt = checkResult.rows[0].expires_at;
      if (data.expirationHours !== undefined) {
        expiresAt = data.expirationHours
          ? new Date(
              checkResult.rows[0].created_at.getTime() +
                data.expirationHours * 60 * 60 * 1000,
            )
          : null;
      }

      // Build update query dynamically based on provided fields
      const updates: string[] = [];
      const values: (string | number | null)[] = [];
      let valueCount = 1;

      if (data.markdown !== undefined) {
        updates.push(`markdown = $${valueCount}`);
        values.push(data.markdown);
        valueCount++;
      }

      if (data.expirationHours !== undefined) {
        updates.push(`expires_at = $${valueCount}`);
        values.push(expiresAt);
        valueCount++;
        updates.push(`expiration_hours = $${valueCount}`);
        values.push(data.expirationHours);
        valueCount++;
      }

      if (data.password !== undefined) {
        const newHash =
          data.password === null || data.password === ''
            ? null
            : await hash(data.password, 10);
        updates.push(`password_hash = $${valueCount}`);
        values.push(newHash);
        valueCount++;
      }

      if (updates.length === 0) {
        throw new HttpException(
          'No valid fields provided for update',
          HttpStatus.BAD_REQUEST,
        );
      }

      const updateQuery = `
        UPDATE snippets 
        SET ${updates.join(', ')}
        WHERE id = $${valueCount}
        RETURNING 
          id, 
          markdown, 
          share_code AS "shareCode", 
          user_id AS "userId",
          created_at AS "createdAt",
          expires_at AS "expiresAt",
          expiration_hours AS "expirationHours"
      `;

      values.push(snippetId);
      const result = await client.query<Snippet>(updateQuery, values);

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Failed to update snippet:', error);
      throw new HttpException(
        'Failed to update snippet',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      client.release();
    }
  }

  async unlockSnippet(
    shareCode: string,
    password: string,
  ): Promise<Snippet | 'invalid'> {
    const snippet = await this.getSnippet(shareCode);
    if (!snippet) return 'invalid';
    if (!snippet.passwordHash) return snippet;
    const ok = await compare(password, snippet.passwordHash);
    if (!ok) return 'invalid';
    return snippet;
  }

  async snippetExists(shareCode: string): Promise<boolean> {
    const result = await this.dbService.pool.query<{ exists: boolean }>(
      `SELECT EXISTS(SELECT 1 FROM snippets WHERE share_code = $1) AS exists`,
      [shareCode],
    );
    return result.rows[0]?.exists ?? false;
  }

  async getSnippet(shareCode: string) {
    const query = `SELECT
        id,
        markdown,
        share_code as "shareCode",
        created_at as "createdAt",
        expires_at as "expiresAt",
        expiration_hours as "expirationHours",
        password_hash as "passwordHash"
      FROM snippets
      WHERE share_code = $1
      AND (expires_at IS NULL OR expires_at > NOW())`;
    const result = await this.dbService.pool.query<Snippet>(query, [shareCode]);
    const rows = result.rows;
    if (rows.length === 0) {
      this.logger.debug(
        `Snippet with code ${shareCode} is expired or not found.`,
      );
      return null;
    }
    if (rows.length === 1) {
      return rows[0];
    }
    throw new Error(
      `Snippet with shareCodes ${shareCode} exists more than once.`,
    );
  }

  async getSnippetByUserId(userId: string): Promise<Snippet[]> {
    const query = `
        SELECT 
          id, 
          markdown, 
          share_code as "shareCode", 
          user_id as "userId", 
          created_at as "createdAt",
          expires_at as "expiresAt",
          expiration_hours as "expirationHours",
          (password_hash IS NOT NULL) as "hasPassword"
        FROM snippets
        WHERE user_id = $1
        ORDER BY created_at DESC
    `;
    const result = await this.dbService.pool.query<Snippet>(query, [userId]);
    return result.rows;
  }

  async deleteSnippet(snippetId: string) {
    const query = `
        DELETE FROM snippets 
        WHERE id = $1 
        RETURNING id, share_code AS "shareCode"
      `;

    const client = await this.dbService.pool.connect();

    try {
      await client.query('BEGIN');
      const result = await client.query(query, [snippetId]);
      console.log(snippetId);
      console.log(result.rows);

      if (result.rowCount === 0) {
        throw new HttpException('Snippet not found', HttpStatus.NOT_FOUND);
      }

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete snippet',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      client.release();
    }
  }
}

import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, types } from 'pg';

@Injectable()
export class DBService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DBService.name);
  pool: Pool;

  constructor(private readonly configService: ConfigService) {
    types.setTypeParser(1114, (str) => new Date(str));
  }

  async onModuleInit() {
    const host = this.configService.get('POSTGRES_HOST');
    const port = this.configService.get('POSTGRES_PORT');
    const database = this.configService.get('POSTGRES_DB');
    const user = this.configService.get('POSTGRES_USER');
    const password = this.configService.get('POSTGRES_PASSWORD');

    try {
      this.pool = new Pool({
        host: host,
        port: port,
        database: database,
        user: user,
        password: password,
      });

      await this.initializeTables();
      this.logger.log('Connected to PostgreSQL database');
    } catch (error) {
      this.logger.error('Error connecting to PostgreSQL:', error);
      throw new HttpException(
        'Database connection failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async initializeTables() {
    const createTables = `
    -- First create the tables
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS snippets (
      id SERIAL PRIMARY KEY,
      markdown TEXT NOT NULL,
      share_code TEXT NOT NULL,
      user_id UUID REFERENCES users(id),
      created_at TIMESTAMP WITH TIME ZONE,
      expires_at TIMESTAMP WITH TIME ZONE,
      expiration_hours INTEGER
    );

    CREATE TABLE IF NOT EXISTS user_preferences (
      user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      preferences JSONB NOT NULL DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL,
      data JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      deleted_at TIMESTAMP WITH TIME ZONE
    );
    `;

    const createIndexes = `
    -- Then create the indexes after tables exist
    CREATE INDEX IF NOT EXISTS idx_snippets_user_id ON snippets(user_id);
    CREATE INDEX IF NOT EXISTS idx_snippets_share_code ON snippets(share_code);
    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
    `;

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(createTables);
      await client.query(createIndexes);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async resetDatabase() {
    const client = await this.pool.connect();
    try {
      // Drop the table if it exists
      await client.query('DROP TABLE IF EXISTS snippets CASCADE');
      await client.query('DROP TABLE IF EXISTS users CASCADE');
      await client.query('DROP TABLE IF EXISTS sessions CASCADE');

      // Recreate the table
      await this.initializeTables();

      this.logger.log('Database reset completed successfully');
    } catch (error) {
      await client.query('ROLLBACK');
      this.logger.error('Error resetting database:', error);
      throw new HttpException(
        'Failed to reset database',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      client.release();
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}

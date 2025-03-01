import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { DBService } from 'src/db.service';
import { DBUser, User } from './user.entity';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(private readonly dbService: DBService) {}

  async getUser(username: string) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await this.dbService.pool.query<DBUser>(query, [username]);
    return result.rows[0];
  }

  async getUserById(userId: string) {
    const query = 'SELECT username, id FROM users WHERE id = $1';
    const result = await this.dbService.pool.query<User>(query, [userId]);
    return result.rows[0];
  }

  async userExists(username: string) {
    this.logger.debug(`Checking existence for user ${username}`);
    const query = 'SELECT id FROM users WHERE username = $1';
    const result = await this.dbService.pool.query(query, [username]);
    return result.rowCount && result.rowCount > 0;
  }

  async createUser(username: string, password: string) {
    if (await this.userExists(username)) {
      const msg = 'User with this username already exists.';
      this.logger.warn(msg);
      throw new ConflictException(msg);
    }
    this.logger.debug(
      `User does not exist yet, adding ${username} to database`,
    );

    const query =
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username';
    const result = await this.dbService.pool.query<User>(query, [
      username,
      password,
    ]);

    this.logger.debug(`Added ${username} to database.`);
    return result.rows[0];
  }
}

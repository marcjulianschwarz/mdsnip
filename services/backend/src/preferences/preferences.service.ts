import { Injectable } from '@nestjs/common';
import { DBService } from 'src/db.service';
import { Preferences } from './preferences.entity';

@Injectable()
export class PreferencesService {
  constructor(private readonly dbService: DBService) {}

  async getPreferences(userId: string) {
    const query = `SELECT preferences FROM user_preferences WHERE user_id = $1`;
    const result = await this.dbService.pool.query(query, [userId]);
    return (result.rows[0]?.preferences as Preferences) || null;
  }

  async setPreferences(userId: string, key: string, value: any) {
    const query = `
        INSERT INTO user_preferences (user_id, preferences)
        VALUES ($1, $2)
        ON CONFLICT (user_id) DO UPDATE
        SET
            preferences = user_preferences.preferences || $2
        RETURNING preferences
    `;
    const preferenceObject = { [key]: value };
    const result = await this.dbService.pool.query(query, [
      userId,
      preferenceObject,
    ]);
    return result.rows[0].preferences as Preferences;
  }
}

import * as SQLite from 'expo-sqlite';

const DB_NAME = 'duafyi.db';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initialize(): Promise<void> {
    this.db = await SQLite.openDatabaseAsync(DB_NAME);
    
    // Create tables
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS favorites (
        dua_id TEXT PRIMARY KEY,
        chapter_id INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        synced INTEGER NOT NULL DEFAULT 0
      );
      
      CREATE TABLE IF NOT EXISTS sync_meta (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
  }

  // Add a favorite
  async addFavorite(duaId: string, chapterId: number): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.runAsync(
      'INSERT OR REPLACE INTO favorites (dua_id, chapter_id, synced) VALUES (?, ?, 0)',
      [duaId, chapterId]
    );
  }

  // Remove a favorite
  async removeFavorite(duaId: string): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.runAsync('DELETE FROM favorites WHERE dua_id = ?', [duaId]);
  }

  // Check if a dua is favorited
  async isFavorite(duaId: string): Promise<boolean> {
    if (!this.db) await this.initialize();
    const result = await this.db!.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM favorites WHERE dua_id = ?',
      [duaId]
    );
    return (result?.count ?? 0) > 0;
  }

  // Get all favorite dua IDs
  async getAllFavoriteIds(): Promise<string[]> {
    if (!this.db) await this.initialize();
    const results = await this.db!.getAllAsync<{ dua_id: string }>(
      'SELECT dua_id FROM favorites ORDER BY created_at DESC'
    );
    return results.map(r => r.dua_id);
  }

  // Get all favorites with chapter info (for the Favorites tab)
  async getAllFavorites(): Promise<Array<{ duaId: string; chapterId: number; createdAt: string }>> {
    if (!this.db) await this.initialize();
    const results = await this.db!.getAllAsync<{ dua_id: string; chapter_id: number; created_at: string }>(
      'SELECT dua_id, chapter_id, created_at FROM favorites ORDER BY created_at DESC'
    );
    return results.map(r => ({
      duaId: r.dua_id,
      chapterId: r.chapter_id,
      createdAt: r.created_at,
    }));
  }

  // Get unsynced favorites (for Supabase sync)
  async getUnsyncedFavorites(): Promise<Array<{ duaId: string; chapterId: number }>> {
    if (!this.db) await this.initialize();
    const results = await this.db!.getAllAsync<{ dua_id: string; chapter_id: number }>(
      'SELECT dua_id, chapter_id FROM favorites WHERE synced = 0'
    );
    return results.map(r => ({ duaId: r.dua_id, chapterId: r.chapter_id }));
  }

  // Mark favorites as synced
  async markAsSynced(duaIds: string[]): Promise<void> {
    if (!this.db || duaIds.length === 0) return;
    const placeholders = duaIds.map(() => '?').join(',');
    await this.db!.runAsync(
      `UPDATE favorites SET synced = 1 WHERE dua_id IN (${placeholders})`,
      duaIds
    );
  }

  // Get favorite count
  async getFavoriteCount(): Promise<number> {
    if (!this.db) await this.initialize();
    const result = await this.db!.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM favorites'
    );
    return result?.count ?? 0;
  }
}

export const database = new DatabaseService();

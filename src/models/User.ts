import { getPool } from '../database';

export interface User {
  id: number;
  email: string;
  passwordHash: string;
  isAdmin: boolean;
  isVerified: boolean;
  createdAt: Date;
}

export class UserModel {
  static async findAll(): Promise<User[]> {
    const pool = await getPool();
    const [rows] = await pool.execute('SELECT * FROM users ORDER BY createdAt DESC');
    return rows as User[];
  }
}


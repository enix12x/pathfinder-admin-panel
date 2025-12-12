import { Response } from 'express';
import axios from 'axios';
import { AuthRequest } from '../middleware/auth';
import { loadConfig } from '../config';

export class UserController {
  static async index(req: AuthRequest, res: Response) {
    try {
      const config = loadConfig();
      const response = await axios.get(`${config.authServerUrl}/api/admin/users`, {
        headers: {
          Cookie: req.headers.cookie || ''
        },
        withCredentials: true
      });

      res.render('users', {
        users: response.data.users,
        user: req.user
      });
    } catch (error: any) {
      res.status(500).render('error', { error: error.message });
    }
  }

  static async promoteAdmin(req: AuthRequest, res: Response) {
    try {
      const config = loadConfig();
      await axios.post(`${config.authServerUrl}/api/admin/users/promote`, req.body, {
        headers: {
          Cookie: req.headers.cookie || ''
        },
        withCredentials: true
      });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.response?.data?.error || 'Failed to promote user' });
    }
  }

  static async demoteAdmin(req: AuthRequest, res: Response) {
    try {
      const config = loadConfig();
      await axios.post(`${config.authServerUrl}/api/admin/users/demote`, req.body, {
        headers: {
          Cookie: req.headers.cookie || ''
        },
        withCredentials: true
      });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.response?.data?.error || 'Failed to demote user' });
    }
  }

  static async verifyUser(req: AuthRequest, res: Response) {
    try {
      const config = loadConfig();
      await axios.post(`${config.authServerUrl}/api/admin/users/verify`, req.body, {
        headers: {
          Cookie: req.headers.cookie || ''
        },
        withCredentials: true
      });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.response?.data?.error || 'Failed to verify user' });
    }
  }

  static async unverifyUser(req: AuthRequest, res: Response) {
    try {
      const config = loadConfig();
      await axios.post(`${config.authServerUrl}/api/admin/users/unverify`, req.body, {
        headers: {
          Cookie: req.headers.cookie || ''
        },
        withCredentials: true
      });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.response?.data?.error || 'Failed to unverify user' });
    }
  }

  static async deleteUser(req: AuthRequest, res: Response) {
    try {
      const config = loadConfig();
      await axios.post(`${config.authServerUrl}/api/admin/users/delete`, req.body, {
        headers: {
          Cookie: req.headers.cookie || ''
        },
        withCredentials: true
      });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.response?.data?.error || 'Failed to delete user' });
    }
  }
}


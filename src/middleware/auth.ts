import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { loadConfig } from '../config';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    isAdmin: boolean;
  };
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const config = loadConfig();
    const token = req.cookies?.token;
    
    if (!token) {
      return res.redirect('/login');
    }

    try {
      const response = await axios.get(`${config.authServerUrl}/api/auth/verify`, {
        headers: {
          Cookie: `token=${token}`
        },
        withCredentials: true
      });

      if (response.data.success && response.data.user.isAdmin) {
        req.user = {
          id: response.data.user.id,
          email: response.data.user.email,
          isAdmin: response.data.user.isAdmin
        };
        return next();
      }
    } catch (error) {
      // Token invalid or expired
    }

    res.redirect('/login');
  } catch (error) {
    res.redirect('/login');
  }
}


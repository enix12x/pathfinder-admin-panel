import { Request, Response } from 'express';
import axios from 'axios';
import { loadConfig } from '../config';

export class AuthController {
  static async loginPage(req: Request, res: Response) {
    res.render('login', { error: null, message: null });
  }

  static async login(req: Request, res: Response) {
    try {
      const config = loadConfig();
      const { email, password } = req.body;

      const response = await axios.post(`${config.authServerUrl}/api/auth/login`, {
        email,
        password
      }, {
        withCredentials: true
      });

      if (response.data.success && response.data.user.isAdmin) {
        const cookies = response.headers['set-cookie'];
        if (cookies) {
          cookies.forEach((cookie: string) => {
            if (cookie.startsWith('token=')) {
              res.setHeader('Set-Cookie', cookie);
            }
          });
        }
        res.redirect('/');
      } else {
        res.render('login', { error: 'Admin access required', message: null });
      }
    } catch (error: any) {
      res.render('login', { error: error.response?.data?.error || 'Login failed', message: null });
    }
  }

  static async logout(req: Request, res: Response) {
    const config = loadConfig();
    try {
      await axios.post(`${config.authServerUrl}/api/auth/logout`, {}, {
        headers: {
          Cookie: req.headers.cookie || ''
        },
        withCredentials: true
      });
    } catch (error) {
      // Ignore errors
    }
    res.clearCookie('token');
    res.redirect('/login');
  }

  static async registerPage(req: Request, res: Response) {
    res.render('register', { error: null, message: null });
  }

  static async register(req: Request, res: Response) {
    try {
      const config = loadConfig();
      const { email, password } = req.body;

      const response = await axios.post(`${config.authServerUrl}/api/auth/register`, {
        email,
        password
      }, {
        withCredentials: true
      });

      if (response.data.success && response.data.user.isAdmin) {
        // Check if verification is required
        if (response.data.requiresVerification) {
          res.render('register', { 
            error: null,
            message: 'Registration successful! Please wait for admin verification before logging in.'
          });
          return;
        }
        
        const cookies = response.headers['set-cookie'];
        if (cookies) {
          cookies.forEach((cookie: string) => {
            if (cookie.startsWith('token=')) {
              res.setHeader('Set-Cookie', cookie);
            }
          });
        }
        res.redirect('/');
      } else {
        res.render('register', { error: 'Registration failed or admin access required', message: null });
      }
    } catch (error: any) {
      res.render('register', { error: error.response?.data?.error || 'Registration failed', message: null });
    }
  }
}

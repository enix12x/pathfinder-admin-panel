import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { LinkModel } from '../models/Link';
import { UserModel } from '../models/User';
import { loadConfig } from '../config';

export class LinkController {
  static async index(req: AuthRequest, res: Response) {
    try {
      const links = await LinkModel.findAll();
      const users = await UserModel.findAll();
      const config = loadConfig();
      
      // Build tree structure
      const buildTree = (parentId: number | null = null): any[] => {
        return links
          .filter(l => l.parentId === parentId)
          .map(link => ({
            ...link,
            children: buildTree(link.id)
          }));
      };

      const linkTree = buildTree();

      res.render('links', {
        links: linkTree,
        allLinks: links,
        users,
        user: req.user
      });
    } catch (error: any) {
      res.status(500).render('error', { error: error.message });
    }
  }

  static async create(req: AuthRequest, res: Response) {
    try {
      const { parentId, title, url, submenu, description, password, disclaimer, visibility } = req.body;
      
      const link = await LinkModel.create({
        parentId: parentId ? parseInt(parentId) : null,
        title,
        url: submenu === 'true' ? null : url,
        submenu: submenu === 'true',
        description: description || null,
        password: password || null,
        disclaimer: disclaimer || null,
        visibility: visibility || 'all',
        createdByUserId: req.user!.id
      });

      // Handle visibility
      if (visibility === 'specific' && req.body.userIds) {
        const userIds = Array.isArray(req.body.userIds) 
          ? req.body.userIds.map((id: string) => parseInt(id))
          : [parseInt(req.body.userIds)];
        await LinkModel.setVisibility(link.id, userIds);
      }

      res.json({ success: true, link });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { parentId, title, url, submenu, description, password, disclaimer, visibility } = req.body;

      await LinkModel.update(parseInt(id), {
        parentId: parentId ? parseInt(parentId) : null,
        title,
        url: submenu === 'true' ? null : url,
        submenu: submenu === 'true',
        description: description || null,
        password: password || null,
        disclaimer: disclaimer || null,
        visibility: visibility || 'all'
      });

      // Handle visibility
      if (visibility === 'specific' && req.body.userIds) {
        const userIds = Array.isArray(req.body.userIds) 
          ? req.body.userIds.map((id: string) => parseInt(id))
          : [parseInt(req.body.userIds)];
        await LinkModel.setVisibility(parseInt(id), userIds);
      } else if (visibility === 'all') {
        await LinkModel.setVisibility(parseInt(id), []);
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      await LinkModel.delete(parseInt(id));
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getVisibility(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userIds = await LinkModel.getVisibilityUsers(parseInt(id));
      res.json({ success: true, userIds });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

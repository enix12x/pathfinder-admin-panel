import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { UserController } from '../controllers/userController';
import { LinkController } from '../controllers/linkController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/login', AuthController.loginPage);
router.post('/login', AuthController.login);
router.get('/register', AuthController.registerPage);
router.post('/register', AuthController.register);
router.post('/logout', requireAuth, AuthController.logout);

router.get('/', requireAuth, (req, res) => {
  res.render('dashboard', { user: (req as any).user });
});

router.get('/users', requireAuth, UserController.index);
router.post('/users/promote', requireAuth, UserController.promoteAdmin);
router.post('/users/demote', requireAuth, UserController.demoteAdmin);
router.post('/users/verify', requireAuth, UserController.verifyUser);
router.post('/users/unverify', requireAuth, UserController.unverifyUser);
router.post('/users/delete', requireAuth, UserController.deleteUser);

router.get('/links', requireAuth, LinkController.index);
router.post('/links', requireAuth, LinkController.create);
router.put('/links/:id', requireAuth, LinkController.update);
router.delete('/links/:id', requireAuth, LinkController.delete);
router.get('/links/:id/visibility', requireAuth, LinkController.getVisibility);

export default router;


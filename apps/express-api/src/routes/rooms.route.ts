// Express
import { Router } from 'express';

// Controllers
import { createRoom } from '../controllers/rooms.controller';

// Middleware
import { authenticateUser } from '../middleware/users.middleware';

const router: Router = Router();

// Protected routes
router.post('/', authenticateUser, createRoom);

export default router;

// Express
import { Router } from 'express';

// Controllers
import { createRoom, getRooms } from '../controllers/rooms.controller';

// Middleware
import { authenticateUser } from '../middleware/users.middleware';

const router: Router = Router();

// Protected routes
router.get('/', authenticateUser, getRooms);
router.post('/', authenticateUser, createRoom);

export default router;

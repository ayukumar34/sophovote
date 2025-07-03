// Express
import { Router } from 'express';

// Controllers
import {
  createRoom,
  getRooms,
  deleteRoom,
} from '../controllers/rooms.controller';

// Middleware
import { authenticateUser } from '../middleware/users.middleware';

const router: Router = Router();

// Protected routes
router.get('/', authenticateUser, getRooms);
router.post('/', authenticateUser, createRoom);
router.delete('/:id', authenticateUser, deleteRoom);

export default router;

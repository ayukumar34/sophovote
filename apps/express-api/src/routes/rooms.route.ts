// Express
import { Router } from 'express';

// Controllers
import {
  createRoom,
  getRooms,
  deleteRoom,
  refreshRoomCode,
} from '../controllers/rooms.controller';

// Middleware
import { authenticateUser } from '../middleware/users.middleware';

const router: Router = Router();

// Protected routes
router.get('/', authenticateUser, getRooms);
router.post('/', authenticateUser, createRoom);
router.patch('/:id/refresh-code', authenticateUser, refreshRoomCode);
router.delete('/:id', authenticateUser, deleteRoom);

export default router;

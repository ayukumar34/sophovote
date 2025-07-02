// Express
import { Request, Response } from 'express';

// Crypto
import { randomUUID } from 'crypto';

// Database
import { db, schema, Room } from '@repo/database';

// Utilities
import { asyncHandler } from '../utils/async-handler';

// Types
interface CreateRoomRequest {
  name: string;
}

// Helper function to generate room code
const generateRoomCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
};

// Helper function to generate room slug
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Create a new room
export const createRoom = asyncHandler(async (req: Request, res: Response) => {
  const { name }: CreateRoomRequest = req.body;

  // Get user
  const user = (req as any).user;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Bad Request'
    });
  }

  if (!user || !user.id) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  // Generate room ID
  const id = randomUUID();

  // Generate room slug
  const uniqueId = id.replace(/-/g, '').substring(0, 6);
  const nameSlug = generateSlug(name);
  const slug = `${nameSlug}-${uniqueId}`;

  // Generate room code
  const code = generateRoomCode();

  // Create room
  const [room]: Room[] = await db.insert(schema.rooms).values({
    id: id,
    userId: user.id,
    name: name,
    slug: slug,
    code: code,
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning();

  if (!room) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      room: {
        id: room.id,
        name: room.name,
        slug: room.slug,
        code: room.code,
        isActive: room.isActive,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt
      }
    }
  });
});

// Express
import { Request, Response } from 'express';

// Crypto
import { randomUUID } from 'crypto';

// Database
import { db, schema, Room } from '@repo/database';
import { eq, and } from 'drizzle-orm';

// Utilities
import { asyncHandler } from '../utils/async-handler';

// Types
interface CreateRoomRequest {
  name: string;
  description?: string;
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

// Get all rooms for a user
export const getRooms = asyncHandler(async (req: Request, res: Response) => {
  // Get user
  const user = (req as any).user;

  if (!user || !user.id) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  try {
    // Get all rooms for the user
    const rooms: Room[] = await db
      .select()
      .from(schema.rooms)
      .where(eq(schema.rooms.userId, user.id));

    res.status(200).json({
      success: true,
      data: {
        rooms: rooms.map(room => ({
          id: room.id,
          name: room.name,
          description: room.description,
          slug: room.slug,
          code: room.code,
          isActive: room.isActive,
          createdAt: room.createdAt,
          updatedAt: room.updatedAt
        }))
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});

// Create a new room
export const createRoom = asyncHandler(async (req: Request, res: Response) => {
  const { name, description }: CreateRoomRequest = req.body;

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
    description: description,
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
        description: room.description,
        slug: room.slug,
        code: room.code,
        isActive: room.isActive,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt
      }
    }
  });
});

// Refresh room code
export const refreshRoomCode = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Get user
  const user = (req as any).user;

  if (!id) {
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

  try {
    // Get room
    const [existingRoom]: Room[] = await db
      .select()
      .from(schema.rooms)
      .where(and(
        eq(schema.rooms.id, id),
        eq(schema.rooms.userId, user.id)
      ));

    if (!existingRoom) {
      return res.status(404).json({
        success: false,
        message: 'Not Found'
      });
    }

    // Generate code
    const newCode = generateRoomCode();

    // Update room
    const [updatedRoom]: Room[] = await db
      .update(schema.rooms)
      .set({
        code: newCode,
        updatedAt: new Date()
      })
      .where(and(
        eq(schema.rooms.id, id),
        eq(schema.rooms.userId, user.id)
      ))
      .returning();

    if (!updatedRoom) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        room: {
          id: updatedRoom.id,
          name: updatedRoom.name,
          description: updatedRoom.description,
          slug: updatedRoom.slug,
          code: updatedRoom.code,
          isActive: updatedRoom.isActive,
          createdAt: updatedRoom.createdAt,
          updatedAt: updatedRoom.updatedAt
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});

// Delete a room by ID
export const deleteRoom = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Get user
  const user = (req as any).user;

  if (!id) {
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

  try {
    // Get room
    const [existingRoom]: Room[] = await db
      .select()
      .from(schema.rooms)
      .where(and(
        eq(schema.rooms.id, id),
        eq(schema.rooms.userId, user.id)
      ));

    if (!existingRoom) {
      return res.status(404).json({
        success: false,
        message: 'Not Found'
      });
    }

    // Delete room
    await db
      .delete(schema.rooms)
      .where(and(
        eq(schema.rooms.id, id),
        eq(schema.rooms.userId, user.id)
      ));

    res.status(200).json({
      success: true,
      data: {
        room: {
          id: existingRoom.id,
          name: existingRoom.name,
          description: existingRoom.description,
          slug: existingRoom.slug,
          code: existingRoom.code,
          isActive: existingRoom.isActive,
          createdAt: existingRoom.createdAt,
          updatedAt: existingRoom.updatedAt
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});

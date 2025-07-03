// React Query
import {
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";

// Utilities
import { api } from "@/lib/api-handler";

// Types
import { type Room } from '@repo/database';

// Constants
import { type CreateRoomFormValues } from '../constants';

// Actions
const getRooms = async (): Promise<Room[]> => {
  const {
    data,
    error
  } = await api.get<{
    success: boolean;
    data: {
      rooms: Room[]
    }
  }>('/api/rooms');

  if (error) {
    throw error;
  }

  if (!data?.success) {
    throw new Error('Failed to fetch rooms');
  }

  return data.data.rooms;
};

const createRoom = async ({ name, description }: { name: string; description?: string }): Promise<Room> => {
  const {
    data,
    error
  } = await api.post<{
    success: boolean;
    data: { room: Room }
  }>('/api/rooms', { name, description });

  if (error) {
    throw error;
  }

  if (!data?.success) {
    throw new Error('Failed to create room');
  }

  return data.data.room;
};

const deleteRoom = async (roomId: string): Promise<void> => {
  const {
    data,
    error
  } = await api.delete<{
    success: boolean;
    data: {
      room: Room
    }
  }>(`/api/rooms/${roomId}`);

  if (error) {
    throw error;
  }

  if (!data?.success) {
    throw new Error('Failed to delete room');
  }
};

export function useRooms() {
  const queryClient = useQueryClient();

  const roomsQuery = useQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: () => getRooms(),
  });

  const createRoomMutation = useMutation({
    mutationFn: (values: CreateRoomFormValues) => createRoom({ name: values.name, description: values.description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  const deleteRoomMutation = useMutation({
    mutationFn: (roomId: string) => deleteRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  return {
    ...roomsQuery,
    createRoom: createRoomMutation,
    deleteRoom: deleteRoomMutation,
  };
}

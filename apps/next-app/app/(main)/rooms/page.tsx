"use client"

// app/(main)/rooms/page.tsx

import * as React from "react"

// React Query Hooks
import { useRooms } from "./hooks/useRooms";

// UI Components
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";

// Lucide Icons
import { PlusIcon } from "lucide-react";

// `RoomDialog` Component
import { RoomDialog } from "./components/RoomDialog";

// `RoomForm` Component
import { type RoomFormValues } from "./components/RoomForm";

export default function RoomsPage() {
  // Set state
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  // Get rooms
  const { data: rooms, createRoom } = useRooms()

  // Handle create room
  const handleCreateRoom = async (data: RoomFormValues) => {
    try {
      await createRoom.mutateAsync(data)
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to create room:", error)
    }
  }

  return (
    <Container>
      <div className="py-6 space-y-6">
        <nav className="flex justify-between items-center">
          <span className="text-2xl font-medium">Rooms</span>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
          >
            <PlusIcon className="w-4 h-4" />
            Create room
          </Button>
        </nav>

        <main>
          {rooms?.map((room) => (
            <div key={room.id}>
              <h2>{room.name}</h2>
              <p>{room.description}</p>
            </div>
          ))}
        </main>

        <RoomDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleCreateRoom}
        />
      </div>
    </Container>
  );
}
// app/(main)/rooms/page.tsx

// UI Components
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";

// Lucide Icons
import { PlusIcon } from "lucide-react";

export default function RoomsPage() {
  return (
    <Container>
      <div className="py-6 space-y-6">
        <nav className="flex justify-between items-center">
          <span className="text-2xl font-medium">Rooms</span>
          <Button
            variant="default"
            size="sm"
          >
            <PlusIcon className="w-4 h-4" />
            Create new room
          </Button>
        </nav>
      </div>
    </Container>
  );
}
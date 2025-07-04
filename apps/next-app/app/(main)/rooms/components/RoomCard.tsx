'use client';

import React from 'react';

// React Hooks
import { useState, useEffect } from 'react';

// UI Components
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Tanstack React Query
import { UseMutationResult } from '@tanstack/react-query';

// Types
import { type Room } from '@repo/database';

// Lucide Icons
import {
  ArrowRightIcon,
  CalendarPlusIcon,
  CalendarFoldIcon,
  Loader2Icon,
  Trash2Icon,
  UserIcon,
  RefreshCcwIcon
} from 'lucide-react';

interface RoomCardProps {
  room: Room;
  deleteRoom: UseMutationResult<void, Error, string, unknown>;
  refreshRoomCode: UseMutationResult<Room, Error, string, unknown>;
}

export function RoomCard({ room, deleteRoom, refreshRoomCode }: RoomCardProps) {
  // Set alert dialog state
  const [alertDialogInput, setAlertDialogInput] = useState('');
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isAlertDialogLoading, setIsAlertDialogLoading] = useState(false);

  // Set refresh room code state
  const [animatedCode, setAnimatedCode] = useState('');
  const [isRefreshRoomCodeLoading, setIsRefreshRoomCodeLoading] = useState(false);

  // Helper to format room ode
  const formatCode = (code: string) => code.match(/.{1,2}/g)?.join(' ') || code;

  // Helper to generate random character
  const generateRandomChar = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return characters[Math.floor(Math.random() * characters.length)];
  };

  // Helper to generate random room code
  const generateRandomCode = () => {
    return room.code.replace(/[A-Z0-9]/g, generateRandomChar);
  };

  useEffect(() => {
    if (!isRefreshRoomCodeLoading) {
      setAnimatedCode(room.code);
      return;
    }

    // Set animated code
    setAnimatedCode(room.code);

    // Set interval to generate random code
    const interval = setInterval(() => {
      setAnimatedCode(generateRandomCode());
    }, 100);

    return () => clearInterval(interval);
  }, [isRefreshRoomCodeLoading, room.code]);

  // Helper to format date
  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return 'Invalid date';
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(dateObj);
    } catch {
      return 'Invalid date';
    }
  };

  // Helper to handle alert dialog action
  const handleAlertDialogAction = async () => {
    if (alertDialogInput === room.name) {
      setIsAlertDialogLoading(true);
      await deleteRoom.mutateAsync(room.id);
      setIsAlertDialogOpen(false);
      setAlertDialogInput('');
      setIsAlertDialogLoading(false);
    }
  };

  // Helper to handle alert dialog cancel
  const handleAlertDialogCancel = () => {
    setIsAlertDialogOpen(false);
    setAlertDialogInput('');
  };

  // Helper to handle refresh room code
  const handleRefreshRoomCode = async () => {
    setIsRefreshRoomCodeLoading(true);
    await refreshRoomCode.mutateAsync(room.id);
    setIsRefreshRoomCodeLoading(false);
  };

  const isDeleteEnabled = alertDialogInput === room.name;

  return (
    <>
      <Card className="w-full max-w-md border border-border rounded-2xl">
        <CardHeader>
          <CardTitle>
            {room.name}
          </CardTitle>
          {room.description && (
            <CardDescription>
              {room.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-6 px-6">
          <div className="bg-muted/50 border border-dashed border-muted-foreground/20 rounded-xl p-4 text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground text-sm">
              <span>Room Code</span>
            </div>
            <div className="text-xl font-mono tracking-widest text-foreground">
              {formatCode(animatedCode)}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/10">
                <UserIcon className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Participants</p>
                <p className="text-sm text-foreground">
                  {/* TODO: Get participants */}
                  0 participants
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10">
                <CalendarPlusIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm text-foreground">
                  {formatDate(room.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10">
                <CalendarFoldIcon className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="text-sm text-foreground">
                  {formatDate(room.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive hover:text-destructive/80"
                  onClick={() => setIsAlertDialogOpen(true)}
                >
                  <Trash2Icon className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete room</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRefreshRoomCode()}
                  disabled={isRefreshRoomCodeLoading}
                >
                  {isRefreshRoomCodeLoading ? (
                    <Loader2Icon className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCcwIcon className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh room code</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Button
            variant="default"
            size="sm"
          >
            View controls
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. To confirm, please type the room name "{room.name}" below.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="px-4">
            <Input
              placeholder={`Enter "${room.name}" to confirm`}
              value={alertDialogInput}
              onChange={(e) => setAlertDialogInput(e.target.value)}
              className="w-full"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleAlertDialogCancel}
              disabled={isAlertDialogLoading}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAlertDialogAction}
              disabled={!isDeleteEnabled || isAlertDialogLoading}
            >
              {isAlertDialogLoading ? (
                <>
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                  Deleting room...
                </>
              ) : (
                "Delete room"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

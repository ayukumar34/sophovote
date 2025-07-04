"use client";

// React Hooks
import { useEffect, useState } from "react";

// Next.js Hooks
import { useRouter, redirect } from "next/navigation";

// Custom Hooks
import { useSession } from "@/lib/hooks/useSession";

// UI Components
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

// Lucide Icons
import {
  LoaderCircleIcon,
  PlusCircleIcon,
  UsersIcon,
  ArrowRightIcon,
  CrownIcon,
  KeyIcon,
  BarChart3Icon,
  VoteIcon,
} from "lucide-react";

const Feature = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="flex items-start space-x-3">
    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
      <Icon className="w-4 h-4 text-muted-foreground" />
    </div>
    <div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </div>
);

const RoleCard = ({
  isAdmin,
  onClick,
}: {
  isAdmin: boolean;
  onClick: () => void;
}) => (
  <Card className="w-full border border-border rounded-2xl shadow-md">
    <CardContent>
      <CardHeader className="border-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
            <CrownIcon className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-medium">
              {isAdmin ? "Access Dashboard" : "Unlock Premium"}
            </CardTitle>
            <CardDescription className="text-sm">
              {isAdmin
                ? "Manage your rooms and voting sessions"
                : "Advanced controls for serious organizers"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {!isAdmin && (
        <>
          <Feature
            icon={PlusCircleIcon}
            title="Create up to 25 Rooms"
            description="Organize multiple voting events at once"
          />
          <Feature
            icon={UsersIcon}
            title="150 Participants Per Room"
            description="Scale your sessions effortlessly"
          />
          <Feature
            icon={BarChart3Icon}
            title="Real-Time Voting Dashboard"
            description="Monitor live results and participation"
          />
          <Feature
            icon={VoteIcon}
            title="Unlimited Pledge Votes"
            description="No caps on how many pledges you can track"
          />
        </>
      )}

      {!isAdmin ? (
        <CardFooter className="flex justify-between items-center">
          <div className="text-md text-muted-foreground">
            <span className="line-through mr-1.5">$10.99</span>
            <span className="text-foreground font-medium">$7.99</span>
          </div>

          <Button
            variant="default"
            size="sm"
            onClick={onClick}
          >
            Purchase
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Button>
        </CardFooter>
      ) : (
        <CardFooter className="flex justify-end">
          <Button
            variant="default"
            size="sm"
            onClick={onClick}
            className="w-full"
          >
            View rooms
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Button>
        </CardFooter>
      )}
    </CardContent>
  </Card>
);

const JoinRoomCard = ({
  otpValue,
  onChange,
  onJoin,
}: {
  otpValue: string;
  onChange: (val: string) => void;
  onJoin: () => void;
}) => (
  <Card className="w-full border border-border rounded-2xl shadow-sm">
    <CardHeader>
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <KeyIcon className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <CardTitle className="text-lg">Enter a Room</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Use your access code to join and vote
          </CardDescription>
        </div>
      </div>
    </CardHeader>

    <CardContent className="space-y-6">
      <div className="text-center space-y-2 border-b pb-8">
        <p className="text-sm font-medium text-muted-foreground">
          Enter 8-character code
        </p>
        <div className="flex justify-center">
          <InputOTP maxLength={8} value={otpValue} onChange={onChange}>
            <InputOTPGroup>
              {Array.from({ length: 8 }).map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-12 h-12 text-lg font-mono"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>

      <div className="grid gap-4 px-6">
        <Feature
          icon={UsersIcon}
          title="Join a Room"
          description="Instantly connect with ongoing votes"
        />
        <Feature
          icon={ArrowRightIcon}
          title="Participate Live"
          description="Vote and interact in real time"
        />
      </div>
    </CardContent>

    <CardFooter className="flex justify-end">
      <Button
        size="sm"
        variant="secondary"
        disabled={otpValue.length !== 8}
        onClick={onJoin}
      >
        Join room
        <ArrowRightIcon className="w-4 h-4 ml-1" />
      </Button>
    </CardFooter>
  </Card>
);

export default function Home() {
  const { user, loading, error } = useSession();
  const router = useRouter();
  const [otpValue, setOtpValue] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      redirect("/sign-in");
    }
  }, [user, loading]);

  const handleCreateRoom = () => router.push("/rooms");
  const handleJoinRoom = () => {
    if (otpValue.length === 8) {
      console.log("Joining room with code:", otpValue);
      setOtpValue("");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderCircleIcon className="w-8 h-8 animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );

  if (!user) return null;

  return (
    <Container className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg px-4 space-y-4">
        <RoleCard isAdmin={user.role === "ADMINISTRATOR"} onClick={handleCreateRoom} />
        <JoinRoomCard
          otpValue={otpValue}
          onChange={setOtpValue}
          onJoin={handleJoinRoom}
        />
      </div>
    </Container>
  );
}

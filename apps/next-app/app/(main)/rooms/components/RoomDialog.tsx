"use client"

// React
import * as React from "react"

// UI Components
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// `RoomForm` Component
import {
  RoomForm,
  type RoomFormValues,
  type RoomFormRef
} from "./RoomForm"

// Lucide Icons
import { LoaderCircleIcon } from "lucide-react"

interface RoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: RoomFormValues) => void
  defaultValues?: Partial<RoomFormValues>
}

export function RoomDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: RoomDialogProps) {
  // Set state
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Set reference
  const formRef = React.useRef<RoomFormRef>(null)

  const handleSubmit = async (data: RoomFormValues) => {
    setIsSubmitting(true)
    try {
      await onSubmit?.(data)
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleSubmitButtonClick = () => {
    formRef.current?.submit()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Room</DialogTitle>
          <DialogDescription>Create a new room for participants to vote</DialogDescription>
        </DialogHeader>

        <div className="px-4">
          <RoomForm ref={formRef} onSubmit={handleSubmit} defaultValues={defaultValues} />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmitButtonClick}
            size="sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                Creating room...
              </>
            ) : "Create room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
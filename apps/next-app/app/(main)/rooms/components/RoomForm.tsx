"use client"

// React
import * as React from "react"

// Zod
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// React Hook Form
import { useForm } from "react-hook-form"

// UI Components
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const roomFormSchema = z.object({
  name: z.string().min(1, "Room name is required").max(100, "Room name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
})

export type RoomFormValues = z.infer<typeof roomFormSchema>

interface RoomFormProps {
  onSubmit: (data: RoomFormValues) => void
  defaultValues?: Partial<RoomFormValues>
}

export interface RoomFormRef {
  submit: () => void
}

export const RoomForm = React.forwardRef<RoomFormRef, RoomFormProps>(({ onSubmit, defaultValues }, ref) => {
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      name: "",
      description: "",
      ...defaultValues,
    },
  })

  React.useImperativeHandle(ref, () => ({
    submit: () => {
      form.handleSubmit(onSubmit)()
    },
  }))

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter room name" {...field} />
              </FormControl>
              <FormDescription>
                Choose a descriptive name for this room
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter room description" {...field} />
              </FormControl>
              <FormDescription>
                Provide additional details about for this room
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})

RoomForm.displayName = "RoomForm"

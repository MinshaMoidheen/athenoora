'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'


// Define types locally since we're not using API
interface Teacher {
  _id: string
  username: string
  email: string
  password: string
  createdAt: string
  updatedAt: string
}

interface CreateTeacherRequest {
  username: string
  email: string
  password: string
}

interface UpdateTeacherRequest {
  username?: string
  email?: string
  password?: string
}

const teacherFormSchema = z.object({
  username: z.string().min(1, 'Username is required').max(50, 'Username must be less than 50 characters'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be less than 100 characters'),
})

type TeacherFormValues = z.infer<typeof teacherFormSchema>

interface TeacherModalProps {
  isOpen: boolean
  onClose: () => void
  teacher?: Teacher | null
  onSubmit: (data: CreateTeacherRequest | UpdateTeacherRequest) => void
  isLoading?: boolean
}

export function TeacherModal({
  isOpen,
  onClose,
  teacher,
  onSubmit,
  isLoading = false,
}: TeacherModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (teacher) {
      form.reset({
        username: teacher.username,
        email: teacher.email,
        password: teacher.password,
      })
    } else {
      form.reset({
        username: '',
        email: '',
        password: '',
      })
    }
  }, [teacher, form])

  const handleSubmit = async (data: TeacherFormValues) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      form.reset()
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {teacher ? 'Edit Teacher' : 'Create New Teacher'}
          </DialogTitle>
          <DialogDescription>
            {teacher
              ? 'Update the teacher information below.'
              : 'Fill in the details to create a new teacher.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter username"
                      {...field}
                      disabled={isLoading || isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                      disabled={isLoading || isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                      disabled={isLoading || isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading || isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || isSubmitting}
              >
                {isSubmitting ? 'Saving...' : teacher ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

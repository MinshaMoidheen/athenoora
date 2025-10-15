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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
// Define types locally since we're not using API
interface Section {
  _id: string
  name: string
  courseClass: {
    _id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

interface CreateSectionRequest {
  name: string
  courseClass: string
}

interface UpdateSectionRequest {
  name?: string
  courseClass?: string
}

// Dummy course classes for the modal
const dummyCourseClasses = [
  { _id: '1', name: 'Mathematics 101' },
  { _id: '2', name: 'Computer Science Fundamentals' },
  { _id: '3', name: 'English Literature' },
  { _id: '4', name: 'Physics Lab' },
  { _id: '5', name: 'History of Art' },
  { _id: '6', name: 'Chemistry Advanced' },
]

const sectionFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  courseClass: z.string().min(1, 'Course class is required'),
})

type SectionFormValues = z.infer<typeof sectionFormSchema>

interface SectionModalProps {
  isOpen: boolean
  onClose: () => void
  section?: Section | null
  onSubmit: (data: CreateSectionRequest | UpdateSectionRequest) => void
  isLoading?: boolean
}

export function SectionModal({
  isOpen,
  onClose,
  section,
  onSubmit,
  isLoading = false,
}: SectionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Use dummy course classes instead of API
  const courseClasses = dummyCourseClasses

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionFormSchema),
    defaultValues: {
      name: '',
      courseClass: '',
    },
  })

  useEffect(() => {
    if (section) {
      form.reset({
        name: section.name,
        courseClass: section.courseClass._id,
      })
    } else {
      form.reset({
        name: '',
        courseClass: '',
      })
    }
  }, [section, form])

  const handleSubmit = async (data: SectionFormValues) => {
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {section ? 'Edit Section' : 'Create New Section'}
          </DialogTitle>
          <DialogDescription>
            {section
              ? 'Update the section information below.'
              : 'Fill in the details to create a new section.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter section name"
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
              name="courseClass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Class</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading || isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courseClasses.map((courseClass) => (
                        <SelectItem key={courseClass._id} value={courseClass._id}>
                          {courseClass.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                {isSubmitting ? 'Saving...' : section ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

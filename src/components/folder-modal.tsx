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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Local types
interface Folder {
  _id: string
  folderName: string
  parent?: string
  files: string[]
  allowedUsers: string
  courseClass?: {
    _id: string
    name: string
  }
  section?: {
    _id: string
    name: string
  }
  subject?: {
    _id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

interface CreateFolderRequest {
  folderName: string
  parent?: string
  allowedUsers: string
  courseClass?: string
  section?: string
  subject?: string
}

interface UpdateFolderRequest {
  folderName?: string
  parent?: string
  allowedUsers?: string
  courseClass?: string
  section?: string
  subject?: string
}

interface Teacher {
  _id: string
  username: string
  email: string
}

interface CourseClass {
  _id: string
  name: string
}

interface Section {
  _id: string
  name: string
}

interface Subject {
  _id: string
  name: string
}

interface FolderModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  folder?: Folder | null
  parentFolders?: Folder[]
  isLoading?: boolean
}

const folderFormSchema = z.object({
  folderName: z
    .string()
    .min(1, 'Folder name is required')
    .max(100, 'Folder name cannot exceed 100 characters')
    .transform(val => val.toUpperCase()),
  parent: z.string().optional(),
  allowedUsers: z.string().min(1, 'A teacher must be selected'),
  courseClass: z.string().optional(),
  section: z.string().optional(),
  subject: z.string().optional(),
})

type FolderFormValues = z.infer<typeof folderFormSchema>

// Dummy data
const dummyTeachers: Teacher[] = [
  { _id: '1', username: 'john.doe', email: 'john.doe@school.edu' },
  { _id: '2', username: 'jane.smith', email: 'jane.smith@school.edu' },
  { _id: '3', username: 'mike.wilson', email: 'mike.wilson@school.edu' },
  { _id: '4', username: 'sarah.johnson', email: 'sarah.johnson@school.edu' },
  { _id: '5', username: 'david.brown', email: 'david.brown@school.edu' },
  { _id: '6', username: 'lisa.garcia', email: 'lisa.garcia@school.edu' },
]

const dummyCourseClasses: CourseClass[] = [
  { _id: '1', name: 'Class 10A' },
  { _id: '2', name: 'Class 10B' },
  { _id: '3', name: 'Class 11A' },
  { _id: '4', name: 'Class 11B' },
  { _id: '5', name: 'Class 12A' },
  { _id: '6', name: 'Class 12B' },
]

const dummySections: Section[] = [
  { _id: '1', name: 'Section A' },
  { _id: '2', name: 'Section B' },
  { _id: '3', name: 'Section C' },
  { _id: '4', name: 'Section D' },
]

const dummySubjects: Subject[] = [
  { _id: '1', name: 'Mathematics' },
  { _id: '2', name: 'Physics' },
  { _id: '3', name: 'Chemistry' },
  { _id: '4', name: 'Biology' },
  { _id: '5', name: 'English' },
  { _id: '6', name: 'History' },
]

export function FolderModal({
  isOpen,
  onClose,
  onSubmit,
  folder,
  parentFolders = [],
  isLoading = false,
}: FolderModalProps) {
  const form = useForm<FolderFormValues>({
    resolver: zodResolver(folderFormSchema),
    defaultValues: {
      folderName: '',
      parent: 'none',
      allowedUsers: 'none',
      courseClass: 'none',
      section: 'none',
      subject: 'none',
    },
  })

  useEffect(() => {
    if (folder) {
      form.reset({
        folderName: folder.folderName,
        parent: folder.parent || 'none',
        allowedUsers: folder.allowedUsers[0] || 'none',
        courseClass: folder.courseClass?._id || 'none',
        section: folder.section?._id || 'none',
        subject: folder.subject?._id || 'none',
      })
    } else {
      form.reset({
        folderName: '',
        parent: 'none',
        allowedUsers: 'none',
        courseClass: 'none',
        section: 'none',
        subject: 'none',
      })
    }
  }, [folder, form])


  const handleSubmit = (values: FolderFormValues) => {
    // Convert "none" values to undefined for optional fields
    const processedValues = {
      ...values,
      parent: values.parent === 'none' ? undefined : values.parent,
      allowedUsers: values.allowedUsers === 'none' ? undefined : values.allowedUsers,
      courseClass: values.courseClass === 'none' ? undefined : values.courseClass,
      section: values.section === 'none' ? undefined : values.section,
      subject: values.subject === 'none' ? undefined : values.subject,
    }
    onSubmit(processedValues)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {folder ? 'Edit Folder' : 'Create New Folder'}
          </DialogTitle>
          <DialogDescription>
            {folder 
              ? 'Update folder details and permissions'
              : 'Create a new folder with access permissions and associations'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {/* Folder Name */}
              <FormField
                control={form.control}
                name="folderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Folder Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter folder name"
                        {...field}
                        className="uppercase"
                      />
                    </FormControl>
                    <FormDescription>
                      Folder name will be automatically converted to uppercase
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Parent Folder */}
              <FormField
                control={form.control}
                name="parent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Folder</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent folder (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No Parent (Root Folder)</SelectItem>
                        {parentFolders.map((parentFolder) => (
                          <SelectItem key={parentFolder._id} value={parentFolder._id}>
                            {parentFolder.folderName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select a parent folder to create a subfolder
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Course Class */}
              <FormField
                control={form.control}
                name="courseClass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Class</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course class (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No Course Class</SelectItem>
                        {dummyCourseClasses.map((courseClass) => (
                          <SelectItem key={courseClass._id} value={courseClass._id}>
                            {courseClass.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Associate this folder with a specific course class
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Section */}
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No Section</SelectItem>
                        {dummySections.map((section) => (
                          <SelectItem key={section._id} value={section._id}>
                            {section.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Associate this folder with a specific section
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Subject */}
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No Subject</SelectItem>
                        {dummySubjects.map((subject) => (
                          <SelectItem key={subject._id} value={subject._id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Associate this folder with a specific subject
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Allowed Users (Teachers) */}
              <FormField
                control={form.control}
                name="allowedUsers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allowed Teacher *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a teacher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No Teacher Selected</SelectItem>
                        {dummyTeachers.map((teacher) => (
                          <SelectItem key={teacher._id} value={teacher._id}>
                            
                              {teacher.username}
                              {/* <span className="text-xs text-muted-foreground">{teacher.email}</span> */}
                           
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the teacher who can access this folder
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : folder ? 'Update Folder' : 'Create Folder'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

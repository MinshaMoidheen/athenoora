'use client'

import { HTMLAttributes, useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GraduationCap, User, Lock, BookOpen, Users, Building } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTeacherLoginMutation } from '@/store/api/authApi'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/context/auth-context'

type TeacherAuthFormProps = HTMLAttributes<HTMLDivElement>

const teacherFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
  courseClassId: z
    .string()
    .min(1, { message: 'Please select a class' }),
  sectionId: z
    .string()
    .min(1, { message: 'Please select a section' }),
  subjectId: z
    .string()
    .min(1, { message: 'Please select a subject' }),
})

// Dummy data for dropdowns
const dummyCourseClasses = [
  { _id: '1', name: 'Class 1' },
  { _id: '2', name: 'Class 2' },
  { _id: '3', name: 'Class 3' },
  { _id: '4', name: 'Class 4' },
  { _id: '5', name: 'Class 5' },
  { _id: '6', name: 'Class 6' },
  { _id: '7', name: 'Class 7' },
  { _id: '8', name: 'Class 8' },
  { _id: '9', name: 'Class 9' },
  { _id: '10', name: 'Class 10' },
  { _id: '11', name: 'Class 11' },
  { _id: '12', name: 'Class 12' },
]

const dummySections = [
  { _id: '1', name: 'Section A' },
  { _id: '2', name: 'Section B' },
  { _id: '3', name: 'Section C' },
  { _id: '4', name: 'Section D' },
  { _id: '5', name: 'Section E' },
]

const dummySubjects = [
  { _id: '1', name: 'Mathematics' },
  { _id: '2', name: 'Science' },
  { _id: '3', name: 'English' },
  { _id: '4', name: 'Hindi' },
  { _id: '5', name: 'Social Studies' },
  { _id: '6', name: 'Physics' },
  { _id: '7', name: 'Chemistry' },
  { _id: '8', name: 'Biology' },
  { _id: '9', name: 'History' },
  { _id: '10', name: 'Geography' },
  { _id: '11', name: 'Computer Science' },
  { _id: '12', name: 'Physical Education' },
]

export function TeacherAuthForm({ className, ...props }: TeacherAuthFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()
  const [teacherLogin, { isLoading }] = useTeacherLoginMutation()

  const form = useForm<z.infer<typeof teacherFormSchema>>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      email: '',
      password: '',
      courseClassId: '',
      sectionId: '',
      subjectId: '',
    },
  })

  async function onSubmit(data: z.infer<typeof teacherFormSchema>) {
    try {
      const result = await teacherLogin({
        email: data.email,
        password: data.password,
        courseClassId: data.courseClassId,
        sectionId: data.sectionId,
        subjectId: data.subjectId,
      }).unwrap()

      // Use the auth context to store user data
      login(result.user, result.accessToken)

      toast({
        title: 'Teacher Login Successful',
        description: `Welcome back, ${result.user.username}!`,
      })

      // Redirect to dashboard
      router.push('/')
    } catch (error: any) {
      console.error('Teacher login error:', error)
      
      // Handle different types of errors
      let errorMessage = 'An unexpected error occurred during teacher login'
      let errorTitle = 'Teacher Login Failed'

      if (error?.data) {
        // Handle validation errors with detailed field errors
        if (error.data.code === 'Validation Error' && error.data.errors) {
          errorTitle = 'Validation Error'
          const fieldErrors = Object.values(error.data.errors) as Array<{ msg: string }>
          if (fieldErrors.length > 0) {
            // Use the first error message as the main message
            errorMessage = fieldErrors[0]?.msg || 'Please check your input and try again'
          } else {
            errorMessage = 'Please check your input and try again'
          }
        }
        // API error response
        else if (error.data.message) {
          errorMessage = error.data.message
        } else if (error.data.error) {
          errorMessage = error.data.error
        }
        
        // Handle specific error codes
        if (error.data.code) {
          switch (error.data.code) {
            case 'Not Found':
              errorTitle = 'Teacher Not Found'
              errorMessage = 'No teacher account found with this email address'
              break
            case 'BadRequest':
              errorTitle = 'Invalid Request'
              if (error.data.message?.includes('courseClassId, sectionId, and subjectId are required')) {
                errorMessage = 'Please select a class, section, and subject for teacher login'
              } else if (error.data.message?.includes('Invalid courseClass, section, or subject selection')) {
                errorMessage = 'Invalid class, section, or subject selection. Please try again.'
              } else {
                errorMessage = error.data.message
              }
              break
            case 'Authorization Error':
              errorTitle = 'Access Denied'
              errorMessage = 'You do not have permission to login as a teacher'
              break
            case 'Server Error':
              errorTitle = 'Server Error'
              break
            case 'Validation Error':
              // Already handled above
              break
            default:
              errorTitle = 'Teacher Login Failed'
          }
        }
      } else if (error?.message) {
        // Network or other errors
        errorMessage = error.message
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  return (
    <div className={cn('grid gap-6 relative', className)} {...props}>
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Signing in as Teacher...</p>
          </div>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-4'>
            {/* Email Field */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel className='flex items-center gap-2'>
                    <User className='h-4 w-4' />
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder='Enter your email' 
                      type='email'
                      disabled={isLoading}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel className='flex items-center gap-2'>
                      <Lock className='h-4 w-4' />
                      Password
                    </FormLabel>
                    <Link
                      href='/forgot-password'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput 
                      placeholder='********' 
                      disabled={isLoading}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Course Class Selection */}
            <FormField
              control={form.control}
              name='courseClassId'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel className='flex items-center gap-2'>
                    <Building className='h-4 w-4' />
                    Class
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dummyCourseClasses.map((courseClass) => (
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

            {/* Section Selection */}
            <FormField
              control={form.control}
              name='sectionId'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel className='flex items-center gap-2'>
                    <Users className='h-4 w-4' />
                    Section
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dummySections.map((section) => (
                        <SelectItem key={section._id} value={section._id}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subject Selection */}
            <FormField
              control={form.control}
              name='subjectId'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel className='flex items-center gap-2'>
                    <BookOpen className='h-4 w-4' />
                    Subject
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dummySubjects.map((subject) => (
                        <SelectItem key={subject._id} value={subject._id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button className='mt-2' disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Signing in as Teacher...
                </>
              ) : (
                'Sign in as Teacher'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

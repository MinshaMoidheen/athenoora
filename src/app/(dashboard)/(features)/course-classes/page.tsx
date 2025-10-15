'use client'

import { useState, useMemo, useEffect } from 'react'
import { Plus, Edit, Trash2, BookOpen, List, Grid3X3, Search, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CourseClassModal } from '@/components/course-class-modal'
// Removed API imports - using dummy data only
import { toast } from '@/hooks/use-toast'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  getPaginationRowModel,
  PaginationState,
  VisibilityState,
} from '@tanstack/react-table'

// Define CourseClass type locally since we're not using API
interface CourseClass {
  _id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

type ViewMode = 'list' | 'grid'

export default function CourseClassesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourseClass, setEditingCourseClass] = useState<CourseClass | null>(null)
  const [deletingCourseClass, setDeletingCourseClass] = useState<CourseClass | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [courseClasses, setCourseClasses] = useState<CourseClass[]>([])

  // Dummy data for development and testing
  const dummyCourseClasses: CourseClass[] = [
    {
      _id: '1',
      name: 'Mathematics 101',
      description: 'Introduction to basic mathematical concepts including algebra, geometry, and trigonometry.',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '2',
      name: 'Computer Science Fundamentals',
      description: 'Core concepts in computer science including programming, data structures, and algorithms.',
      createdAt: '2024-01-20T14:15:00Z',
      updatedAt: '2024-01-20T14:15:00Z'
    },
    {
      _id: '3',
      name: 'English Literature',
      description: 'Study of classic and contemporary English literature with focus on critical analysis.',
      createdAt: '2024-01-25T09:45:00Z',
      updatedAt: '2024-01-25T09:45:00Z'
    },
    {
      _id: '4',
      name: 'Physics Lab',
      description: 'Hands-on experiments and practical applications of physics principles.',
      createdAt: '2024-02-01T11:20:00Z',
      updatedAt: '2024-02-01T11:20:00Z'
    },
    {
      _id: '5',
      name: 'History of Art',
      description: 'Survey of art history from ancient times to modern era with emphasis on cultural context.',
      createdAt: '2024-02-05T16:30:00Z',
      updatedAt: '2024-02-05T16:30:00Z'
    },
    {
      _id: '6',
      name: 'Chemistry Advanced',
      description: 'Advanced topics in chemistry including organic chemistry, biochemistry, and analytical methods.',
      createdAt: '2024-02-10T13:45:00Z',
      updatedAt: '2024-02-10T13:45:00Z'
    },
    
  ]

  // Initialize with dummy data
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Initialize course classes with dummy data
  useEffect(() => {
    if (courseClasses.length === 0) {
      setCourseClasses(dummyCourseClasses)
    }
  }, [courseClasses.length])

  // Column definitions for the table
  const columns: ColumnDef<CourseClass>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="h-8 px-2 lg:px-3"
            >
              Name
              {column.getIsSorted() === 'asc' ? ' ↑' : column.getIsSorted() === 'desc' ? ' ↓' : ''}
            </Button>
          )
        },
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{row.getValue('name')}</span>
          </div>
        ),
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => {
          const description = row.getValue('description') as string
          return description ? (
            <span className="text-sm text-muted-foreground max-w-xs truncate">
              {description}
            </span>
          ) : (
            <Badge variant="secondary">No description</Badge>
          )
        },
        enableSorting: false,
      },
      
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const courseClass = row.original
          return (
            <div className="flex items-center gap-2">
              {/* <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(courseClass)}
                disabled={isUpdating}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(courseClass)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleEdit(courseClass)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDelete(courseClass)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [isUpdating, isDeleting]
  )

  // Initialize the table
  const table = useReactTable({
    data: courseClasses,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const handleCreate = () => {
    setEditingCourseClass(null)
    setIsModalOpen(true)
  }

  const handleEdit = (courseClass: CourseClass) => {
    setEditingCourseClass(courseClass)
    setIsModalOpen(true)
  }

  const handleDelete = (courseClass: CourseClass) => {
    setDeletingCourseClass(courseClass)
  }

  const handleModalSubmit = async (data: any) => {
    try {
      setIsUpdating(true)
      
      if (editingCourseClass) {
        // Update existing course class
        setCourseClasses(prev => prev.map(courseClass => 
          courseClass._id === editingCourseClass._id 
            ? { ...courseClass, ...data, updatedAt: new Date().toISOString() }
            : courseClass
        ))
        toast({
          title: 'Success',
          description: 'Course class updated successfully.',
        })
      } else {
        // Create new course class
        const newCourseClass: CourseClass = {
          _id: Date.now().toString(),
          name: data.name,
          description: data.description || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setCourseClasses(prev => [...prev, newCourseClass])
        toast({
          title: 'Success',
          description: 'Course class created successfully.',
        })
      }
      setIsModalOpen(false)
      setEditingCourseClass(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save course class. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingCourseClass) return

    try {
      setIsDeleting(true)
      setCourseClasses(prev => prev.filter(courseClass => courseClass._id !== deletingCourseClass._id))
      toast({
        title: 'Success',
        description: 'Course class deleted successfully.',
      })
      setDeletingCourseClass(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete course class. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const renderListView = () => (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          of {table.getFilteredRowModel().rows.length} entries
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
              className="h-8 w-[70px] rounded border border-input bg-background px-3 py-1 text-sm"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              {'<<'}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              {'<'}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              {'>'}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              {'>>'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderGridView = () => {
    const rows = table.getRowModel().rows
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rows.length > 0 ? (
          rows.map((row) => {
            const courseClass = row.original
            return (
              <Card key={courseClass._id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    
                      <CardTitle className="text-lg">{courseClass.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(courseClass)}
                        disabled={isUpdating}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(courseClass)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {courseClass.description ? (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {courseClass.description}
                    </p>
                  ) : (
                    <Badge variant="secondary" className="text-xs">No description</Badge>
                  )}
                  
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="col-span-full text-center py-8">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No course classes found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    )
  }

  // const renderFolderView = () => (
  //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  //     {courseClasses.map((courseClass) => (
  //       <Card key={courseClass._id} className="hover:shadow-md transition-shadow group">
  //         <CardHeader className="pb-3">
  //           <div className="flex items-center justify-between">
  //             <div className="flex items-center gap-3">
  //               <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
  //                 <Folder className="h-6 w-6 text-primary" />
  //               </div>
  //               <div>
  //                 <CardTitle className="text-lg">{courseClass.name}</CardTitle>
  //                 <p className="text-xs text-muted-foreground">Course Class</p>
  //               </div>
  //             </div>
  //             <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
  //               <Button
  //                 variant="ghost"
  //                 size="sm"
  //                 onClick={() => handleEdit(courseClass)}
  //                 disabled={isUpdating}
  //               >
  //                 <Edit className="h-4 w-4" />
  //               </Button>
  //               <Button
  //                 variant="ghost"
  //                 size="sm"
  //                 onClick={() => handleDelete(courseClass)}
  //                 disabled={isDeleting}
  //               >
  //                 <Trash2 className="h-4 w-4 text-destructive" />
  //               </Button>
  //             </div>
  //           </div>
  //         </CardHeader>
  //         <CardContent className="pt-0">
  //           {courseClass.description ? (
  //             <p className="text-sm text-muted-foreground line-clamp-2">
  //               {courseClass.description}
  //             </p>
  //           ) : (
  //             <Badge variant="secondary" className="text-xs">No description</Badge>
  //           )}
  //           <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
  //             <span>
  //               Created: {courseClass.createdAt
  //                 ? new Date(courseClass.createdAt).toLocaleDateString()
  //                 : 'N/A'}
  //             </span>
  //             <Badge variant="outline" className="text-xs">
  //               {courseClass.name.length} chars
  //             </Badge>
  //           </div>
  //         </CardContent>
  //       </Card>
  //     ))}
  //   </div>
  // )

  // if (error) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <Card className="w-96">
  //         <CardContent className="pt-6">
  //           <div className="text-center">
  //             <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
  //             <h3 className="mt-2 text-sm font-semibold text-gray-900">Error</h3>
  //             <p className="mt-1 text-sm text-gray-500">
  //               Failed to load course classes. Please try again.
  //             </p>
  //           </div>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   )
  // }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Classes</h1>
          <p className="text-muted-foreground">
            Manage course classes and their descriptions
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 px-3"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 px-3"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleCreate} disabled={isCreating}>
            <Plus className="mr-2 h-4 w-4" />
            Add Course Class
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search course classes..."
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="pl-8"
            />
          </div>
         
        </div>
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} of {courseClasses.length} course classes
        </div>
      </div>

      <div>
         {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading course classes...</p>
              </div>
            </div>
          ) : courseClasses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No course classes</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new course class.
              </p>
              <div className="mt-6">
                <Button onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Course Class
                </Button>
              </div>
            </div>
          ) : (
            <>
              {viewMode === 'list' && renderListView()}
              {viewMode === 'grid' && renderGridView()}
            </>
          )}
      </div>

      {/* Add/Edit Modal */}
      <CourseClassModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingCourseClass(null)
        }}
        courseClass={editingCourseClass}
        onSubmit={handleModalSubmit}
        isLoading={isCreating || isUpdating}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingCourseClass}
        onOpenChange={() => setDeletingCourseClass(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the course class{' '}
              <strong>{deletingCourseClass?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

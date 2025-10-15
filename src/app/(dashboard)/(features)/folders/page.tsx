'use client'

import { useState, useMemo, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  FolderPlus, 
  Upload, 
  File, 
  Folder, 
  FolderOpen,
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Trash2,
  Edit,
  Eye,
  Users,
  BookOpen,
  GraduationCap,
  UserCheck,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  User
} from 'lucide-react'
import { FolderModal } from '@/components/folder-modal'

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

interface FileItem {
  _id: string
  filename: string
  path: string
  mimetype: string
  size: number
  folder: string
  owner: {
    _id: string
    username: string
  }
  allowedUsers: string[]
  uploadedAt: string
}

interface UploadProgress {
  file: File
  progress: number
  status: 'uploading' | 'completed' | 'error'
  error?: string
}

// Dummy data
const dummyFolders: Folder[] = [
  {
    _id: '1',
    folderName: 'MATHEMATICS',
    parent: undefined,
    files: ['file1', 'file2'],
    allowedUsers: '1',
    courseClass: { _id: '1', name: 'Class 10A' },
    section: { _id: '1', name: 'Section A' },
    subject: { _id: '1', name: 'Mathematics' },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    _id: '2',
    folderName: 'PHYSICS',
    parent: undefined,
    files: ['file3', 'file4', 'file5'],
    allowedUsers: '2',
    courseClass: { _id: '2', name: 'Class 10B' },
    section: { _id: '2', name: 'Section B' },
    subject: { _id: '2', name: 'Physics' },
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-14T09:15:00Z',
  },
  {
    _id: '3',
    folderName: 'ASSIGNMENTS',
    parent: '1',
    files: ['file6'],
    allowedUsers: '1',
    courseClass: { _id: '1', name: 'Class 10A' },
    section: { _id: '1', name: 'Section A' },
    subject: { _id: '1', name: 'Mathematics' },
    createdAt: '2024-01-13T14:20:00Z',
    updatedAt: '2024-01-13T14:20:00Z',
  },
  {
    _id: '4',
    folderName: 'LECTURE_NOTES',
    parent: '2',
    files: ['file7', 'file8'],
    allowedUsers: '2',
    courseClass: { _id: '2', name: 'Class 10B' },
    section: { _id: '2', name: 'Section B' },
    subject: { _id: '2', name: 'Physics' },
    createdAt: '2024-01-12T11:45:00Z',
    updatedAt: '2024-01-12T11:45:00Z',
  },
  {
    _id: '5',
    folderName: 'CHEMISTRY',
    parent: undefined,
    files: [],
    allowedUsers: '4',
    courseClass: { _id: '3', name: 'Class 11A' },
    section: { _id: '3', name: 'Section C' },
    subject: { _id: '3', name: 'Chemistry' },
    createdAt: '2024-01-11T16:30:00Z',
    updatedAt: '2024-01-11T16:30:00Z',
  },
  {
    _id: '6',
    folderName: 'EXAM_PAPERS',
    parent: '1',
    files: ['file9', 'file10', 'file11'],
    allowedUsers: '1',
    courseClass: { _id: '1', name: 'Class 10A' },
    section: { _id: '1', name: 'Section A' },
    subject: { _id: '1', name: 'Mathematics' },
    createdAt: '2024-01-10T13:15:00Z',
    updatedAt: '2024-01-10T13:15:00Z',
  }
]

const dummyFiles: FileItem[] = [
  {
    _id: 'file1',
    filename: 'algebra_basics.pdf',
    path: '/uploads/mathematics/algebra_basics.pdf',
    mimetype: 'application/pdf',
    size: 2048576,
    folder: '1',
    owner: { _id: '1', username: 'john.doe' },
    allowedUsers: ['1', '2'],
    uploadedAt: '2024-01-15T10:30:00Z',
  },
  {
    _id: 'file2',
    filename: 'geometry_worksheet.docx',
    path: '/uploads/mathematics/geometry_worksheet.docx',
    mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 1024000,
    folder: '1',
    owner: { _id: '1', username: 'john.doe' },
    allowedUsers: ['1', '2'],
    uploadedAt: '2024-01-15T09:15:00Z',
  },
  {
    _id: 'file3',
    filename: 'mechanics_lecture.mp4',
    path: '/uploads/physics/mechanics_lecture.mp4',
    mimetype: 'video/mp4',
    size: 52428800,
    folder: '2',
    owner: { _id: '2', username: 'jane.smith' },
    allowedUsers: ['2', '3'],
    uploadedAt: '2024-01-14T14:20:00Z',
  }
]

export default function FoldersPage() {
  const [folders, setFolders] = useState<Folder[]>(dummyFolders)
  const [files, setFiles] = useState<FileItem[]>(dummyFiles)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false)
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filter folders based on search term
  const filteredFolders = useMemo(() => {
    return folders.filter(folder =>
      folder.folderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      folder.courseClass?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      folder.section?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      folder.subject?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [folders, searchTerm])

  // Get folders for the current view (root folders or subfolders)
  const currentFolders = useMemo(() => {
    if (selectedFolder) {
      return filteredFolders.filter(folder => folder.parent === selectedFolder)
    }
    return filteredFolders.filter(folder => !folder.parent)
  }, [filteredFolders, selectedFolder])

  // Get files for the selected folder
  const currentFiles = useMemo(() => {
    if (selectedFolder) {
      return files.filter(file => file.folder === selectedFolder)
    }
    return []
  }, [files, selectedFolder])

  // Get parent folder path
  const getParentPath = (folderId: string): string[] => {
    const folder = folders.find(f => f._id === folderId)
    if (!folder || !folder.parent) return [folderId]
    return [...getParentPath(folder.parent), folderId]
  }

  const getFolderPath = (): Folder[] => {
    if (!selectedFolder) return []
    const pathIds = getParentPath(selectedFolder)
    return pathIds.map(id => folders.find(f => f._id === id)!).filter(Boolean)
  }

  const handleCreateFolder = () => {
    setEditingFolder(null)
    setIsFolderModalOpen(true)
  }

  const handleEditFolder = (folder: Folder) => {
    setEditingFolder(folder)
    setIsFolderModalOpen(true)
  }

  const handleFolderModalSubmit = async (data: any) => {
    if (editingFolder) {
      setIsUpdating(true)
      // Simulate update
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setFolders(prev => prev.map(folder => 
        folder._id === editingFolder._id 
          ? { ...folder, ...data, updatedAt: new Date().toISOString() }
          : folder
      ))
      setIsUpdating(false)
    } else {
      setIsCreating(true)
      // Simulate create
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newFolder: Folder = {
        _id: Date.now().toString(),
        folderName: data.folderName,
        parent: data.parent || undefined,
        files: [],
        allowedUsers: data.allowedUsers || 'none',
        courseClass: data.courseClass ? { _id: data.courseClass, name: 'Class Name' } : undefined,
        section: data.section ? { _id: data.section, name: 'Section Name' } : undefined,
        subject: data.subject ? { _id: data.subject, name: 'Subject Name' } : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      setFolders(prev => [...prev, newFolder])
      setIsCreating(false)
    }
    
    setIsFolderModalOpen(false)
    setEditingFolder(null)
  }

  const handleDeleteFolder = async (folderId: string) => {
    setIsDeleting(true)
    // Simulate delete
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setFolders(prev => prev.filter(folder => folder._id !== folderId))
    setFiles(prev => prev.filter(file => file.folder !== folderId))
    setIsDeleting(false)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    setIsUploading(true)
    const progressItems: UploadProgress[] = files.map(file => ({
      file,
      progress: 0,
      status: 'uploading'
    }))
    setUploadProgress(progressItems)

    // Simulate file upload with progress
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const progressItem = progressItems[i]
      
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setUploadProgress(prev => 
          prev.map((item, index) => 
            index === i ? { ...item, progress } : item
          )
        )
      }
      
      // Mark as completed
      setUploadProgress(prev => 
        prev.map((item, index) => 
          index === i ? { ...item, status: 'completed' } : item
        )
      )
      
      // Add to files
      const newFile: FileItem = {
        _id: `file_${Date.now()}_${i}`,
        filename: file.name,
        path: `/uploads/${file.name}`,
        mimetype: file.type,
        size: file.size,
        folder: selectedFolder || '1',
        owner: { _id: '1', username: 'current.user' },
        allowedUsers: [],
        uploadedAt: new Date().toISOString(),
      }
      
      setFiles(prev => [...prev, newFile])
    }
    
    setIsUploading(false)
    setUploadProgress([])
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith('video/')) return '🎥'
    if (mimetype.startsWith('audio/')) return '🎵'
    if (mimetype.includes('pdf')) return '📄'
    if (mimetype.includes('word') || mimetype.includes('document')) return '📝'
    if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return '📊'
    if (mimetype.includes('image/')) return '🖼️'
    return '📁'
  }

  const renderGridView = () => {
    // Combine folders and files for grid view
    const allItems = [
      ...currentFolders.map(folder => ({ ...folder, type: 'folder' as const })),
      ...currentFiles.map(file => ({ ...file, type: 'file' as const }))
    ]

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allItems.map((item) => {
          if (item.type === 'folder') {
            const folder = item as Folder & { type: 'folder' }
            return (
              <Card key={folder._id} className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Folder className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm font-medium truncate">
                          {folder.folderName}
                        </CardTitle>
                        <div className="text-xs text-muted-foreground">
                          {folder.files.length} files
                        </div>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditFolder(folder)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent 
                  className="pt-0 cursor-pointer"
                  onClick={() => setSelectedFolder(folder._id)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <BookOpen className="h-3 w-3" />
                      {folder.courseClass?.name || 'No Class'}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {folder.section?.name || 'No Section'}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <GraduationCap className="h-3 w-3" />
                      {folder.subject?.name || 'No Subject'}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <UserCheck className="h-3 w-3" />
                      {folder.allowedUsers === 'none' ? 'No teacher' : '1 teacher'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          } else {
            const file = item as FileItem & { type: 'file' }
            return (
              <Card key={file._id} className="hover:shadow-md transition-shadow group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <span className="text-2xl">{getFileIcon(file.mimetype)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm font-medium truncate">
                          {file.filename}
                        </CardTitle>
                        <div className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </div>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle file view
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle file download
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle file delete
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {file.owner.username}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <File className="h-3 w-3" />
                      {file.mimetype}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          }
        })}
      </div>
    )
  }

  const renderListView = () => {
    // Combine folders and files for list view
    const allItems = [
      ...currentFolders.map(folder => ({ ...folder, type: 'folder' as const })),
      ...currentFiles.map(file => ({ ...file, type: 'file' as const }))
    ]

    return (
      <div className="space-y-2">
        {allItems.map((item) => {
          if (item.type === 'folder') {
            const folder = item as Folder & { type: 'folder' }
            return (
              <Card key={folder._id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Folder className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <div className="font-medium">{folder.folderName}</div>
                        <div className="text-sm text-muted-foreground">
                          {folder.courseClass?.name} • {folder.section?.name} • {folder.subject?.name}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {folder.files.length} files
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {folder.allowedUsers === 'none' ? 'No teacher' : '1 teacher'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFolder(folder._id)}
                      >
                        <FolderOpen className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditFolder(folder)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFolder(folder._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          } else {
            const file = item as FileItem & { type: 'file' }
            return (
              <Card key={file._id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{getFileIcon(file.mimetype)}</span>
                      <div className="flex-1">
                        <div className="font-medium">{file.filename}</div>
                        <div className="text-sm text-muted-foreground">
                          {file.owner.username} • {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {file.mimetype}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Handle file view
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Handle file download
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Handle file delete
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          }
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Folders</h1>
          <p className="text-muted-foreground">
            Manage folders, upload files, and organize your content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </Button>
          <Button onClick={handleCreateFolder}>
            <FolderPlus className="mr-2 h-4 w-4" />
            New Folder
          </Button>
        </div>
      </div>

      {/* Breadcrumb */}
      {selectedFolder && (
        <div className="flex items-center gap-2 text-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedFolder(null)}
          >
            <Folder className="h-4 w-4 mr-1" />
            Root
          </Button>
          {getFolderPath().map((folder, index) => (
            <div key={folder._id} className="flex items-center gap-2">
              <span>/</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFolder(folder._id)}
              >
                {folder.folderName}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search folders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Uploading Files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {uploadProgress.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate">{item.file.name}</span>
                  <span className="text-muted-foreground">
                    {item.status === 'uploading' && `${item.progress}%`}
                    {item.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {item.status === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
                  </span>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* File Upload */}
      {selectedFolder && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Upload Files</CardTitle>
            <CardDescription>
              Upload multiple files to this folder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept="*/*"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Choose Files'}
              </Button>
              <span className="text-sm text-muted-foreground">
                Select multiple files to upload
              </span>
            </div>
          </CardContent>
        </Card>
      )}


      {/* Folders List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {selectedFolder ? 'Contents' : 'Folders & Files'} ({currentFolders.length + currentFiles.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {currentFolders.length === 0 && currentFiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {selectedFolder ? 'No contents found' : 'No folders or files found'}
            </div>
          ) : (
            viewMode === 'grid' ? renderGridView() : renderListView()
          )}
        </CardContent>
      </Card>

      {/* Folder Modal */}
      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => {
          setIsFolderModalOpen(false)
          setEditingFolder(null)
        }}
        onSubmit={handleFolderModalSubmit}
        folder={editingFolder}
        parentFolders={folders.filter(f => !f.parent)}
        isLoading={isCreating || isUpdating}
      />
    </div>
  )
}

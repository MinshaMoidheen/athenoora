'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle,
  User,
  Database,
  FileText,
  Calendar,
  Clock,
  Eye,
  Trash2
} from 'lucide-react'

interface LogEntry {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'success'
  category: 'auth' | 'database' | 'file' | 'system' | 'user'
  message: string
  userId?: string
  userName?: string
  ipAddress?: string
  userAgent?: string
  details?: string
  duration?: number
  status?: string
}

const dummyLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: '2024-01-15T14:30:25Z',
    level: 'success',
    category: 'auth',
    message: 'User login successful',
    userId: 'user123',
    userName: 'john.doe',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    duration: 150,
    status: '200'
  },
  {
    id: '2',
    timestamp: '2024-01-15T14:28:10Z',
    level: 'error',
    category: 'database',
    message: 'Database connection timeout',
    ipAddress: '192.168.1.100',
    details: 'Connection pool exhausted after 30 seconds',
    status: '500'
  },
  {
    id: '3',
    timestamp: '2024-01-15T14:25:45Z',
    level: 'info',
    category: 'file',
    message: 'File uploaded successfully',
    userId: 'user456',
    userName: 'jane.smith',
    ipAddress: '192.168.1.101',
    details: 'course-materials.pdf (2.3 MB)',
    duration: 2300,
    status: '200'
  },
  {
    id: '4',
    timestamp: '2024-01-15T14:22:30Z',
    level: 'warning',
    category: 'system',
    message: 'High memory usage detected',
    ipAddress: '192.168.1.100',
    details: 'Memory usage: 85% (6.8GB/8GB)',
    status: '200'
  },
  {
    id: '5',
    timestamp: '2024-01-15T14:20:15Z',
    level: 'success',
    category: 'user',
    message: 'User profile updated',
    userId: 'user789',
    userName: 'mike.wilson',
    ipAddress: '192.168.1.102',
    duration: 320,
    status: '200'
  },
  {
    id: '6',
    timestamp: '2024-01-15T14:18:00Z',
    level: 'error',
    category: 'auth',
    message: 'Invalid login attempt',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    details: 'Failed password for user: admin',
    status: '401'
  },
  {
    id: '7',
    timestamp: '2024-01-15T14:15:30Z',
    level: 'info',
    category: 'database',
    message: 'Query executed successfully',
    userId: 'user123',
    userName: 'john.doe',
    ipAddress: '192.168.1.100',
    details: 'SELECT * FROM course_classes LIMIT 50',
    duration: 45,
    status: '200'
  },
  {
    id: '8',
    timestamp: '2024-01-15T14:12:45Z',
    level: 'warning',
    category: 'file',
    message: 'Large file upload detected',
    userId: 'user456',
    userName: 'jane.smith',
    ipAddress: '192.168.1.101',
    details: 'video-lecture.mp4 (156 MB)',
    duration: 4500,
    status: '200'
  },
  {
    id: '9',
    timestamp: '2024-01-15T14:10:20Z',
    level: 'success',
    category: 'system',
    message: 'Backup completed successfully',
    ipAddress: '192.168.1.100',
    details: 'Database backup: 2.1GB compressed',
    duration: 180000,
    status: '200'
  },
  {
    id: '10',
    timestamp: '2024-01-15T14:08:05Z',
    level: 'error',
    category: 'user',
    message: 'Permission denied',
    userId: 'user789',
    userName: 'mike.wilson',
    ipAddress: '192.168.1.102',
    details: 'Attempted to access admin panel',
    status: '403'
  }
]

const levelOptions = [
  { value: 'all', label: 'All Levels', icon: Info },
  { value: 'info', label: 'Info', icon: Info },
  { value: 'success', label: 'Success', icon: CheckCircle },
  { value: 'warning', label: 'Warning', icon: AlertTriangle },
  { value: 'error', label: 'Error', icon: XCircle }
]

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'auth', label: 'Authentication' },
  { value: 'database', label: 'Database' },
  { value: 'file', label: 'File Operations' },
  { value: 'system', label: 'System' },
  { value: 'user', label: 'User Actions' }
]

export default function LogsPage() {
  const [logs] = useState<LogEntry[]>(dummyLogs)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTimeRange, setSelectedTimeRange] = useState('all')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Filter logs based on search and filters
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.details?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel
      const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory
      
      let matchesTimeRange = true
      if (selectedTimeRange !== 'all') {
        const logTime = new Date(log.timestamp)
        const now = new Date()
        const timeDiff = now.getTime() - logTime.getTime()
        
        switch (selectedTimeRange) {
          case '1h':
            matchesTimeRange = timeDiff <= 60 * 60 * 1000
            break
          case '24h':
            matchesTimeRange = timeDiff <= 24 * 60 * 60 * 1000
            break
          case '7d':
            matchesTimeRange = timeDiff <= 7 * 24 * 60 * 60 * 1000
            break
          case '30d':
            matchesTimeRange = timeDiff <= 30 * 24 * 60 * 60 * 1000
            break
        }
      }
      
      return matchesSearch && matchesLevel && matchesCategory && matchesTimeRange
    })
  }, [logs, searchTerm, selectedLevel, selectedCategory, selectedTimeRange])

  const getLevelIcon = (level: string) => {
    const option = levelOptions.find(opt => opt.value === level)
    return option ? option.icon : Info
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth':
        return User
      case 'database':
        return Database
      case 'file':
        return FileText
      case 'system':
        return Database
      case 'user':
        return User
      default:
        return Info
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleExportLogs = () => {
    const csvContent = [
      'Timestamp,Level,Category,Message,User,IP Address,Status,Duration',
      ...filteredLogs.map(log => 
        `${log.timestamp},${log.level},${log.category},"${log.message}",${log.userName || ''},${log.ipAddress || ''},${log.status || ''},${log.duration || ''}`
      ).join('\n')
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logs-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
          <p className="text-muted-foreground">
            Monitor system activity, errors, and user actions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleExportLogs}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Level</label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {levelOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Log Entries</CardTitle>
            <Badge variant="secondary">
              {filteredLogs.length} of {logs.length} entries
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => {
                  const LevelIcon = getLevelIcon(log.level)
                  const CategoryIcon = getCategoryIcon(log.category)
                  
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getLevelColor(log.level)}>
                          <LevelIcon className="mr-1 h-3 w-3" />
                          {log.level.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                          {log.category}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={log.message}>
                          {log.message}
                        </div>
                        {log.details && (
                          <div className="text-xs text-muted-foreground mt-1 truncate" title={log.details}>
                            {log.details}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {log.userName ? (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{log.userName}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.ipAddress || '-'}
                      </TableCell>
                      <TableCell>
                        {log.status ? (
                          <Badge variant={log.status.startsWith('2') ? 'default' : 'destructive'}>
                            {log.status}
                          </Badge>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {log.duration ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {log.duration}ms
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No logs found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

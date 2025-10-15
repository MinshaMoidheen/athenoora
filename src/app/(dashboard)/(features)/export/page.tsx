'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Database, 
  Users, 
  BookOpen, 
  GraduationCap,
  UserCheck,
  Calendar,
  Filter,
  CheckCircle,
  Clock,
  Settings
} from 'lucide-react'

interface FieldOption {
  id: string
  name: string
  description: string
  selected: boolean
}

interface DataType {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  fields: FieldOption[]
  recordCount: number
}

const dataTypes: DataType[] = [
  {
    id: 'course-classes',
    name: 'Course Classes',
    description: 'Export course class information',
    icon: BookOpen,
    recordCount: 12,
    fields: [
      { id: 'name', name: 'Name', description: 'Course class name', selected: true },
      { id: 'description', name: 'Description', description: 'Course class description', selected: true },
      { id: 'createdAt', name: 'Created Date', description: 'When the class was created', selected: false },
      { id: 'updatedAt', name: 'Updated Date', description: 'When the class was last updated', selected: false },
      { id: 'studentCount', name: 'Student Count', description: 'Number of students enrolled', selected: false }
    ]
  },
  {
    id: 'sections',
    name: 'Sections',
    description: 'Export section information with course class details',
    icon: Users,
    recordCount: 24,
    fields: [
      { id: 'name', name: 'Section Name', description: 'Name of the section', selected: true },
      { id: 'courseClassName', name: 'Course Class', description: 'Associated course class', selected: true },
      { id: 'createdAt', name: 'Created Date', description: 'When the section was created', selected: false },
      { id: 'updatedAt', name: 'Updated Date', description: 'When the section was last updated', selected: false },
      { id: 'studentCount', name: 'Student Count', description: 'Number of students in section', selected: false }
    ]
  },
  {
    id: 'subjects',
    name: 'Subjects',
    description: 'Export subject information with codes and descriptions',
    icon: GraduationCap,
    recordCount: 18,
    fields: [
      { id: 'name', name: 'Subject Name', description: 'Name of the subject', selected: true },
      { id: 'code', name: 'Subject Code', description: 'Unique subject code', selected: true },
      { id: 'description', name: 'Description', description: 'Subject description', selected: true },
      { id: 'createdAt', name: 'Created Date', description: 'When the subject was created', selected: false },
      { id: 'updatedAt', name: 'Updated Date', description: 'When the subject was last updated', selected: false }
    ]
  },
  {
    id: 'teachers',
    name: 'Teachers',
    description: 'Export teacher information and credentials',
    icon: UserCheck,
    recordCount: 8,
    fields: [
      { id: 'username', name: 'Username', description: 'Teacher username', selected: true },
      { id: 'email', name: 'Email', description: 'Teacher email address', selected: true },
      { id: 'createdAt', name: 'Created Date', description: 'When the teacher was created', selected: false },
      { id: 'updatedAt', name: 'Updated Date', description: 'When the teacher was last updated', selected: false },
      { id: 'lastLogin', name: 'Last Login', description: 'Last login timestamp', selected: false }
    ]
  }
]

const formatOptions = [
  { value: 'csv', label: 'CSV', icon: FileText, description: 'Comma-separated values' },
  { value: 'xlsx', label: 'Excel', icon: FileSpreadsheet, description: 'Microsoft Excel format' },
  { value: 'pdf', label: 'PDF', icon: FileText, description: 'Portable Document Format' },
  { value: 'json', label: 'JSON', icon: Database, description: 'JavaScript Object Notation' }
]

export default function ExportPage() {
  const [selectedDataType, setSelectedDataType] = useState<string>('course-classes')
  const [selectedFormat, setSelectedFormat] = useState<string>('xlsx')
  const [isExporting, setIsExporting] = useState(false)
  const [dataTypesState, setDataTypesState] = useState<DataType[]>(dataTypes)
  const [exportHistory, setExportHistory] = useState<Array<{
    id: string
    dataType: string
    format: string
    timestamp: string
    status: 'success' | 'error'
    fileSize?: string
    fields: string[]
  }>>([
    {
      id: '1',
      dataType: 'Course Classes',
      format: 'xlsx',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'success',
      fileSize: '2.3 MB',
      fields: ['name', 'description']
    },
    {
      id: '2',
      dataType: 'Sections',
      format: 'csv',
      timestamp: '2024-01-14T15:45:00Z',
      status: 'success',
      fileSize: '1.8 MB',
      fields: ['name', 'courseClassName']
    }
  ])

  const currentDataType = dataTypesState.find(dt => dt.id === selectedDataType)

  const handleFieldToggle = (dataTypeId: string, fieldId: string) => {
    setDataTypesState(prev => 
      prev.map(dt => 
        dt.id === dataTypeId 
          ? {
              ...dt,
              fields: dt.fields.map(field => 
                field.id === fieldId 
                  ? { ...field, selected: !field.selected }
                  : field
              )
            }
          : dt
      )
    )
  }

  const handleSelectAllFields = (dataTypeId: string) => {
    setDataTypesState(prev => 
      prev.map(dt => 
        dt.id === dataTypeId 
          ? {
              ...dt,
              fields: dt.fields.map(field => ({ ...field, selected: true }))
            }
          : dt
      )
    )
  }

  const handleDeselectAllFields = (dataTypeId: string) => {
    setDataTypesState(prev => 
      prev.map(dt => 
        dt.id === dataTypeId 
          ? {
              ...dt,
              fields: dt.fields.map(field => ({ ...field, selected: false }))
            }
          : dt
      )
    )
  }

  const handleExport = async () => {
    if (!currentDataType) return
    
    setIsExporting(true)
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const selectedFields = currentDataType.fields.filter(field => field.selected)
    
    // Add to export history
    const newExport = {
      id: Date.now().toString(),
      dataType: currentDataType.name,
      format: selectedFormat,
      timestamp: new Date().toISOString(),
      status: 'success' as const,
      fileSize: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      fields: selectedFields.map(field => field.name)
    }
    
    setExportHistory(prev => [newExport, ...prev])
    setIsExporting(false)
    
    // Simulate file download
    const blob = new Blob(['Mock export data'], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentDataType.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.${selectedFormat}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getStatusIcon = (status: 'success' | 'error') => {
    return status === 'success' ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <Clock className="h-4 w-4 text-red-500" />
    )
  }

  const getFormatIcon = (format: string) => {
    const formatOption = formatOptions.find(opt => opt.value === format)
    return formatOption ? formatOption.icon : FileText
  }

  const selectedFieldsCount = currentDataType?.fields.filter(field => field.selected).length || 0
  const totalFieldsCount = currentDataType?.fields.length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Export Data</h1>
          <p className="text-muted-foreground">
            Select data type, choose fields, and export in your preferred format
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Data Type Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Data Type
              </CardTitle>
              <CardDescription>
                Choose the type of data you want to export
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {dataTypesState.map((dataType) => {
                const Icon = dataType.icon
                const isSelected = selectedDataType === dataType.id
                
                return (
                  <div
                    key={dataType.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedDataType(dataType.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        <Icon className={`h-4 w-4 ${
                          isSelected ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{dataType.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {dataType.recordCount} records
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Field Selection and Export Options */}
        <div className="lg:col-span-2 space-y-6">
          {/* Field Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Select Fields
                  </CardTitle>
                  <CardDescription>
                    Choose which fields to include in your export
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectAllFields(selectedDataType)}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeselectAllFields(selectedDataType)}
                  >
                    Deselect All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentDataType?.fields.map((field) => (
                  <div key={field.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={field.id}
                      checked={field.selected}
                      onCheckedChange={() => handleFieldToggle(selectedDataType, field.id)}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={field.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {field.name}
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {field.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium">
                  {selectedFieldsCount} of {totalFieldsCount} fields selected
                </div>
                <div className="text-xs text-muted-foreground">
                  {selectedFieldsCount === 0 
                    ? 'No fields selected for export'
                    : selectedFieldsCount === totalFieldsCount
                    ? 'All fields selected'
                    : `${totalFieldsCount - selectedFieldsCount} fields will be excluded`
                  }
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>
                Choose your preferred export format and start the export
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Export Format</label>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {option.description}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium">
                    Export {currentDataType?.name} ({selectedFieldsCount} fields)
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Format: {formatOptions.find(f => f.value === selectedFormat)?.label}
                  </div>
                </div>
                <Button 
                  onClick={handleExport}
                  disabled={isExporting || selectedFieldsCount === 0}
                  className="min-w-[120px]"
                >
                  {isExporting ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export Now
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      
    </div>
  )
}

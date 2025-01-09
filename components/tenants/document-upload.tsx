'use client'

import { useState } from 'react'
import { Upload, X, FileText, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Document {
  id: string
  name: string
  status: 'uploading' | 'complete' | 'error'
}

export function DocumentUpload() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    setIsUploading(true)

    for (const file of Array.from(files)) {
      const doc: Document = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        status: 'uploading',
      }

      setDocuments(prev => [...prev, doc])

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) throw new Error('Upload failed')

        setDocuments(prev =>
          prev.map(d =>
            d.id === doc.id ? { ...d, status: 'complete' } : d
          )
        )
      } catch (error) {
        setDocuments(prev =>
          prev.map(d =>
            d.id === doc.id ? { ...d, status: 'error' } : d
          )
        )
        toast({
          title: "Error",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        })
      }
    }

    setIsUploading(false)
  }

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Upload</CardTitle>
        <CardDescription>
          Upload required documents for your application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, PNG, JPG or DOCX (MAX. 10MB)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.docx"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
            </label>
          </div>

          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{doc.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {doc.status === 'uploading' && (
                    <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
                  )}
                  {doc.status === 'complete' && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                  {doc.status === 'error' && (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDocument(doc.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


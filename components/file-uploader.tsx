'use client'

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react'

interface FileUploaderProps {
  onUpload: (files: File[]) => void
}

export function FileUploader({ onUpload }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files)
      setFiles(prevFiles => [...prevFiles, ...newFiles])
      onUpload(newFiles)

      // Simulate upload progress
      newFiles.forEach(file => {
        let progress = 0
        const interval = setInterval(() => {
          progress += 10
          setUploadProgress(prev => ({ ...prev, [file.name]: progress }))
          if (progress >= 100) {
            clearInterval(interval)
          }
        }, 500)
      })
    }
  }

  const removeFile = (fileToRemove: File) => {
    setFiles(files => files.filter(file => file !== fileToRemove))
    setUploadProgress(prev => {
      const { [fileToRemove.name]: _, ...rest } = prev
      return rest
    })
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (event.dataTransfer.files) {
      const newFiles = Array.from(event.dataTransfer.files)
      setFiles(prevFiles => [...prevFiles, ...newFiles])
      onUpload(newFiles)

      // Simulate upload progress
      newFiles.forEach(file => {
        let progress = 0
        const interval = setInterval(() => {
          progress += 10
          setUploadProgress(prev => ({ ...prev, [file.name]: progress }))
          if (progress >= 100) {
            clearInterval(interval)
          }
        }, 500)
      })
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-[#f6c90e]"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          className="hidden"
        />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">Drag 'n' drop some files here, or click to select files</p>
      </div>
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file) => (
            <li key={file.name} className="flex items-center justify-between p-2 bg-white rounded-md shadow">
              <div className="flex items-center space-x-2 overflow-hidden">
                <div className="flex-shrink-0">
                  {uploadProgress[file.name] === 100 ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-[#f6c90e]" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={uploadProgress[file.name] || 0} className="w-24" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(file)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
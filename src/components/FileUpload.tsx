'use client'

import { useState, useRef } from "react"
import { X } from "lucide-react"

export default function FileUpload() {
  const [dragging, setDragging] = useState(false)
  const [files, setFiles] = useState<FileList | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileClick = () => {
    fileRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    setFiles(e.target.files)

    if (!files) return
  }
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    setDragging(false)
    setFiles(e.dataTransfer.files)

    if (!files) return
  }

  const removeFile = (name: string) => {
    if (!files) return null

    const filesArray = Array.from(files)
    const filteredFilesArray = filesArray.filter(file => file.name !== name)

    const dataTransfer = new DataTransfer()
    filteredFilesArray.forEach(file => dataTransfer.items.add(file))
    
    setFiles(dataTransfer.files)
  }

  return (
    <>
      <div
        onClick={handleFileClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 p-[1.5rem] text-center rounded-md cursor-pointer transition-all duration-300 ease-in
          ${dragging ? 'border-2 border-blue-500' : 'border-dashed border-gray-400'}
        `}
      >
        <input type='file' multiple hidden ref={fileRef} onChange={handleFileSelect}/>
        {dragging ? 'Drop the file here...' : 'Drag and drop a file here...'}
      </div>

      <div className={`h-30 p-[1rem] overflow-auto ${files ? 'opacity-100' : 'opacity-0'}`}>
        {
          files && (
            <>
              <h2 className='text-xl'>Selected files:</h2>
              {
                [...files].map((file, index) => (
                  <div key={`${file.name}-${index}`} className='flex gap-1 items-center'>
                    <span>{file.name}</span>
                    <X className='hover:bg-red-500 hover:rounded-md p-0.5' onClick={() => removeFile(file.name)}/>
                  </div>
                ))
              }
            </>
          )
        }
      </div>
    </>
  )
}
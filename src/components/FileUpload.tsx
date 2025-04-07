"use client"

import { useState, useRef, useEffect, useTransition, ChangeEvent, DragEvent } from "react"
import { X, Upload, Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { uploadFiles, listFiles } from "@/utils/supabase/client"
import { useGlobalContext } from "@/context/global.context"

type ErrorType = {
  fileName: string
  error: string | undefined
}

export default function FileUpload() {
  const [dragging, setDragging] = useState(false)
  const [files, setFiles] = useState<FileList | null>(null)
  const [errors, setErrors] = useState<ErrorType[] | undefined>(undefined)
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const { value, setValue } = useGlobalContext()

  const user = "example@gmail.com"
  const path = `public/${user}/files`

  useEffect(() => {
    console.log(files)
    if (files?.length == 0) setFiles(null)
  }, [files])

  const handleFileClick = () => {
    inputFileRef.current?.click()
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    setFiles(e.target.files)

    if (!files) return
  }
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    setDragging(false)
    setFiles(e.dataTransfer.files)

    if (!files) return
  }

  const handleUnselect = (name: string) => {
    if (!files) return null

    const filesArray = Array.from(files)
    const filteredFilesArray = filesArray.filter(file => file.name !== name)

    const dataTransfer = new DataTransfer()
    filteredFilesArray.forEach(file => dataTransfer.items.add(file))
    
    setFiles(dataTransfer.files) 
  }

  const handleFileUpload = () => {
   startTransition(async () => {
    const results = await uploadFiles({
      path: path + "/",
      files: files
    })

    const listedFiles = await listFiles(path)
    setValue(listedFiles)

    console.log(results)

    const hasError = results?.some(result => !result.success)
    if (hasError) {
      const errorMessages = results?.filter(result => !result.success)
        .map(result => ({
          fileName: result.filename, 
          error: result.error?.message
        }))
      
      setErrors(undefined)  
      setErrors(errorMessages)

      return
    }

    setErrors(undefined)    
    window.alert("Files uplodaded succesfully")
   })
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
          ${dragging ? "border-2 border-blue-500 bg-primary/20" : "border-dashed border-gray-400"}
        `}
      >
        <input type="file" multiple hidden ref={inputFileRef} onChange={handleFileSelect}/>
        {dragging ? "Drop the file here..." : "Drag and drop a file here..."}
      </div>

      <div className="h-30 p-[1rem] overflow-auto">
        {
          files && (
            <>
              <h2 className="text-xl">Selected files</h2>
              {
                [...files].map((file, index) => (
                  <div key={`${file.name}-${index}`} className="flex gap-1 items-center">
                    <X className="hover:bg-red-500 hover:rounded-md p-0.5" onClick={() => handleUnselect(file.name)}/>
                    <span>{file.name}</span>
                  </div>
                ))
              }
            </>
          )
        }
      </div>
      <div className="h-30 p-[1rem] overflow-auto text-red-500">
        {
          errors && (
            errors.map(error => (
              <p>{error.error}</p>
            ))
          )
        }
      </div>
      <div className="flex items-center justify-center">
        <Button onClick={handleFileUpload} disabled={!files || isPending}>
          {
            isPending ?
            (
              <>
                <Loader2 className="animate-spin" />
                <span>Uploading files</span>
              </>
            )
            :
            (
              <>
                <Upload />
                <span>Upload files</span>
              </>
            )
          }
          
        </Button>
      </div>
    </>
  )
}
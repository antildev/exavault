'use client'

import { useEffect } from "react"
import { listFiles } from "@/utils/supabase/client"
import { useGlobalContext } from "@/context/global.context"

export default function FileListing() {
  const user = 'example@gmail.com'
  const path = `public/${user}/files`
  const { value, setValue } = useGlobalContext()

  useEffect(() => {
    const loadFiles = async () => {
      const listedFiles = await listFiles(path)
      setValue(listedFiles)
    }

    loadFiles()
  }, [])

  return (
    <div>
      {
        value && (
          <>
            <h2 className='text-xl'>Uploaded files</h2>
            {
              value?.map(file => (
                <div key={file.name}>{file.name}</div>
              ))
            }
          </>
        )
      }
    </div>
  )
}
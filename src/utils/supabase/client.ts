import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

const supabase = createClient(supabaseUrl, supabaseKey)

type UploadProps = {
  path: string
  files: FileList | null
}

type ErrorType = {
  statusCode: string
  error: string
  message: string
}

export const uploadFiles = async ({ path, files }: UploadProps) => {
  if (!files) return

  const results = []

  const fileSizeLimit = 4194304
  let totalFileSize = 0
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    totalFileSize += files[i].size

    try {
      if (totalFileSize > fileSizeLimit) {
        const error = new Error("File(s) too big or not enough space. Maximum upload size: 5MB") as Error & ErrorType
        error.error = "Payload too large"
        error.statusCode = "413"

        throw error
      }

      const { data, error } = await supabase.storage
        .from("exavault-bucket")
        .upload(`${path}${file.name}`, file)

      if (error) throw error

      results.push({
        filename: file.name,
        success: true
      })
    } catch (error) {
      results.push({
        filename: file.name,
        error: error as ErrorType,
        success: false
      })
    }
  }

  return results
}

export const listFiles = async (path: string) => {
  const { data, error } = await supabase.storage
    .from("exavault-bucket")
    .list(path)

  return data
}
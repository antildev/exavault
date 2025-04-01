import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

const supabase = createClient(supabaseUrl, supabaseKey)

type UploadProps = {
  path: string
  files: FileList | null
}

export const uploadFiles = async ({ path, files }: UploadProps) => {
  if (!files) return

  const results = []
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    try {
      const { data, error } = await supabase.storage
        .from('exavault-bucket')
        .upload(`${path}${file.name}`, file)

      if (error) throw error

      results.push({
        filename: file.name,
        success: true
      })
    } catch (error) {
      results.push({
        filename: file.name,
        error: error,
        success: false
      })
    }
  }

  return results
}

export const listFiles = async (path: string) => {
  const { data, error } = await supabase.storage
    .from('exavault-bucket')
    .list(path)

  return data
}
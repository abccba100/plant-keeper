import { useEffect, useState } from 'react'
import { getImageUploadError, replaceObjectUrl, revokeObjectUrl } from '../api/imageUpload'

export function useImageUpload() {
  const [file, setFile] = useState<File>()
  const [fileUrl, setFileUrl] = useState<string>()
  const [fileName, setFileName] = useState<string>()
  const [uploadError, setUploadError] = useState<string>()

  function pickImage(nextFile: File) {
    const error = getImageUploadError(nextFile)

    if (error) {
      setUploadError(error)
      return false
    }

    setUploadError(undefined)
    setFile(nextFile)
    setFileName(nextFile.name)
    setFileUrl((oldUrl) => replaceObjectUrl(oldUrl, nextFile))

    return true
  }

  function resetImage() {
    revokeObjectUrl(fileUrl)
    setFile(undefined)
    setFileUrl(undefined)
    setFileName(undefined)
    setUploadError(undefined)
  }

  useEffect(() => () => revokeObjectUrl(fileUrl), [fileUrl])

  return {
    file,
    fileUrl,
    fileName,
    uploadError,
    setUploadError,
    pickImage,
    resetImage,
  }
}

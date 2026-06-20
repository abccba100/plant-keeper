const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp']

export function getImageUploadError(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'PNG, JPG, WEBP 이미지만 업로드할 수 있어요.'
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return '5MB 이하 이미지만 업로드해 주세요.'
  }
}

export function replaceObjectUrl(previousUrl: string | undefined, file: File) {
  if (previousUrl) {
    URL.revokeObjectURL(previousUrl)
  }

  return URL.createObjectURL(file)
}

export function revokeObjectUrl(url: string | undefined) {
  if (url) {
    URL.revokeObjectURL(url)
  }
}

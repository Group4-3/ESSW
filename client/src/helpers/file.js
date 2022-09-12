export const getFileIcon = (mimetype) => {
  console.log(mimetype)
  const icons = {
    'application/pdf': 'bi-filetype-pdf',
    'application/zip': 'bi-file-zip',
    'application/msword': 'bi-filetype-doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'bi-filetype-docx',
    'image/jpeg': 'bi-filetype-jpg',
    'image/png': 'bi-filetype-png',
    'video/mp4': 'bi-filetype-mp4'
  }

  return icons[mimetype] != undefined ? icons[mimetype] : 'bi-file-earmark'
}

export const humanReadableSize = (bytes) => {
    let size = parseInt(bytes)
    for (let unit of ['B', 'KB', 'MB', 'GB']) {
        if (size < 1024) return `${size.toFixed(1)} ${unit}`
        size /= 1024.0
    }

    return size
}

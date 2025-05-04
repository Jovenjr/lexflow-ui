
export async function downloadPdf(url: string, filename = 'documento.pdf') {
  const res = await fetch(url)
  const blob = await res.blob()
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

export function formatDatetime (timestamp: number | string): string {
  const date = new Date(Number(timestamp))

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} @ ${hours}:${minutes}`
}

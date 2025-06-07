export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB'
  }).format(price)
}

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) {
    return `${minutes} мин`
  }

  if (remainingMinutes === 0) {
    return `${hours} ч`
  }

  return `${hours} ч ${remainingMinutes} мин`
}

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('ru-RU').format(number)
} 
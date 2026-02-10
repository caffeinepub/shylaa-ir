export function formatPersianNumber(num: number, locale: string = 'fa-IR'): string {
  return new Intl.NumberFormat(locale).format(num);
}

export function formatPersianDate(date: Date | bigint, locale: string = 'fa-IR'): string {
  const dateObj = typeof date === 'bigint' ? new Date(Number(date) / 1000000) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

export function formatShortDate(date: Date | bigint, locale: string = 'fa-IR'): string {
  const dateObj = typeof date === 'bigint' ? new Date(Number(date) / 1000000) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
}

export function preserveLineBreaks(text: string): string {
  return text.replace(/\n/g, '<br />');
}

export function countPersianWords(text: string): number {
  // Remove extra whitespace and count words
  const cleaned = text.trim().replace(/\s+/g, ' ');
  return cleaned ? cleaned.split(' ').length : 0;
}

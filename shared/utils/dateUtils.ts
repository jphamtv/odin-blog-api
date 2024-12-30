import { formatDistance } from 'date-fns';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const weekInMs = 7 * 24 * 60 * 60 * 1000;

  if (now.getTime() - date.getTime() > weekInMs) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  return formatDistance(date, now, { addSuffix: false })
    .replace(' minutes', 'min')
    .replace(' minute', 'min')
    .replace(' hours', 'hr')
    .replace(' hour', 'hr')
    .replace(' days', 'd')
    .replace(' day', 'd')
};
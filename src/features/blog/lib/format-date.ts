/** Format calendar dates in the timezone used by ISO date-only content. */
export function formatBlogDate(date: Date, month: 'short' | 'long' = 'long'): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month,
    day: 'numeric',
    timeZone: 'UTC',
  });
}

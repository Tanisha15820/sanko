// Date and duration formatting helpers

// Extract YYYY-MM-DD from an item's startDate or display startTime (e.g. "20 Nov 2026, 10:15 AM")
export const extractIsoDate = (item) => {
  if (item.startDate) return item.startDate;
  if (!item.startTime) return '';
  const datePart = item.startTime.split(',')[0].trim();
  const parsed = new Date(datePart);
  if (Number.isNaN(parsed.getTime())) return '';
  const yyyy = parsed.getFullYear();
  const mm = String(parsed.getMonth() + 1).padStart(2, '0');
  const dd = String(parsed.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Format minutes into human-readable duration (e.g. 140 -> "2h 20m", 55 -> "55m")
export const formatDuration = (minutes) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  return `${hrs}h ${mins}m`;
};

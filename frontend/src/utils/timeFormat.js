// Malaysia Time (MYT) utilities - UTC+8

export const formatToMalaysiaTime = (dateString) => {
  if (!dateString) return '';

  // SQLite returns timestamps like "2026-06-18 00:11:15" without timezone
  // We need to treat them as UTC by adding 'Z' or parsing explicitly
  let date;

  // If the dateString doesn't have timezone info, assume it's UTC (from SQLite)
  if (typeof dateString === 'string' && dateString.includes(' ') && !dateString.includes('T') && !dateString.includes('Z')) {
    // SQLite format: "2026-06-18 00:11:15" - treat as UTC
    date = new Date(dateString.replace(' ', 'T') + 'Z');
  } else {
    date = new Date(dateString);
  }

  // Convert to Malaysia time (UTC+8)
  return date.toLocaleString('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

export const formatToMalaysiaDate = (dateString) => {
  if (!dateString) return '';

  let date;

  // If the dateString doesn't have timezone info, assume it's UTC (from SQLite)
  if (typeof dateString === 'string' && dateString.includes(' ') && !dateString.includes('T') && !dateString.includes('Z')) {
    // SQLite format: "2026-06-18 00:11:15" - treat as UTC
    date = new Date(dateString.replace(' ', 'T') + 'Z');
  } else {
    date = new Date(dateString);
  }

  return date.toLocaleDateString('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const getCurrentMalaysiaTime = () => {
  return new Date().toLocaleString('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

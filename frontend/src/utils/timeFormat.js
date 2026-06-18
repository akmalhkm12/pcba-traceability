// Malaysia Time (MYT) utilities - UTC+8

export const formatToMalaysiaTime = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);

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

  const date = new Date(dateString);

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

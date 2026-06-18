// CSV Export Utility

export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get headers from the first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  let csv = headers.join(',') + '\n';

  // Add rows
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Handle values that contain commas or quotes
      if (value === null || value === undefined) {
        return '';
      }
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
    csv += values.join(',') + '\n';
  });

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportPCBAsToCSV = (pcbas) => {
  const data = pcbas.map(pcba => ({
    'Serial Number': pcba.serial_number,
    'Board Type': pcba.board_type,
    'Status': pcba.status.toUpperCase(),
    'Created Date': pcba.created_at,
    'Last Updated': pcba.updated_at
  }));

  const filename = `PCBA_Export_${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(data, filename);
};

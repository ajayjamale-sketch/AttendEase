import { AttendanceRecord } from '@/types';

export function exportAttendanceToCSV(records: AttendanceRecord[], filename = 'attendance-export.csv'): void {
  const headers = ['Employee Name', 'Employee ID', 'Department', 'Date', 'Check In', 'Check Out', 'Status'];
  
  const rows = records.map(r => [
    r.employeeName,
    r.employeeId,
    r.department,
    r.date,
    r.checkIn,
    r.checkOut,
    r.status,
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

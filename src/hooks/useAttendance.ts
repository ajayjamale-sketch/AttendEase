import { useState, useCallback } from 'react';
import { AttendanceRecord, AttendanceStatus } from '@/types';
import { getAttendanceRecords, saveAttendanceRecords } from '@/utils/localStorage';
import { generateAttendanceHistory } from '@/data/employees';
import { getTodayString } from '@/lib/utils';

function initAttendance(): AttendanceRecord[] {
  const stored = getAttendanceRecords();
  if (stored.length === 0) {
    const history = generateAttendanceHistory();
    saveAttendanceRecords(history);
    return history;
  }
  return stored;
}

export function useAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>(initAttendance);

  const getTodayRecords = useCallback(() => {
    const today = getTodayString();
    return records.filter(r => r.date === today);
  }, [records]);

  const markAttendance = useCallback((employeeId: string, employeeName: string, department: string, status: AttendanceStatus) => {
    const today = getTodayString();
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    
    setRecords(prev => {
      const existing = prev.findIndex(r => r.employeeId === employeeId && r.date === today);
      let next: AttendanceRecord[];
      
      const newRecord: AttendanceRecord = {
        id: `${today}-${employeeId}`,
        employeeId,
        employeeName,
        department,
        date: today,
        checkIn: status === 'Absent' ? '--:--' : timeStr,
        checkOut: '--:--',
        status,
      };

      if (existing >= 0) {
        next = prev.map((r, i) => i === existing ? newRecord : r);
      } else {
        next = [...prev, newRecord];
      }
      
      saveAttendanceRecords(next);
      return next;
    });
  }, []);

  const saveBulkAttendance = useCallback((bulk: Array<{ employeeId: string; employeeName: string; department: string; status: AttendanceStatus }>) => {
    const today = getTodayString();
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

    setRecords(prev => {
      const filtered = prev.filter(r => r.date !== today);
      const newRecords: AttendanceRecord[] = bulk.map(b => ({
        id: `${today}-${b.employeeId}`,
        employeeId: b.employeeId,
        employeeName: b.employeeName,
        department: b.department,
        date: today,
        checkIn: b.status === 'Absent' ? '--:--' : timeStr,
        checkOut: '--:--',
        status: b.status,
      }));
      const next = [...filtered, ...newRecords];
      saveAttendanceRecords(next);
      return next;
    });
  }, []);

  return { records, getTodayRecords, markAttendance, saveBulkAttendance };
}

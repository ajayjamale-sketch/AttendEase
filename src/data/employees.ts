import { Employee } from '@/types';

export const SAMPLE_EMPLOYEES: Employee[] = [
  { id: '1', employeeId: 'EMP001', name: 'John Doe', department: 'IT', email: 'john.doe@company.com', phone: '+1 555-0101', position: 'Senior Developer', status: 'Active', joinDate: '2022-01-15' },
  { id: '2', employeeId: 'EMP002', name: 'Sarah Johnson', department: 'HR', email: 'sarah.johnson@company.com', phone: '+1 555-0102', position: 'HR Manager', status: 'Active', joinDate: '2021-06-10' },
  { id: '3', employeeId: 'EMP003', name: 'Michael Chen', department: 'Finance', email: 'michael.chen@company.com', phone: '+1 555-0103', position: 'Financial Analyst', status: 'Active', joinDate: '2022-03-20' },
  { id: '4', employeeId: 'EMP004', name: 'Emily Rodriguez', department: 'Marketing', email: 'emily.r@company.com', phone: '+1 555-0104', position: 'Marketing Lead', status: 'Active', joinDate: '2021-11-05' },
  { id: '5', employeeId: 'EMP005', name: 'David Kim', department: 'Engineering', email: 'david.kim@company.com', phone: '+1 555-0105', position: 'Software Engineer', status: 'Active', joinDate: '2023-01-10' },
  { id: '6', employeeId: 'EMP006', name: 'Lisa Thompson', department: 'Design', email: 'lisa.t@company.com', phone: '+1 555-0106', position: 'UI/UX Designer', status: 'Active', joinDate: '2022-07-18' },
  { id: '7', employeeId: 'EMP007', name: 'James Wilson', department: 'Sales', email: 'james.w@company.com', phone: '+1 555-0107', position: 'Sales Manager', status: 'Active', joinDate: '2021-09-30' },
  { id: '8', employeeId: 'EMP008', name: 'Aisha Patel', department: 'IT', email: 'aisha.p@company.com', phone: '+1 555-0108', position: 'DevOps Engineer', status: 'Active', joinDate: '2022-05-12' },
  { id: '9', employeeId: 'EMP009', name: 'Robert Garcia', department: 'Operations', email: 'robert.g@company.com', phone: '+1 555-0109', position: 'Operations Director', status: 'Active', joinDate: '2020-04-01' },
  { id: '10', employeeId: 'EMP010', name: 'Nina Foster', department: 'Finance', email: 'nina.f@company.com', phone: '+1 555-0110', position: 'Accountant', status: 'Inactive', joinDate: '2021-02-28' },
  { id: '11', employeeId: 'EMP011', name: 'Carlos Rivera', department: 'Engineering', email: 'carlos.r@company.com', phone: '+1 555-0111', position: 'Backend Developer', status: 'Active', joinDate: '2023-03-15' },
  { id: '12', employeeId: 'EMP012', name: 'Priya Singh', department: 'HR', email: 'priya.s@company.com', phone: '+1 555-0112', position: 'Recruiter', status: 'Active', joinDate: '2022-10-20' },
];

export function generateAttendanceHistory(): import('@/types').AttendanceRecord[] {
  const records: import('@/types').AttendanceRecord[] = [];
  const today = new Date();
  const statuses: import('@/types').AttendanceStatus[] = ['Present', 'Present', 'Present', 'Late', 'Absent', 'Present'];
  
  for (let d = 30; d >= 0; d--) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    
    const dateStr = date.toISOString().split('T')[0];
    
    SAMPLE_EMPLOYEES.forEach((emp, idx) => {
      const statusIndex = (idx + d) % statuses.length;
      const status = statuses[statusIndex];
      const checkInHour = status === 'Late' ? `09:${30 + (idx % 30) < 60 ? (30 + (idx % 30)).toString().padStart(2,'0') : '59'}` : `08:${(idx * 7 % 60).toString().padStart(2,'0')}`;
      const checkOutHour = status === 'Absent' ? '--:--' : `17:${(idx * 5 % 60).toString().padStart(2,'0')}`;
      
      records.push({
        id: `${dateStr}-${emp.id}`,
        employeeId: emp.employeeId,
        employeeName: emp.name,
        department: emp.department,
        date: dateStr,
        checkIn: status === 'Absent' ? '--:--' : checkInHour,
        checkOut: checkOutHour,
        status,
      });
    });
  }
  
  return records;
}

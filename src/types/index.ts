export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  position: string;
  status: 'Active' | 'Inactive';
  joinDate: string;
  avatar?: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: AttendanceStatus;
}

export interface AuthUser {
  username: string;
  role: 'Admin' | 'Employee';
  name: string;
}

export interface AppSettings {
  companyName: string;
  darkMode: boolean;
  workStartTime: string;
  workEndTime: string;
}

export const DEPARTMENTS = [
  'IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations', 'Engineering', 'Design'
] as const;

export type Department = typeof DEPARTMENTS[number];

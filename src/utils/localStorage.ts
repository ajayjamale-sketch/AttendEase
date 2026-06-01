import { Employee, AttendanceRecord, AuthUser, AppSettings } from '@/types';

const KEYS = {
  EMPLOYEES: 'attendease_employees',
  ATTENDANCE: 'attendease_attendance',
  AUTH: 'attendease_auth',
  SETTINGS: 'attendease_settings',
  REMEMBER_ME: 'attendease_remember_me',
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Employees
export function getEmployees(): Employee[] {
  return getItem<Employee[]>(KEYS.EMPLOYEES, []);
}
export function saveEmployees(employees: Employee[]): void {
  setItem(KEYS.EMPLOYEES, employees);
}

// Attendance
export function getAttendanceRecords(): AttendanceRecord[] {
  return getItem<AttendanceRecord[]>(KEYS.ATTENDANCE, []);
}
export function saveAttendanceRecords(records: AttendanceRecord[]): void {
  setItem(KEYS.ATTENDANCE, records);
}

// Auth
export function getAuthUser(): AuthUser | null {
  return getItem<AuthUser | null>(KEYS.AUTH, null);
}
export function saveAuthUser(user: AuthUser | null): void {
  setItem(KEYS.AUTH, user);
}

// Settings
export function getSettings(): AppSettings {
  return getItem<AppSettings>(KEYS.SETTINGS, {
    companyName: 'AttendEase Corp',
    darkMode: false,
    workStartTime: '09:00',
    workEndTime: '17:00',
  });
}
export function saveSettings(settings: AppSettings): void {
  setItem(KEYS.SETTINGS, settings);
}

// Remember Me
export function getRememberMe(): { username: string } | null {
  return getItem<{ username: string } | null>(KEYS.REMEMBER_ME, null);
}
export function saveRememberMe(data: { username: string } | null): void {
  setItem(KEYS.REMEMBER_ME, data);
}

// Reset
export function resetAllData(): void {
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
}

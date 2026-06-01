import { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, Clock, Save, Search, Filter } from 'lucide-react';
import { useEmployees } from '@/hooks/useEmployees';
import { useAttendance } from '@/hooks/useAttendance';
import { AttendanceStatus, DEPARTMENTS } from '@/types';
import { getDepartmentColor, getInitials, getTodayString, formatDate, cn } from '@/lib/utils';
import { toast } from 'sonner';

type BulkStatus = Record<string, AttendanceStatus>;

export default function Attendance() {
  const { employees } = useEmployees();
  const { records, saveBulkAttendance } = useAttendance();
  const today = getTodayString();
  
  const todayRecords = useMemo(() => {
    const map: Record<string, AttendanceStatus> = {};
    records.filter(r => r.date === today).forEach(r => { map[r.employeeId] = r.status; });
    return map;
  }, [records, today]);

  const [statuses, setStatuses] = useState<BulkStatus>(() => {
    const init: BulkStatus = {};
    employees.filter(e => e.status === 'Active').forEach(e => {
      init[e.employeeId] = todayRecords[e.employeeId] || 'Present';
    });
    return init;
  });
  
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [saved, setSaved] = useState(false);

  const activeEmployees = useMemo(() =>
    employees.filter(e => e.status === 'Active').filter(e => {
      const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === 'All' || e.department === deptFilter;
      return matchSearch && matchDept;
    }), [employees, search, deptFilter]);

  const setStatus = (empId: string, status: AttendanceStatus) => {
    setStatuses(prev => ({ ...prev, [empId]: status }));
    setSaved(false);
  };

  const markAll = (status: AttendanceStatus) => {
    const next: BulkStatus = {};
    activeEmployees.forEach(e => { next[e.employeeId] = status; });
    setStatuses(prev => ({ ...prev, ...next }));
    setSaved(false);
  };

  const handleSave = () => {
    const bulk = employees.filter(e => e.status === 'Active').map(e => ({
      employeeId: e.employeeId,
      employeeName: e.name,
      department: e.department,
      status: statuses[e.employeeId] || 'Absent',
    }));
    saveBulkAttendance(bulk);
    setSaved(true);
    toast.success(`Attendance saved for ${bulk.length} employees`);
  };

  const summary = useMemo(() => {
    const all = Object.values(statuses);
    return {
      present: all.filter(s => s === 'Present').length,
      late: all.filter(s => s === 'Late').length,
      absent: all.filter(s => s === 'Absent').length,
      leave: all.filter(s => s === 'Leave').length,
    };
  }, [statuses]);

  const StatusBtn = ({ status, current, empId }: { status: AttendanceStatus; current: AttendanceStatus; empId: string }) => {
    const styles: Record<AttendanceStatus, { active: string; icon: React.ReactNode }> = {
      Present: { active: 'bg-emerald-500 text-white border-emerald-500', icon: <CheckCircle2 size={13} /> },
      Absent: { active: 'bg-red-500 text-white border-red-500', icon: <XCircle size={13} /> },
      Late: { active: 'bg-amber-500 text-white border-amber-500', icon: <Clock size={13} /> },
      Leave: { active: 'bg-blue-500 text-white border-blue-500', icon: <span className="text-xs font-bold">L</span> },
    };
    const s = styles[status];
    return (
      <button
        onClick={() => setStatus(empId, status)}
        className={cn(
          'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all',
          current === status ? s.active : 'border-border text-muted-foreground hover:bg-muted'
        )}
      >
        {s.icon} {status}
      </button>
    );
  };

  return (
    <div className="space-y-5">
      {/* Date + summary */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Mark Attendance</h2>
            <p className="text-sm text-muted-foreground">{formatDate(today)} — {employees.filter(e => e.status === 'Active').length} active employees</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /><span className="text-muted-foreground">{summary.present} Present</span></div>
            <div className="flex items-center gap-1.5 text-sm"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /><span className="text-muted-foreground">{summary.late} Late</span></div>
            <div className="flex items-center gap-1.5 text-sm"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /><span className="text-muted-foreground">{summary.absent} Absent</span></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search employees..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-border rounded-lg bg-card text-foreground focus:outline-none"
        >
          <option value="All">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <div className="flex gap-2">
          <button onClick={() => markAll('Present')} className="px-3 py-2.5 text-sm rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors font-medium dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
            All Present
          </button>
          <button onClick={() => markAll('Absent')} className="px-3 py-2.5 text-sm rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors font-medium dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
            All Absent
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 py-3">Employee</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 py-3 hidden sm:table-cell">Department</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 py-3 hidden md:table-cell">Position</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 py-3">Attendance Status</th>
              </tr>
            </thead>
            <tbody>
              {activeEmployees.map(emp => (
                <tr key={emp.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center flex-shrink-0">
                        {getInitials(emp.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{emp.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{emp.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className={cn('text-xs font-medium px-2 py-1 rounded-full', getDepartmentColor(emp.department))}>
                      {emp.department}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground hidden md:table-cell">{emp.position}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5 flex-wrap">
                      {(['Present', 'Late', 'Absent', 'Leave'] as AttendanceStatus[]).map(s => (
                        <StatusBtn key={s} status={s} current={statuses[emp.employeeId] || 'Present'} empId={emp.employeeId} />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all',
            saved
              ? 'bg-emerald-500 text-white'
              : 'bg-primary text-primary-foreground hover:opacity-90'
          )}
        >
          <Save size={16} />
          {saved ? 'Attendance Saved!' : 'Save Attendance'}
        </button>
      </div>
    </div>
  );
}

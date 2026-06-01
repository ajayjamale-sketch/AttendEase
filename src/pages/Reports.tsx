import { useMemo, useState } from 'react';
import { TrendingUp, Users, UserCheck, UserX, Clock, Calendar } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import { StatCard } from '@/components/features/StatCard';
import { useAttendance } from '@/hooks/useAttendance';
import { useEmployees } from '@/hooks/useEmployees';
import { getDepartmentColor, cn } from '@/lib/utils';

const PIE_COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Reports() {
  const { records } = useAttendance();
  const { employees } = useEmployees();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(new Date().getFullYear());

  const monthlyRecords = useMemo(() => {
    return records.filter(r => {
      const d = new Date(r.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });
  }, [records, selectedMonth, selectedYear]);

  const stats = useMemo(() => {
    const total = monthlyRecords.length;
    const present = monthlyRecords.filter(r => r.status === 'Present').length;
    const absent = monthlyRecords.filter(r => r.status === 'Absent').length;
    const late = monthlyRecords.filter(r => r.status === 'Late').length;
    const pct = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
    return { total, present, absent, late, pct };
  }, [monthlyRecords]);

  // Dept breakdown
  const deptData = useMemo(() => {
    const deps: Record<string, { present: number; absent: number; late: number; total: number }> = {};
    monthlyRecords.forEach(r => {
      if (!deps[r.department]) deps[r.department] = { present: 0, absent: 0, late: 0, total: 0 };
      deps[r.department].total++;
      if (r.status === 'Present') deps[r.department].present++;
      else if (r.status === 'Absent') deps[r.department].absent++;
      else if (r.status === 'Late') deps[r.department].late++;
    });
    return Object.entries(deps).map(([dept, d]) => ({
      dept,
      Present: d.present,
      Absent: d.absent,
      Late: d.late,
      Rate: d.total > 0 ? Math.round(((d.present + d.late) / d.total) * 100) : 0,
    }));
  }, [monthlyRecords]);

  // Daily trend for current month
  const dailyTrend = useMemo(() => {
    const days: Record<string, { present: number; absent: number; late: number }> = {};
    monthlyRecords.forEach(r => {
      if (!days[r.date]) days[r.date] = { present: 0, absent: 0, late: 0 };
      if (r.status === 'Present') days[r.date].present++;
      else if (r.status === 'Absent') days[r.date].absent++;
      else if (r.status === 'Late') days[r.date].late++;
    });
    return Object.entries(days).sort(([a], [b]) => a.localeCompare(b)).map(([date, d]) => ({
      date: new Date(date).getDate().toString(),
      Present: d.present,
      Absent: d.absent,
      Late: d.late,
    }));
  }, [monthlyRecords]);

  // Pie data
  const pieData = [
    { name: 'Present', value: stats.present },
    { name: 'Absent', value: stats.absent },
    { name: 'Late', value: stats.late },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Month selector */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-foreground flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            Select Month:
          </span>
          <div className="flex gap-2 flex-wrap">
            {MONTHS.map((m, i) => (
              <button
                key={m}
                onClick={() => setSelectedMonth(i)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  selectedMonth === i
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Monthly Attendance %" value={`${stats.pct}%`} subtitle={`${MONTHS[selectedMonth]} ${selectedYear}`} icon={TrendingUp} iconColor="text-primary" iconBg="bg-accent" />
        <StatCard title="Total Present Days" value={stats.present} subtitle="Including late check-ins" icon={UserCheck} iconColor="text-emerald-600" iconBg="bg-emerald-50 dark:bg-emerald-900/30" />
        <StatCard title="Total Absent Days" value={stats.absent} subtitle="Unexcused absences" icon={UserX} iconColor="text-red-600" iconBg="bg-red-50 dark:bg-red-900/30" />
        <StatCard title="Late Entries" value={stats.late} subtitle="After work start time" icon={Clock} iconColor="text-amber-600" iconBg="bg-amber-50 dark:bg-amber-900/30" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dept bar chart */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-1">Attendance by Department</h3>
          <p className="text-xs text-muted-foreground mb-5">{MONTHS[selectedMonth]} {selectedYear}</p>
          {deptData.length > 0 ? (
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={deptData} barSize={8}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="dept" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Present" fill="#22c55e" radius={[3,3,0,0]} />
                <Bar dataKey="Late" fill="#f59e0b" radius={[3,3,0,0]} />
                <Bar dataKey="Absent" fill="#ef4444" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[230px] flex items-center justify-center text-muted-foreground text-sm">No data available</div>
          )}
        </div>

        {/* Pie */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-1">Status Distribution</h3>
          <p className="text-xs text-muted-foreground mb-5">{MONTHS[selectedMonth]} {selectedYear}</p>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[230px] flex items-center justify-center text-muted-foreground text-sm">No data available</div>
          )}
        </div>
      </div>

      {/* Daily trend */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-1">Daily Attendance Trend</h3>
        <p className="text-xs text-muted-foreground mb-5">Day-by-day breakdown for {MONTHS[selectedMonth]} {selectedYear}</p>
        {dailyTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dailyTrend}>
              <defs>
                <linearGradient id="gPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gAbsent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="Present" stroke="#22c55e" fill="url(#gPresent)" strokeWidth={2} />
              <Area type="monotone" dataKey="Absent" stroke="#ef4444" fill="url(#gAbsent)" strokeWidth={2} />
              <Area type="monotone" dataKey="Late" stroke="#f59e0b" fill="transparent" strokeWidth={2} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">No trend data available for this month.</div>
        )}
      </div>

      {/* Dept rate table */}
      {deptData.length > 0 && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Department Attendance Rates</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {['Department', 'Present', 'Late', 'Absent', 'Attendance Rate'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deptData.sort((a, b) => b.Rate - a.Rate).map(d => (
                  <tr key={d.dept} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3">
                      <span className={cn('text-xs font-medium px-2 py-1 rounded-full', getDepartmentColor(d.dept))}>
                        {d.dept}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-emerald-600 font-medium">{d.Present}</td>
                    <td className="px-5 py-3 text-sm text-amber-600 font-medium">{d.Late}</td>
                    <td className="px-5 py-3 text-sm text-red-600 font-medium">{d.Absent}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[100px] h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${d.Rate}%` }}
                          />
                        </div>
                        <span className={cn('text-sm font-semibold', d.Rate >= 90 ? 'text-emerald-600' : d.Rate >= 75 ? 'text-amber-600' : 'text-red-600')}>
                          {d.Rate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

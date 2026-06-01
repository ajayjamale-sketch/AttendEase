import { useMemo } from 'react';
import { Users, UserCheck, UserX, TrendingUp, Clock, CalendarDays } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { StatCard } from '@/components/features/StatCard';
import { StatusBadge } from '@/components/features/StatusBadge';
import { useEmployees } from '@/hooks/useEmployees';
import { useAttendance } from '@/hooks/useAttendance';
import { getTodayString, formatDate, getDepartmentColor, getInitials, cn } from '@/lib/utils';

const PIE_COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6'];

export default function Dashboard() {
  const { employees } = useEmployees();
  const { records } = useAttendance();
  const today = getTodayString();

  const todayRecords = useMemo(() => records.filter(r => r.date === today), [records, today]);

  const stats = useMemo(() => {
    const total = employees.filter(e => e.status === 'Active').length;
    const present = todayRecords.filter(r => r.status === 'Present').length;
    const absent = todayRecords.filter(r => r.status === 'Absent').length;
    const late = todayRecords.filter(r => r.status === 'Late').length;
    const pct = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
    return { total, present, absent, late, pct };
  }, [employees, todayRecords]);

  // Weekly bar chart data
  const weeklyData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayRecs = records.filter(r => r.date === dateStr);
      days.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        Present: dayRecs.filter(r => r.status === 'Present').length,
        Late: dayRecs.filter(r => r.status === 'Late').length,
        Absent: dayRecs.filter(r => r.status === 'Absent').length,
      });
    }
    return days;
  }, [records]);

  const pieData = [
    { name: 'Present', value: stats.present },
    { name: 'Absent', value: stats.absent },
    { name: 'Late', value: stats.late },
    { name: 'Leave', value: todayRecords.filter(r => r.status === 'Leave').length },
  ].filter(d => d.value > 0);

  const recentRecords = useMemo(() =>
    [...records].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8)
  , [records]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value={stats.total} subtitle="Active employees" icon={Users} iconColor="text-blue-600" iconBg="bg-blue-50 dark:bg-blue-900/30" trend={{ value: 4, positive: true }} />
        <StatCard title="Present Today" value={stats.present} subtitle="On time" icon={UserCheck} iconColor="text-emerald-600" iconBg="bg-emerald-50 dark:bg-emerald-900/30" trend={{ value: 2, positive: true }} />
        <StatCard title="Absent Today" value={stats.absent} subtitle="Not checked in" icon={UserX} iconColor="text-red-600" iconBg="bg-red-50 dark:bg-red-900/30" trend={{ value: 8, positive: false }} />
        <StatCard title="Attendance Rate" value={`${stats.pct}%`} subtitle="Today's rate" icon={TrendingUp} iconColor="text-primary" iconBg="bg-accent" trend={{ value: 3, positive: true }} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly bar chart */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-foreground">Weekly Attendance</h3>
              <p className="text-xs text-muted-foreground">Last 7 days overview</p>
            </div>
            <span className="text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-full font-medium">This Week</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData} barSize={10} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} className="fill-muted-foreground" axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="Present" fill="#22c55e" radius={[4,4,0,0]} />
              <Bar dataKey="Late" fill="#f59e0b" radius={[4,4,0,0]} />
              <Bar dataKey="Absent" fill="#ef4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="mb-5">
            <h3 className="font-semibold text-foreground">Today's Status</h3>
            <p className="text-xs text-muted-foreground">Attendance breakdown</p>
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
              No attendance data for today
            </div>
          )}
        </div>
      </div>

      {/* Recent records */}
      <div className="bg-card rounded-xl border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Recent Attendance</h3>
          <CalendarDays size={18} className="text-muted-foreground" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 py-3">Employee</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 py-3 hidden sm:table-cell">Department</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 py-3">Date</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 py-3 hidden md:table-cell">Check In</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRecords.map(r => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {getInitials(r.employeeName)}
                      </div>
                      <span className="text-sm font-medium text-foreground truncate max-w-[120px]">{r.employeeName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className={cn('text-xs font-medium px-2 py-1 rounded-full', getDepartmentColor(r.department))}>
                      {r.department}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{formatDate(r.date)}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground hidden md:table-cell">{r.checkIn}</td>
                  <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

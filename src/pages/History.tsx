import { useState, useMemo } from 'react';
import { Search, Download, SortAsc, SortDesc, CalendarDays } from 'lucide-react';
import { useAttendance } from '@/hooks/useAttendance';
import { StatusBadge } from '@/components/features/StatusBadge';
import { getDepartmentColor, formatDate, getInitials, cn } from '@/lib/utils';
import { exportAttendanceToCSV } from '@/utils/csvExport';
import { toast } from 'sonner';
import { DEPARTMENTS } from '@/types';

type SortField = 'date' | 'employeeName' | 'department' | 'status';
type SortDir = 'asc' | 'desc';

export default function History() {
  const { records } = useAttendance();
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  const filtered = useMemo(() => {
    return records.filter(r => {
      const matchSearch = !search ||
        r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === 'All' || r.department === deptFilter;
      const matchStatus = statusFilter === 'All' || r.status === statusFilter;
      const matchFrom = !dateFrom || r.date >= dateFrom;
      const matchTo = !dateTo || r.date <= dateTo;
      return matchSearch && matchDept && matchStatus && matchFrom && matchTo;
    }).sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') cmp = a.date.localeCompare(b.date);
      else if (sortField === 'employeeName') cmp = a.employeeName.localeCompare(b.employeeName);
      else if (sortField === 'department') cmp = a.department.localeCompare(b.department);
      else if (sortField === 'status') cmp = a.status.localeCompare(b.status);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [records, search, deptFilter, statusFilter, dateFrom, dateTo, sortField, sortDir]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <SortAsc size={13} /> : <SortDesc size={13} />;
  };

  const handleExport = () => {
    exportAttendanceToCSV(filtered, `attendance-history-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success(`Exported ${filtered.length} records to CSV`);
  };

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search employee name or ID..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors whitespace-nowrap"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays size={15} className="text-muted-foreground" />
            <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }}
              className="px-2.5 py-1.5 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            <span className="text-muted-foreground">to</span>
            <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }}
              className="px-2.5 py-1.5 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <select value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setPage(1); }}
            className="px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none">
            <option value="All">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none">
            <option value="All">All Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
            <option value="Leave">Leave</option>
          </select>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing <strong className="text-foreground">{filtered.length}</strong> records
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {[
                  { label: 'Employee', field: 'employeeName' as SortField },
                  { label: 'Department', field: 'department' as SortField },
                  { label: 'Date', field: 'date' as SortField },
                  { label: 'Check In', field: null },
                  { label: 'Check Out', field: null },
                  { label: 'Status', field: 'status' as SortField },
                ].map(({ label, field }) => (
                  <th
                    key={label}
                    className={cn(
                      'text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 py-3',
                      field && 'cursor-pointer hover:text-foreground select-none',
                      (label === 'Department') && 'hidden sm:table-cell',
                      (label === 'Check Out') && 'hidden md:table-cell',
                    )}
                    onClick={() => field && toggleSort(field)}
                  >
                    <span className="flex items-center gap-1">
                      {label}
                      {field && <SortIcon field={field} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-muted-foreground text-sm">No records found.</td></tr>
              ) : paginated.map(r => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {getInitials(r.employeeName)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{r.employeeName}</p>
                        <p className="text-xs text-muted-foreground font-mono">{r.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className={cn('text-xs font-medium px-2 py-1 rounded-full', getDepartmentColor(r.department))}>
                      {r.department}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{formatDate(r.date)}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground font-mono">{r.checkIn}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground font-mono hidden md:table-cell">{r.checkOut}</td>
                  <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

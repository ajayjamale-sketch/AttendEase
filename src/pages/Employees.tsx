import { useState, useMemo } from 'react';
import { Plus, Search, Pencil, Trash2, Filter } from 'lucide-react';
import { useEmployees } from '@/hooks/useEmployees';
import { Employee, DEPARTMENTS } from '@/types';
import { EmployeeModal } from '@/components/features/EmployeeModal';
import { StatusBadge } from '@/components/features/StatusBadge';
import { getDepartmentColor, getInitials, formatDate, cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Employees() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return employees.filter(e => {
      const matchSearch = !search ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.employeeId.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === 'All' || e.department === deptFilter;
      const matchStatus = statusFilter === 'All' || e.status === statusFilter;
      return matchSearch && matchDept && matchStatus;
    });
  }, [employees, search, deptFilter, statusFilter]);

  const handleDelete = (id: string) => {
    deleteEmployee(id);
    setDeleteConfirm(null);
    toast.success('Employee deleted successfully');
  };

  const handleSave = (data: Omit<Employee, 'id'>) => {
    if (editEmployee) {
      updateEmployee(editEmployee.id, data);
      toast.success('Employee updated successfully');
    } else {
      addEmployee(data);
      toast.success('Employee added successfully');
    }
    setEditEmployee(null);
    setModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, ID, or email..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="All">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button
          onClick={() => { setEditEmployee(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span><strong className="text-foreground">{filtered.length}</strong> of {employees.length} employees</span>
        <span className="text-emerald-600 font-medium">{employees.filter(e => e.status === 'Active').length} Active</span>
        <span className="text-gray-500">{employees.filter(e => e.status === 'Inactive').length} Inactive</span>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 py-3">Employee</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 py-3 hidden sm:table-cell">Employee ID</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 py-3 hidden md:table-cell">Department</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Position</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 py-3 hidden xl:table-cell">Join Date</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground text-sm">
                    No employees found. Try adjusting your filters.
                  </td>
                </tr>
              ) : filtered.map(emp => (
                <tr key={emp.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center flex-shrink-0">
                        {getInitials(emp.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{emp.name}</p>
                        <p className="text-xs text-muted-foreground">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground hidden sm:table-cell font-mono">{emp.employeeId}</td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className={cn('text-xs font-medium px-2 py-1 rounded-full', getDepartmentColor(emp.department))}>
                      {emp.department}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground hidden lg:table-cell">{emp.position}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground hidden xl:table-cell">{formatDate(emp.joinDate)}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={emp.status} /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setEditEmployee(emp); setModalOpen(true); }}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        aria-label="Edit employee"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(emp.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                        aria-label="Delete employee"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border p-6 max-w-sm w-full shadow-2xl animate-fade-in">
            <h3 className="text-lg font-semibold text-foreground mb-2">Delete Employee</h3>
            <p className="text-muted-foreground text-sm mb-6">This action cannot be undone. Are you sure you want to delete this employee?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <EmployeeModal
          employee={editEmployee}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditEmployee(null); }}
        />
      )}
    </div>
  );
}

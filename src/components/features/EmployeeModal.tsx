import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Employee, DEPARTMENTS } from '@/types';
import { cn } from '@/lib/utils';

const schema = z.object({
  employeeId: z.string().min(1, 'Employee ID required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  department: z.string().min(1, 'Department required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(6, 'Phone required'),
  position: z.string().min(2, 'Position required'),
  status: z.enum(['Active', 'Inactive']),
  joinDate: z.string().min(1, 'Join date required'),
});

type FormData = z.infer<typeof schema>;

interface EmployeeModalProps {
  employee?: Employee | null;
  onSave: (data: Omit<Employee, 'id'>) => void;
  onClose: () => void;
}

export function EmployeeModal({ employee, onSave, onClose }: EmployeeModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: employee || {
      employeeId: `EMP${String(Date.now()).slice(-3)}`,
      name: '', department: 'IT', email: '', phone: '',
      position: '', status: 'Active', joinDate: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (employee) reset(employee);
  }, [employee, reset]);

  const onSubmit = (data: FormData) => {
    onSave(data);
    onClose();
  };

  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  const inputCls = 'w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card">
          <h2 className="text-lg font-semibold">{employee ? 'Edit Employee' : 'Add Employee'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Employee ID" error={errors.employeeId?.message}>
              <input {...register('employeeId')} className={inputCls} placeholder="EMP001" />
            </Field>
            <Field label="Join Date" error={errors.joinDate?.message}>
              <input {...register('joinDate')} type="date" className={inputCls} />
            </Field>
          </div>

          <Field label="Full Name" error={errors.name?.message}>
            <input {...register('name')} className={inputCls} placeholder="John Doe" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Department" error={errors.department?.message}>
              <select {...register('department')} className={inputCls}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Status" error={errors.status?.message}>
              <select {...register('status')} className={inputCls}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </Field>
          </div>

          <Field label="Position / Title" error={errors.position?.message}>
            <input {...register('position')} className={inputCls} placeholder="Software Engineer" />
          </Field>

          <Field label="Email Address" error={errors.email?.message}>
            <input {...register('email')} type="email" className={inputCls} placeholder="john@company.com" />
          </Field>

          <Field label="Phone" error={errors.phone?.message}>
            <input {...register('phone')} className={inputCls} placeholder="+1 555-0100" />
          </Field>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              {employee ? 'Save Changes' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

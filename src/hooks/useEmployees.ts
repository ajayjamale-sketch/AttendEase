import { useState, useCallback } from 'react';
import { Employee } from '@/types';
import { getEmployees, saveEmployees } from '@/utils/localStorage';
import { SAMPLE_EMPLOYEES } from '@/data/employees';

function initEmployees(): Employee[] {
  const stored = getEmployees();
  if (stored.length === 0) {
    saveEmployees(SAMPLE_EMPLOYEES);
    return SAMPLE_EMPLOYEES;
  }
  return stored;
}

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>(initEmployees);

  const addEmployee = useCallback((emp: Omit<Employee, 'id'>) => {
    const newEmp: Employee = { ...emp, id: Date.now().toString() };
    setEmployees(prev => {
      const next = [...prev, newEmp];
      saveEmployees(next);
      return next;
    });
  }, []);

  const updateEmployee = useCallback((id: string, updates: Partial<Employee>) => {
    setEmployees(prev => {
      const next = prev.map(e => e.id === id ? { ...e, ...updates } : e);
      saveEmployees(next);
      return next;
    });
  }, []);

  const deleteEmployee = useCallback((id: string) => {
    setEmployees(prev => {
      const next = prev.filter(e => e.id !== id);
      saveEmployees(next);
      return next;
    });
  }, []);

  return { employees, addEmployee, updateEmployee, deleteEmployee, setEmployees };
}

"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import tenantClient from '@/services/tenantClient';
import EmployeeModal from '@/components/tenant/employees/EmployeeModal';

const EmployeeStatusBadge = ({ status }) => {
  const styles = {
    'Active': 'bg-accent-success/10 text-accent-success',
    'On Leave': 'bg-accent-warning/10 text-accent-warning',
    'Inactive': 'bg-accent-danger/10 text-accent-danger',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status] || 'bg-neutral-silver/30 text-neutral-charcoal'}`}>
      {status}
    </span>
  );
};

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await tenantClient.get('/employees');
      setEmployees(response.data || []);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch staff directory.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleSaveEmployee = (employeeData) => {
    if (editingEmployee) {
      setEmployees(employees.map(emp => emp.id === editingEmployee.id ? employeeData : emp));
    } else {
      setEmployees([employeeData, ...employees]);
    }
  };

  const handleDeactivate = async (employeeId) => {
    if (!window.confirm('Are you sure you want to deactivate this staff member?')) return;
    
    try {
      await tenantClient.patch(`/employees/${employeeId}/status`, { status: 'Inactive' });
      setEmployees(employees.map(emp => emp.id === employeeId ? { ...emp, status: 'Inactive' } : emp));
      toast.info('Staff member deactivated.');
    } catch (error) {
      toast.error('Failed to update employee status.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Staff Directory</h1>
          <p className="text-neutral-charcoal opacity-70 italic">Manage your law firm's personnel and professional roles.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl shadow-lg shadow-primary/20 transition-all font-bold flex items-center gap-2"
        >
          <span className="text-xl">+</span> Add Staff Member
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-silver shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-silver bg-neutral-slate/10 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40">🔍</span>
            <input
              type="text"
              placeholder="Search by name, email, or position..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none text-sm"
            />
          </div>
          <select className="px-4 py-2 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none text-sm font-bold text-primary">
            <option>All Roles</option>
            <option>Senior Partner</option>
            <option>Junior Partner</option>
            <option>Associate</option>
            <option>Paralegal</option>
            <option>Secretary</option>
          </select>
        </div>

        <div className="overflow-x-auto min-h-[400px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
              <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-neutral-slate text-neutral-charcoal text-[10px] uppercase tracking-[0.2em] font-black">
                <tr>
                  <th className="px-6 py-5 border-b border-neutral-silver">Staff Member</th>
                  <th className="px-6 py-5 border-b border-neutral-silver">Position</th>
                  <th className="px-6 py-5 border-b border-neutral-silver">Contact Information</th>
                  <th className="px-6 py-5 border-b border-neutral-silver text-center">Status</th>
                  <th className="px-6 py-5 border-b border-neutral-silver text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-silver">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-neutral-slate/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 shadow-sm">
                          {emp.firstName?.[0]}{emp.lastName?.[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-primary group-hover:text-secondary-dark transition-colors">{emp.firstName} {emp.lastName}</span>
                          <span className="text-[10px] text-neutral-charcoal opacity-50 uppercase tracking-widest font-bold">Joined {new Date(emp.joinDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-primary bg-secondary/10 px-3 py-1 rounded-md">{emp.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-neutral-charcoal font-medium">{emp.email}</span>
                        <span className="text-xs text-neutral-charcoal opacity-60">{emp.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <EmployeeStatusBadge status={emp.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenEdit(emp)}
                          className="p-2 hover:bg-neutral-slate rounded-lg text-primary hover:text-secondary transition-all"
                          title="Edit Profile"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDeactivate(emp.id)}
                          className="p-2 hover:bg-accent-danger/10 rounded-lg text-accent-danger transition-all"
                          title="Deactivate"
                        >
                          🚫
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!isLoading && employees.length === 0 && (
            <div className="py-20 text-center bg-neutral-slate/5">
              <span className="text-4xl mb-4 block">👥</span>
              <h3 className="text-lg font-bold text-primary">No staff members registered</h3>
              <p className="text-sm text-neutral-charcoal opacity-60">Begin building your firm's professional directory.</p>
            </div>
          )}
        </div>
      </div>

      <EmployeeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingEmployee}
        onSave={handleSaveEmployee}
      />
    </div>
  );
}

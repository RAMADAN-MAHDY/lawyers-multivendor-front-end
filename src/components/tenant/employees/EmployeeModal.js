"use client";

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import tenantClient from '@/services/tenantClient';

/**
 * EmployeeModal for adding/editing law firm staff members.
 * Strictly adheres to the Tenant Domain data contract and uses tenantClient.
 */
const EmployeeModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState(
    initialData || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'Associate',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let response;
      if (initialData) {
        // Update existing employee
        response = await tenantClient.put(`/employees/${initialData.id}`, formData);
        toast.success('Employee profile updated successfully!');
      } else {
        // Create new employee
        response = await tenantClient.post('/employees', formData);
        toast.success('New staff member added successfully!');
      }
      
      onSave(response.data);
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Operation failed. Please check the staff data.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="bg-primary p-6 text-white flex justify-between items-center border-b border-secondary/30">
          <div>
            <h2 className="text-xl font-serif font-bold">
              {initialData ? 'Edit Staff Profile' : 'Register New Staff Member'}
            </h2>
            <p className="text-xs text-secondary font-bold uppercase tracking-widest mt-1">Personnel Management</p>
          </div>
          <button 
            onClick={onClose} 
            className="hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest opacity-60">First Name</label>
              <input
                type="text" required
                className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest opacity-60">Last Name</label>
              <input
                type="text" required
                className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest opacity-60">Email Address</label>
            <input
              type="email" required
              className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest opacity-60">Phone Number</label>
              <input
                type="tel" required
                className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest opacity-60">Position / Role</label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="Senior Partner">Senior Partner</option>
                <option value="Junior Partner">Junior Partner</option>
                <option value="Associate">Associate</option>
                <option value="Paralegal">Paralegal</option>
                <option value="Secretary">Secretary</option>
                <option value="Intern">Intern</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest opacity-60">Status</label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest opacity-60">Join Date</label>
              <input
                type="date" required
                className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-4 border-t border-neutral-silver mt-6">
            <button type="button" onClick={onClose} className="px-6 py-3 text-sm font-bold text-primary hover:bg-neutral-silver transition-colors rounded-lg">Cancel</button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-all shadow-lg flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (initialData ? 'Update Profile' : 'Register Staff')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;

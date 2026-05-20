"use client";

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import tenantClient from '@/services/tenantClient';

/**
 * CaseModal for registering or updating lawsuits.
 * Fully integrated with tenantClient.
 */
const CaseModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState(
    initialData || {
      caseNumber: '',
      clientName: '',
      caseType: 'Criminal',
      courtName: '',
      judgeName: '',
      nextHearingDate: '',
      description: '',
    }
  );
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData) {
        await tenantClient.put(`/cases/${initialData.id}`, formData);
        toast.success('Case information updated successfully!');
      } else {
        await tenantClient.post('/cases', formData);
        toast.success('New lawsuit registered successfully!');
      }
      onSave();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process case data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="bg-primary p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-serif font-bold">
              {initialData ? 'Update Case File' : 'New Lawsuit Entry'}
            </h2>
            <p className="text-xs text-secondary font-bold uppercase tracking-widest mt-1">Legal Document System</p>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Case Number</label>
              <input
                type="text" required
                className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none"
                value={formData.caseNumber}
                onChange={(e) => setFormData({...formData, caseNumber: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Client Name</label>
              <input
                type="text" required
                className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none"
                value={formData.clientName}
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Case Type</label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none"
                value={formData.caseType}
                onChange={(e) => setFormData({...formData, caseType: e.target.value})}
              >
                <option>Criminal</option>
                <option>Civil</option>
                <option>Corporate</option>
                <option>Family</option>
                <option>Real Estate</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Next Hearing Date</label>
              <input
                type="date" required
                className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none"
                value={formData.nextHearingDate}
                onChange={(e) => setFormData({...formData, nextHearingDate: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Court Name</label>
              <input
                type="text" required
                className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none"
                value={formData.courtName}
                onChange={(e) => setFormData({...formData, courtName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Assigned Judge</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none"
                value={formData.judgeName}
                onChange={(e) => setFormData({...formData, judgeName: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Case Description</label>
            <textarea
              rows="4"
              className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>
        </form>

        <div className="p-6 bg-neutral-slate flex justify-end gap-4 border-t border-neutral-silver">
          <button onClick={onClose} className="px-6 py-3 text-sm font-bold text-primary hover:bg-neutral-silver transition-colors rounded-lg">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-all shadow-lg flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (initialData ? 'Update Case' : 'Register Lawsuit')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseModal;

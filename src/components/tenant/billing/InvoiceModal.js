"use client";

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import tenantClient from '@/services/tenantClient';

/**
 * InvoiceModal component for generating new client invoices.
 * Fully integrated with tenantClient.
 */
const InvoiceModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    caseNumber: '',
    amount: '',
    deposit: '',
    dueDate: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await tenantClient.post('/billing/invoices', formData);
      toast.success('Invoice generated and sent successfully!');
      onSave();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate invoice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="bg-primary p-6 text-white flex justify-between items-center border-b border-secondary/30">
          <div>
            <h2 className="text-xl font-serif font-bold">Generate Legal Invoice</h2>
            <p className="text-xs text-secondary font-bold uppercase tracking-widest mt-1">Financial Ledger Entry</p>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest opacity-60">Client Name</label>
              <input
                type="text" required
                className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest opacity-60">Case Number</label>
              <input
                type="text" required
                className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
                value={formData.caseNumber}
                onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest opacity-60">Total Fee ($)</label>
              <input
                type="number" required
                className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest opacity-60">Initial Deposit ($)</label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
                value={formData.deposit}
                onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest opacity-60">Due Date</label>
              <input
                type="date" required
                className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest opacity-60">Description / Legal Fees Breakdown</label>
            <textarea
              rows="4" required
              className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>
        </form>

        <div className="p-6 bg-neutral-slate flex justify-end gap-4 border-t border-neutral-silver">
          <button type="button" onClick={onClose} className="px-6 py-3 text-sm font-bold text-primary hover:bg-neutral-silver transition-colors rounded-lg">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-all shadow-lg flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Finalize & Send Invoice'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;

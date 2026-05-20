"use client";

import React, { useState } from 'react';
import useUIStore from '@/store/useUIStore';
import { toast } from 'react-toastify';
import centralClient from '@/services/centralClient';

/**
 * PlanModal component for creating or editing subscription tiers.
 * Integrated with centralClient for live API updates.
 */
const PlanModal = ({ isOpen, onClose, initialData = null, onSave }) => {
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      price_monthly: '',
      price_yearly: '',
      trial_days: 0,
      max_users: '',
      max_clients: '',
      max_cases: '',
      max_sessions: '',
      max_tasks: '',
      has_templates: false,
      has_financial_management: false,
      has_attendance: false,
      has_lawyer_reports: false,
      has_notifications: false,
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (initialData) {
        await centralClient.put(`/subscriptions/${initialData.id}`, formData);
        toast.success('Plan configuration updated successfully!');
      } else {
        await centralClient.post('/subscriptions', formData);
        toast.success('New subscription plan created!');
      }
      onSave();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save plan configuration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="h-full w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-neutral-silver p-6 bg-primary text-white">
            <h2 className="text-xl font-serif font-bold">
              {initialData ? 'Edit Subscription Plan' : 'Create New Plan'}
            </h2>
            <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10 transition-colors">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Plan Name</label>
              <input
                type="text" required
                className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Monthly Price ($)</label>
                <input
                  type="number" required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
                  value={formData.price_monthly}
                  onChange={(e) => setFormData({ ...formData, price_monthly: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Yearly Price ($)</label>
                <input
                  type="number" required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
                  value={formData.price_yearly}
                  onChange={(e) => setFormData({ ...formData, price_yearly: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Max Users</label>
                <input
                  type="number" required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
                  value={formData.max_users}
                  onChange={(e) => setFormData({ ...formData, max_users: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Max Clients</label>
                <input
                  type="number" required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
                  value={formData.max_clients}
                  onChange={(e) => setFormData({ ...formData, max_clients: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Max Cases</label>
                <input
                  type="number" required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
                  value={formData.max_cases}
                  onChange={(e) => setFormData({ ...formData, max_cases: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Trial Days</label>
                <input
                  type="number" required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
                  value={formData.trial_days}
                  onChange={(e) => setFormData({ ...formData, trial_days: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Features</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'has_templates', label: 'Templates' },
                  { key: 'has_financial_management', label: 'Finance' },
                  { key: 'has_attendance', label: 'Attendance' },
                  { key: 'has_lawyer_reports', label: 'Reports' },
                  { key: 'has_notifications', label: 'Notifications' },
                ].map((feature) => (
                  <label key={feature.key} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-neutral-silver text-secondary focus:ring-secondary cursor-pointer"
                      checked={formData[feature.key]}
                      onChange={(e) => setFormData({ ...formData, [feature.key]: e.target.checked })}
                    />
                    <span className="text-sm text-neutral-charcoal group-hover:text-primary transition-colors">{feature.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </form>

          <div className="border-t border-neutral-silver p-6 bg-neutral-slate">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : initialData ? 'Update Plan Configuration' : 'Create Subscription Plan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanModal;

"use client";

import React, { useState, useEffect } from 'react';
import centralClient from '@/services/centralClient';
import { toast } from 'react-toastify';

import { API_CONFIG } from '@/config/constants';

export default function LawFirmManagement() {
  const [firms, setFirms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // Track specific firm action

  useEffect(() => {
    fetchFirms();
  }, []);

  const fetchFirms = async () => {
    setLoading(true);
    try {
      const response = await centralClient.get('/admin/pending-vendors');
      setFirms(response.data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch law firms.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (firmId) => {
    setActionLoading(firmId);
    try {
      await centralClient.post(`/admin/approve-vendor/${firmId}`);
      setFirms(firms.map(f => f.id === firmId ? { ...f, status: 'approved' } : f));
      toast.success('Law firm approved successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve firm.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (firmId) => {
    setActionLoading(firmId);
    try {
      await centralClient.post(`/admin/reject-vendor/${firmId}`);
      setFirms(firms.filter(f => f.id !== firmId));
      toast.info('Law firm request rejected.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject firm.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Law Firm Management</h1>
          <p className="text-neutral-charcoal opacity-70">Oversee and manage all registered legal entities.</p>
        </div>
        <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-dark transition-all">
          + Add New Firm
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-silver shadow-sm overflow-hidden min-h-[500px] relative">
        <div className="p-6 border-b border-neutral-silver flex gap-4">
          <input 
            type="text" 
            placeholder="Search firms..." 
            className="flex-1 px-4 py-2 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none text-sm"
          />
        </div>

        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-slate text-neutral-charcoal text-xs uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-4">Firm Details</th>
                  <th className="px-6 py-4">Subdomain</th>
                  <th className="px-6 py-4">Active Plan</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-silver">
                {firms.map((firm) => (
                  <tr key={firm.id} className="hover:bg-neutral-slate/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-primary">{firm.name}</span>
                        <span className="text-xs text-neutral-charcoal opacity-60">{firm.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-secondary">
                      {firm.requested_tenant_name}.{API_CONFIG.MAIN_DOMAIN}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-primary">{firm.planName || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        firm.status === 'approved' || firm.status === 'Active' ? 'bg-accent-success/10 text-accent-success' :
                        firm.status === 'pending' || firm.status === 'Pending' ? 'bg-accent-warning/10 text-accent-warning' :
                        'bg-accent-danger/10 text-accent-danger'
                      }`}>
                        {firm.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {(firm.status === 'pending' || firm.status === 'Pending') && (
                          <>
                            <button 
                              onClick={() => handleApprove(firm.id)}
                              disabled={!!actionLoading}
                              className="px-3 py-1 bg-accent-success text-white text-xs font-bold rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === firm.id ? '...' : 'Approve'}
                            </button>
                            <button 
                              onClick={() => handleReject(firm.id)}
                              disabled={!!actionLoading}
                              className="px-3 py-1 bg-accent-danger text-white text-xs font-bold rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === firm.id ? '...' : 'Reject'}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {firms.length === 0 && (
              <div className="p-12 text-center text-neutral-charcoal opacity-50">No law firms registered yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

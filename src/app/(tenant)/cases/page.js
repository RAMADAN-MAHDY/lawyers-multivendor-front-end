"use client";

import React, { useState, useEffect } from 'react';
import CaseModal from '@/components/tenant/cases/CaseModal';
import tenantClient from '@/services/tenantClient';
import { toast } from 'react-toastify';

export default function CaseManagement() {
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    setIsLoading(true);
    try {
      const response = await tenantClient.get('/cases');
      setCases(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch cases.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCases = cases.filter(c => {
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    const matchesSearch = c.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.caseNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSaveCase = () => {
    fetchCases(); // Refresh list after saving new case
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Case Management</h1>
          <p className="text-neutral-charcoal opacity-70 italic">Manage your firm's legal portfolio and proceedings.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl shadow-lg shadow-primary/20 transition-all font-bold flex items-center gap-2"
        >
          <span className="text-xl">+</span> Log New Case
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-silver shadow-sm overflow-hidden min-h-[500px] relative">
        <div className="p-6 border-b border-neutral-silver flex flex-col md:flex-row gap-4 bg-neutral-slate/10">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40">🔍</span>
            <input
              type="text"
              placeholder="Search by case # or client name..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none text-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none text-sm font-bold text-primary"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
            <option value="Appealed">Appealed</option>
          </select>
        </div>

        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-neutral-slate text-neutral-charcoal text-[10px] uppercase tracking-[0.2em] font-black">
                <tr>
                  <th className="px-6 py-5 border-b border-neutral-silver">Case Reference</th>
                  <th className="px-6 py-5 border-b border-neutral-silver">Client / Entity</th>
                  <th className="px-6 py-5 border-b border-neutral-silver">Type</th>
                  <th className="px-6 py-5 border-b border-neutral-silver">Courtroom</th>
                  <th className="px-6 py-5 border-b border-neutral-silver text-center">Next Hearing</th>
                  <th className="px-6 py-5 border-b border-neutral-silver text-center">Status</th>
                  <th className="px-6 py-5 border-b border-neutral-silver text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-silver">
                {filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-slate/20 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-secondary bg-secondary/5 px-2 py-1 rounded">
                        {c.caseNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-primary group-hover:text-secondary-dark transition-colors">{c.clientName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-neutral-charcoal font-medium">{c.caseType}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-neutral-charcoal opacity-70">{c.courtName}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-bold ${!c.nextHearingDate ? 'text-neutral-silver' : 'text-primary'}`}>
                        {c.nextHearingDate ? new Date(c.nextHearingDate).toLocaleDateString() : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        c.status === 'Active' ? 'bg-accent-success/10 text-accent-success' :
                        c.status === 'Won' ? 'bg-primary text-white shadow-sm' :
                        c.status === 'Appealed' ? 'bg-accent-warning/10 text-accent-warning' :
                        'bg-accent-danger/10 text-accent-danger'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-primary hover:text-secondary transition-colors">👁️</button>
                        <button className="text-primary hover:text-secondary transition-colors">✏️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCases.length === 0 && (
              <div className="py-20 text-center bg-neutral-slate/5">
                <span className="text-4xl mb-4 block">📂</span>
                <h3 className="text-lg font-bold text-primary">No matching cases found</h3>
                <p className="text-sm text-neutral-charcoal opacity-60">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <CaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCase}
      />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import InvoiceModal from '@/components/tenant/billing/InvoiceModal';
import tenantClient from '@/services/tenantClient';
import { toast } from 'react-toastify';

const FinanceStatCard = ({ title, value, icon, color, isLoading }) => (
  <div className="bg-white p-6 rounded-xl border border-neutral-silver shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
    </div>
    <h3 className="text-neutral-charcoal opacity-60 text-xs font-bold uppercase tracking-widest">{title}</h3>
    {isLoading ? (
      <div className="h-8 w-24 bg-neutral-slate animate-pulse rounded mt-1"></div>
    ) : (
      <p className="text-3xl font-serif font-bold text-primary mt-1">{value}</p>
    )}
  </div>
);

export default function BillingManagement() {
  const [data, setData] = useState({
    stats: [],
    invoices: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    setIsLoading(true);
    try {
      const response = await tenantClient.get('/billing/summary');
      setData(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch billing records.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveInvoice = () => {
    fetchBillingData(); // Refresh after creating a new invoice
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Financial Ledger</h1>
          <p className="text-neutral-charcoal opacity-70 italic">Oversee billing, revenue, and client outstanding balances.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl shadow-lg shadow-primary/20 transition-all font-bold flex items-center gap-2"
        >
          <span className="text-xl">+</span> Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <FinanceStatCard 
              key={i} 
              isLoading={true} 
              title="" 
              value="" 
              icon="" 
              color="" 
            />
          ))
        ) : (
          data.stats.map((stat, index) => (
            <FinanceStatCard key={index} {...stat} isLoading={false} />
          ))
        )}
      </div>

      <div className="bg-white rounded-xl border border-neutral-silver shadow-sm overflow-hidden min-h-[500px] relative">
        <div className="p-6 border-b border-neutral-silver bg-neutral-slate/10 flex justify-between items-center">
          <h2 className="text-lg font-serif font-bold text-primary">Billing History</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-xs font-bold border border-neutral-silver rounded-lg hover:bg-neutral-slate transition-colors">
              Export PDF
            </button>
          </div>
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
                  <th className="px-6 py-5 border-b border-neutral-silver">Invoice ID</th>
                  <th className="px-6 py-5 border-b border-neutral-silver">Client / Case</th>
                  <th className="px-6 py-5 border-b border-neutral-silver">Amount</th>
                  <th className="px-6 py-5 border-b border-neutral-silver">Due Date</th>
                  <th className="px-6 py-5 border-b border-neutral-silver text-center">Status</th>
                  <th className="px-6 py-5 border-b border-neutral-silver text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-silver">
                {data.invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-neutral-slate/20 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-secondary">#{inv.invoiceNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-primary">{inv.clientName}</span>
                        <span className="text-[10px] text-neutral-charcoal opacity-60 uppercase tracking-widest">{inv.caseNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-primary">${Number(inv.amount).toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-neutral-charcoal font-medium">{new Date(inv.dueDate).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        inv.status === 'Paid' ? 'bg-accent-success/10 text-accent-success' :
                        inv.status === 'Partial' ? 'bg-primary/10 text-primary' :
                        inv.status === 'Overdue' ? 'bg-accent-danger/10 text-accent-danger animate-pulse' :
                        'bg-accent-warning/10 text-accent-warning'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button title="Download" className="text-primary hover:text-secondary transition-colors">📥</button>
                        <button title="Edit" className="text-primary hover:text-secondary transition-colors">✏️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.invoices.length === 0 && (
              <div className="py-20 text-center bg-neutral-slate/5">
                <span className="text-4xl mb-4 block">🧾</span>
                <h3 className="text-lg font-bold text-primary">No invoices found</h3>
                <p className="text-sm text-neutral-charcoal opacity-60">Start by creating your first legal invoice.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <InvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveInvoice}
      />
    </div>
  );
}

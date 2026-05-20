"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';
import { toast } from 'react-toastify';
import centralClient from '@/services/centralClient';

export default function CentralLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Actual API call to central domain login
      const response = await centralClient.post('/login', formData);
      
      const { user, access_token, role } = response.data;
      
      login(user, access_token, role || 'super-admin');
      toast.success('System Authenticated. Welcome, Administrator.');
      router.push('/admin/dashboard');
    } catch (error) {
      const msg = error.response?.data?.message || 'Authentication Failed. Access Denied.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="h-20 w-20 bg-secondary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-secondary/20">
            <span className="text-primary text-4xl font-serif font-bold italic">L</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2 tracking-tight">
            Central Management
          </h1>
          <p className="text-secondary/70 font-medium">Super Admin Secure Gateway</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10 border border-white/10 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest opacity-60">
                Admin ID / Email
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-silver focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none text-primary font-medium"
                placeholder="admin@system.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest opacity-60">
                Security Key
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-silver focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none text-primary font-medium"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 group"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Initialize Authentication</span>
                  <span className="group-hover:translate-x-1 transition-transform">➡️</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-neutral-charcoal opacity-50 italic">
              Authorized personnel only. All access attempts are logged.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center text-white/40 text-sm">
          &copy; 2026 Lawyers Multivendor SaaS. System v1.0.4
        </div>
      </div>
    </div>
  );
}

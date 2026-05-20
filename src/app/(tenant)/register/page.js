"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import centralClient from '@/services/centralClient';

import { API_CONFIG } from '@/config/constants';

export default function FirmRegistration() {
  const [formData, setFormData] = useState({
    firmName: '',
    subdomain: '',
    ownerName: '',
    ownerEmail: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error('كلمات المرور غير متطابقة');
    }

    setLoading(true);

    try {
      // Register firm hits the central API
      await centralClient.post('/register', {
        name: formData.ownerName,
        email: formData.ownerEmail,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        tenant_name: formData.subdomain
      });
      
      toast.success('تم تسجيل طلبك بنجاح! سيتم التواصل معك بعد مراجعة البيانات.');
      router.push('/login');
    } catch (error) {
      const msg = error.response?.data?.message || 'فشل التسجيل. يرجى المحاولة مرة أخرى.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-slate font-sans">
      {/* Left Side: Professional Info */}
      <div className="hidden lg:flex lg:w-1/3 bg-primary p-12 flex-col justify-between relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="relative z-10">
          <div className="h-12 w-12 bg-secondary rounded-xl flex items-center justify-center text-primary font-serif font-bold text-2xl mb-8">L</div>
          <h2 className="text-3xl font-serif font-bold text-secondary mb-6">انضم لنخبة مكاتب المحاماة</h2>
          <p className="text-gray-300 leading-relaxed italic">
            "العدالة هي الغاية، والتقنية هي الوسيلة. ابدأ رحلة التحول الرقمي لمكتبك اليوم."
          </p>
        </div>

        <div className="relative z-10 space-y-8">
           <div className="flex items-center gap-4">
              <span className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">✓</span>
              <p className="text-sm font-bold">إدارة كاملة للقضايا والجلسات</p>
           </div>
           <div className="flex items-center gap-4">
              <span className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">✓</span>
              <p className="text-sm font-bold">نظام مالي ومحاسبي متطور</p>
           </div>
           <div className="flex items-center gap-4">
              <span className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">✓</span>
              <p className="text-sm font-bold">أمان وتشفير عالي للبيانات</p>
           </div>
        </div>

        <div className="relative z-10 pt-8 border-t border-white/10 text-xs text-gray-400">
           © 2026 Lawyers Multivendor SaaS. All rights reserved.
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-8 sm:p-12 lg:p-20">
        <div className="w-full max-w-2xl">
          <div className="mb-12">
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">تسجيل مكتب جديد</h1>
            <p className="text-neutral-charcoal opacity-60">أدخل بيانات المكتب والمالك لإنشاء مساحة العمل الخاصة بك.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Firm Details */}
            <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-secondary border-b border-neutral-silver pb-2">بيانات المكتب</h3>
              
              <div>
                <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-wide">اسم مكتب المحاماة</label>
                <input
                  type="text" required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
                  placeholder="مثلاً: شركة العدالة للمحاماة"
                  value={formData.firmName}
                  onChange={(e) => setFormData({...formData, firmName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-wide">النطاق الفرعي (Subdomain)</label>
                <div className="flex items-center group">
                  <input
                    type="text" required
                    className="flex-1 px-4 py-3 rounded-l-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
                    placeholder="justice-firm"
                    value={formData.subdomain}
                    onChange={(e) => setFormData({...formData, subdomain: e.target.value})}
                  />
                  <span className="px-4 py-3 bg-neutral-slate border border-l-0 border-neutral-silver rounded-r-lg text-sm font-bold text-neutral-charcoal">.{API_CONFIG.MAIN_DOMAIN}</span>
                </div>
                <p className="mt-2 text-[10px] text-neutral-charcoal opacity-50 italic">سيكون هذا هو الرابط الخاص بمكتبك.</p>
              </div>
            </div>

            {/* Owner Details */}
            <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-secondary border-b border-neutral-silver pb-2">بيانات المدير</h3>

              <div>
                <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-wide">اسم المدير بالكامل</label>
                <input
                  type="text" required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
                  placeholder="أحمد محمد"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-wide">البريد الإلكتروني</label>
                <input
                  type="email" required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
                  placeholder="admin@firm.com"
                  value={formData.ownerEmail}
                  onChange={(e) => setFormData({...formData, ownerEmail: e.target.value})}
                />
              </div>
            </div>

            {/* Security */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-neutral-silver">
              <div>
                <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-wide">كلمة المرور</label>
                <input
                  type="password" required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-wide">تأكيد كلمة المرور</label>
                <input
                  type="password" required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="flex items-start gap-3">
                <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-neutral-silver text-secondary focus:ring-secondary cursor-pointer" />
                <label className="text-sm text-neutral-charcoal leading-relaxed">
                  أوافق على <a href="#" className="text-primary font-bold underline">شروط الخدمة</a> و <a href="#" className="text-primary font-bold underline">سياسة الخصوصية</a>.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-5 rounded-xl transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {loading ? (
                  <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>إنشاء حساب المكتب</span>
                    <span className="text-xl">🏛️</span>
                  </>
                )}
              </button>

              <p className="text-center text-sm text-neutral-charcoal">
                لديك حساب بالفعل؟ <Link href="/login" className="text-secondary font-bold hover:underline">تسجيل الدخول</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

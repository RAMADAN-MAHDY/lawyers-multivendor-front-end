"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-2xl border border-neutral-silver shadow-sm hover:shadow-xl transition-all duration-300 group">
    <div className="h-14 w-14 bg-neutral-slate rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-right">
      {icon}
    </div>
    <h3 className="text-xl font-serif font-bold text-primary mb-4 text-right">{title}</h3>
    <p className="text-neutral-charcoal opacity-70 leading-relaxed text-right">{description}</p>
  </div>
);

const PricingCard = ({ plan, price, features, isPopular = false }) => (
  <div className={`bg-white p-8 rounded-3xl border ${isPopular ? 'border-secondary shadow-2xl scale-105' : 'border-neutral-silver shadow-sm'} flex flex-col relative`}>
    {isPopular && (
      <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-primary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
        الأكثر شيوعاً
      </span>
    )}
    <h3 className="text-2xl font-serif font-bold text-primary text-center mb-2">{plan}</h3>
    <div className="text-center mb-8">
      <span className="text-4xl font-serif font-bold text-primary">${price}</span>
      <span className="text-neutral-charcoal opacity-60 text-sm">/شهرياً</span>
    </div>
    <ul className="space-y-4 mb-10 flex-1">
      {features.map((f, i) => (
        <li key={i} className="flex items-center justify-end gap-3 text-sm text-neutral-charcoal">
          <span>{f}</span>
          <span className="text-secondary font-bold">✓</span>
        </li>
      ))}
    </ul>
    <Link 
      href="/register" 
      className={`w-full py-4 rounded-xl font-bold text-center transition-all ${isPopular ? 'bg-primary text-white hover:bg-primary-dark shadow-lg' : 'border-2 border-primary text-primary hover:bg-neutral-slate'}`}
    >
      اشترك الآن
    </Link>
  </div>
);

export default function PlatformHomepage() {
  const [showDemo, setShowDemo] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-neutral-slate font-sans selection:bg-secondary/30" dir="rtl">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-neutral-silver shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 bg-primary rounded-xl flex items-center justify-center text-secondary font-serif font-bold text-2xl italic shadow-lg transform -rotate-3">L</div>
            <div className="flex flex-col">
              <span className="text-xl font-serif font-bold text-primary leading-none tracking-tight">
                Lawyers <span className="text-secondary">Multivendor</span>
              </span>
              <span className="text-[10px] text-primary/50 font-bold uppercase tracking-widest mt-1">SaaS Platform</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10 text-[13px] font-black text-primary/70 uppercase tracking-widest">
            <a href="#features-section" className="hover:text-secondary transition-all relative group">
              المميزات
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full"></span>
            </a>
            <a href="#solutions-section" className="hover:text-secondary transition-all relative group">
              الحلول
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full"></span>
            </a>
            <a href="#pricing-section" className="hover:text-secondary transition-all relative group">
              الأسعار
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full"></span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-6 py-2.5 rounded-xl border-2 border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all duration-300"
            >
              تسجيل الدخول
            </Link>
            <Link 
              href="/register" 
              className="px-6 py-2.5 rounded-xl bg-secondary text-primary font-bold text-sm hover:bg-secondary-dark shadow-lg shadow-secondary/20 transition-all duration-300"
            >
              إنشاء حساب جديد
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold mb-8">
              <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
              نظام إدارة المحاماة المتطور
            </div>
            <h1 className="text-6xl lg:text-8xl font-serif font-bold text-primary leading-[1.1] mb-8">
              أدر مكتبك <br />
              <span className="text-secondary italic">برؤية عصرية</span>
            </h1>
            <p className="text-xl text-neutral-charcoal/70 mb-12 max-w-xl leading-relaxed font-medium">
              المنصة رقم #1 في الشرق الأوسط لإدارة مكاتب المحاماة. تتبع القضايا، الجلسات، الشؤون المالية، والموظفين في نظام واحد سحابي آمن وسهل الاستخدام.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link href="/register" className="px-10 py-5 bg-primary text-white font-bold rounded-2xl shadow-2xl shadow-primary/40 hover:bg-primary-dark transition-all transform hover:-translate-y-1 text-lg">
                ابدأ تجربتك المجانية
              </Link>
              <button 
                onClick={() => setShowDemo(true)}
                className="px-10 py-5 bg-white text-primary border-2 border-neutral-silver font-bold rounded-2xl hover:border-primary transition-all flex items-center gap-3 text-lg"
              >
                <span>مشاهدة عرض توضيحي</span>
                <span className="text-2xl">▶</span>
              </button>
            </div>
          </div>
          <div className="relative group">
             <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
             <div className="relative bg-white p-3 rounded-[2.5rem] shadow-2xl border border-white/50 transform rotate-2 group-hover:rotate-0 transition-all duration-700 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=2070" 
                  alt="Legal Management Dashboard" 
                  className="rounded-[2rem] shadow-inner object-cover h-[500px] w-full transform scale-105 group-hover:scale-100 transition-transform duration-700"
                />
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features-section" className="py-32 bg-white px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] block mb-4">قوة النظام</span>
            <h2 className="text-5xl font-serif font-bold text-primary mb-6">المميزات الأساسية</h2>
            <div className="h-1.5 w-24 bg-secondary mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <FeatureCard 
              icon="⚖️"
              title="إدارة القضايا"
              description="أرشفة ذكية لملفات القضايا، المذكرات، والوثائق القانونية مع بحث سريع ومتقدم."
            />
            <FeatureCard 
              icon="🏛️"
              title="متابعة الجلسات"
              description="جدولة آلية للجلسات مع تنبيهات ذكية للمواعيد والمهام المرتبطة بها."
            />
            <FeatureCard 
              icon="💰"
              title="الإدارة المالية"
              description="إصدار فواتير ضريبية، تتبع المصروفات والأتعاب، وتقارير الربحية الدقيقة."
            />
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions-section" className="py-32 bg-neutral-slate px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-primary/40 font-black uppercase tracking-[0.4em] text-[10px] block mb-4">لماذا نحن؟</span>
            <h2 className="text-5xl font-serif font-bold text-primary mb-6">حلول ذكية متكاملة</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <FeatureCard 
              icon="👥"
              title="إدارة الفريق"
              description="توزيع المهام بين المحامين، تتبع ساعات العمل، ونظام حضور وانصراف متطور."
            />
            <FeatureCard 
              icon="📈"
              title="تحليلات الأداء"
              description="تقارير دورية عن أداء المكتب، نسب الإنجاز، ونمو قاعدة العملاء."
            />
            <FeatureCard 
              icon="🔒"
              title="أعلى معايير الأمان"
              description="تشفير بيانات من طرف إلى طرف مع نسخ احتياطي سحابي لضمان عدم الضياع."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-section" className="py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] block mb-4">الاشتراكات</span>
            <h2 className="text-5xl font-serif font-bold text-primary mb-6">خطط الأسعار</h2>
            <div className="h-1.5 w-24 bg-secondary mx-auto rounded-full"></div>
            <p className="mt-8 text-neutral-charcoal/60 font-medium">أسعار شفافة تناسب جميع أحجام مكاتب المحاماة</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
            <PricingCard 
              plan="الخطة الأساسية"
              price="49"
              features={['إدارة حتى 50 قضية', '3 مستخدمين للنظام', 'دعم فني عبر البريد', 'تقارير شهرية']}
            />
            <PricingCard 
              plan="الخطة الاحترافية"
              price="129"
              isPopular={true}
              features={['قضايا غير محدودة', '10 مستخدمين', 'دعم فني 24/7', 'تطبيق موبايل مخصص', 'تقارير مالية متقدمة']}
            />
            <PricingCard 
              plan="خطة المؤسسات"
              price="399"
              features={['مستخدمين غير محدودين', 'مدير حساب مخصص', 'تخصيص كامل للنظام', 'ربط API متقدم', 'تدريب ميداني']}
            />
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/95 backdrop-blur-xl p-6 overflow-y-auto">
           <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-white/20 animate-in fade-in zoom-in duration-300">
              <button 
                onClick={() => setShowDemo(false)}
                className="absolute top-8 left-8 h-14 w-14 bg-neutral-slate hover:bg-neutral-silver rounded-full text-primary transition-all z-10 flex items-center justify-center text-2xl shadow-lg"
              >✕</button>
              
              <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[500px]">
                 <div className="lg:col-span-3 bg-neutral-slate flex items-center justify-center relative group cursor-pointer">
                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/5 transition-colors"></div>
                    <div className="h-24 w-24 bg-secondary rounded-full flex items-center justify-center text-primary text-4xl shadow-2xl transform group-hover:scale-110 transition-transform">▶</div>
                    <span className="absolute bottom-10 text-primary/40 font-bold uppercase tracking-widest text-xs">اضغط لتشغيل الفيديو</span>
                 </div>
                 <div className="lg:col-span-2 p-12 flex flex-col justify-center text-right">
                    <h2 className="text-3xl font-serif font-bold mb-6 text-primary">جولة سريعة في المنصة</h2>
                    <p className="text-neutral-charcoal/70 leading-relaxed mb-8">
                      شاهد كيف يقوم نظامنا بتبسيط العمليات المعقدة في مكتبك، من لحظة استقبال الموكل حتى إغلاق القضية بنجاح.
                    </p>
                    <ul className="space-y-4 mb-10">
                       <li className="flex items-center justify-end gap-3 text-sm font-bold text-primary">
                          <span>واجهة مستخدم بديهية</span>
                          <span className="h-2 w-2 bg-secondary rounded-full"></span>
                       </li>
                       <li className="flex items-center justify-end gap-3 text-sm font-bold text-primary">
                          <span>تكامل تام مع الهاتف</span>
                          <span className="h-2 w-2 bg-secondary rounded-full"></span>
                       </li>
                       <li className="flex items-center justify-end gap-3 text-sm font-bold text-primary">
                          <span>أمان بيانات بنكي</span>
                          <span className="h-2 w-2 bg-secondary rounded-full"></span>
                       </li>
                    </ul>
                    <Link href="/register" className="w-full py-4 bg-secondary text-primary font-black rounded-xl text-center hover:bg-secondary-dark transition-all">
                       سجل الآن مجاناً
                    </Link>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-20 bg-primary text-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-center mb-16 border-b border-white/10 pb-16">
            <div className="flex flex-col gap-6 text-right">
              <div className="flex items-center justify-end gap-3">
                <span className="font-serif font-bold text-2xl">Lawyers Multivendor SaaS</span>
                <div className="h-10 w-10 bg-secondary rounded-lg flex items-center justify-center text-primary font-serif font-bold italic">L</div>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                المنصة الأولى المتخصصة في إدارة مكاتب المحاماة في الوطن العربي، تم تطويرها لتلبي احتياجات المحامي العصري.
              </p>
            </div>
            
            <div className="flex justify-center gap-12">
               <div className="flex flex-col gap-4 items-center">
                  <span className="text-secondary font-bold text-xs uppercase tracking-widest">روابط سريعة</span>
                  <a href="#features-section" className="text-sm hover:text-secondary transition-colors">المميزات</a>
                  <a href="#pricing-section" className="text-sm hover:text-secondary transition-colors">الأسعار</a>
               </div>
               <div className="flex flex-col gap-4 items-center">
                  <span className="text-secondary font-bold text-xs uppercase tracking-widest">الدعم</span>
                  <Link href="/login" className="text-sm hover:text-secondary transition-colors">تسجيل الدخول</Link>
                  <Link href="/register" className="text-sm hover:text-secondary transition-colors">إنشاء حساب</Link>
               </div>
            </div>

            <div className="flex flex-col items-end gap-6">
               <Link href="/admin/login" className="px-6 py-2 border border-white/20 rounded-lg text-xs font-bold hover:bg-white/10 transition-all uppercase tracking-widest">
                 بوابة المشرفين (Super Admin)
               </Link>
               <div className="flex gap-4">
                  <span className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-all cursor-pointer">𝕏</span>
                  <span className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-all cursor-pointer">in</span>
               </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-white/30 text-xs font-bold uppercase tracking-[0.2em]">
            <p>© 2026 جميع الحقوق محفوظة لشركة Lawyers Multivendor</p>
            <div className="flex gap-8">
               <span className="hover:text-white cursor-pointer transition-colors">سياسة الخصوصية</span>
               <span className="hover:text-white cursor-pointer transition-colors">شروط الاستخدام</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

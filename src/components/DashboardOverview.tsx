import React from 'react';
import { RegistrationStats, Athlete, SportsUnit, Association, UserRole } from '../types';
import { 
  Users, 
  Award, 
  Clock, 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  UserPlus, 
  QrCode, 
  Printer, 
  FileCheck, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';

interface DashboardOverviewProps {
  stats: RegistrationStats;
  athletes: Athlete[];
  units: SportsUnit[];
  associations: Association[];
  currentRole: UserRole;
  selectedUnitId: string;
  onNavigateTab: (tab: string) => void;
  onOpenCard: (athlete: Athlete) => void;
  onOpenScanner: () => void;
  onApproveAthlete: (id: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  athletes,
  units,
  associations,
  currentRole,
  selectedUnitId,
  onNavigateTab,
  onOpenCard,
  onOpenScanner,
  onApproveAthlete
}) => {
  const currentUnit = units.find(u => u.id === selectedUnitId) || units[0];
  const pendingAthletes = athletes.filter(a => a.status === 'PRE_REGISTERED' || a.status === 'UNDER_REVIEW');
  const recentApproved = athletes.filter(a => a.status === 'APPROVED').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Welcome & KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Total Athletes */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">إجمالي الرياضيين</span>
            <div className="p-2 bg-emerald-950 rounded-xl text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">{stats.totalAthletes}</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">مسجلون بالولاية</span>
          </div>
        </div>

        {/* Card 2: Approved / Cards Issued */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">بطاقات مصادق عليها</span>
            <div className="p-2 bg-emerald-950 rounded-xl text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{stats.approvedCount}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">جاهزة للطباعة</span>
          </div>
        </div>

        {/* Card 3: Pending review */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">ملفات قيد الدراسة</span>
            <div className="p-2 bg-amber-950 rounded-xl text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{stats.pendingCount}</span>
            <span className="text-[10px] text-amber-300 block mt-0.5">تتطلب التأشيرة</span>
          </div>
        </div>

        {/* Card 4: Associations */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">الجمعيات المعتمدة</span>
            <div className="p-2 bg-sky-950 rounded-xl text-sky-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-sky-400 font-mono">{stats.totalAssociations}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">نوادٍ رياضية هاوية</span>
          </div>
        </div>

        {/* Card 5: Sports Units */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">الوحدات والمركبات</span>
            <div className="p-2 bg-purple-950 rounded-xl text-purple-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-purple-300 font-mono">{stats.totalUnits}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">عبر دوائر ميلة</span>
          </div>
        </div>

        {/* Card 6: Disciplines Count */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">التخصصات النشطة</span>
            <div className="p-2 bg-rose-950 rounded-xl text-rose-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-rose-300 font-mono">14</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">رياضة جماعية وفردية</span>
          </div>
        </div>
      </div>

      {/* Quick Action Triggers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigateTab('register')}
          className="bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/40 hover:border-emerald-400 p-5 rounded-3xl shadow-xl transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition">
            <UserPlus className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
            التسجيل الأولي عن بُعد
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            تسجيل فوري للرياضيين مع توليد وصل إيداع الملف واستمارة الفحص الطبي A4.
          </p>
        </div>

        <div
          onClick={onOpenScanner}
          className="bg-gradient-to-br from-teal-950/80 to-slate-900 border border-teal-500/40 hover:border-teal-400 p-5 rounded-3xl shadow-xl transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-teal-600/30 border border-teal-400/40 flex items-center justify-center text-teal-400 mb-3 group-hover:scale-110 transition">
            <QrCode className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition">
            التحقق من رمز QR وبطاقات الرياضيين
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            فحص صلاحية الرخص عند مداخل الملاعب والمسابح بالباركود والـ QR.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('athletes')}
          className="bg-gradient-to-br from-amber-950/80 to-slate-900 border border-amber-500/40 hover:border-amber-400 p-5 rounded-3xl shadow-xl transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-600/30 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition">
            <Printer className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
            إصدار وطباعة البطاقات والرخص
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            طباعة بطاقات التعريف الرياضية بصور الرياضيين أو استمارات التسجيل.
          </p>
        </div>
      </div>

      {/* Main Grid: Pending Action Feed & Units Capacity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (8 Cols): Urgent Files requiring validation */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>ملفات التسجيل الواردة حديثاً بانتظار التأشيرة</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                مراجعة الملف الطبي وإصدار الرقم الفريد OPOW-43 ورخصة الدخول
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('athletes')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
            >
              عرض كافة السجلات ←
            </button>
          </div>

          <div className="space-y-3">
            {pendingAthletes.length > 0 ? (
              pendingAthletes.map((athlete) => {
                const unit = units.find(u => u.id === athlete.unitId);
                const assoc = associations.find(a => a.id === athlete.associationId);

                return (
                  <div
                    key={athlete.id}
                    className="p-3.5 bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={athlete.photoUrl}
                        alt={athlete.firstNameAr}
                        className="w-11 h-13 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">
                            {athlete.firstNameAr} {athlete.lastNameAr}
                          </h4>
                          <span className="font-mono text-[10px] bg-slate-900 text-amber-400 px-2 py-0.5 rounded border border-slate-700">
                            {athlete.preRegCode}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          {athlete.discipline} • {athlete.category} • {unit?.name || 'ميلة'}
                        </p>
                        <p className="text-[10px] text-emerald-400/80">
                          النادي: {assoc?.shortName || 'مدرسة ديوان ميلة'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => onApproveAthlete(athlete.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow cursor-pointer text-xs"
                      >
                        مصادقة وإصدار البطاقة
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-slate-500 text-xs">
                تمت معالجة كافة ملفات التسجيل الواردة بنجاح!
              </div>
            )}
          </div>
        </div>

        {/* Right (4 Cols): Recently Approved Athlete Cards & Disciplines */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card Samples ready to print */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>بطاقات صادرة حديثاً معتمدة</span>
            </h3>

            <div className="space-y-2">
              {recentApproved.map((ath) => (
                <div
                  key={ath.id}
                  onClick={() => onOpenCard(ath)}
                  className="p-2.5 bg-slate-950/60 border border-slate-800 hover:border-emerald-500/50 rounded-xl flex items-center justify-between text-xs transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={ath.photoUrl}
                      alt={ath.firstNameAr}
                      className="w-8 h-10 rounded-lg object-cover border border-emerald-500/50"
                    />
                    <div>
                      <p className="font-bold text-white text-xs leading-tight">
                        {ath.firstNameAr} {ath.lastNameAr}
                      </p>
                      <span className="font-mono text-[10px] text-amber-300">
                        {ath.registrationNumber}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    طباعة
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Wilaya Contact Banner */}
          <div className="bg-gradient-to-br from-emerald-900/60 to-slate-900 border border-emerald-500/30 rounded-3xl p-5 text-xs text-slate-300 space-y-2">
            <p className="font-bold text-white text-sm">ديوان المركب المتعدد الرياضات لولاية ميلة</p>
            <p className="text-[11px] text-emerald-300">
              تسيير ومتابعة كافة المنشآت الرياضية، الملاعب البلدية، المسابح النصف أولمبية، والقاعات المتعددة الرياضات ببلديات ولاية ميلة.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span>الهاتف: 031 56 12 40</span>
              <span>الفاكس: 031 56 12 41</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

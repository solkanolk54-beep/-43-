import React from 'react';
import { UserRole, SportsUnit } from '../types';
import { 
  ShieldCheck, 
  Building2, 
  Users, 
  QrCode, 
  UserPlus, 
  FileText, 
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  selectedUnitId: string;
  onUnitChange: (unitId: string) => void;
  units: SportsUnit[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onResetData: () => void;
  onOpenScanner: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  selectedUnitId,
  onUnitChange,
  units,
  activeTab,
  onTabChange,
  onResetData,
  onOpenScanner
}) => {
  const selectedUnit = units.find(u => u.id === selectedUnitId) || units[0];

  return (
    <header className="bg-slate-900 text-white border-b border-emerald-500/30 sticky top-0 z-40 shadow-xl no-print">
      {/* Top Ministerial Ribbon */}
      <div className="bg-emerald-800 text-emerald-100 text-xs py-1.5 px-4 font-medium border-b border-emerald-700/60">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>الجمهورية الجزائرية الديمقراطية الشعبية • وزارة الشباب والرياضة • مديرية الشباب والرياضة لولاية ميلة (43)</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-200">
            <span>الموسم الرياضي: 2025 / 2026</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">بوابة الرقمنة الإدارية الموحدة</span>
            <button 
              onClick={onResetData}
              title="إعادة تعيين البيانات التجريبية"
              className="text-emerald-300 hover:text-white transition flex items-center gap-1 cursor-pointer bg-emerald-900/60 px-2 py-0.5 rounded text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>استعادة العينة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative group cursor-pointer" onClick={() => onTabChange('overview')}>
              <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-800 p-0.5 shadow-lg shadow-emerald-900/40 flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex flex-col items-center justify-center p-1 border border-emerald-400/30">
                  <span className="text-emerald-400 font-extrabold text-xs tracking-wider">OPOW</span>
                  <span className="text-[10px] text-slate-300 font-bold -mt-0.5">MILA</span>
                  <div className="w-5 h-0.5 bg-emerald-500 rounded-full mt-0.5"></div>
                </div>
              </div>
              <span className="absolute -bottom-1 -left-1 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full border border-slate-900 shadow">
                43
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>منصة ديوان المركب المتعدد الرياضات</span>
                  <span className="text-emerald-400 text-base sm:text-lg font-bold">لولاية ميلة</span>
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
                تسيير الوحدات الرياضية، ملفات الرياضيين والجمعيات، وإصدار البطاقات الرقمية بالباركود
              </p>
            </div>
          </div>

          {/* Quick Scanner & Role Persona Switcher */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-end lg:self-auto">
            {/* Quick QR Scanner Button */}
            <button
              onClick={onOpenScanner}
              className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-950/30 border border-emerald-400/40 flex items-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-emerald-200" />
              <span>ماسح الـ QR والتحقق</span>
            </button>

            {/* Role Switcher Box */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-1.5 flex items-center gap-2 text-xs">
              <span className="text-slate-400 px-1 font-medium hidden sm:inline">الفضاء الحالي:</span>
              <div className="relative inline-block">
                <select
                  value={currentRole}
                  onChange={(e) => onRoleChange(e.target.value as UserRole)}
                  className="bg-slate-900 text-emerald-400 font-bold py-1.5 pr-2.5 pl-7 rounded-lg border border-slate-700 focus:outline-hidden focus:border-emerald-500 appearance-none cursor-pointer"
                >
                  <option value="SUPER_ADMIN">👑 المدير العام للديوان (إشراف ولائي شامل)</option>
                  <option value="UNIT_MANAGER">🏢 مسؤول وحدة رياضية</option>
                  <option value="CLUB_MANAGER">⚽ رئيس جمعية / نادٍ رياضي</option>
                  <option value="ATHLETE_PORTAL">🏃 بوابة الرياضي / ولي الأمر</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5 pointer-events-none" />
              </div>

              {/* If UNIT_MANAGER, allow choosing which unit */}
              {currentRole === 'UNIT_MANAGER' && (
                <div className="relative inline-block border-r border-slate-700 pr-2">
                  <select
                    value={selectedUnitId}
                    onChange={(e) => onUnitChange(e.target.value)}
                    className="bg-emerald-950 text-emerald-300 font-semibold py-1.5 pr-2.5 pl-6 rounded-lg border border-emerald-700 text-xs appearance-none cursor-pointer"
                  >
                    {units.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        📍 {unit.name} ({unit.commune})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-emerald-400 absolute left-1.5 top-2.5 pointer-events-none" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none text-xs sm:text-sm font-semibold">
          <button
            onClick={() => onTabChange('overview')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>لوحة التحكم والإحصاءات</span>
          </button>

          <button
            onClick={() => onTabChange('athletes')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'athletes'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>ملفات وسجل الرياضيين</span>
          </button>

          <button
            onClick={() => onTabChange('associations')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'associations'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>الجمعيات والنوادي المعتمدة</span>
          </button>

          <button
            onClick={() => onTabChange('units')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'units'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>الوحدات والمركبات الرياضية (7)</span>
          </button>

          <button
            onClick={() => onTabChange('register')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition cursor-pointer ml-auto ${
              activeTab === 'register'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/20'
                : 'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-600/50'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>تسجيل أولي جديد عن بُعد</span>
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full">متاح</span>
          </button>
        </nav>
      </div>

      {/* Role Banner / Context Notification */}
      <div className="bg-slate-850 px-4 py-1.5 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold">الصلاحية المفعلة:</span>
            {currentRole === 'SUPER_ADMIN' && (
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <span>إشراف كامل على كافة مركبات ولاية ميلة وتأشيرة البطاقات النهائية</span>
              </span>
            )}
            {currentRole === 'UNIT_MANAGER' && (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span>تسيير وحدة: {selectedUnit.name} (دراسة الملفات وإصدار التراخيص)</span>
              </span>
            )}
            {currentRole === 'CLUB_MANAGER' && (
              <span className="text-sky-400 font-semibold flex items-center gap-1">
                <span>فضاء رؤساء الجمعيات: متابعة انخراط الأعضاء وطباعة اللوائح الجماعية</span>
              </span>
            )}
            {currentRole === 'ATHLETE_PORTAL' && (
              <span className="text-teal-300 font-semibold flex items-center gap-1">
                <span>فضاء الرياضيين: طلب التسجيل الأولي ومتابعة حالة الملف واستخراج الوصل والبطاقة</span>
              </span>
            )}
          </div>
          <div className="text-slate-400 text-[11px] hidden md:block">
            دعم كامل للطباعة الرسمية A4 وبطاقات PVC الرياضية
          </div>
        </div>
      </div>
    </header>
  );
};

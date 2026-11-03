import React from 'react';
import { SportsUnit, Athlete, Association } from '../types';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  CheckCircle2, 
  ChevronLeft, 
  Dumbbell, 
  Sparkles,
  Award
} from 'lucide-react';

interface UnitsManagerProps {
  units: SportsUnit[];
  athletes: Athlete[];
  associations: Association[];
  onSelectUnit: (unitId: string) => void;
  onFilterUnitAthletes: (unitId: string) => void;
}

export const UnitsManager: React.FC<UnitsManagerProps> = ({
  units,
  athletes,
  associations,
  onSelectUnit,
  onFilterUnitAthletes
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl text-white">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>شبكة المرافق الرياضية المعتمدة بولاية ميلة (7 وحدات)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            ديوان المركب المتعدد الرياضات لولاية ميلة (OPOW 43)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            تغطي وحدات ديوان ولاية ميلة بلديات الولاية الكبرى لاحتضان الرياضيين والنوادي الهاوية وتوفير الميادين المعشوشبة والقاعات المغطاة والمسابح نصف الأولمبية.
          </p>
        </div>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit) => {
          const unitAthletes = athletes.filter(a => a.unitId === unit.id);
          const approvedCount = unitAthletes.filter(a => a.status === 'APPROVED').length;
          const pendingCount = unitAthletes.filter(a => a.status === 'UNDER_REVIEW' || a.status === 'PRE_REGISTERED').length;
          const unitAssocs = associations.filter(a => a.unitId === unit.id);

          return (
            <div
              key={unit.id}
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/60 rounded-3xl overflow-hidden shadow-xl transition flex flex-col justify-between group"
            >
              {/* Cover Image & Badges */}
              <div className="relative h-44 overflow-hidden bg-slate-950">
                <img
                  src={unit.imageUrl}
                  alt={unit.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent"></div>
                
                <span className="absolute top-3 right-3 bg-emerald-600/90 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow backdrop-blur-xs">
                  كود: {unit.code}
                </span>

                <span className="absolute bottom-3 right-3 bg-slate-900/90 text-amber-300 text-xs font-black px-2.5 py-1 rounded-xl border border-slate-700">
                  📍 {unit.commune}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white group-hover:text-emerald-400 transition">
                    {unit.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{unit.address}</span>
                  </p>
                  <p className="text-[11px] text-emerald-300/90 font-semibold mt-1">
                    المسؤول: {unit.directorName}
                  </p>
                </div>

                {/* Facilities List */}
                <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-xs space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold block">المرافق والتجهيزات:</span>
                  <ul className="text-slate-300 text-[11px] space-y-1">
                    {unit.facilities.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                        <span className="truncate">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                  <div className="bg-slate-800/80 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">رياضيون معتمدون:</span>
                    <span className="text-sm font-black text-emerald-400 font-mono">{approvedCount}</span>
                  </div>
                  <div className="bg-slate-800/80 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">ملفات قيد الدراسة:</span>
                    <span className="text-sm font-black text-amber-400 font-mono">{pendingCount}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onFilterUnitAthletes(unit.id)}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>عرض ملفات الرياضيين</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Athlete, SportsUnit, Association } from '../types';
import { 
  X, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  Camera, 
  QrCode, 
  UserCheck, 
  Droplet,
  ExternalLink
} from 'lucide-react';

interface VerifyCardModalProps {
  athletes: Athlete[];
  units: SportsUnit[];
  associations: Association[];
  onClose: () => void;
  onOpenCard: (athlete: Athlete) => void;
}

export const VerifyCardModal: React.FC<VerifyCardModalProps> = ({
  athletes,
  units,
  associations,
  onClose,
  onOpenCard
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [scannedAthlete, setScannedAthlete] = useState<Athlete | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSimulatingCamera, setIsSimulatingCamera] = useState(false);

  const handleSearch = (termToSearch?: string) => {
    const query = (termToSearch !== undefined ? termToSearch : searchInput).trim().toLowerCase();
    if (!query) return;

    setHasSearched(true);
    // Find by registration number, preRegCode, or national ID
    const found = athletes.find(a => 
      a.registrationNumber?.toLowerCase().includes(query) ||
      a.preRegCode?.toLowerCase().includes(query) ||
      a.nationalIdNumber?.toLowerCase().includes(query) ||
      `${a.firstNameAr} ${a.lastNameAr}`.toLowerCase().includes(query) ||
      `${a.firstNameFr} ${a.lastNameFr}`.toLowerCase().includes(query)
    );

    setScannedAthlete(found || null);
  };

  const handleQuickPreset = (presetAthlete: Athlete) => {
    setSearchInput(presetAthlete.registrationNumber || presetAthlete.preRegCode);
    setScannedAthlete(presetAthlete);
    setHasSearched(true);
  };

  const handleSimulateScan = (ath: Athlete) => {
    setIsSimulatingCamera(true);
    setTimeout(() => {
      setIsSimulatingCamera(false);
      handleQuickPreset(ath);
    }, 900);
  };

  const getAthleteUnit = (unitId: string) => units.find(u => u.id === unitId);
  const getAthleteAssoc = (assocId?: string) => associations.find(a => a.id === assocId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-950 border border-emerald-500/40 rounded-xl text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                نظام التحقق الآني من بطاقات الرياضيين والـ QR
              </h3>
              <p className="text-xs text-slate-400">
                مخصص لأعوان استقبال الملاعب والمسابح ومراقبي الدخول لديوان ولاية ميلة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Scan Inputs */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="امسح الرمز أو أدخل رقم البطاقة (مثال: OPOW-43-2026-MIL-00101 أو رقم التعريف الوطني)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pr-10 pl-3 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow shadow-emerald-900/40 cursor-pointer"
            >
              تحقق الآن
            </button>
          </div>

          {/* Camera Scanner Simulation Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-col items-center justify-center relative overflow-hidden">
            {isSimulatingCamera ? (
              <div className="py-6 flex flex-col items-center justify-center">
                <div className="relative w-36 h-36 border-2 border-emerald-400 rounded-2xl flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-x-0 h-1 bg-emerald-400 animate-pulse top-1/2"></div>
                  <Camera className="w-12 h-12 text-emerald-400 animate-bounce" />
                </div>
                <p className="text-xs text-emerald-300 font-bold mt-3 animate-pulse">
                  جاري قراءة رمز الـ QR والتحقق من السجل الولائي...
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>نماذج جاهزة للمسح السريع:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {athletes.slice(0, 4).map((a) => (
                    <button
                      key={a.id}
                      onClick={() => handleSimulateScan(a)}
                      className="px-2 py-1 bg-slate-800 hover:bg-emerald-900/80 text-emerald-300 border border-slate-700 rounded-lg text-[11px] font-mono transition cursor-pointer"
                    >
                      {a.firstNameAr} ({a.registrationNumber ? 'معتمد' : 'مؤقت'})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Verification Result Display */}
        {hasSearched && (
          <div className="mt-4 pt-4 border-t border-slate-800">
            {scannedAthlete ? (
              <div className="space-y-4">
                {/* Status Alert Banner */}
                {scannedAthlete.status === 'APPROVED' ? (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-emerald-300">
                          بطاقة صالحة ومصادق عليها رسمياً (VALIDE)
                        </h4>
                        <p className="text-xs text-emerald-200/80">
                          يحق للرياضي الدخول للمركب والتدريب وفق الرخص الممنوحة
                        </p>
                      </div>
                    </div>
                    <span className="bg-emerald-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-full shadow">
                      مصادق عليه
                    </span>
                  </div>
                ) : scannedAthlete.status === 'UNDER_REVIEW' ? (
                  <div className="p-3 bg-amber-950/80 border border-amber-500/60 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-amber-300">
                          ملف قيد الدراسة (EN COURS D'EXAMEN)
                        </h4>
                        <p className="text-xs text-amber-200/80">
                          تم استلام الملف، بانتظار التأشيرة النهائية لمدير الوحدة
                        </p>
                      </div>
                    </div>
                    <span className="bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-full">
                      قيد الدراسة
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-red-950/80 border border-red-500/60 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-400 flex items-center justify-center text-red-400">
                        <XCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-red-300">
                          تسجيل أولي / غير مصادق عليه
                        </h4>
                        <p className="text-xs text-red-200/80">
                          {scannedAthlete.status === 'REJECTED'
                            ? `تم رفض الملف: ${scannedAthlete.rejectionReason || 'ملف غير مطابق'}`
                            : 'تسجيل أولي عن بعد، يتوجب إيداع الملف الطبي والوثائق بالوحدة'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Athlete Verification Details Card */}
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={scannedAthlete.photoUrl}
                      alt={scannedAthlete.firstNameAr}
                      className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl object-cover border-2 border-emerald-500/60 shadow"
                    />

                    <div className="flex-1 space-y-1.5 text-xs sm:text-sm">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base sm:text-lg font-black text-white">
                          {scannedAthlete.firstNameAr} {scannedAthlete.lastNameAr}
                        </h3>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {scannedAthlete.registrationNumber || scannedAthlete.preRegCode}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 uppercase tracking-wide">
                        {scannedAthlete.lastNameFr} {scannedAthlete.firstNameFr}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div>
                          <span className="text-slate-400">الرياضة: </span>
                          <span className="font-bold text-amber-300">{scannedAthlete.discipline}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">الفئة: </span>
                          <span className="font-semibold text-slate-200">{scannedAthlete.category}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">الوحدة: </span>
                          <span className="font-semibold text-emerald-300">
                            {getAthleteUnit(scannedAthlete.unitId)?.name || 'مركب ميلة'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">الجمعية: </span>
                          <span className="font-semibold text-slate-200">
                            {getAthleteAssoc(scannedAthlete.associationId)?.shortName || 'مدرسة الديوان'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">فصيلة الدم: </span>
                          <span className="font-black text-red-400">{scannedAthlete.bloodGroup}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">الموسم: </span>
                          <span className="font-bold text-slate-200">{scannedAthlete.season}</span>
                        </div>
                      </div>

                      {/* Medical Check Badge */}
                      <div className="pt-2 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>الملف الطبي: {scannedAthlete.hasMedicalCertificate ? 'مؤهل بدنياً' : 'غير مكتمل'}</span>
                        </span>

                        <button
                          onClick={() => {
                            onClose();
                            onOpenCard(scannedAthlete);
                          }}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>عرض وطباعة البطاقة</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 space-y-2">
                <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
                <p className="text-sm font-bold text-white">لم يتم العثور على أي رياضي بهذا الرقم أو الرمز</p>
                <p className="text-xs text-slate-500">
                  يرجى التأكد من الرقم التسلسلي، أو التحقق مما إذا كان الرياضي مسجلاً في وحدة أخرى بولاية ميلة.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Athlete, SportsUnit, Association, RegistrationStatus, UserRole } from '../types';
import { SPORT_DISCIPLINES } from '../data/mockData';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Award, 
  FileText, 
  Receipt, 
  Check, 
  X, 
  Printer, 
  Plus, 
  UserCheck, 
  ChevronRight,
  Eye,
  Building,
  QrCode
} from 'lucide-react';

interface AthletesListProps {
  athletes: Athlete[];
  units: SportsUnit[];
  associations: Association[];
  currentRole: UserRole;
  selectedUnitId: string;
  onApprove: (athleteId: string) => void;
  onReject: (athleteId: string, reason: string) => void;
  onMarkUnderReview: (athleteId: string) => void;
  onViewCard: (athlete: Athlete) => void;
  onViewForm: (athlete: Athlete) => void;
  onViewReceipt: (athlete: Athlete) => void;
  onNewRegistrationClick: () => void;
}

export const AthletesList: React.FC<AthletesListProps> = ({
  athletes,
  units,
  associations,
  currentRole,
  selectedUnitId,
  onApprove,
  onReject,
  onMarkUnderReview,
  onViewCard,
  onViewForm,
  onViewReceipt,
  onNewRegistrationClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [disciplineFilter, setDisciplineFilter] = useState<string>('ALL');
  const [assocFilter, setAssocFilter] = useState<string>('ALL');
  const [unitFilter, setUnitFilter] = useState<string>(
    currentRole === 'UNIT_MANAGER' ? selectedUnitId : 'ALL'
  );

  // Reject modal state
  const [rejectingAthleteId, setRejectingAthleteId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('نقص في الملف الطبي أو عدم مطابقة الوثائق الرسمية');

  // Filter athletes
  const filteredAthletes = athletes.filter((athlete) => {
    // If unit manager role, scope strictly or by filter
    const effectiveUnitFilter = currentRole === 'UNIT_MANAGER' ? selectedUnitId : unitFilter;
    if (effectiveUnitFilter !== 'ALL' && athlete.unitId !== effectiveUnitFilter) {
      return false;
    }

    if (statusFilter !== 'ALL' && athlete.status !== statusFilter) {
      return false;
    }

    if (disciplineFilter !== 'ALL' && athlete.discipline !== disciplineFilter) {
      return false;
    }

    if (assocFilter !== 'ALL' && athlete.associationId !== assocFilter) {
      return false;
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        athlete.firstNameAr.toLowerCase().includes(q) ||
        athlete.lastNameAr.toLowerCase().includes(q) ||
        athlete.firstNameFr.toLowerCase().includes(q) ||
        athlete.lastNameFr.toLowerCase().includes(q) ||
        athlete.nationalIdNumber.includes(q) ||
        (athlete.registrationNumber && athlete.registrationNumber.toLowerCase().includes(q)) ||
        (athlete.preRegCode && athlete.preRegCode.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  const getUnitName = (unitId: string) => {
    return units.find((u) => u.id === unitId)?.name || 'المركب الرئيسي ميلة';
  };

  const getAssocName = (assocId?: string) => {
    if (!assocId) return 'مدرسة ديوان ميلة (انخراط فردي)';
    return associations.find((a) => a.id === assocId)?.shortName || 'جمعية رياضية';
  };

  const handleConfirmReject = () => {
    if (rejectingAthleteId) {
      onReject(rejectingAthleteId, rejectReason);
      setRejectingAthleteId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters & Actions Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث بالاسم، اللقب، رقم البطاقة، رقم التعريف الوطني، أو كود التتبع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl pr-10 pl-3 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onNewRegistrationClick}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow shadow-emerald-950/40 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل رياضي جديد</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition border border-slate-700 flex items-center gap-1.5 cursor-pointer no-print"
              title="طباعة الجدول الحالي"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">طباعة القائمة</span>
            </button>
          </div>
        </div>

        {/* Filter dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-slate-800 text-xs">
          {/* Status filter */}
          <div>
            <label className="text-slate-400 block mb-1 font-medium">حالة الملف:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white font-semibold"
            >
              <option value="ALL">جميع الحالات ({athletes.length})</option>
              <option value="APPROVED">✅ مصادق عليه / بطاقة صادرة ({athletes.filter(a => a.status === 'APPROVED').length})</option>
              <option value="UNDER_REVIEW">⏳ قيد دراسة الملف ({athletes.filter(a => a.status === 'UNDER_REVIEW').length})</option>
              <option value="PRE_REGISTERED">📝 تسجيل أولي عن بعد ({athletes.filter(a => a.status === 'PRE_REGISTERED').length})</option>
              <option value="REJECTED">❌ ملف مرفوض ({athletes.filter(a => a.status === 'REJECTED').length})</option>
            </select>
          </div>

          {/* Unit filter (if not locked by unit manager) */}
          <div>
            <label className="text-slate-400 block mb-1 font-medium">الوحدة الرياضية:</label>
            <select
              disabled={currentRole === 'UNIT_MANAGER'}
              value={currentRole === 'UNIT_MANAGER' ? selectedUnitId : unitFilter}
              onChange={(e) => setUnitFilter(e.target.value)}
              className={`w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white font-semibold ${
                currentRole === 'UNIT_MANAGER' ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <option value="ALL">كافة وحدات ولاية ميلة</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  📍 {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Discipline filter */}
          <div>
            <label className="text-slate-400 block mb-1 font-medium">التخصص الرياضي:</label>
            <select
              value={disciplineFilter}
              onChange={(e) => setDisciplineFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white font-semibold"
            >
              <option value="ALL">كافة الرياضات</option>
              {SPORT_DISCIPLINES.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </div>

          {/* Association filter */}
          <div>
            <label className="text-slate-400 block mb-1 font-medium">الجمعية / النادي:</label>
            <select
              value={assocFilter}
              onChange={(e) => setAssocFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white font-semibold"
            >
              <option value="ALL">كافة النوادي والمدارس</option>
              {associations.map((assoc) => (
                <option key={assoc.id} value={assoc.id}>
                  {assoc.shortName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table & Cards List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl text-white">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            <span>النتائج المعروضة: </span>
            <span className="font-bold text-emerald-400">{filteredAthletes.length}</span>
            <span> من إجمالي </span>
            <span className="font-bold text-white">{athletes.length}</span>
            <span> رياضي مسجل</span>
          </div>
          <div className="text-[11px] hidden sm:block text-slate-500">
            يمكن لمدير الوحدة المصادقة الفورية لتوليد رقم التسجيل الموحد ورمز الـ QR الرسمي
          </div>
        </div>

        {filteredAthletes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950/70 text-slate-400 uppercase text-[11px] font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">الرياضي(ة)</th>
                  <th className="py-3.5 px-3">رقم التسجيل / التتبع</th>
                  <th className="py-3.5 px-3">الرياضة والفئة</th>
                  <th className="py-3.5 px-3">الوحدة والنادي</th>
                  <th className="py-3.5 px-3">الملف الطبي</th>
                  <th className="py-3.5 px-3">حالة الملف</th>
                  <th className="py-3.5 px-4 text-center">الإجراءات والوثائق</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredAthletes.map((athlete) => (
                  <tr
                    key={athlete.id}
                    className="hover:bg-slate-800/50 transition items-center"
                  >
                    {/* Athlete Name & Photo */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={athlete.photoUrl}
                          alt={athlete.firstNameAr}
                          className="w-10 h-12 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <p className="font-black text-white text-sm">
                            {athlete.firstNameAr} {athlete.lastNameAr}
                          </p>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">
                            {athlete.lastNameFr} {athlete.firstNameFr}
                          </p>
                          <span className="text-[10px] text-slate-500">
                            فصيلة الدم: <strong className="text-red-400">{athlete.bloodGroup}</strong>
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Registration ID / Pre-Reg */}
                    <td className="py-3 px-3">
                      {athlete.registrationNumber ? (
                        <div>
                          <span className="font-mono font-bold text-amber-300 text-xs block">
                            {athlete.registrationNumber}
                          </span>
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                            <QrCode className="w-3 h-3" />
                            <span>كود QR نشط</span>
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="font-mono text-slate-400 text-xs block">
                            {athlete.preRegCode}
                          </span>
                          <span className="text-[10px] text-amber-400">مؤقت قبل الاعتماد</span>
                        </div>
                      )}
                    </td>

                    {/* Discipline & Category */}
                    <td className="py-3 px-3">
                      <p className="font-bold text-emerald-300">{athlete.discipline}</p>
                      <p className="text-[10px] text-slate-400">{athlete.category}</p>
                    </td>

                    {/* Unit & Club */}
                    <td className="py-3 px-3">
                      <p className="font-semibold text-white truncate max-w-[150px]">
                        {getUnitName(athlete.unitId)}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        {getAssocName(athlete.associationId)}
                      </p>
                    </td>

                    {/* Medical Check */}
                    <td className="py-3 px-3">
                      {athlete.hasMedicalCertificate ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>مؤهل صحياً</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-400 text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>بانتظار الشهادة</span>
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3">
                      {athlete.status === 'APPROVED' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span>مصادق عليه</span>
                        </span>
                      )}
                      {athlete.status === 'UNDER_REVIEW' && (
                        <span className="inline-flex items-center gap-1 bg-amber-950 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>قيد الدراسة</span>
                        </span>
                      )}
                      {athlete.status === 'PRE_REGISTERED' && (
                        <span className="inline-flex items-center gap-1 bg-blue-950 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <span>تسجيل أولي</span>
                        </span>
                      )}
                      {athlete.status === 'REJECTED' && (
                        <span className="inline-flex items-center gap-1 bg-red-950 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <XCircle className="w-3 h-3 text-red-400" />
                          <span>مرفوض</span>
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {/* Printable Badge Button */}
                        <button
                          onClick={() => onViewCard(athlete)}
                          title="عرض وطباعة بطاقة الرياضي"
                          className="p-1.5 bg-slate-800 hover:bg-emerald-700 text-emerald-300 hover:text-white rounded-lg transition border border-slate-700 cursor-pointer"
                        >
                          <Award className="w-4 h-4" />
                        </button>

                        {/* Official A4 Registration Form */}
                        <button
                          onClick={() => onViewForm(athlete)}
                          title="طباعة استمارة التسجيل الرسمية (A4)"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition border border-slate-700 cursor-pointer"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        {/* Pre-registration Receipt */}
                        <button
                          onClick={() => onViewReceipt(athlete)}
                          title="عرض وصل إيداع الملف"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition border border-slate-700 cursor-pointer"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>

                        {/* Administrative Approval Actions */}
                        {athlete.status !== 'APPROVED' && (
                          <button
                            onClick={() => onApprove(athlete.id)}
                            title="المصادقة النهائية وتوليد رقم ورخصة OPOW"
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg transition shadow cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>قبول واعتماد</span>
                          </button>
                        )}

                        {athlete.status === 'PRE_REGISTERED' && (
                          <button
                            onClick={() => onMarkUnderReview(athlete.id)}
                            title="وضع قيد المراجعة"
                            className="px-2 py-1 bg-amber-600/80 hover:bg-amber-500 text-white font-semibold text-[10px] rounded-lg transition cursor-pointer"
                          >
                            استلام الملف
                          </button>
                        )}

                        {athlete.status !== 'REJECTED' && (
                          <button
                            onClick={() => setRejectingAthleteId(athlete.id)}
                            title="رفض الطلب"
                            className="p-1.5 text-red-400 hover:bg-red-950/80 hover:text-red-300 rounded-lg transition cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Filter className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-bold text-white">لا توجد ملفات مطابقة للخيارات المحددة</p>
            <p className="text-xs text-slate-500">جرب تغيير معايير البحث أو تصفية الحالة والوحدة الرياضية.</p>
          </div>
        )}
      </div>

      {/* Reject Modal dialog */}
      {rejectingAthleteId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-5 rounded-2xl max-w-md w-full text-white space-y-3">
            <h4 className="font-bold text-base text-red-400 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              <span>رفض ملف الرياضي</span>
            </h4>
            <p className="text-xs text-slate-300">
              يرجى توضيح سبب الرفض لتنبيه الرياضي أو ممثل النادي لتصحيح الملف:
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-hidden focus:border-red-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingAthleteId(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                تأكيد الرفض
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

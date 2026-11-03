import React from 'react';
import { Athlete, SportsUnit, Association } from '../types';
import { QRCodeDisplay } from './QRCodeDisplay';
import { X, Printer, FileText, CheckCircle2, Shield } from 'lucide-react';

interface OfficialFormModalProps {
  athlete: Athlete | null;
  unit?: SportsUnit;
  association?: Association;
  onClose: () => void;
}

export const OfficialFormModal: React.FC<OfficialFormModalProps> = ({
  athlete,
  unit,
  association,
  onClose
}) => {
  if (!athlete) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      {/* Modal Container */}
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl relative text-slate-100 max-h-[95vh] flex flex-col">
        {/* Actions bar (no-print) */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold">
              استمارة التسجيل النهائي والمصادقة الإدارية (نسخة A4 الرسمية)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-emerald-950/50 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الاستمارة الرسمية (A4)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable A4 Sheet Preview */}
        <div className="overflow-y-auto flex-1 flex justify-center py-2 px-1">
          {/* Printable A4 Paper Container */}
          <div className="printable-area bg-white text-slate-900 w-full max-w-[760px] p-6 sm:p-8 rounded-lg shadow-xl border border-slate-300 text-xs sm:text-sm leading-normal">
            {/* Header: Algerian Official Institutional Heading */}
            <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
              <p className="font-bold text-sm sm:text-base">الجمهورية الجزائرية الديمقراطية الشعبية</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-700">RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE</p>
              
              <div className="grid grid-cols-3 items-center mt-2 pt-2 border-t border-slate-200">
                <div className="text-right text-[11px] leading-tight">
                  <p className="font-bold">وزارة الشباب والرياضة</p>
                  <p>مديرية الشباب والرياضة لولاية ميلة</p>
                  <p className="text-emerald-800 font-bold">ديوان المركب المتعدد الرياضات</p>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full border-2 border-emerald-800 flex flex-col items-center justify-center bg-slate-50">
                    <span className="text-[10px] font-black text-emerald-900">OPOW</span>
                    <span className="text-[9px] font-bold text-amber-700">MILA 43</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5">DJS-OPOW/43</span>
                </div>

                <div className="text-left text-[11px] leading-tight" dir="ltr">
                  <p className="font-bold">Ministère de la Jeunesse et des Sports</p>
                  <p>Direction de la Jeunesse et des Sports - Mila</p>
                  <p className="text-emerald-800 font-bold">O.P.O.W de la Wilaya de Mila</p>
                </div>
              </div>
            </div>

            {/* Document Title & Reference Bar */}
            <div className="bg-slate-100 border border-slate-300 p-2.5 rounded-md flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  استمارة التسجيل النهائي ورخصة الرياضي
                </h2>
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                  FICHE D'INSCRIPTION DÉFINITIVE & DÉLIVRANCE DE LICENCE
                </p>
              </div>
              <div className="text-left">
                <p className="text-xs font-mono font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-300">
                  {athlete.registrationNumber || athlete.preRegCode}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">الموسم: {athlete.season}</p>
              </div>
            </div>

            {/* Top Grid: Athlete Photo + Core Information */}
            <div className="grid grid-cols-12 gap-4 mb-4 items-start">
              {/* Photo Box */}
              <div className="col-span-3 flex flex-col items-center">
                <div className="w-28 h-36 border-2 border-slate-400 rounded-md overflow-hidden bg-slate-50 flex items-center justify-center shadow-xs">
                  {athlete.photoUrl ? (
                    <img
                      src={athlete.photoUrl}
                      alt="صورة الرياضي"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] text-slate-400 text-center p-2">مكان الصورة الشمسية</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 font-semibold">صورة شمسية أصلية</span>
              </div>

              {/* Identity Details Table */}
              <div className="col-span-9">
                <div className="border border-slate-300 rounded-md overflow-hidden">
                  <div className="bg-slate-800 text-white font-bold px-3 py-1 text-xs">
                    أولاً: المعلومات الشخصية للرياضي (Identité de l'Athlète)
                  </div>
                  <div className="p-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 font-medium">اللقب والاسم بالعربية: </span>
                      <span className="font-bold text-slate-900">{athlete.lastNameAr} {athlete.firstNameAr}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Nom & Prénom en français: </span>
                      <span className="font-bold text-slate-900 uppercase">{athlete.lastNameFr} {athlete.firstNameFr}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">تاريخ ومكان الازدياد: </span>
                      <span className="font-semibold text-slate-900">{athlete.birthDate} بـ {athlete.birthPlace}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">الجنس / فصيلة الدم: </span>
                      <span className="font-bold text-slate-900">{athlete.gender} | <span className="text-red-700 font-black">{athlete.bloodGroup}</span></span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">رقم التعريف الوطني (NIN): </span>
                      <span className="font-mono font-bold text-slate-900">{athlete.nationalIdNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">رقم الهاتف: </span>
                      <span className="font-mono font-semibold text-slate-900">{athlete.phone}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 font-medium">العنوان والبلدية: </span>
                      <span className="font-semibold text-slate-900">{athlete.address} - ولاية ميلة</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Section: Sports Affiliation & Unit */}
            <div className="border border-slate-300 rounded-md overflow-hidden mb-4">
              <div className="bg-slate-800 text-white font-bold px-3 py-1 text-xs">
                ثانياً: الانتماء والنشاط الرياضي (Affiliation et Discipline)
              </div>
              <div className="p-3 grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">الوحدة الرياضية المستقبلة:</span>
                  <span className="font-bold text-emerald-800">{unit?.name || 'مركب الشهيد بلقاسم بلعيد - ميلة'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">الجمعية / النادي الرياضي:</span>
                  <span className="font-bold text-slate-900">{association?.name || 'مدرسة التكوين لديوان المركب'}</span>
                  {association?.licenseNumber && (
                    <span className="text-[10px] text-slate-500 block font-mono">اعتماد: {association.licenseNumber}</span>
                  )}
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">التخصص والفئة العمرية:</span>
                  <span className="font-bold text-amber-700">{athlete.discipline}</span>
                  <span className="text-[10px] text-slate-700 block font-medium">فئة: {athlete.category}</span>
                </div>
              </div>
            </div>

            {/* Third Section: Medical & Insurance Clearance */}
            <div className="border border-slate-300 rounded-md overflow-hidden mb-4">
              <div className="bg-slate-800 text-white font-bold px-3 py-1 text-xs">
                ثالثاً: الفحص الطبي والتأمين الرياضي (Aptitude Médicale & Assurance)
              </div>
              <div className="p-3 grid grid-cols-2 gap-3 text-xs items-center">
                <div className="border-r border-slate-200 pr-2">
                  <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>الملف الطبي: مؤهل بدنياً وصحياً لممارسة الرياضة التنافسية</span>
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    الطبيب المعاين: <span className="font-semibold text-slate-900">{athlete.medicalDoctorName || 'طبيب وحدة الطب الرياضي'}</span>
                  </p>
                  <p className="text-[11px] text-slate-600">
                    تاريخ الشهادة الطبية: <span className="font-semibold text-slate-900">{athlete.medicalCertDate || athlete.submissionDate}</span>
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">
                    رقم بوليصة التأمين الرياضي: <span className="font-mono font-bold text-slate-900">{athlete.insuranceNumber || 'SAA-OPOW-43-2026'}</span>
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    ملاحظات الإدارة: <span className="font-medium text-slate-800">{athlete.notes || 'تمت مطابقة الملف الإداري واستيفاء كافة الشروط'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Fourth Section: Parental Authorization for minors */}
            <div className="border border-slate-300 rounded-md overflow-hidden mb-4 p-3 bg-slate-50 text-[11px]">
              <p className="font-bold text-slate-900 mb-1">
                رابعاً: ترخيص الولي الشرعي والتصريح بالشرف (للقصر دون 19 سنة):
              </p>
              <p className="text-slate-700 leading-relaxed">
                أنا الموقع أسفله الولي الشرعي للرياضي(ة) {athlete.guardianName ? `(${athlete.guardianName})` : 'المذكور أعلاه'}، أصرح بأنني أوافق على انخراطه ومشاركته في كافة التدريبات والبطولات الرياضية الرسمية لديوان المركب الرياضي لولاية ميلة، وألتزم باحترام نظامه الداخلي.
              </p>
              <div className="mt-2 text-left font-semibold text-slate-800">
                توقيع وبصمة الولي الشرعي: .......................................
              </div>
            </div>

            {/* Signatures & Official Validation Box */}
            <div className="grid grid-cols-3 gap-3 border-2 border-slate-900 rounded-md p-3 text-center text-xs mt-3">
              <div>
                <p className="font-bold text-slate-900 mb-6">توقيع الرياضي(ة)</p>
                <div className="h-10 flex items-center justify-center text-slate-400 italic text-[11px]">
                  (قرئ وصودق عليه)
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900 mb-6">رئيس الجمعية / النادي</p>
                <div className="h-10 flex items-center justify-center text-slate-400 italic text-[11px]">
                  (الختم والتوقيع)
                </div>
              </div>

              <div className="border-r-2 border-slate-900 pr-2">
                <p className="font-black text-emerald-950 mb-1">تأشيرة ومصادقة ديوان المركب الرياضي ميلة</p>
                <p className="text-[10px] text-slate-600 mb-2">تاريخ المصادقة: {athlete.approvalDate || athlete.submissionDate}</p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-14 h-14 border border-dashed border-emerald-800 rounded flex flex-col items-center justify-center text-[8px] font-bold text-emerald-900 bg-emerald-50">
                    <span>الختم الرسمي</span>
                    <span>ديوان OPOW ميلة</span>
                  </div>
                  <div>
                    <QRCodeDisplay 
                      value={athlete.qrPayload || `https://opow-mila.dz/verify?reg=${athlete.registrationNumber}`} 
                      size={60} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Official Footer Note */}
            <div className="mt-3 text-center text-[9px] text-slate-500 border-t border-slate-200 pt-1">
              تم إصدار هذه الاستمارة الرسمية إلكترونياً عبر المنصة الرقمية الموحدة لديوان المركب المتعدد الرياضات لولاية ميلة (OPOW Mila) • رمز الوثيقة: {athlete.registrationNumber || athlete.preRegCode}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

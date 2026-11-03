import React from 'react';
import { Athlete, SportsUnit } from '../types';
import { QRCodeDisplay } from './QRCodeDisplay';
import { X, Printer, CheckCircle, Clock, AlertCircle, MapPin, Phone } from 'lucide-react';

interface PreRegistrationReceiptModalProps {
  athlete: Athlete | null;
  unit?: SportsUnit;
  onClose: () => void;
}

export const PreRegistrationReceiptModal: React.FC<PreRegistrationReceiptModalProps> = ({
  athlete,
  unit,
  onClose
}) => {
  if (!athlete) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative text-slate-100 flex flex-col">
        {/* Actions (no-print) */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 no-print">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold">
              وصل إيداع ملف التسجيل الأولي (Reçu de Pré-inscription)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الوصل</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="printable-area bg-white text-slate-900 p-6 rounded-xl border border-slate-300 shadow-lg text-xs leading-relaxed">
          {/* Header */}
          <div className="border-b-2 border-emerald-800 pb-3 mb-3 text-center">
            <p className="font-bold text-xs text-slate-800">الجمهورية الجزائرية الديمقراطية الشعبية</p>
            <p className="font-black text-sm text-emerald-950 mt-0.5">
              ديوان المركب المتعدد الرياضات لولاية ميلة (OPOW 43)
            </p>
            <div className="inline-block bg-amber-100 text-amber-900 font-extrabold px-3 py-1 rounded-full text-xs mt-2 border border-amber-300">
              وصل التسجيل الأولي عن بُعد واستلام توجيهات إيداع الملف
            </div>
          </div>

          {/* Tracking Reference & QR */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] text-slate-500">رقم تتبع التسجيل الأولي (Code de Pré-inscription):</p>
              <p className="text-base font-black font-mono text-emerald-800">{athlete.preRegCode}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">تاريخ الطلب: {athlete.submissionDate}</p>
            </div>
            <div>
              <QRCodeDisplay 
                value={`https://opow-mila.dz/track?code=${athlete.preRegCode}`} 
                size={70} 
              />
            </div>
          </div>

          {/* Athlete Summary */}
          <div className="grid grid-cols-2 gap-3 mb-4 border border-slate-200 p-3 rounded-lg bg-slate-50">
            <div>
              <span className="text-slate-500 block text-[10px]">اسم ولقب الرياضي:</span>
              <span className="font-black text-slate-900 text-sm">{athlete.lastNameAr} {athlete.firstNameAr}</span>
              <span className="text-slate-600 font-semibold block text-[11px] uppercase">{athlete.lastNameFr} {athlete.firstNameFr}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">الرياضة المطلوبة:</span>
              <span className="font-bold text-amber-800 text-sm">{athlete.discipline}</span>
              <span className="text-slate-600 block text-[11px]">الفئة: {athlete.category}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">تاريخ ومكان الميلاد:</span>
              <span className="font-semibold text-slate-800">{athlete.birthDate} ({athlete.birthPlace})</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">رقم الهاتف للتواصل:</span>
              <span className="font-mono font-bold text-slate-900">{athlete.phone}</span>
            </div>
          </div>

          {/* Where to bring the file */}
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg mb-4">
            <h4 className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs mb-1.5">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>مكان ومكتب إيداع الملف الورقي:</span>
            </h4>
            <p className="font-bold text-slate-900">{unit?.name || 'مركب الشهيد بلقاسم بلعيد - ميلة'}</p>
            <p className="text-slate-600 text-[11px]">{unit?.address || 'ميلة المركز'} - هاتف: {unit?.phone || '031 56 12 40'}</p>
            <p className="text-emerald-800 font-semibold text-[10px] mt-1">مكتب استقبال وانخراط النوادي والرياضيين (من الأحد إلى الخميس: 08:30 إلى 16:30)</p>
          </div>

          {/* Required documents checklist */}
          <div className="border border-slate-300 rounded-lg p-3 mb-4">
            <h4 className="font-bold text-slate-900 text-xs mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>الوثائق الواجب تقديمها لاستكمال الملف واستلام البطاقة النهائية:</span>
            </h4>
            <ul className="space-y-1 text-slate-700 text-[11px] list-disc pr-4">
              <li>هذا الوصل مطبوع مع استمارة التسجيل.</li>
              <li>شهادة طبية تثبت القدرة البدنية على ممارسة الرياضة حديثة (أقل من 3 أشهر).</li>
              <li>صورتان شمسيتان حديثتان خلفية بيضاء مع كتابة الاسم خلفهما.</li>
              <li>نسخة من بطاقة التعريف الوطنية أو شهادة ميلاد أصلية للمعني.</li>
              <li>ترخيص الولي الشرعي مصادق عليه بالنسبة للرياضيين القصر.</li>
              <li>وصل تسديد حقوق الانخراط أو التأمين السنوي لدى أمين صندوق الوحدة.</li>
            </ul>
          </div>

          {/* Footer Receipt Notice */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-[10px] text-slate-500">
            <span>تنبيه: يعتبر هذا الوصل مؤقتاً ولا يخول الدخول للملاعب حتى دراسة الملف والمصادقة النهائية.</span>
            <span className="font-mono">OPOW-MILA-WEB</span>
          </div>
        </div>
      </div>
    </div>
  );
};

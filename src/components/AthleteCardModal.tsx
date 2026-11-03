import React, { useState } from 'react';
import { Athlete, SportsUnit, Association } from '../types';
import { QRCodeDisplay } from './QRCodeDisplay';
import { 
  X, 
  Printer, 
  RotateCw, 
  ShieldCheck, 
  Droplet, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Sparkles,
  Award
} from 'lucide-react';

interface AthleteCardModalProps {
  athlete: Athlete | null;
  unit?: SportsUnit;
  association?: Association;
  onClose: () => void;
}

export const AthleteCardModal: React.FC<AthleteCardModalProps> = ({
  athlete,
  unit,
  association,
  onClose
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!athlete) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      {/* Modal Card */}
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative text-white">
        {/* Header Actions (no-print) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold">بطاقة رياضي رقمية ورخصة معتمدة (OPOW Mila)</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>قلب البطاقة (الوجه / الظهر)</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition shadow shadow-emerald-900/50 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة البطاقة</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Card Display Container */}
        <div className="flex flex-col items-center justify-center py-2">
          {/* Printable Area - Standard CR80 ID Card aspect ratio (~85.6mm x 53.98mm) */}
          <div className="printable-area w-full max-w-[440px] sm:max-w-[480px]">
            {!isFlipped ? (
              /* CARD FRONT */
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 border-2 border-amber-400/60 p-4 shadow-2xl text-slate-100 flex flex-col justify-between min-h-[290px] sm:min-h-[305px]">
                {/* Algerian Top Ribbon & Guilloche texture simulation */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-white to-red-600"></div>
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>

                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5 z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-emerald-700/80 p-0.5 border border-emerald-400/40 flex items-center justify-center text-center">
                      <span className="text-[10px] font-black text-amber-300 leading-tight">OPOW<br/>43</span>
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-white leading-tight">
                        ديوان المركب المتعدد الرياضات لولاية ميلة
                      </p>
                      <p className="text-[9px] text-emerald-300 font-semibold uppercase tracking-wider">
                        Office du Parc Omnisports - Mila
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="bg-amber-400/90 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full inline-block shadow-xs">
                      الموسم {athlete.season}
                    </span>
                    <p className="text-[9px] text-slate-300 font-bold mt-0.5">بطاقة رياضي منخرط</p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="grid grid-cols-12 gap-3 my-2 z-10 items-center">
                  {/* Photo & Blood Group */}
                  <div className="col-span-4 flex flex-col items-center">
                    <div className="relative w-24 h-28 sm:w-26 sm:h-30 rounded-xl overflow-hidden border-2 border-emerald-400/80 shadow-md bg-slate-800">
                      <img
                        src={athlete.photoUrl}
                        alt={`${athlete.firstNameAr} ${athlete.lastNameAr}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[9px] text-center font-bold text-emerald-300 py-0.5">
                        {athlete.gender}
                      </div>
                    </div>

                    {/* Blood Group Badge */}
                    <div className="mt-1.5 flex items-center gap-1 bg-red-950/80 border border-red-500/50 text-red-200 px-2 py-0.5 rounded-full text-[10px] font-black">
                      <Droplet className="w-2.5 h-2.5 fill-red-400 text-red-400" />
                      <span>فصيلة الدم: {athlete.bloodGroup}</span>
                    </div>
                  </div>

                  {/* Athlete Details */}
                  <div className="col-span-5 text-right space-y-1">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">الاسم واللقب:</p>
                      <p className="text-sm sm:text-base font-black text-white leading-tight">
                        {athlete.firstNameAr} {athlete.lastNameAr}
                      </p>
                      <p className="text-[10px] font-bold text-emerald-300 tracking-wide uppercase">
                        {athlete.lastNameFr} {athlete.firstNameFr}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                      <div>
                        <span className="text-slate-400 text-[10px] block">الرياضة:</span>
                        <span className="font-extrabold text-amber-300">{athlete.discipline}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">الفئة:</span>
                        <span className="font-bold text-white text-[10px]">{athlete.category.split(' ')[0]}</span>
                      </div>
                    </div>

                    <div className="pt-0.5">
                      <span className="text-slate-400 text-[10px] block">النادي / الجمعية:</span>
                      <span className="font-bold text-slate-200 text-[11px] truncate block">
                        {association?.shortName || association?.name || 'مدرسة ديوان ميلة (OPOW)'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block">الوحدة الرياضية:</span>
                      <span className="font-semibold text-emerald-300 text-[10px] truncate block">
                        {unit?.name || 'مركب الشهيد بلقاسم بلعيد'}
                      </span>
                    </div>
                  </div>

                  {/* Scannable QR Code Column */}
                  <div className="col-span-3 flex flex-col items-center justify-center text-center">
                    <div className="bg-white p-1 rounded-xl shadow-md border border-slate-300">
                      <QRCodeDisplay 
                        value={athlete.qrPayload || `https://opow-mila.dz/verify?reg=${athlete.registrationNumber}`} 
                        size={84} 
                      />
                    </div>
                    <span className="text-[9px] text-emerald-300 font-mono mt-1 font-bold">
                      رمز التحقق QR
                    </span>
                    <span className="text-[8px] text-slate-400 block -mt-0.5">
                      معتمد رسمياً
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="border-t border-emerald-500/30 pt-1.5 flex items-center justify-between text-[10px] z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">رقم التسجيل:</span>
                    <span className="font-mono font-black text-amber-300 tracking-wider text-xs">
                      {athlete.registrationNumber || athlete.preRegCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400 font-bold text-[9px]">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>تأشيرة ديوان ولاية ميلة</span>
                  </div>
                </div>
              </div>
            ) : (
              /* CARD BACK */
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-600 p-4 shadow-2xl text-slate-200 flex flex-col justify-between min-h-[290px] sm:min-h-[305px]">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-600"></div>

                {/* Back Header */}
                <div className="text-center border-b border-slate-800 pb-2">
                  <p className="text-xs font-bold text-white">الجمهورية الجزائرية الديمقراطية الشعبية</p>
                  <p className="text-[10px] text-emerald-400 font-semibold">شروط وتعليمات استخدام البطاقة الرياضية</p>
                </div>

                {/* Instructions */}
                <div className="text-[10px] space-y-1.5 text-slate-300 leading-relaxed pr-2 my-2">
                  <p>1. هذه البطاقة شخصية وغير قابلة للإعارة، وتخول لصاحبها الدخول إلى مرافق ومسابح ديوان المركب الرياضي لولاية ميلة وفق التوقيت المخصص له.</p>
                  <p>2. يجب إظهار البطاقة عند مدخل المركب وعند كل مراقبة من طرف أعوان الأمن والاستقبال.</p>
                  <p>3. في حال ضياع هذه البطاقة، يجب إخطار إدارة الوحدة فوراً لاستخراج نظير لها.</p>
                  <p>4. يخضع حامل هذه البطاقة للتأمين الرياضي المعتمد طبقا للتشريع الساري المفعول.</p>
                </div>

                {/* Emergency & Official Seal */}
                <div className="grid grid-cols-2 gap-2 border-t border-slate-800 pt-2 text-[10px]">
                  <div>
                    <span className="text-slate-400 block text-[9px]">رقم التعريف الوطني (NIN):</span>
                    <span className="font-mono font-bold text-white">{athlete.nationalIdNumber}</span>
                    <span className="text-slate-400 block text-[9px] mt-1">هاتف الطوارئ / الولي:</span>
                    <span className="font-mono font-bold text-amber-300">{athlete.guardianPhone || athlete.phone}</span>
                  </div>

                  <div className="text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-12 border border-dashed border-emerald-500/60 rounded-md flex flex-col items-center justify-center p-1 bg-emerald-950/40">
                      <span className="text-[8px] font-black text-emerald-300 leading-none">ختم وتوقيع</span>
                      <span className="text-[8px] text-slate-300 font-bold leading-none mt-0.5">مدير الديوان</span>
                      <div className="w-8 h-0.5 bg-emerald-400 mt-1"></div>
                    </div>
                    <span className="text-[8px] text-slate-400 mt-0.5">صادرة بتاريخ: {athlete.approvalDate || athlete.submissionDate}</span>
                  </div>
                </div>

                {/* Barcode Strip */}
                <div className="bg-white p-1 rounded text-center mt-1">
                  <div className="h-6 flex items-center justify-center space-x-1 font-mono tracking-widest text-[9px] text-slate-900 font-black">
                    ||| | |||| | ||| || |||| ||| | |||| {athlete.registrationNumber || athlete.preRegCode}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info (no-print) */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 no-print gap-2">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>البطاقة مجهزة بكود QR مشفر للتحقق الفوري عند أبواب الملاعب والمسابح</span>
          </div>
          <div>
            <span>الأبعاد النموذجية للطباعة: 85 × 54 ملم (بطاقة بلاستيكية أو ورقية مغلفة)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

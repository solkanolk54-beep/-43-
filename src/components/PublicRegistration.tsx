import React, { useState } from 'react';
import { SportsUnit, Association, SportDiscipline, AgeCategory, BloodGroup, Athlete } from '../types';
import { SPORT_DISCIPLINES } from '../data/mockData';
import { storageService } from '../services/storageService';
import confetti from 'canvas-confetti';
import { 
  UserPlus, 
  CheckCircle, 
  Upload, 
  Camera, 
  FileCheck, 
  Shield, 
  MapPin, 
  Calendar, 
  AlertCircle,
  Search,
  Sparkles
} from 'lucide-react';

interface PublicRegistrationProps {
  units: SportsUnit[];
  associations: Association[];
  onRegistrationComplete: (newAthlete: Athlete) => void;
  onViewAthleteCard: (athlete: Athlete) => void;
  onViewReceipt: (athlete: Athlete) => void;
}

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80'
];

export const PublicRegistration: React.FC<PublicRegistrationProps> = ({
  units,
  associations,
  onRegistrationComplete,
  onViewAthleteCard,
  onViewReceipt
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<Athlete | null>(null);
  const [hasLookedUp, setHasLookedUp] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstNameAr: '',
    lastNameAr: '',
    firstNameFr: '',
    lastNameFr: '',
    birthDate: '2009-05-15',
    birthPlace: 'ميلة',
    gender: 'ذكر' as 'ذكر' | 'أنثى',
    nationalIdNumber: '109843000456123',
    bloodGroup: 'O+' as BloodGroup,
    phone: '0661 23 45 67',
    email: '',
    address: 'حي 200 مسكن، ميلة',
    commune: 'ميلة',
    guardianName: 'أحمد (الوالد)',
    guardianPhone: '0555 88 99 00',
    photoUrl: SAMPLE_AVATARS[0],
    unitId: units[0]?.id || '',
    associationId: associations[0]?.id || '',
    discipline: 'السباحة' as SportDiscipline,
    category: 'U17 (أواسط)' as AgeCategory,
    season: '2025/2026',
    hasMedicalCertificate: true,
    medicalDoctorName: 'د. كريم بوالشعور (طبيب معتمد)',
    medicalCertDate: '2025-10-01',
    hasParentalAuthorization: true,
    hasInsurance: true,
    insuranceNumber: 'SAA-2025-MIL-TEMP',
    notes: 'طلب انخراط جديد للموسم الرياضي الحالي'
  });

  // Filter associations based on selected unit
  const filteredAssociations = associations.filter(
    a => !formData.unitId || a.unitId === formData.unitId || a.id === 'assoc-opow-academy'
  );

  const handleLookup = () => {
    if (!lookupQuery.trim()) return;
    setHasLookedUp(true);
    const athletes = storageService.getAthletes();
    const query = lookupQuery.trim().toLowerCase();
    const found = athletes.find(a => 
      a.preRegCode?.toLowerCase() === query ||
      a.registrationNumber?.toLowerCase() === query ||
      a.nationalIdNumber === query
    );
    setLookupResult(found || null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    const created = storageService.addPreRegistration({
      ...formData,
      associationId: formData.associationId || undefined
    });

    onRegistrationComplete(created);
    onViewReceipt(created);
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>بوابة التسجيل الرقمي الأولي - ولاية ميلة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-2">
            انخرط في المركبات الرياضية لولاية ميلة بخطوات بسيطة
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            تتيح هذه المنصة لجميع الرياضيين والجمعيات الرياضية التسجيل الأولي عن بعد، حجز المقعد الرياضي، واستخراج استمارة ووصل إيداع الملف للتوجه مباشرة للوحدة المعنية دون طوابير انتظار.
          </p>
        </div>

        {/* Existing file tracking box */}
        <div className="mt-6 pt-5 border-t border-emerald-500/20 flex flex-col sm:flex-row items-center gap-3">
          <span className="text-xs text-slate-300 font-semibold whitespace-nowrap">
            هل سجلت مسبقاً وتريد متابعة ملفك أو استخراج وصلك؟
          </span>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="أدخل رمز التسجيل (مثال: PRE-MIL-7801) أو رقم التعريف الوطني..."
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              className="bg-slate-900/90 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs flex-1 sm:w-72 focus:outline-hidden focus:border-emerald-500"
            />
            <button
              onClick={handleLookup}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              بحث ومتابعة
            </button>
          </div>
        </div>

        {/* Lookup Result Modal/Card */}
        {hasLookedUp && (
          <div className="mt-4 p-4 bg-slate-950/90 border border-slate-700 rounded-2xl text-xs">
            {lookupResult ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={lookupResult.photoUrl}
                    alt={lookupResult.firstNameAr}
                    className="w-12 h-14 rounded-lg object-cover border border-emerald-400"
                  />
                  <div>
                    <p className="font-bold text-white text-sm">
                      {lookupResult.firstNameAr} {lookupResult.lastNameAr} ({lookupResult.discipline})
                    </p>
                    <p className="text-emerald-400 font-mono">
                      الرمز: {lookupResult.registrationNumber || lookupResult.preRegCode}
                    </p>
                    <p className="text-slate-400">
                      الحالة:{' '}
                      <span className="font-bold text-amber-300">
                        {lookupResult.status === 'APPROVED' ? '✅ تم القبول والمصادقة على البطاقة' : '⏳ قيد دراسة الملف'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onViewReceipt(lookupResult)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition cursor-pointer"
                  >
                    عرض وصل الإيداع
                  </button>
                  {lookupResult.status === 'APPROVED' && (
                    <button
                      onClick={() => onViewAthleteCard(lookupResult)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition cursor-pointer"
                    >
                      عرض البطاقة
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-amber-400 font-medium">
                لم يتم العثور على أي ملف بهذا الرمز. يرجى التأكد من الرقم والمحاولة مجدداً.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Wizard Step Progress */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
          <button
            onClick={() => setActiveStep(1)}
            className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeStep === 1
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-900/60 flex items-center justify-center text-xs">1</span>
            <span>البيانات الشخصية</span>
          </button>

          <button
            onClick={() => setActiveStep(2)}
            className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeStep === 2
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-900/60 flex items-center justify-center text-xs">2</span>
            <span>الوحدة والتخصص الرياضي</span>
          </button>

          <button
            onClick={() => setActiveStep(3)}
            className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeStep === 3
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-900/60 flex items-center justify-center text-xs">3</span>
            <span>الملف الطبي والصورة والتأكيد</span>
          </button>
        </div>
      </div>

      {/* Form Steps */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        {/* STEP 1: Personal Details */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>الخطوة 1: المعلومات والبيانات الشخصية للرياضي</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">الاسم بالعربية *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أيمن"
                  value={formData.firstNameAr}
                  onChange={(e) => setFormData({ ...formData, firstNameAr: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">اللقب بالعربية *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: بلخيري"
                  value={formData.lastNameAr}
                  onChange={(e) => setFormData({ ...formData, lastNameAr: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Prénom en français *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Aymen"
                  value={formData.firstNameFr}
                  onChange={(e) => setFormData({ ...formData, firstNameFr: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nom en français *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Belkhiri"
                  value={formData.lastNameFr}
                  onChange={(e) => setFormData({ ...formData, lastNameFr: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">تاريخ الازدياد *</label>
                <input
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">مكان الازدياد *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ميلة أو شلغوم العيد"
                  value={formData.birthPlace}
                  onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">الجنس *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="ذكر">ذكر (Masculin)</option>
                  <option value="أنثى">أنثى (Féminin)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">فصيلة الدم *</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-amber-400 font-bold focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-300 font-semibold block mb-1">رقم التعريف الوطني البيومتري (NIN) *</label>
                <input
                  type="text"
                  required
                  placeholder="18 رقماً من بطاقة التعريف أو جواز السفر البيومتري"
                  value={formData.nationalIdNumber}
                  onChange={(e) => setFormData({ ...formData, nationalIdNumber: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">رقم الهاتف الشخصي *</label>
                <input
                  type="tel"
                  required
                  placeholder="06 / 07 / 05..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">البريد الإلكتروني (اختياري)</label>
                <input
                  type="email"
                  placeholder="athlete@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-300 font-semibold block mb-1">عنوان الإقامة الحالي *</label>
                <input
                  type="text"
                  required
                  placeholder="الحي، رقم الشارع، العمارة"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">اسم الولي الشرعي (للقصر دون 19 سنة)</label>
                <input
                  type="text"
                  placeholder="الاسم واللقب وصفة القرابة"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">هاتف الولي في حالات الطوارئ</label>
                <input
                  type="tel"
                  placeholder="هاتف الولي"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow cursor-pointer"
              >
                الانتقال للخطوة التالية: اختيار الوحدة والرياضة ←
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Unit and Sport Selection */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>الخطوة 2: الوحدة الرياضية والانتماء التنافسي</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Select Unit in Mila */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  1. اختر الوحدة أو المركب الرياضي التابع لديوان ولاية ميلة *
                </label>
                <select
                  value={formData.unitId}
                  onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-bold focus:outline-hidden focus:border-emerald-500"
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      📍 {u.name} - بلدية {u.commune}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  سيتم إيداع الملف الطبي واستخراج البطاقة من مكتب هذه الوحدة.
                </span>
              </div>

              {/* Select Discipline */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  2. التخصص والرياضة المراد ممارستها *
                </label>
                <select
                  value={formData.discipline}
                  onChange={(e) => setFormData({ ...formData, discipline: e.target.value as SportDiscipline })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-amber-300 font-bold focus:outline-hidden focus:border-emerald-500"
                >
                  {SPORT_DISCIPLINES.map((sport) => (
                    <option key={sport} value={sport}>
                      🏅 {sport}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Association or Direct Academy */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  3. الانتماء (نادي معتمد أو مدرسة ديوان ميلة المباشرة) *
                </label>
                <select
                  value={formData.associationId}
                  onChange={(e) => setFormData({ ...formData, associationId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="">-- انخراط فردي / هواة بدون نادٍ --</option>
                  {filteredAssociations.map((assoc) => (
                    <option key={assoc.id} value={assoc.id}>
                      ⚽ {assoc.name} ({assoc.shortName})
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-emerald-400 mt-1 block">
                  يمكنك الانضمام مباشرة لمدرسة ديوان OPOW أو ربط عضويتك بالنادي النشط بالوحدة.
                </span>
              </div>

              {/* Age Category */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  4. الفئة العمرية للموسم الحالي *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as AgeCategory })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="U11 (أصاغر أ)">U11 (أصاغر أ - أقل من 11 سنة)</option>
                  <option value="U13 (أصاغر ب)">U13 (أصاغر ب - 11 إلى 12 سنة)</option>
                  <option value="U15 (أشبال)">U15 (أشبال - 13 إلى 14 سنة)</option>
                  <option value="U17 (أواسط)">U17 (أواسط - 15 إلى 16 سنة)</option>
                  <option value="U19 (أواسط متقدم)">U19 (أواسط متقدم - 17 إلى 18 سنة)</option>
                  <option value="أكابر (Seniors)">أكابر (Seniors - 19 سنة فما فوق)</option>
                  <option value="مخضرمين (Vétérans)">مخضرمين (Vétérans)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                → الرجوع للخطوة السابقة
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow cursor-pointer"
              >
                الانتقال للخطوة 3: الملف الطبي والصورة ←
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Medical and Photo Upload */}
        {activeStep === 3 && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>الخطوة 3: الصورة الشمسية، الملف الطبي، وتأكيد الطلب</span>
            </h3>

            {/* Photo Selector */}
            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl">
              <label className="text-slate-200 font-bold text-xs block mb-2">
                الصورة الشمسية للرياضي (تظهر على البطاقة ورخصة الدخول) *
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-emerald-400 shadow-md bg-slate-900 shrink-0">
                  <img
                    src={formData.photoUrl}
                    alt="معاينة الصورة"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-xs text-slate-400 mb-2">
                    اختر صورة نموذجية جاهزة للتجربة الفورية، أو أدخل رابط صورتك:
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {SAMPLE_AVATARS.map((url, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setFormData({ ...formData, photoUrl: url })}
                        className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                          formData.photoUrl === url ? 'border-emerald-400 scale-105' : 'border-slate-600 opacity-60'
                        }`}
                      >
                        <img src={url} alt={`عينة ${i}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="أو أدخل رابط صورة مخصص (URL)..."
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Medical Attestation Checkbox */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-xl">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasMedicalCertificate}
                    onChange={(e) => setFormData({ ...formData, hasMedicalCertificate: e.target.checked })}
                    className="mt-1 accent-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-white block">التصريح بتوفر الشهادة الطبية *</span>
                    <span className="text-slate-400 text-[11px]">
                      أصرح بأن لدي شهادة طبية تثبت القدرة البدنية لممارسة هذه الرياضة صادرة عن طبيب مرخص وسأودعها مع الملف.
                    </span>
                  </div>
                </label>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-xl">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasParentalAuthorization}
                    onChange={(e) => setFormData({ ...formData, hasParentalAuthorization: e.target.checked })}
                    className="mt-1 accent-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-white block">موافقة الولي الشرعي والتأمين *</span>
                    <span className="text-slate-400 text-[11px]">
                      موافقة خطية من الولي الشرعي والالتزام بدفع رسوم التأمين السنوي المعتمد من ديوان OPOW.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Final Submission Notice */}
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-xs text-emerald-200">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-300 mb-1">
                <FileCheck className="w-4 h-4" />
                <span>بعد الضغط على زر تأكيد التسجيل:</span>
              </div>
              <p className="leading-relaxed">
                ستحصل فوراً على <strong>رقم التتبع المؤقت (PRE-MIL-XXXX)</strong> مع وصل إيداع الملف واستمارة التسجيل الرسمية جاهزة للطباعة والتحميل، مصحوبة بقائمة الوثائق المطلوبة للتوجه بها إلى الوحدة الرياضية المختارة.
              </p>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                → الرجوع للخطوة 2
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-xl transition shadow-xl shadow-emerald-950/60 cursor-pointer flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>تأكيد التسجيل الأولي واستخراج الوصل الآن</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

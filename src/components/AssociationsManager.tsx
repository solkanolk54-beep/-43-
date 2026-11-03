import React, { useState } from 'react';
import { Association, SportsUnit, Athlete, SportDiscipline } from '../types';
import { SPORT_DISCIPLINES } from '../data/mockData';
import { storageService } from '../services/storageService';
import { 
  Building2, 
  Plus, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Printer, 
  Award, 
  FileText, 
  Check, 
  Search,
  ChevronDown
} from 'lucide-react';

interface AssociationsManagerProps {
  associations: Association[];
  units: SportsUnit[];
  athletes: Athlete[];
  onAddAssociation: (newAssoc: Association) => void;
  onViewAthleteCard: (athlete: Athlete) => void;
}

export const AssociationsManager: React.FC<AssociationsManagerProps> = ({
  associations,
  units,
  athletes,
  onAddAssociation,
  onViewAthleteCard
}) => {
  const [selectedAssocId, setSelectedAssocId] = useState<string>(associations[0]?.id || '');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // New association form state
  const [newAssoc, setNewAssoc] = useState({
    name: '',
    shortName: '',
    licenseNumber: 'W-43/DJS/2026/',
    creationDate: '2026-01-01',
    commune: 'ميلة',
    presidentName: '',
    phone: '',
    email: '',
    unitId: units[0]?.id || '',
    disciplines: ['كرة القدم'] as SportDiscipline[],
    colorTheme: '#15803d',
    logoUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=120&q=80'
  });

  const selectedAssoc = associations.find(a => a.id === selectedAssocId) || associations[0];
  const assocAthletes = athletes.filter(a => a.associationId === selectedAssoc?.id);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssoc.name || !newAssoc.presidentName) return;

    const created = storageService.addAssociation(newAssoc);
    onAddAssociation(created);
    setSelectedAssocId(created.id);
    setShowAddModal(false);
  };

  const handlePrintRoster = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-black">
              الجمعيات والنوادي الرياضية لولاية ميلة (OPOW 43)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            إدارة الجمعيات المعتمدة، ربط الرياضيين، ومتابعة القوائم الاسمية والتراخيص الرسمية
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>اعتماد جمعية / نادٍ جديد</span>
        </button>
      </div>

      {/* Main Grid: Clubs List & Selected Club Squad */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Clubs selector */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl">
            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center justify-between">
              <span>النوادي المعتمدة ({associations.length})</span>
              <span className="text-xs text-emerald-400">موسم 2025/2026</span>
            </h3>

            <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
              {associations.map((assoc) => {
                const count = athletes.filter(a => a.associationId === assoc.id).length;
                const isSelected = assoc.id === selectedAssoc?.id;
                const unit = units.find(u => u.id === assoc.unitId);

                return (
                  <div
                    key={assoc.id}
                    onClick={() => setSelectedAssocId(assoc.id)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer text-right ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500 shadow-md shadow-emerald-950/40'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border flex items-center justify-center font-bold text-xs text-white"
                          style={{ backgroundColor: assoc.colorTheme || '#065f46' }}
                        >
                          {assoc.shortName.slice(0, 3)}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-xs sm:text-sm leading-tight">
                            {assoc.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            اعتماد: {assoc.licenseNumber}
                          </span>
                        </div>
                      </div>

                      <span className="bg-slate-900 border border-slate-700 text-emerald-400 text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0">
                        {count} رياضي
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>📍 {unit?.name || assoc.commune}</span>
                      <span className="text-amber-400 font-medium">{assoc.disciplines.join(' • ')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Selected Club Roster & Administration */}
        <div className="lg:col-span-7">
          {selectedAssoc ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
              {/* Club Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    بطاقة تعريف الجمعية الرياضية المعتمدة
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                    {selectedAssoc.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    الاعتماد الولائي: {selectedAssoc.licenseNumber} • بلدية {selectedAssoc.commune}
                  </p>
                </div>

                <button
                  onClick={handlePrintRoster}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer self-start sm:self-auto no-print"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة اللائحة الرسمية للنادي</span>
                </button>
              </div>

              {/* Committee Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px]">رئيس الجمعية:</span>
                  <span className="font-bold text-white text-xs">{selectedAssoc.presidentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">الهاتف للتواصل:</span>
                  <span className="font-mono font-semibold text-emerald-400 text-xs">{selectedAssoc.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">الوحدة الملحق بها:</span>
                  <span className="font-semibold text-white text-xs">
                    {units.find(u => u.id === selectedAssoc.unitId)?.name || 'مركب ميلة'}
                  </span>
                </div>
              </div>

              {/* Athletes Roster Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>لائحة الرياضيين المنخرطين في النادي ({assocAthletes.length})</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    الموسم الرياضي 2025/2026
                  </span>
                </div>

                {assocAthletes.length > 0 ? (
                  <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-950/80 text-slate-400 text-[11px] border-b border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3">الرياضي</th>
                          <th className="py-2.5 px-3">الرقم / الرخصة</th>
                          <th className="py-2.5 px-3">الفئة العمرية</th>
                          <th className="py-2.5 px-3">حالة الملف</th>
                          <th className="py-2.5 px-3 text-center no-print">البطاقة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {assocAthletes.map((ath) => (
                          <tr key={ath.id} className="hover:bg-slate-800/40">
                            <td className="py-2.5 px-3 font-bold text-white">
                              {ath.firstNameAr} {ath.lastNameAr}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-emerald-400 text-[11px]">
                              {ath.registrationNumber || ath.preRegCode}
                            </td>
                            <td className="py-2.5 px-3 text-slate-300">
                              {ath.category}
                            </td>
                            <td className="py-2.5 px-3">
                              {ath.status === 'APPROVED' ? (
                                <span className="text-emerald-400 font-bold text-[10px]">
                                  ✅ مصادق عليه
                                </span>
                              ) : (
                                <span className="text-amber-400 text-[10px]">
                                  ⏳ قيد المراجعة
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center no-print">
                              <button
                                onClick={() => onViewAthleteCard(ath)}
                                className="px-2 py-1 bg-slate-800 hover:bg-emerald-600 text-white rounded text-[10px] font-semibold transition cursor-pointer"
                              >
                                معاينة
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-8 text-center bg-slate-950/40 rounded-2xl border border-dashed border-slate-800 text-slate-400 text-xs">
                    لم يتم تسجيل أي رياضي في هذا النادي حتى الآن. يمكنك تسجيل الرياضيين عبر بوابة التسجيل وربطهم بهذا النادي.
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Add New Association Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full text-white space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>اعتماد وتسجيل جمعية رياضية جديدة (ولاية ميلة)</span>
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">اسم الجمعية الرياضية الكامل *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: نادي أمل بلدية ميلة"
                  value={newAssoc.name}
                  onChange={(e) => setNewAssoc({ ...newAssoc, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">الاسم المختصر (Sigle) *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: CBM Mila"
                    value={newAssoc.shortName}
                    onChange={(e) => setNewAssoc({ ...newAssoc, shortName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">رقم الاعتماد الولائي (DJS) *</label>
                  <input
                    type="text"
                    required
                    placeholder="W-43/DJS/..."
                    value={newAssoc.licenseNumber}
                    onChange={(e) => setNewAssoc({ ...newAssoc, licenseNumber: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">رئيس الجمعية *</label>
                  <input
                    type="text"
                    required
                    placeholder="الاسم واللقب"
                    value={newAssoc.presidentName}
                    onChange={(e) => setNewAssoc({ ...newAssoc, presidentName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">رقم الهاتف *</label>
                  <input
                    type="tel"
                    required
                    placeholder="05 / 06 / 07..."
                    value={newAssoc.phone}
                    onChange={(e) => setNewAssoc({ ...newAssoc, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">الوحدة الرياضية الملحق بها *</label>
                <select
                  value={newAssoc.unitId}
                  onChange={(e) => setNewAssoc({ ...newAssoc, unitId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.commune})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  حفظ واعتماد الجمعية
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

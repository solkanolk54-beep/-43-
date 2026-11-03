/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserRole, Athlete, SportsUnit, Association } from './types';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { AthletesList } from './components/AthletesList';
import { AssociationsManager } from './components/AssociationsManager';
import { UnitsManager } from './components/UnitsManager';
import { PublicRegistration } from './components/PublicRegistration';
import { AthleteCardModal } from './components/AthleteCardModal';
import { OfficialFormModal } from './components/OfficialFormModal';
import { PreRegistrationReceiptModal } from './components/PreRegistrationReceiptModal';
import { VerifyCardModal } from './components/VerifyCardModal';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('SUPER_ADMIN');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('unit-mila-central');
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Core Data
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [units, setUnits] = useState<SportsUnit[]>([]);
  const [associations, setAssociations] = useState<Association[]>([]);

  // Modals
  const [activeCardAthlete, setActiveCardAthlete] = useState<Athlete | null>(null);
  const [activeFormAthlete, setActiveFormAthlete] = useState<Athlete | null>(null);
  const [activeReceiptAthlete, setActiveReceiptAthlete] = useState<Athlete | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAthletes(storageService.getAthletes());
    setUnits(storageService.getUnits());
    setAssociations(storageService.getAssociations());
  };

  const handleResetData = () => {
    if (window.confirm('هل تريد استعادة البيانات النموذجية لديوان المركب المتعدد الرياضات لولاية ميلة؟')) {
      storageService.resetDefaults();
      loadData();
    }
  };

  const handleApproveAthlete = (athleteId: string) => {
    const approver = currentRole === 'SUPER_ADMIN' 
      ? 'مدير عام ديوان ولاية ميلة: أ. عبد الحق بن زروق'
      : 'مدير الوحدة الرياضية المعتمد';

    const updated = storageService.approveAthlete(athleteId, approver);
    if (updated) {
      loadData();
      // Directly preview the generated card
      setActiveCardAthlete(updated);
    }
  };

  const handleRejectAthlete = (athleteId: string, reason: string) => {
    storageService.rejectAthlete(athleteId, reason);
    loadData();
  };

  const handleMarkUnderReview = (athleteId: string) => {
    storageService.markUnderReview(athleteId);
    loadData();
  };

  const handleRegistrationComplete = (newAthlete: Athlete) => {
    loadData();
  };

  const handleAddAssociation = (newAssoc: Association) => {
    loadData();
  };

  const stats = storageService.getStats();

  const getAthleteUnit = (unitId?: string) => units.find(u => u.id === unitId);
  const getAthleteAssoc = (assocId?: string) => associations.find(a => a.id === assocId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Institutional Algerian Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        selectedUnitId={selectedUnitId}
        onUnitChange={setSelectedUnitId}
        units={units}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onResetData={handleResetData}
        onOpenScanner={() => setIsScannerOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'overview' && (
          <DashboardOverview
            stats={stats}
            athletes={athletes}
            units={units}
            associations={associations}
            currentRole={currentRole}
            selectedUnitId={selectedUnitId}
            onNavigateTab={setActiveTab}
            onOpenCard={setActiveCardAthlete}
            onOpenScanner={() => setIsScannerOpen(true)}
            onApproveAthlete={handleApproveAthlete}
          />
        )}

        {activeTab === 'athletes' && (
          <AthletesList
            athletes={athletes}
            units={units}
            associations={associations}
            currentRole={currentRole}
            selectedUnitId={selectedUnitId}
            onApprove={handleApproveAthlete}
            onReject={handleRejectAthlete}
            onMarkUnderReview={handleMarkUnderReview}
            onViewCard={setActiveCardAthlete}
            onViewForm={setActiveFormAthlete}
            onViewReceipt={setActiveReceiptAthlete}
            onNewRegistrationClick={() => setActiveTab('register')}
          />
        )}

        {activeTab === 'associations' && (
          <AssociationsManager
            associations={associations}
            units={units}
            athletes={athletes}
            onAddAssociation={handleAddAssociation}
            onViewAthleteCard={setActiveCardAthlete}
          />
        )}

        {activeTab === 'units' && (
          <UnitsManager
            units={units}
            athletes={athletes}
            associations={associations}
            onSelectUnit={setSelectedUnitId}
            onFilterUnitAthletes={(unitId) => {
              setSelectedUnitId(unitId);
              setActiveTab('athletes');
            }}
          />
        )}

        {activeTab === 'register' && (
          <PublicRegistration
            units={units}
            associations={associations}
            onRegistrationComplete={handleRegistrationComplete}
            onViewAthleteCard={setActiveCardAthlete}
            onViewReceipt={setActiveReceiptAthlete}
          />
        )}
      </main>

      {/* Footer (Hidden when printing official documents) */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-6 px-4 no-print mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-xs">
              43
            </div>
            <div>
              <p className="font-bold text-white">ديوان المركب المتعدد الرياضات لولاية ميلة (OPOW Mila)</p>
              <p className="text-[11px] text-slate-400">تحت وصاية مديرية الشباب والرياضة - وزارة الشباب والرياضة الجزائرية</p>
            </div>
          </div>
          <div className="text-center sm:text-left text-[11px] text-slate-400">
            <p>المنصة الرسمية الموحدة لتسيير البطاقات الرياضية والتسجيل الإلكتروني © 2025 - 2026</p>
            <p className="text-emerald-400">ميلة • شلغوم العيد • تاجنانت • فرجيوة • قرارم قوقة • التلاغمة • وادي العثمانية</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {/* 1. Athlete Card Badge Modal */}
      {activeCardAthlete && (
        <AthleteCardModal
          athlete={activeCardAthlete}
          unit={getAthleteUnit(activeCardAthlete.unitId)}
          association={getAthleteAssoc(activeCardAthlete.associationId)}
          onClose={() => setActiveCardAthlete(null)}
        />
      )}

      {/* 2. Official Registration Form Modal (A4 Sheet) */}
      {activeFormAthlete && (
        <OfficialFormModal
          athlete={activeFormAthlete}
          unit={getAthleteUnit(activeFormAthlete.unitId)}
          association={getAthleteAssoc(activeFormAthlete.associationId)}
          onClose={() => setActiveFormAthlete(null)}
        />
      )}

      {/* 3. Pre-registration Receipt Modal */}
      {activeReceiptAthlete && (
        <PreRegistrationReceiptModal
          athlete={activeReceiptAthlete}
          unit={getAthleteUnit(activeReceiptAthlete.unitId)}
          onClose={() => setActiveReceiptAthlete(null)}
        />
      )}

      {/* 4. QR Scanner and Card Verification Tool */}
      {isScannerOpen && (
        <VerifyCardModal
          athletes={athletes}
          units={units}
          associations={associations}
          onClose={() => setIsScannerOpen(false)}
          onOpenCard={(ath) => {
            setIsScannerOpen(false);
            setActiveCardAthlete(ath);
          }}
        />
      )}
    </div>
  );
}

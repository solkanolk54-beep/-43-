import { Athlete, Association, SportsUnit, RegistrationStatus, RegistrationStats } from '../types';
import { INITIAL_ATHLETES, INITIAL_ASSOCIATIONS, INITIAL_UNITS } from '../data/mockData';

const ATHLETES_KEY = 'opow_mila_athletes_v1';
const ASSOCIATIONS_KEY = 'opow_mila_associations_v1';
const UNITS_KEY = 'opow_mila_units_v1';

export const storageService = {
  getAthletes(): Athlete[] {
    try {
      const data = localStorage.getItem(ATHLETES_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error reading athletes from localStorage', e);
    }
    this.saveAthletes(INITIAL_ATHLETES);
    return INITIAL_ATHLETES;
  },

  saveAthletes(athletes: Athlete[]): void {
    try {
      localStorage.setItem(ATHLETES_KEY, JSON.stringify(athletes));
    } catch (e) {
      console.error('Error saving athletes to localStorage', e);
    }
  },

  getAssociations(): Association[] {
    try {
      const data = localStorage.getItem(ASSOCIATIONS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error reading associations from localStorage', e);
    }
    this.saveAssociations(INITIAL_ASSOCIATIONS);
    return INITIAL_ASSOCIATIONS;
  },

  saveAssociations(associations: Association[]): void {
    try {
      localStorage.setItem(ASSOCIATIONS_KEY, JSON.stringify(associations));
    } catch (e) {
      console.error('Error saving associations to localStorage', e);
    }
  },

  getUnits(): SportsUnit[] {
    try {
      const data = localStorage.getItem(UNITS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error reading units from localStorage', e);
    }
    this.saveUnits(INITIAL_UNITS);
    return INITIAL_UNITS;
  },

  saveUnits(units: SportsUnit[]): void {
    try {
      localStorage.setItem(UNITS_KEY, JSON.stringify(units));
    } catch (e) {
      console.error('Error saving units to localStorage', e);
    }
  },

  generatePreRegCode(unitCode: string): string {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `PRE-${unitCode}-${random}`;
  },

  generateUniqueRegistrationNumber(unitCode: string): string {
    const athletes = this.getAthletes();
    const currentYear = new Date().getFullYear();
    // Count existing approved athletes
    const count = athletes.filter(a => a.registrationNumber).length + 1;
    const padded = String(count).padStart(5, '0');
    return `OPOW-43-${currentYear}-${unitCode}-${padded}`;
  },

  addPreRegistration(athleteData: Omit<Athlete, 'id' | 'registrationNumber' | 'preRegCode' | 'status' | 'submissionDate' | 'qrPayload'>): Athlete {
    const athletes = this.getAthletes();
    const units = this.getUnits();
    const unit = units.find(u => u.id === athleteData.unitId);
    const unitCode = unit?.code || 'MIL';

    const preRegCode = this.generatePreRegCode(unitCode);
    const newAthlete: Athlete = {
      ...athleteData,
      id: 'ath_' + Date.now(),
      registrationNumber: '',
      preRegCode,
      status: 'PRE_REGISTERED',
      submissionDate: new Date().toISOString().split('T')[0],
      qrPayload: `https://opow-mila.dz/verify?preReg=${preRegCode}&natId=${athleteData.nationalIdNumber}&status=PRE_REG`
    };

    const updated = [newAthlete, ...athletes];
    this.saveAthletes(updated);

    // Update association members count if linked
    if (newAthlete.associationId) {
      this.incrementAssociationCount(newAthlete.associationId);
    }

    return newAthlete;
  },

  approveAthlete(athleteId: string, approverName: string): Athlete | null {
    const athletes = this.getAthletes();
    const units = this.getUnits();
    const index = athletes.findIndex(a => a.id === athleteId);
    if (index === -1) return null;

    const current = athletes[index];
    const unit = units.find(u => u.id === current.unitId);
    const unitCode = unit?.code || 'MIL';

    // If already has reg number, keep it, otherwise generate new unique ID
    const regNumber = current.registrationNumber || this.generateUniqueRegistrationNumber(unitCode);
    const today = new Date().toISOString().split('T')[0];

    const updatedAthlete: Athlete = {
      ...current,
      registrationNumber: regNumber,
      status: 'APPROVED',
      approvalDate: today,
      approvedBy: approverName,
      qrPayload: `https://opow-mila.dz/verify?reg=${regNumber}&natId=${current.nationalIdNumber}&unit=${unitCode}&status=VALID&date=${today}`
    };

    athletes[index] = updatedAthlete;
    this.saveAthletes(athletes);
    return updatedAthlete;
  },

  rejectAthlete(athleteId: string, reason: string): Athlete | null {
    const athletes = this.getAthletes();
    const index = athletes.findIndex(a => a.id === athleteId);
    if (index === -1) return null;

    const updatedAthlete: Athlete = {
      ...athletes[index],
      status: 'REJECTED',
      rejectionReason: reason
    };

    athletes[index] = updatedAthlete;
    this.saveAthletes(athletes);
    return updatedAthlete;
  },

  markUnderReview(athleteId: string): Athlete | null {
    const athletes = this.getAthletes();
    const index = athletes.findIndex(a => a.id === athleteId);
    if (index === -1) return null;

    const updatedAthlete: Athlete = {
      ...athletes[index],
      status: 'UNDER_REVIEW'
    };

    athletes[index] = updatedAthlete;
    this.saveAthletes(athletes);
    return updatedAthlete;
  },

  incrementAssociationCount(assocId: string): void {
    const assocs = this.getAssociations();
    const index = assocs.findIndex(a => a.id === assocId);
    if (index !== -1) {
      assocs[index].membersCount = (assocs[index].membersCount || 0) + 1;
      this.saveAssociations(assocs);
    }
  },

  addAssociation(assocData: Omit<Association, 'id' | 'membersCount'>): Association {
    const assocs = this.getAssociations();
    const newAssoc: Association = {
      ...assocData,
      id: 'assoc_' + Date.now(),
      membersCount: 0
    };
    const updated = [...assocs, newAssoc];
    this.saveAssociations(updated);
    return newAssoc;
  },

  getStats(): RegistrationStats {
    const athletes = this.getAthletes();
    const associations = this.getAssociations();
    const units = this.getUnits();

    const athletesByDiscipline: Record<string, number> = {};
    athletes.forEach(a => {
      athletesByDiscipline[a.discipline] = (athletesByDiscipline[a.discipline] || 0) + 1;
    });

    return {
      totalAthletes: athletes.length,
      approvedCount: athletes.filter(a => a.status === 'APPROVED').length,
      pendingCount: athletes.filter(a => a.status === 'PRE_REGISTERED' || a.status === 'UNDER_REVIEW').length,
      rejectedCount: athletes.filter(a => a.status === 'REJECTED').length,
      totalAssociations: associations.length,
      totalUnits: units.length,
      athletesByDiscipline
    };
  },

  resetDefaults(): void {
    localStorage.removeItem(ATHLETES_KEY);
    localStorage.removeItem(ASSOCIATIONS_KEY);
    localStorage.removeItem(UNITS_KEY);
    this.saveAthletes(INITIAL_ATHLETES);
    this.saveAssociations(INITIAL_ASSOCIATIONS);
    this.saveUnits(INITIAL_UNITS);
  }
};

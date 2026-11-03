export type UserRole = 'SUPER_ADMIN' | 'UNIT_MANAGER' | 'CLUB_MANAGER' | 'ATHLETE_PORTAL';

export type SportDiscipline = 
  | 'كرة القدم'
  | 'كرة اليد'
  | 'كرة السلة'
  | 'الكرة الطائرة'
  | 'السباحة'
  | 'الجودو'
  | 'الكاراتيه دُو'
  | 'التايكوندو'
  | 'ألعاب القوى'
  | 'الملاكمة'
  | 'رفع الأثقال'
  | 'تنس الطاولة'
  | 'الشطرنج'
  | 'الجمباز';

export type AgeCategory = 'U11 (أصاغر أ)' | 'U13 (أصاغر ب)' | 'U15 (أشبال)' | 'U17 (أواسط)' | 'U19 (أواسط متقدم)' | 'أكابر (Seniors)' | 'مخضرمين (Vétérans)';

export type RegistrationStatus = 'PRE_REGISTERED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface SportsUnit {
  id: string;
  name: string;
  code: string;
  commune: string;
  directorName: string;
  phone: string;
  email: string;
  address: string;
  facilities: string[];
  capacity: number;
  activeAthletesCount: number;
  imageUrl?: string;
}

export interface Association {
  id: string;
  name: string;
  shortName: string;
  licenseNumber: string; // رقم الاعتماد الولائي
  creationDate: string;
  commune: string;
  presidentName: string;
  phone: string;
  email: string;
  unitId: string; // الوحدة الرياضية الرئيسية الملحق بها
  disciplines: SportDiscipline[];
  colorTheme: string;
  membersCount: number;
  logoUrl?: string;
}

export interface Athlete {
  id: string; // System ID
  registrationNumber: string; // Unique permanent license number: e.g. OPOW-43-2026-MIL-00102
  preRegCode: string; // Temporary pre-registration code: e.g. PRE-MIL-8921
  firstNameAr: string;
  lastNameAr: string;
  firstNameFr: string;
  lastNameFr: string;
  birthDate: string;
  birthPlace: string;
  gender: 'ذكر' | 'أنثى';
  nationalIdNumber: string;
  bloodGroup: BloodGroup;
  phone: string;
  email?: string;
  address: string;
  commune: string;
  guardianName?: string; // For minors
  guardianPhone?: string;
  photoUrl: string;
  
  // Sports details
  unitId: string;
  associationId?: string; // Null if individual or OPOW direct academy
  discipline: SportDiscipline;
  category: AgeCategory;
  season: string; // e.g. "2025/2026"

  // Medical & File status
  hasMedicalCertificate: boolean;
  medicalDoctorName?: string;
  medicalCertDate?: string;
  hasParentalAuthorization?: boolean;
  hasInsurance: boolean;
  insuranceNumber?: string;
  
  // Workflow
  status: RegistrationStatus;
  submissionDate: string;
  approvalDate?: string;
  approvedBy?: string;
  notes?: string;
  rejectionReason?: string;
  qrPayload: string;
}

export interface RegistrationStats {
  totalAthletes: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  totalAssociations: number;
  totalUnits: number;
  athletesByDiscipline: Record<string, number>;
}

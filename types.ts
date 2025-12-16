export interface Job {
  id: string; // generated ID used for mapping
  company: string;
  position: string;
  postingLink: string;
  applied: 'yes' | 'no';
  dateApplied: string;
  datePosted: string;
  response: string;
  predictedPay: string;
  salaryBenefits: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  notes: string;
}

export interface SheetRow {
  company: string;
  position: string;
  posting: string;
  applied: string;
  date_applied: string;
  response: string;
  predicted_pay: string;
  salary_benefits: string;
  other: string;
  employment_type: string;
  date_posted: string;
}

export type ViewState = 'LIST' | 'DETAIL';
import { Job } from './types';

// Configuration - Update this URL if Google Script changes
export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxK004p_RekpRCKsqCaFjnqYPSEjQjmH6KhgGz0zRpavbxMXgEPKnN5KFq5SK9tV9XM/exec';

// Single Cozy Image
export const DEFAULT_JOB_IMAGE = 'https://i.ibb.co/JwyPrcF5/c01c43422cde952dd3ced914dfb14aba.jpg';

export const MOCK_JOBS: Job[] = [
  {
    id: 'cozy-corp-chief-nap-officer',
    company: 'Cozy Corp',
    position: 'Chief Nap Officer',
    employmentType: 'Full-time',
    datePosted: '2023-10-25',
    applied: 'no',
    dateApplied: '',
    response: '',
    postingLink: '#',
    predictedPay: '$25/hr',
    salaryBenefits: 'Unlimited yarn',
    notes: 'Seems perfect.'
  }
];
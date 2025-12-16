import { Job } from './types';

// Configuration - Update this URL if Google Script changes
export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxK004p_RekpRCKsqCaFjnqYPSEjQjmH6KhgGz0zRpavbxMXgEPKnN5KFq5SK9tV9XM/exec';

// Single Cozy Image
// NOTE: You must download the image and save it to /assets/cozy-cat.jpg in your public folder
export const DEFAULT_JOB_IMAGE = '/assets/cozy-cat.jpg';

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
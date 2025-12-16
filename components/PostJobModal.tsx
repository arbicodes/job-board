import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Job } from '../types';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: Partial<Job>) => void;
  loading: boolean;
  initialData?: Job | null;
}

const PostJobModal: React.FC<PostJobModalProps> = ({ 
  isOpen, onClose, onSubmit, loading, initialData 
}) => {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    postingLink: '',
    predictedPay: '',
    salaryBenefits: '',
    employmentType: 'Full-time' as Job['employmentType'],
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          company: initialData.company,
          position: initialData.position,
          postingLink: initialData.postingLink,
          predictedPay: initialData.predictedPay,
          salaryBenefits: initialData.salaryBenefits,
          employmentType: initialData.employmentType,
          notes: initialData.notes
        });
      } else {
        // Reset if no initial data
        setFormData({
          company: '',
          position: '',
          postingLink: '',
          predictedPay: '',
          salaryBenefits: '',
          employmentType: 'Full-time',
          notes: ''
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300 transition-colors">
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
              {initialData ? 'Edit Job' : 'Post a new job'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
              <X className="w-6 h-6 text-stone-500 dark:text-stone-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wide">Company Name *</label>
                <input
                  required
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 outline-none dark:text-white"
                  placeholder="e.g. Cozy Corp"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wide">Position Title *</label>
                <input
                  required
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 outline-none dark:text-white"
                  placeholder="e.g. Happiness Manager"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wide">Job Posting Link</label>
              <input
                type="url"
                name="postingLink"
                value={formData.postingLink}
                onChange={handleChange}
                className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 outline-none dark:text-white"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wide">Employment Type</label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 outline-none dark:text-white"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wide">Pay Rate</label>
                <input
                  name="predictedPay"
                  value={formData.predictedPay}
                  onChange={handleChange}
                  className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 outline-none dark:text-white"
                  placeholder="e.g. $50/hr"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wide">Benefits</label>
                <textarea
                  name="salaryBenefits"
                  value={formData.salaryBenefits}
                  onChange={handleChange}
                  rows={5}
                  className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 outline-none resize-none dark:text-white"
                  placeholder="e.g. Health, Dental, 401k..."
                />
                <p className="text-xs text-stone-400">Will be automatically formatted for the spreadsheet.</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wide">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 outline-none resize-none dark:text-white"
                placeholder="Any vibes or thoughts..."
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl border border-stone-200 dark:border-stone-700 font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 font-bold hover:bg-stone-700 dark:hover:bg-white/90 transition-colors shadow-lg shadow-stone-200 dark:shadow-none"
              >
                {loading ? 'Saving...' : (initialData ? 'Update Job' : 'Post Job')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJobModal;
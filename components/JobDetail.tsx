import React, { useState } from 'react';
import { Job } from '../types';
import { DEFAULT_JOB_IMAGE } from '../constants';
import { ArrowLeft, ExternalLink, Calendar, DollarSign, Gift, Briefcase, FileText, CheckCircle, Sparkles, PenLine, Save, X, Clock, Mail, Ghost, PartyPopper } from 'lucide-react';

interface JobDetailProps {
  job: Job;
  onBack: () => void;
  onSendToSpreadsheet: (job: Job) => void;
  onUpdate: (job: Job) => void;
  loading: boolean;
}

const JobDetail: React.FC<JobDetailProps> = ({ job, onBack, onSendToSpreadsheet, onUpdate, loading }) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [noteContent, setNoteContent] = useState(job.notes || '');

  const handleSaveNotes = () => {
    const updatedJob = { ...job, notes: noteContent };
    onUpdate(updatedJob);
    setIsEditingNotes(false);
  };

  // Helper to determine status styling and icon
  const getApplicationBadge = () => {
    if (job.applied === 'yes') {
      return (
        <span className="inline-flex items-center gap-2 bg-cozy-sage text-cozy-sageDark dark:bg-emerald-900/25 dark:text-emerald-200 dark:border dark:border-emerald-800/50 px-5 py-2 rounded-full text-sm font-bold shadow-sm dark:shadow-none whitespace-nowrap">
          <CheckCircle className="w-4 h-4" /> Applied
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-2 bg-cozy-peach text-cozy-peachDark dark:bg-orange-900/20 dark:text-orange-200 dark:border dark:border-orange-800/50 px-5 py-2 rounded-full text-sm font-bold shadow-sm dark:shadow-none whitespace-nowrap">
        <Sparkles className="w-4 h-4" /> Ready to Apply
      </span>
    );
  };

  const getResponseBadge = () => {
    if (job.applied !== 'yes') return null;

    const responseLabel = (job.response || '').trim() || 'WAITING T-T';
    const response = responseLabel.toLowerCase();

    if (response.includes('waiting')) {
      return (
        <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 dark:bg-amber-900/25 dark:text-amber-200 dark:border dark:border-amber-800/50 px-5 py-2 rounded-full text-sm font-bold shadow-sm dark:shadow-none whitespace-nowrap">
          <Clock className="w-4 h-4" /> {responseLabel}
        </span>
      );
    }
    
    if (response.includes('confirmation')) {
      return (
        <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 dark:bg-purple-900/25 dark:text-purple-200 dark:border dark:border-purple-800/50 px-5 py-2 rounded-full text-sm font-bold shadow-sm dark:shadow-none whitespace-nowrap">
          <Mail className="w-4 h-4" /> {responseLabel}
        </span>
      );
    }

    if (response.includes('rejection')) {
      return (
        <span className="inline-flex items-center gap-2 bg-rose-100 text-rose-800 dark:bg-rose-900/25 dark:text-rose-200 dark:border dark:border-rose-800/50 px-5 py-2 rounded-full text-sm font-bold shadow-sm dark:shadow-none whitespace-nowrap">
          <Ghost className="w-4 h-4" /> {responseLabel}
        </span>
      );
    }

    if (response.includes('interview')) {
      return (
        <span className="inline-flex items-center gap-2 bg-sky-100 text-sky-800 dark:bg-sky-900/25 dark:text-sky-200 dark:border dark:border-sky-800/50 px-5 py-2 rounded-full text-sm font-bold shadow-sm dark:shadow-none whitespace-nowrap">
          <Calendar className="w-4 h-4" /> {responseLabel}
        </span>
      );
    }

    if (response.includes('acceptance')) {
      return (
        <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/25 dark:text-emerald-200 dark:border dark:border-emerald-800/50 px-5 py-2 rounded-full text-sm font-bold shadow-sm dark:shadow-none whitespace-nowrap">
          <PartyPopper className="w-4 h-4" /> {responseLabel}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-2 bg-stone-100 text-stone-700 dark:bg-stone-800/60 dark:text-stone-200 dark:border dark:border-stone-700 px-5 py-2 rounded-full text-sm font-bold shadow-sm dark:shadow-none whitespace-nowrap">
        {responseLabel}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-cozy-card dark:border-cozy-border rounded-[2rem] shadow-soft dark:shadow-none border border-cozy-clay/20 overflow-hidden min-h-[80vh] flex flex-col transition-colors duration-300">
      {/* New Clean Hero Header */}
      <div className="bg-cozy-paper dark:bg-stone-800/30 p-8 sm:p-12 relative flex flex-col items-center justify-center text-center border-b border-cozy-clay/10 dark:border-stone-800 transition-colors duration-300">
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 bg-white dark:bg-stone-800 p-3 rounded-full hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors shadow-sm dark:shadow-none border border-stone-100 dark:border-stone-700 group"
        >
          <ArrowLeft className="w-6 h-6 text-stone-400 dark:text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-200" />
        </button>

        {/* Hero Image - Full Size, Centered */}
        <div className="mb-6 w-full max-w-sm relative">
           <img 
             src={DEFAULT_JOB_IMAGE} 
             alt="Cozy Cat" 
             className="w-64 h-64 sm:w-80 sm:h-80 mx-auto object-contain drop-shadow-xl dark:drop-shadow-none hover:scale-105 transition-transform duration-700 ease-out"
           />
        </div>

        {/* Title & Company */}
        <h1 className="text-3xl sm:text-5xl font-bold text-stone-800 dark:text-stone-200 mb-2 font-hand">{job.position}</h1>
        <h2 className="text-xl sm:text-2xl text-stone-500 dark:text-stone-400 font-bold tracking-wide uppercase text-xs">{job.company}</h2>

        {/* Status Badge */}
        <div className="mt-6 flex items-center justify-center gap-3 flex-nowrap overflow-hidden max-w-full">
          {getApplicationBadge()}
          {getResponseBadge()}
        </div>
      </div>

      {/* Content */}
      <div className="p-8 sm:p-12 flex flex-col flex-1 bg-cozy-card">
        
        {/* Action Row */}
        <div className="flex justify-end mb-10">
           <a 
            href={job.postingLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-cozy-paper dark:bg-stone-800/40 hover:bg-white dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 px-8 py-4 rounded-2xl font-bold shadow-soft dark:shadow-none hover:shadow-lg dark:hover:shadow-none transition-all flex items-center gap-2 transform hover:-translate-y-1 border border-cozy-border/70 dark:border-cozy-border"
          >
            <span>APPLY NOW</span>
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-12">
          
          <div className="space-y-8">
            <div className="flex items-center gap-4 text-stone-600 dark:text-stone-300 group">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-stone-800 group-hover:bg-orange-100 dark:group-hover:bg-stone-700 transition-colors flex items-center justify-center text-orange-400 dark:text-stone-400 shadow-sm dark:shadow-none border border-orange-100 dark:border-stone-700">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-stone-400 dark:text-stone-500 uppercase font-bold tracking-wide mb-1">Employment Type</p>
                <p className="text-lg font-bold text-stone-700 dark:text-stone-200 font-hand text-2xl">{job.employmentType}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-stone-600 dark:text-stone-300 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-stone-800 group-hover:bg-amber-100 dark:group-hover:bg-stone-700 transition-colors flex items-center justify-center text-amber-500 dark:text-stone-400 shadow-sm dark:shadow-none border border-amber-100 dark:border-stone-700">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-stone-400 dark:text-stone-500 uppercase font-bold tracking-wide mb-1">Date Applied</p>
                <p className="text-lg font-bold text-stone-700 dark:text-stone-200 font-hand text-2xl">{job.dateApplied || 'Not applied yet'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-stone-600 dark:text-stone-300 group">
              <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-stone-800 group-hover:bg-green-100 dark:group-hover:bg-stone-700 transition-colors flex items-center justify-center text-green-500 dark:text-stone-400 shadow-sm dark:shadow-none border border-green-100 dark:border-stone-700">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-stone-400 dark:text-stone-500 uppercase font-bold tracking-wide mb-1">Pay Rate</p>
                <p className="text-lg font-bold text-stone-700 dark:text-stone-200 font-hand text-2xl">{job.predictedPay || 'Not listed'}</p>
              </div>
            </div>

            
          </div>

          <div className="space-y-8">
             <div className="flex items-start gap-4 text-stone-600 dark:text-stone-300 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-stone-800 group-hover:bg-purple-100 dark:group-hover:bg-stone-700 transition-colors flex items-center justify-center text-purple-400 dark:text-stone-400 flex-shrink-0 shadow-sm dark:shadow-none border border-purple-100 dark:border-stone-700">
                <Gift className="w-6 h-6" />
              </div>
              <div className="w-full">
                <p className="text-xs text-stone-400 dark:text-stone-500 uppercase font-bold tracking-wide mb-1">Benefits</p>
                <p className="text-lg font-medium leading-relaxed font-hand text-xl whitespace-pre-wrap">{job.salaryBenefits || 'None listed'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-stone-600 dark:text-stone-300 group relative">
              <div className="w-12 h-12 rounded-2xl bg-yellow-50 dark:bg-stone-800 group-hover:bg-yellow-100 dark:group-hover:bg-stone-700 transition-colors flex items-center justify-center text-yellow-500 dark:text-stone-400 flex-shrink-0 shadow-sm dark:shadow-none border border-yellow-100 dark:border-stone-700">
                <FileText className="w-6 h-6" />
              </div>
              <div className="w-full">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-stone-400 dark:text-stone-500 uppercase font-bold tracking-wide">Notes</p>
                  {!isEditingNotes && (
                    <button 
                      onClick={() => setIsEditingNotes(true)}
                      className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                      title="Edit notes"
                    >
                      <PenLine className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {isEditingNotes ? (
                  <div className="mt-2 animate-in fade-in zoom-in-95 duration-200">
                    <textarea 
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="w-full p-3 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none resize-none font-hand text-xl text-stone-700 dark:text-stone-200"
                      rows={4}
                      placeholder="Add your cozy notes here..."
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2 justify-end">
                      <button 
                        onClick={() => {
                          setIsEditingNotes(false);
                          setNoteContent(job.notes || '');
                        }}
                        className="px-3 py-1.5 rounded-lg text-sm font-bold text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                      <button 
                        onClick={handleSaveNotes}
                        className="px-4 py-1.5 rounded-lg text-sm font-bold bg-yellow-100 dark:bg-stone-700 text-yellow-700 dark:text-stone-300 hover:bg-yellow-200 dark:hover:bg-stone-600 flex items-center gap-1"
                      >
                        <Save className="w-4 h-4" /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-lg font-medium leading-relaxed font-hand text-xl whitespace-pre-wrap">{job.notes || 'No extra notes.'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto border-t border-stone-100 dark:border-stone-800 pt-8 flex flex-col sm:flex-row items-center justify-end gap-4">
          <button
            onClick={() => onSendToSpreadsheet(job)}
            disabled={loading || job.applied === 'yes'}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md dark:shadow-none ${
              job.applied === 'yes' 
                ? 'bg-stone-50 dark:bg-stone-800 text-stone-300 dark:text-stone-600 cursor-not-allowed border border-stone-100 dark:border-stone-800'
                : 'bg-cozy-sage/60 dark:bg-stone-800/40 text-cozy-sageDark dark:text-stone-200 hover:bg-cozy-sage/80 dark:hover:bg-stone-700 hover:shadow-lg dark:hover:shadow-none hover:-translate-y-1 border border-cozy-border/70 dark:border-cozy-border'
            }`}
          >
            {loading ? 'Updating...' : (
              <>
                <span>{job.applied === 'yes' ? 'Already Applied' : 'MARK AS APPLIED'}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default JobDetail;
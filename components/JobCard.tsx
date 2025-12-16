import React, { useState, useRef, useEffect } from 'react';
import { Job } from '../types';
import { DEFAULT_JOB_IMAGE } from '../constants';
import { Clock, Sparkles, MoreHorizontal, Edit2, Trash2, Mail, PartyPopper, Calendar, Ghost, CheckCircle } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onClick: () => void;
  onEdit: (e: React.MouseEvent, job: Job) => void;
  onDelete: (e: React.MouseEvent, job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  // Helper to determine status styling and icon
  const getApplicationBadge = () => {
    if (job.applied === 'yes') {
      return (
        <span className="bg-cozy-sage/60 text-cozy-sageDark dark:bg-emerald-900/25 dark:text-emerald-200 dark:border dark:border-emerald-800/50 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm dark:shadow-none whitespace-nowrap">
          <CheckCircle className="w-3.5 h-3.5" /> Applied
        </span>
      );
    }

    return (
      <span className="bg-cozy-peach/50 text-cozy-peachDark dark:bg-orange-900/20 dark:text-orange-200 dark:border dark:border-orange-800/50 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm dark:shadow-none whitespace-nowrap">
        <Sparkles className="w-3.5 h-3.5 text-orange-400 dark:text-orange-200" /> Ready to Apply
      </span>
    );
  };

  const getResponseBadge = () => {
    if (job.applied !== 'yes') return null;

    const responseLabel = (job.response || '').trim() || 'WAITING T-T';
    const response = responseLabel.toLowerCase();

    if (response.includes('waiting')) {
      return (
        <span title={responseLabel} className="bg-amber-100 text-amber-800 dark:bg-amber-900/25 dark:text-amber-200 dark:border dark:border-amber-800/50 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm dark:shadow-none whitespace-nowrap min-w-0">
          <Clock className="w-3.5 h-3.5" /> {responseLabel}
        </span>
      );
    }

    if (response.includes('confirmation')) {
      return (
        <span title={responseLabel} className="bg-purple-100 text-purple-800 dark:bg-purple-900/25 dark:text-purple-200 dark:border dark:border-purple-800/50 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm dark:shadow-none whitespace-nowrap min-w-0">
          <Mail className="w-3.5 h-3.5" /> {responseLabel}
        </span>
      );
    }

    if (response.includes('rejection')) {
      return (
        <span title={responseLabel} className="bg-rose-100 text-rose-800 dark:bg-rose-900/25 dark:text-rose-200 dark:border dark:border-rose-800/50 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm dark:shadow-none whitespace-nowrap min-w-0">
          <Ghost className="w-3.5 h-3.5" /> {responseLabel}
        </span>
      );
    }

    if (response.includes('interview')) {
      return (
        <span title={responseLabel} className="bg-sky-100 text-sky-800 dark:bg-sky-900/25 dark:text-sky-200 dark:border dark:border-sky-800/50 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm dark:shadow-none whitespace-nowrap min-w-0">
          <Calendar className="w-3.5 h-3.5" /> {responseLabel}
        </span>
      );
    }

    if (response.includes('acceptance')) {
      return (
        <span title={responseLabel} className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/25 dark:text-emerald-200 dark:border dark:border-emerald-800/50 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm dark:shadow-none whitespace-nowrap min-w-0">
          <PartyPopper className="w-3.5 h-3.5" /> {responseLabel}
        </span>
      );
    }

    return (
      <span title={responseLabel} className="bg-stone-100 text-stone-700 dark:bg-stone-800/60 dark:text-stone-200 dark:border dark:border-stone-700 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm dark:shadow-none whitespace-nowrap min-w-0">
        {responseLabel}
      </span>
    );
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-cozy-card p-6 rounded-3xl shadow-soft dark:shadow-none border border-cozy-clay/20 dark:border-cozy-border hover:shadow-lg dark:hover:border-stone-600 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col sm:flex-row gap-6 items-start sm:items-center relative"
    >
      {/* Menu Button */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={toggleMenu}
          className="p-2 text-stone-300 dark:text-stone-600 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
        
        {/* Dropdown Menu */}
        {showMenu && (
          <div ref={menuRef} className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-stone-800 rounded-2xl shadow-xl dark:shadow-none dark:border dark:border-stone-700 border border-stone-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={(e) => {
                onEdit(e, job);
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-3 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" /> Edit Job
            </button>
            <button 
              onClick={(e) => {
                onDelete(e, job);
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-3 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Static Cozy Image */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-cozy-bg flex-shrink-0 border-4 border-white dark:border-stone-800 shadow-sm dark:shadow-none group-hover:scale-105 transition-transform duration-500">
        <img src={DEFAULT_JOB_IMAGE} alt="Cozy Cat" className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 w-full pr-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
          <div>
            <h3 className="text-cozy-primary text-xs font-bold uppercase tracking-widest mb-1">{job.company}</h3>
            <h2 className="text-xl sm:text-2xl font-bold text-cozy-text group-hover:text-stone-900 dark:group-hover:text-stone-200 font-sans">{job.position}</h2>
          </div>
          <div className="flex items-center gap-2 flex-nowrap overflow-hidden max-w-full">
            {getApplicationBadge()}
            <span className="min-w-0 max-w-[12rem] sm:max-w-[16rem] truncate">{getResponseBadge()}</span>
          </div>
        </div>
        
        <div className="h-px w-full bg-gradient-to-r from-stone-100 dark:from-stone-800 to-transparent my-3" />

        <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500 dark:text-stone-400 mt-2">
          <div className="flex items-center gap-1.5 text-stone-400 dark:text-stone-500">
            <Clock className="w-4 h-4" />
            <span>{job.employmentType}</span>
          </div>

          {job.dateApplied ? (
            <>
              <span className="hidden sm:inline text-stone-300 dark:text-stone-600">•</span>
              <div className="flex items-center gap-1.5 text-stone-400 dark:text-stone-500 font-hand text-lg">
                <Calendar className="w-4 h-4" />
                <span>Applied {job.dateApplied}</span>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
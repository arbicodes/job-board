import React, { useState, useEffect } from 'react';
import { Job, ViewState } from './types';
import { GOOGLE_SCRIPT_URL } from './constants';
import { fetchJobsFromSheet, postJobToSheet, updateJobInSheet, deleteJobFromSheet, generateJobId, formatBenefitsForSheet } from './services/sheets.ts';
import { todayMMDDYY, parseMMDDYYToTime } from './utils/date';
import Sidebar from './components/Sidebar';
import JobCard from './components/JobCard';
import JobDetail from './components/JobDetail';
import PostJobModal from './components/PostJobModal';
import CatWalkOverlay from './components/CatWalkOverlay';
import { RefreshCw, PenTool, Moon, Sun, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [view, setView] = useState<ViewState>('LIST');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'APPLIED' | 'NOT_APPLIED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  
  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('cozy_dark_mode') === 'true';
  });
  
  // State for editing
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success');

  // Dark Mode Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('cozy_dark_mode', darkMode.toString());
  }, [darkMode]);

  // Initial Job Load
  useEffect(() => {
    loadJobs();
  }, []);

  const refreshJobsFromSheet = async () => {
    const fetchedJobs = await fetchJobsFromSheet(GOOGLE_SCRIPT_URL);
    setJobs(fetchedJobs);
  };

  const sleep = (ms: number) => new Promise(resolve => window.setTimeout(resolve, ms));

  const refreshJobsUntilJobPresent = async (jobId: string) => {
    for (let i = 0; i < 4; i++) {
      const fetched = await fetchJobsFromSheet(GOOGLE_SCRIPT_URL);
      setJobs(fetched);
      if (fetched.some(j => j.id === jobId)) return true;
      await sleep(600);
    }
    return false;
  };

  const loadJobs = async () => {
    setLoading(true);
    await refreshJobsFromSheet();
    setLoading(false);
  };

  const handlePostJob = async (jobData: Partial<Job>) => {
    setLoading(true);

    const isEditing = !!editingJob;

    // Generate ID for new jobs based on content
    const tempId = editingJob ? editingJob.id : generateJobId(jobData.company || '', jobData.position || '');

    // Apply formatting to benefits
    const formattedBenefits = formatBenefitsForSheet(jobData.salaryBenefits || '');

    // Apply formatting to notes (same readability treatment)
    const formattedNotes = formatBenefitsForSheet(jobData.notes || '');

    // Create the job object
    const newJob: Job = {
      id: tempId,
      company: jobData.company || '',
      position: jobData.position || '',
      postingLink: jobData.postingLink || '',
      // If editing, keep old status, else default 'no'
      applied: editingJob ? editingJob.applied : 'no', 
      dateApplied: editingJob ? editingJob.dateApplied : '',
      response: editingJob ? editingJob.response : 'WAITING T-T',
      predictedPay: jobData.predictedPay || '',
      salaryBenefits: formattedBenefits,
      notes: formattedNotes,
      employmentType: jobData.employmentType || 'Full-time',
      datePosted: editingJob ? editingJob.datePosted : todayMMDDYY()
    };

    try {
      if (editingJob) {
        await updateJobInSheet(GOOGLE_SCRIPT_URL, editingJob, newJob);
      } else {
        await postJobToSheet(GOOGLE_SCRIPT_URL, newJob, false);
      }

      const exists = await refreshJobsUntilJobPresent(newJob.id);
      setToastVariant(exists ? 'success' : 'error');
      setToastMessage(
        exists
          ? (isEditing ? 'Job updated!' : 'Job posted!')
          : 'Posted, but could not confirm from the sheet. Try refresh.'
      );

      window.setTimeout(() => setToastMessage(null), 3000);

      setEditingJob(null);
      setIsPostModalOpen(false);
    } catch {
      setToastVariant('error');
      setToastMessage('Could not post job. Please try again.');
      window.setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateJobDirectly = async (updatedJob: Job) => {
    setLoading(true);

    const oldJob = jobs.find(j => j.id === updatedJob.id) || updatedJob;

    setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));
    if (selectedJob?.id === updatedJob.id) setSelectedJob(updatedJob);

    await updateJobInSheet(GOOGLE_SCRIPT_URL, oldJob, updatedJob);
    await refreshJobsFromSheet();

    setLoading(false);
  };

  const handleSendToSpreadsheet = async (job: Job) => {
    if (job.applied === 'yes') return;

    setLoading(true);
    const updatedJob: Job = {
      ...job,
      applied: 'yes',
      dateApplied: todayMMDDYY(),
      response: 'WAITING T-T'
    };

    // Optimistic update
    setJobs(prev => prev.map(j => j.id === job.id ? updatedJob : j));
    if (selectedJob?.id === job.id) setSelectedJob(updatedJob);

    await updateJobInSheet(GOOGLE_SCRIPT_URL, job, updatedJob);
    await refreshJobsFromSheet();

    setLoading(false);
  };

  const handleEditJobClick = (e: React.MouseEvent, job: Job) => {
    e.stopPropagation();
    setEditingJob(job);
    setIsPostModalOpen(true);
  };

  const handleDeleteJobClick = async (e: React.MouseEvent, job: Job) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete the job at ${job.company}?`)) {
      setLoading(true);

      // Optimistic UI, then refresh from source of truth
      setJobs(prev => prev.filter(j => j.id !== job.id));
      if (selectedJob?.id === job.id) {
        setSelectedJob(null);
        setView('LIST');
      }

      await deleteJobFromSheet(GOOGLE_SCRIPT_URL, job);
      await refreshJobsFromSheet();

      setLoading(false);
    }
  };

  // Filter & Sorting Logic
  const filteredAndSortedJobs = jobs
    .filter(job => {
      const matchesSearch = job.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            job.position.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesStatus = true;
      if (statusFilter === 'APPLIED') matchesStatus = job.applied === 'yes';
      if (statusFilter === 'NOT_APPLIED') matchesStatus = job.applied === 'no';

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // 1. Status Priority: 'no' (Not Applied) comes BEFORE 'yes' (Applied)
      if (statusFilter === 'ALL') {
         if (a.applied === 'no' && b.applied === 'yes') return -1;
         if (a.applied === 'yes' && b.applied === 'no') return 1;
      }
      
      // 2. Date Priority: Newest posted date first
      const dateA = parseMMDDYYToTime(a.datePosted);
      const dateB = parseMMDDYYToTime(b.datePosted);
      return dateB - dateA;
    });

  // Calculate counts for sidebar
  const counts = {
    all: jobs.length,
    applied: jobs.filter(j => j.applied === 'yes').length,
    notApplied: jobs.filter(j => j.applied === 'no').length
  };

  return (
    <div className="min-h-screen bg-cozy-bg font-sans text-cozy-text p-6 sm:p-12 transition-colors duration-300">
      <CatWalkOverlay />
      <div className="max-w-7xl mx-auto">

        {toastMessage && (
          <div
            className={`mb-6 px-5 py-3 rounded-2xl border shadow-soft dark:shadow-none transition-colors ${
              toastVariant === 'success'
                ? 'bg-cozy-sage/50 border-cozy-border/70 text-cozy-sageDark dark:bg-stone-800/40 dark:border-cozy-border dark:text-stone-200'
                : 'bg-rose-50 border-rose-100 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800/40 dark:text-rose-200'
            }`}
          >
            <div className="font-bold">{toastMessage}</div>
          </div>
        )}
        
        {/* Header - Minimalist & Cozy */}
        <header className="flex flex-col lg:flex-row justify-between items-center py-8 mb-12 gap-8">
          <div className="text-center lg:text-left">
             <h1 className="text-7xl sm:text-8xl font-hand font-normal text-stone-800 dark:text-stone-100 tracking-wide lowercase opacity-90">
                latest jobs
             </h1>
          </div>
         
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center lg:justify-end bg-white dark:bg-stone-800/50 p-2 rounded-full shadow-sm dark:shadow-none border border-white dark:border-stone-800">
            {/* Sync Button */}
            <button 
                onClick={loadJobs} 
                className={`p-4 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-400 dark:text-stone-500 transition-all duration-300 ${loading ? 'animate-spin' : ''}`}
                title="Refresh"
             >
               <RefreshCw className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Dark Mode Button */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-4 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-400 dark:text-stone-500 transition-all duration-300"
              title={darkMode ? "Light Mode" : "Dark Mode"}
            >
              {darkMode ? <Sun className="w-5 h-5 stroke-[2.5]" /> : <Moon className="w-5 h-5 stroke-[2.5]" />}
            </button>

            {/* Post Job Button - Soft Pill Style */}
            <button
              onClick={() => {
                setEditingJob(null);
                setIsPostModalOpen(true);
              }}
              className="ml-2 bg-cozy-peach/60 hover:bg-cozy-peach/80 dark:bg-stone-800/50 dark:hover:bg-stone-700 text-cozy-peachDark dark:text-stone-200 px-8 py-4 rounded-full font-bold shadow-soft dark:shadow-none hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2.5 font-sans tracking-wide border border-cozy-border/70 dark:border-cozy-border"
            >
              <PenTool className="w-4 h-4 stroke-[2.5]" />
              <span>Post a Job</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        {view === 'LIST' ? (
          <div className="flex flex-col md:flex-row gap-8">
            <Sidebar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterStatus={statusFilter}
              onFilterStatusChange={setStatusFilter}
              counts={counts}
            />
            
            <div className="flex-1 space-y-6">
              {filteredAndSortedJobs.length === 0 ? (
                <div className="text-center py-32 text-stone-400 dark:text-stone-500 bg-white/50 dark:bg-cozy-card/50 rounded-[2rem] border-2 border-dashed border-stone-100 dark:border-stone-800 transition-colors">
                  <p className="text-4xl font-hand mb-3 opacity-80">No jobs found...</p>
                  <p className="text-sm font-bold tracking-widest uppercase opacity-60">Time for a nap? 😴</p>
                </div>
              ) : (
                filteredAndSortedJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onClick={() => {
                      setSelectedJob(job);
                      setView('DETAIL');
                      window.scrollTo(0,0);
                    }}
                    onEdit={handleEditJobClick}
                    onDelete={handleDeleteJobClick}
                  />
                ))
              )}
            </div>
          </div>
        ) : (
          selectedJob && (
            <JobDetail
              job={selectedJob}
              onBack={() => setView('LIST')}
              onSendToSpreadsheet={handleSendToSpreadsheet}
              onUpdate={handleUpdateJobDirectly}
              loading={loading}
            />
          )
        )}
      </div>

      <PostJobModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={handlePostJob}
        // Categories removed
        loading={loading}
        initialData={editingJob}
      />
    </div>
  );
};

export default App;
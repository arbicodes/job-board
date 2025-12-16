import React from 'react';
import { Search, Sparkles } from 'lucide-react';

interface SidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: 'ALL' | 'APPLIED' | 'NOT_APPLIED';
  onFilterStatusChange: (status: 'ALL' | 'APPLIED' | 'NOT_APPLIED') => void;
  counts: {
    all: number;
    applied: number;
    notApplied: number;
  };
}

const Sidebar: React.FC<SidebarProps> = ({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  counts
}) => {
  return (
    <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-8 md:pr-4 mb-8 md:mb-0">
      {/* Search */}
      <div className="bg-white dark:bg-cozy-card p-5 rounded-3xl shadow-soft dark:shadow-none border border-cozy-clay/30 dark:border-cozy-border transition-colors duration-300">
        <h3 className="text-2xl font-hand font-bold mb-3 text-cozy-text dark:text-stone-300">
          Search jobs
        </h3>
        <div className="relative z-10">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cozy-clay dark:text-stone-600 w-5 h-5" />
          <input
            type="text"
            placeholder="Find your dream role..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-cozy-bg dark:bg-stone-800/50 border-2 border-cozy-clay/20 dark:border-cozy-border focus:border-cozy-peach/50 dark:focus:border-stone-600 focus:ring-0 outline-none transition-all placeholder-stone-400 dark:placeholder-stone-600 text-sm font-medium text-cozy-text dark:text-stone-300"
          />
        </div>
      </div>

      {/* Filter by Status */}
      <div className="bg-white dark:bg-cozy-card p-6 rounded-3xl shadow-soft dark:shadow-none border border-cozy-clay/30 dark:border-cozy-border transition-colors duration-300 flex-1 h-full">
        <h3 className="text-2xl font-hand font-bold mb-4 text-cozy-text dark:text-stone-300 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cozy-peachDark dark:text-stone-500" /> Status
        </h3>
        <div className="space-y-3">
          <button
             onClick={() => onFilterStatusChange('ALL')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
               filterStatus === 'ALL' 
                 ? 'bg-cozy-lavender dark:bg-stone-800 text-stone-700 dark:text-stone-200 shadow-sm dark:shadow-none transform scale-[1.02]' 
                 : 'hover:bg-cozy-bg dark:hover:bg-stone-800/30 text-stone-500 dark:text-stone-500'
             }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${filterStatus === 'ALL' ? 'border-purple-300 dark:border-stone-500' : 'border-stone-200 dark:border-stone-700'}`}>
              {filterStatus === 'ALL' && <div className="w-2.5 h-2.5 rounded-full bg-purple-400 dark:bg-stone-400" />}
            </div>
            <span className="font-medium">All Jobs</span>
            <span className="ml-auto text-sm font-bold opacity-60 bg-stone-100 dark:bg-stone-900 px-2 py-0.5 rounded-md min-w-[24px] text-center">{counts.all}</span>
          </button>

          <button
             onClick={() => onFilterStatusChange('APPLIED')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
               filterStatus === 'APPLIED' 
                 ? 'bg-cozy-sage dark:bg-stone-800 text-cozy-sageDark dark:text-stone-200 shadow-sm dark:shadow-none transform scale-[1.02]' 
                 : 'hover:bg-cozy-bg dark:hover:bg-stone-800/30 text-stone-500 dark:text-stone-500'
             }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${filterStatus === 'APPLIED' ? 'border-green-300 dark:border-stone-500' : 'border-stone-200 dark:border-stone-700'}`}>
              {filterStatus === 'APPLIED' && <div className="w-2.5 h-2.5 rounded-full bg-green-500 dark:bg-stone-400" />}
            </div>
            <span className="font-medium">Applied</span>
            <span className="ml-auto text-sm font-bold opacity-60 bg-stone-100 dark:bg-stone-900 px-2 py-0.5 rounded-md min-w-[24px] text-center">{counts.applied}</span>
          </button>

          <button
             onClick={() => onFilterStatusChange('NOT_APPLIED')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
               filterStatus === 'NOT_APPLIED' 
                 ? 'bg-cozy-peach dark:bg-stone-800 text-cozy-peachDark dark:text-stone-200 shadow-sm dark:shadow-none transform scale-[1.02]' 
                 : 'hover:bg-cozy-bg dark:hover:bg-stone-800/30 text-stone-500 dark:text-stone-500'
             }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${filterStatus === 'NOT_APPLIED' ? 'border-orange-300 dark:border-stone-500' : 'border-stone-200 dark:border-stone-700'}`}>
              {filterStatus === 'NOT_APPLIED' && <div className="w-2.5 h-2.5 rounded-full bg-orange-400 dark:bg-stone-400" />}
            </div>
            <span className="font-medium">Ready to apply</span>
            <span className="ml-auto text-sm font-bold opacity-60 bg-stone-100 dark:bg-stone-900 px-2 py-0.5 rounded-md min-w-[24px] text-center">{counts.notApplied}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
'use client';

import React from 'react';
import { CheckCircle2, Clock, ListTodo, Plus, LayoutGrid, ListFilter, Search, FolderKanban } from 'lucide-react';

interface StatsHeaderProps {
  totalCount: number;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
  activeView: 'KANBAN' | 'LIST' | 'PROJECTS';
  onChangeView: (view: 'KANBAN' | 'LIST' | 'PROJECTS') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedPriority: string;
  onPriorityChange: (p: string) => void;
  onOpenNewTaskModal: () => void;
  isFiltering?: boolean;
}

export default function StatsHeader({
  totalCount,
  todoCount,
  inProgressCount,
  doneCount,
  activeView,
  onChangeView,
  searchQuery,
  onSearchChange,
  selectedPriority,
  onPriorityChange,
  onOpenNewTaskModal,
  isFiltering,
}: StatsHeaderProps) {
  const completionPercentage = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="bg-slate-900 border-b border-slate-800 p-6 space-y-6">
      {/* Top Bar: Title & Primary CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white tracking-tight">Panou de Activitate</h2>
            {isFiltering && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Filtrare server...
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Urmărește și actualizează progresul proiectelor în timp real.
          </p>
        </div>

        <button
          onClick={onOpenNewTaskModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm transition shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Adaugă Sarcină Nouă</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Sarcini</p>
            <p className="text-2xl font-bold text-white mt-1">{totalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-300">
            <ListTodo className="w-5 h-5" />
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-amber-400">În Desfășurare</p>
            <p className="text-2xl font-bold text-white mt-1">{inProgressCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Completed */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-emerald-400">Finalizate</p>
            <p className="text-2xl font-bold text-white mt-1">{doneCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-400">Rată Finalizare</p>
            <span className="text-xs font-bold text-blue-400">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter & View Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {/* Search & Priority Select */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Caută în sarcini..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="relative">
            <select
              value={selectedPriority}
              onChange={(e) => onPriorityChange(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-blue-500 transition cursor-pointer"
            >
              <option value="ALL">Toate prioritățile</option>
              <option value="LOW">Scăzută (Low)</option>
              <option value="MEDIUM">Medie (Medium)</option>
              <option value="HIGH">Ridicată (High)</option>
              <option value="URGENT">Urgent</option>
            </select>
            <ListFilter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* View Toggle (Kanban vs List vs Projects) */}
        <div className="flex items-center bg-slate-800 border border-slate-700 p-1 rounded-lg self-start sm:self-auto gap-0.5">
          <button
            onClick={() => onChangeView('KANBAN')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeView === 'KANBAN'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kanban</span>
          </button>
          <button
            onClick={() => onChangeView('LIST')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeView === 'LIST'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>Listă</span>
          </button>
          <button
            onClick={() => onChangeView('PROJECTS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeView === 'PROJECTS'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Proiecte</span>
          </button>
        </div>
      </div>
    </div>
  );
}

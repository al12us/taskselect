'use client';

import React from 'react';
import { FolderKanban, Plus, Layers, Trash2 } from 'lucide-react';

interface ProjectWithTasks {
  id: string;
  title: string;
  description: string | null;
  color: string;
  tasks: { id: string; status: string }[];
}

interface SidebarProps {
  projects: ProjectWithTasks[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  onOpenNewProjectModal: () => void;
  onDeleteProject: (id: string) => void;
}

export default function Sidebar({
  projects,
  selectedProjectId,
  onSelectProject,
  onOpenNewProjectModal,
  onDeleteProject,
}: SidebarProps) {
  const totalTasksCount = projects.reduce((acc, p) => acc + p.tasks.length, 0);

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-screen text-slate-100 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <FolderKanban className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-wide bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              TaskSelect
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Flow Manager</p>
          </div>
        </div>
      </div>

      {/* Projects Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase flex items-center justify-between">
            <span>Filtrare Generală</span>
          </div>
          <button
            onClick={() => onSelectProject('ALL')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              selectedProjectId === 'ALL'
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-slate-400" />
              <span>Toate Proiectele</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
              {totalTasksCount}
            </span>
          </button>
        </div>

        <div>
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase flex items-center justify-between">
            <span>Proiecte ({projects.length})</span>
            <button
              onClick={onOpenNewProjectModal}
              title="Adaugă un proiect nou"
              className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-slate-800 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            {projects.length === 0 ? (
              <p className="px-3 py-4 text-xs text-slate-500 italic text-center">
                Nu există proiecte create încă.
              </p>
            ) : (
              projects.map((p) => {
                const isSelected = selectedProjectId === p.id;
                const completedCount = p.tasks.filter((t) => t.status === 'DONE').length;
                return (
                  <div
                    key={p.id}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800/40 hover:text-white'
                    }`}
                    onClick={() => onSelectProject(p.id)}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="truncate">{p.title}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {completedCount}/{p.tasks.length}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Ești sigur că vrei să elimini proiectul "${p.title}"?`)) {
                            onDeleteProject(p.id);
                          }
                        }}
                        title="Șterge proiect"
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <span>v1.0 • Next.js 16</span>
        <button
          onClick={onOpenNewProjectModal}
          className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Proiect Nou</span>
        </button>
      </div>
    </aside>
  );
}

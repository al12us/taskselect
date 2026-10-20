'use client';

import React from 'react';
import { Plus, ArrowRight, Trash2, CheckCircle2, Clock, ListTodo, Layers } from 'lucide-react';

interface ProjectItem {
  id: string;
  title: string;
  description: string | null;
  color: string;
  status: string;
  tasks: { id: string; status: string }[];
}

interface ProjectCardsViewProps {
  projects: ProjectItem[];
  onSelectProject: (projectId: string) => void;
  onOpenNewProjectModal: () => void;
  onDeleteProject: (projectId: string) => void;
}

export default function ProjectCardsView({
  projects,
  onSelectProject,
  onOpenNewProjectModal,
  onDeleteProject,
}: ProjectCardsViewProps) {
  const getStatusBadge = (status: string, percentage: number) => {
    if (percentage === 100 && status === 'ACTIVE') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Finalizat
        </span>
      );
    }

    switch (status) {
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Completat
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-700/60 text-slate-400 border border-slate-600/50">
            Arhivat
          </span>
        );
      case 'ACTIVE':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Activ
          </span>
        );
    }
  };

  return (
    <div className="p-6 flex-1 overflow-y-auto">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            Prezentare Generală Proiecte
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Vizualizează indicatorii de progres, sarcinile și distribuția etapelor per proiect.
          </p>
        </div>

        <button
          onClick={onOpenNewProjectModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition shadow-md shadow-blue-600/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Proiect Nou</span>
        </button>
      </div>

      {/* Grid of Interactive Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const totalTasks = project.tasks.length;
          const todoTasks = project.tasks.filter((t) => t.status === 'TODO').length;
          const inProgressTasks = project.tasks.filter((t) => t.status === 'IN_PROGRESS').length;
          const doneTasks = project.tasks.filter((t) => t.status === 'DONE').length;
          const percentage = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

          return (
            <div
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className="group relative bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden"
              style={{
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
              }}
            >
              {/* Top Accent Color Bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-300 group-hover:h-2"
                style={{ backgroundColor: project.color }}
              />

              <div>
                {/* Header: Color Swatch + Status Badge + Actions */}
                <div className="flex items-center justify-between pt-1 mb-3.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-md shadow-sm transition-transform group-hover:scale-110"
                      style={{ backgroundColor: project.color }}
                    />
                    {getStatusBadge(project.status, percentage)}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Ești sigur că vrei să ștergi proiectul "${project.title}"?`)) {
                        onDeleteProject(project.id);
                      }
                    }}
                    title="Șterge proiect"
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Title & Description */}
                <h4 className="text-base font-bold text-white group-hover:text-blue-300 transition line-clamp-1 mb-1.5">
                  {project.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed min-h-[32px]">
                  {project.description || 'Fără descriere adițională specificată.'}
                </p>

                {/* Progress Indicator Section */}
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Progres Sarcini</span>
                    <span className="font-bold text-white font-mono">{percentage}%</span>
                  </div>

                  {/* Dynamic Progress Bar */}
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: project.color,
                      }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium pt-0.5">
                    {doneTasks} din {totalTasks} {totalTasks === 1 ? 'sarcină finalizată' : 'sarcini finalizate'}
                  </p>
                </div>

                {/* Task Breakdown Badges */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80">
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center border border-slate-700/30">
                    <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-0.5">
                      <ListTodo className="w-3 h-3" />
                      <span>De făcut</span>
                    </div>
                    <span className="font-bold text-sm text-slate-200">{todoTasks}</span>
                  </div>

                  <div className="bg-amber-500/5 rounded-lg p-2 text-center border border-amber-500/20">
                    <div className="flex items-center justify-center gap-1 text-[11px] text-amber-400 mb-0.5">
                      <Clock className="w-3 h-3" />
                      <span>În lucru</span>
                    </div>
                    <span className="font-bold text-sm text-amber-300">{inProgressTasks}</span>
                  </div>

                  <div className="bg-emerald-500/5 rounded-lg p-2 text-center border border-emerald-500/20">
                    <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-400 mb-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Gata</span>
                    </div>
                    <span className="font-bold text-sm text-emerald-300">{doneTasks}</span>
                  </div>
                </div>
              </div>

              {/* Bottom CTA Button */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-blue-400 font-semibold group-hover:text-blue-300 transition">
                <span>Deschide Bord Kanban</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}

        {/* Create Project Card (Ghost / Dashed Card) */}
        <div
          onClick={onOpenNewProjectModal}
          className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 bg-slate-900/30 hover:bg-slate-900/70 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 min-h-[300px] group"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-800 group-hover:bg-blue-600/20 border border-slate-700 group-hover:border-blue-500/40 flex items-center justify-center text-slate-400 group-hover:text-blue-400 mb-4 transition">
            <Plus className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-base text-slate-300 group-hover:text-white transition">
            Creează Proiect Nou
          </h4>
          <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
            Adaugă un nou spațiu de lucru cu paletă personalizată de culori și obiective.
          </p>
        </div>
      </div>
    </div>
  );
}

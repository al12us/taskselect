'use client';

import React from 'react';
import { ArrowLeft, ArrowRight, Trash2, Calendar, AlertCircle } from 'lucide-react';

export interface TaskItem {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  project: {
    id: string;
    title: string;
    color: string;
  };
}

interface KanbanBoardProps {
  tasks: TaskItem[];
  onUpdateStatus: (taskId: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => void;
  onDeleteTask: (taskId: string) => void;
}

const COLUMNS = [
  { id: 'TODO', title: 'De Făcut (To Do)', color: 'border-slate-600/60 bg-slate-800/30 text-slate-300' },
  { id: 'IN_PROGRESS', title: 'În Desfășurare', color: 'border-amber-500/40 bg-amber-500/5 text-amber-400' },
  { id: 'DONE', title: 'Finalizat', color: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400' },
];

export default function KanbanBoard({ tasks, onUpdateStatus, onDeleteTask }: KanbanBoardProps) {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">URGENT</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">MED</span>;
      case 'LOW':
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700/50 text-slate-400 border border-slate-600/40">LOW</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 flex-1 overflow-x-auto items-start">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col max-h-full"
          >
            {/* Column Header */}
            <div className={`p-3 rounded-lg border flex items-center justify-between mb-4 ${col.color}`}>
              <h3 className="font-semibold text-sm tracking-wide">{col.title}</h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800/80">
                {columnTasks.length}
              </span>
            </div>

            {/* Task List */}
            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-320px)] pr-1">
              {columnTasks.length === 0 ? (
                <div className="py-10 text-center border-2 border-dashed border-slate-800/80 rounded-lg">
                  <p className="text-xs text-slate-500 font-medium">Nicio sarcină în această etapă</p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 rounded-lg p-4 shadow-sm transition space-y-3"
                  >
                    {/* Project & Priority Row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: task.project.color }}
                        />
                        <span className="text-xs font-medium text-slate-400 truncate">
                          {task.project.title}
                        </span>
                      </div>
                      {getPriorityBadge(task.priority)}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h4 className="font-semibold text-sm text-white group-hover:text-blue-300 transition">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}
                    </div>

                    {/* Due Date (if any) */}
                    {task.dueDate && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{new Date(task.dueDate).toLocaleDateString('ro-RO')}</span>
                      </div>
                    )}

                    {/* Card Actions Footer */}
                    <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {col.id !== 'TODO' && (
                          <button
                            onClick={() => onUpdateStatus(task.id, col.id === 'DONE' ? 'IN_PROGRESS' : 'TODO')}
                            title="Mută înapoi"
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {col.id !== 'DONE' && (
                          <button
                            onClick={() => onUpdateStatus(task.id, col.id === 'TODO' ? 'IN_PROGRESS' : 'DONE')}
                            title="Avancează starea"
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Ești sigur că vrei să ștergi sarcina "${task.title}"?`)) {
                            onDeleteTask(task.id);
                          }
                        }}
                        title="Șterge sarcina"
                        className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

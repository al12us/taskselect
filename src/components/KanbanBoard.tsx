'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Trash2, Calendar, GripVertical } from 'lucide-react';

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
  {
    id: 'TODO' as const,
    title: 'De Făcut (To Do)',
    colorHeader: 'border-slate-700 bg-slate-800/60 text-slate-300',
    accentBorder: 'border-slate-600',
    badgeBg: 'bg-slate-700 text-slate-300',
  },
  {
    id: 'IN_PROGRESS' as const,
    title: 'În Desfășurare',
    colorHeader: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    accentBorder: 'border-amber-500',
    badgeBg: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  },
  {
    id: 'DONE' as const,
    title: 'Finalizat',
    colorHeader: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    accentBorder: 'border-emerald-500',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  },
];

export default function KanbanBoard({ tasks, onUpdateStatus, onDeleteTask }: KanbanBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColId, setDragOverColId] = useState<string | null>(null);

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

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColId !== colId) {
      setDragOverColId(colId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetColId: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    setDragOverColId(null);
    setDraggedTaskId(null);

    if (taskId) {
      onUpdateStatus(taskId, targetColId);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 flex-1 overflow-x-auto items-start select-none">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);
        const isDragOver = dragOverColId === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex flex-col max-h-full rounded-2xl p-4 transition-all duration-200 border ${
              isDragOver
                ? 'bg-slate-800/90 border-blue-500 shadow-xl shadow-blue-500/10 scale-[1.01]'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            {/* Column Header */}
            <div className={`p-3.5 rounded-xl border flex items-center justify-between mb-4 ${col.colorHeader}`}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-current" />
                <h3 className="font-semibold text-sm tracking-wide">{col.title}</h3>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${col.badgeBg}`}>
                {columnTasks.length}
              </span>
            </div>

            {/* Task List Container */}
            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-320px)] pr-1 min-h-[160px]">
              {columnTasks.length === 0 ? (
                <div
                  className={`py-12 px-4 text-center border-2 border-dashed rounded-xl transition ${
                    isDragOver
                      ? 'border-blue-400/80 bg-blue-500/10 text-blue-300'
                      : 'border-slate-800/80 text-slate-500'
                  }`}
                >
                  <p className="text-xs font-medium">
                    {isDragOver ? 'Eliberează aici pentru a muta' : 'Trage o sarcină aici'}
                  </p>
                </div>
              ) : (
                columnTasks.map((task) => {
                  const isBeingDragged = draggedTaskId === task.id;

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={() => {
                        setDraggedTaskId(null);
                        setDragOverColId(null);
                      }}
                      className={`group bg-slate-800/90 hover:bg-slate-800 border rounded-xl p-4 shadow-sm transition-all duration-200 space-y-3 cursor-grab active:cursor-grabbing ${
                        isBeingDragged
                          ? 'opacity-40 border-dashed border-blue-400 scale-95'
                          : 'border-slate-700/60 hover:border-slate-500 hover:shadow-md'
                      }`}
                    >
                      {/* Top Row: Project & Priority */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <GripVertical className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 shrink-0" />
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: task.project.color }}
                          />
                          <span className="text-xs font-medium text-slate-300 truncate">
                            {task.project.title}
                          </span>
                        </div>
                        {getPriorityBadge(task.priority)}
                      </div>

                      {/* Content */}
                      <div>
                        <h4 className="font-semibold text-sm text-white group-hover:text-blue-300 transition leading-snug">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Due Date Indicator */}
                      {task.dueDate && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{new Date(task.dueDate).toLocaleDateString('ro-RO')}</span>
                        </div>
                      )}

                      {/* Quick Move Buttons & Delete */}
                      <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {col.id !== 'TODO' && (
                            <button
                              onClick={() => onUpdateStatus(task.id, col.id === 'DONE' ? 'IN_PROGRESS' : 'TODO')}
                              title="Mută înapoi"
                              className="px-2 py-1 rounded bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1 transition"
                            >
                              <ArrowLeft className="w-3 h-3" />
                              <span className="text-[10px]">Înapoi</span>
                            </button>
                          )}
                          {col.id !== 'DONE' && (
                            <button
                              onClick={() => onUpdateStatus(task.id, col.id === 'TODO' ? 'IN_PROGRESS' : 'DONE')}
                              title="Avancează starea"
                              className="px-2 py-1 rounded bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-medium flex items-center gap-1 transition"
                            >
                              <span className="text-[10px]">Înainte</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            if (confirm(`Ești sigur că vrei să elimini sarcina "${task.title}"?`)) {
                              onDeleteTask(task.id);
                            }
                          }}
                          title="Șterge sarcina"
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-700/60 transition"
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
        );
      })}
    </div>
  );
}

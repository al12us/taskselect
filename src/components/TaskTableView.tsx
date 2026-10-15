'use client';

import React from 'react';
import { TaskItem } from './KanbanBoard';
import { Trash2, Calendar } from 'lucide-react';

interface TaskTableViewProps {
  tasks: TaskItem[];
  onUpdateStatus: (taskId: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TaskTableView({ tasks, onUpdateStatus, onDeleteTask }: TaskTableViewProps) {
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
    <div className="p-6 flex-1 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700/80">
            <tr>
              <th className="px-5 py-3.5">Titlu Sarcină</th>
              <th className="px-5 py-3.5">Proiect</th>
              <th className="px-5 py-3.5">Prioritate</th>
              <th className="px-5 py-3.5">Stare</th>
              <th className="px-5 py-3.5">Termen Limită</th>
              <th className="px-5 py-3.5 text-right">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                  Nu a fost găsită nicio sarcină conform filtrelor alese.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-white">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{task.description}</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 border border-slate-700">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: task.project.color }}
                      />
                      <span>{task.project.title}</span>
                    </span>
                  </td>
                  <td className="px-5 py-4">{getPriorityBadge(task.priority)}</td>
                  <td className="px-5 py-4">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        onUpdateStatus(task.id, e.target.value as 'TODO' | 'IN_PROGRESS' | 'DONE')
                      }
                      className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-blue-500 transition cursor-pointer"
                    >
                      <option value="TODO">De Făcut (To Do)</option>
                      <option value="IN_PROGRESS">În Desfășurare</option>
                      <option value="DONE">Finalizat</option>
                    </select>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-400">
                    {task.dueDate ? (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(task.dueDate).toLocaleDateString('ro-RO')}
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => {
                        if (confirm(`Ești sigur că vrei să ștergi sarcina "${task.title}"?`)) {
                          onDeleteTask(task.id);
                        }
                      }}
                      title="Șterge sarcină"
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

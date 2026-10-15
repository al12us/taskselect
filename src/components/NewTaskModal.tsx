'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createTask } from '@/app/actions';

interface ProjectOption {
  id: string;
  title: string;
  color: string;
}

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectOption[];
  defaultProjectId?: string;
}

export default function NewTaskModal({
  isOpen,
  onClose,
  projects,
  defaultProjectId,
}: NewTaskModalProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await createTask(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'A apărut o eroare la crearea sarcinii.');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-800/40">
          <h3 className="text-lg font-bold text-white">Adaugă Sarcină Nouă</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Titlu Sarcină *
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="ex: Implementare sistem de autentificare"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Descriere
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Detalii suplimentare, cerințe sau link-uri utile..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Proiect Asignat *
              </label>
              <select
                name="projectId"
                required
                defaultValue={defaultProjectId || projects[0]?.id || ''}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Prioritate
              </label>
              <select
                name="priority"
                defaultValue="MEDIUM"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition cursor-pointer"
              >
                <option value="LOW">Scăzută (Low)</option>
                <option value="MEDIUM">Medie (Medium)</option>
                <option value="HIGH">Ridicată (High)</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Stare Inițială
              </label>
              <select
                name="status"
                defaultValue="TODO"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition cursor-pointer"
              >
                <option value="TODO">De Făcut (To Do)</option>
                <option value="IN_PROGRESS">În Desfășurare</option>
                <option value="DONE">Finalizat</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Termen Limită
              </label>
              <input
                type="date"
                name="dueDate"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition cursor-pointer"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg transition"
            >
              Anulează
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition shadow-md shadow-blue-600/20 disabled:opacity-50"
            >
              {isPending ? 'Se salvează...' : 'Creează Sarcina'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

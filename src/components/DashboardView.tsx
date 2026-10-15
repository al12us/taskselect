'use client';

import React, { useState, useTransition } from 'react';
import Sidebar from './Sidebar';
import StatsHeader from './StatsHeader';
import KanbanBoard, { TaskItem } from './KanbanBoard';
import TaskTableView from './TaskTableView';
import NewTaskModal from './NewTaskModal';
import NewProjectModal from './NewProjectModal';
import { updateTaskStatus, deleteTask, deleteProject } from '@/app/actions';

interface ProjectItem {
  id: string;
  title: string;
  description: string | null;
  color: string;
  tasks: { id: string; status: string }[];
}

interface DashboardViewProps {
  projects: ProjectItem[];
  tasks: TaskItem[];
}

export default function DashboardView({ projects, tasks }: DashboardViewProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeView, setActiveView] = useState<'KANBAN' | 'LIST'>('KANBAN');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [, startTransition] = useTransition();

  // Filter tasks locally for instant snappy feedback
  const filteredTasks = tasks.filter((t) => {
    if (selectedProjectId !== 'ALL' && t.project.id !== selectedProjectId) {
      return false;
    }
    if (selectedPriority !== 'ALL' && t.priority !== selectedPriority) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q) || false;
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  const todoCount = filteredTasks.filter((t) => t.status === 'TODO').length;
  const inProgressCount = filteredTasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const doneCount = filteredTasks.filter((t) => t.status === 'DONE').length;

  function handleUpdateStatus(taskId: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') {
    startTransition(async () => {
      await updateTaskStatus(taskId, newStatus);
    });
  }

  function handleDeleteTask(taskId: string) {
    startTransition(async () => {
      await deleteTask(taskId);
    });
  }

  function handleDeleteProject(projectId: string) {
    startTransition(async () => {
      await deleteProject(projectId);
      if (selectedProjectId === projectId) {
        setSelectedProjectId('ALL');
      }
    });
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans">
      {/* Left Sidebar */}
      <Sidebar
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
        onDeleteProject={handleDeleteProject}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Stats & Filter Header */}
        <StatsHeader
          totalCount={filteredTasks.length}
          todoCount={todoCount}
          inProgressCount={inProgressCount}
          doneCount={doneCount}
          activeView={activeView}
          onChangeView={setActiveView}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
          onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
        />

        {/* View Content (Kanban or Table) */}
        {activeView === 'KANBAN' ? (
          <KanbanBoard
            tasks={filteredTasks}
            onUpdateStatus={handleUpdateStatus}
            onDeleteTask={handleDeleteTask}
          />
        ) : (
          <TaskTableView
            tasks={filteredTasks}
            onUpdateStatus={handleUpdateStatus}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </main>

      {/* Modals */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        projects={projects.map((p) => ({ id: p.id, title: p.title, color: p.color }))}
        defaultProjectId={selectedProjectId !== 'ALL' ? selectedProjectId : undefined}
      />

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
    </div>
  );
}

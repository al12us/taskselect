'use client';

import React, { useState, useTransition, useOptimistic, useEffect } from 'react';
import Sidebar from './Sidebar';
import StatsHeader from './StatsHeader';
import KanbanBoard, { TaskItem } from './KanbanBoard';
import TaskTableView from './TaskTableView';
import ProjectCardsView from './ProjectCardsView';
import NewTaskModal from './NewTaskModal';
import NewProjectModal from './NewProjectModal';
import { updateTaskStatus, deleteTask, deleteProject, filterTasksAction } from '@/app/actions';

interface ProjectItem {
  id: string;
  title: string;
  description: string | null;
  color: string;
  status: string;
  tasks: { id: string; status: string }[];
}

interface DashboardViewProps {
  projects: ProjectItem[];
  initialTasks: TaskItem[];
  initialProjectId?: string;
  initialPriority?: string;
  initialSearch?: string;
}

type OptimisticAction =
  | { type: 'UPDATE_STATUS'; taskId: string; newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE' }
  | { type: 'DELETE_TASK'; taskId: string };

export default function DashboardView({
  projects,
  initialTasks,
  initialProjectId = 'ALL',
  initialPriority = 'ALL',
  initialSearch = '',
}: DashboardViewProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId);
  const [selectedPriority, setSelectedPriority] = useState<string>(initialPriority);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [rawTasks, setRawTasks] = useState<TaskItem[]>(initialTasks);
  const [activeView, setActiveView] = useState<'KANBAN' | 'LIST' | 'PROJECTS'>('KANBAN');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Actualizează task-urile din props dacă server component-ul revalidează pagina
  useEffect(() => {
    setRawTasks(initialTasks);
  }, [initialTasks]);

  // Server-side filtering handler prin Server Actions
  const executeServerFilter = (
    nextProjectId: string,
    nextPriority: string,
    nextSearch: string
  ) => {
    startTransition(async () => {
      // 1. Apel către Server Action care rulează interogarea Prisma / SQLite direct pe server
      const filteredResult = await filterTasksAction(
        nextProjectId,
        nextPriority,
        nextSearch
      );
      setRawTasks(filteredResult);

      // 2. Sincronizare URL SearchParams în browser fără reîncărcare de pagină
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (nextProjectId !== 'ALL') url.searchParams.set('project', nextProjectId);
        else url.searchParams.delete('project');

        if (nextPriority !== 'ALL') url.searchParams.set('priority', nextPriority);
        else url.searchParams.delete('priority');

        if (nextSearch.trim() !== '') url.searchParams.set('search', nextSearch.trim());
        else url.searchParams.delete('search');

        window.history.replaceState({}, '', url.toString());
      }
    });
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    executeServerFilter(projectId, selectedPriority, searchQuery);
  };

  const handlePriorityChange = (priority: string) => {
    setSelectedPriority(priority);
    executeServerFilter(selectedProjectId, priority, searchQuery);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    executeServerFilter(selectedProjectId, selectedPriority, query);
  };

  // Optimistic UI updates pentru 0ms reacție instantanee pe ecran
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    rawTasks,
    (currentTasks: TaskItem[], action: OptimisticAction) => {
      if (action.type === 'UPDATE_STATUS') {
        return currentTasks.map((t) =>
          t.id === action.taskId ? { ...t, status: action.newStatus } : t
        );
      }
      if (action.type === 'DELETE_TASK') {
        return currentTasks.filter((t) => t.id !== action.taskId);
      }
      return currentTasks;
    }
  );

  const todoCount = optimisticTasks.filter((t) => t.status === 'TODO').length;
  const inProgressCount = optimisticTasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const doneCount = optimisticTasks.filter((t) => t.status === 'DONE').length;

  function handleUpdateStatus(taskId: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') {
    startTransition(async () => {
      setOptimisticTasks({ type: 'UPDATE_STATUS', taskId, newStatus });
      await updateTaskStatus(taskId, newStatus);
    });
  }

  function handleDeleteTask(taskId: string) {
    startTransition(async () => {
      setOptimisticTasks({ type: 'DELETE_TASK', taskId });
      await deleteTask(taskId);
    });
  }

  function handleDeleteProject(projectId: string) {
    startTransition(async () => {
      await deleteProject(projectId);
      if (selectedProjectId === projectId) {
        setSelectedProjectId('ALL');
        executeServerFilter('ALL', selectedPriority, searchQuery);
      }
    });
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans">
      {/* Left Sidebar */}
      <Sidebar
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={handleSelectProject}
        onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
        onDeleteProject={handleDeleteProject}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Stats & Filter Header */}
        <StatsHeader
          totalCount={optimisticTasks.length}
          todoCount={todoCount}
          inProgressCount={inProgressCount}
          doneCount={doneCount}
          activeView={activeView}
          onChangeView={setActiveView}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          selectedPriority={selectedPriority}
          onPriorityChange={handlePriorityChange}
          onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
          isFiltering={isPending}
        />

        {/* View Content (Kanban, Table, or Project Cards) */}
        {activeView === 'KANBAN' && (
          <KanbanBoard
            tasks={optimisticTasks}
            onUpdateStatus={handleUpdateStatus}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {activeView === 'LIST' && (
          <TaskTableView
            tasks={optimisticTasks}
            onUpdateStatus={handleUpdateStatus}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {activeView === 'PROJECTS' && (
          <ProjectCardsView
            projects={projects}
            onSelectProject={(projectId) => {
              handleSelectProject(projectId);
              setActiveView('KANBAN');
            }}
            onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
            onDeleteProject={handleDeleteProject}
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

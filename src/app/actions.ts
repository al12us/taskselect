'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Seed demo data if database is fresh
export async function seedInitialDataIfEmpty() {
  const count = await prisma.project.count();
  if (count > 0) return;

  const p1 = await prisma.project.create({
    data: {
      title: 'Lansare Platformă v1.0',
      description: 'Lansarea versiunii oficiale a aplicației și optimizările finale.',
      color: '#3b82f6', // Albastru
      status: 'ACTIVE',
    },
  });

  const p2 = await prisma.project.create({
    data: {
      title: 'Redesign Branding & UI',
      description: 'Îmbunătățirea aspectului vizual, culorilor și componentelor.',
      color: '#8b5cf6', // Violet
      status: 'ACTIVE',
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: 'Configurare Bază de Date și Migrații Prisma',
        description: 'Definire modele relaționale și sincronizare SQLite.',
        status: 'DONE',
        priority: 'HIGH',
        projectId: p1.id,
      },
      {
        title: 'Creare Componentă Bord Kanban',
        description: 'Implementare coloane To Do, In Progress și Done cu actualizare instant.',
        status: 'IN_PROGRESS',
        priority: 'URGENT',
        projectId: p1.id,
      },
      {
        title: 'Integrare Server Actions pentru filtrare',
        description: 'Server-side data fetching cu revalidare dinamică.',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: p1.id,
      },
      {
        title: 'Paletă de culori și fonturi Geist',
        description: 'Ajustare variabile CSS și dark mode contrastant.',
        status: 'DONE',
        priority: 'LOW',
        projectId: p2.id,
      },
      {
        title: 'Design carduri de proiecte interactive',
        description: 'Adăugare badge-uri, indicatori de progres și hover effects.',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: p2.id,
      },
    ],
  });
}

// ================= PROJECTS ACTIONS =================

export async function getProjects() {
  await seedInitialDataIfEmpty();
  return prisma.project.findMany({
    include: {
      tasks: {
        select: { id: true, status: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createProject(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const color = (formData.get('color') as string) || '#3b82f6';

  if (!title || title.trim() === '') {
    throw new Error('Titlul proiectului este obligatoriu.');
  }

  await prisma.project.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      color,
    },
  });

  revalidatePath('/');
}

export async function deleteProject(id: string) {
  await prisma.project.delete({
    where: { id },
  });
  revalidatePath('/');
}

// ================= TASKS ACTIONS =================

export async function getTasks(projectId?: string, priority?: string, search?: string) {
  await seedInitialDataIfEmpty();

  const where: any = {};

  if (projectId && projectId !== 'ALL') {
    where.projectId = projectId;
  }

  if (priority && priority !== 'ALL') {
    where.priority = priority;
  }

  if (search && search.trim() !== '') {
    where.OR = [
      { title: { contains: search.trim() } },
      { description: { contains: search.trim() } },
    ];
  }

  return prisma.task.findMany({
    where,
    include: {
      project: {
        select: { id: true, title: true, color: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createTask(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const projectId = formData.get('projectId') as string;
  const priority = (formData.get('priority') as string) || 'MEDIUM';
  const status = (formData.get('status') as string) || 'TODO';
  const dueDateStr = formData.get('dueDate') as string;

  if (!title || title.trim() === '') {
    throw new Error('Titlul sarcinii este obligatoriu.');
  }

  if (!projectId) {
    throw new Error('Trebuie să selectezi un proiect.');
  }

  await prisma.task.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      projectId,
      priority,
      status,
      dueDate: dueDateStr ? new Date(dueDateStr) : null,
    },
  });

  revalidatePath('/');
}

export async function updateTaskStatus(id: string, status: 'TODO' | 'IN_PROGRESS' | 'DONE') {
  await prisma.task.update({
    where: { id },
    data: { status },
  });
  revalidatePath('/');
}

export async function deleteTask(id: string) {
  await prisma.task.delete({
    where: { id },
  });
  revalidatePath('/');
}

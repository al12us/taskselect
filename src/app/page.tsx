import { getProjects, getTasks } from './actions';
import DashboardView from '@/components/DashboardView';

interface PageProps {
  searchParams?: Promise<{
    project?: string;
    priority?: string;
    search?: string;
  }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const initialProjectId = resolvedParams.project || 'ALL';
  const initialPriority = resolvedParams.priority || 'ALL';
  const initialSearch = resolvedParams.search || '';

  // Server-side data fetching cu filtrare directă în Prisma / SQLite
  const [projects, tasks] = await Promise.all([
    getProjects(),
    getTasks(initialProjectId, initialPriority, initialSearch),
  ]);

  return (
    <DashboardView
      projects={projects}
      initialTasks={tasks}
      initialProjectId={initialProjectId}
      initialPriority={initialPriority}
      initialSearch={initialSearch}
    />
  );
}

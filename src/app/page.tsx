import { getProjects, getTasks } from './actions';
import DashboardView from '@/components/DashboardView';

export default async function HomePage() {
  const [projects, tasks] = await Promise.all([
    getProjects(),
    getTasks(),
  ]);

  return <DashboardView projects={projects} tasks={tasks} />;
}

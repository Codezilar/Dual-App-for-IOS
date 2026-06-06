import { WorkspaceDashboard } from "@/components/dashboard/workspace-dashboard";
import { requireUser } from "@/lib/auth";

export default async function Home() {
  await requireUser();
  return <WorkspaceDashboard />;
}

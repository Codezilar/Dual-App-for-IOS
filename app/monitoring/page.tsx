import { MonitoringPage } from "@/components/dashboard/pages/monitoring-page";
import { requireUser } from "@/lib/auth";

export default async function Page() {
  await requireUser();
  return <MonitoringPage />;
}

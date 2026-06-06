import { InstancesPage } from "@/components/dashboard/pages/instances-page";
import { requireUser } from "@/lib/auth";

export default async function Page() {
  await requireUser();
  return <InstancesPage />;
}

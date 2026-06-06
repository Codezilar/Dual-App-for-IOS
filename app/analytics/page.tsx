import { AnalyticsPage } from "@/components/dashboard/pages/analytics-page";
import { requireUser } from "@/lib/auth";

export default async function Page() {
  await requireUser();
  return <AnalyticsPage />;
}

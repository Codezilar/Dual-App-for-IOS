import { SecurityPage } from "@/components/dashboard/pages/security-page";
import { requireUser } from "@/lib/auth";

export default async function Page() {
  await requireUser();
  return <SecurityPage />;
}

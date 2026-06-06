import { UsersPage } from "@/components/dashboard/pages/users-page";
import { requireUser } from "@/lib/auth";

export default async function Page() {
  await requireUser();
  return <UsersPage />;
}

import { BarChart3, Cpu, Server, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const adminItems = [
  { label: "Users", value: "42", detail: "8 admins, 34 members", icon: Users },
  { label: "Workspaces", value: "9", detail: "3 over 100 profiles", icon: Server },
  { label: "Storage usage", value: "71%", detail: "Profile cache + exports", icon: BarChart3 },
  { label: "Active containers", value: "128", detail: "Across all clusters", icon: Cpu }
];

export function AdminPanel() {
  return (
    <section className="grid gap-4 xl:grid-cols-4">
      {adminItems.map((item) => (
        <Card key={item.label} className="bg-card/80 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <item.icon className="h-4 w-4 text-primary" />
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{item.value}</p>
            <p className="text-xs text-muted-foreground">{item.detail}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

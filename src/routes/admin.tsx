import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/site/admin/AdminDashboard";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Staff Console | ICSR" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: () => <AdminDashboard />,
});

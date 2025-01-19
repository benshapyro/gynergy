import { Metadata } from "next";
import "./dashboard.css";

export const metadata: Metadata = {
  title: "Dashboard | Gynergy Journal",
  description: "Your daily journal dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <main>{children}</main>
    </div>
  );
} 
import DashboardLayout from "@/layout/AdminLayout/Admin/adminsidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
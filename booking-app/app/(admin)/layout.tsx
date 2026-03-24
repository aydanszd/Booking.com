import DashboardLayout from "@/layout/AdminLayout/Admin/adminsidebar";
import ProtectAdmin from "@/components/ProtectAdmin";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectAdmin>
            <DashboardLayout>{children}</DashboardLayout>
        </ProtectAdmin>
    );
}
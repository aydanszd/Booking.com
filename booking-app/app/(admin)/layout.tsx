import AdminSidebar from "@/layout/AdminLayout/Admin/adminsidebar";
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
                {children}
        </div>
    );
}
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "./_components/sidebar";
import Navbar from "./_components/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="font-mont">
      <AdminSidebar />
      <div className="flex-1 flex flex-col w-full">
        <Navbar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}

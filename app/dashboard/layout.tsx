import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "./_components/sidebar";
import Image from "next/image";
// import Navbar from "./_components/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="font-mont">
      <AdminSidebar />
      <div className="flex-1 flex flex-col w-full">
        {/* <Navbar /> */}
        <div className=" flex items-center md:hidden">
          <div className="absolute top-4 left-4 z-20">
            {" "}
            <div className="bg-[#A020F0] w-fit rounded-full p-1.5 flex items-center justify-center">
              <Image
                src="/mantleLogo.png"
                alt="Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain bg-white rounded-full p-0.5"
              />
            </div>
          </div>
          <div className="absolute top-4 right-4 z-20">
            <div className=" rounded-full border w-fit border-[#A020F0] p-2">
              <SidebarTrigger
                className="lg:hidden p-2 hover:bg-emerald-500/10 cursor-pointer rounded-md text-[#A020F0]  hover:text-emerald-500  transition-all"
                size={"lg"}
              />
            </div>
          </div>
        </div>
        <main className="flex-1 overflow-auto p-6 md:p-14 md:pt-10 pt-20">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}

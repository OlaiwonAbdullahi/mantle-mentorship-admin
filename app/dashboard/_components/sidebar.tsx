"use client";

import {
  IconLayoutDashboard,
  IconLogout,
  IconCalendarBolt,
  IconMailSpark,
  IconReportMoney,
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Image from "next/image";

// Menu items with Tabler icons
const items = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: IconLayoutDashboard,
  },
  {
    title: "Programs",
    url: "/dashboard/programs",
    icon: IconCalendarBolt,
  },
  {
    title: "Contact Us",
    url: "/dashboard/contact",
    icon: IconMailSpark,
  },

  {
    title: "Sales",
    url: "/dashboard/sales",
    icon: IconReportMoney,
  },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(url);
  };
  return (
    <Sidebar className="border-r border-neutral-500 bg-[#008000]">
      <SidebarContent className="flex flex-col h-full bg-[#008000]">
        <SidebarGroup className="px-0">
          <SidebarHeader className="flex flex-row  justify-between items-center py-2 border-b border-neutral-500">
            <Image
              src="/mantleLogo.png"
              alt="Logo"
              width={80}
              height={80}
              className="w-15 h-15  "
            />
            <div className="">
              <p className="text-neutral-300 sora">The Mantle Mentoship</p>
            </div>
          </SidebarHeader>

          {/* Menu Items */}
          <SidebarGroupContent className=" px-2 py-2">
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`
                        group/item
                        transition-all
                        duration-200
                        rounded-md
                        px-3
                        py-2.5
                        group-data-[collapsible=icon]:justify-center
                        ${
                          active
                            ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/10 hover:text-gray-300"
                            : "text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-500"
                        }
                      `}
                      tooltip={item.title}
                    >
                      <a href={item.url} className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 shrink-0" stroke={1.5} />
                        <span className="group-data-[collapsible=icon]:hidden font-medium">
                          {item.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter className="mt-auto border-t border-neutral-500">
          <SidebarMenu className="px-2 py-2">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="group/item hover:bg-emerald-500/10 hover:text-emerald-500 text-gray-300 transition-all duration-200 rounded-lg px-3 py-2.5 data-[active=true]:bg-emerald-500 data-[active=true]:text-white group-data-[collapsible=icon]:justify-center"
                tooltip="Logout"
              >
                <a href="#" className="flex items-center gap-3">
                  <IconLogout className="w-5 h-5 shrink-0" stroke={1.5} />
                  <span className="group-data-[collapsible=icon]:hidden font-medium">
                    Logout
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;

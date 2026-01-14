"use client";

import {
  IconLayoutDashboard,
  IconLogout,
  IconCalendarBolt,
  IconMailSpark,
  IconReportMoney,
  IconMailPause,
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
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
    title: "Waitlists",
    url: "/dashboard/waitlists",
    icon: IconMailPause,
  },
  {
    title: "Sales",
    url: "/dashboard/sales",
    icon: IconReportMoney,
  },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(url);
  };

  const [data, setData] = useState<{ name: string; email: string } | null>(
    null
  );

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setData(result.data);
          } else if (result.name) {
            setData(result);
          }
        }
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_name");
    localStorage.removeItem("admin_data");
    document.cookie =
      "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/");
  };

  return (
    <Sidebar className="border-r border-neutral-200 dark:border-neutral-800">
      <SidebarContent className="flex flex-col h-full bg-white dark:bg-neutral-950">
        <SidebarGroup className="px-0">
          <SidebarHeader className="flex border-b border-neutral-100 flex-row space-x-3 items-center px-4 py-6">
            <div className="bg-[#008000] rounded-full p-1.5 flex items-center justify-center">
              <Image
                src="/mantleLogo.png"
                alt="Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain bg-white rounded-full p-0.5"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-neutral-900 dark:text-neutral-100 font-bold sora tracking-tight leading-tight">
                Mantle
              </p>
              <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-widest">
                Mentorship Admin
              </p>
            </div>
          </SidebarHeader>

          {/* Menu Items */}
          <SidebarGroupContent className="px-3 pb-2 pt-6">
            <SidebarMenu className="space-y-1.5">
              {items.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "group/item transition-all duration-200 rounded-lg px-3 py-3 h-auto",
                        active
                          ? "bg-[#008000] text-white hover:bg-[#006000] hover:text-white"
                          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                      )}
                      tooltip={item.title}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon
                          className={cn(
                            "w-5 h-5 shrink-0 transition-transform duration-200 group-hover/item:scale-110",
                            active
                              ? "text-white"
                              : "text-neutral-500 dark:text-neutral-400"
                          )}
                          stroke={1.5}
                        />
                        <span className="group-data-[collapsible=icon]:hidden ">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarFooter className="mt-auto px-2 py-4 border-t border-neutral-100 dark:border-neutral-900">
          <div className="flex flex-row gap-4">
            {data && (
              <div className="flex items-center gap-3 px-2">
                <Avatar className="w-10 h-10 border-2 border-emerald-500/20 shadow-sm">
                  <AvatarImage
                    src={`https://api.dicebear.com/9.x/glass/svg?seed=${data.name}`}
                  />
                  <AvatarFallback className="bg-emerald-500 text-white font-bold">
                    {data.name?.[0]?.toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
                  <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                    {data.name}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {data.email.slice(0, 15)}...
                  </p>
                </div>
              </div>
            )}

            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="w-full h-fit flex items-center justify-start gap-3 px-3 py-6 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 transition-colors rounded-lg group"
                  tooltip="Logout"
                >
                  <IconLogout
                    className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-0.5"
                    stroke={1.5}
                  />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;

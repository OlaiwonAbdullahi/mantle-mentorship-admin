"use client";

import { useState, useEffect } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";

interface NavbarProps {
  userName?: string;
}
const Navbar = ({ userName = "John" }: NavbarProps) => {
  const [data, setData] = useState<{ name: string; email: string } | null>(
    null
  );

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        console.log(token);
        if (!token) return;

        const response = await fetch(
          "https://mentle-mentorship-backend.onrender.com/api/auth/me",
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
            // Fallback if structure is different
            setData(result);
          }
        }
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <nav className="bg-[#008000] border-b border-neutral-700 z-20 px-6 py-5 sticky top-0 ">
      <div className="flex items-center justify-between gap-6">
        <div className=" flex md:hidden items-center gap-2 justify-between w-full">
          <Image src="/mantleLogo.png" alt="logo" width={50} height={50} />
          <div className=" rounded-full border">
            <SidebarTrigger
              className="lg:hidden p-2 hover:bg-emerald-500/10 cursor-pointer rounded-md text-gray-300  hover:text-emerald-500  transition-all"
              size={"lg"}
            />
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2"></div>
        <div className="hidden items-center gap-4 md:flex">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 cursor-pointer ring-2 ring-transparent hover:ring-emerald-500/50 transition-all">
              <AvatarImage
                src={`https://api.dicebear.com/9.x/glass/svg?seed=${
                  data?.name || userName
                }`}
              />
              <AvatarFallback className="bg-linear-to-br from-emerald-500 to-emerald-600 text-white font-semibold">
                {(data?.name || userName).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="">
              {" "}
              {data && (
                <div className="hidden md:flex flex-col items-start">
                  <p className="text-sm font-semibold text-white">
                    {data.name}
                  </p>
                  <p className="text-xs text-emerald-100/80">{data.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

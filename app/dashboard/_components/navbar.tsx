"use client";

import { IconSearch } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface NavbarProps {
  userName?: string;
}

const Navbar = ({ userName = "John" }: NavbarProps) => {
  return (
    <nav className="bg-[#008000] border-b border-neutral-700 px-6 py-5 sticky top-0 z-10">
      <div className="flex items-center justify-between gap-6">
        {/* Mobile Sidebar Toggle */}
        <SidebarTrigger
          className="lg:hidden p-2 hover:bg-emerald-500/10 cursor-pointer rounded-md text-gray-300  hover:text-emerald-500  transition-all"
          size={"lg"}
        />

        {/* Search Bar */}
        <div className=""></div>

        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-[#008000] border border-neutral-500 text-gray-100 placeholder-gray-400 rounded-lg pl-11 pr-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
          </div>
          {/* Divider */}
          <div className="w-px h-8 bg-gray-500"></div>

          {/* User Section */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none focus:ring-2 focus:ring-emerald-500/20 rounded-full">
                <Avatar className="w-10 h-10 cursor-pointer ring-2 ring-transparent hover:ring-emerald-500/50 transition-all">
                  <AvatarImage
                    src={`https://api.dicebear.com/9.x/glass/svg?seed=${userName}`}
                  />
                  <AvatarFallback className="bg-linear-to-br from-emerald-500 to-emerald-600 text-white font-semibold">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 bg-[#008000] border-gray-500 text-gray-100"
              >
                <DropdownMenuLabel className="text-white">
                  <div>
                    <p className="font-medium">{userName}</p>
                    <p className="text-gray-400 text-sm font-normal">
                      owner@escro.com
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-gray-500" />

                <DropdownMenuItem className="text-gray-300 focus:bg-emerald-500/50 focus:text-emerald-500 cursor-pointer">
                  <a href="/mystore/profile" className="w-full">
                    Profile Settings
                  </a>
                </DropdownMenuItem>

                <DropdownMenuItem className="text-gray-300 focus:bg-emerald-500/50 focus:text-emerald-500 cursor-pointer">
                  <a href="/mystore/settings" className="w-full">
                    Store Settings
                  </a>
                </DropdownMenuItem>

                <DropdownMenuItem className="text-gray-300 focus:bg-emerald-500/50 focus:text-emerald-500 cursor-pointer">
                  <a href="#" className="w-full">
                    Billing
                  </a>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-gray-500" />

                <DropdownMenuItem className="text-error-main focus:bg-emerald-500 focus:text-emerald-500 cursor-pointer">
                  <a href="#" className="w-full">
                    Sign Out
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  IconSearch,
  IconMail,
  IconLoader,
  IconCalendar,
} from "@tabler/icons-react";
import { toast } from "sonner";

interface WaitlistEntry {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

const Page = () => {
  const [data, setData] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchWaitlist = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/waitlist`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success && Array.isArray(result.data)) {
            setData(result.data);
          }
        } else {
          toast.error("Failed to fetch waitlist data");
        }
      } catch (error) {
        console.error("Error fetching waitlist:", error);
        toast.error("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchWaitlist();
  }, []);

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-sora tracking-tight text-foreground">
            Waitlist
          </h1>
          <p className="text-muted-foreground mt-1 font-nunito">
            View and manage users who have joined the waitlist.
          </p>
        </div>
        <div className="relative w-full md:w-auto min-w-[300px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <IconSearch size={18} />
          </div>
          <Input
            placeholder="Search by name or email..."
            className="pl-10 bg-card border-border/60 focus-visible:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[300px] font-sora">User</TableHead>
              <TableHead className="font-sora">Email</TableHead>
              <TableHead className="font-sora">Joined Date</TableHead>
              <TableHead className="text-right font-sora">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <IconLoader className="animate-spin" size={20} />
                    <span>Loading waitlist data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow
                  key={item._id}
                  className="group hover:bg-muted/50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border/50">
                        <AvatarImage
                          src={`https://api.dicebear.com/9.x/glass/svg?seed=${item.name}`}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {item.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground font-sora">
                          {item.name}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground font-nunito">
                      <IconMail size={16} />
                      {item.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground font-nunito">
                      <IconCalendar size={16} />
                      {item.createdAt.slice(0, 10)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="secondary"
                      className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20"
                    >
                      Active
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No waitlist entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-xs text-muted-foreground text-center">
        Showing {filteredData.length} entries
      </div>
    </div>
  );
};

export default Page;

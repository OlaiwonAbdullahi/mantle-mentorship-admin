"use client";

import React, { useState, useEffect } from "react";
import {
  IconSchool,
  IconCreditCard,
  IconWallet,
  IconLoader,
  IconAlertCircle,
  IconMessage,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface DashboardStats {
  courses: {
    total: number;
  };
  messages: {
    total: number;
    unread: number;
    read: number;
  };
  payments: {
    total: number;
    successful: number;
    pending: number;
    failed: number;
  };
  enrollments: {
    total: number;
    pending: number;
  };
}

const Overview = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) {
          // Handle no token case if needed, or just let it fail/show empty
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setStats(result.data);
          } else {
            console.error("Unexpected data format:", result);
            setError("Failed to load dashboard data.");
          }
        } else {
          setError("Failed to fetch statistics.");
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center w-full bg-card/30 rounded-xl border border-dashed border-border/50">
        <div className="flex flex-col items-center gap-2 text-muted-foreground animate-pulse">
          <IconLoader className="animate-spin" size={24} />
          <span className="text-sm font-medium">Loading overview...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-40 items-center justify-center w-full bg-destructive/5 rounded-xl border border-destructive/20">
        <div className="flex flex-col items-center gap-2 text-destructive">
          <IconAlertCircle size={24} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Programs",
      value: stats?.courses?.total || 0,
      icon: IconSchool,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
      border: "border-indigo-100 dark:border-indigo-500/20",
      trend: "+1 this month", // Placeholder trend
    },
    {
      title: "Messages",
      value: stats?.messages?.total || 0,
      subValue: `${stats?.messages?.unread || 0} unread`,
      icon: IconMessage,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-500/10",
      border: "border-rose-100 dark:border-rose-500/20",
      trend: "User inquiries",
    },
    {
      title: "Payments",
      value: stats?.payments?.total,
      icon: IconCreditCard,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      border: "border-amber-100 dark:border-amber-500/20",
      trend: "Successful",
    },
    {
      title: "Enrollments",
      value: stats?.enrollments?.total || 0,
      subValue: `${stats?.enrollments?.pending || 0} pending`,
      icon: IconWallet,
      color: "text-teal-600 dark:text-teal-400",
      bg: "bg-teal-50 dark:bg-teal-500/10",
      border: "border-teal-100 dark:border-teal-500/20",
      trend: "+0% vs last month", // Placeholder
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={cn(
            "p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card relative overflow-hidden group",
            card.border,
            card.bg
          )}
        >
          <div className={cn("absolute right-0 top-0 p-4 opacity-5", card.bg)}>
            <card.icon size={80} className={card.color} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div
                className={cn(
                  "p-2.5 rounded-xl border",
                  card.color,
                  card.border,
                  card.bg
                )}
              >
                <card.icon size={22} className="stroke-[1.5]" />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground font-nunito">
                {card.title}
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-foreground font-sora tracking-tight">
                  {card.value}
                </h3>
                {card.subValue && (
                  <span className="text-xs font-medium text-muted-foreground/80">
                    {card.subValue}
                  </span>
                )}
              </div>
            </div>

            {/* Footer info (optional - using trend placeholder) */}
            {/*
            <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-muted-foreground/80">
              <IconTrendingUp size={14} className="text-emerald-500" />
              <span>{card.trend}</span>
            </div>
            */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Overview;

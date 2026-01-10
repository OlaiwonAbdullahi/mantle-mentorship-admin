"use client";

import React, { useEffect, useState } from "react";
import {
  IconMessage,
  IconSchool,
  IconCalendar,
  IconUser,
  IconLoader,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface Course {
  _id: string;
  title: string;
  price_in_ngn: number;
  classSize: number;
  mode: string;
  createdAt: string;
  isPublished: boolean;
}

interface Payment {
  _id: string;
}

interface ActivitiesData {
  messages: Message[];
  courses: Course[];
  payments: Payment[];
}

const RecentActivities = () => {
  const [data, setData] = useState<ActivitiesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) return;

        const response = await fetch(
          "https://mentle-mentorship-backend.onrender.com/api/dashboard/recent-activities",
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
          }
        }
      } catch (error) {
        console.error("Failed to fetch recent activities", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-[400px] w-full bg-card/30 rounded-xl border border-dashed border-border/50 flex items-center justify-center animate-pulse"
          >
            <IconLoader className="animate-spin text-muted-foreground" />
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Messages Section */}
      <div className="bg-card border rounded-2xl p-6 shadow-xs flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-50 dark:bg-rose-500/10 rounded-lg text-rose-600 dark:text-rose-400">
              <IconMessage size={20} strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-bold font-sora">Recent Inquiries</h2>
          </div>
          <Badge variant="secondary" className="font-nunito">
            {data.messages.length} New
          </Badge>
        </div>
        <div className="border-b mb-4 border-dashed"></div>

        <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
          {data.messages.length > 0 ? (
            data.messages.map((msg) => (
              <div
                key={msg._id}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50 group"
              >
                <Avatar className="h-9 w-9 border border-border/50">
                  <AvatarImage
                    src={`https://api.dicebear.com/9.x/glass/svg?seed=${msg.name}`}
                  />
                  <AvatarFallback>{msg.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p
                      className={`text-sm truncate ${
                        !msg.isRead
                          ? "font-bold text-foreground"
                          : "font-medium text-foreground/80"
                      }`}
                    >
                      {msg.name}
                    </p>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p
                    className={`text-xs truncate font-nunito ${
                      !msg.isRead
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {msg.message}
                  </p>
                </div>
                {!msg.isRead && (
                  <div className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0 animate-pulse" />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-muted-foreground text-sm">
              No recent messages
            </div>
          )}
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-6 shadow-xs flex flex-col h-full">
        <div className="flex items-center justify-between mb-4 ">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
              <IconSchool size={20} strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-bold font-sora">Latest Programs</h2>
          </div>
          <Badge variant="outline" className="font-nunito">
            {data.courses.length} Active
          </Badge>
        </div>
        <div className="border-b mb-4 border-dashed"></div>

        <div className="space-y-4">
          {data.courses.length > 0 ? (
            data.courses.map((course) => (
              <div
                key={course._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border bg-card/50 hover:bg-accent/5 transition-all gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <IconSchool size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm font-sora text-foreground line-clamp-1">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <IconUser size={12} /> {course.classSize} students
                      </span>
                      <span className="flex items-center gap-1">
                        <IconCalendar size={12} /> {course.mode}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-auto w-full">
                  <div className="text-right">
                    <p className="font-bold text-sm text-foreground">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      }).format(course.price_in_ngn)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Price</p>
                  </div>
                  <Badge
                    variant={course.isPublished ? "default" : "secondary"}
                    className="shrink-0"
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-muted-foreground text-sm">
              No courses found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;

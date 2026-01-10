"use client";

import React, { useState, useEffect } from "react";
import { IconSearch, IconMail, IconTrash, IconEye } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const ContactPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) return;

        const response = await fetch(
          "https://mentle-mentorship-backend.onrender.com/api/contact/messages",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success && Array.isArray(result.data)) {
            setMessages(result.data);
          } else {
            console.error("Unexpected response format:", result);
          }
        }
      } catch (error) {
        console.error("Failed to fetch messages", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor(
          Math.abs(now.getTime() - date.getTime()) / 60000
        );
        return `${diffInMinutes} mins ago`;
      }
      return `${Math.floor(diffInHours)} hours ago`;
    }
    // If more than 24 hours, show date
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 md:p-10 space-y-8 bg-background min-h-screen animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold sora tracking-tight text-foreground">
            Contact Messages
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage inquiries from the website contact form.
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

      {/* Messages List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">
            Loading messages...
          </div>
        ) : filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => (
            <div
              key={msg._id}
              className="group relative bg-card hover:bg-accent/5 transition-all duration-300 border border-border/50 rounded-xl p-5 shadow-sm hover:shadow-md flex flex-col md:flex-row gap-5 items-start md:items-center"
            >
              <Avatar className="w-10 h-10 cursor-pointer ring-2 ring-transparent hover:ring-emerald-500/50 transition-all">
                <AvatarImage
                  src={`https://api.dicebear.com/9.x/glass/svg?seed=${msg?.name}`}
                />
                <AvatarFallback className="bg-linear-to-br from-emerald-500 to-emerald-600 text-white font-semibold">
                  {msg?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Content */}
              <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-4 w-full">
                <div className="md:col-span-3">
                  <h3 className="font-semibold text-foreground truncate font-sora">
                    {msg.name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate font-nunito flex items-center gap-1.5 mt-0.5">
                    <IconMail size={14} />
                    {msg.email}
                  </p>
                </div>

                <div className="md:col-span-7">
                  <p className="text-muted-foreground text-sm line-clamp-2 font-nunito leading-relaxed">
                    {msg.message.slice(0, 50) + "..."}
                  </p>
                </div>

                <div className="md:col-span-2 flex md:justify-end items-center gap-2 text-xs text-muted-foreground font-medium">
                  {formatDate(msg.createdAt)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 md:static md:w-auto">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-full"
                    >
                      <IconEye size={18} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-xl font-sora">
                        Message Details
                      </DialogTitle>
                      <DialogDescription>
                        Sent by{" "}
                        <span className="font-medium text-foreground">
                          {msg.name}
                        </span>{" "}
                        ({msg.email})
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border/40">
                      <p className="text-sm text-foreground/80 leading-relaxed font-nunito whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                    <div className="flex justify-end mt-4 text-xs text-muted-foreground">
                      Received {new Date(msg.createdAt).toLocaleString()}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive rounded-full"
                  onClick={async () => {
                    const token = localStorage.getItem("admin_token");
                    if (!token) return;

                    try {
                      const response = await fetch(
                        `https://mentle-mentorship-backend.onrender.com/api/contact/messages/${msg._id}`,
                        {
                          method: "DELETE",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );

                      if (response.ok) {
                        setMessages((prev) =>
                          prev.filter((m) => m._id !== msg._id)
                        );
                      } else {
                        console.error("Failed to delete message");
                      }
                    } catch (error) {
                      console.error("Error deleting message", error);
                    }
                  }}
                >
                  <IconTrash size={18} />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-card/30 rounded-2xl border border-dashed border-border/60">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <IconMail
                className="text-muted-foreground opacity-50"
                size={32}
              />
            </div>
            <h3 className="text-lg font-semibold text-foreground font-sora">
              No messages found
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto mt-1 font-nunito">
              We couldn&apos;t find any messages matching &quot;{searchTerm}
              &quot;. Try adjusting your search or check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactPage;

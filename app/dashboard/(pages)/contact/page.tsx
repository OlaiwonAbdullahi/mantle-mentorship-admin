"use client";

import React, { useState } from "react";
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

// Mock Data
const CONTACT_DATA = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    message:
      "Hi, I'm interested in the mentorship program. Can you provide more details about the curriculum and the start dates?",
    date: "2 hours ago",
    avatarColor: "bg-blue-500",
  },
  {
    id: 2,
    name: "Sarah Smith",
    email: "sarah.smith@design.co",
    message:
      "I is currently trying to access the student portal but I am getting a 403 error. Can you please check my account status?",
    date: "1 day ago",
    avatarColor: "bg-purple-500",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "m.brown@tech.net",
    message:
      "Just wanted to say the new curriculum looks amazing! The dynamic animations section is exactly what I was looking for.",
    date: "2 days ago",
    avatarColor: "bg-emerald-500",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.d@school.edu",
    message:
      "Is there a scholarship available for the upcoming cohort? I assume there is some financial aid process.",
    date: "3 days ago",
    avatarColor: "bg-orange-500",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.w@freemail.com",
    message:
      "I am trying to submit my assignment but the button is disabled. It might be a browser issue on my end but thought I'd report it.",
    date: "1 week ago",
    avatarColor: "bg-pink-500",
  },
];

const ContactPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState(CONTACT_DATA);

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className="group relative bg-card hover:bg-accent/5 transition-all duration-300 border border-border/50 rounded-xl p-5 shadow-sm hover:shadow-md flex flex-col md:flex-row gap-5 items-start md:items-center"
            >
              {/* Avatar / Initials */}
              <div
                className={`w-12 h-12 rounded-full bg-[#008000] flex items-center justify-center text-white font-bold text-lg shadow-inner shrink-0`}
              >
                {msg.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

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
                    {msg.message}
                  </p>
                </div>

                <div className="md:col-span-2 flex md:justify-end items-center gap-2 text-xs text-muted-foreground font-medium">
                  {msg.date}
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
                      Received {msg.date}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive rounded-full"
                  onClick={() => {
                    // In a real app, delete logic here
                    const newMessages = messages.filter((m) => m.id !== msg.id);
                    setMessages(newMessages);
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

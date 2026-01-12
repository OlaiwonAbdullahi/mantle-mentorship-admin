"use client";

import React from "react";
import { IconArrowLeft } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const SalesPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4 space-y-8 animate-in fade-in zoom-in duration-700">
      <div className="space-y-4 max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-widest uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Section in Development
        </div>
        <h1 className="text-4xl md:text-5xl font-bold sora tracking-tight text-neutral-900 dark:text-neutral-100">
          Sales Analytics <br />
          <span className="text-[#008000]">Coming Soon</span>
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
          We&apos;re Building a powerful suite of financial tools to help you
          track revenue, manage enrollments, and analyze your program&apos;s
          growth in real-time.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full max-w-md">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="flex-1 h-12 text-base font-bold rounded-lg shadow-none border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <IconArrowLeft className="mr-2 w-5 h-5 text-neutral-400" />
          Go Back
        </Button>
        <Button
          onClick={() => router.push("/dashboard")}
          className="flex-1 h-12 text-base font-bold rounded-lg bg-[#008000] hover:bg-[#006000] text-white transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          Dashboard Overview
        </Button>
      </div>

      <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-2xl border-t border-neutral-100 dark:border-neutral-800/50">
        {[
          { label: "Revenue Tracking", status: "In Progress" },
          { label: "Enrollment Data", status: "Planning" },
          { label: "Export Reports", status: "Queued" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {item.label}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesPage;

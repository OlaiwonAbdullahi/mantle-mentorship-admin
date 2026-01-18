"use client";

import React, { useState, useEffect } from "react";
import {
  IconSearch,
  IconEye,
  IconDownload,
  IconExternalLink,
  IconMapPin,
  IconSchool,
  IconCalendar,
  IconCheck,
  IconX,
  IconLoader,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
};

interface Course {
  _id: string;
  title: string;
  price_in_ngn: number;
  price_in_euro: number;
}

interface Enrollment {
  _id: string;
  course: Course;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  educationLevel: string;
  linkedInProfile: string;
  serviceOffering: string;
  motivation: string;
  expectedOutcomes: string;
  challenges: string;
  successMeasurement: string;
  furtherQuestions: string;
  willingToAttendNext: boolean;
  feeCommitment: boolean;
  status: "pending" | "paid" | "declined" | "failed";
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  paystackReference?: string;
  paidAt?: string;
  receiptUrl?: string;
}

const SalesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");
      if (!token) {
        toast.error("Not authenticated");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/enrollments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setEnrollments(result.data);
        }
      } else {
        toast.error("Failed to fetch enrollments");
      }
    } catch (error) {
      console.error("Failed to fetch enrollments", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      setStatusUpdating(true);
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/enrollments/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (response.ok) {
        toast.success(`Enrollment marked as ${newStatus}`);
        await fetchEnrollments();
        setIsSheetOpen(false);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status", error);
      toast.error("Something went wrong");
    } finally {
      setStatusUpdating(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleViewDetails = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsSheetOpen(true);
  };

  const filteredEnrollments = enrollments.filter(
    (e) =>
      e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.course.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20">
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20">
            Pending
          </Badge>
        );
      case "declined":
      case "failed":
        return (
          <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 bg-background min-h-screen animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold sora tracking-tight text-foreground">
            Sales & Enrollments
          </h1>
          <p className="text-muted-foreground mt-1 font-nunito">
            Monitor course registrations, payments, and student details.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-auto min-w-[300px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <IconSearch size={18} />
            </div>
            <Input
              placeholder="Search by name, email or course..."
              className="pl-10 bg-card border-border/60 focus-visible:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={fetchEnrollments}
            className="border-border/60"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="font-semibold py-4">Student Name</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Location</TableHead>
              <TableHead className="font-semibold">Course</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <IconLoader size={20} className="animate-spin" />
                    <p>Loading enrollments...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredEnrollments.length > 0 ? (
              filteredEnrollments.map((enrollment) => (
                <TableRow
                  key={enrollment._id}
                  className="group hover:bg-muted/30 border-border/40 transition-colors"
                >
                  <TableCell className="font-medium py-4">
                    {enrollment.fullName}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-nunito">
                    {enrollment.email}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <IconMapPin size={14} className="text-muted-foreground" />
                      {enrollment.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate font-medium">
                      {enrollment.course?.title || enrollment.serviceOffering}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(enrollment.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-primary hover:bg-primary/5 gap-2"
                      onClick={() => handleViewDetails(enrollment)}
                    >
                      <IconEye size={16} />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <IconSearch size={32} className="opacity-20" />
                    <p>No enrollments found matching your search.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto scrollbar-hide p-2">
          <SheetHeader className="mb-8">
            <SheetTitle className="text-2xl font-bold sora">
              Enrollment Details
            </SheetTitle>
            <SheetDescription>
              Full information and actions for this enrollment.
            </SheetDescription>
          </SheetHeader>

          {selectedEnrollment && (
            <div className="space-y-8 p-4">
              {/* Basic Info */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold sora">
                    {selectedEnrollment.fullName}
                  </h3>
                  <p className="text-muted-foreground font-nunito">
                    {selectedEnrollment.email}
                  </p>
                  <p className="text-muted-foreground font-nunito">
                    {selectedEnrollment.phone}
                  </p>
                </div>
                {getStatusBadge(selectedEnrollment.status)}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Education Level
                  </p>
                  <div className="flex items-center gap-2">
                    <IconSchool size={16} className="text-primary" />
                    <p className="font-medium">
                      {selectedEnrollment.educationLevel}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Location
                  </p>
                  <div className="flex items-center gap-2">
                    <IconMapPin size={16} className="text-primary" />
                    <p className="font-medium">{selectedEnrollment.location}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Date Applied
                  </p>
                  <div className="flex items-center gap-2">
                    <IconCalendar size={16} className="text-primary" />
                    <p className="font-medium">
                      {formatDate(selectedEnrollment.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    LinkedIn
                  </p>
                  <a
                    href={selectedEnrollment.linkedInProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline font-medium"
                  >
                    <IconExternalLink size={16} />
                    View Profile
                  </a>
                </div>
              </div>

              {/* Course Info */}
              <div className="p-4 bg-muted/40 rounded-xl border border-border/40">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Selected Program
                </p>
                <h4 className="font-bold text-lg mb-1">
                  {selectedEnrollment.course?.title ||
                    selectedEnrollment.serviceOffering}
                </h4>
                <div className="flex gap-4 mt-2">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Method:</span>{" "}
                    <span className="font-semibold uppercase">
                      {selectedEnrollment.paymentMethod}
                    </span>
                  </p>
                  {selectedEnrollment.paystackReference && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Ref:</span>{" "}
                      <span className="font-mono text-xs">
                        {selectedEnrollment.paystackReference}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Questionnaire Details */}
              <div className="space-y-6 grid grid-cols-3">
                <div>
                  <h4 className="font-semibold mb-2">Motivation</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedEnrollment.motivation}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Expected Outcomes</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedEnrollment.expectedOutcomes}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Current Challenges</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedEnrollment.challenges}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Success Measurement</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedEnrollment.successMeasurement}
                  </p>
                </div>
                {selectedEnrollment.furtherQuestions && (
                  <div>
                    <h4 className="font-semibold mb-2">Further Questions</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedEnrollment.furtherQuestions}
                    </p>
                  </div>
                )}
              </div>

              {/* Commitments */}
              <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-6">
                <div className="flex items-center gap-2">
                  {selectedEnrollment.willingToAttendNext ? (
                    <IconCheck size={18} className="text-emerald-500" />
                  ) : (
                    <IconX size={18} className="text-red-500" />
                  )}
                  <p className="text-sm font-medium">Willing to attend next</p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedEnrollment.feeCommitment ? (
                    <IconCheck size={18} className="text-emerald-500" />
                  ) : (
                    <IconX size={18} className="text-red-500" />
                  )}
                  <p className="text-sm font-medium">Fee commitment</p>
                </div>
              </div>

              {/* Receipt Preview */}
              {selectedEnrollment.receiptUrl && (
                <div className="space-y-3 border-t border-border/50 pt-6">
                  <h4 className="font-semibold flex items-center gap-2">
                    <IconExternalLink size={18} className="text-primary" />
                    Payment Receipt Proof
                  </h4>
                  <div className="relative w-full overflow-hidden rounded-xl border border-border/50 bg-muted/30">
                    <img
                      src={selectedEnrollment.receiptUrl}
                      alt="Payment Receipt"
                      className="w-full h-auto object-contain max-h-[400px]"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full gap-2 text-muted-foreground hover:text-primary"
                    asChild
                  >
                    <a
                      href={selectedEnrollment.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconExternalLink size={14} />
                      Open Full Image in New Tab
                    </a>
                  </Button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-border/50">
                {selectedEnrollment.status === "pending" && (
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() =>
                      handleUpdateStatus(selectedEnrollment._id, "failed")
                    }
                    disabled={statusUpdating}
                  >
                    {statusUpdating ? "Updating..." : "Decline Enrollment"}
                  </Button>
                )}
                {selectedEnrollment.status === "pending" && (
                  <Button
                    className="flex-1 bg-[#A020F0] hover:bg-[#006000] text-white"
                    onClick={() =>
                      handleUpdateStatus(selectedEnrollment._id, "paid")
                    }
                    disabled={statusUpdating}
                  >
                    {statusUpdating ? "Updating..." : "Approve Enrollment"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SalesPage;

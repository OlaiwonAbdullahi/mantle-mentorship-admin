"use client";

import React, { useState, useEffect } from "react";
import {
  IconSearch,
  IconPlus,
  IconPencil,
  IconTrash,
  IconFolderOpen,
  IconX,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Assuming this exists or I'll use <textarea> styled like Input
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Course {
  _id: string;
  title: string;
  description: string;
  price_in_euro: number;
  price_in_ngn: number;
  duration: string;
  classSize: number;
  frequency: string;
  mode: string;
  benefits: string[];
  isPublished?: boolean; // Inferred
}

const ProgramsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({
    benefits: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newBenefit, setNewBenefit] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setCourses(result.data);
        } else if (Array.isArray(result)) {
          setCourses(result);
        } else if (result.data) {
          setCourses(result.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch courses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateOrUpdate = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}/courses/${currentCourse._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/courses`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(currentCourse),
      });

      if (response.ok) {
        await fetchCourses();
        toast.success("Program Edited Successfully");
        setIsDialogOpen(false);
        resetForm();
      } else {
        const errorData = await response.json();
        toast.error(
          `Failed to ${isEditing ? "update" : "create"} course: ${
            errorData.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error saving course", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!idToDelete) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/${idToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setCourses((prev) => prev.filter((c) => c._id !== idToDelete));
        toast.success("Course deleted successfully");
        setIsDeleteDialogOpen(false);
        setIdToDelete(null);
      } else {
        toast.error("Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentCourse({ benefits: [] });
    setIsEditing(false);
    setNewBenefit("");
  };

  const openEditDialog = (course: Course) => {
    setCurrentCourse(course);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const addBenefit = () => {
    if (!newBenefit.trim()) return;
    setCurrentCourse((prev) => ({
      ...prev,
      benefits: [...(prev.benefits || []), newBenefit.trim()],
    }));
    setNewBenefit("");
  };

  const removeBenefit = (index: number) => {
    setCurrentCourse((prev) => ({
      ...prev,
      benefits: prev.benefits?.filter((_, i) => i !== index),
    }));
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 bg-background min-h-screen animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold sora tracking-tight text-foreground">
            Programs
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your mentorship programs, curriculum, and pricing.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-auto min-w-[250px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <IconSearch size={18} />
            </div>
            <Input
              placeholder="Search programs..."
              className="pl-10 bg-card border-border/60 focus-visible:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            className="bg-[#008000] hover:bg-[#006000] text-white"
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
          >
            <IconPlus size={18} className="mr-2" />
            Add Program
          </Button>
        </div>
      </div>

      {/* Course List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-20 text-muted-foreground">
            Loading programs...
          </div>
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course._id}
              className="group relative bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-start gap-4">
                  <Badge
                    variant={"default"}
                    className={
                      "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                    }
                  >
                    Published
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => openEditDialog(course)}
                    >
                      <IconPencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => openDeleteDialog(course._id)}
                    >
                      <IconTrash size={16} />
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold sora text-foreground line-clamp-2 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-nunito line-clamp-3">
                    {course.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-sm mt-2">
                  <div className="text-muted-foreground">Duration:</div>
                  <div className="font-medium text-right">
                    {course.duration}
                  </div>

                  <div className="text-muted-foreground">Mode:</div>
                  <div className="font-medium text-right">{course.mode}</div>

                  <div className="text-muted-foreground">Price (NGN):</div>
                  <div className="font-medium text-right">
                    ₦{course.price_in_ngn?.toLocaleString()}
                  </div>

                  <div className="text-muted-foreground">Price (EUR):</div>
                  <div className="font-medium text-right">
                    €{course.price_in_euro?.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-card/30 rounded-2xl border border-dashed border-border/60">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <IconFolderOpen
                className="text-muted-foreground opacity-50"
                size={32}
              />
            </div>
            <h3 className="text-lg font-semibold text-foreground font-sora">
              No programs found
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto mt-1 font-nunito">
              Get started by creating a new mentorship program.
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold sora">
              {isEditing ? "Edit Program" : "Create New Program"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the details of your mentorship program."
                : "Fill in the details to launch a new mentorship program."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Program Title
              </label>
              <Input
                id="title"
                placeholder="e.g. Frontend Web Development"
                value={currentCourse.title || ""}
                onChange={(e) =>
                  setCurrentCourse({ ...currentCourse, title: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Detailed description of the program..."
                value={currentCourse.description || ""}
                onChange={(e) =>
                  setCurrentCourse({
                    ...currentCourse,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="price_ngn" className="text-sm font-medium">
                  Price (NGN)
                </label>
                <Input
                  id="price_ngn"
                  type="number"
                  placeholder="75000"
                  value={currentCourse.price_in_ngn || ""}
                  onChange={(e) =>
                    setCurrentCourse({
                      ...currentCourse,
                      price_in_ngn: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="price_euro" className="text-sm font-medium">
                  Price (EUR)
                </label>
                <Input
                  id="price_euro"
                  type="number"
                  placeholder="750"
                  value={currentCourse.price_in_euro || ""}
                  onChange={(e) =>
                    setCurrentCourse({
                      ...currentCourse,
                      price_in_euro: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="duration" className="text-sm font-medium">
                  Duration
                </label>
                <Input
                  id="duration"
                  placeholder="e.g. 12 weeks"
                  value={currentCourse.duration || ""}
                  onChange={(e) =>
                    setCurrentCourse({
                      ...currentCourse,
                      duration: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="classSize" className="text-sm font-medium">
                  Class Size
                </label>
                <Input
                  id="classSize"
                  type="number"
                  placeholder="e.g. 25"
                  value={currentCourse.classSize || ""}
                  onChange={(e) =>
                    setCurrentCourse({
                      ...currentCourse,
                      classSize: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="frequency" className="text-sm font-medium">
                  Frequency
                </label>
                <Input
                  id="frequency"
                  placeholder="e.g. 3 sessions per week"
                  value={currentCourse.frequency || ""}
                  onChange={(e) =>
                    setCurrentCourse({
                      ...currentCourse,
                      frequency: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="mode" className="text-sm font-medium">
                  Mode
                </label>
                <Select
                  value={currentCourse.mode}
                  onValueChange={(val) =>
                    setCurrentCourse({ ...currentCourse, mode: val })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Physical">Physical</SelectItem>
                    <SelectItem value="Hybrid (Online & Physical)">
                      Hybrid
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Benefits</label>
              <div className="space-y-3">
                {currentCourse.benefits &&
                  currentCourse.benefits.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {currentCourse.benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          <span>{benefit}</span>
                          <button
                            onClick={() => removeBenefit(index)}
                            className="hover:text-destructive"
                          >
                            <IconX size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a benefit (e.g. Certificate of completion)"
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addBenefit();
                      }
                    }}
                  />
                  <Button type="button" onClick={addBenefit} variant="outline">
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateOrUpdate}
              disabled={isSubmitting}
              className="bg-[#008000] hover:bg-[#006000] text-white"
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Program"
                : "Create Program"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold sora text-destructive">
              Delete Program
            </DialogTitle>
            <DialogDescription className="py-2">
              Are you sure you want to delete this program? This action cannot
              be undone and all associated data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 ">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setIdToDelete(null);
              }}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              {isSubmitting ? "Deleting..." : "Delete Program"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProgramsPage;

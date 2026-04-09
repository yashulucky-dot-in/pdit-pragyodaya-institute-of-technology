import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  BookOpen,
  Briefcase,
  CheckCircle,
  Download,
  Edit,
  FileDown,
  GraduationCap,
  Home,
  Link,
  Loader2,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  Save,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type {
  AdmissionRecord,
  Announcement,
  BrochureRequest,
  BrochureUrl,
  ContactRecord,
  Course,
  CourseLead,
  FranchiseLead,
  FranchiseRecord,
  backendInterface as FullBackend,
  UserProfile,
} from "../backend.d";
import type { PageType } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useActor } from "../hooks/useActor";

type SectionType =
  | "dashboard"
  | "students"
  | "admissions"
  | "franchise"
  | "messages"
  | "announcements"
  | "courses"
  | "brochures"
  | "leads"
  | "brochure-urls";

interface AdminPanelProps {
  onNavigate: (page: PageType) => void;
}

function EmptyState({
  icon: Icon,
  message,
}: { icon: React.ElementType; message: string }) {
  return (
    <div className="text-center py-12" data-ocid="admin.empty_state">
      <Icon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}

function formatDate(ts: bigint) {
  try {
    return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
}

// ── CSV Export ────────────────────────────────────────────────────────────────
function exportLeadsCSV(leads: (CourseLead | FranchiseLead)[], filter: string) {
  const rows = leads.map((l) => {
    if ("courseId" in l) {
      return [
        `"${l.name}"`,
        `"${l.email}"`,
        `"${l.phone}"`,
        `"${l.courseName}"`,
        `"${l.message.replace(/"/g, "'")}"`,
        `"${formatDate(l.timestamp)}"`,
        String(Number(l.downloadCount)),
        "Course",
      ];
    }
    return [
      `"${l.name}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      `"${l.city}"`,
      `"${l.investment}"`,
      `"${l.message.replace(/"/g, "'")}"`,
      `"${formatDate(l.timestamp)}"`,
      String(Number(l.downloadCount)),
      "Franchise",
    ];
  });
  const csv = [
    [
      "Name",
      "Email",
      "Phone",
      "Course/City",
      "Details",
      "Message/Investment",
      "Date",
      "Downloads",
      "Type",
    ].join(","),
    ...rows.map((r) => r.join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pdit-leads-${filter}-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Course Modal ────────────────────────────────────────────────────────────────
interface CourseForm {
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  fee: string;
  badge: string;
  topicsRaw: string;
  colorKey: string;
}

const DEFAULT_COURSE_FORM: CourseForm = {
  title: "",
  subtitle: "",
  description: "",
  duration: "",
  fee: "",
  badge: "",
  topicsRaw: "",
  colorKey: "#4F46E5",
};

interface CourseModalProps {
  open: boolean;
  editingCourse: Course | null;
  onClose: () => void;
  onSaved: () => void;
  actor: any;
}

function CourseModal({
  open,
  editingCourse,
  onClose,
  onSaved,
  actor,
}: CourseModalProps) {
  const [form, setForm] = useState<CourseForm>(DEFAULT_COURSE_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingCourse) {
      setForm({
        title: editingCourse.title,
        subtitle: editingCourse.subtitle,
        description: editingCourse.description,
        duration: editingCourse.duration,
        fee: editingCourse.fee,
        badge: editingCourse.badge,
        topicsRaw: editingCourse.topics.join(", "),
        colorKey: editingCourse.colorKey || "#4F46E5",
      });
    } else {
      setForm(DEFAULT_COURSE_FORM);
    }
  }, [editingCourse]);

  const set =
    (field: keyof CourseForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    if (
      !form.title.trim() ||
      !form.subtitle.trim() ||
      !form.description.trim()
    ) {
      toast.error("Title, subtitle, and description are required.");
      return;
    }
    const topics = form.topicsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setSaving(true);
    try {
      if (editingCourse) {
        await actor.updateCourse(
          editingCourse.id,
          form.title.trim(),
          form.subtitle.trim(),
          form.description.trim(),
          form.duration.trim(),
          form.fee.trim(),
          form.badge.trim(),
          topics,
          form.colorKey,
        );
        toast.success("Course updated!");
      } else {
        await actor.createCourse(
          form.title.trim(),
          form.subtitle.trim(),
          form.description.trim(),
          form.duration.trim(),
          form.fee.trim(),
          form.badge.trim(),
          topics,
          form.colorKey,
        );
        toast.success("Course created!");
      }
      onSaved();
      onClose();
    } catch {
      toast.error("Failed to save course.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent
        className="max-w-lg w-full max-h-[90vh] overflow-y-auto"
        data-ocid="admin.courses.dialog"
      >
        <DialogHeader>
          <DialogTitle>
            {editingCourse ? "Edit Course" : "Add New Course"}
          </DialogTitle>
          <DialogDescription>
            {editingCourse
              ? "Update course details below."
              : "Fill in details to create a new course."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. Web Development"
                value={form.title}
                onChange={set("title")}
                className="h-10 rounded-xl"
                data-ocid="admin.courses.title.input"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">
                Subtitle <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. Build beautiful websites"
                value={form.subtitle}
                onChange={set("subtitle")}
                className="h-10 rounded-xl"
                data-ocid="admin.courses.subtitle.input"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Describe the course..."
                value={form.description}
                onChange={set("description")}
                className="rounded-xl resize-none"
                rows={3}
                data-ocid="admin.courses.description.textarea"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">
                Duration
              </Label>
              <Input
                placeholder="e.g. 3 months"
                value={form.duration}
                onChange={set("duration")}
                className="h-10 rounded-xl"
                data-ocid="admin.courses.duration.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Fee</Label>
              <Input
                placeholder="e.g. ₹8,000"
                value={form.fee}
                onChange={set("fee")}
                className="h-10 rounded-xl"
                data-ocid="admin.courses.fee.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Badge</Label>
              <Input
                placeholder="e.g. Popular"
                value={form.badge}
                onChange={set("badge")}
                className="h-10 rounded-xl"
                data-ocid="admin.courses.badge.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.colorKey}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, colorKey: e.target.value }))
                  }
                  className="h-10 w-10 rounded-lg cursor-pointer border border-gray-200"
                  data-ocid="admin.courses.color.input"
                />
                <Input
                  value={form.colorKey}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, colorKey: e.target.value }))
                  }
                  placeholder="#4F46E5"
                  className="h-10 rounded-xl flex-1 font-mono text-sm"
                />
              </div>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">
                Topics{" "}
                <span className="text-gray-400 text-xs font-normal">
                  (comma-separated)
                </span>
              </Label>
              <Textarea
                placeholder="HTML5 & CSS3, JavaScript, React.js, Git & GitHub"
                value={form.topicsRaw}
                onChange={set("topicsRaw")}
                className="rounded-xl resize-none"
                rows={2}
                data-ocid="admin.courses.topics.textarea"
              />
              <p className="text-xs text-gray-400">
                Enter topics separated by commas
              </p>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl"
              data-ocid="admin.courses.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="gradient-primary text-white border-0 rounded-xl hover:opacity-90"
              data-ocid="admin.courses.save_button"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : editingCourse ? (
                "Update Course"
              ) : (
                "Create Course"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Delete Confirm ──────────────────────────────────────────────────────────────
interface DeleteConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  courseName: string;
  deleting: boolean;
}

function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  courseName,
  deleting,
}: DeleteConfirmProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent
        className="max-w-sm"
        data-ocid="admin.courses.delete.dialog"
      >
        <DialogHeader>
          <DialogTitle>Delete Course?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{courseName}</strong>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={deleting}
            className="rounded-xl"
            data-ocid="admin.courses.delete.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 text-white border-0 rounded-xl"
            data-ocid="admin.courses.delete.confirm_button"
          >
            {deleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
              </>
            ) : (
              <>Delete</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────────
export default function AdminPanel({ onNavigate }: AdminPanelProps) {
  const { currentUser, logout } = useAuth();
  const { actor, isFetching } = useActor();
  const [activeSection, setActiveSection] = useState<SectionType>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [students, setStudents] = useState<UserProfile[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionRecord[]>([]);
  const [franchise, setFranchise] = useState<FranchiseRecord[]>([]);
  const [messages, setMessages] = useState<ContactRecord[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [brochureRequests, setBrochureRequests] = useState<BrochureRequest[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  // Progress updater
  const [progressEdits, setProgressEdits] = useState<Record<string, string>>(
    {},
  );
  const [updatingProgress, setUpdatingProgress] = useState<string | null>(null);

  // New announcement
  const [annForm, setAnnForm] = useState({ title: "", content: "" });
  const [addingAnn, setAddingAnn] = useState(false);

  // Courses management
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [deletingInProgress, setDeletingInProgress] = useState(false);

  // Leads
  const [courseLeads, setCourseLeads] = useState<CourseLead[]>([]);
  const [franchiseLeads, setFranchiseLeads] = useState<FranchiseLead[]>([]);
  const [leadsFilter, setLeadsFilter] = useState<
    "all" | "course" | "franchise"
  >("all");
  const [leadsLoading, setLeadsLoading] = useState(false);

  // Brochure URLs management
  const [brochureUrls, setBrochureUrls] = useState<BrochureUrl[]>([]);
  const [brochureUrlEdits, setBrochureUrlEdits] = useState<
    Record<string, string>
  >({});
  const [savingBrochureUrl, setSavingBrochureUrl] = useState<string | null>(
    null,
  );
  const [franchiseBrochureEdit, setFranchiseBrochureEdit] = useState("");
  const [savingFranchiseBrochure, setSavingFranchiseBrochure] = useState(false);

  useEffect(() => {
    if (!actor || isFetching) return;
    setLoading(true);
    Promise.all([
      actor.getAllStudents().catch(() => ({ ok: [] })),
      actor.getAdmissions().catch(() => ({ ok: [] })),
      actor.getFranchiseInquiries().catch(() => ({ ok: [] })),
      actor.getContactMessages().catch(() => ({ ok: [] })),
      actor.getAnnouncements().catch(() => ({ ok: [] })),
      actor.getCourses().catch(() => ({ ok: [] })),
      actor.getBrochureRequests().catch(() => []),
    ])
      .then(([s, a, f, m, ann, c, br]) => {
        setStudents((s as any).ok ?? []);
        setAdmissions((a as any).ok ?? []);
        setFranchise((f as any).ok ?? []);
        setMessages((m as any).ok ?? []);
        setAnnouncements((ann as any).ok ?? []);
        setCourses((c as any).ok ?? []);
        setBrochureRequests((br as any) ?? []);
      })
      .catch(() => {
        toast.error("Failed to load data.");
      })
      .finally(() => setLoading(false));
  }, [actor, isFetching]);

  // Load leads when leads section is activated
  useEffect(() => {
    if (activeSection !== "leads" || !actor) return;
    setLeadsLoading(true);
    (actor as unknown as FullBackend)
      .getAllLeads()
      .then((result) => {
        setCourseLeads(result.courseLeads ?? []);
        setFranchiseLeads(result.franchiseLeads ?? []);
      })
      .catch(() => toast.error("Failed to load leads."))
      .finally(() => setLeadsLoading(false));
  }, [activeSection, actor]);

  // Load brochure URLs when brochure-urls section is activated
  useEffect(() => {
    if (activeSection !== "brochure-urls" || !actor) return;
    const fullActorB = actor as unknown as FullBackend;
    Promise.all([
      fullActorB.getBrochureUrls().catch(() => [] as BrochureUrl[]),
      fullActorB.getFranchiseBrochureUrl().catch(() => null),
    ]).then(([urls, franchiseUrl]) => {
      setBrochureUrls((urls as BrochureUrl[]) ?? []);
      // Pre-fill edits map from existing URLs
      const edits: Record<string, string> = {};
      for (const u of urls as BrochureUrl[]) {
        if (u.urlType === "course") {
          edits[String(u.courseId)] = u.url;
        }
      }
      setBrochureUrlEdits(edits);
      if (franchiseUrl) {
        setFranchiseBrochureEdit((franchiseUrl as BrochureUrl).url);
      }
    });
  }, [activeSection, actor]);

  const refreshCourses = async () => {
    if (!actor) return;
    try {
      const res = await actor.getCourses();
      setCourses(res?.ok ?? []);
    } catch {
      /* ignore */
    }
  };

  const handleLogout = () => {
    logout();
    onNavigate("home");
  };

  const handleUpdateProgress = async (username: string) => {
    if (!actor) return;
    const val = Number.parseInt(progressEdits[username] ?? "0", 10);
    if (Number.isNaN(val) || val < 0 || val > 100) {
      toast.error("Progress must be 0-100.");
      return;
    }
    setUpdatingProgress(username);
    try {
      await actor.updateStudentProgress(username, BigInt(val));
      setStudents((prev) =>
        prev.map((s) =>
          s.username === username ? { ...s, progress: BigInt(val) } : s,
        ),
      );
      setProgressEdits((prev) => {
        const next = { ...prev };
        delete next[username];
        return next;
      });
      toast.success("Progress updated!");
    } catch {
      toast.error("Failed to update progress.");
    } finally {
      setUpdatingProgress(null);
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !annForm.title.trim() || !annForm.content.trim()) {
      toast.error("Title and content are required.");
      return;
    }
    setAddingAnn(true);
    try {
      const result = await actor.addAnnouncement(
        annForm.title,
        annForm.content,
        currentUser?.fullName ?? "Admin",
      );
      if (result?.ok !== undefined) {
        const newAnn: Announcement = {
          id: result.ok,
          title: annForm.title,
          content: annForm.content,
          postedBy: currentUser?.fullName ?? "Admin",
          timestamp: BigInt(Date.now()) * BigInt(1_000_000),
        };
        setAnnouncements((prev) => [newAnn, ...prev]);
        setAnnForm({ title: "", content: "" });
        toast.success("Announcement posted!");
      }
    } catch {
      toast.error("Failed to post announcement.");
    } finally {
      setAddingAnn(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!actor || !deletingCourse) return;
    setDeletingInProgress(true);
    try {
      await actor.deleteCourse(deletingCourse.id);
      toast.success("Course deleted!");
      setDeleteDialogOpen(false);
      setDeletingCourse(null);
      await refreshCourses();
    } catch {
      toast.error("Failed to delete course.");
    } finally {
      setDeletingInProgress(false);
    }
  };

  const handleSaveBrochureUrl = async (courseId: number, url: string) => {
    if (!actor) return;
    if (!url.trim()) {
      toast.error("URL cannot be empty.");
      return;
    }
    const key = String(courseId);
    setSavingBrochureUrl(key);
    try {
      await (actor as unknown as FullBackend).setBrochureUrl(
        BigInt(courseId),
        url.trim(),
        "course",
      );
      toast.success("Brochure URL saved!");
    } catch {
      toast.error("Failed to save URL.");
    } finally {
      setSavingBrochureUrl(null);
    }
  };

  const handleSaveFranchiseBrochure = async () => {
    if (!actor) return;
    if (!franchiseBrochureEdit.trim()) {
      toast.error("URL cannot be empty.");
      return;
    }
    setSavingFranchiseBrochure(true);
    try {
      await (actor as unknown as FullBackend).setBrochureUrl(
        BigInt(0),
        franchiseBrochureEdit.trim(),
        "franchise",
      );
      toast.success("Franchise brochure URL saved!");
    } catch {
      toast.error("Failed to save franchise brochure URL.");
    } finally {
      setSavingFranchiseBrochure(false);
    }
  };

  // Computed leads for filter
  const filteredLeads: (CourseLead | FranchiseLead)[] =
    leadsFilter === "all"
      ? [...courseLeads, ...franchiseLeads]
      : leadsFilter === "course"
        ? courseLeads
        : franchiseLeads;

  const totalDownloads = [...courseLeads, ...franchiseLeads].reduce(
    (acc, l) => acc + Number(l.downloadCount),
    0,
  );

  const navItems: {
    id: SectionType;
    label: string;
    icon: React.ReactNode;
    count?: number;
  }[] = [
    { id: "dashboard", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
    {
      id: "students",
      label: "Students",
      icon: <Users className="w-4 h-4" />,
      count: students.filter((s) => s.role !== "admin").length,
    },
    {
      id: "admissions",
      label: "Admissions",
      icon: <BookOpen className="w-4 h-4" />,
      count: admissions.length,
    },
    {
      id: "franchise",
      label: "Franchise Leads",
      icon: <Briefcase className="w-4 h-4" />,
      count: franchise.length,
    },
    {
      id: "messages",
      label: "Messages",
      icon: <MessageSquare className="w-4 h-4" />,
      count: messages.length,
    },
    {
      id: "announcements",
      label: "Announcements",
      icon: <Bell className="w-4 h-4" />,
    },
    {
      id: "courses",
      label: "Courses",
      icon: <GraduationCap className="w-4 h-4" />,
      count: courses.length,
    },
    {
      id: "brochures",
      label: "Brochure Requests",
      icon: <FileDown className="w-4 h-4" />,
      count: brochureRequests.length,
    },
    {
      id: "leads",
      label: "Leads",
      icon: <TrendingUp className="w-4 h-4" />,
      count: courseLeads.length + franchiseLeads.length || undefined,
    },
    {
      id: "brochure-urls",
      label: "Brochure URLs",
      icon: <Link className="w-4 h-4" />,
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center shadow">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm">PDIT Admin</div>
            <div className="text-slate-400 text-[10px]">Management Panel</div>
          </div>
        </div>
      </div>

      {/* Admin User */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-amber-500 text-white font-semibold text-sm">
              {currentUser?.fullName?.charAt(0)?.toUpperCase() ?? "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-semibold truncate">
              {currentUser?.fullName ?? "Admin"}
            </div>
            <Badge className="bg-amber-500/20 text-amber-300 border-0 text-[10px] px-2 py-0 mt-0.5">
              Administrator
            </Badge>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav
        className="flex-1 px-3 py-4 space-y-1 overflow-y-auto"
        data-ocid="admin.nav.panel"
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setActiveSection(item.id);
              setSidebarOpen(false);
            }}
            data-ocid={`admin.${item.id}.link`}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeSection === item.id
                ? "bg-white/15 text-white shadow-sm"
                : "text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.icon}
            <span className="flex-1 text-left">{item.label}</span>
            {item.count !== undefined && item.count > 0 && (
              <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full">
                {item.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 space-y-2 border-t border-white/10">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          data-ocid="admin.back_to_website.link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Website
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-white hover:bg-red-500/20 transition-all"
          data-ocid="admin.logout.button"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Modals */}
      <CourseModal
        open={courseModalOpen}
        editingCourse={editingCourse}
        onClose={() => {
          setCourseModalOpen(false);
          setEditingCourse(null);
        }}
        onSaved={refreshCourses}
        actor={actor}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeletingCourse(null);
        }}
        onConfirm={handleDeleteCourse}
        courseName={deletingCourse?.title ?? ""}
        deleting={deletingInProgress}
      />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-gradient-to-b from-[#1e293b] to-[#0f172a] flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-[#1e293b] to-[#0f172a] z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              aria-label="Open sidebar"
              data-ocid="admin.menu.button"
            >
              <Home className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-semibold text-gray-900 capitalize">
                {navItems.find((n) => n.id === activeSection)?.label ??
                  "Dashboard"}
              </h1>
              <p className="text-xs text-gray-500">PDIT Admin Panel</p>
            </div>
          </div>
          <Badge className="bg-amber-100 text-amber-700 border-0">
            Administrator
          </Badge>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          {loading && (
            <div
              className="flex items-center justify-center py-16"
              data-ocid="admin.loading_state"
            >
              <Loader2 className="w-6 h-6 animate-spin text-pdit-indigo" />
            </div>
          )}

          {!loading && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                {/* ── Dashboard ─────────────────────────────────────────────────── */}
                {activeSection === "dashboard" && (
                  <div
                    className="space-y-6"
                    data-ocid="admin.dashboard.section"
                  >
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
                      <h2 className="text-xl font-bold">
                        Welcome, {currentUser?.fullName ?? "Admin"} 👋
                      </h2>
                      <p className="text-slate-300 text-sm mt-1">
                        Here's an overview of PDIT's activity.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          label: "Total Students",
                          value: students.filter((s) => s.role !== "admin")
                            .length,
                          icon: <Users className="w-5 h-5" />,
                          color: "text-pdit-indigo bg-indigo-50",
                        },
                        {
                          label: "Admissions",
                          value: admissions.length,
                          icon: <BookOpen className="w-5 h-5" />,
                          color: "text-emerald-600 bg-emerald-50",
                        },
                        {
                          label: "Franchise Leads",
                          value: franchise.length,
                          icon: <Briefcase className="w-5 h-5" />,
                          color: "text-amber-600 bg-amber-50",
                        },
                        {
                          label: "Messages",
                          value: messages.length,
                          icon: <Mail className="w-5 h-5" />,
                          color: "text-cyan-600 bg-cyan-50",
                        },
                      ].map((stat) => (
                        <Card
                          key={stat.label}
                          className="border-0 shadow-card rounded-2xl"
                          data-ocid="admin.stats.card"
                        >
                          <CardContent className="p-4">
                            <div
                              className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}
                            >
                              {stat.icon}
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                              {stat.value}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {stat.label}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Recent Admissions */}
                    <Card className="border-0 shadow-card rounded-2xl">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">
                          Recent Admissions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {admissions.length === 0 ? (
                          <EmptyState
                            icon={BookOpen}
                            message="No admissions yet."
                          />
                        ) : (
                          <div className="overflow-x-auto">
                            <Table data-ocid="admin.admissions.table">
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Course</TableHead>
                                  <TableHead>City</TableHead>
                                  <TableHead>Date</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {admissions.slice(0, 5).map((a, i) => (
                                  <TableRow
                                    key={String(a.id)}
                                    data-ocid={`admin.admissions.item.${i + 1}`}
                                  >
                                    <TableCell className="font-medium">
                                      {a.name}
                                    </TableCell>
                                    <TableCell>{a.course}</TableCell>
                                    <TableCell>{a.city}</TableCell>
                                    <TableCell className="text-gray-500 text-sm">
                                      {formatDate(a.timestamp)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* ── Students ──────────────────────────────────────────────────── */}
                {activeSection === "students" && (
                  <div className="space-y-6" data-ocid="admin.students.section">
                    <h2 className="text-xl font-bold text-gray-900">
                      Students (
                      {students.filter((s) => s.role !== "admin").length})
                    </h2>
                    <Card className="border-0 shadow-card rounded-2xl">
                      <CardContent className="p-0">
                        {students.filter((s) => s.role !== "admin").length ===
                        0 ? (
                          <div className="p-6">
                            <EmptyState
                              icon={Users}
                              message="No students registered yet."
                            />
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <Table data-ocid="admin.students.table">
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Course</TableHead>
                                  <TableHead>Email</TableHead>
                                  <TableHead>Progress</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Update</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {students
                                  .filter((s) => s.role !== "admin")
                                  .map((s, i) => (
                                    <TableRow
                                      key={s.username}
                                      data-ocid={`admin.students.item.${i + 1}`}
                                    >
                                      <TableCell>
                                        <div className="font-medium">
                                          {s.fullName}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                          @{s.username}
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-sm">
                                        {s.course}
                                      </TableCell>
                                      <TableCell className="text-sm text-gray-600">
                                        {s.email}
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex items-center gap-2 min-w-[100px]">
                                          <Progress
                                            value={Number(s.progress)}
                                            className="h-2 flex-1"
                                          />
                                          <span className="text-xs text-gray-500">
                                            {Number(s.progress)}%
                                          </span>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <Badge
                                          className={
                                            s.isActive
                                              ? "bg-emerald-100 text-emerald-700 border-0"
                                              : "bg-red-100 text-red-700 border-0"
                                          }
                                        >
                                          {s.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex items-center gap-1.5">
                                          <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            placeholder={String(
                                              Number(s.progress),
                                            )}
                                            value={
                                              progressEdits[s.username] ?? ""
                                            }
                                            onChange={(e) =>
                                              setProgressEdits((p) => ({
                                                ...p,
                                                [s.username]: e.target.value,
                                              }))
                                            }
                                            className="h-8 w-16 text-xs rounded-lg"
                                            data-ocid={`admin.progress.input.${i + 1}`}
                                          />
                                          <Button
                                            size="sm"
                                            onClick={() =>
                                              handleUpdateProgress(s.username)
                                            }
                                            disabled={
                                              updatingProgress === s.username
                                            }
                                            className="h-8 px-2 gradient-primary text-white border-0 text-xs rounded-lg"
                                            data-ocid={`admin.progress.save_button.${i + 1}`}
                                          >
                                            {updatingProgress === s.username ? (
                                              <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                              "Set"
                                            )}
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* ── Admissions ────────────────────────────────────────────────── */}
                {activeSection === "admissions" && (
                  <div
                    className="space-y-6"
                    data-ocid="admin.admissions.section"
                  >
                    <h2 className="text-xl font-bold text-gray-900">
                      Admissions ({admissions.length})
                    </h2>
                    <Card className="border-0 shadow-card rounded-2xl">
                      <CardContent className="p-0">
                        {admissions.length === 0 ? (
                          <div className="p-6">
                            <EmptyState
                              icon={BookOpen}
                              message="No admission applications yet."
                            />
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <Table data-ocid="admin.admissions.table">
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Course</TableHead>
                                  <TableHead>City</TableHead>
                                  <TableHead>Email</TableHead>
                                  <TableHead>Phone</TableHead>
                                  <TableHead>Date</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {admissions.map((a, i) => (
                                  <TableRow
                                    key={String(a.id)}
                                    data-ocid={`admin.admissions.item.${i + 1}`}
                                  >
                                    <TableCell className="font-medium">
                                      {a.name}
                                    </TableCell>
                                    <TableCell>{a.course}</TableCell>
                                    <TableCell>{a.city}</TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                      {a.email}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                      {a.phone}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500">
                                      {formatDate(a.timestamp)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* ── Franchise ─────────────────────────────────────────────────── */}
                {activeSection === "franchise" && (
                  <div
                    className="space-y-6"
                    data-ocid="admin.franchise.section"
                  >
                    <h2 className="text-xl font-bold text-gray-900">
                      Franchise Leads ({franchise.length})
                    </h2>
                    <Card className="border-0 shadow-card rounded-2xl">
                      <CardContent className="p-0">
                        {franchise.length === 0 ? (
                          <div className="p-6">
                            <EmptyState
                              icon={Briefcase}
                              message="No franchise inquiries yet."
                            />
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <Table data-ocid="admin.franchise.table">
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead>City</TableHead>
                                  <TableHead>Investment</TableHead>
                                  <TableHead>Email</TableHead>
                                  <TableHead>Phone</TableHead>
                                  <TableHead>Date</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {franchise.map((f, i) => (
                                  <TableRow
                                    key={String(f.id)}
                                    data-ocid={`admin.franchise.item.${i + 1}`}
                                  >
                                    <TableCell className="font-medium">
                                      {f.name}
                                    </TableCell>
                                    <TableCell>{f.city}</TableCell>
                                    <TableCell>
                                      <Badge className="bg-amber-100 text-amber-700 border-0">
                                        {f.investment}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                      {f.email}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                      {f.phone}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500">
                                      {formatDate(f.timestamp)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* ── Messages ──────────────────────────────────────────────────── */}
                {activeSection === "messages" && (
                  <div className="space-y-6" data-ocid="admin.messages.section">
                    <h2 className="text-xl font-bold text-gray-900">
                      Contact Messages ({messages.length})
                    </h2>
                    <Card className="border-0 shadow-card rounded-2xl">
                      <CardContent className="p-0">
                        {messages.length === 0 ? (
                          <div className="p-6">
                            <EmptyState
                              icon={MessageSquare}
                              message="No messages yet."
                            />
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <Table data-ocid="admin.messages.table">
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Email</TableHead>
                                  <TableHead>Phone</TableHead>
                                  <TableHead>Message</TableHead>
                                  <TableHead>Date</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {messages.map((m, i) => (
                                  <TableRow
                                    key={String(m.id)}
                                    data-ocid={`admin.messages.item.${i + 1}`}
                                  >
                                    <TableCell className="font-medium">
                                      {m.name}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                      {m.email}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                      {m.phone}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600 max-w-xs">
                                      <p className="line-clamp-2">
                                        {m.message}
                                      </p>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500">
                                      {formatDate(m.timestamp)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* ── Announcements ─────────────────────────────────────────────── */}
                {activeSection === "announcements" && (
                  <div
                    className="space-y-6"
                    data-ocid="admin.announcements.section"
                  >
                    <h2 className="text-xl font-bold text-gray-900">
                      Announcements
                    </h2>

                    <Card className="border-0 shadow-card rounded-2xl border-l-4 border-l-pdit-indigo">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Plus className="w-4 h-4 text-pdit-indigo" />
                          Post New Announcement
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form
                          onSubmit={handleAddAnnouncement}
                          className="space-y-3"
                        >
                          <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-gray-700">
                              Title
                            </Label>
                            <Input
                              placeholder="Announcement title"
                              value={annForm.title}
                              onChange={(e) =>
                                setAnnForm((p) => ({
                                  ...p,
                                  title: e.target.value,
                                }))
                              }
                              className="h-11 rounded-xl"
                              data-ocid="admin.announcement.title.input"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-gray-700">
                              Content
                            </Label>
                            <Textarea
                              placeholder="Write announcement content..."
                              value={annForm.content}
                              onChange={(e) =>
                                setAnnForm((p) => ({
                                  ...p,
                                  content: e.target.value,
                                }))
                              }
                              className="rounded-xl resize-none"
                              rows={3}
                              data-ocid="admin.announcement.content.textarea"
                            />
                          </div>
                          <Button
                            type="submit"
                            disabled={addingAnn}
                            className="gradient-primary text-white border-0 rounded-xl hover:opacity-90"
                            data-ocid="admin.announcement.submit_button"
                          >
                            {addingAnn ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                Posting...
                              </>
                            ) : (
                              <>
                                <Plus className="mr-2 h-4 w-4" /> Post
                                Announcement
                              </>
                            )}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>

                    {announcements.length === 0 ? (
                      <Card
                        className="border-0 shadow-card rounded-2xl"
                        data-ocid="admin.announcements.empty_state"
                      >
                        <CardContent className="py-12">
                          <EmptyState
                            icon={Bell}
                            message="No announcements posted yet."
                          />
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-3">
                        {announcements.map((ann, i) => (
                          <Card
                            key={String(ann.id)}
                            className="border-0 shadow-card rounded-2xl"
                            data-ocid={`admin.announcements.item.${i + 1}`}
                          >
                            <CardContent className="p-5">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0">
                                  <Bell className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900">
                                    {ann.title}
                                  </h3>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {ann.content}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-2">
                                    Posted by {ann.postedBy}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Courses ─────────────────────────────────────────────────────── */}
                {activeSection === "courses" && (
                  <div className="space-y-6" data-ocid="admin.courses.section">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">
                        Courses ({courses.length})
                      </h2>
                      <Button
                        onClick={() => {
                          setEditingCourse(null);
                          setCourseModalOpen(true);
                        }}
                        className="gradient-primary text-white border-0 rounded-xl hover:opacity-90 flex items-center gap-2"
                        data-ocid="admin.courses.open_modal_button"
                      >
                        <Plus className="w-4 h-4" /> Add New Course
                      </Button>
                    </div>

                    <Card className="border-0 shadow-card rounded-2xl">
                      <CardContent className="p-0">
                        {courses.length === 0 ? (
                          <div className="p-6">
                            <EmptyState
                              icon={GraduationCap}
                              message="No courses yet. Click 'Add New Course' to create one."
                            />
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <Table data-ocid="admin.courses.table">
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Course</TableHead>
                                  <TableHead>Duration</TableHead>
                                  <TableHead>Fee</TableHead>
                                  <TableHead>Topics</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="text-right">
                                    Actions
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {courses.map((course, i) => (
                                  <TableRow
                                    key={String(course.id)}
                                    data-ocid={`admin.courses.item.${i + 1}`}
                                  >
                                    <TableCell>
                                      <div className="flex items-center gap-3">
                                        <div
                                          className="w-8 h-8 rounded-lg flex-shrink-0"
                                          style={{
                                            background: `linear-gradient(135deg, ${course.colorKey}, ${course.colorKey}cc)`,
                                          }}
                                        />
                                        <div>
                                          <div className="font-semibold text-gray-900">
                                            {course.title}
                                          </div>
                                          <div className="text-xs text-gray-400">
                                            {course.subtitle}
                                          </div>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                      {course.duration}
                                    </TableCell>
                                    <TableCell>
                                      <Badge className="bg-green-100 text-green-700 border-0 font-semibold">
                                        {course.fee}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Badge className="bg-indigo-50 text-pdit-indigo border-0">
                                        {course.topics.length} topics
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        className={
                                          course.isActive
                                            ? "bg-emerald-100 text-emerald-700 border-0"
                                            : "bg-red-100 text-red-700 border-0"
                                        }
                                      >
                                        {course.isActive
                                          ? "Active"
                                          : "Inactive"}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex items-center justify-end gap-1.5">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            setEditingCourse(course);
                                            setCourseModalOpen(true);
                                          }}
                                          className="h-8 px-2.5 rounded-lg text-xs border-gray-200 hover:border-pdit-indigo hover:text-pdit-indigo"
                                          data-ocid={`admin.courses.edit_button.${i + 1}`}
                                        >
                                          <Edit className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            setDeletingCourse(course);
                                            setDeleteDialogOpen(true);
                                          }}
                                          className="h-8 px-2.5 rounded-lg text-xs border-gray-200 hover:border-red-400 hover:text-red-600"
                                          data-ocid={`admin.courses.delete_button.${i + 1}`}
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* ── Brochure Requests ─────────────────────────────────────────────── */}
                {activeSection === "brochures" && (
                  <div
                    className="space-y-6"
                    data-ocid="admin.brochures.section"
                  >
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-gray-900">
                        Brochure Requests
                      </h2>
                      <Badge className="bg-indigo-100 text-pdit-indigo border-0 text-sm px-3">
                        {brochureRequests.length} total
                      </Badge>
                    </div>

                    <Card className="border-0 shadow-card rounded-2xl">
                      <CardContent className="p-0">
                        {brochureRequests.length === 0 ? (
                          <div className="p-6">
                            <EmptyState
                              icon={Download}
                              message="No brochure requests yet."
                            />
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <Table data-ocid="admin.brochures.table">
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Phone</TableHead>
                                  <TableHead>Email</TableHead>
                                  <TableHead>Course</TableHead>
                                  <TableHead>Date</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {brochureRequests.map((req, i) => (
                                  <TableRow
                                    key={String(req.id)}
                                    data-ocid={`admin.brochures.item.${i + 1}`}
                                  >
                                    <TableCell className="font-medium">
                                      {req.name}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                      {req.phone}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                      {req.email}
                                    </TableCell>
                                    <TableCell>
                                      <Badge className="bg-indigo-50 text-pdit-indigo border-0">
                                        {req.courseName}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500">
                                      {new Date(
                                        Number(
                                          req.timestamp / BigInt(1_000_000),
                                        ),
                                      ).toLocaleDateString("en-IN")}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* ── Leads ─────────────────────────────────────────────────────────── */}
                {activeSection === "leads" && (
                  <div className="space-y-6" data-ocid="admin.leads.section">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <h2 className="text-xl font-bold text-gray-900">Leads</h2>
                      <Button
                        onClick={() =>
                          exportLeadsCSV(filteredLeads, leadsFilter)
                        }
                        variant="outline"
                        className="flex items-center gap-2 rounded-xl border-gray-300 hover:border-pdit-indigo hover:text-pdit-indigo"
                        data-ocid="admin.leads.export.button"
                      >
                        <Download className="w-4 h-4" />
                        Export CSV
                      </Button>
                    </div>

                    {/* Stats bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        {
                          label: "Total Leads",
                          value: courseLeads.length + franchiseLeads.length,
                          color: "text-pdit-indigo bg-indigo-50",
                          icon: <Users className="w-5 h-5" />,
                        },
                        {
                          label: "Course Leads",
                          value: courseLeads.length,
                          color: "text-blue-600 bg-blue-50",
                          icon: <BookOpen className="w-5 h-5" />,
                        },
                        {
                          label: "Franchise Leads",
                          value: franchiseLeads.length,
                          color: "text-green-600 bg-green-50",
                          icon: <Briefcase className="w-5 h-5" />,
                        },
                        {
                          label: "Total Downloads",
                          value: totalDownloads,
                          color: "text-amber-600 bg-amber-50",
                          icon: <Download className="w-5 h-5" />,
                        },
                      ].map((stat) => (
                        <Card
                          key={stat.label}
                          className="border-0 shadow-card rounded-2xl"
                          data-ocid="admin.leads.stats.card"
                        >
                          <CardContent className="p-4">
                            <div
                              className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}
                            >
                              {stat.icon}
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                              {stat.value}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {stat.label}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Filter tabs */}
                    <div
                      className="flex gap-2"
                      data-ocid="admin.leads.filter.tab"
                    >
                      {(
                        [
                          { key: "all", label: "All Leads" },
                          { key: "course", label: "Course Leads" },
                          { key: "franchise", label: "Franchise Leads" },
                        ] as const
                      ).map((f) => (
                        <button
                          key={f.key}
                          type="button"
                          onClick={() => setLeadsFilter(f.key)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            leadsFilter === f.key
                              ? "bg-pdit-indigo text-white shadow"
                              : "bg-white text-gray-600 border border-gray-200 hover:border-pdit-indigo hover:text-pdit-indigo"
                          }`}
                          data-ocid={`admin.leads.${f.key}.tab`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>

                    <Card className="border-0 shadow-card rounded-2xl">
                      <CardContent className="p-0">
                        {leadsLoading ? (
                          <div
                            className="flex items-center justify-center py-12"
                            data-ocid="admin.leads.loading_state"
                          >
                            <Loader2 className="w-6 h-6 animate-spin text-pdit-indigo" />
                          </div>
                        ) : filteredLeads.length === 0 ? (
                          <div
                            className="p-6"
                            data-ocid="admin.leads.empty_state"
                          >
                            <EmptyState
                              icon={TrendingUp}
                              message="No leads found for this filter."
                            />
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <Table data-ocid="admin.leads.table">
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Type</TableHead>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Email</TableHead>
                                  <TableHead>Phone</TableHead>
                                  <TableHead>Course / City</TableHead>
                                  <TableHead>Investment</TableHead>
                                  <TableHead>Downloads</TableHead>
                                  <TableHead>Date</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredLeads.map((lead, i) => {
                                  const isCourse = "courseId" in lead;
                                  return (
                                    <TableRow
                                      key={String(lead.id)}
                                      data-ocid={`admin.leads.item.${i + 1}`}
                                    >
                                      <TableCell>
                                        <Badge
                                          className={
                                            isCourse
                                              ? "bg-blue-100 text-blue-700 border-0"
                                              : "bg-green-100 text-green-700 border-0"
                                          }
                                        >
                                          {isCourse ? "Course" : "Franchise"}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="font-medium">
                                        {lead.name}
                                      </TableCell>
                                      <TableCell className="text-sm text-gray-600">
                                        {lead.email}
                                      </TableCell>
                                      <TableCell className="text-sm text-gray-600">
                                        {lead.phone}
                                      </TableCell>
                                      <TableCell className="text-sm">
                                        {isCourse
                                          ? (lead as CourseLead).courseName
                                          : (lead as FranchiseLead).city}
                                      </TableCell>
                                      <TableCell className="text-sm">
                                        {isCourse
                                          ? "—"
                                          : (lead as FranchiseLead).investment}
                                      </TableCell>
                                      <TableCell>
                                        <Badge className="bg-gray-100 text-gray-700 border-0">
                                          {Number(lead.downloadCount)}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-sm text-gray-500">
                                        {formatDate(lead.timestamp)}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* ── Brochure URLs ────────────────────────────────────────────────── */}
                {activeSection === "brochure-urls" && (
                  <div
                    className="space-y-6"
                    data-ocid="admin.brochure_urls.section"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">
                        Manage Brochure URLs
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Set the PDF brochure download URL for each course and
                        for the franchise page.
                      </p>
                    </div>

                    {/* Course Brochures */}
                    <Card className="border-0 shadow-card rounded-2xl">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-pdit-indigo" />
                          Course Brochures
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {courses.length === 0 ? (
                          <EmptyState
                            icon={GraduationCap}
                            message="No courses found. Add courses first."
                          />
                        ) : (
                          courses.map((course, i) => {
                            const key = String(course.id);
                            const currentUrl = brochureUrlEdits[key] ?? "";
                            const isSet = brochureUrls.some(
                              (u) =>
                                u.urlType === "course" &&
                                String(u.courseId) === key,
                            );
                            return (
                              <div
                                key={String(course.id)}
                                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl"
                                data-ocid={`admin.brochure_urls.item.${i + 1}`}
                              >
                                <div
                                  className="w-8 h-8 rounded-lg flex-shrink-0"
                                  style={{
                                    background: `linear-gradient(135deg, ${course.colorKey}, ${course.colorKey}cc)`,
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm text-gray-800">
                                      {course.title}
                                    </span>
                                    {isSet && (
                                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    )}
                                  </div>
                                  <Input
                                    placeholder="https://example.com/brochure.pdf"
                                    value={currentUrl}
                                    onChange={(e) =>
                                      setBrochureUrlEdits((prev) => ({
                                        ...prev,
                                        [key]: e.target.value,
                                      }))
                                    }
                                    className="h-9 rounded-lg text-sm"
                                    data-ocid={`admin.brochure_urls.url.input.${i + 1}`}
                                  />
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleSaveBrochureUrl(
                                      Number(course.id),
                                      currentUrl,
                                    )
                                  }
                                  disabled={
                                    savingBrochureUrl === key ||
                                    !currentUrl.trim()
                                  }
                                  className="h-9 px-3 gradient-primary text-white border-0 rounded-lg flex-shrink-0"
                                  data-ocid={`admin.brochure_urls.save_button.${i + 1}`}
                                >
                                  {savingBrochureUrl === key ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Save className="w-3.5 h-3.5" />
                                  )}
                                </Button>
                              </div>
                            );
                          })
                        )}
                      </CardContent>
                    </Card>

                    {/* Franchise Brochure */}
                    <Card className="border-0 shadow-card rounded-2xl border-l-4 border-l-cyan-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-cyan-600" />
                          Franchise Brochure
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3">
                          <Input
                            placeholder="https://example.com/franchise-brochure.pdf"
                            value={franchiseBrochureEdit}
                            onChange={(e) =>
                              setFranchiseBrochureEdit(e.target.value)
                            }
                            className="h-11 rounded-xl"
                            data-ocid="admin.brochure_urls.franchise.input"
                          />
                          <Button
                            onClick={handleSaveFranchiseBrochure}
                            disabled={
                              savingFranchiseBrochure ||
                              !franchiseBrochureEdit.trim()
                            }
                            className="h-11 px-5 gradient-primary text-white border-0 rounded-xl flex-shrink-0 flex items-center gap-2"
                            data-ocid="admin.brochure_urls.franchise.save_button"
                          >
                            {savingFranchiseBrochure ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Save className="w-4 h-4" /> Save
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          This URL will be offered for download on the Franchise
                          page after lead capture.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}

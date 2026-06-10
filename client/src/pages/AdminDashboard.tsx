/**
 * Admin Dashboard — Manage job postings (AI-powered) and view applications.
 * Only accessible to admin users.
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Briefcase,
  Users,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  ChevronRight,
  Sparkles,
  Loader2,
  ArrowLeft,
  ExternalLink,
  FileText,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Copy,
  Shield,
  UserPlus,
  Link2,
  Mail,
  Paperclip,
} from "lucide-react";
import { toast } from "sonner";

type Tab = "jobs" | "applications" | "create" | "team";

export default function AdminDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("jobs");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-navy" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-navy/20 mx-auto mb-4" />
          <h1
            className="text-2xl font-semibold text-navy mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Admin Access Required
          </h1>
          <p className="text-warm-gray mb-6" style={{ fontFamily: "var(--font-body)" }}>
            Please log in with an admin account to access the dashboard.
          </p>
          <a
            href={getLoginUrl()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Log In
          </a>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h1
            className="text-2xl font-semibold text-navy mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Access Denied
          </h1>
          <p className="text-warm-gray mb-6" style={{ fontFamily: "var(--font-body)" }}>
            You do not have admin permissions. Contact the site owner for access.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-navy text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1
                className="text-xl font-semibold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Admin Dashboard
              </h1>
              <p
                className="text-white/50 text-xs"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Cogie Care Services
              </p>
            </div>
          </div>
          <span className="text-sm text-white/60" style={{ fontFamily: "var(--font-body)" }}>
            {user.name || user.email}
          </span>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1">
            {[
              { id: "jobs" as Tab, label: "Job Postings", icon: Briefcase },
              { id: "applications" as Tab, label: "Applications", icon: Users },
              { id: "create" as Tab, label: "Create Job", icon: Plus },
              { id: "team" as Tab, label: "Team", icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-gold text-navy"
                    : "border-transparent text-warm-gray hover:text-navy hover:border-gray-200"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "jobs" && <JobsPanel />}
        {activeTab === "applications" && <ApplicationsPanel />}
        {activeTab === "create" && <CreateJobPanel onCreated={() => setActiveTab("jobs")} />}
        {activeTab === "team" && <TeamPanel />}
      </div>
    </div>
  );
}

// ═══════════════════ JOBS PANEL ═══════════════════
function JobsPanel() {
  const { data: jobs, isLoading } = trpc.admin.listJobs.useQuery();
  const utils = trpc.useUtils();
  const togglePublish = trpc.admin.togglePublish.useMutation({
    onSuccess: () => {
      utils.admin.listJobs.invalidate();
      toast.success("Job posting updated");
    },
  });
  const deleteJob = trpc.admin.deleteJob.useMutation({
    onSuccess: () => {
      utils.admin.listJobs.invalidate();
      toast.success("Job posting deleted");
    },
  });

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/careers/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Shareable link copied!");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-navy" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-lg font-semibold text-navy"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Job Postings ({jobs?.length ?? 0})
        </h2>
      </div>

      {!jobs || jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-warm-gray" style={{ fontFamily: "var(--font-body)" }}>
            No job postings yet. Create your first one!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl p-5 border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className="text-base font-semibold text-navy"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {job.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        job.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {job.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-warm-gray mb-2">
                    {job.department && <span>{job.department}</span>}
                    {job.location && <span>{job.location}</span>}
                    {job.employmentType && <span>{job.employmentType}</span>}
                    {job.salary && <span>{job.salary}</span>}
                  </div>
                  <p className="text-xs text-warm-gray/70">
                    Created {new Date(job.createdAt).toLocaleDateString("en-GB")}
                    {job.closingDate &&
                      ` · Closes ${new Date(job.closingDate).toLocaleDateString("en-GB")}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => copyLink(job.slug)}
                    className="p-2 text-warm-gray hover:text-navy hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy shareable link"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <a
                    href={`/careers/${job.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-warm-gray hover:text-navy hover:bg-gray-100 rounded-lg transition-colors"
                    title="View job page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => togglePublish.mutate({ id: job.id })}
                    className={`p-2 rounded-lg transition-colors ${
                      job.isPublished
                        ? "text-green-600 hover:bg-green-50"
                        : "text-warm-gray hover:bg-gray-100"
                    }`}
                    title={job.isPublished ? "Unpublish" : "Publish"}
                  >
                    {job.isPublished ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this job posting?")) {
                        deleteJob.mutate({ id: job.id });
                      }
                    }}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════ APPLICATIONS PANEL ═══════════════════
function ApplicationsPanel() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { data: applications, isLoading } = trpc.admin.listApplications.useQuery(
    statusFilter ? { status: statusFilter } : undefined
  );
  const { data: stats } = trpc.admin.getStats.useQuery();
  const [, setLocation] = useLocation();

  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    reviewing: "bg-yellow-100 text-yellow-700",
    shortlisted: "bg-purple-100 text-purple-700",
    interviewed: "bg-indigo-100 text-indigo-700",
    offered: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    withdrawn: "bg-gray-100 text-gray-500",
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-navy" />
      </div>
    );
  }

  return (
    <div>
      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
          {[
            { label: "Total", value: stats.total, color: "bg-navy" },
            { label: "New", value: stats.new, color: "bg-blue-500" },
            { label: "Reviewing", value: stats.reviewing, color: "bg-yellow-500" },
            { label: "Shortlisted", value: stats.shortlisted, color: "bg-purple-500" },
            { label: "Interviewed", value: stats.interviewed, color: "bg-indigo-500" },
            { label: "Offered", value: stats.offered, color: "bg-green-500" },
            { label: "Rejected", value: stats.rejected, color: "bg-red-500" },
          ].map((stat) => (
            <button
              key={stat.label}
              onClick={() =>
                setStatusFilter(
                  stat.label === "Total"
                    ? ""
                    : stat.label.toLowerCase()
                )
              }
              className={`p-3 rounded-xl text-center transition-all ${
                (statusFilter === stat.label.toLowerCase() || (stat.label === "Total" && !statusFilter))
                  ? "ring-2 ring-gold shadow-md"
                  : ""
              } bg-white border border-gray-200 hover:border-gray-300`}
            >
              <div
                className={`text-2xl font-bold text-navy`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-warm-gray" style={{ fontFamily: "var(--font-body)" }}>
                {stat.label}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Applications List */}
      <h2
        className="text-lg font-semibold text-navy mb-4"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Applications {statusFilter && `(${statusFilter})`}
      </h2>

      {!applications || applications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-warm-gray" style={{ fontFamily: "var(--font-body)" }}>
            {statusFilter
              ? `No ${statusFilter} applications found.`
              : "No applications received yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {applications.map((app) => (
            <button
              key={app.id}
              onClick={() => setLocation(`/admin/application/${app.id}`)}
              className="w-full text-left bg-white rounded-xl p-4 border border-gray-200 hover:border-gold/30 hover:shadow-sm transition-all flex items-center gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-sm font-semibold text-navy"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {app.applicantName}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      statusColors[app.status] || "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-warm-gray">
                  <span>{app.positionApplied || "General"}</span>
                  <span>{app.applicantEmail}</span>
                  <span>
                    {new Date(app.submittedAt).toLocaleDateString("en-GB")}
                  </span>
                  {(app as any).cvUrl && (
                    <span className="flex items-center gap-1 text-navy">
                      <Paperclip className="w-3 h-3" /> CV attached
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-warm-gray shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════ CREATE JOB PANEL ═══════════════════
function CreateJobPanel({ onCreated }: { onCreated: () => void }) {
  const [rawInput, setRawInput] = useState("");
  const [isFormatting, setIsFormatting] = useState(false);
  const [formatted, setFormatted] = useState<any>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [closingDate, setClosingDate] = useState("");

  const formatAI = trpc.admin.formatJobWithAI.useMutation({
    onSuccess: (data) => {
      setFormatted(data);
      setIsFormatting(false);
      toast.success("AI has formatted your job posting!");
    },
    onError: (err) => {
      setIsFormatting(false);
      toast.error(err.message || "Failed to format job posting");
    },
  });

  const createJob = trpc.admin.createJob.useMutation({
    onSuccess: () => {
      toast.success("Job posting created successfully!");
      onCreated();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create job posting");
    },
  });

  const handleFormat = () => {
    if (!rawInput.trim()) {
      toast.error("Please enter some details about the job opening.");
      return;
    }
    setIsFormatting(true);
    formatAI.mutate({ rawInput });
  };

  const handleCreate = () => {
    if (!formatted) return;
    createJob.mutate({
      ...formatted,
      rawInput,
      closingDate: closingDate || undefined,
      isPublished,
    });
  };

  return (
    <div className="max-w-4xl">
      <h2
        className="text-lg font-semibold text-navy mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Create Job Posting
      </h2>
      <p className="text-sm text-warm-gray mb-6" style={{ fontFamily: "var(--font-body)" }}>
        Describe the job opening in natural language. Our AI will format it into a
        professional, Indeed-style job posting.
      </p>

      {/* Step 1: Raw Input */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-navy text-white text-xs flex items-center justify-center font-bold">
            1
          </div>
          <h3
            className="text-sm font-semibold text-navy"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Describe the Job Opening
          </h3>
        </div>
        <p className="text-xs text-warm-gray mb-3" style={{ fontFamily: "var(--font-body)" }}>
          Write naturally about the role — include the title, responsibilities, requirements,
          salary, hours, and any benefits. The AI will structure it properly.
        </p>
        <textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder="e.g., We need a support worker for our Woodland Road property. They'll be helping residents with daily living, mental health support, cooking and cleaning. Must have NVQ level 2 in health and social care or equivalent. DBS required. £12-14 per hour, full time, rotating shifts including some weekends. We offer training, pension, and 28 days holiday..."
          rows={8}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-navy focus:ring-2 focus:ring-gold outline-none resize-none"
          style={{ fontFamily: "var(--font-body)" }}
        />
        <button
          onClick={handleFormat}
          disabled={isFormatting || !rawInput.trim()}
          className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-navy font-semibold rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {isFormatting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              AI is formatting...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Format with AI
            </>
          )}
        </button>
      </div>

      {/* Step 2: Preview & Edit */}
      {formatted && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-navy text-white text-xs flex items-center justify-center font-bold">
              2
            </div>
            <h3
              className="text-sm font-semibold text-navy"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Review & Edit
            </h3>
          </div>

          <div className="space-y-4">
            {/* Editable fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-warm-gray block mb-1">Job Title</label>
                <input
                  value={formatted.title}
                  onChange={(e) => setFormatted({ ...formatted, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-navy focus:ring-2 focus:ring-gold outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-warm-gray block mb-1">Department</label>
                <input
                  value={formatted.department}
                  onChange={(e) => setFormatted({ ...formatted, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-navy focus:ring-2 focus:ring-gold outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-warm-gray block mb-1">Location</label>
                <input
                  value={formatted.location}
                  onChange={(e) => setFormatted({ ...formatted, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-navy focus:ring-2 focus:ring-gold outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-warm-gray block mb-1">Employment Type</label>
                <input
                  value={formatted.employmentType}
                  onChange={(e) => setFormatted({ ...formatted, employmentType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-navy focus:ring-2 focus:ring-gold outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-warm-gray block mb-1">Salary</label>
                <input
                  value={formatted.salary}
                  onChange={(e) => setFormatted({ ...formatted, salary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-navy focus:ring-2 focus:ring-gold outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-warm-gray block mb-1">Closing Date</label>
                <input
                  type="date"
                  value={closingDate}
                  onChange={(e) => setClosingDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-navy focus:ring-2 focus:ring-gold outline-none"
                />
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="text-xs text-warm-gray block mb-1">Summary (for listing cards)</label>
              <textarea
                value={formatted.summary}
                onChange={(e) => setFormatted({ ...formatted, summary: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-navy focus:ring-2 focus:ring-gold outline-none resize-none"
              />
            </div>

            {/* Description Preview */}
            <div>
              <label className="text-xs text-warm-gray block mb-1">Description (HTML)</label>
              <div
                className="border border-gray-200 rounded-lg p-4 text-sm text-warm-gray prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: formatted.description }}
              />
            </div>

            {/* Responsibilities */}
            <div>
              <label className="text-xs text-warm-gray block mb-1">
                Key Responsibilities ({formatted.responsibilities?.length ?? 0})
              </label>
              <ul className="space-y-1 text-sm text-navy">
                {formatted.responsibilities?.map((r: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div>
              <label className="text-xs text-warm-gray block mb-1">
                Requirements ({formatted.requirements?.length ?? 0})
              </label>
              <ul className="space-y-1 text-sm text-navy">
                {formatted.requirements?.map((r: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-navy/40 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div>
              <label className="text-xs text-warm-gray block mb-1">
                Benefits ({formatted.benefits?.length ?? 0})
              </label>
              <ul className="space-y-1 text-sm text-navy">
                {formatted.benefits?.map((b: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Publish toggle */}
            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-gold focus:ring-gold"
                />
                <span className="text-sm text-navy font-medium" style={{ fontFamily: "var(--font-body)" }}>
                  Publish immediately
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleFormat}
              disabled={isFormatting}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-navy font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <Sparkles className="w-4 h-4" />
              Re-format
            </button>
            <button
              onClick={handleCreate}
              disabled={createJob.isPending}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-colors disabled:opacity-50 text-sm"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {createJob.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Create Job Posting
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


// ═══════════════════ TEAM PANEL ═══════════════════
function TeamPanel() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLabel, setInviteLabel] = useState("");
  const [showCreateInvite, setShowCreateInvite] = useState(false);

  const { data: admins, isLoading: adminsLoading } = trpc.admin.listAdmins.useQuery();
  const { data: invites, isLoading: invitesLoading } = trpc.admin.listInvites.useQuery();
  const utils = trpc.useUtils();

  const createInvite = trpc.admin.createInvite.useMutation({
    onSuccess: () => {
      utils.admin.listInvites.invalidate();
      setInviteEmail("");
      setInviteLabel("");
      setShowCreateInvite(false);
      toast.success("Invite link created!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create invite");
    },
  });

  const deleteInvite = trpc.admin.deleteInvite.useMutation({
    onSuccess: () => {
      utils.admin.listInvites.invalidate();
      toast.success("Invite revoked");
    },
  });

  const removeAdmin = trpc.admin.removeAdmin.useMutation({
    onSuccess: () => {
      utils.admin.listAdmins.invalidate();
      toast.success("Admin access removed");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to remove admin");
    },
  });

  const handleCreateInvite = () => {
    createInvite.mutate({
      email: inviteEmail || undefined,
      label: inviteLabel || undefined,
    });
  };

  const copyInviteLink = (token: string) => {
    const url = `${window.location.origin}/accept-invite?token=${token}`;
    navigator.clipboard.writeText(url);
    toast.success("Invite link copied to clipboard!");
  };

  if (adminsLoading || invitesLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-navy" />
      </div>
    );
  }

  return (
    <div>
      {/* Current Admins */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-semibold text-navy"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Admin Members ({admins?.length ?? 0})
          </h2>
        </div>

        {!admins || admins.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
            <Shield className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-warm-gray text-sm">No admin users found.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-navy" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-navy" style={{ fontFamily: "var(--font-body)" }}>
                      {admin.name || "Unnamed User"}
                    </div>
                    <div className="text-xs text-warm-gray">{admin.email || admin.openId}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-warm-gray">
                    Joined {new Date(admin.createdAt).toLocaleDateString("en-GB")}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm(`Remove admin access for ${admin.name || admin.email}?`)) {
                        removeAdmin.mutate({ userId: admin.id });
                      }
                    }}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove admin access"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-semibold text-navy"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Invite Links
          </h2>
          <button
            onClick={() => setShowCreateInvite(!showCreateInvite)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-navy font-semibold rounded-lg hover:bg-gold-light transition-colors text-sm"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <UserPlus className="w-4 h-4" />
            Create Invite
          </button>
        </div>

        {/* Create Invite Form */}
        {showCreateInvite && (
          <div className="bg-white rounded-xl p-5 border border-gold/30 mb-4">
            <h3
              className="text-sm font-semibold text-navy mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              New Admin Invite
            </h3>
            <p className="text-xs text-warm-gray mb-4" style={{ fontFamily: "var(--font-body)" }}>
              Generate a unique invite link to share with a new team member. The link expires after 7 days.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs text-warm-gray block mb-1">Email (optional)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-navy focus:ring-2 focus:ring-gold outline-none"
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-warm-gray block mb-1">Role/Label (optional)</label>
                <input
                  value={inviteLabel}
                  onChange={(e) => setInviteLabel(e.target.value)}
                  placeholder="e.g., Manager, Coordinator"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-navy focus:ring-2 focus:ring-gold outline-none"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreateInvite}
                disabled={createInvite.isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-colors disabled:opacity-50 text-sm"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {createInvite.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4" />
                    Generate Link
                  </>
                )}
              </button>
              <button
                onClick={() => setShowCreateInvite(false)}
                className="px-4 py-2.5 text-warm-gray hover:text-navy text-sm font-medium"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Existing Invites */}
        {!invites || invites.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
            <Link2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-warm-gray text-sm" style={{ fontFamily: "var(--font-body)" }}>
              No invite links created yet.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {invites.map((invite) => {
              const isExpired = new Date() > new Date(invite.expiresAt);
              const isUsed = invite.used;

              return (
                <div
                  key={invite.id}
                  className={`bg-white rounded-xl p-4 border transition-colors ${
                    isUsed
                      ? "border-green-200 bg-green-50/30"
                      : isExpired
                      ? "border-red-200 bg-red-50/30"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {invite.email && (
                          <span className="text-sm font-medium text-navy" style={{ fontFamily: "var(--font-body)" }}>
                            {invite.email}
                          </span>
                        )}
                        {invite.label && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-navy/5 text-navy/60">
                            {invite.label}
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            isUsed
                              ? "bg-green-100 text-green-700"
                              : isExpired
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {isUsed ? "Used" : isExpired ? "Expired" : "Active"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-warm-gray">
                        <span>Created {new Date(invite.createdAt).toLocaleDateString("en-GB")}</span>
                        <span>Expires {new Date(invite.expiresAt).toLocaleDateString("en-GB")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!isUsed && !isExpired && (
                        <button
                          onClick={() => copyInviteLink(invite.token)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy/5 text-navy text-xs font-medium rounded-lg hover:bg-navy/10 transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          Copy Link
                        </button>
                      )}
                      {!isUsed && (
                        <button
                          onClick={() => {
                            if (confirm("Revoke this invite?")) {
                              deleteInvite.mutate({ id: invite.id });
                            }
                          }}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Revoke invite"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════ APPLICATION FORM VIEW ═══════════════════
// Renders the filled application form data in organized sections

const FORM_SECTIONS = [
  {
    title: "Position Details",
    fields: [
      { key: "positionApplied", label: "Position Applied For" },
      { key: "referenceNumber", label: "Reference Number" },
      { key: "whereAdvertised", label: "Where Advertised" },
    ],
  },
  {
    title: "Personal Details",
    fields: [
      { key: "title", label: "Title" },
      { key: "forenames", label: "Forenames" },
      { key: "surname", label: "Surname" },
      { key: "address", label: "Address" },
      { key: "postcode", label: "Postcode" },
      { key: "homeTel", label: "Home Telephone" },
      { key: "mobileTel", label: "Mobile Telephone" },
      { key: "email", label: "Email" },
      { key: "nationalInsurance", label: "National Insurance No." },
      { key: "dateOfBirth", label: "Date of Birth" },
    ],
  },
  {
    title: "Additional Information",
    fields: [
      { key: "nationality", label: "Nationality" },
      { key: "rightToWork", label: "Right to Work in UK" },
      { key: "requiresWorkPermit", label: "Requires Work Permit" },
      { key: "drivingLicence", label: "Driving Licence" },
      { key: "accessToVehicle", label: "Access to Vehicle" },
      { key: "relationToEmployee", label: "Related to Employee/Committee" },
      { key: "relationDetails", label: "Relation Details" },
    ],
  },
  {
    title: "Criminal Record Declaration",
    fields: [
      { key: "hasCriminalRecord", label: "Has Criminal Record" },
      { key: "criminalRecordDetails", label: "Criminal Record Details" },
    ],
  },
  {
    title: "Relevant Experience",
    fields: [
      { key: "relevantExperience", label: "Relevant Experience" },
    ],
  },
  {
    title: "Availability",
    fields: [
      { key: "geographicalAreas", label: "Geographical Areas" },
      { key: "workType", label: "Work Type" },
      { key: "earliestStartDate", label: "Earliest Start Date" },
    ],
  },
];

function ApplicationFormView({ formData }: { formData: Record<string, unknown> }) {
  const renderValue = (value: unknown): string => {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    return JSON.stringify(value);
  };

  const renderObjectSection = (title: string, obj: Record<string, unknown>) => {
    const entries = Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && typeof v !== "object"
    );
    if (entries.length === 0) return null;
    return (
      <div key={title} className="mb-4">
        <h4
          className="text-xs font-semibold text-navy uppercase tracking-wider mb-2 pb-1 border-b border-navy/10"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {title}
        </h4>
        <div className="space-y-1.5">
          {entries.map(([key, value]) => {
            const label = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (s) => s.toUpperCase());
            return (
              <div key={key} className="flex gap-2 text-xs">
                <span className="text-warm-gray shrink-0 w-44">{label}:</span>
                <span className="text-navy whitespace-pre-wrap">{renderValue(value)}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Education entries
  const educationEntries = formData.education as Array<Record<string, unknown>> | undefined;
  // Training entries
  const trainingEntries = formData.training as Array<Record<string, unknown>> | undefined;
  // Employment entries
  const employmentHistory = (formData.employmentHistory ?? undefined) as Array<Record<string, unknown>> | undefined;
  // References
  const referees = (formData.referees ?? undefined) as Array<Record<string, unknown>> | undefined;
  // Previous addresses
  const previousAddresses = formData.previousAddresses as Array<Record<string, unknown>> | undefined;

  return (
    <div className="bg-gray-50 rounded-lg p-4 max-h-[500px] overflow-y-auto space-y-1">
      {/* Structured sections */}
      {FORM_SECTIONS.map((section) => {
        const hasData = section.fields.some((f) => {
          const val = formData[f.key];
          return val !== null && val !== undefined && val !== "";
        });
        if (!hasData) return null;
        return (
          <div key={section.title} className="mb-4">
            <h4
              className="text-xs font-semibold text-navy uppercase tracking-wider mb-2 pb-1 border-b border-navy/10"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {section.title}
            </h4>
            <div className="space-y-1.5">
              {section.fields.map((field) => {
                const value = formData[field.key];
                if (value === null || value === undefined || value === "") return null;
                return (
                  <div key={field.key} className="flex gap-2 text-xs">
                    <span className="text-warm-gray shrink-0 w-44">{field.label}:</span>
                    <span className="text-navy whitespace-pre-wrap">{renderValue(value)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Education */}
      {educationEntries && educationEntries.length > 0 ? (
        <div className="mb-4">
          <h4
            className="text-xs font-semibold text-navy uppercase tracking-wider mb-2 pb-1 border-b border-navy/10"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Education & Qualifications
          </h4>
          {educationEntries.map((edu, i) => (
            <div key={i} className="mb-2 pl-2 border-l-2 border-gold/30">
              {Object.entries(edu)
                .filter(([, v]) => v !== null && v !== undefined && v !== "")
                .map(([key, value]) => {
                  const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
                  return (
                    <div key={key} className="flex gap-2 text-xs">
                      <span className="text-warm-gray shrink-0 w-40">{label}:</span>
                      <span className="text-navy">{renderValue(value)}</span>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      ) : null}

      {/* Training */}
      {trainingEntries && trainingEntries.length > 0 ? (
        <div className="mb-4">
          <h4
            className="text-xs font-semibold text-navy uppercase tracking-wider mb-2 pb-1 border-b border-navy/10"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Training & Certifications
          </h4>
          {trainingEntries.map((t, i) => (
            <div key={i} className="mb-2 pl-2 border-l-2 border-gold/30">
              {Object.entries(t)
                .filter(([, v]) => v !== null && v !== undefined && v !== "")
                .map(([key, value]) => {
                  const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
                  return (
                    <div key={key} className="flex gap-2 text-xs">
                      <span className="text-warm-gray shrink-0 w-40">{label}:</span>
                      <span className="text-navy">{renderValue(value)}</span>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      ) : null}

      {employmentHistory && employmentHistory.length > 0 ? (
        <div className="mb-4">
          <h4
            className="text-xs font-semibold text-navy uppercase tracking-wider mb-2 pb-1 border-b border-navy/10"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Employment History
          </h4>
          {employmentHistory.map((emp, i) => (
            <div key={i} className="mb-2 pl-2 border-l-2 border-gold/30">
              {Object.entries(emp)
                .filter(([, v]) => v !== null && v !== undefined && v !== "")
                .map(([key, value]) => {
                  const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
                  return (
                    <div key={key} className="flex gap-2 text-xs">
                      <span className="text-warm-gray shrink-0 w-40">{label}:</span>
                      <span className="text-navy">{renderValue(value)}</span>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      ) : null}

      {/* References */}
      {referees && referees.length > 0 ? (
        <div className="mb-4">
          <h4
            className="text-xs font-semibold text-navy uppercase tracking-wider mb-2 pb-1 border-b border-navy/10"
            style={{ fontFamily: "var(--font-body)" }}
          >
            References
          </h4>
          {referees.map((ref, i) => (
            <div key={i} className="mb-2 pl-2 border-l-2 border-gold/30">
              {Object.entries(ref)
                .filter(([, v]) => v !== null && v !== undefined && v !== "")
                .map(([key, value]) => {
                  const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
                  return (
                    <div key={key} className="flex gap-2 text-xs">
                      <span className="text-warm-gray shrink-0 w-40">{label}:</span>
                      <span className="text-navy">{renderValue(value)}</span>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      ) : null}

      {/* Previous Addresses */}
      {previousAddresses && previousAddresses.length > 0 ? (
        <div className="mb-4">
          <h4
            className="text-xs font-semibold text-navy uppercase tracking-wider mb-2 pb-1 border-b border-navy/10"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Previous Addresses
          </h4>
          {previousAddresses.map((addr, i) => (
            <div key={i} className="mb-2 pl-2 border-l-2 border-gold/30">
              {Object.entries(addr)
                .filter(([, v]) => v !== null && v !== undefined && v !== "")
                .map(([key, value]) => {
                  const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
                  return (
                    <div key={key} className="flex gap-2 text-xs">
                      <span className="text-warm-gray shrink-0 w-40">{label}:</span>
                      <span className="text-navy">{renderValue(value)}</span>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      ) : null}

      {/* Availability grid */}
      {formData.availability && typeof formData.availability === "object" ? (
        <div className="mb-4">
          <h4
            className="text-xs font-semibold text-navy uppercase tracking-wider mb-2 pb-1 border-b border-navy/10"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Availability Schedule
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-navy/10">
                  <th className="text-left py-1 pr-3 text-warm-gray font-medium">Period</th>
                  <th className="text-center py-1 px-1 text-warm-gray font-medium">Mornings</th>
                  <th className="text-center py-1 px-1 text-warm-gray font-medium">Afternoons</th>
                  <th className="text-center py-1 px-1 text-warm-gray font-medium">Evenings</th>
                  <th className="text-center py-1 px-1 text-warm-gray font-medium">Sleep Over</th>
                  <th className="text-center py-1 px-1 text-warm-gray font-medium">Waking Nights</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(formData.availability as Record<string, Record<string, boolean>>).map(
                  ([period, slots]) => {
                    const periodLabel = period
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (s) => s.toUpperCase());
                    return (
                      <tr key={period} className="border-b border-navy/5">
                        <td className="py-1 pr-3 text-navy font-medium">{periodLabel}</td>
                        {["mornings", "afternoons", "evenings", "sleepOver", "wakingNights"].map(
                          (slot) => (
                            <td key={slot} className="text-center py-1 px-1">
                              {(slots as Record<string, boolean>)[slot] ? (
                                <CheckCircle className="w-3.5 h-3.5 text-green-500 mx-auto" />
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                          )
                        )}
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* Declaration */}
      {formData.declarationAgreed ? (
        <div className="mb-4">
          <h4
            className="text-xs font-semibold text-navy uppercase tracking-wider mb-2 pb-1 border-b border-navy/10"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Declaration
          </h4>
          <div className="space-y-1.5 text-xs">
            <div className="flex gap-2">
              <span className="text-warm-gray shrink-0 w-44">Declaration Agreed:</span>
              <span className="text-green-600 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Yes
              </span>
            </div>
            {typeof formData.signatureName === "string" && formData.signatureName && (
              <div className="flex gap-2">
                <span className="text-warm-gray shrink-0 w-44">Signature:</span>
                <span className="text-navy italic">{formData.signatureName}</span>
              </div>
            )}
            {typeof formData.signatureDate === "string" && formData.signatureDate && (
              <div className="flex gap-2">
                <span className="text-warm-gray shrink-0 w-44">Date Signed:</span>
                <span className="text-navy">{formData.signatureDate}</span>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

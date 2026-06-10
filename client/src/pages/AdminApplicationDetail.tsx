/**
 * Full-page admin application detail view.
 * Shows all form sections, CV download, and status management.
 */
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Link, useParams, useLocation } from "wouter";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  XCircle,
  Download,
  Paperclip,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Clock,
  Users,
  FileText,
  Shield,
  Car,
  User,
} from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  reviewing: "bg-yellow-100 text-yellow-700 border-yellow-200",
  shortlisted: "bg-purple-100 text-purple-700 border-purple-200",
  interviewed: "bg-indigo-100 text-indigo-700 border-indigo-200",
  offered: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  withdrawn: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function AdminApplicationDetail() {
  const { user, loading, isAuthenticated } = useAuth();
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const appId = parseInt(params.id || "0", 10);

  const { data: appDetail, isLoading: appLoading } = trpc.admin.getApplication.useQuery(
    { id: appId },
    { enabled: appId > 0 }
  );

  const utils = trpc.useUtils();
  const updateStatus = trpc.admin.updateApplicationStatus.useMutation({
    onSuccess: () => {
      utils.admin.getApplication.invalidate({ id: appId });
      toast.success("Application status updated");
    },
  });

  if (loading || appLoading) {
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
          <h1 className="text-2xl font-semibold text-navy mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Admin Access Required
          </h1>
          <a
            href={getLoginUrl()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-colors"
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
          <h1 className="text-2xl font-semibold text-navy mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Access Denied
          </h1>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-lg">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!appDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-navy mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Application Not Found
          </h1>
          <button
            onClick={() => setLocation("/admin")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const fd = (appDetail.formData || {}) as Record<string, unknown>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-navy text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={() => setLocation("/admin")}
              className="text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-white/40 text-sm" style={{ fontFamily: "var(--font-body)" }}>
              Admin Dashboard / Applications
            </span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                {appDetail.applicantName}
              </h1>
              <p className="text-white/60 text-sm mt-1" style={{ fontFamily: "var(--font-body)" }}>
                {appDetail.positionApplied || "General Application"} — Submitted{" "}
                {new Date(appDetail.submittedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <span
              className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${
                statusColors[appDetail.status] || "bg-gray-100 text-gray-500 border-gray-200"
              }`}
            >
              {appDetail.status.charAt(0).toUpperCase() + appDetail.status.slice(1)}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-warm-gray font-medium" style={{ fontFamily: "var(--font-body)" }}>
              Status:
            </label>
            <select
              value={appDetail.status}
              onChange={(e) =>
                updateStatus.mutate({ id: appDetail.id, status: e.target.value as any })
              }
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-navy focus:ring-2 focus:ring-gold outline-none"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <option value="new">New</option>
              <option value="reviewing">Reviewing</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interviewed">Interviewed</option>
              <option value="offered">Offered</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm text-warm-gray">
            <Mail className="w-4 h-4" />
            <span className={appDetail.emailSent ? "text-green-600" : "text-red-500"}>
              {appDetail.emailSent ? "Email sent to recruitment" : "Email not sent"}
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* PDF Export */}
            <PdfExportButton applicationId={appDetail.id} applicantName={appDetail.applicantName || "Application"} />

            {/* CV Download */}
            {(appDetail as any).cvUrl && (
              <a
                href={(appDetail as any).cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-light transition-colors text-sm font-medium"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <Paperclip className="w-4 h-4" />
                Download CV
              </a>
            )}
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="text-base font-semibold text-navy mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
            <User className="w-5 h-5 text-gold" />
            Contact Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoItem icon={Mail} label="Email" value={appDetail.applicantEmail} />
            <InfoItem icon={Phone} label="Phone" value={appDetail.phone || String(fd.mobileTel || fd.homeTel || "—")} />
            <InfoItem icon={Calendar} label="Date of Birth" value={String(fd.dateOfBirth || "—")} />
            <InfoItem icon={MapPin} label="Address" value={String(fd.currentAddress || fd.address || "—")} />
            <InfoItem icon={Shield} label="NI Number" value={String(fd.niNumber || fd.nationalInsurance || "—")} />
            <InfoItem icon={Calendar} label="Place of Birth" value={String(fd.placeOfBirth || "—")} />
          </div>
        </div>

        {/* Position Details */}
        <SectionCard title="Position Details" icon={Briefcase}>
          <DetailRow label="Position Applied For" value={fd.positionApplied} />
          <DetailRow label="Branch / Location" value={fd.branchLocation} />
          <DetailRow label="Where Advertised" value={fd.advertisementSource || fd.whereAdvertised} />
        </SectionCard>

        {/* Additional Information */}
        <SectionCard title="Additional Information" icon={FileText}>
          <DetailRow label="Valid Driving Licence" value={fd.validDrivingLicence || fd.drivingLicence} />
          <DetailRow label="Car for Work" value={fd.carForWork || fd.accessToVehicle} />
          <DetailRow label="Right to Work in UK" value={fd.rightToWork} />
          <DetailRow label="Right to Work Conditions" value={fd.rightToWorkConditions} />
          <DetailRow label="Related to Employee" value={fd.relatedToEmployee || fd.relationToEmployee} />
          <DetailRow label="Relation Details" value={fd.relatedToEmployeeDetails || fd.relationDetails} />
          <DetailRow label="Other Work Commitments" value={fd.otherWorkCommitments} />
        </SectionCard>

        {/* Criminal Record */}
        <SectionCard title="Criminal Record Declaration" icon={Shield}>
          <DetailRow label="Criminal Conviction" value={fd.criminalConviction || fd.hasCriminalRecord} />
          <DetailRow label="Received Cautions" value={fd.receivedCautions} />
          <DetailRow label="Subject of Proceedings" value={fd.subjectOfProceedings} />
          <DetailRow label="Details" value={fd.criminalRecordDetails} />
        </SectionCard>

        {/* Education */}
        <SectionCard title="Education & Qualifications" icon={GraduationCap}>
          <DetailRow label="Secondary Education" value={fd.secondaryEducation} />
          <DetailRow label="Secondary Qualifications" value={fd.secondaryQualifications} />
          <DetailRow label="Further Education" value={fd.furtherEducation} />
          <DetailRow label="Further Qualifications" value={fd.furtherQualifications} />
        </SectionCard>

        {/* Training */}
        <SectionCard title="Training & Certifications" icon={Award}>
          <TrainingTable courses={fd.trainingCourses as any[] | undefined} />
          <DetailRow label="Other Training" value={fd.otherTraining} />
          <DetailRow label="Professional Memberships" value={fd.professionalMemberships} />
        </SectionCard>

        {/* Current Employment */}
        <SectionCard title="Current / Most Recent Employment" icon={Briefcase}>
          <DetailRow label="Employer" value={fd.currentEmployerName} />
          <DetailRow label="Job Title" value={fd.currentJobTitle} />
          <DetailRow label="Start Date" value={fd.currentEmployerStartDate} />
          <DetailRow label="End Date" value={fd.currentEmployerEndDate} />
          <DetailRow label="Address" value={fd.currentEmployerAddress} />
          <DetailRow label="Postcode" value={fd.currentEmployerPostcode} />
          <DetailRow label="Telephone" value={fd.currentEmployerTel} />
          <DetailRow label="Salary" value={fd.currentSalary} />
          <DetailRow label="Duties" value={fd.currentDuties} />
        </SectionCard>

        {/* Employment History */}
        {renderEmploymentHistory(fd.employmentHistory as any[] | undefined)}

        {/* Relevant Experience */}
        <SectionCard title="Relevant Experience" icon={FileText}>
          <div className="text-sm text-navy whitespace-pre-wrap" style={{ fontFamily: "var(--font-body)" }}>
            {String(fd.relevantExperience || "—")}
          </div>
        </SectionCard>

        {/* Availability */}
        {fd.availability && typeof fd.availability === "object" ? (
          <SectionCard title="Availability" icon={Clock}>
            <AvailabilityTable availability={fd.availability as Record<string, Record<string, boolean>>} />
            <DetailRow label="Geographical Areas" value={fd.geographicalAreas} />
            <DetailRow label="Work Type" value={fd.workType} />
            <DetailRow label="Ideal Hours" value={fd.idealHours} />
          </SectionCard>
        ) : null}

        {/* Previous Addresses */}
        {renderPreviousAddresses(fd.previousAddresses as any[] | undefined)}

        {/* References */}
        {renderReferees(fd.referees as any[] | undefined)}

        {/* Declaration */}
        <SectionCard title="Declaration" icon={CheckCircle}>
          <DetailRow label="Declaration Agreed" value={fd.declarationAgreed ? "Yes" : "No"} />
          <DetailRow label="Signature Name" value={fd.declarationName || fd.signatureName} />
          <DetailRow label="Date Signed" value={fd.declarationDate || fd.signatureDate} />
        </SectionCard>

        {/* Back button */}
        <div className="mt-8 pb-8">
          <button
            onClick={() => setLocation("/admin")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ HELPER COMPONENTS ═══════════════════ */

function PdfExportButton({ applicationId, applicantName }: { applicationId: number; applicantName: string }) {
  const [isExporting, setIsExporting] = useState(false);
  const exportPdf = trpc.admin.exportApplicationPdf.useMutation({
    onSuccess: (data) => {
      // Convert base64 to blob and trigger download
      const byteCharacters = atob(data.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded successfully");
      setIsExporting(false);
    },
    onError: (err) => {
      toast.error("Failed to export PDF: " + err.message);
      setIsExporting(false);
    },
  });

  return (
    <button
      onClick={() => {
        setIsExporting(true);
        exportPdf.mutate({ id: applicationId });
      }}
      disabled={isExporting}
      className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-navy rounded-lg hover:bg-gold-light transition-colors text-sm font-semibold disabled:opacity-50"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {isExporting ? "Generating..." : "Export PDF"}
    </button>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  if (!value || value === "—" || value === "undefined") return null;
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-warm-gray mt-0.5 shrink-0" />
      <div>
        <span className="text-xs text-warm-gray block" style={{ fontFamily: "var(--font-body)" }}>
          {label}
        </span>
        <span className="text-sm text-navy font-medium" style={{ fontFamily: "var(--font-body)" }}>
          {value}
        </span>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
      <h2
        className="text-base font-semibold text-navy mb-4 flex items-center gap-2 pb-3 border-b border-gray-100"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <Icon className="w-5 h-5 text-gold" />
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: unknown }) {
  if (value === null || value === undefined || value === "" || value === "undefined") return null;
  const display =
    typeof value === "boolean"
      ? value
        ? "Yes"
        : "No"
      : typeof value === "object"
      ? JSON.stringify(value)
      : String(value);
  return (
    <div className="flex gap-4 py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-warm-gray shrink-0 w-48" style={{ fontFamily: "var(--font-body)" }}>
        {label}
      </span>
      <span className="text-sm text-navy whitespace-pre-wrap" style={{ fontFamily: "var(--font-body)" }}>
        {display}
      </span>
    </div>
  );
}

function TrainingTable({ courses }: { courses: any[] | undefined }) {
  if (!courses || courses.length === 0) return null;
  const filled = courses.filter((c) => c.dateObtained || c.expiryDate);
  if (filled.length === 0) return null;
  return (
    <div className="overflow-x-auto mb-3">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-navy/10">
            <th className="text-left py-2 pr-4 text-warm-gray font-medium text-xs">Course</th>
            <th className="text-left py-2 pr-4 text-warm-gray font-medium text-xs">Date Obtained</th>
            <th className="text-left py-2 text-warm-gray font-medium text-xs">Expiry Date</th>
          </tr>
        </thead>
        <tbody>
          {filled.map((c: any, i: number) => (
            <tr key={i} className="border-b border-gray-50">
              <td className="py-2 pr-4 text-navy text-sm">{c.course}</td>
              <td className="py-2 pr-4 text-navy text-sm">{c.dateObtained || "—"}</td>
              <td className="py-2 text-navy text-sm">{c.expiryDate || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AvailabilityTable({ availability }: { availability: Record<string, Record<string, boolean>> }) {
  const slots = ["mornings", "afternoons", "evenings", "sleepOver", "wakingNights"];
  const slotLabels: Record<string, string> = {
    mornings: "Mornings",
    afternoons: "Afternoons",
    evenings: "Evenings",
    sleepOver: "Sleep Over",
    wakingNights: "Waking Nights",
  };
  return (
    <div className="overflow-x-auto mb-3">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-navy/10">
            <th className="text-left py-2 pr-3 text-warm-gray font-medium text-xs">Period</th>
            {slots.map((s) => (
              <th key={s} className="text-center py-2 px-2 text-warm-gray font-medium text-xs">
                {slotLabels[s]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(availability).map(([period, slotValues]) => {
            const periodLabel = period
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (s) => s.toUpperCase());
            return (
              <tr key={period} className="border-b border-gray-50">
                <td className="py-2 pr-3 text-navy font-medium text-sm">{periodLabel}</td>
                {slots.map((slot) => (
                  <td key={slot} className="text-center py-2 px-2">
                    {(slotValues as Record<string, boolean>)[slot] ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function renderEmploymentHistory(history: any[] | undefined) {
  if (!history || history.length === 0) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
      <h2
        className="text-base font-semibold text-navy mb-4 flex items-center gap-2 pb-3 border-b border-gray-100"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <Briefcase className="w-5 h-5 text-gold" />
        Employment History
      </h2>
      <div className="space-y-4">
        {history.map((emp: any, i: number) => (
          <div key={i} className="pl-4 border-l-3 border-gold/40">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-navy" style={{ fontFamily: "var(--font-body)" }}>
                {emp.jobTitle || `Employment ${i + 1}`}
              </span>
              {emp.dateFrom && (
                <span className="text-xs text-warm-gray">
                  {emp.dateFrom} — {emp.dateTo || "Present"}
                </span>
              )}
            </div>
            {emp.employerNameAddress && (
              <p className="text-sm text-warm-gray mb-1" style={{ fontFamily: "var(--font-body)" }}>
                {emp.employerNameAddress}
              </p>
            )}
            {emp.reasonForLeaving && (
              <p className="text-xs text-warm-gray/70" style={{ fontFamily: "var(--font-body)" }}>
                Reason for leaving: {emp.reasonForLeaving}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderPreviousAddresses(addresses: any[] | undefined) {
  if (!addresses || addresses.length === 0) return null;
  const filled = addresses.filter((a: any) => a.address);
  if (filled.length === 0) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
      <h2
        className="text-base font-semibold text-navy mb-4 flex items-center gap-2 pb-3 border-b border-gray-100"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <MapPin className="w-5 h-5 text-gold" />
        Previous Addresses
      </h2>
      <div className="space-y-3">
        {filled.map((addr: any, i: number) => (
          <div key={i} className="pl-4 border-l-3 border-gold/40">
            <p className="text-sm text-navy" style={{ fontFamily: "var(--font-body)" }}>
              {addr.address}
            </p>
            {(addr.from || addr.until) && (
              <p className="text-xs text-warm-gray mt-0.5">
                {addr.from || "?"} — {addr.until || "?"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderReferees(referees: any[] | undefined) {
  if (!referees || referees.length === 0) return null;
  const filled = referees.filter((r: any) => r.name || r.surname);
  if (filled.length === 0) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
      <h2
        className="text-base font-semibold text-navy mb-4 flex items-center gap-2 pb-3 border-b border-gray-100"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <Users className="w-5 h-5 text-gold" />
        References
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filled.map((ref: any, i: number) => (
          <div key={i} className="border border-gray-100 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-navy mb-2" style={{ fontFamily: "var(--font-body)" }}>
              Referee {i + 1}: {ref.name} {ref.surname}
            </h3>
            <div className="space-y-1.5 text-xs">
              {ref.titlePosition && (
                <p className="text-warm-gray">{ref.titlePosition}</p>
              )}
              {ref.organization && (
                <p className="text-navy font-medium">{ref.organization}</p>
              )}
              {ref.address && (
                <p className="text-warm-gray">{ref.address}</p>
              )}
              {ref.postCode && (
                <p className="text-warm-gray">{ref.postCode}</p>
              )}
              {ref.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-warm-gray" />
                  <a href={`mailto:${ref.email}`} className="text-navy hover:underline">
                    {ref.email}
                  </a>
                </div>
              )}
              {ref.telephone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-warm-gray" />
                  <span className="text-navy">{ref.telephone}</span>
                </div>
              )}
              {ref.relationship && (
                <p className="text-warm-gray">Relationship: {ref.relationship}</p>
              )}
              {ref.contactPrior && (
                <p className="text-warm-gray">
                  Contact prior to interview: {ref.contactPrior === "yes" ? "Yes" : "No"}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

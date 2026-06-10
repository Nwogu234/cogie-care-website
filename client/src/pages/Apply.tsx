/**
 * GOV.UK-style multi-step job application form.
 * CV-first flow: upload CV → AI parses → pre-fills form fields.
 * Postcode lookup for address fields.
 * 3-year address history with timeline gap validation.
 * Per-step validation prevents advancing without required fields.
 */
import { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import GovFormLayout from "@/components/GovFormLayout";
import PostcodeLookup from "@/components/PostcodeLookup";
import {
  TextInput,
  TextArea,
  RadioGroup,
  Checkbox,
  SelectInput,
  FormSection,
  FormButtons,
} from "@/components/GovFormFields";
import {
  ApplicationFormData,
  createEmptyFormData,
  PREDEFINED_COURSES,
  PreviousAddress,
  EmploymentRecord,
  Referee,
} from "../../../shared/applicationTypes";
import {
  Plus,
  Trash2,
  CheckCircle2,
  FileText,
  ArrowRight,
  Upload,
  Loader2,
  Paperclip,
  X,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

const STEPS = [
  { id: 0, title: "Upload CV" },
  { id: 1, title: "Position Details" },
  { id: 2, title: "Personal Details" },
  { id: 3, title: "Additional Information" },
  { id: 4, title: "Criminal Record" },
  { id: 5, title: "Education" },
  { id: 6, title: "Training" },
  { id: 7, title: "Employment History" },
  { id: 8, title: "Relevant Experience" },
  { id: 9, title: "Availability" },
  { id: 10, title: "References" },
  { id: 11, title: "Review & Submit" },
];

/* ═══════════════════ VALIDATION HELPERS ═══════════════════ */

type Errors = Record<string, string>;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  return /^[\d\s\+\-()]{7,20}$/.test(phone);
}

function isValidNI(ni: string): boolean {
  if (!ni) return true; // NI is optional
  return /^[A-Z]{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-D]$/i.test(ni.trim());
}

function validateStep1(fd: ApplicationFormData): Errors {
  const e: Errors = {};
  if (!fd.positionApplied.trim()) e.positionApplied = "Enter the position you are applying for";
  return e;
}

function validateStep2(fd: ApplicationFormData): Errors {
  const e: Errors = {};
  if (!fd.title) e.title = "Select a title";
  if (!fd.surname.trim()) e.surname = "Enter your surname";
  if (!fd.forenames.trim()) e.forenames = "Enter your forename(s)";
  if (!fd.dateOfBirth) e.dateOfBirth = "Enter your date of birth";
  if (!fd.currentAddress.trim()) e.currentAddress = "Enter your current address";
  if (!fd.email.trim()) {
    e.email = "Enter your email address";
  } else if (!isValidEmail(fd.email)) {
    e.email = "Enter a valid email address";
  }
  if (!fd.mobileTel.trim()) {
    e.mobileTel = "Enter your mobile telephone number";
  } else if (!isValidPhone(fd.mobileTel)) {
    e.mobileTel = "Enter a valid mobile telephone number";
  }
  if (fd.homeTel && !isValidPhone(fd.homeTel)) {
    e.homeTel = "Enter a valid home telephone number";
  }
  if (fd.niNumber && !isValidNI(fd.niNumber)) {
    e.niNumber = "Enter a valid National Insurance number (e.g. QQ 12 34 56 C)";
  }
  return e;
}

function validateStep3(fd: ApplicationFormData): Errors {
  const e: Errors = {};
  if (!fd.validDrivingLicence) e.validDrivingLicence = "Select whether you have a valid UK driving licence";
  if (!fd.carForWork) e.carForWork = "Select whether you have a car for work";
  if (!fd.rightToWork) e.rightToWork = "Select whether you have the right to work in the UK";
  return e;
}

function validateStep4(fd: ApplicationFormData): Errors {
  const e: Errors = {};
  if (!fd.criminalConviction) e.criminalConviction = "Select whether you have any criminal convictions";
  if (!fd.receivedCautions) e.receivedCautions = "Select whether you have received any cautions";
  if (!fd.subjectOfProceedings) e.subjectOfProceedings = "Select whether you are subject to any proceedings";
  return e;
}

function validateStep5(_fd: ApplicationFormData): Errors {
  // Education is optional — no required fields
  return {};
}

function validateStep6(_fd: ApplicationFormData): Errors {
  // Training is optional — no required fields
  return {};
}

function validateStep7(fd: ApplicationFormData): Errors {
  const e: Errors = {};
  if (!fd.currentEmployerName.trim()) e.currentEmployerName = "Enter your current or most recent employer's name";
  return e;
}

function validateStep8(fd: ApplicationFormData): Errors {
  const e: Errors = {};
  if (!fd.relevantExperience.trim()) e.relevantExperience = "Please describe your relevant experience";
  return e;
}

function validateStep9(_fd: ApplicationFormData): Errors {
  // Availability is optional
  return {};
}

function validateStep10(fd: ApplicationFormData): Errors {
  const e: Errors = {};
  fd.referees.forEach((ref, i) => {
    if (!ref.name.trim()) e[`referee${i}Name`] = "Enter referee's first name";
    if (!ref.surname.trim()) e[`referee${i}Surname`] = "Enter referee's surname";
    if (!ref.email.trim()) {
      e[`referee${i}Email`] = "Enter referee's email address";
    } else if (!isValidEmail(ref.email)) {
      e[`referee${i}Email`] = "Enter a valid email address";
    }
  });
  return e;
}

function validateStep11(fd: ApplicationFormData): Errors {
  const e: Errors = {};
  if (!fd.declarationAgreed) e.declarationAgreed = "You must agree to the declaration";
  if (!fd.declarationName.trim()) e.declarationName = "Enter your full name as your digital signature";
  if (!fd.declarationDate) e.declarationDate = "Enter today's date";
  return e;
}

const VALIDATORS: Record<number, (fd: ApplicationFormData) => Errors> = {
  1: validateStep1,
  2: validateStep2,
  3: validateStep3,
  4: validateStep4,
  5: validateStep5,
  6: validateStep6,
  7: validateStep7,
  8: validateStep8,
  9: validateStep9,
  10: validateStep10,
  11: validateStep11,
};

/* ═══════════════════ ADDRESS TIMELINE VALIDATION ═══════════════════ */

interface TimelineGap {
  from: string;
  to: string;
  days: number;
}

function validateAddressTimeline(
  currentAddress: string,
  previousAddresses: PreviousAddress[]
): { valid: boolean; totalYears: number; gaps: TimelineGap[]; message: string } {
  const now = new Date();
  const threeYearsAgo = new Date(now);
  threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

  const periods: { from: Date; to: Date; label: string }[] = [];

  for (const addr of previousAddresses) {
    if (addr.from && addr.until && addr.address) {
      const from = new Date(addr.from);
      const to = new Date(addr.until);
      if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
        periods.push({ from, to, label: addr.address.substring(0, 30) });
      }
    }
  }

  if (periods.length === 0 && !currentAddress) {
    return { valid: true, totalYears: 0, gaps: [], message: "" };
  }

  periods.sort((a, b) => a.from.getTime() - b.from.getTime());

  const gaps: TimelineGap[] = [];
  for (let i = 0; i < periods.length - 1; i++) {
    const endOfCurrent = periods[i].to;
    const startOfNext = periods[i + 1].from;
    const gapMs = startOfNext.getTime() - endOfCurrent.getTime();
    const gapDays = Math.floor(gapMs / (1000 * 60 * 60 * 24));
    if (gapDays > 30) {
      gaps.push({
        from: endOfCurrent.toISOString().split("T")[0],
        to: startOfNext.toISOString().split("T")[0],
        days: gapDays,
      });
    }
  }

  const earliest = periods.length > 0 ? periods[0].from : now;
  const totalMs = now.getTime() - earliest.getTime();
  const totalYears = totalMs / (1000 * 60 * 60 * 24 * 365.25);

  let message = "";
  if (gaps.length > 0) {
    message = `There ${gaps.length === 1 ? "is" : "are"} ${gaps.length} gap${gaps.length === 1 ? "" : "s"} in your address history. Please ensure all dates are continuous with no unexplained gaps.`;
  } else if (totalYears < 2.9 && periods.length > 0) {
    message = `Your address history covers approximately ${totalYears.toFixed(1)} years. Please provide addresses covering the past 3 years.`;
  }

  return {
    valid: gaps.length === 0 && (totalYears >= 2.9 || periods.length === 0),
    totalYears,
    gaps,
    message,
  };
}

/* ═══════════════════ ERROR SUMMARY BANNER ═══════════════════ */

function ErrorSummary({ errors }: { errors: Errors }) {
  const errorList = Object.entries(errors);
  if (errorList.length === 0) return null;
  return (
    <div className="border-4 border-red-600 p-5 mb-6 rounded-md bg-red-50">
      <h2
        className="text-red-800 text-lg font-bold mb-3"
        style={{ fontFamily: "var(--font-display)" }}
      >
        There is a problem
      </h2>
      <ul className="space-y-1">
        {errorList.map(([key, msg]) => (
          <li key={key}>
            <a
              href={`#field-${key}`}
              className="text-red-700 text-sm underline hover:text-red-900"
              style={{ fontFamily: "var(--font-body)" }}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(`field-${key}`);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                  el.focus();
                }
              }}
            >
              {msg}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */

export default function Apply() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ApplicationFormData>(createEmptyFormData());
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [isParsingCv, setIsParsingCv] = useState(false);
  const [cvParsed, setCvParsed] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const parseCvMutation = trpc.cv.parse.useMutation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const position = params.get("position");
    if (position) {
      setFormData((prev) => ({ ...prev, positionApplied: position }));
    }
  }, []);

  const update = useCallback(
    <K extends keyof ApplicationFormData>(key: K, value: ApplicationFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      // Clear errors for this field when user types
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    []
  );

  const tryAdvance = () => {
    const validator = VALIDATORS[currentStep];
    if (validator) {
      const stepErrors = validator(formData);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        toast.error("Please complete all required fields before continuing.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }
    setErrors({});
    setCompletedSteps((prev) => {
      const next = new Set(Array.from(prev));
      next.add(currentStep);
      return next;
    });
    if (currentStep < 11) setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    setErrors({});
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const goToStep = (step: number) => {
    setErrors({});
    setCurrentStep(step);
    window.scrollTo(0, 0);
  };

  /* ═══════════════════ CV UPLOAD & PARSE ═══════════════════ */

  const handleCvUpload = async (file: File) => {
    setCvFile(file);
    setIsUploadingCv(true);

    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/cv/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileData: base64,
          mimeType: file.type,
        }),
      });
      const result = await res.json();

      if (!result.success) {
        toast.error(result.error || "Failed to upload CV");
        setCvFile(null);
        return;
      }

      setCvUrl(result.url);
      setCvFileName(file.name);
      setIsUploadingCv(false);
      toast.success("CV uploaded! Now parsing with AI...");

      setIsParsingCv(true);
      try {
        const parsed = await parseCvMutation.mutateAsync({
          fileUrl: result.url,
          mimeType: file.type,
        });

        setFormData((prev) => {
          const updated = { ...prev };
          if (parsed.title) updated.title = parsed.title;
          if (parsed.forenames) updated.forenames = parsed.forenames;
          if (parsed.surname) updated.surname = parsed.surname;
          if (parsed.email) updated.email = parsed.email;
          if (parsed.homeTel) updated.homeTel = parsed.homeTel;
          if (parsed.mobileTel) updated.mobileTel = parsed.mobileTel;
          if (parsed.currentAddress) updated.currentAddress = parsed.currentAddress;
          if (parsed.dateOfBirth) updated.dateOfBirth = parsed.dateOfBirth;
          if (parsed.placeOfBirth) updated.placeOfBirth = parsed.placeOfBirth;
          if (parsed.niNumber) updated.niNumber = parsed.niNumber;
          if (parsed.secondaryEducation) updated.secondaryEducation = parsed.secondaryEducation;
          if (parsed.secondaryQualifications) updated.secondaryQualifications = parsed.secondaryQualifications;
          if (parsed.furtherEducation) updated.furtherEducation = parsed.furtherEducation;
          if (parsed.furtherQualifications) updated.furtherQualifications = parsed.furtherQualifications;
          if (parsed.currentEmployerName) updated.currentEmployerName = parsed.currentEmployerName;
          if (parsed.currentJobTitle) updated.currentJobTitle = parsed.currentJobTitle;
          if (parsed.currentDuties) updated.currentDuties = parsed.currentDuties;
          if (parsed.relevantExperience) updated.relevantExperience = parsed.relevantExperience;
          if (parsed.professionalMemberships) updated.professionalMemberships = parsed.professionalMemberships;
          if (parsed.validDrivingLicence) updated.validDrivingLicence = parsed.validDrivingLicence;

          if (parsed.employmentHistory && parsed.employmentHistory.length > 0) {
            updated.employmentHistory = parsed.employmentHistory.map((e) => ({
              dateFrom: e.dateFrom || "",
              dateTo: e.dateTo || "",
              jobTitle: e.jobTitle || "",
              employerNameAddress: e.employerNameAddress || "",
              reasonForLeaving: e.reasonForLeaving || "",
            }));
          }

          if (parsed.trainingCourses && parsed.trainingCourses.length > 0) {
            const predefinedCourses = [...updated.trainingCourses];
            for (const pc of parsed.trainingCourses) {
              const matchIdx = predefinedCourses.findIndex(
                (c) => c.course.toLowerCase() === pc.course.toLowerCase()
              );
              if (matchIdx >= 0) {
                predefinedCourses[matchIdx] = {
                  ...predefinedCourses[matchIdx],
                  dateObtained: pc.dateObtained || predefinedCourses[matchIdx].dateObtained,
                  expiryDate: pc.expiryDate || predefinedCourses[matchIdx].expiryDate,
                };
              } else {
                predefinedCourses.push({
                  course: pc.course,
                  dateObtained: pc.dateObtained || "",
                  expiryDate: pc.expiryDate || "",
                });
              }
            }
            updated.trainingCourses = predefinedCourses;
          }

          if (parsed.referees && parsed.referees.length > 0) {
            const refs = [...updated.referees];
            for (let i = 0; i < Math.min(parsed.referees.length, 3); i++) {
              const pr = parsed.referees[i];
              refs[i] = {
                ...refs[i],
                name: pr.name || refs[i].name,
                surname: pr.surname || refs[i].surname,
                titlePosition: pr.titlePosition || refs[i].titlePosition,
                organization: pr.organization || refs[i].organization,
                email: pr.email || refs[i].email,
                telephone: pr.telephone || refs[i].telephone,
              };
            }
            updated.referees = refs as [Referee, Referee, Referee];
          }

          return updated;
        });

        setCvParsed(true);
        toast.success("CV parsed successfully! Form fields have been pre-filled.");
      } catch {
        toast.error("Could not parse CV automatically. You can still fill in the form manually.");
      } finally {
        setIsParsingCv(false);
      }
    } catch {
      toast.error("Failed to upload CV. Please try again.");
      setCvFile(null);
    } finally {
      setIsUploadingCv(false);
    }
  };

  /* ═══════════════════ SUBMIT ═══════════════════ */

  const handleSubmit = async () => {
    const submitErrors = validateStep11(formData);
    if (Object.keys(submitErrors).length > 0) {
      setErrors(submitErrors);
      toast.error("Please complete all required fields before submitting.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/application/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, cvUrl, cvFileName }),
      });
      const result = await res.json();
      if (result.success) {
        setSubmitted(true);
        toast.success("Application submitted successfully!");
      } else {
        toast.error(result.error || "Failed to submit application. Please try again.");
      }
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = STEPS.map((s) => ({
    ...s,
    completed: completedSteps.has(s.id),
  }));

  if (submitted) {
    return (
      <GovFormLayout steps={steps} currentStep={11} onStepClick={() => {}}>
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1
            className="text-navy text-3xl font-bold mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Application Submitted
          </h1>
          <p
            className="text-warm-gray text-lg mb-2 max-w-md mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Thank you for your application. A copy of your completed form has been sent to the recruitment team.
          </p>
          <p
            className="text-warm-gray text-sm mb-8"
            style={{ fontFamily: "var(--font-body)" }}
          >
            You will receive a confirmation email at <strong>{formData.email}</strong>.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-md font-semibold hover:bg-navy-light transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Return to Homepage
          </a>
        </div>
      </GovFormLayout>
    );
  }

  return (
    <GovFormLayout steps={steps} currentStep={currentStep} onStepClick={goToStep}>
      {currentStep === 0 && (
        <Step0CvUpload
          cvFile={cvFile}
          cvUrl={cvUrl}
          cvFileName={cvFileName}
          isUploadingCv={isUploadingCv}
          isParsingCv={isParsingCv}
          cvParsed={cvParsed}
          onCvUpload={handleCvUpload}
          onCvRemove={() => {
            setCvFile(null);
            setCvUrl(null);
            setCvFileName(null);
            setCvParsed(false);
          }}
          onNext={() => {
            setErrors({});
            setCompletedSteps((prev) => { const n = new Set(Array.from(prev)); n.add(0); return n; });
            setCurrentStep(1);
            window.scrollTo(0, 0);
          }}
          onSkip={() => {
            setErrors({});
            setCompletedSteps((prev) => { const n = new Set(Array.from(prev)); n.add(0); return n; });
            setCurrentStep(1);
            window.scrollTo(0, 0);
          }}
        />
      )}
      {currentStep === 1 && (
        <Step1 formData={formData} update={update} onNext={tryAdvance} onBack={goBack} errors={errors} />
      )}
      {currentStep === 2 && (
        <Step2 formData={formData} update={update} onNext={tryAdvance} onBack={goBack} errors={errors} />
      )}
      {currentStep === 3 && (
        <Step3 formData={formData} update={update} onNext={tryAdvance} onBack={goBack} errors={errors} />
      )}
      {currentStep === 4 && (
        <Step4 formData={formData} update={update} onNext={tryAdvance} onBack={goBack} errors={errors} />
      )}
      {currentStep === 5 && (
        <Step5 formData={formData} update={update} onNext={tryAdvance} onBack={goBack} errors={errors} />
      )}
      {currentStep === 6 && (
        <Step6 formData={formData} update={update} onNext={tryAdvance} onBack={goBack} errors={errors} />
      )}
      {currentStep === 7 && (
        <Step7 formData={formData} update={update} onNext={tryAdvance} onBack={goBack} errors={errors} />
      )}
      {currentStep === 8 && (
        <Step8 formData={formData} update={update} onNext={tryAdvance} onBack={goBack} errors={errors} />
      )}
      {currentStep === 9 && (
        <Step9 formData={formData} update={update} onNext={tryAdvance} onBack={goBack} errors={errors} />
      )}
      {currentStep === 10 && (
        <Step10 formData={formData} update={update} onNext={tryAdvance} onBack={goBack} errors={errors} />
      )}
      {currentStep === 11 && (
        <Step11
          formData={formData}
          update={update}
          onBack={goBack}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          goToStep={goToStep}
          errors={errors}
        />
      )}
    </GovFormLayout>
  );
}

/* ═══════════════════ STEP 0: CV UPLOAD ═══════════════════ */

interface Step0Props {
  cvFile: File | null;
  cvUrl: string | null;
  cvFileName: string | null;
  isUploadingCv: boolean;
  isParsingCv: boolean;
  cvParsed: boolean;
  onCvUpload: (file: File) => void;
  onCvRemove: () => void;
  onNext: () => void;
  onSkip: () => void;
}

function Step0CvUpload({
  cvFile,
  cvUrl,
  cvFileName,
  isUploadingCv,
  isParsingCv,
  cvParsed,
  onCvUpload,
  onCvRemove,
  onNext,
  onSkip,
}: Step0Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be under 10MB");
      return;
    }
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!allowed.includes(file.type)) {
      toast.error("Please upload a PDF, DOC, DOCX or TXT file");
      return;
    }
    onCvUpload(file);
  };

  return (
    <FormSection
      title="Upload Your CV"
      description="Upload your CV or resume to speed up your application. Our AI will read your CV and pre-fill the form fields for you, saving you time."
    >
      {/* AI info box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-md">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-900 text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-body)" }}>
              AI-Powered Form Filling
            </p>
            <p className="text-blue-800 text-sm" style={{ fontFamily: "var(--font-body)" }}>
              Upload your CV and our AI will automatically extract your personal details, employment history,
              qualifications, and more to pre-fill the application form. You can review and edit all fields before submitting.
            </p>
          </div>
        </div>
      </div>

      {/* Upload area */}
      {!cvFile && !isUploadingCv && !isParsingCv ? (
        <label className="block border-2 border-dashed border-navy/30 rounded-lg p-10 text-center cursor-pointer hover:border-gold hover:bg-cream/50 transition-colors">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          <Upload className="w-10 h-10 text-navy/40 mx-auto mb-3" />
          <p className="text-navy text-base font-semibold mb-1" style={{ fontFamily: "var(--font-body)" }}>
            Click to upload your CV
          </p>
          <p className="text-warm-gray text-sm" style={{ fontFamily: "var(--font-body)" }}>
            PDF, DOC, DOCX or TXT (max 10MB)
          </p>
        </label>
      ) : null}

      {/* Loading states */}
      {isUploadingCv && (
        <div className="border-2 border-navy/20 rounded-lg p-8 text-center bg-cream/30">
          <Loader2 className="w-8 h-8 text-navy animate-spin mx-auto mb-3" />
          <p className="text-navy text-base font-semibold" style={{ fontFamily: "var(--font-body)" }}>
            Uploading your CV...
          </p>
        </div>
      )}

      {isParsingCv && (
        <div className="border-2 border-blue-200 rounded-lg p-8 text-center bg-blue-50/50">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
          <p className="text-blue-900 text-base font-semibold mb-1" style={{ fontFamily: "var(--font-body)" }}>
            AI is reading your CV...
          </p>
          <p className="text-blue-700 text-sm" style={{ fontFamily: "var(--font-body)" }}>
            Extracting your details to pre-fill the form. This may take a moment.
          </p>
        </div>
      )}

      {/* File uploaded successfully */}
      {cvUrl && !isUploadingCv && !isParsingCv ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-cream/50 border border-navy/10 rounded-lg p-4">
            <Paperclip className="w-5 h-5 text-navy shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-navy text-sm font-semibold truncate" style={{ fontFamily: "var(--font-body)" }}>
                {cvFileName}
              </p>
              <p className="text-warm-gray text-xs" style={{ fontFamily: "var(--font-body)" }}>
                Uploaded successfully
              </p>
            </div>
            <button
              type="button"
              onClick={onCvRemove}
              className="p-1.5 text-warm-gray hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove CV"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {cvParsed && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-md">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-900 text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-body)" }}>
                    Form Pre-Filled Successfully
                  </p>
                  <p className="text-green-800 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                    We have extracted information from your CV and pre-filled the relevant form fields. Please review each section carefully and make any corrections or additions as needed.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Action buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        {cvUrl && !isParsingCv && (
          <button
            type="button"
            onClick={onNext}
            className="px-6 py-3 bg-navy text-white text-base font-semibold rounded-md hover:bg-navy-light transition-colors shadow-sm flex items-center gap-2"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Continue to Application
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
        {!cvUrl && !isUploadingCv && !isParsingCv && (
          <button
            type="button"
            onClick={onSkip}
            className="px-6 py-3 text-navy text-base font-medium hover:underline transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Skip — I'll fill in the form manually
          </button>
        )}
      </div>
    </FormSection>
  );
}

/* ═══════════════════ STEP COMPONENTS ═══════════════════ */

interface StepProps {
  formData: ApplicationFormData;
  update: <K extends keyof ApplicationFormData>(key: K, value: ApplicationFormData[K]) => void;
  onNext: () => void;
  onBack?: () => void;
  errors: Errors;
}

function Step1({ formData, update, onNext, onBack, errors }: StepProps) {
  return (
    <FormSection
      title="Position Details"
      description="Tell us which position you are applying for."
    >
      <ErrorSummary errors={errors} />
      <div id="field-positionApplied">
        <TextInput
          label="Position applied for"
          value={formData.positionApplied}
          onChange={(v) => update("positionApplied", v)}
          required
          error={errors.positionApplied}
        />
      </div>
      <TextInput
        label="Branch / Location"
        value={formData.branchLocation}
        onChange={(v) => update("branchLocation", v)}
      />
      <TextInput
        label="Where did you see this post advertised?"
        value={formData.advertisementSource}
        onChange={(v) => update("advertisementSource", v)}
      />
      <FormButtons onNext={onNext} onBack={onBack} showBack={!!onBack} />
    </FormSection>
  );
}

function Step2({ formData, update, onNext, onBack, errors }: StepProps) {
  const addPrevAddress = () => {
    update("previousAddresses", [
      ...formData.previousAddresses,
      { address: "", from: "", until: "" },
    ]);
  };

  const updatePrevAddress = (idx: number, field: keyof PreviousAddress, val: string) => {
    const updated = [...formData.previousAddresses];
    updated[idx] = { ...updated[idx], [field]: val };
    update("previousAddresses", updated);
  };

  const removePrevAddress = (idx: number) => {
    update(
      "previousAddresses",
      formData.previousAddresses.filter((_, i) => i !== idx)
    );
  };

  const timeline = useMemo(
    () => validateAddressTimeline(formData.currentAddress, formData.previousAddresses),
    [formData.currentAddress, formData.previousAddresses]
  );

  const hasAnyDates = formData.previousAddresses.some((a) => a.from || a.until);

  return (
    <FormSection
      title="Personal Details"
      description="Please complete in block capitals. All fields marked with * are required."
    >
      <ErrorSummary errors={errors} />
      <div id="field-title">
        <SelectInput
          label="Title"
          value={formData.title}
          onChange={(v) => update("title", v)}
          options={[
            { value: "Mr", label: "Mr" },
            { value: "Mrs", label: "Mrs" },
            { value: "Miss", label: "Miss" },
            { value: "Ms", label: "Ms" },
          ]}
          required
          width="one-third"
          error={errors.title}
        />
      </div>
      <div id="field-surname">
        <TextInput
          label="Surname"
          value={formData.surname}
          onChange={(v) => update("surname", v)}
          required
          width="two-thirds"
          error={errors.surname}
        />
      </div>
      <TextInput
        label="Maiden surname / Any other previous surnames"
        value={formData.maidenSurname}
        onChange={(v) => update("maidenSurname", v)}
        width="two-thirds"
      />
      <div id="field-forenames">
        <TextInput
          label="Forenames"
          value={formData.forenames}
          onChange={(v) => update("forenames", v)}
          required
          width="two-thirds"
          error={errors.forenames}
        />
      </div>
      <div id="field-niNumber">
        <TextInput
          label="National Insurance Number"
          value={formData.niNumber}
          onChange={(v) => update("niNumber", v)}
          hint="For example, QQ 12 34 56 C"
          width="half"
          error={errors.niNumber}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
        <div id="field-dateOfBirth">
          <TextInput
            label="Date of Birth"
            value={formData.dateOfBirth}
            onChange={(v) => update("dateOfBirth", v)}
            type="date"
            required
            error={errors.dateOfBirth}
          />
        </div>
        <TextInput
          label="Place of Birth"
          value={formData.placeOfBirth}
          onChange={(v) => update("placeOfBirth", v)}
        />
      </div>

      {/* Current Address with Postcode Lookup */}
      <div id="field-currentAddress">
        <PostcodeLookup
          label="Current Address"
          value={formData.currentAddress}
          onChange={(v) => update("currentAddress", v)}
          required
          hint="Search by postcode or enter your address manually"
          error={errors.currentAddress}
        />
      </div>

      {/* Previous Addresses (3 years) */}
      <div className="mb-5">
        <h3
          className="text-navy text-base font-semibold mb-1"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Previous addresses (past 3 years)
        </h3>
        <p
          className="text-warm-gray text-sm mb-3"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Please list your previous addresses covering the last 3 years. Dates must be continuous with no gaps.
        </p>

        {/* Timeline validation warning */}
        {hasAnyDates && !timeline.valid && timeline.message && (
          <div className="mb-4 p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-md">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-900 text-sm font-semibold" style={{ fontFamily: "var(--font-body)" }}>
                  Address Timeline Issue
                </p>
                <p className="text-amber-800 text-sm mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
                  {timeline.message}
                </p>
                {timeline.gaps.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {timeline.gaps.map((gap, i) => (
                      <li key={i} className="text-amber-800 text-xs" style={{ fontFamily: "var(--font-body)" }}>
                        Gap: {gap.from} to {gap.to} ({gap.days} days)
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Timeline valid indicator */}
        {hasAnyDates && timeline.valid && timeline.totalYears >= 2.9 && (
          <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 rounded-r-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <p className="text-green-800 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                Address history covers {timeline.totalYears.toFixed(1)} years — timeline is complete.
              </p>
            </div>
          </div>
        )}

        {formData.previousAddresses.map((addr, i) => (
          <div
            key={i}
            className="border border-navy/10 rounded-md p-4 mb-3 bg-cream/30"
          >
            <div className="flex justify-between items-start mb-2">
              <span
                className="text-navy text-sm font-semibold"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Previous Address {i + 1}
              </span>
              {formData.previousAddresses.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePrevAddress(i)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <PostcodeLookup
              label="Address"
              value={addr.address}
              onChange={(v) => updatePrevAddress(i, "address", v)}
              hint="Search by postcode or enter manually"
            />

            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="From"
                value={addr.from}
                onChange={(v) => updatePrevAddress(i, "from", v)}
                type="date"
              />
              <TextInput
                label="Until"
                value={addr.until}
                onChange={(v) => updatePrevAddress(i, "until", v)}
                type="date"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addPrevAddress}
          className="flex items-center gap-2 text-navy text-sm font-medium hover:text-gold-dark transition-colors"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <Plus className="w-4 h-4" /> Add another address
        </button>
      </div>

      <div id="field-email">
        <TextInput
          label="Email address"
          value={formData.email}
          onChange={(v) => update("email", v)}
          type="email"
          required
          width="two-thirds"
          error={errors.email}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
        <div id="field-homeTel">
          <TextInput
            label="Home telephone number"
            value={formData.homeTel}
            onChange={(v) => update("homeTel", v)}
            type="tel"
            error={errors.homeTel}
          />
        </div>
        <div id="field-mobileTel">
          <TextInput
            label="Mobile telephone number"
            value={formData.mobileTel}
            onChange={(v) => update("mobileTel", v)}
            type="tel"
            required
            error={errors.mobileTel}
          />
        </div>
      </div>
      <FormButtons onNext={onNext} onBack={onBack} />
    </FormSection>
  );
}

function Step3({ formData, update, onNext, onBack, errors }: StepProps) {
  const yesNo = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];
  return (
    <FormSection
      title="Additional Information"
      description="Please answer the following questions."
    >
      <ErrorSummary errors={errors} />
      <div id="field-validDrivingLicence">
        <RadioGroup
          label="Do you possess a valid UK driving licence?"
          value={formData.validDrivingLicence}
          onChange={(v) => update("validDrivingLicence", v as "yes" | "no")}
          options={yesNo}
          inline
          required
          error={errors.validDrivingLicence}
        />
      </div>
      <div id="field-carForWork">
        <RadioGroup
          label="Do you have a car for work?"
          value={formData.carForWork}
          onChange={(v) => update("carForWork", v as "yes" | "no")}
          options={yesNo}
          inline
          required
          error={errors.carForWork}
        />
      </div>
      <div id="field-rightToWork">
        <RadioGroup
          label="Do you have the legal right to work in the UK?"
          value={formData.rightToWork}
          onChange={(v) => update("rightToWork", v as "yes" | "no")}
          options={yesNo}
          inline
          required
          error={errors.rightToWork}
        />
      </div>
      {formData.rightToWork === "yes" && (
        <TextInput
          label="If there are conditions attached, please specify"
          hint="For example, start/finish dates, WRS, etc."
          value={formData.rightToWorkConditions}
          onChange={(v) => update("rightToWorkConditions", v)}
        />
      )}
      {formData.rightToWork === "no" && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-5 rounded-r-md">
          <p
            className="text-red-800 text-sm"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Please note that we are unable to recruit anyone who does not have the legal right to work in the UK.
          </p>
        </div>
      )}
      <RadioGroup
        label="Are you related to or do you know anyone who works for the company?"
        value={formData.relatedToEmployee}
        onChange={(v) => update("relatedToEmployee", v as "yes" | "no")}
        options={yesNo}
        inline
      />
      {formData.relatedToEmployee === "yes" && (
        <TextInput
          label="Please give the name and relationship"
          value={formData.relatedToEmployeeDetails}
          onChange={(v) => update("relatedToEmployeeDetails", v)}
        />
      )}
      <RadioGroup
        label="Do you have any other work commitments?"
        hint="Either paid or unpaid, which you would wish to continue if offered employment."
        value={formData.otherWorkCommitments}
        onChange={(v) => update("otherWorkCommitments", v as "yes" | "no")}
        options={yesNo}
        inline
      />
      <FormButtons onNext={onNext} onBack={onBack} />
    </FormSection>
  );
}

function Step4({ formData, update, onNext, onBack, errors }: StepProps) {
  const yesNo = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];
  return (
    <FormSection
      title="Criminal Record Declaration"
      description="The nature of this position is exempted from the Rehabilitation of Offenders Act 1974. You must declare all criminal convictions, including those that would otherwise be considered 'spent'. Answering 'Yes' will not necessarily bar you from appointment."
    >
      <ErrorSummary errors={errors} />
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-md">
        <p
          className="text-amber-900 text-sm font-medium"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Please read this carefully before answering.
        </p>
      </div>
      <div id="field-criminalConviction">
        <RadioGroup
          label="Have you ever been convicted of a criminal offence?"
          value={formData.criminalConviction}
          onChange={(v) => update("criminalConviction", v as "yes" | "no")}
          options={yesNo}
          inline
          required
          error={errors.criminalConviction}
        />
      </div>
      <div id="field-receivedCautions">
        <RadioGroup
          label="Have you ever received any official cautions, reprimand or warning?"
          value={formData.receivedCautions}
          onChange={(v) => update("receivedCautions", v as "yes" | "no")}
          options={yesNo}
          inline
          required
          error={errors.receivedCautions}
        />
      </div>
      <div id="field-subjectOfProceedings">
        <RadioGroup
          label="Are you currently the subject of any criminal proceedings or police investigation?"
          value={formData.subjectOfProceedings}
          onChange={(v) => update("subjectOfProceedings", v as "yes" | "no")}
          options={yesNo}
          inline
          required
          error={errors.subjectOfProceedings}
        />
      </div>
      <FormButtons onNext={onNext} onBack={onBack} />
    </FormSection>
  );
}

function Step5({ formData, update, onNext, onBack, errors }: StepProps) {
  return (
    <FormSection
      title="Education & Qualifications"
      description="Please provide details of your education and qualifications obtained."
    >
      <ErrorSummary errors={errors} />
      <TextArea
        label="Secondary Education"
        hint="Name of school(s) attended"
        value={formData.secondaryEducation}
        onChange={(v) => update("secondaryEducation", v)}
        rows={3}
      />
      <TextArea
        label="Qualifications / Grades obtained (Secondary)"
        value={formData.secondaryQualifications}
        onChange={(v) => update("secondaryQualifications", v)}
        rows={3}
      />
      <TextArea
        label="Further / Higher Education"
        hint="Name of college(s) or university attended"
        value={formData.furtherEducation}
        onChange={(v) => update("furtherEducation", v)}
        rows={3}
      />
      <TextArea
        label="Qualifications / Grades obtained (Further/Higher)"
        value={formData.furtherQualifications}
        onChange={(v) => update("furtherQualifications", v)}
        rows={3}
      />
      <FormButtons onNext={onNext} onBack={onBack} />
    </FormSection>
  );
}

function Step6({ formData, update, onNext, onBack, errors }: StepProps) {
  const updateCourse = (idx: number, field: "dateObtained" | "expiryDate", val: string) => {
    const updated = [...formData.trainingCourses];
    updated[idx] = { ...updated[idx], [field]: val };
    update("trainingCourses", updated);
  };

  const addCustomCourse = () => {
    update("trainingCourses", [
      ...formData.trainingCourses,
      { course: "", dateObtained: "", expiryDate: "" },
    ]);
  };

  const updateCourseName = (idx: number, val: string) => {
    const updated = [...formData.trainingCourses];
    updated[idx] = { ...updated[idx], course: val };
    update("trainingCourses", updated);
  };

  return (
    <FormSection
      title="Training & Certifications"
      description="Please provide dates for any training courses you have completed."
    >
      <ErrorSummary errors={errors} />
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-navy">
              <th className="text-left py-2 pr-4 text-navy font-semibold" style={{ fontFamily: "var(--font-body)" }}>
                Course
              </th>
              <th className="text-left py-2 pr-4 text-navy font-semibold" style={{ fontFamily: "var(--font-body)" }}>
                Date Obtained
              </th>
              <th className="text-left py-2 text-navy font-semibold" style={{ fontFamily: "var(--font-body)" }}>
                Expiry Date
              </th>
            </tr>
          </thead>
          <tbody>
            {formData.trainingCourses.map((tc, i) => (
              <tr key={i} className="border-b border-navy/10">
                <td className="py-2 pr-4">
                  {i < PREDEFINED_COURSES.length ? (
                    <span className="text-navy" style={{ fontFamily: "var(--font-body)" }}>
                      {tc.course}
                    </span>
                  ) : (
                    <input
                      type="text"
                      value={tc.course}
                      onChange={(e) => updateCourseName(i, e.target.value)}
                      placeholder="Course name"
                      className="w-full px-2 py-1.5 border border-navy/20 rounded text-navy text-sm"
                      style={{ fontFamily: "var(--font-body)" }}
                    />
                  )}
                </td>
                <td className="py-2 pr-4">
                  <input
                    type="date"
                    value={tc.dateObtained}
                    onChange={(e) => updateCourse(i, "dateObtained", e.target.value)}
                    className="px-2 py-1.5 border border-navy/20 rounded text-navy text-sm w-full"
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                </td>
                <td className="py-2">
                  <input
                    type="date"
                    value={tc.expiryDate}
                    onChange={(e) => updateCourse(i, "expiryDate", e.target.value)}
                    className="px-2 py-1.5 border border-navy/20 rounded text-navy text-sm w-full"
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addCustomCourse}
        className="flex items-center gap-2 mt-3 text-navy text-sm font-medium hover:text-gold-dark transition-colors"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <Plus className="w-4 h-4" /> Add another course
      </button>

      <div className="mt-6">
        <TextArea
          label="Other relevant training, professional qualifications or work-related skills"
          value={formData.otherTraining}
          onChange={(v) => update("otherTraining", v)}
          rows={4}
        />
        <TextArea
          label="Membership to professional bodies"
          hint="Please provide details of any professional body memberships."
          value={formData.professionalMemberships}
          onChange={(v) => update("professionalMemberships", v)}
          rows={3}
        />
      </div>
      <FormButtons onNext={onNext} onBack={onBack} />
    </FormSection>
  );
}

function Step7({ formData, update, onNext, onBack, errors }: StepProps) {
  const addEmployment = () => {
    update("employmentHistory", [
      ...formData.employmentHistory,
      { dateFrom: "", dateTo: "", jobTitle: "", employerNameAddress: "", reasonForLeaving: "" },
    ]);
  };

  const updateEmployment = (idx: number, field: keyof EmploymentRecord, val: string) => {
    const updated = [...formData.employmentHistory];
    updated[idx] = { ...updated[idx], [field]: val };
    update("employmentHistory", updated);
  };

  const removeEmployment = (idx: number) => {
    update(
      "employmentHistory",
      formData.employmentHistory.filter((_, i) => i !== idx)
    );
  };

  return (
    <FormSection
      title="Employment History"
      description="Please provide details of your current/most recent employment and full employment history. Any gaps must be explained."
    >
      <ErrorSummary errors={errors} />
      <h3
        className="text-navy text-lg font-semibold mb-4"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Current / Most Recent Employment
      </h3>
      <div id="field-currentEmployerName">
        <TextInput
          label="Employer's Name"
          value={formData.currentEmployerName}
          onChange={(v) => update("currentEmployerName", v)}
          required
          error={errors.currentEmployerName}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
        <TextInput
          label="Start Date"
          value={formData.currentEmployerStartDate}
          onChange={(v) => update("currentEmployerStartDate", v)}
          type="date"
        />
        <TextInput
          label="End Date"
          value={formData.currentEmployerEndDate}
          onChange={(v) => update("currentEmployerEndDate", v)}
          type="date"
          hint="Leave blank if current"
        />
      </div>
      <TextArea
        label="Employer's Address"
        value={formData.currentEmployerAddress}
        onChange={(v) => update("currentEmployerAddress", v)}
        rows={2}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
        <TextInput
          label="Postcode"
          value={formData.currentEmployerPostcode}
          onChange={(v) => update("currentEmployerPostcode", v)}
          width="full"
        />
        <TextInput
          label="Telephone Number"
          value={formData.currentEmployerTel}
          onChange={(v) => update("currentEmployerTel", v)}
          type="tel"
          width="full"
        />
      </div>
      <TextInput
        label="Job Title"
        value={formData.currentJobTitle}
        onChange={(v) => update("currentJobTitle", v)}
      />
      <TextInput
        label="Final Pay / Salary"
        value={formData.currentSalary}
        onChange={(v) => update("currentSalary", v)}
        width="half"
      />
      <TextArea
        label="Brief description of duties and responsibilities"
        value={formData.currentDuties}
        onChange={(v) => update("currentDuties", v)}
        rows={4}
      />

      <hr className="my-8 border-navy/10" />

      <h3
        className="text-navy text-lg font-semibold mb-4"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Full Employment History
      </h3>
      <p
        className="text-warm-gray text-sm mb-4"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Most recent first. Please explain any gaps in employment.
      </p>

      {formData.employmentHistory.map((emp, i) => (
        <div key={i} className="border border-navy/10 rounded-md p-4 mb-3 bg-cream/30">
          <div className="flex justify-between items-start mb-2">
            <span className="text-navy text-sm font-semibold" style={{ fontFamily: "var(--font-body)" }}>
              Employment {i + 1}
            </span>
            {formData.employmentHistory.length > 1 && (
              <button
                type="button"
                onClick={() => removeEmployment(i)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Date From"
              value={emp.dateFrom}
              onChange={(v) => updateEmployment(i, "dateFrom", v)}
              type="date"
            />
            <TextInput
              label="Date To"
              value={emp.dateTo}
              onChange={(v) => updateEmployment(i, "dateTo", v)}
              type="date"
            />
          </div>
          <TextInput
            label="Job Title"
            value={emp.jobTitle}
            onChange={(v) => updateEmployment(i, "jobTitle", v)}
          />
          <TextArea
            label="Employer's Name and Address"
            value={emp.employerNameAddress}
            onChange={(v) => updateEmployment(i, "employerNameAddress", v)}
            rows={2}
          />
          <TextInput
            label="Reason for Leaving"
            value={emp.reasonForLeaving}
            onChange={(v) => updateEmployment(i, "reasonForLeaving", v)}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addEmployment}
        className="flex items-center gap-2 text-navy text-sm font-medium hover:text-gold-dark transition-colors"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <Plus className="w-4 h-4" /> Add another employment record
      </button>
      <FormButtons onNext={onNext} onBack={onBack} />
    </FormSection>
  );
}

function Step8({ formData, update, onNext, onBack, errors }: StepProps) {
  return (
    <FormSection
      title="Relevant Experience"
      description="Please use this space to state how your skills, experience and training would enable you to meet the requirements of the role. Please make references to the person specification."
    >
      <ErrorSummary errors={errors} />
      <div id="field-relevantExperience">
        <TextArea
          label="Your relevant experience, skills and competencies"
          value={formData.relevantExperience}
          onChange={(v) => update("relevantExperience", v)}
          rows={10}
          required
          error={errors.relevantExperience}
        />
      </div>
      <FormButtons onNext={onNext} onBack={onBack} />
    </FormSection>
  );
}

function Step9({ formData, update, onNext, onBack, errors }: StepProps) {
  const periods = [
    { key: "monFriDays" as const, label: "Mon to Fri (Days)" },
    { key: "monFriNights" as const, label: "Mon to Fri (Nights)" },
    { key: "saturday" as const, label: "Saturday" },
    { key: "sunday" as const, label: "Sunday" },
  ];
  const slots = ["mornings", "afternoons", "evenings", "sleepOver", "wakingNights"] as const;
  const slotLabels: Record<string, string> = {
    mornings: "Mornings",
    afternoons: "Afternoons",
    evenings: "Evenings",
    sleepOver: "Sleep Over",
    wakingNights: "Waking Nights",
  };

  const toggleAvail = (
    period: keyof typeof formData.availability,
    slot: (typeof slots)[number]
  ) => {
    const updated = { ...formData.availability };
    updated[period] = { ...updated[period], [slot]: !updated[period][slot] };
    update("availability", updated);
  };

  return (
    <FormSection
      title="Availability"
      description="Only complete this section if you are applying for a Care Worker position. Tick the times you are available."
    >
      <ErrorSummary errors={errors} />
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-navy">
              <th className="text-left py-2 pr-4 text-navy font-semibold" style={{ fontFamily: "var(--font-body)" }}>
                Period
              </th>
              {slots.map((s) => (
                <th
                  key={s}
                  className="text-center py-2 px-2 text-navy font-semibold text-xs"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {slotLabels[s]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((p) => (
              <tr key={p.key} className="border-b border-navy/10">
                <td className="py-3 pr-4 text-navy font-medium" style={{ fontFamily: "var(--font-body)" }}>
                  {p.label}
                </td>
                {slots.map((s) => (
                  <td key={s} className="text-center py-3 px-2">
                    <input
                      type="checkbox"
                      checked={formData.availability[p.key][s]}
                      onChange={() => toggleAvail(p.key, s)}
                      className="w-5 h-5 accent-navy"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TextInput
        label="Geographical area(s) you are interested in working"
        value={formData.geographicalAreas}
        onChange={(v) => update("geographicalAreas", v)}
      />
      <RadioGroup
        label="The work you are interested in"
        value={formData.workType}
        onChange={(v) => update("workType", v)}
        options={[
          { value: "Personal Care", label: "Personal Care" },
          { value: "Domestic Care", label: "Domestic Care" },
          { value: "Both", label: "Both" },
        ]}
        inline
      />
      <TextInput
        label="Ideal number of hours you would like to work per week"
        value={formData.idealHours}
        onChange={(v) => update("idealHours", v)}
        width="one-third"
      />
      <FormButtons onNext={onNext} onBack={onBack} />
    </FormSection>
  );
}

function Step10({ formData, update, onNext, onBack, errors }: StepProps) {
  const updateReferee = (idx: number, field: keyof Referee, val: string) => {
    const updated = [...formData.referees] as [Referee, Referee, Referee];
    updated[idx] = { ...updated[idx], [field]: val };
    update("referees", updated);
  };

  return (
    <FormSection
      title="References"
      description="Please provide at least three referees. The first two must be your present or most recent employer who can provide information relating to your competency in a caring role."
    >
      <ErrorSummary errors={errors} />
      {formData.referees.map((ref, i) => (
        <div key={i} className="mb-6">
          <h3
            className="text-navy text-lg font-semibold mb-3 pb-2 border-b border-navy/10"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Referee {i + 1}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <div id={`field-referee${i}Name`}>
              <TextInput
                label="First Name"
                value={ref.name}
                onChange={(v) => updateReferee(i, "name", v)}
                required
                error={errors[`referee${i}Name`]}
              />
            </div>
            <div id={`field-referee${i}Surname`}>
              <TextInput
                label="Surname"
                value={ref.surname}
                onChange={(v) => updateReferee(i, "surname", v)}
                required
                error={errors[`referee${i}Surname`]}
              />
            </div>
          </div>
          <TextInput
            label="Title / Position"
            value={ref.titlePosition}
            onChange={(v) => updateReferee(i, "titlePosition", v)}
          />
          <TextInput
            label="Organisation"
            value={ref.organization}
            onChange={(v) => updateReferee(i, "organization", v)}
          />
          <TextArea
            label="Address"
            value={ref.address}
            onChange={(v) => updateReferee(i, "address", v)}
            rows={2}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <TextInput
              label="Post Code"
              value={ref.postCode}
              onChange={(v) => updateReferee(i, "postCode", v)}
            />
            <TextInput
              label="Relationship to applicant"
              value={ref.relationship}
              onChange={(v) => updateReferee(i, "relationship", v)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <div id={`field-referee${i}Email`}>
              <TextInput
                label="Email Address"
                value={ref.email}
                onChange={(v) => updateReferee(i, "email", v)}
                type="email"
                required
                error={errors[`referee${i}Email`]}
              />
            </div>
            <TextInput
              label="Telephone Number"
              value={ref.telephone}
              onChange={(v) => updateReferee(i, "telephone", v)}
              type="tel"
            />
          </div>
          <RadioGroup
            label="Can we contact this referee prior to interview?"
            value={ref.contactPrior}
            onChange={(v) => updateReferee(i, "contactPrior", v)}
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
            inline
          />
        </div>
      ))}
      <FormButtons onNext={onNext} onBack={onBack} />
    </FormSection>
  );
}

/* ═══════════════════ STEP 11: REVIEW & SUBMIT ═══════════════════ */

interface Step11Props {
  formData: ApplicationFormData;
  update: <K extends keyof ApplicationFormData>(key: K, value: ApplicationFormData[K]) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  goToStep: (step: number) => void;
  errors: Errors;
}

function Step11({ formData, update, onBack, onSubmit, isSubmitting, goToStep, errors }: Step11Props) {
  const SummaryRow = ({
    label,
    value,
    step,
  }: {
    label: string;
    value: string;
    step: number;
  }) => (
    <div className="flex justify-between items-start py-2.5 border-b border-navy/10">
      <dt className="text-warm-gray text-sm w-1/3" style={{ fontFamily: "var(--font-body)" }}>
        {label}
      </dt>
      <dd className="text-navy text-sm font-medium w-1/2" style={{ fontFamily: "var(--font-body)" }}>
        {value || <span className="text-warm-gray/50 italic">Not provided</span>}
      </dd>
      <button
        onClick={() => goToStep(step)}
        className="text-navy text-sm font-semibold hover:text-gold-dark underline"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Change
      </button>
    </div>
  );

  return (
    <FormSection
      title="Review Your Application"
      description="Please check your answers before submitting. You can go back to change any section."
    >
      <ErrorSummary errors={errors} />

      {/* Summary sections */}
      <div className="mb-8">
        <h3 className="text-navy text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-display)" }}>
          Position Details
        </h3>
        <dl>
          <SummaryRow label="Position" value={formData.positionApplied} step={1} />
          <SummaryRow label="Branch" value={formData.branchLocation} step={1} />
          <SummaryRow label="Source" value={formData.advertisementSource} step={1} />
        </dl>
      </div>

      <div className="mb-8">
        <h3 className="text-navy text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-display)" }}>
          Personal Details
        </h3>
        <dl>
          <SummaryRow label="Name" value={`${formData.title} ${formData.forenames} ${formData.surname}`} step={2} />
          <SummaryRow label="Date of Birth" value={formData.dateOfBirth} step={2} />
          <SummaryRow label="NI Number" value={formData.niNumber} step={2} />
          <SummaryRow label="Email" value={formData.email} step={2} />
          <SummaryRow label="Mobile" value={formData.mobileTel} step={2} />
          <SummaryRow label="Current Address" value={formData.currentAddress} step={2} />
        </dl>
      </div>

      <div className="mb-8">
        <h3 className="text-navy text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-display)" }}>
          Additional Information
        </h3>
        <dl>
          <SummaryRow label="Driving Licence" value={formData.validDrivingLicence} step={3} />
          <SummaryRow label="Car for Work" value={formData.carForWork} step={3} />
          <SummaryRow label="Right to Work" value={formData.rightToWork} step={3} />
        </dl>
      </div>

      <div className="mb-8">
        <h3 className="text-navy text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-display)" }}>
          Criminal Record
        </h3>
        <dl>
          <SummaryRow label="Criminal Convictions" value={formData.criminalConviction} step={4} />
          <SummaryRow label="Cautions/Warnings" value={formData.receivedCautions} step={4} />
          <SummaryRow label="Current Proceedings" value={formData.subjectOfProceedings} step={4} />
        </dl>
      </div>

      <div className="mb-8">
        <h3 className="text-navy text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-display)" }}>
          Employment
        </h3>
        <dl>
          <SummaryRow label="Current Employer" value={formData.currentEmployerName} step={7} />
          <SummaryRow label="Current Job Title" value={formData.currentJobTitle} step={7} />
        </dl>
      </div>

      <div className="mb-8">
        <h3 className="text-navy text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-display)" }}>
          Relevant Experience
        </h3>
        <dl>
          <SummaryRow
            label="Experience"
            value={formData.relevantExperience ? formData.relevantExperience.substring(0, 100) + (formData.relevantExperience.length > 100 ? "..." : "") : ""}
            step={8}
          />
        </dl>
      </div>

      <div className="mb-8">
        <h3 className="text-navy text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-display)" }}>
          References
        </h3>
        <dl>
          {formData.referees.map((ref, i) => (
            <SummaryRow
              key={i}
              label={`Referee ${i + 1}`}
              value={ref.name && ref.surname ? `${ref.name} ${ref.surname} — ${ref.organization}` : ""}
              step={10}
            />
          ))}
        </dl>
      </div>

      {/* Declaration */}
      <div className="border-t-4 border-navy pt-6 mt-8">
        <h3 className="text-navy text-lg font-semibold mb-4" style={{ fontFamily: "var(--font-display)" }}>
          Applicant Declaration
        </h3>
        <div
          className="bg-cream p-5 rounded-md mb-5 text-sm text-navy leading-relaxed space-y-3"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <p>
            1) The information in this form is true and complete. I agree that any deliberate omissions,
            falsification or misinterpretation will be grounds for rejecting this application or subsequent
            dismissal.
          </p>
          <p>
            2) I confirm that I have not been subject to any cautions or convictions (other than those given
            above), investigation, disciplinary action, or enquiry into adult/child protection matters.
          </p>
          <p>
            3) I agree that this company reserves the right to require me to undergo a medical examination and
            that information will be processed in accordance with data protection legislation.
          </p>
          <p>
            4) The information collected in this application form is specific to our recruitment exercise and
            necessary for the performance of the role applied for.
          </p>
          <p>
            5) We will treat all personal information with utmost integrity and confidentiality in line with
            data protection principles.
          </p>
        </div>

        <div id="field-declarationAgreed">
          <Checkbox
            label="I agree to the above declaration"
            checked={formData.declarationAgreed}
            onChange={(v) => update("declarationAgreed", v)}
            error={errors.declarationAgreed}
          />
        </div>
        <div id="field-declarationName">
          <TextInput
            label="Full Name (as your digital signature)"
            value={formData.declarationName}
            onChange={(v) => update("declarationName", v)}
            required
            error={errors.declarationName}
          />
        </div>
        <div id="field-declarationDate">
          <TextInput
            label="Date"
            value={formData.declarationDate}
            onChange={(v) => update("declarationDate", v)}
            type="date"
            required
            width="half"
            error={errors.declarationDate}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-8 py-3.5 bg-green-700 text-white text-base font-semibold rounded-md hover:bg-green-800 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {isSubmitting ? (
            "Submitting..."
          ) : (
            <>
              <FileText className="w-4 h-4" />
              Submit Application
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 text-navy text-base font-medium hover:underline transition-colors"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Back
        </button>
      </div>
    </FormSection>
  );
}

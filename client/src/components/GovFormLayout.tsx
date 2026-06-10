/**
 * GOV.UK-style form layout with step-by-step navigation.
 * Clean, accessible, section-by-section form filling.
 */
import { CheckCircle2 } from "lucide-react";

interface Step {
  id: number;
  title: string;
  completed: boolean;
}

interface GovFormLayoutProps {
  steps: Step[];
  currentStep: number;
  children: React.ReactNode;
  onStepClick?: (step: number) => void;
}

const LOGO_ICON_URL =
  "https://files.manuscdn.com/user_upload_by_module/session_file/120168284/IfTEiEpNrEdfnUWG.png";

export default function GovFormLayout({
  steps,
  currentStep,
  children,
  onStepClick,
}: GovFormLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header bar */}
      <header className="bg-navy border-b-[10px] border-gold">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <img src={LOGO_ICON_URL} alt="Cogie Care Services" className="h-8 w-auto" />
          <div className="leading-tight">
            <span
              className="text-white text-sm font-bold tracking-tight block"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Cogie Care Services
            </span>
            <span
              className="text-gold text-[9px] tracking-[0.15em] uppercase block"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Job Application
            </span>
          </div>
        </div>
      </header>

      {/* Phase banner */}
      <div className="bg-cream border-b border-cream-dark">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-2">
          <p
            className="text-warm-gray text-xs"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <strong className="text-navy">Application Form</strong> — Complete
            all sections below. Your progress is saved as you go.
          </p>
        </div>
      </div>

      <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">
          {/* Sidebar step tracker */}
          <aside className="hidden lg:block">
            <nav>
              <h2
                className="text-navy text-sm font-bold uppercase tracking-wider mb-4"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Sections
              </h2>
              <ol className="space-y-1">
                {steps.map((step) => {
                  const isCurrent = step.id === currentStep;
                  const isClickable =
                    step.completed || step.id <= currentStep;
                  return (
                    <li key={step.id}>
                      <button
                        onClick={() =>
                          isClickable && onStepClick?.(step.id)
                        }
                        disabled={!isClickable}
                        className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors flex items-center gap-2.5 ${
                          isCurrent
                            ? "bg-navy text-white font-semibold"
                            : step.completed
                            ? "text-navy hover:bg-cream cursor-pointer"
                            : "text-warm-gray/50 cursor-not-allowed"
                        }`}
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                        ) : (
                          <span
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              isCurrent
                                ? "border-white text-white"
                                : "border-warm-gray/30 text-warm-gray/50"
                            }`}
                          >
                            {step.id}
                          </span>
                        )}
                        <span className="truncate">{step.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </aside>

          {/* Mobile step indicator */}
          <div className="lg:hidden mb-2">
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-warm-gray text-sm"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Section {currentStep} of {steps.length}
              </span>
              <span
                className="text-navy text-sm font-semibold"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {steps[currentStep - 1]?.title}
              </span>
            </div>
            <div className="w-full bg-cream-dark rounded-full h-2">
              <div
                className="bg-navy h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(currentStep / steps.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Main content area */}
          <main className="min-w-0">{children}</main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-cream-dark mt-12">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-6">
          <p
            className="text-warm-gray text-xs"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Petrichor Healthcare Provisions Ltd — Job Application Form
          </p>
        </div>
      </footer>
    </div>
  );
}

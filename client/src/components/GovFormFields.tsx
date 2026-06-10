/**
 * GOV.UK-style form field components.
 * Clean, accessible, with proper labels and hints.
 */
import React from "react";

interface TextInputProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  required?: boolean;
  width?: "full" | "two-thirds" | "half" | "one-third" | "one-quarter";
  error?: string;
  placeholder?: string;
}

const widthMap = {
  full: "w-full",
  "two-thirds": "w-full sm:w-2/3",
  half: "w-full sm:w-1/2",
  "one-third": "w-full sm:w-1/3",
  "one-quarter": "w-full sm:w-1/4",
};

export function TextInput({
  label,
  hint,
  value,
  onChange,
  type = "text",
  required,
  width = "full",
  error,
  placeholder,
}: TextInputProps) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        className="block text-navy text-base font-semibold mb-1"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </label>
      {hint && (
        <span
          className="block text-warm-gray text-sm mb-2"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {hint}
        </span>
      )}
      {error && (
        <span className="block text-red-600 text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-body)" }}>
          {error}
        </span>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${widthMap[width]} px-3 py-2.5 border-2 ${
          error ? "border-red-600" : "border-navy/30"
        } rounded-md text-navy text-base focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-colors`}
        style={{ fontFamily: "var(--font-body)" }}
      />
    </div>
  );
}

interface TextAreaProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (val: string) => void;
  rows?: number;
  required?: boolean;
  error?: string;
}

export function TextArea({
  label,
  hint,
  value,
  onChange,
  rows = 5,
  required,
  error,
}: TextAreaProps) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        className="block text-navy text-base font-semibold mb-1"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </label>
      {hint && (
        <span
          className="block text-warm-gray text-sm mb-2"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {hint}
        </span>
      )}
      {error && (
        <span className="block text-red-600 text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-body)" }}>
          {error}
        </span>
      )}
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`w-full px-3 py-2.5 border-2 ${
          error ? "border-red-600" : "border-navy/30"
        } rounded-md text-navy text-base focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-colors resize-y`}
        style={{ fontFamily: "var(--font-body)" }}
      />
    </div>
  );
}

interface RadioGroupProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
  inline?: boolean;
}

export function RadioGroup({
  label,
  hint,
  value,
  onChange,
  options,
  required,
  error,
  inline,
}: RadioGroupProps) {
  const name = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="mb-5">
      <fieldset>
        <legend
          className="block text-navy text-base font-semibold mb-1"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {label}
          {required && <span className="text-red-600 ml-0.5">*</span>}
        </legend>
        {hint && (
          <span
            className="block text-warm-gray text-sm mb-2"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {hint}
          </span>
        )}
        {error && (
          <span className="block text-red-600 text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-body)" }}>
            {error}
          </span>
        )}
        <div className={inline ? "flex flex-wrap gap-6" : "space-y-2"}>
          {options.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 cursor-pointer py-1"
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
                className="w-5 h-5 accent-navy"
              />
              <span
                className="text-navy text-base"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  hint?: string;
  error?: string;
}

export function Checkbox({ label, checked, onChange, hint, error }: CheckboxProps) {
  return (
    <div className="mb-5">
      {error && (
        <span className="block text-red-600 text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-body)" }}>
          {error}
        </span>
      )}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-5 h-5 mt-0.5 accent-navy"
        />
        <div>
          <span
            className="text-navy text-base font-medium"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {label}
          </span>
          {hint && (
            <span
              className="block text-warm-gray text-sm mt-0.5"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {hint}
            </span>
          )}
        </div>
      </label>
    </div>
  );
}

interface SelectInputProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  width?: "full" | "two-thirds" | "half" | "one-third";
  error?: string;
}

export function SelectInput({
  label,
  hint,
  value,
  onChange,
  options,
  required,
  width = "full",
  error,
}: SelectInputProps) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        className="block text-navy text-base font-semibold mb-1"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </label>
      {hint && (
        <span
          className="block text-warm-gray text-sm mb-2"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {hint}
        </span>
      )}
      {error && (
        <span className="block text-red-600 text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-body)" }}>
          {error}
        </span>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${widthMap[width]} px-3 py-2.5 border-2 ${
          error ? "border-red-600" : "border-navy/30"
        } rounded-md text-navy text-base bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-colors`}
        style={{ fontFamily: "var(--font-body)" }}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <div>
      <h1
        className="text-navy text-2xl sm:text-3xl font-bold mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h1>
      {description && (
        <p
          className="text-warm-gray text-base mb-8 max-w-2xl"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {description}
        </p>
      )}
      <div className="border-t-4 border-navy pt-6">{children}</div>
    </div>
  );
}

interface FormButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  showBack?: boolean;
  isSubmitting?: boolean;
}

export function FormButtons({
  onBack,
  onNext,
  nextLabel = "Save and continue",
  showBack = true,
  isSubmitting,
}: FormButtonsProps) {
  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-3">
      <button
        type="button"
        onClick={onNext}
        disabled={isSubmitting}
        className="px-6 py-3 bg-navy text-white text-base font-semibold rounded-md hover:bg-navy-light transition-colors shadow-sm disabled:opacity-50"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {isSubmitting ? "Submitting..." : nextLabel}
      </button>
      {showBack && onBack && (
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 text-navy text-base font-medium hover:underline transition-colors"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Back
        </button>
      )}
    </div>
  );
}

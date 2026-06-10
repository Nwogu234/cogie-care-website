/**
 * UK Postcode Address Lookup component.
 * Uses postcodes.io (free, no API key) for postcode validation
 * and allows manual address entry.
 */
import { useState, useCallback } from "react";
import { Search, MapPin, Loader2, ChevronDown, Edit3 } from "lucide-react";

interface PostcodeLookupProps {
  label: string;
  value: string;
  onChange: (address: string) => void;
  required?: boolean;
  hint?: string;
  error?: string;
}

interface PostcodeResult {
  postcode: string;
  admin_district: string;
  admin_ward: string;
  parish: string;
  region: string;
  country: string;
}

export default function PostcodeLookup({
  label,
  value,
  onChange,
  required,
  hint,
  error: externalError,
}: PostcodeLookupProps) {
  const [postcode, setPostcode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<PostcodeResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [error, setError] = useState("");
  const [manualFields, setManualFields] = useState({
    line1: "",
    line2: "",
    city: "",
    county: "",
    postcode: "",
  });

  const searchPostcode = useCallback(async () => {
    if (!postcode.trim()) {
      setError("Please enter a postcode");
      return;
    }

    setIsSearching(true);
    setError("");
    setSearchResults([]);
    setShowResults(false);

    try {
      const cleanPostcode = postcode.trim().replace(/\s+/g, "");
      const res = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(cleanPostcode)}`
      );
      const data = await res.json();

      if (data.status === 200 && data.result) {
        const result = data.result;
        // Pre-fill manual fields with postcode data
        setManualFields({
          line1: "",
          line2: result.admin_ward || "",
          city: result.admin_district || "",
          county: result.region || "",
          postcode: result.postcode,
        });
        setShowManual(true);
        setShowResults(false);
      } else {
        setError(
          "Postcode not found. Please check and try again, or enter your address manually."
        );
      }
    } catch {
      setError(
        "Unable to look up postcode. Please enter your address manually."
      );
    } finally {
      setIsSearching(false);
    }
  }, [postcode]);

  const applyManualAddress = () => {
    const parts = [
      manualFields.line1,
      manualFields.line2,
      manualFields.city,
      manualFields.county,
      manualFields.postcode,
    ].filter(Boolean);
    onChange(parts.join(", "));
    setShowManual(false);
  };

  return (
    <div className="mb-5">
      <label
        className="block text-navy text-sm font-semibold mb-1"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {hint && (
        <p
          className="text-warm-gray text-xs mb-2"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {hint}
        </p>
      )}
      {externalError && (
        <span className="block text-red-600 text-sm font-semibold mb-2" style={{ fontFamily: "var(--font-body)" }}>
          {externalError}
        </span>
      )}

      {/* Current value display */}
      {value && !showManual && (
        <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-md mb-3">
          <MapPin className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p
              className="text-sm text-navy"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {value}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onChange("");
              setShowManual(false);
              setShowResults(false);
              setPostcode("");
            }}
            className="text-xs text-navy/60 hover:text-navy underline"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Change
          </button>
        </div>
      )}

      {/* Search input */}
      {!value && !showManual && (
        <>
          <div className="flex gap-2 mb-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    searchPostcode();
                  }
                }}
                placeholder="Enter postcode (e.g. N9 8RP)"
                className="w-full px-3 py-2.5 border-2 border-navy/20 rounded-md text-sm text-navy focus:border-gold focus:outline-none transition-colors"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>
            <button
              type="button"
              onClick={searchPostcode}
              disabled={isSearching}
              className="px-4 py-2.5 bg-navy text-white text-sm font-semibold rounded-md hover:bg-navy-light transition-colors disabled:opacity-50 flex items-center gap-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Find
            </button>
          </div>

          {error && (
            <p
              className="text-red-600 text-xs mb-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={() => setShowManual(true)}
            className="flex items-center gap-1.5 text-xs text-navy/60 hover:text-navy underline transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Edit3 className="w-3 h-3" />
            Enter address manually
          </button>
        </>
      )}

      {/* Manual entry form (also shown after postcode lookup with pre-filled fields) */}
      {showManual && (
        <div className="border border-navy/10 rounded-md p-4 bg-cream/30">
          {manualFields.postcode && (
            <div className="flex items-center gap-2 mb-3 text-green-700 text-xs">
              <MapPin className="w-3 h-3" />
              <span style={{ fontFamily: "var(--font-body)" }}>
                Postcode found — please enter your street address below
              </span>
            </div>
          )}
          <div className="space-y-3">
            <div>
              <label
                className="block text-navy text-xs font-medium mb-1"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Address line 1 (street and number) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={manualFields.line1}
                onChange={(e) =>
                  setManualFields({ ...manualFields, line1: e.target.value })
                }
                placeholder="e.g. 13 Woodland Road"
                className="w-full px-3 py-2 border-2 border-navy/20 rounded-md text-sm text-navy focus:border-gold focus:outline-none"
                style={{ fontFamily: "var(--font-body)" }}
                autoFocus
              />
            </div>
            <div>
              <label
                className="block text-navy text-xs font-medium mb-1"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Address line 2 (optional)
              </label>
              <input
                type="text"
                value={manualFields.line2}
                onChange={(e) =>
                  setManualFields({ ...manualFields, line2: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-navy/20 rounded-md text-sm text-navy focus:border-gold focus:outline-none"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-navy text-xs font-medium mb-1"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Town / City
                </label>
                <input
                  type="text"
                  value={manualFields.city}
                  onChange={(e) =>
                    setManualFields({ ...manualFields, city: e.target.value })
                  }
                  className="w-full px-3 py-2 border-2 border-navy/20 rounded-md text-sm text-navy focus:border-gold focus:outline-none"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
              <div>
                <label
                  className="block text-navy text-xs font-medium mb-1"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  County
                </label>
                <input
                  type="text"
                  value={manualFields.county}
                  onChange={(e) =>
                    setManualFields({ ...manualFields, county: e.target.value })
                  }
                  className="w-full px-3 py-2 border-2 border-navy/20 rounded-md text-sm text-navy focus:border-gold focus:outline-none"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
            </div>
            <div className="w-1/2">
              <label
                className="block text-navy text-xs font-medium mb-1"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Postcode
              </label>
              <input
                type="text"
                value={manualFields.postcode}
                onChange={(e) =>
                  setManualFields({
                    ...manualFields,
                    postcode: e.target.value.toUpperCase(),
                  })
                }
                className="w-full px-3 py-2 border-2 border-navy/20 rounded-md text-sm text-navy focus:border-gold focus:outline-none"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={applyManualAddress}
              disabled={!manualFields.line1.trim()}
              className="px-4 py-2 bg-navy text-white text-sm font-semibold rounded-md hover:bg-navy-light transition-colors disabled:opacity-50"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Use this address
            </button>
            <button
              type="button"
              onClick={() => {
                setShowManual(false);
                setManualFields({ line1: "", line2: "", city: "", county: "", postcode: "" });
              }}
              className="px-4 py-2 text-navy text-sm font-medium hover:bg-navy/5 rounded-md transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

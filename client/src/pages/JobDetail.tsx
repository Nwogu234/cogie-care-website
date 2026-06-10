/**
 * Individual job detail page — accessible via shareable URL /careers/:slug
 * Displays the full AI-formatted job posting with apply button.
 */
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Briefcase,
  PoundSterling,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Share2,
  CheckCircle,
  Copy,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export default function JobDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const { data: job, isLoading } = trpc.jobs.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: job?.title ?? "Job Opening", url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <section className="py-20 bg-cream min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-6">
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-10 bg-gray-200 rounded w-2/3" />
              <div className="flex gap-4">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-4 bg-gray-200 rounded w-32" />
              </div>
              <div className="h-64 bg-gray-200 rounded" />
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  if (!job) {
    return (
      <PageLayout>
        <section className="py-20 bg-cream min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Briefcase className="w-16 h-16 text-navy/20 mx-auto mb-4" />
            <h1
              className="text-2xl font-semibold text-navy mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Position Not Found
            </h1>
            <p
              className="text-warm-gray mb-6"
              style={{ fontFamily: "var(--font-body)" }}
            >
              This job posting may have been removed or is no longer available.
            </p>
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              View All Openings
            </Link>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Header */}
      <section className="bg-navy py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Openings
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl text-white font-semibold mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {job.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap gap-4 text-sm text-white/70 mb-6"
          >
            {job.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
            )}
            {job.employmentType && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {job.employmentType}
              </span>
            )}
            {job.department && (
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                {job.department}
              </span>
            )}
            {job.salary && (
              <span className="flex items-center gap-1.5">
                <PoundSterling className="w-4 h-4" />
                {job.salary}
              </span>
            )}
            {job.closingDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Closes{" "}
                {new Date(job.closingDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-3"
          >
            <Link
              href={`/apply?job=${job.id}&position=${encodeURIComponent(job.title)}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-navy font-semibold rounded-lg hover:bg-gold-light transition-colors shadow-md"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Apply Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {copied ? (
                <Copy className="w-4 h-4" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
              <span className="text-sm">{copied ? "Copied!" : "Share"}</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-cream-dark"
              >
                <h2
                  className="text-xl font-semibold text-navy mb-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  About the Role
                </h2>
                <div
                  className="prose prose-sm max-w-none text-warm-gray"
                  style={{ fontFamily: "var(--font-body)" }}
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </motion.div>

              {/* Responsibilities */}
              {job.responsibilities && (job.responsibilities as string[]).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-cream-dark"
                >
                  <h2
                    className="text-xl font-semibold text-navy mb-4"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Key Responsibilities
                  </h2>
                  <ul className="space-y-3">
                    {(job.responsibilities as string[]).map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-warm-gray" style={{ fontFamily: "var(--font-body)" }}>
                        <CheckCircle className="w-5 h-5 text-gold-dark shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Requirements */}
              {job.requirements && (job.requirements as string[]).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-cream-dark"
                >
                  <h2
                    className="text-xl font-semibold text-navy mb-4"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Requirements
                  </h2>
                  <ul className="space-y-3">
                    {(job.requirements as string[]).map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-warm-gray" style={{ fontFamily: "var(--font-body)" }}>
                        <CheckCircle className="w-5 h-5 text-navy/40 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Benefits */}
              {job.benefits && (job.benefits as string[]).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-cream-dark"
                >
                  <h2
                    className="text-xl font-semibold text-navy mb-4"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    What We Offer
                  </h2>
                  <ul className="space-y-3">
                    {(job.benefits as string[]).map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-warm-gray" style={{ fontFamily: "var(--font-body)" }}>
                        <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* How to Apply */}
              {job.howToApply && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-navy/5 rounded-xl p-6 sm:p-8 border border-navy/10"
                >
                  <h2
                    className="text-xl font-semibold text-navy mb-3"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    How to Apply
                  </h2>
                  <p
                    className="text-warm-gray text-sm leading-relaxed mb-4"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {job.howToApply}
                  </p>
                  <Link
                    href={`/apply?job=${job.id}&position=${encodeURIComponent(job.title)}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-colors"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Apply Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-cream-dark sticky top-24">
                <h3
                  className="text-lg font-semibold text-navy mb-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Job Summary
                </h3>
                <div className="space-y-4 text-sm">
                  {job.employmentType && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-gold-dark mt-0.5" />
                      <div>
                        <div className="text-navy font-medium">Employment Type</div>
                        <div className="text-warm-gray">{job.employmentType}</div>
                      </div>
                    </div>
                  )}
                  {job.salary && (
                    <div className="flex items-start gap-3">
                      <PoundSterling className="w-4 h-4 text-gold-dark mt-0.5" />
                      <div>
                        <div className="text-navy font-medium">Salary</div>
                        <div className="text-warm-gray">{job.salary}</div>
                      </div>
                    </div>
                  )}
                  {job.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gold-dark mt-0.5" />
                      <div>
                        <div className="text-navy font-medium">Location</div>
                        <div className="text-warm-gray">{job.location}</div>
                      </div>
                    </div>
                  )}
                  {job.department && (
                    <div className="flex items-start gap-3">
                      <Briefcase className="w-4 h-4 text-gold-dark mt-0.5" />
                      <div>
                        <div className="text-navy font-medium">Department</div>
                        <div className="text-warm-gray">{job.department}</div>
                      </div>
                    </div>
                  )}
                  {job.closingDate && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-gold-dark mt-0.5" />
                      <div>
                        <div className="text-navy font-medium">Closing Date</div>
                        <div className="text-warm-gray">
                          {new Date(job.closingDate).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-cream-dark">
                  <Link
                    href={`/apply?job=${job.id}&position=${encodeURIComponent(job.title)}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold text-navy font-semibold rounded-lg hover:bg-gold-light transition-colors shadow-md text-sm"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Apply for this Role
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

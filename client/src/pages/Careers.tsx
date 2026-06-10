/**
 * Careers landing page — lists all published job openings.
 * Each job card links to a detailed job page with a shareable URL.
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Briefcase,
  PoundSterling,
  ArrowRight,
  Search,
  Users,
  Heart,
  Shield,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/SectionHeading";
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" as const },
  transition: { duration: 0.6 },
};

const whyJoinUs = [
  {
    icon: Heart,
    title: "Make a Real Difference",
    desc: "Work directly with vulnerable adults, helping them rebuild their lives and achieve independence.",
  },
  {
    icon: Users,
    title: "Supportive Team",
    desc: "Join a compassionate, experienced team that values collaboration and professional growth.",
  },
  {
    icon: Shield,
    title: "Training & Development",
    desc: "Access ongoing training, certifications, and career progression opportunities in the care sector.",
  },
];

export default function Careers() {
  const { data: jobs, isLoading } = trpc.jobs.listPublished.useQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    return jobs.filter((job) => {
      const matchesSearch =
        !searchTerm ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.summary ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.department ?? "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        filterType === "all" ||
        (job.employmentType ?? "").toLowerCase().includes(filterType.toLowerCase());
      return matchesSearch && matchesType;
    });
  }, [jobs, searchTerm, filterType]);

  return (
    <PageLayout>
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative bg-navy py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Join Our Team
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl text-white font-semibold leading-tight mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Careers at{" "}
            <span className="text-gold italic">Cogie Care</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/70 text-lg max-w-2xl mx-auto mb-10"
            style={{ fontFamily: "var(--font-body)" }}
          >
            We are always looking for compassionate, dedicated individuals to join our
            team. Explore our current openings and start making a difference in
            people's lives.
          </motion.p>

          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
              <input
                type="text"
                placeholder="Search positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-lg bg-white text-navy text-sm border-0 focus:ring-2 focus:ring-gold outline-none"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3.5 rounded-lg bg-white text-navy text-sm border-0 focus:ring-2 focus:ring-gold outline-none"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <option value="all">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="temporary">Temporary</option>
            </select>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ JOB LISTINGS ═══════════════════ */}
      <section className="py-16 sm:py-24 bg-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 shadow-sm border border-cream-dark animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                    <div className="h-4 bg-gray-200 rounded w-24" />
                    <div className="h-4 bg-gray-200 rounded w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredJobs && filteredJobs.length > 0 ? (
            <>
              <p
                className="text-warm-gray text-sm mb-6"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Showing {filteredJobs.length} open position
                {filteredJobs.length !== 1 ? "s" : ""}
              </p>
              <div className="space-y-4">
                {filteredJobs.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <Link
                      href={`/careers/${job.slug}`}
                      className="block bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-cream-dark hover:shadow-md hover:border-gold/30 transition-all group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <h3
                            className="text-xl font-semibold text-navy group-hover:text-gold-dark transition-colors mb-2"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {job.title}
                          </h3>
                          {job.summary && (
                            <p
                              className="text-warm-gray text-sm leading-relaxed mb-4 line-clamp-2"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              {job.summary}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-3 text-xs">
                            {job.location && (
                              <span className="flex items-center gap-1.5 text-warm-gray">
                                <MapPin className="w-3.5 h-3.5" />
                                {job.location}
                              </span>
                            )}
                            {job.employmentType && (
                              <span className="flex items-center gap-1.5 text-warm-gray">
                                <Clock className="w-3.5 h-3.5" />
                                {job.employmentType}
                              </span>
                            )}
                            {job.department && (
                              <span className="flex items-center gap-1.5 text-warm-gray">
                                <Briefcase className="w-3.5 h-3.5" />
                                {job.department}
                              </span>
                            )}
                            {job.salary && (
                              <span className="flex items-center gap-1.5 text-warm-gray">
                                <PoundSterling className="w-3.5 h-3.5" />
                                {job.salary}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-navy group-hover:text-gold-dark transition-colors shrink-0">
                          <span
                            className="text-sm font-semibold hidden sm:inline"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            View Details
                          </span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                      {job.closingDate && (
                        <div className="mt-3 pt-3 border-t border-cream-dark">
                          <span className="text-xs text-rose-dark font-medium">
                            Closing date:{" "}
                            {new Date(job.closingDate).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <motion.div {...fadeUp} className="text-center py-16">
              <Briefcase className="w-16 h-16 text-navy/20 mx-auto mb-4" />
              <h3
                className="text-xl font-semibold text-navy mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                No Open Positions
              </h3>
              <p
                className="text-warm-gray text-base max-w-md mx-auto mb-6"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {searchTerm || filterType !== "all"
                  ? "No positions match your search. Try adjusting your filters."
                  : "We don't have any vacancies at the moment, but we're always interested in hearing from talented people."}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-colors"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Send Us Your CV
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════════════════ WHY JOIN US ═══════════════════ */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Why Cogie Care?"
            title="Why Join Our Team"
            subtitle="At Cogie Care Services, we believe in investing in our people. Here's what makes us a great place to work."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {whyJoinUs.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-cream rounded-xl p-7 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-navy/5 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-7 h-7 text-gold-dark" />
                </div>
                <h3
                  className="text-lg font-semibold text-navy mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-warm-gray text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="py-16 sm:py-20 bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <h2
              className="text-3xl sm:text-4xl text-white font-semibold mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Can't Find the Right Role?
            </h2>
            <p
              className="text-white/60 text-base max-w-xl mx-auto mb-8"
              style={{ fontFamily: "var(--font-body)" }}
            >
              We're always interested in hearing from passionate individuals. Send us
              your CV and we'll keep you in mind for future opportunities.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-gold text-navy font-semibold rounded-lg hover:bg-gold-light transition-colors shadow-lg"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Get in Touch
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}

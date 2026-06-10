/*
 * Design: Warm Haven — Contemporary Hospitality
 * Contact: Contact form, details, referral info
 */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/SectionHeading";
import { toast } from "sonner";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const enquiryType = String(data.get("enquiryType") || "General enquiry");
    const subject = `Website enquiry (${enquiryType}) - ${data.get("name") || ""}`;
    const body = [
      `Name: ${data.get("name") || ""}`,
      `Email: ${data.get("email") || ""}`,
      `Phone: ${data.get("phone") || ""}`,
      `Enquiry type: ${enquiryType}`,
      `Organisation: ${data.get("organisation") || ""}`,
      "",
      String(data.get("message") || ""),
    ].join("\n");
    window.location.href = `mailto:info@cogiecareservices.co.uk?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
    toast.success("Opening your email app to send your enquiry...");
  };

  return (
    <PageLayout>
      {/* ═══════════════════ PAGE HERO ═══════════════════ */}
      <section className="relative py-24 sm:py-32 bg-navy overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-gold text-xs font-semibold tracking-[0.25em] uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Contact Us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl text-white font-semibold mt-4 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Get in <span className="text-gold italic">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 text-lg mt-5 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            We welcome enquiries from professionals, families, and individuals. Reach out today.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 60L1440 15V60H0Z" fill="oklch(0.97 0.01 80)" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════ CONTACT DETAILS + FORM ═══════════════════ */}
      <section className="py-20 sm:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <span className="text-gold-dark text-xs font-semibold tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-body)" }}>
                  Contact Information
                </span>
                <h2 className="text-3xl font-semibold text-navy mt-3 mb-6 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                  We're Here to Help
                </h2>
                <p className="text-warm-gray text-base leading-relaxed mb-8" style={{ fontFamily: "var(--font-body)" }}>
                  Whether you are looking to make a referral, enquire about our services, or simply learn more about what we do, please do not hesitate to get in touch.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-navy" />
                    </div>
                    <div>
                      <h3 className="text-navy font-semibold text-sm mb-1" style={{ fontFamily: "var(--font-body)" }}>Address</h3>
                      <p className="text-warm-gray text-sm" style={{ fontFamily: "var(--font-body)" }}>
                        13 Woodland Road<br />London, N9 8RP
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-navy" />
                    </div>
                    <div>
                      <h3 className="text-navy font-semibold text-sm mb-1" style={{ fontFamily: "var(--font-body)" }}>Email</h3>
                      <a href="mailto:info@cogiecareservices.co.uk" className="text-warm-gray hover:text-gold-dark text-sm transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                        info@cogiecareservices.co.uk
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-navy" />
                    </div>
                    <div>
                      <h3 className="text-navy font-semibold text-sm mb-1" style={{ fontFamily: "var(--font-body)" }}>Phone</h3>
                      <p className="text-warm-gray text-sm" style={{ fontFamily: "var(--font-body)" }}>
                        Contact us for details
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-navy" />
                    </div>
                    <div>
                      <h3 className="text-navy font-semibold text-sm mb-1" style={{ fontFamily: "var(--font-body)" }}>Hours</h3>
                      <p className="text-warm-gray text-sm" style={{ fontFamily: "var(--font-body)" }}>
                        24/7 Support Available<br />
                        Office: Monday – Friday, 9am – 5pm
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-cream-dark"
              >
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-navy mb-3" style={{ fontFamily: "var(--font-display)" }}>
                      Thank You
                    </h3>
                    <p className="text-warm-gray max-w-md mx-auto" style={{ fontFamily: "var(--font-body)" }}>
                      Your enquiry has been received. A member of our team will be in touch with you shortly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-6 text-navy font-semibold hover:text-gold-dark transition-colors text-sm"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Send another enquiry
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-navy mb-1" style={{ fontFamily: "var(--font-display)" }}>
                      Send Us a Message
                    </h3>
                    <p className="text-warm-gray text-sm mb-6" style={{ fontFamily: "var(--font-body)" }}>
                      Fill out the form below and we will respond within 24 hours.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-navy text-sm font-medium mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            name="name"
                            placeholder="Your full name"
                            className="w-full px-4 py-3 rounded-lg border border-cream-dark bg-cream/50 text-foreground placeholder:text-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors text-sm"
                            style={{ fontFamily: "var(--font-body)" }}
                          />
                        </div>
                        <div>
                          <label className="block text-navy text-sm font-medium mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            name="email"
                            placeholder="your@email.com"
                            className="w-full px-4 py-3 rounded-lg border border-cream-dark bg-cream/50 text-foreground placeholder:text-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors text-sm"
                            style={{ fontFamily: "var(--font-body)" }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-navy text-sm font-medium mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            placeholder="Your phone number"
                            className="w-full px-4 py-3 rounded-lg border border-cream-dark bg-cream/50 text-foreground placeholder:text-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors text-sm"
                            style={{ fontFamily: "var(--font-body)" }}
                          />
                        </div>
                        <div>
                          <label className="block text-navy text-sm font-medium mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
                            Enquiry Type *
                          </label>
                          <select
                            required
                            name="enquiryType"
                            defaultValue=""
                            className="w-full px-4 py-3 rounded-lg border border-cream-dark bg-cream/50 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors text-sm"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            <option value="" disabled>Select an option</option>
                            <option value="referral">Referral Enquiry</option>
                            <option value="general">General Enquiry</option>
                            <option value="professional">Professional Enquiry</option>
                            <option value="family">Family Enquiry</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-navy text-sm font-medium mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
                          Organisation (if applicable)
                        </label>
                        <input
                          type="text"
                          name="organisation"
                          placeholder="Your organisation name"
                          className="w-full px-4 py-3 rounded-lg border border-cream-dark bg-cream/50 text-foreground placeholder:text-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors text-sm"
                          style={{ fontFamily: "var(--font-body)" }}
                        />
                      </div>

                      <div>
                        <label className="block text-navy text-sm font-medium mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
                          Message *
                        </label>
                        <textarea
                          required
                          rows={5}
                          name="message"
                          placeholder="Please tell us how we can help..."
                          className="w-full px-4 py-3 rounded-lg border border-cream-dark bg-cream/50 text-foreground placeholder:text-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors text-sm resize-none"
                          style={{ fontFamily: "var(--font-body)" }}
                        />
                      </div>

                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-7 py-3.5 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-all shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        <Send className="w-4 h-4" />
                        Send Enquiry
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ REFERRAL PROCESS ═══════════════════ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Referral Process"
            title="How to Refer"
            subtitle="Making a referral to Cogie Care Services is straightforward. Here's how the process works."
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Initial Contact",
                desc: "Get in touch with us via phone, email, or the contact form above to discuss the referral.",
              },
              {
                step: "02",
                title: "Assessment",
                desc: "We review the referral details and assess whether our service is the right fit for the individual.",
              },
              {
                step: "03",
                title: "Visit & Meeting",
                desc: "We arrange a visit to the property and a meeting to discuss the support plan in detail.",
              },
              {
                step: "04",
                title: "Move-In",
                desc: "Once agreed, we prepare the room and welcome the new resident to their new home.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <div className="bg-cream rounded-xl p-6 border border-cream-dark h-full">
                  <span className="text-5xl font-bold text-gold/20" style={{ fontFamily: "var(--font-display)" }}>
                    {item.step}
                  </span>
                  <h3 className="text-lg font-semibold text-navy mt-2 mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    {item.title}
                  </h3>
                  <p className="text-warm-gray text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    {item.desc}
                  </p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-5 h-5 text-gold" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ MAP SECTION ═══════════════════ */}
      <section className="py-20 sm:py-28 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Find Us"
            title="Our Location"
            subtitle="We are located at 13 Woodland Road in the N9 area of North London."
            light
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2478.5!2d-0.065!3d51.625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDM3JzMwLjAiTiAwwrAwMyczOS4wIlc!5e0!3m2!1sen!2suk!4v1"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Cogie Care Services Location"
              className="w-full"
            />
          </motion.div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-white/70 text-sm" style={{ fontFamily: "var(--font-body)" }}>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold" />
              13 Woodland Road, London, N9 8RP
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold" />
              24/7 Support Available
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

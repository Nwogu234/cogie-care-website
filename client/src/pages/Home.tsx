/*
 * Design: Warm Haven — Contemporary Hospitality
 * Home: Hero with overlay, services grid, about preview, accommodation, testimonials, CTA
 * Colors: Navy #1B2A4A, Gold #D4A853, Rose #C4878E, Cream #FAF7F2
 * Fonts: Playfair Display (headings), Outfit (body)
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Shield,
  Heart,
  Users,
  Home as HomeIcon,
  Clock,
  BookOpen,
  ArrowRight,
  Star,
  ChevronRight,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/SectionHeading";
import { useAuth } from "@/_core/hooks/useAuth";

const HERO_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/9Y7r7PWVEKJJHz5qC8wmCM/sandbox/SQqx0P5t3YXmUc21hF2F92-img-1_1771443556000_na1fn_aGVyby1tYWlu.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOVk3cjdQV1ZFS0pKSHo1cUM4d21DTS9zYW5kYm94L1NRcXgwUDV0M1lYbVVjMjFoRjJGOTItaW1nLTFfMTc3MTQ0MzU1NjAwMF9uYTFmbl9hR1Z5YnkxdFlXbHUuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=M3IqemQoRJGPpbJcC5NpFhKMeVAEmk13~X~t-Oqc3DS0UNPedYqcSLysCPk1Llrgyz~GHujxCl6R1IvxwXx~lXUL-69aqHKwN-FdBzQPjFRRHbz4tNnbuShBb~DynhkDypbiNOCsXkH4qdRzEksBEptWuO9tGCO50qzEXdLJPYdw6DiJhIj3OBGFqjnzzZHXJrDrtF3qtgfKF-SM1L0xFlcW2HGSBbZ5-lvTj4mALt0t2-MH29wkHd1mniURYBnwNW~5U4z-r-fPgdO02O1YhVk4Wr3LheeCAqV-bReOwAqLhMgU5SivxUdZQ9hLBNByQwEguKurb~XQQrb2rqTBlA__";

const SUPPORT_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/9Y7r7PWVEKJJHz5qC8wmCM/sandbox/SQqx0P5t3YXmUc21hF2F92-img-2_1771443564000_na1fn_c2VydmljZXMtc3VwcG9ydA.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOVk3cjdQV1ZFS0pKSHo1cUM4d21DTS9zYW5kYm94L1NRcXgwUDV0M1lYbVVjMjFoRjJGOTItaW1nLTJfMTc3MTQ0MzU2NDAwMF9uYTFmbl9jMlZ5ZG1salpYTXRjM1Z3Y0c5eWRBLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=dGJSWazSsfPdWSpmENkgeFKdzw5ykdILoS7zkHS-p8eflvgapFIWNgu2bJIOKY~~0-bDijUM4nyUNDWLQihQyrKnDEbQ4t7s39p9DzmQ9XYAr22bYM9z~10YRpHHAPy0cP-9LvKbY9d4E6d4q2QufvE6eM5ctzhjLgbENqAZS0aURM-ayOQbIozBNOdgLnNlmFONIUASLetf4o3ESvpE-w-kAby3zyoBBPYeBm9TUd8fxLgx47TOiNl05nXp9ff0hPjgHh47FrWOQ~y37-zwXBtMk2pZQ-CqqGhtvw93e-6m-f4pD7J6QPh0DPIqu~deZucSlr~bZMJKyrajRybwwA__";

const BEDROOM_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/120168284/iXNCxwAGn7iRsa2oPR3tZd/room-bedroom-1_d00e781a.jpg"; // Real property photo
// Old stock image replaced with real property photo
// const _OLD_BEDROOM_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/9Y7r7PWVEKJJHz5qC8wmCM/sandbox/SQqx0P5t3YXmUc21hF2F92-img-3_1771443568000_na1fn_YWNjb21tb2RhdGlvbi1pbnRlcmlvcg.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOVk3cjdQV1ZFS0pKSHo1cUM4d21DTS9zYW5kYm94L1NRcXgwUDV0M1lYbVVjMjFoRjJGOTItaW1nLTNfMTc3MTQ0MzU2ODAwMF9uYTFmbl9ZV05qYjIxdGIyUmhkR2x2YmkxcGJuUmxjbWx2Y2cuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=XzZUJmbPOLCt05xNDkW4XlAfk6g7FIobCV0aKg2dJTAQxYkTjWDv8ykq7Fjb0lYY95e0LrxGG5C4LhTjsQNUfNxIsHn0mZwt6icU0K3Yadbb4IyCp6s-tP4zcPDwBFI8rbs1wAYIaHYHyj63VWEk2GHnhbKC~9M12EYG6IQixhfEBLMJXvHlGbnF5Pif~F6vJCyJkmVcRGnhz~GBAWs36AA559PaGK9JqR7nt3QEKjkebs2X-shst78O~cActqXxbtjKsqVZz0NLen0kV-Bj78rlZb3VeMbmCz0MhMm6iKkD7BT3NIliOH8yaVrmncONbB3NbTCs3hbZso5EO~HTVA__";

const services = [
  {
    icon: Shield,
    title: "24/7 Support",
    desc: "Round-the-clock staff presence ensuring safety and immediate assistance whenever needed.",
  },
  {
    icon: Heart,
    title: "Mental Health Support",
    desc: "Dedicated support for residents managing mental health conditions, with personalised care plans.",
  },
  {
    icon: BookOpen,
    title: "Life Skills Development",
    desc: "Practical workshops in cooking, budgeting, and independent living to build confidence.",
  },
  {
    icon: Users,
    title: "Key Worker Sessions",
    desc: "Regular one-to-one sessions with a dedicated key worker to set and achieve personal goals.",
  },
  {
    icon: HomeIcon,
    title: "Safe Accommodation",
    desc: "Comfortable, well-maintained private rooms in a secure, homely residential setting.",
  },
  {
    icon: Clock,
    title: "Wellbeing Programmes",
    desc: "Structured activities promoting physical health, social engagement, and personal growth.",
  },
];

const testimonials = [
  {
    quote: "Cogie Care gave me a real home when I had nowhere else to turn. The staff genuinely care about your wellbeing and future.",
    name: "Former Resident",
    role: "Supported Accommodation",
    rating: 5,
  },
  {
    quote: "The support I received helped me develop the skills and confidence I needed to eventually move into my own place.",
    name: "Former Resident",
    role: "Independent Living Programme",
    rating: 5,
  },
  {
    quote: "Professional, compassionate, and always available. Cogie Care Services sets the standard for supported accommodation.",
    name: "Referral Partner",
    role: "Local Authority",
    rating: 5,
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6 },
};

const stagger = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
};

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <PageLayout>
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="Cogie Care Services accommodation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-6"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Supported Accommodation in North London
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white font-semibold leading-[1.1] mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              A Place to Call{" "}
              <span className="text-gold italic">Home</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-white/80 text-lg sm:text-xl leading-relaxed mb-10 max-w-lg"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Cogie Care Services provides safe, dignified supported accommodation for vulnerable adults. We help our residents build the skills and confidence they need for independent living.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gold text-navy font-semibold rounded-lg hover:bg-gold-light transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Our Services
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 hover:border-white/50 transition-all"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Make a Referral
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Diagonal bottom edge */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 80L1440 20V80H0Z" fill="oklch(0.97 0.01 80)" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════ SERVICES OVERVIEW ═══════════════════ */}
      <section className="py-20 sm:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="What We Offer"
            title="Comprehensive Support Services"
            subtitle="We provide a range of tailored services designed to support our residents on their journey towards greater independence and wellbeing."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                {...stagger}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-white rounded-xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-cream-dark"
              >
                <div className="w-12 h-12 rounded-lg bg-navy/5 flex items-center justify-center mb-5 group-hover:bg-gold/10 transition-colors">
                  <service.icon className="w-6 h-6 text-navy group-hover:text-gold-dark transition-colors" />
                </div>
                <h3
                  className="text-lg font-semibold text-navy mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {service.title}
                </h3>
                <p
                  className="text-warm-gray text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-navy font-semibold hover:text-gold-dark transition-colors group"
              style={{ fontFamily: "var(--font-body)" }}
            >
              View All Services
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ABOUT PREVIEW ═══════════════════ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={SUPPORT_IMG}
                  alt="Support worker with resident"
                  className="w-full h-[400px] sm:h-[480px] object-cover"
                />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -right-4 sm:right-8 bg-navy text-white rounded-xl p-5 shadow-xl">
                <div className="text-3xl font-bold text-gold" style={{ fontFamily: "var(--font-display)" }}>
                  24/7
                </div>
                <div className="text-white/70 text-sm mt-1" style={{ fontFamily: "var(--font-body)" }}>
                  Support Available
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7 }}
            >
              <span
                className="text-gold-dark text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ fontFamily: "var(--font-body)" }}
              >
                About Us
              </span>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-navy mt-3 mb-6 leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Dedicated to Dignity{" "}
                <span className="text-gold italic">&amp; Care</span>
              </h2>
              <p
                className="text-warm-gray text-base sm:text-lg leading-relaxed mb-6"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Cogie Care Services is a specialist supported accommodation provider based in North London. We offer a safe, welcoming environment where vulnerable adults can rebuild their lives with the right level of support.
              </p>
              <p
                className="text-warm-gray text-base sm:text-lg leading-relaxed mb-8"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Our experienced, compassionate team works closely with each resident to create personalised support plans that address their individual needs and aspirations. From mental health support to life skills development, we are committed to helping every resident achieve their full potential.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 mb-8">
                {[
                  { label: "Person-Centred", desc: "Tailored support plans" },
                  { label: "Experienced Team", desc: "Trained professionals" },
                  { label: "Safe Environment", desc: "Secure, welcoming home" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-gold mt-2 shrink-0" />
                    <div>
                      <div className="text-navy font-semibold text-sm" style={{ fontFamily: "var(--font-body)" }}>
                        {item.label}
                      </div>
                      <div className="text-warm-gray text-xs" style={{ fontFamily: "var(--font-body)" }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-colors shadow-md"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Learn More About Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ACCOMMODATION PREVIEW ═══════════════════ */}
      <section className="py-20 sm:py-28 bg-navy relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Our Accommodation"
            title="Comfortable, Dignified Living"
            subtitle="Our accommodation is designed to feel like a real home — private, comfortable, and well-maintained."
            light
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="space-y-6">
                {[
                  { title: "4 Ensuite Bedrooms", desc: "Each of our four bedrooms has its own private ensuite bathroom, flat-screen TV, and quality bedding for comfort and privacy." },
                  { title: "Communal Living Spaces", desc: "Shared kitchen, dining, and lounge areas where residents can socialise and develop daily living skills." },
                  { title: "Well-Maintained Property", desc: "Our property at 13 Woodland Road is kept to a high standard, with regular maintenance and a welcoming garden." },
                  { title: "North London Location", desc: "Conveniently located in N9, with good transport links and access to local amenities, shops, and green spaces." },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-1 rounded-full bg-gold shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-1" style={{ fontFamily: "var(--font-display)" }}>
                        {item.title}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link
                href="/accommodation"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-gold text-navy font-semibold rounded-lg hover:bg-gold-light transition-colors shadow-md"
                style={{ fontFamily: "var(--font-body)" }}
              >
                View Accommodation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src={BEDROOM_IMG}
                alt="Comfortable bedroom at Cogie Care Services"
                className="w-full h-[400px] sm:h-[500px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section className="py-20 sm:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Testimonials"
            title="What People Say"
            subtitle="Hear from those who have experienced our care and support first-hand."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-white rounded-xl p-7 shadow-sm border border-cream-dark relative"
              >
                {/* Gold accent top bar */}
                <div className="absolute top-0 left-6 right-6 h-1 bg-gold rounded-b-full" />

                <div className="flex gap-1 mb-4 mt-2">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-gold fill-gold" />
                  ))}
                </div>
                <p
                  className="text-foreground text-sm leading-relaxed mb-6 italic"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  "{t.quote}"
                </p>
                <div>
                  <div className="text-navy font-semibold text-sm" style={{ fontFamily: "var(--font-body)" }}>
                    {t.name}
                  </div>
                  <div className="text-warm-gray text-xs" style={{ fontFamily: "var(--font-body)" }}>
                    {t.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <span
              className="text-gold-dark text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Get in Touch
            </span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-navy mt-3 mb-6 leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Ready to Make a{" "}
              <span className="text-gold italic">Referral?</span>
            </h2>
            <p
              className="text-warm-gray text-base sm:text-lg leading-relaxed mb-10 max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Whether you are a social worker, local authority professional, or someone seeking supported accommodation, we are here to help. Contact us today to discuss how we can support you or your client.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Contact Us Today
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/accommodation"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-navy/20 text-navy font-semibold rounded-lg hover:bg-navy/5 transition-all"
                style={{ fontFamily: "var(--font-body)" }}
              >
                View Our Accommodation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}

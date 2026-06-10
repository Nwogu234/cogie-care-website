/*
 * Design: Warm Haven — Contemporary Hospitality
 * About: Company story, mission, values, team
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Target, Eye, Heart, Shield, Users, Award, ArrowRight } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/SectionHeading";

const TEAM_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/9Y7r7PWVEKJJHz5qC8wmCM/sandbox/SQqx0P5t3YXmUc21hF2F92-img-5_1771443566000_na1fn_YWJvdXQtdGVhbQ.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOVk3cjdQV1ZFS0pKSHo1cUM4d21DTS9zYW5kYm94L1NRcXgwUDV0M1lYbVVjMjFoRjJGOTItaW1nLTVfMTc3MTQ0MzU2NjAwMF9uYTFmbl9ZV0p2ZFhRdGRHVmhiUS5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=qdENhCnvyZwvgASg3dnnkbX-9KecjDcVqSz2Nk4RlbABE-BI8EqumXeja8f3Ewc485sALA7-SSN2lqwqToB6KSNBhsXh64rRKRjuuW3RtvAICqsI-cICAR01bOixa8tIXqHflHA~24jSsaz8ak3NJAFE0r~yb8YpmwUwS6sbXAsxhYo9c-iDqPiEOr8OVh5UYvnhn0uH1mwhkdoqMTcgo-j-ZLSohlPhPQEaJ~EPDY4VtdkuGn7Z48nWM9n6E~zwxUilqUNJX9iKOGT0sWUo~7VyDkvsGtgjTL0Tqjx09MzFlJ0QOWDuZrw0Q5pf-EYixLQIBCI7jbPmr3ylamrVSA__";

const SUPPORT_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/9Y7r7PWVEKJJHz5qC8wmCM/sandbox/SQqx0P5t3YXmUc21hF2F92-img-2_1771443564000_na1fn_c2VydmljZXMtc3VwcG9ydA.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOVk3cjdQV1ZFS0pKSHo1cUM4d21DTS9zYW5kYm94L1NRcXgwUDV0M1lYbVVjMjFoRjJGOTItaW1nLTJfMTc3MTQ0MzU2NDAwMF9uYTFmbl9jMlZ5ZG1salpYTXRjM1Z3Y0c5eWRBLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=dGJSWazSsfPdWSpmENkgeFKdzw5ykdILoS7zkHS-p8eflvgapFIWNgu2bJIOKY~~0-bDijUM4nyUNDWLQihQyrKnDEbQ4t7s39p9DzmQ9XYAr22bYM9z~10YRpHHAPy0cP-9LvKbY9d4E6d4q2QufvE6eM5ctzhjLgbENqAZS0aURM-ayOQbIozBNOdgLnNlmFONIUASLetf4o3ESvpE-w-kAby3zyoBBPYeBm9TUd8fxLgx47TOiNl05nXp9ff0hPjgHh47FrWOQ~y37-zwXBtMk2pZQ-CqqGhtvw93e-6m-f4pD7J6QPh0DPIqu~deZucSlr~bZMJKyrajRybwwA__";

const values = [
  {
    icon: Heart,
    title: "Compassion",
    desc: "We treat every individual with kindness, empathy, and genuine care, recognising the unique challenges each person faces.",
  },
  {
    icon: Shield,
    title: "Safety",
    desc: "We maintain a secure, well-managed environment where residents can feel protected and at ease at all times.",
  },
  {
    icon: Users,
    title: "Respect",
    desc: "We uphold the dignity of every resident, valuing their individuality, choices, and right to self-determination.",
  },
  {
    icon: Award,
    title: "Excellence",
    desc: "We strive for the highest standards in everything we do, continuously improving our services and support.",
  },
];

export default function About() {
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
            About Us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl text-white font-semibold mt-4 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Who We <span className="text-gold italic">Are</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 text-lg mt-5 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            A dedicated team committed to providing safe, supportive accommodation for those who need it most.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 60L1440 15V60H0Z" fill="oklch(0.97 0.01 80)" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════ OUR STORY ═══════════════════ */}
      <section className="py-20 sm:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-gold-dark text-xs font-semibold tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-body)" }}>
                Our Story
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-navy mt-3 mb-6 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                Founded on a Belief in{" "}
                <span className="text-gold italic">Human Potential</span>
              </h2>
              <div className="space-y-4 text-warm-gray text-base leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                <p>
                  Cogie Care Services was established with a clear purpose: to provide high-quality supported accommodation for vulnerable adults in North London. We recognised that many individuals facing challenges — whether related to mental health, homelessness, or other complex needs — deserved more than just a roof over their heads.
                </p>
                <p>
                  Our approach is built on the understanding that with the right support, environment, and encouragement, people can overcome significant obstacles and move towards independent, fulfilling lives. We work in close partnership with local authorities, social workers, and healthcare professionals to ensure our residents receive comprehensive, coordinated care.
                </p>
                <p>
                  Based at 13 Woodland Road in the N9 area of North London, our accommodation provides a stable, homely base from which residents can begin to rebuild their lives with dignity and hope.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-2xl overflow-hidden shadow-xl"
            >
              <img
                src={TEAM_IMG}
                alt="The Cogie Care Services team"
                className="w-full h-[400px] sm:h-[480px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ MISSION & VISION ═══════════════════ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-navy rounded-2xl p-8 sm:p-10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-bl-full" />
              <div className="relative">
                <div className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center mb-5">
                  <Target className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  Our Mission
                </h3>
                <p className="text-white/70 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  To provide safe, high-quality supported accommodation that empowers vulnerable adults to develop the skills, confidence, and resilience they need to live independently. We are committed to delivering person-centred care that respects the dignity and individuality of every resident.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-cream rounded-2xl p-8 sm:p-10 border border-cream-dark relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-bl-full" />
              <div className="relative">
                <div className="w-12 h-12 rounded-lg bg-navy/10 flex items-center justify-center mb-5">
                  <Eye className="w-6 h-6 text-navy" />
                </div>
                <h3 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  Our Vision
                </h3>
                <p className="text-warm-gray leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  To be a leading provider of supported accommodation in London, recognised for our compassionate approach, high standards of care, and positive outcomes for residents. We envision a community where everyone has access to the support they need to thrive.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ VALUES ═══════════════════ */}
      <section className="py-20 sm:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Our Values"
            title="What Guides Us"
            subtitle="Our core values are at the heart of everything we do, shaping the way we care for our residents and work with our partners."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-xl p-7 text-center shadow-sm border border-cream-dark hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 rounded-full bg-navy/5 flex items-center justify-center mx-auto mb-5">
                  <v.icon className="w-7 h-7 text-navy" />
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  {v.title}
                </h3>
                <p className="text-warm-gray text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ TEAM IMAGE ═══════════════════ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-2xl overflow-hidden shadow-xl"
            >
              <img
                src={SUPPORT_IMG}
                alt="Our dedicated support team"
                className="w-full h-[400px] object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-gold-dark text-xs font-semibold tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-body)" }}>
                Our Team
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-navy mt-3 mb-6 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                Experienced &amp;{" "}
                <span className="text-gold italic">Compassionate</span>
              </h2>
              <div className="space-y-4 text-warm-gray text-base leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                <p>
                  Our team is made up of experienced, trained professionals who are passionate about making a difference. Every member of staff undergoes comprehensive training in safeguarding, mental health awareness, first aid, and person-centred care.
                </p>
                <p>
                  We believe that the quality of our staff directly determines the quality of our service. That is why we invest heavily in ongoing professional development and create a supportive working environment where our team can deliver their best.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-colors shadow-md"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

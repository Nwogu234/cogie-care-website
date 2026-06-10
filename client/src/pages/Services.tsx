/*
 * Design: Warm Haven — Contemporary Hospitality
 * Services: Detailed breakdown of all services offered
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Shield,
  Heart,
  Users,
  BookOpen,
  Clock,
  Brain,
  Utensils,
  Briefcase,
  HandHeart,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/SectionHeading";

const SUPPORT_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/9Y7r7PWVEKJJHz5qC8wmCM/sandbox/SQqx0P5t3YXmUc21hF2F92-img-2_1771443564000_na1fn_c2VydmljZXMtc3VwcG9ydA.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOVk3cjdQV1ZFS0pKSHo1cUM4d21DTS9zYW5kYm94L1NRcXgwUDV0M1lYbVVjMjFoRjJGOTItaW1nLTJfMTc3MTQ0MzU2NDAwMF9uYTFmbl9jMlZ5ZG1salpYTXRjM1Z3Y0c5eWRBLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=dGJSWazSsfPdWSpmENkgeFKdzw5ykdILoS7zkHS-p8eflvgapFIWNgu2bJIOKY~~0-bDijUM4nyUNDWLQihQyrKnDEbQ4t7s39p9DzmQ9XYAr22bYM9z~10YRpHHAPy0cP-9LvKbY9d4E6d4q2QufvE6eM5ctzhjLgbENqAZS0aURM-ayOQbIozBNOdgLnNlmFONIUASLetf4o3ESvpE-w-kAby3zyoBBPYeBm9TUd8fxLgx47TOiNl05nXp9ff0hPjgHh47FrWOQ~y37-zwXBtMk2pZQ-CqqGhtvw93e-6m-f4pD7J6QPh0DPIqu~deZucSlr~bZMJKyrajRybwwA__";

const KITCHEN_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/9Y7r7PWVEKJJHz5qC8wmCM/sandbox/SQqx0P5t3YXmUc21hF2F92-img-4_1771443561000_na1fn_Y29tbXVuaXR5LWtpdGNoZW4.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOVk3cjdQV1ZFS0pKSHo1cUM4d21DTS9zYW5kYm94L1NRcXgwUDV0M1lYbVVjMjFoRjJGOTItaW1nLTRfMTc3MTQ0MzU2MTAwMF9uYTFmbl9ZMjl0YlhWdWFYUjVMV3RwZEdOb1pXNC5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=W0RiqXKp3J~cNZb6A9sMrOzuStqIjSrJh30GJtO32bBaBT2a39cmaVeB3F~ojI2GbRLzzO7Qyxc3U6u~jV5XzLHbC6ARl~sOW2xvA50KdqdHoxPodo75hzZNHqXQ2OTKxIsAqvfsBjYr1lFC7sjJ5kv-qmBNDTOinc3bGwuqudXd3jOANizmCe1iPRfkKk3L69WhyiZWSNbGwlbs7mH5LU9ZoHGaYLjATfPwg0rUtgavDbJMLgz73~OM2Fr4nUm0M9XdYeqvOMo6KoBlttm61GSJ7FFMHBCv4tO93J-Wq8Mive1ZJwGFOkBBsaqQZCtw7wNTX7YV7-qVIFgWg8SV-A__";

const coreServices = [
  {
    icon: Shield,
    title: "24/7 On-Site Support",
    desc: "Our trained staff are available around the clock to provide assistance, guidance, and emergency support. Residents can feel secure knowing that help is always at hand, day or night.",
    features: ["Round-the-clock staff presence", "Emergency response protocols", "Night-time welfare checks", "On-call management support"],
  },
  {
    icon: Brain,
    title: "Mental Health Support",
    desc: "We provide dedicated support for residents managing mental health conditions. Our team works alongside healthcare professionals to ensure residents receive the right level of care and intervention.",
    features: ["Personalised mental health plans", "Liaison with NHS services", "Crisis intervention support", "Emotional wellbeing check-ins"],
  },
  {
    icon: Users,
    title: "Key Worker Sessions",
    desc: "Every resident is assigned a dedicated key worker who meets with them regularly to review progress, set goals, and provide one-to-one support tailored to their individual needs.",
    features: ["Weekly one-to-one sessions", "Goal setting and review", "Progress tracking", "Advocacy and signposting"],
  },
  {
    icon: BookOpen,
    title: "Life Skills Development",
    desc: "We help residents develop the practical skills they need for independent living, from cooking and cleaning to budgeting and managing a tenancy.",
    features: ["Cooking and nutrition workshops", "Budgeting and financial literacy", "Tenancy management skills", "Personal hygiene and self-care"],
  },
  {
    icon: Heart,
    title: "Wellbeing Programmes",
    desc: "Our structured wellbeing programmes promote physical health, social engagement, and personal growth through a variety of activities and group sessions.",
    features: ["Physical activity sessions", "Social events and outings", "Creative workshops", "Mindfulness and relaxation"],
  },
  {
    icon: Briefcase,
    title: "Employment & Education Support",
    desc: "We support residents in accessing education, training, and employment opportunities, helping them build the skills and confidence to achieve their career aspirations.",
    features: ["CV writing and interview prep", "College and training referrals", "Volunteering opportunities", "Job search assistance"],
  },
];

const additionalServices = [
  { icon: Utensils, label: "Nutritional Support" },
  { icon: HandHeart, label: "Benefits & Housing Advice" },
  { icon: Clock, label: "Structured Daily Routines" },
  { icon: Users, label: "Family Mediation Support" },
];

export default function Services() {
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
            Our Services
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl text-white font-semibold mt-4 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            How We <span className="text-gold italic">Support</span> You
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 text-lg mt-5 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Comprehensive, person-centred services designed to help our residents thrive.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 60L1440 15V60H0Z" fill="oklch(0.97 0.01 80)" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════ APPROACH ═══════════════════ */}
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
                Our Approach
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-navy mt-3 mb-6 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                Person-Centred Care at{" "}
                <span className="text-gold italic">Every Step</span>
              </h2>
              <div className="space-y-4 text-warm-gray text-base leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                <p>
                  At Cogie Care Services, we understand that every individual is different. That is why we take a person-centred approach to everything we do, creating tailored support plans that reflect each resident's unique needs, goals, and aspirations.
                </p>
                <p>
                  From the moment a resident arrives, we work collaboratively with them to understand their situation and develop a clear pathway towards greater independence. Our support is flexible and responsive, adapting as needs change over time.
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
                src={SUPPORT_IMG}
                alt="Person-centred support session"
                className="w-full h-[400px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CORE SERVICES ═══════════════════ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Core Services"
            title="What We Provide"
            subtitle="Our comprehensive range of services covers every aspect of supported living."
          />

          <div className="space-y-8">
            {coreServices.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-cream rounded-2xl p-6 sm:p-8 border border-cream-dark hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-11 h-11 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                        <service.icon className="w-5 h-5 text-navy" />
                      </div>
                      <h3 className="text-xl font-semibold text-navy" style={{ fontFamily: "var(--font-display)" }}>
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-warm-gray leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                      {service.desc}
                    </p>
                  </div>
                  <div>
                    <ul className="space-y-2">
                      {service.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-foreground" style={{ fontFamily: "var(--font-body)" }}>
                          <CheckCircle2 className="w-4 h-4 text-gold-dark shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ ADDITIONAL SERVICES + IMAGE ═══════════════════ */}
      <section className="py-20 sm:py-28 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading
                label="Additional Support"
                title="Going the Extra Mile"
                subtitle="Beyond our core services, we provide additional support to help residents with every aspect of their lives."
                light
                align="left"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {additionalServices.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-center gap-3 bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <s.icon className="w-5 h-5 text-gold shrink-0" />
                    <span className="text-white text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>
                      {s.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src={KITCHEN_IMG}
                alt="Community kitchen and life skills"
                className="w-full h-[400px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="py-20 sm:py-24 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-semibold text-navy mb-6 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Interested in Our Services?
            </h2>
            <p className="text-warm-gray text-lg mb-10 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              We welcome referrals from local authorities, social workers, and individuals. Get in touch to discuss how we can help.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-all shadow-lg hover:shadow-xl"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}

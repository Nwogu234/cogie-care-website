/*
 * Design: Warm Haven — Contemporary Hospitality
 * Accommodation: Property details, photo gallery, 4 ensuite rooms, location
 */
import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Bed,
  Wifi,
  ShieldCheck,
  Flower2,
  UtensilsCrossed,
  Sofa,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Bus,
  ShoppingBag,
  TreePine,
  Bath,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/SectionHeading";

/* ─── Real property photos ─── */
const ROOM_BEDROOM_1 = "https://d2xsxph8kpxj0f.cloudfront.net/120168284/iXNCxwAGn7iRsa2oPR3tZd/room-bedroom-1_d00e781a.jpg";
const ROOM_ENSUITE = "https://d2xsxph8kpxj0f.cloudfront.net/120168284/iXNCxwAGn7iRsa2oPR3tZd/room-ensuite-bathroom_97dedd0b.jpg";
const ROOM_STUDIO = "https://d2xsxph8kpxj0f.cloudfront.net/120168284/iXNCxwAGn7iRsa2oPR3tZd/room-studio-view_86a4f6b3.jpg";
const ROOM_BEDROOM_2 = "https://d2xsxph8kpxj0f.cloudfront.net/120168284/iXNCxwAGn7iRsa2oPR3tZd/room-bedroom-2_c60d2018.jpg";

const galleryImages = [
  { src: ROOM_BEDROOM_1, alt: "Ensuite bedroom with modern furnishings, wall-mounted TV, and quality bedding", label: "Ensuite Bedroom" },
  { src: ROOM_BEDROOM_2, alt: "Spacious ensuite bedroom with natural light and wooden flooring", label: "Ensuite Bedroom" },
  { src: ROOM_STUDIO, alt: "Studio-style room with seating area, bed, and kitchenette access", label: "Studio Room" },
  { src: ROOM_ENSUITE, alt: "Private ensuite bathroom with marble-effect tiles and walk-in shower", label: "Private Ensuite" },
];

const features = [
  { icon: Bed, label: "4 Ensuite Bedrooms", desc: "Each room has its own private bathroom" },
  { icon: Bath, label: "Private Bathrooms", desc: "Walk-in showers with modern marble-effect tiling" },
  { icon: UtensilsCrossed, label: "Shared Kitchen", desc: "Fully equipped kitchen for developing cooking skills" },
  { icon: Sofa, label: "Communal Lounge", desc: "Comfortable shared living space for socialising" },
  { icon: Wifi, label: "Wi-Fi Access", desc: "Free internet access throughout the property" },
  { icon: ShieldCheck, label: "Secure Entry", desc: "Controlled access for resident safety" },
  { icon: Flower2, label: "Garden Space", desc: "Outdoor area for relaxation and fresh air" },
  { icon: Sparkles, label: "Well-Maintained", desc: "Regular cleaning and property maintenance" },
  { icon: MapPin, label: "Great Location", desc: "Close to transport, shops, and green spaces" },
];

const roomFeatures = [
  "Private ensuite bathroom with walk-in shower",
  "Comfortable bed with quality mattress and bedding",
  "Wall-mounted flat-screen TV",
  "Wardrobe and personal storage space",
  "Bedside table and lamp",
  "Modern wooden-effect flooring",
  "Central heating throughout",
  "Lockable door for privacy and security",
  "Window with natural light",
  "Freshly decorated to a high standard",
];

export default function Accommodation() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const prevImage = () => setLightboxIdx((prev) => (prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null));
  const nextImage = () => setLightboxIdx((prev) => (prev !== null ? (prev + 1) % galleryImages.length : null));

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
            Our Accommodation
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl text-white font-semibold mt-4 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your New <span className="text-gold italic">Home</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 text-lg mt-5 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Four comfortable ensuite bedrooms in a well-maintained North London property, designed to feel like a real home.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 60L1440 15V60H0Z" fill="oklch(0.97 0.01 80)" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════ PROPERTY OVERVIEW ═══════════════════ */}
      <section className="py-20 sm:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={ROOM_BEDROOM_1}
                  alt="Ensuite bedroom at 13 Woodland Road"
                  className="w-full h-[400px] sm:h-[480px] object-cover"
                />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -right-4 sm:right-8 bg-navy text-white rounded-xl p-5 shadow-xl">
                <div className="text-3xl font-bold text-gold" style={{ fontFamily: "var(--font-display)" }}>
                  4
                </div>
                <div className="text-white/70 text-sm mt-1" style={{ fontFamily: "var(--font-body)" }}>
                  Ensuite Rooms
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-gold-dark text-xs font-semibold tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-body)" }}>
                13 Woodland Road
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-navy mt-3 mb-6 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                A Welcoming{" "}
                <span className="text-gold italic">Residence</span>
              </h2>
              <div className="space-y-4 text-warm-gray text-base leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                <p>
                  Our property at 13 Woodland Road, N9 8RP is a well-maintained residential property in a quiet, leafy area of North London. The accommodation features <strong>four private ensuite bedrooms</strong>, each with its own modern bathroom, providing residents with both comfort and dignity.
                </p>
                <p>
                  Every room has been thoughtfully furnished with quality bedding, flat-screen TVs, and modern wooden-effect flooring. The property also includes shared communal areas — a fully equipped kitchen, a comfortable lounge, and an outdoor garden space. Everything is maintained to a high standard, ensuring residents can take pride in their home.
                </p>
              </div>

              <div className="flex items-center gap-2 mt-6 text-navy font-medium" style={{ fontFamily: "var(--font-body)" }}>
                <MapPin className="w-5 h-5 text-gold" />
                13 Woodland Road, London, N9 8RP
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ PHOTO GALLERY ═══════════════════ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Gallery"
            title="See Our Rooms"
            subtitle="Take a look inside our ensuite bedrooms and private bathrooms."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative rounded-xl overflow-hidden shadow-lg cursor-pointer"
                onClick={() => openLightbox(i)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-[280px] sm:h-[320px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-white font-semibold text-sm" style={{ fontFamily: "var(--font-display)" }}>
                    {img.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ LIGHTBOX ═══════════════════ */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 text-white/70 hover:text-white transition-colors z-10"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 text-white/70 hover:text-white transition-colors z-10"
            >
              <ChevronRightIcon className="w-10 h-10" />
            </button>
            <motion.img
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={galleryImages[lightboxIdx].src}
              alt={galleryImages[lightboxIdx].alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <span className="text-white/80 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                {galleryImages[lightboxIdx].label} — {lightboxIdx + 1} of {galleryImages.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════ FEATURES GRID ═══════════════════ */}
      <section className="py-20 sm:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Property Features"
            title="Everything You Need"
            subtitle="Our accommodation is equipped with all the amenities and features to make your stay comfortable."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white rounded-xl p-5 border border-cream-dark hover:shadow-md transition-shadow text-center"
              >
                <div className="w-11 h-11 rounded-lg bg-navy/5 flex items-center justify-center mx-auto mb-3">
                  <f.icon className="w-5 h-5 text-navy" />
                </div>
                <h3 className="text-navy font-semibold text-sm mb-1" style={{ fontFamily: "var(--font-display)" }}>
                  {f.label}
                </h3>
                <p className="text-warm-gray text-xs leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ BEDROOM DETAILS ═══════════════════ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-gold-dark text-xs font-semibold tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-body)" }}>
                Your Room
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-navy mt-3 mb-6 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                Private Ensuite{" "}
                <span className="text-gold italic">Bedrooms</span>
              </h2>
              <p className="text-warm-gray text-base leading-relaxed mb-6" style={{ fontFamily: "var(--font-body)" }}>
                Each of our four bedrooms comes with its own private ensuite bathroom, giving residents the privacy and comfort they deserve. Rooms are furnished to a high standard with modern amenities and maintained regularly.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roomFeatures.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-foreground" style={{ fontFamily: "var(--font-body)" }}>
                    <CheckCircle2 className="w-4 h-4 text-gold-dark shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-4"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={ROOM_BEDROOM_2}
                  alt="Spacious ensuite bedroom with natural light"
                  className="w-full h-[300px] sm:h-[340px] object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={ROOM_ENSUITE}
                  alt="Private ensuite bathroom with marble-effect tiles"
                  className="w-full h-[200px] sm:h-[240px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ COMMUNAL SPACES ═══════════════════ */}
      <section className="py-20 sm:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-2xl overflow-hidden shadow-xl order-2 lg:order-1"
            >
              <img
                src={ROOM_STUDIO}
                alt="Studio-style room with living area"
                className="w-full h-[400px] sm:h-[480px] object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-1 lg:order-2"
            >
              <span className="text-gold-dark text-xs font-semibold tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-body)" }}>
                Shared Spaces
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-navy mt-3 mb-6 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                Community{" "}
                <span className="text-gold italic">Living</span>
              </h2>
              <div className="space-y-4 text-warm-gray text-base leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                <p>
                  Our communal areas are designed to encourage social interaction and skill development. The shared kitchen is fully equipped, providing an ideal space for residents to learn and practise cooking skills with support from our team.
                </p>
                <p>
                  The comfortable lounge area offers a relaxed space for residents to socialise, watch television, or simply unwind. Our garden provides a peaceful outdoor retreat, perfect for fresh air and relaxation.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ LOCAL AREA ═══════════════════ */}
      <section className="py-20 sm:py-28 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Location"
            title="The Local Area"
            subtitle="Our N9 location offers excellent access to amenities, transport, and green spaces."
            light
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: Bus,
                title: "Transport Links",
                desc: "Well-connected with bus routes and nearby rail stations providing easy access across London.",
              },
              {
                icon: ShoppingBag,
                title: "Local Amenities",
                desc: "Close to shops, supermarkets, pharmacies, GP surgeries, and other essential services.",
              },
              {
                icon: TreePine,
                title: "Green Spaces",
                desc: "Surrounded by parks and green areas, providing opportunities for outdoor activities and relaxation.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/5 rounded-xl p-7 border border-white/10 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  {item.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
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
              Interested in a Placement?
            </h2>
            <p className="text-warm-gray text-lg mb-10 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              We welcome enquiries from local authorities, social workers, and individuals. Contact us to discuss availability and the referral process.
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

/*
 * Design: Warm Haven — Contemporary Hospitality
 * Footer: Navy background, gold accents, warm and professional
 */
import { Link } from "wouter";
import { MapPin, Phone, Mail, Clock, Heart } from "lucide-react";

const LOGO_ICON_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/120168284/IfTEiEpNrEdfnUWG.png";

export default function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <img
                src={LOGO_ICON_URL}
                alt="Cogie Care Services icon"
                className="h-11 w-auto object-contain"
              />
              <div className="leading-tight">
                <span
                  className="text-white text-lg font-bold tracking-tight block"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Cogie Care
                </span>
                <span
                  className="text-gold text-[10px] tracking-[0.2em] uppercase block"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Services
                </span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6" style={{ fontFamily: "var(--font-body)" }}>
              Providing high-quality supported accommodation in North London. We believe everyone deserves a safe, dignified place to call home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold text-sm font-semibold tracking-widest uppercase mb-5" style={{ fontFamily: "var(--font-body)" }}>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/services", label: "Our Services" },
                { href: "/accommodation", label: "Accommodation" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-gold transition-colors text-sm"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-gold text-sm font-semibold tracking-widest uppercase mb-5" style={{ fontFamily: "var(--font-body)" }}>
              Our Services
            </h3>
            <ul className="space-y-3">
              {[
                "24/7 Support",
                "Mental Health Support",
                "Life Skills Development",
                "Key Worker Sessions",
                "Wellbeing Programmes",
              ].map((service) => (
                <li key={service}>
                  <span className="text-white/60 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gold text-sm font-semibold tracking-widest uppercase mb-5" style={{ fontFamily: "var(--font-body)" }}>
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <span className="text-white/60 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                  13 Woodland Road<br />London, N9 8RP
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a href="tel:+44" className="text-white/60 hover:text-gold transition-colors text-sm" style={{ fontFamily: "var(--font-body)" }}>
                  Contact us for details
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a href="mailto:info@cogiecareservices.co.uk" className="text-white/60 hover:text-gold transition-colors text-sm" style={{ fontFamily: "var(--font-body)" }}>
                  info@cogiecareservices.co.uk
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <span className="text-white/60 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                  24/7 Support Available<br />Office: Mon–Fri, 9am–5pm
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-xs" style={{ fontFamily: "var(--font-body)" }}>
              &copy; {new Date().getFullYear()} Cogie Care Services. All rights reserved.
            </p>
            <p className="text-white/40 text-xs flex items-center gap-1" style={{ fontFamily: "var(--font-body)" }}>
              Made with <Heart className="w-3 h-3 text-rose fill-rose" /> for our community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

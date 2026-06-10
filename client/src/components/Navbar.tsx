/*
 * Design: Warm Haven — Contemporary Hospitality
 * Navbar: Sticky top nav with navy background, gold accent, Playfair Display brand
 * Mobile: Hamburger menu with slide-in drawer
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LOGO_ICON_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/120168284/IfTEiEpNrEdfnUWG.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/accommodation", label: "Accommodation" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy/95 backdrop-blur-md shadow-lg"
          : "bg-navy/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo: Icon + White Text */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src={LOGO_ICON_URL}
              alt="Cogie Care Services icon"
              className="h-10 sm:h-12 w-auto object-contain"
            />
            <div className="hidden sm:block leading-tight">
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
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${
                  location === link.href
                    ? "text-gold"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {link.label}
                {location === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-gold rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gold text-navy text-sm font-semibold rounded-lg hover:bg-gold-light transition-colors shadow-md hover:shadow-lg"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <Phone className="w-4 h-4" />
              Get in Touch
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-white/90 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-navy-dark border-t border-white/10 overflow-hidden"
          >
            <nav className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    location === link.href
                      ? "bg-gold/10 text-gold"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 mt-3 px-4 py-3 bg-gold text-navy text-base font-semibold rounded-lg"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <Phone className="w-4 h-4" />
                Get in Touch
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

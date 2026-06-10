/*
 * Design: Warm Haven — Contemporary Hospitality
 * PageLayout: Shared wrapper with Navbar + Footer + scroll-to-top
 */
import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-18 sm:pt-20">{children}</main>
      <Footer />
    </div>
  );
}

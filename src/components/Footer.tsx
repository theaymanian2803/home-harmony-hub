import { Building2, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  explore: [
    { label: "Browse Properties", to: "/search" },
    { label: "Seller Plans", to: "/pricing" },
    { label: "List a Property", to: "/dashboard" },
  ],
  company: [
    { label: "About Us", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Careers", to: "/about" },
  ],
  legal: [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground/70">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <Building2 className="h-7 w-7 text-accent" />
              <span className="font-display text-xl font-bold text-primary-foreground">
                EstateHub
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed">
              The modern platform connecting buyers with premium real estate listings nationwide. Trusted by thousands.
            </p>
            <div className="mt-6 space-y-2">
              <a href="mailto:hello@estatehub.com" className="flex items-center gap-2 text-sm hover:text-accent transition-colors">
                <Mail className="h-4 w-4" /> hello@estatehub.com
              </a>
              <a href="tel:+18001234567" className="flex items-center gap-2 text-sm hover:text-accent transition-colors">
                <Phone className="h-4 w-4" /> 1-800-123-4567
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold text-primary-foreground">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.explore.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-accent transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold text-primary-foreground">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.company.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-accent transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold text-primary-foreground">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.legal.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-accent transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/10 pt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs">© {new Date().getFullYear()} EstateHub. All rights reserved.</p>
          <div className="flex gap-4 text-xs">
            <Link to="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-accent transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-accent transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

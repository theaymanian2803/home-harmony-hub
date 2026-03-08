import { Building2, Mail, Phone } from "lucide-react";
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
    <footer className="gradient-chocolate text-primary-foreground/60">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="gradient-caramel rounded-xl p-2">
                <Building2 className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-primary-foreground">
                EstateHub
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed">
              The modern platform connecting buyers with premium real estate listings nationwide. Trusted by thousands.
            </p>
            <div className="mt-6 space-y-2.5">
              <a href="mailto:hello@estatehub.com" className="flex items-center gap-2 text-sm hover:text-caramel transition-colors">
                <Mail className="h-4 w-4" /> hello@estatehub.com
              </a>
              <a href="tel:+18001234567" className="flex items-center gap-2 text-sm hover:text-caramel transition-colors">
                <Phone className="h-4 w-4" /> 1-800-123-4567
              </a>
            </div>
          </div>

          {[
            { title: "Explore", links: footerLinks.explore },
            { title: "Company", links: footerLinks.company },
            { title: "Legal", links: footerLinks.legal },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 font-display text-sm font-semibold text-primary-foreground">
                {section.title}
              </h4>
              <ul className="space-y-2.5 text-sm">
                {section.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="hover:text-caramel transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-primary-foreground/10 pt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs">© {new Date().getFullYear()} EstateHub. All rights reserved.</p>
          <div className="flex gap-4 text-xs">
            <Link to="/privacy" className="hover:text-caramel transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-caramel transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-caramel transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

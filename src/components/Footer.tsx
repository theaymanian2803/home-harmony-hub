import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground/70">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Building2 className="h-6 w-6 text-accent" />
              <span className="font-display text-lg font-bold text-primary-foreground">
                EstateHub
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              The modern platform connecting buyers with premium real estate listings nationwide.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-display text-sm font-semibold text-primary-foreground">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/search" className="hover:text-accent transition-colors">Browse Properties</Link></li>
              <li><Link to="/pricing" className="hover:text-accent transition-colors">Seller Plans</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-display text-sm font-semibold text-primary-foreground">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li><span className="cursor-default">About Us</span></li>
              <li><span className="cursor-default">Contact</span></li>
              <li><span className="cursor-default">Careers</span></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-display text-sm font-semibold text-primary-foreground">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li><span className="cursor-default">Privacy Policy</span></li>
              <li><span className="cursor-default">Terms of Service</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-primary-foreground/10 pt-6 text-center text-xs">
          © {new Date().getFullYear()} EstateHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

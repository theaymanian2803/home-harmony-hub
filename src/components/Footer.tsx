import { Building2, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  const footerLinks = {
    explore: [
      { label: t("footer.browseProperties"), to: "/search" },
      { label: t("footer.sellerPlans"), to: "/pricing" },
      { label: t("footer.listProperty"), to: "/dashboard" },
    ],
    company: [
      { label: t("footer.aboutUs"), to: "/about" },
      { label: t("footer.contact"), to: "/contact" },
      { label: t("footer.careers"), to: "/about" },
    ],
    legal: [
      { label: t("footer.privacyPolicy"), to: "/privacy" },
      { label: t("footer.termsOfService"), to: "/terms" },
    ],
  };

  return (
    <footer className="gradient-chocolate text-primary-foreground/60">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="gradient-caramel rounded-xl p-2">
                <Building2 className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-primary-foreground">EstateHub</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed">{t("footer.description")}</p>
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
            { title: t("footer.explore"), links: footerLinks.explore },
            { title: t("footer.company"), links: footerLinks.company },
            { title: t("footer.legal"), links: footerLinks.legal },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 font-display text-sm font-semibold text-primary-foreground">{section.title}</h4>
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
          <p className="text-xs">© {new Date().getFullYear()} EstateHub. {t("footer.allRightsReserved")}</p>
          <div className="flex gap-4 text-xs">
            <Link to="/privacy" className="hover:text-caramel transition-colors">{t("footer.privacy")}</Link>
            <Link to="/terms" className="hover:text-caramel transition-colors">{t("footer.terms")}</Link>
            <Link to="/contact" className="hover:text-caramel transition-colors">{t("footer.contact")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

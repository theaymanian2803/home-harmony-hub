import { Search, Shield, TrendingUp, Clock, Headphones, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function WhyChooseUs() {
  const { t } = useTranslation();

  const features = [
    { icon: Search, title: t("whyUs.smartSearch"), description: t("whyUs.smartSearchDesc") },
    { icon: Shield, title: t("whyUs.verifiedListings"), description: t("whyUs.verifiedListingsDesc") },
    { icon: TrendingUp, title: t("whyUs.marketInsights"), description: t("whyUs.marketInsightsDesc") },
    { icon: Clock, title: t("whyUs.quickListing"), description: t("whyUs.quickListingDesc") },
    { icon: Headphones, title: t("whyUs.dedicatedSupport"), description: t("whyUs.dedicatedSupportDesc") },
    { icon: Globe, title: t("whyUs.nationwideCoverage"), description: t("whyUs.nationwideCoverageDesc") },
  ];

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="absolute top-10 right-10 h-32 w-32 shape-blob bg-accent/5 animate-float-slow" />
      <div className="absolute bottom-20 left-10 h-24 w-24 shape-blob-2 bg-caramel/5 animate-float" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <span className="neu-card-sm inline-block px-5 py-2 text-sm font-semibold uppercase tracking-wider text-accent">
            {t("whyUs.badge")}
          </span>
          <h2 className="mt-6 font-display text-3xl font-bold text-foreground md:text-5xl">
            {t("whyUs.titleStart")}
            <span className="text-gradient-chocolate">{t("whyUs.titleHighlight")}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {t("whyUs.subtitle")}
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group neu-card p-8 transition-all duration-300 hover:translate-y-[-4px]">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl neu-pressed transition-all duration-300 group-hover:shadow-none">
                <div className="gradient-caramel rounded-xl p-2.5 opacity-0 group-hover:opacity-100 transition-opacity absolute">
                  <f.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <f.icon className="h-6 w-6 text-accent group-hover:opacity-0 transition-opacity" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

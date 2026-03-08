import { Building2, Users, Target, Heart, Award, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

const team = [
  { name: "James Morrison", role: "CEO & Co-Founder", initials: "JM" },
  { name: "Sarah Chen", role: "CTO & Co-Founder", initials: "SC" },
  { name: "Emily Rodriguez", role: "Head of Operations", initials: "ER" },
  { name: "David Kim", role: "Lead Designer", initials: "DK" },
];

export default function AboutPage() {
  const { t } = useTranslation();

  const values = [
    { icon: Heart, title: t("about.peopleFirst"), desc: t("about.peopleFirstDesc") },
    { icon: Target, title: t("about.transparency"), desc: t("about.transparencyDesc") },
    { icon: Award, title: t("about.quality"), desc: t("about.qualityDesc") },
    { icon: Globe, title: t("about.accessibility"), desc: t("about.accessibilityDesc") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="gradient-chocolate pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block rounded-full bg-caramel/20 px-4 py-1.5 text-sm font-semibold text-caramel">{t("about.badge")}</span>
          <h1 className="mt-4 font-display text-4xl font-bold text-primary-foreground md:text-6xl">{t("about.title")}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/60">{t("about.subtitle")}</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 neu-pressed flex h-16 w-16 items-center justify-center rounded-2xl">
              <Building2 className="h-8 w-8 text-accent" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground">{t("about.missionTitle")}</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t("about.missionText")}</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-foreground">{t("about.valuesTitle")}</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t("about.valuesSubtitle")}</p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="neu-card p-8 text-center transition-all duration-300 hover:translate-y-[-4px]">
                <div className="mx-auto mb-4 inline-flex rounded-xl neu-pressed p-3">
                  <v.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-foreground">{t("about.teamTitle")}</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t("about.teamSubtitle")}</p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((te) => (
              <div key={te.name} className="neu-card p-6 text-center group transition-all duration-300 hover:translate-y-[-4px]">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full gradient-caramel font-display text-xl font-bold text-accent-foreground shadow-md">{te.initials}</div>
                <h3 className="font-display text-base font-bold text-foreground">{te.name}</h3>
                <p className="text-sm text-muted-foreground">{te.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding gradient-chocolate">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "25,000+", label: t("stats.activeBuyers") },
              { value: "4,800+", label: t("stats.propertiesListed") },
              { value: "1,200+", label: t("stats.trustedSellers") },
              { value: "50", label: t("about.statesCovered") },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-4xl font-bold text-caramel">{s.value}</p>
                <p className="mt-1 text-sm text-primary-foreground/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

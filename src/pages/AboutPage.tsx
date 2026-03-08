import { Building2, Users, Target, Heart, Award, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const values = [
  { icon: Heart, title: "People First", desc: "Every feature we build starts with the question: does this help our users find or sell their home faster?" },
  { icon: Target, title: "Transparency", desc: "No hidden fees, no inflated listings. We believe in honest, verified information for every property." },
  { icon: Award, title: "Quality", desc: "Every listing goes through our approval process. We maintain high standards so you don't have to worry." },
  { icon: Globe, title: "Accessibility", desc: "Whether you're a first-time buyer or a seasoned investor, EstateHub is built for everyone." },
];

const team = [
  { name: "James Morrison", role: "CEO & Co-Founder", initials: "JM" },
  { name: "Sarah Chen", role: "CTO & Co-Founder", initials: "SC" },
  { name: "Emily Rodriguez", role: "Head of Operations", initials: "ER" },
  { name: "David Kim", role: "Lead Designer", initials: "DK" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="gradient-chocolate pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block rounded-full bg-caramel/20 px-4 py-1.5 text-sm font-semibold text-caramel">
            Our Story
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold text-primary-foreground md:text-6xl">
            About EstateHub
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/60">
            We're on a mission to make real estate accessible, transparent, and stress-free for everyone.
            Founded in 2024, EstateHub has grown into one of the most trusted property platforms in the country.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 neu-pressed flex h-16 w-16 items-center justify-center rounded-2xl">
              <Building2 className="h-8 w-8 text-accent" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground">Our Mission</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              To democratize real estate by giving everyone — buyers, sellers, and investors — the tools
              they need to make confident decisions. We believe that finding your dream home shouldn't
              require an army of agents or a stack of paperwork.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-foreground">What We Stand For</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Our values guide every decision we make.
            </p>
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

      {/* Team */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-foreground">Meet the Team</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              A passionate group of real estate and technology enthusiasts building the future of home buying.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((t) => (
              <div key={t.name} className="neu-card p-6 text-center group transition-all duration-300 hover:translate-y-[-4px]">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full gradient-caramel font-display text-xl font-bold text-accent-foreground shadow-md">
                  {t.initials}
                </div>
                <h3 className="font-display text-base font-bold text-foreground">{t.name}</h3>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding gradient-chocolate">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "25,000+", label: "Active Buyers" },
              { value: "4,800+", label: "Properties Listed" },
              { value: "1,200+", label: "Trusted Sellers" },
              { value: "50", label: "States Covered" },
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

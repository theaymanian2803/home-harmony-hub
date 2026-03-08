import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import { Shield, TrendingUp, Users } from "lucide-react";

const stats = [
  { icon: Users, label: "Active Buyers", value: "25,000+" },
  { icon: TrendingUp, label: "Properties Listed", value: "4,800+" },
  { icon: Shield, label: "Trusted Sellers", value: "1,200+" },
];

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />

      {/* Stats */}
      <section className="border-b border-border bg-card py-12">
        <div className="container mx-auto grid grid-cols-1 gap-8 px-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center justify-center gap-4">
              <div className="rounded-lg bg-accent/10 p-3">
                <s.icon className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <FeaturedProperties />
      <CtaSection />
      <Footer />
    </div>
  );
}

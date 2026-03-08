import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowItWorks from "@/components/HowItWorks";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import { Shield, TrendingUp, Users, Home } from "lucide-react";

const stats = [
  { icon: Users, label: "Active Buyers", value: "25,000+" },
  { icon: Home, label: "Properties Listed", value: "4,800+" },
  { icon: Shield, label: "Trusted Sellers", value: "1,200+" },
  { icon: TrendingUp, label: "Successful Sales", value: "3,400+" },
];

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />

      {/* Stats */}
      <section className="relative -mt-12 z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-card p-6 shadow-xl border border-border/50 md:grid-cols-4 md:p-8">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3 justify-center">
                <div className="rounded-xl bg-accent/10 p-2.5">
                  <s.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-display text-xl font-bold text-foreground md:text-2xl">{s.value}</p>
                  <p className="text-xs text-muted-foreground md:text-sm">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedProperties />
      <WhyChooseUs />
      <HowItWorks />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </div>
  );
}

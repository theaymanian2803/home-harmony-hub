import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowItWorks from "@/components/HowItWorks";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import { Shield, TrendingUp, Users, Home } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Index() {
  const { t } = useTranslation();

  const stats = [
    { icon: Users, label: t("stats.activeBuyers"), value: "25,000+" },
    { icon: Home, label: t("stats.propertiesListed"), value: "4,800+" },
    { icon: Shield, label: t("stats.trustedSellers"), value: "1,200+" },
    { icon: TrendingUp, label: t("stats.successfulSales"), value: "3,400+" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      <section className="relative -mt-14 z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 neu-card-lg p-8 md:grid-cols-4 md:p-10">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-4 justify-center">
                <div className="neu-pressed rounded-xl p-3">
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

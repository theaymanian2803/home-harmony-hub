import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowItWorks from "@/components/HowItWorks";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import { Shield, TrendingUp, Users, Home } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function Index() {
  const { getValue, loading } = useSiteContent();

  const stats = [
    { icon: Users, label: getValue("stat_active_buyers_label", "Active Buyers"), value: getValue("stat_active_buyers_value", "25,000+") },
    { icon: Home, label: getValue("stat_properties_listed_label", "Properties Listed"), value: getValue("stat_properties_listed_value", "4,800+") },
    { icon: Shield, label: getValue("stat_trusted_sellers_label", "Trusted Sellers"), value: getValue("stat_trusted_sellers_value", "1,200+") },
    { icon: TrendingUp, label: getValue("stat_successful_sales_label", "Successful Sales"), value: getValue("stat_successful_sales_value", "3,400+") },
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

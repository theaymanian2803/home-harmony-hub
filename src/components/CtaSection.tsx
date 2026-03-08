import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function CtaSection() {
  const { getValue } = useSiteContent();

  const benefits = [
    "No hidden fees",
    "Cancel anytime",
    "24/7 Support",
    "Verified listings",
  ];

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="absolute top-20 left-10 h-48 w-48 shape-blob bg-accent/5 animate-float-slow" />
      <div className="absolute bottom-10 right-10 h-32 w-32 shape-blob-2 bg-caramel/5 animate-float" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto max-w-4xl rounded-3xl gradient-chocolate p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 shape-blob bg-accent/5 blur-xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 shape-blob-3 bg-caramel/5 blur-xl" />
          <div className="absolute top-1/2 right-10 h-16 w-16 rounded-full border border-accent/10 animate-float-slow" />

          <div className="relative z-10">
            <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-5xl">
              {getValue("cta_title_line1", "Ready to Find Your")}
              <span className="block mt-2" style={{ background: "linear-gradient(135deg, hsl(25 55% 58%), hsl(35 80% 55%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {getValue("cta_title_line2", "Perfect Property?")}
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-primary-foreground/50 md:text-lg">
              {getValue("cta_subtitle", "Join thousands of satisfied buyers and sellers.")}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {benefits.map((b) => (
                <span key={b} className="flex items-center gap-2 text-sm text-primary-foreground/60">
                  <CheckCircle className="h-4 w-4 text-caramel" /> {b}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="gradient-caramel text-accent-foreground hover:opacity-90 rounded-xl px-10 text-base shadow-lg" asChild>
                <Link to="/pricing">
                  View Plans <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-caramel/40 bg-transparent text-caramel hover:bg-caramel hover:text-accent-foreground rounded-xl px-10" asChild>
                <Link to="/auth">Create Free Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

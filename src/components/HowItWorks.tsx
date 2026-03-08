import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { step: "01", title: "Search", desc: "Browse listings by location, price, type, and amenities." },
  { step: "02", title: "Connect", desc: "Contact verified sellers directly through our platform." },
  { step: "03", title: "Close", desc: "Finalize your purchase with confidence and move in." },
];

export default function HowItWorks() {
  return (
    <section className="section-padding gradient-navy relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
            <Zap className="h-4 w-4" /> Simple Process
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-primary-foreground md:text-4xl">
            How EstateHub Works
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/60">
            Three simple steps to your next property. No complicated processes, no hidden fees.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.step} className="group text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 transition-all group-hover:bg-accent group-hover:scale-110">
                <span className="font-display text-2xl font-bold text-accent group-hover:text-accent-foreground transition-colors">{s.step}</span>
              </div>
              <h3 className="font-display text-xl font-bold text-primary-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-primary-foreground/60">{s.desc}</p>
              {i < steps.length - 1 && (
                <ArrowRight className="mx-auto mt-6 hidden h-5 w-5 text-accent/40 md:block" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-emerald-light rounded-xl px-10" asChild>
            <Link to="/search">
              Start Browsing <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

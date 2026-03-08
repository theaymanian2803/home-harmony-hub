import { Link } from "react-router-dom";
import { ArrowRight, Search, MessageSquare, Key } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { step: "01", title: "Search", desc: "Browse listings by location, price, type, and amenities.", icon: Search },
  { step: "02", title: "Connect", desc: "Contact verified sellers directly through our platform.", icon: MessageSquare },
  { step: "03", title: "Close", desc: "Finalize your purchase with confidence and move in.", icon: Key },
];

export default function HowItWorks() {
  return (
    <section className="section-padding gradient-chocolate relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 h-96 w-96 shape-blob bg-accent/5 blur-2xl" />
      <div className="absolute bottom-0 left-0 h-64 w-64 shape-blob-3 bg-caramel/5 blur-2xl" />
      <div className="absolute top-1/2 right-1/4 h-20 w-20 rounded-full border-2 border-accent/10 animate-float-slow" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-5 py-2 text-sm font-semibold text-caramel backdrop-blur-sm">
            Simple Process
          </span>
          <h2 className="mt-6 font-display text-3xl font-bold text-primary-foreground md:text-5xl">
            How EstateHub Works
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/50">
            Three simple steps to your next property. No complicated processes, no hidden fees.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.step} className="group text-center relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-accent/30 to-transparent" />
              )}
              <div className="mx-auto mb-6 relative">
                {/* Outer neumorphic ring */}
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/80 border border-accent/10 transition-all duration-300 group-hover:scale-110"
                  style={{ boxShadow: "6px 6px 14px hsl(25 45% 8% / 0.5), -6px -6px 14px hsl(25 35% 25% / 0.3)" }}
                >
                  <s.icon className="h-8 w-8 text-caramel transition-transform duration-300 group-hover:scale-110" />
                </div>
                {/* Step number badge */}
                <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full gradient-caramel text-xs font-bold text-accent-foreground shadow-lg">
                  {s.step}
                </div>
              </div>
              <h3 className="font-display text-xl font-bold text-primary-foreground">{s.title}</h3>
              <p className="mt-3 text-sm text-primary-foreground/50 max-w-xs mx-auto">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" className="gradient-caramel text-accent-foreground hover:opacity-90 rounded-xl px-10 shadow-lg" asChild>
            <Link to="/search">
              Start Browsing <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "List up to 2 properties for free",
  "Reach 25,000+ active buyers",
  "Verified seller badge",
  "Dedicated dashboard & analytics",
];

export default function CtaSection() {
  return (
    <section className="section-padding bg-secondary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--accent)/0.06),transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto max-w-4xl rounded-3xl gradient-navy p-10 md:p-16 text-center shadow-2xl">
          <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-5xl">
            Ready to Sell
            <span className="text-gradient-emerald"> Your Property?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-primary-foreground/60 md:text-lg">
            Join over 1,200 trusted sellers and connect with serious buyers. Get started in minutes.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {benefits.map((b) => (
              <span key={b} className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <CheckCircle className="h-4 w-4 text-accent" /> {b}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-emerald-light rounded-xl px-10 text-base"
              asChild
            >
              <Link to="/pricing">
                View Plans <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-accent/40 bg-transparent text-accent hover:bg-accent hover:text-accent-foreground rounded-xl px-10"
              asChild
            >
              <Link to="/auth">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

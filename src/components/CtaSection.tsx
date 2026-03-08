import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="gradient-navy py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">
          Ready to Sell Your Property?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-primary-foreground/70">
          List up to 2 properties for free. Need more? Upgrade to Seller Pro for just{" "}
          <span className="font-semibold text-accent">$10/month</span> — unlimited listings, analytics & priority support.
        </p>
        <Button
          size="lg"
          className="mt-8 bg-accent text-accent-foreground hover:bg-emerald-light"
          asChild
        >
          <Link to="/pricing">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

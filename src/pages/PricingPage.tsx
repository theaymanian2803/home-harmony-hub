import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  "Unlimited property listings",
  "High-resolution image gallery",
  "Lead generation contact forms",
  "Analytics & view tracking",
  "Featured listing boost",
  "Priority support",
];

export default function PricingPage() {
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pb-20 pt-28 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">
          Simple Pricing
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold text-foreground">
          Start Selling Today
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          One straightforward plan. Everything you need to reach thousands of buyers.
        </p>

        {/* Card */}
        <div className="mx-auto mt-12 max-w-md rounded-2xl border-2 border-accent bg-card p-8 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Seller Pro
          </p>
          <div className="mt-4 flex items-baseline justify-center gap-1">
            <span className="font-display text-5xl font-bold text-foreground">$10</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Cancel anytime. No hidden fees.</p>

          <ul className="mt-8 space-y-3 text-left">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                <Check className="h-4 w-4 shrink-0 text-accent" />
                {f}
              </li>
            ))}
          </ul>

          <Button
            size="lg"
            className="mt-8 w-full bg-accent text-accent-foreground hover:bg-emerald-light"
            onClick={() =>
              toast({
                title: "Subscription Started!",
                description: "Welcome aboard! Redirecting to your dashboard…",
              })
            }
          >
            Subscribe Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Already subscribed?{" "}
          <Link to="/dashboard" className="text-accent hover:underline">
            Go to Dashboard
          </Link>
        </p>
      </div>
      <Footer />
    </div>
  );
}

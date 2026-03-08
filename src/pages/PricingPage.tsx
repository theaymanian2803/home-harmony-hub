import { useEffect, useState } from "react";
import { Check, X, ArrowRight, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const freeTier = [
  { text: "Up to 2 property listings", included: true },
  { text: "Basic property page", included: true },
  { text: "Contact form for leads", included: true },
  { text: "Analytics & view tracking", included: false },
  { text: "Featured listing boost", included: false },
  { text: "Priority support", included: false },
];

const proTier = [
  { text: "Unlimited property listings", included: true },
  { text: "High-resolution image gallery", included: true },
  { text: "Lead generation contact forms", included: true },
  { text: "Analytics & view tracking", included: true },
  { text: "Featured listing boost", included: true },
  { text: "Priority support", included: true },
];

export default function PricingPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { isSubscribed, createSubscription, activateSubscription } = useSubscription();
  const [subscribing, setSubscribing] = useState(false);
  const [searchParams] = useSearchParams();

  // Handle PayPal return
  useEffect(() => {
    const status = searchParams.get("status");
    const subId = searchParams.get("subscription_id");

    if (status === "success" && subId) {
      activateSubscription(subId).then((result) => {
        if (result.status === "active") {
          toast({ title: "Subscription Active!", description: "Welcome to Seller Pro! 🎉" });
        } else {
          toast({ title: "Processing", description: "Your subscription is being processed." });
        }
      }).catch(() => {
        toast({ title: "Error", description: "Failed to activate subscription.", variant: "destructive" });
      });
    } else if (status === "cancelled") {
      toast({ title: "Cancelled", description: "Subscription was not completed." });
    }
  }, [searchParams]);

  const handleSubscribe = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to subscribe." });
      return;
    }

    setSubscribing(true);
    try {
      const { approvalUrl } = await createSubscription();
      if (approvalUrl) {
        window.location.href = approvalUrl;
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pb-20 pt-28 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">
          Simple Pricing
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold text-foreground">
          Start Listing for Free
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          List up to 2 properties at no cost. Upgrade when you're ready to grow.
        </p>

        <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2">
          {/* Free */}
          <div className="rounded-2xl border border-border bg-card p-8 text-left">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Free</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-5xl font-bold text-foreground">$0</span>
              <span className="text-muted-foreground">/forever</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Perfect for getting started.</p>
            <ul className="mt-8 space-y-3">
              {freeTier.map((f) => (
                <li key={f.text} className="flex items-center gap-3 text-sm">
                  {f.included ? (
                    <Check className="h-4 w-4 shrink-0 text-accent" />
                  ) : (
                    <X className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                  )}
                  <span className={f.included ? "text-foreground" : "text-muted-foreground/50"}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="mt-8 w-full" asChild>
              <Link to={user ? "/dashboard" : "/auth"}>
                {user ? "Go to Dashboard" : "Sign Up Free"}
              </Link>
            </Button>
          </div>

          {/* Pro */}
          <div className="relative rounded-2xl border-2 border-accent bg-card p-8 text-left shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-accent-foreground">
              Most Popular
            </div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Seller Pro</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-5xl font-bold text-foreground">$10</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Cancel anytime. No hidden fees.</p>
            <ul className="mt-8 space-y-3">
              {proTier.map((f) => (
                <li key={f.text} className="flex items-center gap-3 text-sm text-foreground">
                  <Check className="h-4 w-4 shrink-0 text-accent" />
                  {f.text}
                </li>
              ))}
            </ul>
            {isSubscribed ? (
              <Button variant="outline" className="mt-8 w-full" asChild>
                <Link to="/dashboard">Go to Dashboard ✓</Link>
              </Button>
            ) : (
              <Button
                size="lg"
                className="mt-8 w-full gradient-caramel text-accent-foreground hover:opacity-90"
                onClick={handleSubscribe}
                disabled={subscribing}
              >
                {subscribing ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Redirecting to PayPal…</>
                ) : (
                  <>Subscribe Now <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            )}
          </div>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          {user ? (
            <>Already subscribed? <Link to="/dashboard" className="text-accent hover:underline">Go to Dashboard</Link></>
          ) : (
            <>Already have an account? <Link to="/auth" className="text-accent hover:underline">Sign in</Link></>
          )}
        </p>
      </div>
      <Footer />
    </div>
  );
}

import { useEffect, useState } from "react";
import { Check, X, ArrowRight, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

const MONTHLY_PRICES = { pro: 10, unlimited: 90 };
const ANNUAL_PRICES = { pro: 96, unlimited: 864 };
const ANNUAL_MONTHLY = { pro: 8, unlimited: 72 };

export default function PricingPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { isSubscribed, details, createSubscription, activateSubscription } = useSubscription();
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const { t } = useTranslation();

  useEffect(() => {
    const status = searchParams.get("status");
    const subId = searchParams.get("subscription_id") || localStorage.getItem("pending_subscription_id");
    if (status === "success" && subId) {
      localStorage.removeItem("pending_subscription_id");
      activateSubscription(subId).then((result) => {
        toast({ title: result.status === "active" ? "Subscription Active! 🎉" : "Processing…" });
      }).catch(() => { toast({ title: "Error", description: "Failed to activate.", variant: "destructive" }); });
    } else if (status === "cancelled") { localStorage.removeItem("pending_subscription_id"); toast({ title: "Cancelled" }); }
  }, [searchParams]);

  const handleSubscribe = async (plan: "pro" | "unlimited") => {
    if (!user) { toast({ title: t("auth.signIn"), variant: "destructive" }); return; }
    const billingPlan = billing === "annual" ? `${plan}_annual` : plan;
    setSubscribing(plan);
    try {
      const { approvalUrl, subscriptionId } = await createSubscription(billingPlan as any);
      if (approvalUrl) { localStorage.setItem("pending_subscription_id", subscriptionId); window.location.href = approvalUrl; }
    } catch (err: any) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
    finally { setSubscribing(null); }
  };

  const currentPlan = details?.plan || "free";
  const isAnnual = billing === "annual";
  const proPrice = isAnnual ? ANNUAL_MONTHLY.pro : MONTHLY_PRICES.pro;
  const unlimitedPrice = isAnnual ? ANNUAL_MONTHLY.unlimited : MONTHLY_PRICES.unlimited;

  const freeTier = [
    { text: t("pricing.up2listings"), included: true },
    { text: t("pricing.basicPage"), included: true },
    { text: t("pricing.contactFormLeads"), included: true },
    { text: t("pricing.analyticsTracking"), included: false },
    { text: t("pricing.featuredBoost"), included: false },
    { text: t("pricing.prioritySupport"), included: false },
  ];
  const proTier = [
    { text: t("pricing.up25listings"), included: true },
    { text: t("pricing.hiResGallery"), included: true },
    { text: t("pricing.leadGenForms"), included: true },
    { text: t("pricing.analyticsTracking"), included: true },
    { text: t("pricing.featuredBoost"), included: false },
    { text: t("pricing.prioritySupport"), included: false },
  ];
  const unlimitedTier = [
    { text: t("pricing.unlimitedListings"), included: true },
    { text: t("pricing.hiResGallery"), included: true },
    { text: t("pricing.leadGenForms"), included: true },
    { text: t("pricing.analyticsTracking"), included: true },
    { text: t("pricing.featuredBoost"), included: true },
    { text: t("pricing.prioritySupport"), included: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pb-20 pt-28 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">{t("pricing.badge")}</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-foreground">{t("pricing.title")}</h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">{t("pricing.subtitle")}</p>

        <div className="mx-auto mt-8 flex items-center justify-center gap-3">
          <span className={`text-sm font-medium transition-colors ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>{t("pricing.monthly")}</span>
          <button onClick={() => setBilling(isAnnual ? "monthly" : "annual")}
            className={`relative inline-flex h-7 w-[52px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none ${isAnnual ? "bg-accent" : "bg-muted"}`} role="switch" aria-checked={isAnnual}>
            <span className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${isAnnual ? "translate-x-[27px]" : "translate-x-[3px]"}`} />
          </button>
          <span className={`text-sm font-medium transition-colors ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>{t("pricing.annual")}</span>
          {isAnnual && <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">{t("pricing.save20")}</Badge>}
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
          {/* Free */}
          <div className="rounded-2xl border border-border bg-card p-8 text-left">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t("pricing.free")}</p>
            <div className="mt-4 flex items-baseline gap-1"><span className="font-display text-5xl font-bold text-foreground">$0</span><span className="text-muted-foreground">/{t("pricing.forever")}</span></div>
            <p className="mt-2 text-sm text-muted-foreground">{t("pricing.freeDesc")}</p>
            <ul className="mt-8 space-y-3">{freeTier.map((f) => (<li key={f.text} className="flex items-center gap-3 text-sm">{f.included ? <Check className="h-4 w-4 shrink-0 text-accent" /> : <X className="h-4 w-4 shrink-0 text-muted-foreground/40" />}<span className={f.included ? "text-foreground" : "text-muted-foreground/50"}>{f.text}</span></li>))}</ul>
            <Button variant="outline" className="mt-8 w-full" asChild><Link to={user ? "/dashboard" : "/auth"}>{user ? t("pricing.goToDashboard") : t("pricing.signUpFree")}</Link></Button>
          </div>

          {/* Pro */}
          <div className="rounded-2xl border border-border bg-card p-8 text-left">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">{t("pricing.sellerPro")}</p>
            <div className="mt-4 flex items-baseline gap-1"><span className="font-display text-5xl font-bold text-foreground">${proPrice}</span><span className="text-muted-foreground">/{t("pricing.month")}</span></div>
            {isAnnual && <p className="mt-1 text-xs text-muted-foreground"><span className="line-through">${MONTHLY_PRICES.pro}/{t("pricing.month")}</span> <span className="font-medium text-accent">{t("pricing.billed")} ${ANNUAL_PRICES.pro}/{t("pricing.year")}</span></p>}
            <p className="mt-2 text-sm text-muted-foreground">{t("pricing.proDesc")}</p>
            <ul className="mt-8 space-y-3">{proTier.map((f) => (<li key={f.text} className="flex items-center gap-3 text-sm">{f.included ? <Check className="h-4 w-4 shrink-0 text-accent" /> : <X className="h-4 w-4 shrink-0 text-muted-foreground/40" />}<span className={f.included ? "text-foreground" : "text-muted-foreground/50"}>{f.text}</span></li>))}</ul>
            {isSubscribed && currentPlan === "pro" ? <Button variant="outline" className="mt-8 w-full" asChild><Link to="/dashboard">{t("pricing.goToDashboard")} ✓</Link></Button>
            : isSubscribed && currentPlan === "unlimited" ? <Button variant="outline" className="mt-8 w-full" disabled>{t("pricing.currentPlanHigher")}</Button>
            : <Button size="lg" className="mt-8 w-full gradient-caramel text-accent-foreground hover:opacity-90" onClick={() => handleSubscribe("pro")} disabled={subscribing !== null}>
                {subscribing === "pro" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("pricing.redirecting")}</> : <>{t("pricing.subscribeNow")} <ArrowRight className="ml-2 h-4 w-4" /></>}
              </Button>}
          </div>

          {/* Unlimited */}
          <div className="relative rounded-2xl border-2 border-accent bg-card p-8 text-left shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-accent-foreground">{t("pricing.mostPopular")}</div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">{t("pricing.unlimited")}</p>
            <div className="mt-4 flex items-baseline gap-1"><span className="font-display text-5xl font-bold text-foreground">${unlimitedPrice}</span><span className="text-muted-foreground">/{t("pricing.month")}</span></div>
            {isAnnual && <p className="mt-1 text-xs text-muted-foreground"><span className="line-through">${MONTHLY_PRICES.unlimited}/{t("pricing.month")}</span> <span className="font-medium text-accent">{t("pricing.billed")} ${ANNUAL_PRICES.unlimited}/{t("pricing.year")}</span></p>}
            <p className="mt-2 text-sm text-muted-foreground">{t("pricing.unlimitedDesc")}</p>
            <ul className="mt-8 space-y-3">{unlimitedTier.map((f) => (<li key={f.text} className="flex items-center gap-3 text-sm text-foreground"><Check className="h-4 w-4 shrink-0 text-accent" />{f.text}</li>))}</ul>
            {isSubscribed && currentPlan === "unlimited" ? <Button variant="outline" className="mt-8 w-full" asChild><Link to="/dashboard">{t("pricing.goToDashboard")} ✓</Link></Button>
            : <Button size="lg" className="mt-8 w-full gradient-caramel text-accent-foreground hover:opacity-90" onClick={() => handleSubscribe("unlimited")} disabled={subscribing !== null}>
                {subscribing === "unlimited" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("pricing.redirecting")}</> : <>{t("pricing.subscribeNow")} <ArrowRight className="ml-2 h-4 w-4" /></>}
              </Button>}
          </div>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          {user ? <>{t("pricing.alreadySubscribed")} <Link to="/dashboard" className="text-accent hover:underline">{t("pricing.goToDashboard")}</Link></> : <>{t("pricing.alreadyHaveAccount")} <Link to="/auth" className="text-accent hover:underline">{t("auth.signIn")}</Link></>}
        </p>

        <div className="mx-auto mt-20 max-w-2xl text-left">
          <h2 className="text-center font-display text-2xl font-bold text-foreground">{t("pricing.faqTitle")}</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">{t("pricing.faqSubtitle")}</p>
          <Accordion type="single" collapsible className="mt-8">
            {["Cancel", "Switch", "Annual", "Listings", "Payment", "FreePlan"].map((key) => (
              <AccordionItem key={key} value={key.toLowerCase()}>
                <AccordionTrigger className="text-sm font-medium text-foreground">{t(`pricing.faq${key}`)}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{t(`pricing.faq${key}A`)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
      <Footer />
    </div>
  );
}

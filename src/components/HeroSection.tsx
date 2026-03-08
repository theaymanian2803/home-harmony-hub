import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Home, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useListingOptions } from "@/hooks/useListingOptions";
import heroBgDefault from "@/assets/hero-bg.jpg";

export default function HeroSection() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const { getValue } = useSiteContent();
  const { getByCategory } = useListingOptions();

  const propertyTypes = getByCategory("property_type");

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${heroBg})` }} />

      <div className="absolute -top-20 -left-20 h-80 w-80 shape-blob bg-accent/8 blur-2xl animate-float" />
      <div className="absolute top-1/4 -right-16 h-64 w-64 shape-blob-2 bg-caramel/10 blur-2xl animate-float-slow" />
      <div className="absolute bottom-20 left-1/4 h-48 w-48 shape-blob-3 bg-chocolate-light/10 blur-2xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="absolute top-32 right-1/4 h-16 w-16 neu-card-sm shape-blob rotate-12 animate-float-slow opacity-60" />
      <div className="absolute bottom-40 right-20 h-12 w-12 neu-card-sm rounded-full animate-float opacity-50" />
      <div className="absolute top-1/2 left-16 h-20 w-20 neu-card-sm shape-blob-2 -rotate-12 animate-float-slow opacity-40" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="animate-fade-in-up">
          <span className="neu-card-sm inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-accent">
            <span className="h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
            {getValue("hero_badge", "The #1 Marketplace for Premium Properties")}
          </span>
        </div>

        <h1 className="mt-8 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {getValue("hero_title_line1", "Find Your Perfect")}
          <span className="text-gradient-chocolate block mt-2">{getValue("hero_title_line2", "Dream Home")}</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          {getValue("hero_subtitle", "Discover premium properties curated for you.")}
        </p>

        <div className="mx-auto mt-12 max-w-3xl animate-fade-in-up neu-card-lg p-6 md:p-8" style={{ animationDelay: "0.35s" }}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-2 neu-inset rounded-xl px-4 py-3.5">
              <MapPin className="h-5 w-5 text-accent" />
              <input
                type="text"
                placeholder="Search by city, state, or ZIP…"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
              />
            </div>
            <div className="flex items-center gap-2 neu-inset rounded-xl px-4 py-3.5 md:w-44">
              <Home className="h-5 w-5 text-accent" />
              <select className="flex-1 bg-transparent text-sm outline-none text-foreground">
                <option>All Types</option>
                {propertyTypes.map((t) => (
                  <option key={t.id} value={t.value}>{t.value}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 neu-inset rounded-xl px-4 py-3.5 md:w-44">
              <DollarSign className="h-5 w-5 text-accent" />
              <select className="flex-1 bg-transparent text-sm outline-none text-foreground">
                <option>Any Price</option>
                <option>Under $300K</option>
                <option>$300K – $600K</option>
                <option>$600K – $1M</option>
                <option>$1M+</option>
              </select>
            </div>
            <Button size="lg" className="gradient-caramel text-accent-foreground hover:opacity-90 rounded-xl px-8 shadow-lg" onClick={() => navigate("/search")}>
              <Search className="mr-2 h-5 w-5" /> Search
            </Button>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          {["Verified Sellers", "Secure Transactions", "Free to Browse"].map((badge) => (
            <span key={badge} className="neu-card-sm flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-xs text-accent">✓</span>
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="neu-card-sm h-10 w-6 rounded-full p-1">
          <div className="h-2 w-full rounded-full bg-accent/50" />
        </div>
      </div>
    </section>
  );
}

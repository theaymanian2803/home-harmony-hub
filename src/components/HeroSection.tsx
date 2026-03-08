import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Home, DollarSign, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

export default function HeroSection() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-navy-dark/90" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            Over 4,800 Premium Listings
          </span>
        </div>

        <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.1] tracking-tight text-primary-foreground sm:text-6xl md:text-7xl lg:text-8xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          Find Your
          <span className="text-gradient-emerald block">Dream Home</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/70 md:text-xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          The modern marketplace connecting you with premium real estate.
          Browse verified listings, connect with trusted sellers, and move into your next chapter.
        </p>

        {/* Search bar */}
        <div
          className="mx-auto mt-10 max-w-3xl animate-fade-in-up rounded-2xl bg-card/95 p-4 shadow-2xl backdrop-blur-lg"
          style={{ animationDelay: "0.35s" }}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
              <MapPin className="h-5 w-5 text-accent" />
              <input
                type="text"
                placeholder="City, State, or Address"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 md:w-44">
              <Home className="h-5 w-5 text-accent" />
              <select className="flex-1 bg-transparent text-sm outline-none text-foreground">
                <option>All Types</option>
                <option>House</option>
                <option>Apartment</option>
                <option>Condo</option>
                <option>Villa</option>
              </select>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 md:w-44">
              <DollarSign className="h-5 w-5 text-accent" />
              <select className="flex-1 bg-transparent text-sm outline-none text-foreground">
                <option>Any Price</option>
                <option>Under $300k</option>
                <option>$300k - $600k</option>
                <option>$600k - $1M</option>
                <option>$1M+</option>
              </select>
            </div>
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-emerald-light rounded-xl px-8"
              onClick={() => navigate("/search")}
            >
              <Search className="mr-2 h-5 w-5" /> Search
            </Button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-primary-foreground/50 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <span className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-xs text-accent">✓</span>
            Verified Sellers
          </span>
          <span className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-xs text-accent">✓</span>
            Secure Transactions
          </span>
          <span className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-xs text-accent">✓</span>
            Free to Browse
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="h-10 w-6 rounded-full border-2 border-primary-foreground/30 p-1">
          <div className="h-2 w-full rounded-full bg-primary-foreground/50" />
        </div>
      </div>
    </section>
  );
}

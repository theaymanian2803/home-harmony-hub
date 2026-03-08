import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Home, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

export default function HeroSection() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");

  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="animate-fade-in font-display text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl md:text-6xl">
          Find Your Dream
          <span className="text-gradient-emerald block">Home Today</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          Browse thousands of premium listings. Your perfect property is just a search away.
        </p>

        {/* Search bar */}
        <div
          className="mx-auto mt-10 max-w-3xl animate-fade-in rounded-xl bg-card/95 p-3 shadow-xl backdrop-blur-md"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="City, State, or Address"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 md:w-40">
              <Home className="h-4 w-4 text-muted-foreground" />
              <select className="flex-1 bg-transparent text-sm outline-none text-foreground">
                <option>All Types</option>
                <option>House</option>
                <option>Apartment</option>
                <option>Condo</option>
                <option>Villa</option>
              </select>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 md:w-40">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <select className="flex-1 bg-transparent text-sm outline-none text-foreground">
                <option>Any Price</option>
                <option>Under $300k</option>
                <option>$300k - $600k</option>
                <option>$600k - $1M</option>
                <option>$1M+</option>
              </select>
            </div>
            <Button
              className="bg-accent text-accent-foreground hover:bg-emerald-light"
              onClick={() => navigate("/search")}
            >
              <Search className="mr-1 h-4 w-4" /> Search
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

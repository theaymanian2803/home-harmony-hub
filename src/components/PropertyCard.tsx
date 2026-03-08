import { Heart, Bed, Bath, Maximize } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useSaveProperty } from "@/hooks/useSaveProperty";
import type { Property } from "@/data/mockData";
import { formatPrice } from "@/data/mockData";

export default function PropertyCard({ property }: { property: Property }) {
  const { saved, toggle, isLoggedIn } = useSaveProperty(property.id);
  const { toast } = useToast();
  const navigate = useNavigate();

  return (
    <Link
      to={`/property/${property.id}`}
      className="group block overflow-hidden neu-card transition-all duration-300 hover:translate-y-[-6px]"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
        <img
          src={property.images[0]}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            if (!isLoggedIn) { navigate("/auth"); return; }
            toggle().then((nowSaved) => {
              toast({ title: nowSaved ? "Saved to profile" : "Removed from saved" });
            });
          }}
          className="absolute right-3 top-3 neu-card-sm rounded-full p-2.5 transition-all hover:scale-110"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${saved ? "fill-destructive text-destructive" : "text-muted-foreground"}`}
          />
        </button>
        {property.featured && (
          <Badge className="absolute left-3 top-3 gradient-caramel text-accent-foreground border-0 shadow-md">
            Featured
          </Badge>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cocoa-dark/80 to-transparent p-4 pt-10">
          <span className="font-display text-xl font-bold text-primary-foreground">
            {formatPrice(property.price)}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-card-foreground line-clamp-1">
          {property.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {property.city}, {property.state}
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="neu-pressed flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs">
            <Bed className="h-3.5 w-3.5 text-accent" /> {property.beds}
          </span>
          <span className="neu-pressed flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs">
            <Bath className="h-3.5 w-3.5 text-accent" /> {property.baths}
          </span>
          <span className="neu-pressed flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs">
            <Maximize className="h-3.5 w-3.5 text-accent" /> {property.sqft.toLocaleString()} ft²
          </span>
        </div>
      </div>
    </Link>
  );
}

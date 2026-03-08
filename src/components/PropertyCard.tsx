import { Heart, Bed, Bath, Maximize } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { Property } from "@/data/mockData";
import { formatPrice } from "@/data/mockData";

export default function PropertyCard({ property }: { property: Property }) {
  const [liked, setLiked] = useState(false);

  return (
    <Link
      to={`/property/${property.id}`}
      className="group block overflow-hidden rounded-lg bg-card shadow-sm transition-all duration-300 hover:shadow-lg border border-border/50"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            setLiked(!liked);
          }}
          className="absolute right-3 top-3 rounded-full bg-card/80 p-2 backdrop-blur-sm transition-colors hover:bg-card"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${liked ? "fill-destructive text-destructive" : "text-muted-foreground"}`}
          />
        </button>
        {property.featured && (
          <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground border-0">
            Featured
          </Badge>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 to-transparent p-4">
          <span className="font-display text-xl font-bold text-primary-foreground">
            {formatPrice(property.price)}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-card-foreground line-clamp-1">
          {property.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {property.city}, {property.state}
        </p>
        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Bed className="h-4 w-4" /> {property.beds}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4" /> {property.baths}
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="h-4 w-4" /> {property.sqft.toLocaleString()} ft²
          </span>
        </div>
      </div>
    </Link>
  );
}

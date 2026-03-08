import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, Map, LayoutGrid, Columns2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import SearchMapView from "@/components/SearchMapView";
import { properties as mockProperties, type Property } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";

const allAmenities = ["Pool", "Garden", "Garage", "Fireplace", "Smart Home", "Terrace", "Gym", "Concierge"];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mapView, setMapView] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 4000000]);
  const [beds, setBeds] = useState(0);
  const [baths, setBaths] = useState(0);
  const [selectedType, setSelectedType] = useState(() => {
    const t = searchParams.get("type");
    return t ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : "";
  });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>(mockProperties);

  // Sync type filter with URL query params
  useEffect(() => {
    const t = searchParams.get("type");
    setSelectedType(t ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : "");
  }, [searchParams]);

  useEffect(() => {
    const fetchDbProperties = async () => {
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "active");

      if (data && data.length > 0) {
        const dbProps: Property[] = data.map((d) => ({
          id: d.id,
          title: d.title,
          description: d.description || "",
          price: d.price,
          location: d.location || "",
          city: d.city || "",
          state: d.state || "",
          beds: d.beds || 0,
          baths: d.baths || 0,
          sqft: d.sqft || 0,
          type: (d.type as Property["type"]) || "House",
          amenities: d.amenities || [],
          images: d.images && d.images.length > 0 ? d.images : ["/placeholder.svg"],
          featured: d.featured || false,
          latitude: d.latitude ?? undefined,
          longitude: d.longitude ?? undefined,
          sellerId: d.user_id,
          sellerName: "Owner",
          createdAt: new Date(d.created_at).toLocaleDateString(),
          views: d.views || 0,
        }));
        // Merge: db properties + mock properties (avoid duplicates by id)
        const dbIds = new Set(dbProps.map((p) => p.id));
        const combined = [...dbProps, ...mockProperties.filter((p) => !dbIds.has(p.id))];
        setAllProperties(combined);
      }
    };
    fetchDbProperties();
  }, []);

  const filtered = useMemo(() => {
    return allProperties.filter((p) => {
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (beds > 0 && p.beds < beds) return false;
      if (baths > 0 && p.baths < baths) return false;
      if (selectedType && p.type !== selectedType) return false;
      if (selectedAmenities.length > 0 && !selectedAmenities.every((a) => p.amenities.includes(a))) return false;
      return true;
    });
  }, [allProperties, priceRange, beds, baths, selectedType, selectedAmenities]);

  const toggleAmenity = (a: string) =>
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-foreground">Price Range</label>
        <Slider
          min={0}
          max={4000000}
          step={50000}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mt-2"
        />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>${(priceRange[0] / 1000).toFixed(0)}k</span>
          <span>${(priceRange[1] / 1000000).toFixed(1)}M</span>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-foreground">Bedrooms (min)</label>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setBeds(n)}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                beds === n
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:border-accent"
              }`}
            >
              {n === 0 ? "Any" : `${n}+`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-foreground">Bathrooms (min)</label>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setBaths(n)}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                baths === n
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:border-accent"
              }`}
            >
              {n === 0 ? "Any" : `${n}+`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-foreground">Property Type</label>
        <div className="flex flex-wrap gap-2">
          {["", "House", "Apartment", "Condo", "Townhouse", "Villa"].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                selectedType === t
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:border-accent"
              }`}
            >
              {t || "All"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-foreground">Amenities</label>
        <div className="grid grid-cols-2 gap-2">
          {allAmenities.map((a) => (
            <label key={a} className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
              <Checkbox
                checked={selectedAmenities.includes(a)}
                onCheckedChange={() => toggleAmenity(a)}
              />
              {a}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pb-16 pt-24">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Browse Properties</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} properties found</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <SlidersHorizontal className="mr-1 h-4 w-4" />
              Filters
            </Button>
            <Button
              variant={mapView ? "default" : "outline"}
              size="sm"
              onClick={() => setMapView(!mapView)}
              className={mapView ? "gradient-caramel text-accent-foreground" : ""}
            >
              {mapView ? (
                <><LayoutGrid className="mr-1 h-4 w-4" /> Grid View</>
              ) : (
                <><Map className="mr-1 h-4 w-4" /> Map View</>
              )}
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden w-64 min-w-[16rem] max-w-[16rem] shrink-0 md:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-lg border border-border bg-card p-5">
              <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Filters</h3>
              <FilterPanel />
            </div>
          </aside>

          {filtersOpen && (
            <div className="fixed inset-0 z-50 bg-foreground/50 md:hidden" onClick={() => setFiltersOpen(false)}>
              <div
                className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-card p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold">Filters</h3>
                  <button onClick={() => setFiltersOpen(false)}>
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
                <FilterPanel />
              </div>
            </div>
          )}

          <div className="flex-1">
            {mapView ? (
              <SearchMapView properties={filtered} />
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">
                No properties match your filters. Try adjusting your criteria.
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

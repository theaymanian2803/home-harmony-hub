import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, Map, LayoutGrid, Columns2, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import SearchMapView from "@/components/SearchMapView";
import SavedSearches, { type SearchFilters } from "@/components/SavedSearches";
import { properties as mockProperties, type Property } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

const allAmenities = ["Pool", "Garden", "Garage", "Fireplace", "Smart Home", "Terrace", "Gym", "Concierge"];

export default function SearchPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "map" | "split">("grid");
  const [priceSort, setPriceSort] = useState<"none" | "asc" | "desc">("none");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [beds, setBeds] = useState(0);
  const [baths, setBaths] = useState(0);
  const [selectedType, setSelectedType] = useState(() => {
    const tp = searchParams.get("type");
    return tp ? tp.charAt(0).toUpperCase() + tp.slice(1).toLowerCase() : "";
  });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>(mockProperties);

  useEffect(() => {
    const tp = searchParams.get("type");
    setSelectedType(tp ? tp.charAt(0).toUpperCase() + tp.slice(1).toLowerCase() : "");
  }, [searchParams]);

  useEffect(() => {
    const fetchDbProperties = async () => {
      const { data } = await supabase.from("properties").select("*").eq("status", "active");
      if (data && data.length > 0) {
        const dbProps: Property[] = data.map((d) => ({
          id: d.id, title: d.title, description: d.description || "", price: d.price,
          location: d.location || "", city: d.city || "", state: d.state || "",
          beds: d.beds || 0, baths: d.baths || 0, sqft: d.sqft || 0,
          type: (d.type as Property["type"]) || "House", amenities: d.amenities || [],
          images: d.images && d.images.length > 0 ? d.images : ["/placeholder.svg"],
          featured: d.featured || false, latitude: d.latitude ?? undefined,
          longitude: d.longitude ?? undefined, sellerId: d.user_id, sellerName: "Owner",
          createdAt: new Date(d.created_at).toLocaleDateString(), views: d.views || 0,
        }));
        const dbIds = new Set(dbProps.map((p) => p.id));
        setAllProperties([...dbProps, ...mockProperties.filter((p) => !dbIds.has(p.id))]);
      }
    };
    fetchDbProperties();
  }, []);

  const filtered = useMemo(() => {
    const min = minPrice ? Number(minPrice) : 0;
    const max = maxPrice ? Number(maxPrice) : Infinity;
    const result = allProperties.filter((p) => {
      if (p.price < min || p.price > max) return false;
      if (beds > 0 && p.beds < beds) return false;
      if (baths > 0 && p.baths < baths) return false;
      if (selectedType && p.type !== selectedType) return false;
      if (selectedAmenities.length > 0 && !selectedAmenities.every((a) => p.amenities.includes(a))) return false;
      return true;
    });
    if (priceSort === "asc") result.sort((a, b) => a.price - b.price);
    if (priceSort === "desc") result.sort((a, b) => b.price - a.price);
    return result;
  }, [allProperties, priceSort, minPrice, maxPrice, beds, baths, selectedType, selectedAmenities]);

  const toggleAmenity = (a: string) => setSelectedAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);

  const clearAllFilters = () => {
    setPriceSort("none"); setMinPrice(""); setMaxPrice(""); setBeds(0); setBaths(0); setSelectedType(""); setSelectedAmenities([]);
  };

  const hasActiveFilters = priceSort !== "none" || minPrice || maxPrice || beds > 0 || baths > 0 || selectedType || selectedAmenities.length > 0;
  const currentFilters: SearchFilters = { priceSort, minPrice, maxPrice, beds, baths, selectedType, selectedAmenities };

  const applyFilters = useCallback((f: SearchFilters) => {
    setPriceSort(f.priceSort); setMinPrice(f.minPrice); setMaxPrice(f.maxPrice);
    setBeds(f.beds); setBaths(f.baths); setSelectedType(f.selectedType); setSelectedAmenities(f.selectedAmenities);
  }, []);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-foreground">{t("search.sortByPrice")}</label>
        <div className="flex gap-2">
          {([
            { value: "none" as const, label: t("search.default") },
            { value: "asc" as const, label: t("search.lowToHigh") },
            { value: "desc" as const, label: t("search.highToLow") },
          ]).map(({ value, label }) => (
            <button key={value} onClick={() => setPriceSort(value)}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${priceSort === value ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:border-accent"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-foreground">{t("search.priceRange")}</label>
        <div className="flex items-center gap-2">
          <Input type="number" placeholder={t("search.min")} value={minPrice} onChange={(e) => setMinPrice(e.target.value.slice(0, 10))} min={0} className="h-9 text-sm" />
          <span className="text-muted-foreground">–</span>
          <Input type="number" placeholder={t("search.max")} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value.slice(0, 10))} min={0} className="h-9 text-sm" />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-foreground">{t("search.bedroomsMin")}</label>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setBeds(n)}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${beds === n ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:border-accent"}`}>
              {n === 0 ? t("search.any") : `${n}+`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-foreground">{t("search.bathroomsMin")}</label>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((n) => (
            <button key={n} onClick={() => setBaths(n)}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${baths === n ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:border-accent"}`}>
              {n === 0 ? t("search.any") : `${n}+`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-foreground">{t("search.propertyType")}</label>
        <div className="flex flex-wrap gap-2">
          {["", "House", "Apartment", "Condo", "Townhouse", "Villa"].map((tp) => (
            <button key={tp} onClick={() => setSelectedType(tp)}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${selectedType === tp ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:border-accent"}`}>
              {tp || t("search.all")}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-foreground">{t("search.amenities")}</label>
        <div className="grid grid-cols-2 gap-2">
          {allAmenities.map((a) => (
            <label key={a} className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
              <Checkbox checked={selectedAmenities.includes(a)} onCheckedChange={() => toggleAmenity(a)} />
              {a}
            </label>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearAllFilters}
          className="w-full mt-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive">
          <X className="mr-1 h-4 w-4" /> {t("search.clearAllFilters")}
        </Button>
      )}

      <div className="border-t border-border pt-4">
        <SavedSearches currentFilters={currentFilters} onApply={applyFilters} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pb-16 pt-24">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">{t("search.title")}</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} {t("search.propertiesFound")}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="md:hidden" onClick={() => setFiltersOpen((o) => !o)}>
              <SlidersHorizontal className="mr-1 h-4 w-4" /> {t("search.filters")}
            </Button>
            {([
              { mode: "grid" as const, icon: LayoutGrid, label: t("search.grid") },
              { mode: "split" as const, icon: Columns2, label: t("search.split") },
              { mode: "map" as const, icon: Map, label: t("search.map") },
            ]).map(({ mode, icon: Icon, label }) => (
              <Button key={mode} variant={viewMode === mode ? "default" : "outline"} size="sm" onClick={() => setViewMode(mode)}
                className={viewMode === mode ? "gradient-caramel text-accent-foreground" : ""}>
                <Icon className="mr-1 h-4 w-4" /> {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-8">
          {sidebarOpen && (
            <aside className="hidden w-80 min-w-[20rem] max-w-[20rem] shrink-0 transition-all duration-300 md:block">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-lg border border-border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-foreground">{t("search.filters")}</h3>
                  <button onClick={() => setSidebarOpen(false)} className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Hide filters">
                    <PanelLeftClose className="h-4 w-4" />
                  </button>
                </div>
                <FilterPanel />
              </div>
            </aside>
          )}
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)}
              className="hidden md:flex sticky top-24 h-fit items-center gap-1 rounded-md border border-border bg-card px-2 py-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Show filters">
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          )}

          {filtersOpen && (
            <div className="fixed inset-0 z-50 bg-foreground/50 md:hidden" onClick={() => setFiltersOpen(false)}>
              <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-card p-6" onClick={(e) => e.stopPropagation()}>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold">{t("search.filters")}</h3>
                  <button onClick={() => setFiltersOpen(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
                </div>
                <FilterPanel />
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            {viewMode === "map" ? (
              <SearchMapView properties={filtered} />
            ) : viewMode === "split" ? (
              <div className="flex flex-col gap-4 md:flex-row md:h-[calc(100vh-14rem)] md:min-h-[500px]">
                <div className="md:w-1/2 md:overflow-y-auto md:pr-2">
                  {filtered.length === 0 ? (
                    <div className="py-20 text-center text-muted-foreground">{t("search.noProperties")}</div>
                  ) : (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                      {filtered.map((p) => (<PropertyCard key={p.id} property={p} />))}
                    </div>
                  )}
                </div>
                <div className="h-[400px] md:h-auto md:w-1/2 md:min-w-0">
                  <SearchMapView properties={filtered} />
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">{t("search.noPropertiesTry")}</div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p) => (<PropertyCard key={p.id} property={p} />))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

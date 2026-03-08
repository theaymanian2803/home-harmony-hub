import { useState, useRef } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { useListingOptions } from "@/hooks/useListingOptions";

export interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  lot_size: number;
  city: string;
  state: string;
  zip_code: string;
  location: string;
  neighborhood: string;
  latitude: number | null;
  longitude: number | null;
  type: string;
  property_style: string;
  year_built: number | null;
  parking: number;
  stories: number;
  heating: string;
  cooling: string;
  flooring: string;
  roof: string;
  hoa_fee: number;
  amenities: string[];
  images: string[];
}

interface PropertyFormProps {
  userId: string;
  initialData?: Partial<PropertyFormData>;
  onSubmit: (data: PropertyFormData) => Promise<void>;
  submitLabel: string;
}

export default function PropertyForm({ userId, initialData, onSubmit, submitLabel }: PropertyFormProps) {
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [submitting, setSubmitting] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialData?.amenities || []);
  const { getByCategory, loading: optionsLoading } = useListingOptions();
  const latRef = useRef<HTMLInputElement>(null);
  const lngRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLInputElement>(null);
  const zipRef = useRef<HTMLInputElement>(null);
  const neighborhoodRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleAddressSelect = (s: any) => {
    const addr = s.address || {};
    if (cityRef.current) cityRef.current.value = addr.city || addr.town || addr.village || "";
    if (stateRef.current) stateRef.current.value = addr.state || "";
    if (zipRef.current) zipRef.current.value = addr.postcode || "";
    if (neighborhoodRef.current) neighborhoodRef.current.value = addr.neighbourhood || addr.suburb || "";
    if (latRef.current) latRef.current.value = parseFloat(s.lat).toFixed(6);
    if (lngRef.current) lngRef.current.value = parseFloat(s.lon).toFixed(6);
    toast.success("Address selected — fields auto-filled!");
  };

  const handleGeocode = async () => {
    if (!formRef.current) return;
    const f = new FormData(formRef.current);
    const street = (f.get("location") as string) || "";
    const city = (f.get("city") as string) || "";
    const state = (f.get("state") as string) || "";
    const zip = (f.get("zip_code") as string) || "";

    const query = [street, city, state, zip].filter(Boolean).join(", ");
    if (!query.trim()) {
      toast.error("Enter an address, city, or state first");
      return;
    }

    setGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        if (latRef.current) latRef.current.value = parseFloat(lat).toFixed(6);
        if (lngRef.current) lngRef.current.value = parseFloat(lon).toFixed(6);
        toast.success("Coordinates found and filled in!");
      } else {
        toast.error("No results found. Try a more specific address.");
      }
    } catch {
      toast.error("Geocoding failed. Please try again.");
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const f = new FormData(e.currentTarget);
    const str = (name: string) => (f.get(name) as string) || "";
    const num = (name: string) => Number(f.get(name)) || 0;
    const numOrNull = (name: string) => {
      const v = f.get(name) as string;
      return v ? Number(v) : null;
    };

    await onSubmit({
      title: str("title"),
      description: str("description"),
      price: num("price"),
      beds: num("beds"),
      baths: num("baths"),
      sqft: num("sqft"),
      lot_size: num("lot_size"),
      city: str("city"),
      state: str("state"),
      zip_code: str("zip_code"),
      location: str("location"),
      neighborhood: str("neighborhood"),
      latitude: numOrNull("latitude"),
      longitude: numOrNull("longitude"),
      type: str("type") || "House",
      property_style: str("property_style"),
      year_built: numOrNull("year_built"),
      parking: num("parking"),
      stories: num("stories"),
      heating: str("heating"),
      cooling: str("cooling"),
      flooring: str("flooring"),
      roof: str("roof"),
      hoa_fee: num("hoa_fee"),
      amenities: selectedAmenities,
      images,
    });
    setSubmitting(false);
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="mt-6 mb-3 font-display text-lg font-semibold text-foreground border-b border-border pb-2">{children}</h3>
  );

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-8 max-w-3xl space-y-2">
      {/* Basic Info */}
      <SectionTitle>Basic Information</SectionTitle>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Title *</label>
        <Input name="title" placeholder="e.g. Modern Luxury Villa" defaultValue={initialData?.title} required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Description *</label>
        <Textarea name="description" placeholder="Describe the property…" rows={4} defaultValue={initialData?.description} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Price ($) *</label>
          <Input name="price" type="number" placeholder="500000" defaultValue={initialData?.price} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Property Type</label>
          <select name="type" defaultValue={initialData?.type || "House"} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {getByCategory("property_type").map((o) => (
              <option key={o.id} value={o.value}>{o.value}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Style</label>
          <select name="property_style" defaultValue={initialData?.property_style || ""} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Select style</option>
            {getByCategory("property_style").map((o) => (
              <option key={o.id} value={o.value}>{o.value}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Specs */}
      <SectionTitle>Property Specifications</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Beds *</label>
          <Input name="beds" type="number" placeholder="3" defaultValue={initialData?.beds} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Baths *</label>
          <Input name="baths" type="number" placeholder="2" defaultValue={initialData?.baths} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Sq Ft</label>
          <Input name="sqft" type="number" placeholder="2500" defaultValue={initialData?.sqft} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Lot Size (ft²)</label>
          <Input name="lot_size" type="number" placeholder="5000" defaultValue={initialData?.lot_size} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Year Built</label>
          <Input name="year_built" type="number" placeholder="2020" defaultValue={initialData?.year_built ?? ""} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Parking Spaces</label>
          <Input name="parking" type="number" placeholder="2" defaultValue={initialData?.parking} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Stories</label>
          <Input name="stories" type="number" placeholder="2" defaultValue={initialData?.stories} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">HOA Fee ($/mo)</label>
          <Input name="hoa_fee" type="number" placeholder="0" defaultValue={initialData?.hoa_fee} />
        </div>
      </div>

      {/* Interior */}
      <SectionTitle>Interior & Exterior</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Heating</label>
          <select name="heating" defaultValue={initialData?.heating || ""} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Select heating</option>
            {getByCategory("heating").map((o) => (
              <option key={o.id} value={o.value}>{o.value}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Cooling</label>
          <select name="cooling" defaultValue={initialData?.cooling || ""} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Select cooling</option>
            {getByCategory("cooling").map((o) => (
              <option key={o.id} value={o.value}>{o.value}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Flooring</label>
          <select name="flooring" defaultValue={initialData?.flooring || ""} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Select flooring</option>
            {getByCategory("flooring").map((o) => (
              <option key={o.id} value={o.value}>{o.value}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Roof</label>
          <select name="roof" defaultValue={initialData?.roof || ""} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Select roof type</option>
            {getByCategory("roof").map((o) => (
              <option key={o.id} value={o.value}>{o.value}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Location */}
      <SectionTitle>Location</SectionTitle>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Street Address</label>
        <AddressAutocomplete
          name="location"
          placeholder="Start typing an address…"
          defaultValue={initialData?.location}
          onSelect={handleAddressSelect}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">City *</label>
          <Input ref={cityRef} name="city" placeholder="Los Angeles" defaultValue={initialData?.city} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">State *</label>
          <Input ref={stateRef} name="state" placeholder="CA" defaultValue={initialData?.state} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Zip Code</label>
          <Input ref={zipRef} name="zip_code" placeholder="90210" defaultValue={initialData?.zip_code} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Neighborhood</label>
          <Input ref={neighborhoodRef} name="neighborhood" placeholder="e.g. Downtown" defaultValue={initialData?.neighborhood} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Latitude</label>
          <Input ref={latRef} name="latitude" type="number" step="any" placeholder="34.0522" defaultValue={initialData?.latitude ?? ""} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Longitude</label>
          <Input ref={lngRef} name="longitude" type="number" step="any" placeholder="-118.2437" defaultValue={initialData?.longitude ?? ""} />
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleGeocode}
        disabled={geocoding}
        className="mt-1"
      >
        {geocoding ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <MapPin className="mr-1 h-4 w-4" />}
        {geocoding ? "Finding coordinates…" : "Auto-fill coordinates from address"}
      </Button>

      {/* Amenities */}
      <SectionTitle>Amenities & Features</SectionTitle>
      <div className="flex flex-wrap gap-3">
        {getByCategory("amenity").map((o) => (
          <label key={o.id} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <Checkbox
              checked={selectedAmenities.includes(o.value)}
              onCheckedChange={(checked) => {
                setSelectedAmenities((prev) =>
                  checked ? [...prev, o.value] : prev.filter((a) => a !== o.value)
                );
              }}
            />
            {o.value}
          </label>
        ))}
        {getByCategory("amenity").length === 0 && (
          <p className="text-sm text-muted-foreground italic">No amenities configured yet</p>
        )}
      </div>

      {/* Images */}
      <SectionTitle>Photos</SectionTitle>
      <ImageUpload userId={userId} images={images} onImagesChange={setImages} maxImages={10} />

      <div className="pt-4">
        <Button type="submit" disabled={submitting} className="gradient-caramel text-accent-foreground hover:opacity-90">
          {submitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

import { useState, useRef } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";

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
      amenities: str("amenities").split(",").map((s) => s.trim()).filter(Boolean),
      images,
    });
    setSubmitting(false);
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="mt-6 mb-3 font-display text-lg font-semibold text-foreground border-b border-border pb-2">{children}</h3>
  );

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-3xl space-y-2">
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
            {["House", "Apartment", "Condo", "Townhouse", "Villa"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Style</label>
          <Input name="property_style" placeholder="e.g. Colonial, Modern" defaultValue={initialData?.property_style} />
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
          <Input name="heating" placeholder="e.g. Central, Forced Air" defaultValue={initialData?.heating} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Cooling</label>
          <Input name="cooling" placeholder="e.g. Central AC, Mini-Split" defaultValue={initialData?.cooling} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Flooring</label>
          <Input name="flooring" placeholder="e.g. Hardwood, Tile, Carpet" defaultValue={initialData?.flooring} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Roof</label>
          <Input name="roof" placeholder="e.g. Shingle, Metal, Tile" defaultValue={initialData?.roof} />
        </div>
      </div>

      {/* Location */}
      <SectionTitle>Location</SectionTitle>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Street Address</label>
        <Input name="location" placeholder="1234 Main St" defaultValue={initialData?.location} />
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">City *</label>
          <Input name="city" placeholder="Los Angeles" defaultValue={initialData?.city} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">State *</label>
          <Input name="state" placeholder="CA" defaultValue={initialData?.state} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Zip Code</label>
          <Input name="zip_code" placeholder="90210" defaultValue={initialData?.zip_code} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Neighborhood</label>
          <Input name="neighborhood" placeholder="e.g. Downtown" defaultValue={initialData?.neighborhood} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Latitude</label>
          <Input name="latitude" type="number" step="any" placeholder="34.0522" defaultValue={initialData?.latitude ?? ""} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Longitude</label>
          <Input name="longitude" type="number" step="any" placeholder="-118.2437" defaultValue={initialData?.longitude ?? ""} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Tip: Find coordinates on Google Maps by right-clicking a location.</p>

      {/* Amenities */}
      <SectionTitle>Amenities & Features</SectionTitle>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Amenities</label>
        <Input name="amenities" placeholder="Pool, Garden, Garage, Smart Home (comma separated)" defaultValue={initialData?.amenities?.join(", ")} />
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

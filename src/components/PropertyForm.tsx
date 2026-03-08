import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";

export interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  beds: number;
  baths: number;
  city: string;
  state: string;
  amenities: string[];
  images: string[];
}

interface PropertyFormProps {
  userId: string;
  initialData?: PropertyFormData;
  onSubmit: (data: PropertyFormData) => Promise<void>;
  submitLabel: string;
}

export default function PropertyForm({ userId, initialData, onSubmit, submitLabel }: PropertyFormProps) {
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    await onSubmit({
      title: form.get("title") as string,
      description: form.get("description") as string,
      price: Number(form.get("price")),
      beds: Number(form.get("beds")),
      baths: Number(form.get("baths")),
      city: form.get("city") as string,
      state: form.get("state") as string,
      amenities: (form.get("amenities") as string)?.split(",").map((s) => s.trim()).filter(Boolean) || [],
      images,
    });
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Title</label>
        <Input name="title" placeholder="e.g. Modern Luxury Villa" defaultValue={initialData?.title} required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Description</label>
        <Textarea name="description" placeholder="Describe the property…" rows={4} defaultValue={initialData?.description} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Price ($)</label>
          <Input name="price" type="number" placeholder="500000" defaultValue={initialData?.price} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Beds</label>
          <Input name="beds" type="number" placeholder="3" defaultValue={initialData?.beds} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Baths</label>
          <Input name="baths" type="number" placeholder="2" defaultValue={initialData?.baths} required />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">City</label>
          <Input name="city" placeholder="Los Angeles" defaultValue={initialData?.city} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">State</label>
          <Input name="state" placeholder="CA" defaultValue={initialData?.state} required />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Amenities</label>
        <Input name="amenities" placeholder="Pool, Garden, Garage (comma separated)" defaultValue={initialData?.amenities?.join(", ")} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Images</label>
        <ImageUpload userId={userId} images={images} onImagesChange={setImages} maxImages={10} />
      </div>
      <Button type="submit" disabled={submitting} className="bg-accent text-accent-foreground hover:bg-emerald-light">
        {submitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}

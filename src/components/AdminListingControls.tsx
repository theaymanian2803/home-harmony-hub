import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useListingOptions, ListingOption } from "@/hooks/useListingOptions";

const CATEGORIES = [
  { key: "property_type", label: "Property Types", description: "House, Apartment, Condo, etc." },
  { key: "property_style", label: "Property Styles", description: "Colonial, Modern, Ranch, etc." },
  { key: "heating", label: "Heating Options", description: "Central, Forced Air, etc." },
  { key: "cooling", label: "Cooling Options", description: "Central AC, Mini-Split, etc." },
  { key: "flooring", label: "Flooring Types", description: "Hardwood, Tile, Carpet, etc." },
  { key: "roof", label: "Roof Types", description: "Shingle, Metal, Tile, etc." },
  { key: "amenity", label: "Amenities", description: "Pool, Garage, Smart Home, etc." },
];

export default function AdminListingControls() {
  const { toast } = useToast();
  const { options, getByCategory, refetch } = useListingOptions();
  const [newValues, setNewValues] = useState<Record<string, string>>({});
  const [adding, setAdding] = useState<string | null>(null);

  const handleAdd = async (category: string) => {
    const value = (newValues[category] || "").trim();
    if (!value) return;

    setAdding(category);
    const categoryOptions = getByCategory(category);
    const nextOrder = categoryOptions.length > 0
      ? Math.max(...categoryOptions.map((o) => o.sort_order)) + 1
      : 1;

    const { error } = await supabase
      .from("listing_options")
      .insert({ category, value, sort_order: nextOrder } as any);

    if (error) {
      toast({ title: "Error", description: error.message.includes("duplicate") ? "This option already exists" : error.message, variant: "destructive" });
    } else {
      toast({ title: "Option added", description: `"${value}" added to ${CATEGORIES.find((c) => c.key === category)?.label}` });
      setNewValues((prev) => ({ ...prev, [category]: "" }));
      await refetch();
    }
    setAdding(null);
  };

  const handleDelete = async (option: ListingOption) => {
    const { error } = await supabase
      .from("listing_options")
      .delete()
      .eq("id", option.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Option removed", description: `"${option.value}" removed`, variant: "destructive" });
      await refetch();
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-display text-xl font-bold text-foreground mb-1">Listing Form Controls</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Manage the dropdown options and choices available to sellers when creating or editing property listings.
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          {CATEGORIES.map((cat) => {
            const items = getByCategory(cat.key);
            return (
              <div key={cat.key} className="rounded-lg border border-border bg-secondary/30 p-4">
                <div className="mb-3">
                  <h3 className="font-medium text-foreground">{cat.label}</h3>
                  <p className="text-xs text-muted-foreground">{cat.description}</p>
                </div>

                <div className="mb-3 flex flex-wrap gap-1.5">
                  {items.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">No options yet</p>
                  )}
                  {items.map((item) => (
                    <Badge
                      key={item.id}
                      variant="secondary"
                      className="gap-1 pr-1 bg-background border border-border"
                    >
                      {item.value}
                      <button
                        onClick={() => handleDelete(item)}
                        className="ml-0.5 rounded-full p-0.5 hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder={`Add new ${cat.label.toLowerCase().slice(0, -1)}…`}
                    value={newValues[cat.key] || ""}
                    onChange={(e) => setNewValues((prev) => ({ ...prev, [cat.key]: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(cat.key); } }}
                    className="h-8 text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAdd(cat.key)}
                    disabled={adding === cat.key || !(newValues[cat.key] || "").trim()}
                    className="h-8 shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

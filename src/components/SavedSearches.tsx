import { useState, useEffect } from "react";
import { Bookmark, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface SearchFilters {
  priceSort: "none" | "asc" | "desc";
  minPrice: string;
  maxPrice: string;
  beds: number;
  baths: number;
  selectedType: string;
  selectedAmenities: string[];
}

interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  created_at: string;
}

interface Props {
  currentFilters: SearchFilters;
  onApply: (filters: SearchFilters) => void;
}

export default function SavedSearches({ currentFilters, onApply }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("saved_searches")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) {
        setSearches(
          data.map((d: any) => ({
            id: d.id,
            name: d.name,
            filters: d.filters as SearchFilters,
            created_at: d.created_at,
          }))
        );
      }
    };
    fetch();
  }, [user]);

  const handleSave = async () => {
    if (!user || !name.trim()) return;
    const { data, error } = await supabase
      .from("saved_searches")
      .insert({ user_id: user.id, name: name.trim(), filters: currentFilters as any })
      .select()
      .single();
    if (error) {
      toast({ title: "Error saving search", description: error.message, variant: "destructive" });
    } else if (data) {
      setSearches((prev) => [
        { id: data.id, name: data.name, filters: data.filters as unknown as SearchFilters, created_at: data.created_at },
        ...prev,
      ]);
      setName("");
      setSaving(false);
      toast({ title: "Search saved!" });
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("saved_searches").delete().eq("id", id);
    setSearches((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Search removed" });
  };

  const summarize = (f: SearchFilters) => {
    const parts: string[] = [];
    if (f.selectedType) parts.push(f.selectedType);
    if (f.beds > 0) parts.push(`${f.beds}+ bd`);
    if (f.baths > 0) parts.push(`${f.baths}+ ba`);
    if (f.minPrice || f.maxPrice) {
      const min = f.minPrice ? `$${Number(f.minPrice).toLocaleString()}` : "$0";
      const max = f.maxPrice ? `$${Number(f.maxPrice).toLocaleString()}` : "Any";
      parts.push(`${min}–${max}`);
    }
    if (f.selectedAmenities.length > 0) parts.push(`${f.selectedAmenities.length} amenities`);
    return parts.length > 0 ? parts.join(" · ") : "All properties";
  };

  if (!user) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-foreground">Saved Searches</label>
        {!saving && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-accent hover:text-accent"
            onClick={() => setSaving(true)}
          >
            <Bookmark className="mr-1 h-3 w-3" /> Save Current
          </Button>
        )}
      </div>

      {saving && (
        <div className="flex gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Search name…"
            className="h-8 text-sm"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
          <Button size="sm" className="h-8 px-2" onClick={handleSave} disabled={!name.trim()}>
            <Check className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => { setSaving(false); setName(""); }}>
            ✕
          </Button>
        </div>
      )}

      {searches.length === 0 ? (
        <p className="text-xs text-muted-foreground">No saved searches yet.</p>
      ) : (
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {searches.map((s) => (
            <div
              key={s.id}
              className="group flex items-center justify-between rounded-md border border-border px-3 py-2 hover:border-accent/50 transition-colors cursor-pointer"
              onClick={() => {
                onApply(s.filters);
                toast({ title: `Applied: ${s.name}` });
              }}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                <p className="text-xs text-muted-foreground truncate">{summarize(s.filters)}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(s.id);
                }}
                className="ml-2 shrink-0 rounded p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

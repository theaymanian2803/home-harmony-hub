import { useState, useRef } from "react";
import { Save, Plus, Trash2, Star, Eye, EyeOff, Type, BarChart3, MessageSquareQuote, Megaphone, Upload, Link as LinkIcon, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent, SiteContentItem, Testimonial } from "@/hooks/useSiteContent";

type SubTab = "hero" | "stats" | "sections" | "testimonials";

export default function AdminLandingControls() {
  const { toast } = useToast();
  const { content, testimonials, getBySection, getValue, refetch } = useSiteContent();
  const [subTab, setSubTab] = useState<SubTab>("hero");
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Testimonial form
  const [newTestimonial, setNewTestimonial] = useState({ name: "", role: "", quote: "", rating: 5, avatar: "" });

  const subTabs: { id: SubTab; label: string; icon: React.ElementType }[] = [
    { id: "hero", label: "Hero Section", icon: Type },
    { id: "stats", label: "Stats Bar", icon: BarChart3 },
    { id: "sections", label: "Section Text", icon: Megaphone },
    { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
  ];

  const handleFieldChange = (key: string, value: string) => {
    setEditedValues((prev) => ({ ...prev, [key]: value }));
  };

  const getCurrentValue = (item: SiteContentItem) => {
    return editedValues[item.key] !== undefined ? editedValues[item.key] : item.value;
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const updates = Object.entries(editedValues);
    if (updates.length === 0) {
      toast({ title: "No changes to save" });
      setSaving(false);
      return;
    }

    let hasError = false;
    for (const [key, value] of updates) {
      const { error } = await supabase
        .from("site_content")
        .update({ value, updated_at: new Date().toISOString() } as any)
        .eq("key", key);
      if (error) { hasError = true; break; }
    }

    if (hasError) {
      toast({ title: "Error saving", variant: "destructive" });
    } else {
      toast({ title: "Content saved", description: `${updates.length} field(s) updated` });
      setEditedValues({});
      await refetch();
    }
    setSaving(false);
  };

  const handleAddTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.quote) {
      toast({ title: "Name and quote are required", variant: "destructive" });
      return;
    }
    const avatar = newTestimonial.avatar || newTestimonial.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const nextOrder = testimonials.length > 0 ? Math.max(...testimonials.map((t) => t.sort_order)) + 1 : 1;

    const { error } = await supabase.from("testimonials").insert({
      ...newTestimonial,
      avatar,
      sort_order: nextOrder,
      is_active: true,
    } as any);

    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Testimonial added" });
      setNewTestimonial({ name: "", role: "", quote: "", rating: 5, avatar: "" });
      await refetch();
    }
  };

  const handleToggleTestimonial = async (t: Testimonial) => {
    await supabase.from("testimonials").update({ is_active: !t.is_active } as any).eq("id", t.id);
    await refetch();
    toast({ title: t.is_active ? "Testimonial hidden" : "Testimonial visible" });
  };

  const handleDeleteTestimonial = async (id: string) => {
    await supabase.from("testimonials").delete().eq("id", id);
    await refetch();
    toast({ title: "Testimonial deleted", variant: "destructive" });
  };

  const renderContentFields = (section: string) => {
    const items = getBySection(section);
    if (items.length === 0) return <p className="text-sm text-muted-foreground italic">No content fields for this section</p>;

    return (
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id}>
            <label className="mb-1 block text-sm font-medium text-foreground">{item.label}</label>
            {item.value.length > 80 ? (
              <Textarea
                value={getCurrentValue(item)}
                onChange={(e) => handleFieldChange(item.key, e.target.value)}
                rows={3}
                className="text-sm"
              />
            ) : (
              <Input
                value={getCurrentValue(item)}
                onChange={(e) => handleFieldChange(item.key, e.target.value)}
                className="text-sm"
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Landing Page Controls</h2>
            <p className="text-sm text-muted-foreground">Edit all text content and testimonials displayed on the homepage.</p>
          </div>
          {subTab !== "testimonials" && Object.keys(editedValues).length > 0 && (
            <Button onClick={handleSaveAll} disabled={saving} className="gradient-caramel text-accent-foreground hover:opacity-90">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving…" : `Save Changes (${Object.keys(editedValues).length})`}
            </Button>
          )}
        </div>

        {/* Sub-tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border pb-3 mb-6">
          {subTabs.map((st) => (
            <button
              key={st.id}
              onClick={() => { setSubTab(st.id); setEditedValues({}); }}
              className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                subTab === st.id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <st.icon className="h-4 w-4" /> {st.label}
            </button>
          ))}
        </div>

        {/* Hero */}
        {subTab === "hero" && (
          <div className="max-w-2xl">
            <h3 className="font-medium text-foreground mb-4">Hero Section Content</h3>
            {renderContentFields("hero")}
          </div>
        )}

        {/* Stats */}
        {subTab === "stats" && (
          <div className="max-w-2xl">
            <h3 className="font-medium text-foreground mb-4">Stats Bar Values</h3>
            <p className="text-xs text-muted-foreground mb-4">Edit the numbers and labels shown in the stats bar below the hero.</p>
            {renderContentFields("stats")}
          </div>
        )}

        {/* Sections */}
        {subTab === "sections" && (
          <div className="max-w-2xl space-y-8">
            <div>
              <h3 className="font-medium text-foreground mb-4">Why Choose Us Section</h3>
              {renderContentFields("why_choose_us")}
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-4">How It Works Section</h3>
              {renderContentFields("how_it_works")}
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-4">Call to Action Section</h3>
              {renderContentFields("cta")}
            </div>
          </div>
        )}

        {/* Testimonials */}
        {subTab === "testimonials" && (
          <div>
            <h3 className="font-medium text-foreground mb-4">Manage Testimonials</h3>

            {/* Add new */}
            <div className="rounded-lg border border-border bg-secondary/30 p-4 mb-6 max-w-2xl">
              <p className="text-sm font-medium text-foreground mb-3">Add New Testimonial</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Name *" value={newTestimonial.name} onChange={(e) => setNewTestimonial((p) => ({ ...p, name: e.target.value }))} />
                <Input placeholder="Role (e.g. Home Buyer)" value={newTestimonial.role} onChange={(e) => setNewTestimonial((p) => ({ ...p, role: e.target.value }))} />
              </div>
              <Textarea placeholder="Quote *" value={newTestimonial.quote} onChange={(e) => setNewTestimonial((p) => ({ ...p, quote: e.target.value }))} className="mt-3" rows={3} />
              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground">Rating:</label>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 cursor-pointer transition-colors ${i <= newTestimonial.rating ? "fill-accent text-accent" : "text-muted"}`}
                        onClick={() => setNewTestimonial((p) => ({ ...p, rating: i }))}
                      />
                    ))}
                  </div>
                </div>
                <Input placeholder="Avatar initials (auto)" value={newTestimonial.avatar} onChange={(e) => setNewTestimonial((p) => ({ ...p, avatar: e.target.value }))} className="w-32" />
                <Button onClick={handleAddTestimonial} size="sm" variant="outline">
                  <Plus className="mr-1 h-4 w-4" /> Add
                </Button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3">
              {testimonials.map((t) => (
                <div key={t.id} className={`rounded-lg border p-4 flex items-start gap-4 transition-colors ${t.is_active ? "border-border bg-card" : "border-border/50 bg-muted/30 opacity-60"}`}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-caramel font-display text-sm font-bold text-accent-foreground">
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground text-sm">{t.name}</span>
                      <Badge variant="secondary" className="text-xs">{t.role}</Badge>
                      {!t.is_active && <Badge variant="secondary" className="text-xs bg-muted">Hidden</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground italic line-clamp-2">"{t.quote}"</p>
                    <div className="mt-1 flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="icon" variant="ghost" onClick={() => handleToggleTestimonial(t)} title={t.is_active ? "Hide" : "Show"}>
                      {t.is_active ? <Eye className="h-4 w-4 text-muted-foreground" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteTestimonial(t.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {testimonials.length === 0 && <p className="text-sm text-muted-foreground italic">No testimonials yet</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

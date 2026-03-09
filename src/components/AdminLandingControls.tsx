import { useState, useRef } from "react";
import { Save, Plus, Trash2, Star, Eye, EyeOff, Type, BarChart3, MessageSquareQuote, Megaphone, Upload, Link as LinkIcon, ImageIcon, X, RotateCcw, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent, SiteContentItem, Testimonial } from "@/hooks/useSiteContent";

type SubTab = "navbar" | "hero" | "stats" | "sections" | "testimonials";

export default function AdminLandingControls() {
  const { toast } = useToast();
  const { content, testimonials, getBySection, getValue, refetch } = useSiteContent();
  const [subTab, setSubTab] = useState<SubTab>("navbar");
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [logoUrlInput, setLogoUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Testimonial form
  const [newTestimonial, setNewTestimonial] = useState({ name: "", role: "", quote: "", rating: 5, avatar: "" });

  const subTabs: { id: SubTab; label: string; icon: React.ElementType }[] = [
    { id: "navbar", label: "Navbar", icon: Navigation },
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

  const saveHeroBgImage = async (url: string) => {
    const { error } = await supabase
      .from("site_content")
      .update({ value: url, updated_at: new Date().toISOString() } as any)
      .eq("key", "hero_bg_image");
    if (error) toast({ title: "Error saving image", variant: "destructive" });
    else { toast({ title: "Background image updated" }); await refetch(); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please select an image file", variant: "destructive" });
      return;
    }
    setUploadingImage(true);
    const ext = file.name.split(".").pop();
    const path = `hero-bg-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("site-images").upload(path, file, { upsert: true });
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } else {
      const { data: urlData } = supabase.storage.from("site-images").getPublicUrl(path);
      await saveHeroBgImage(urlData.publicUrl);
    }
    setUploadingImage(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSetExternalUrl = async () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    await saveHeroBgImage(url);
    setImageUrlInput("");
  };

  const handleRemoveBgImage = async () => {
    await saveHeroBgImage("");
  };

  const saveLogoImage = async (url: string) => {
    const { error } = await supabase
      .from("site_content")
      .update({ value: url, updated_at: new Date().toISOString() } as any)
      .eq("key", "navbar_logo_image");
    if (error) toast({ title: "Error saving logo", variant: "destructive" });
    else { toast({ title: "Logo updated" }); await refetch(); }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please select an image file", variant: "destructive" });
      return;
    }
    setUploadingImage(true);
    const ext = file.name.split(".").pop();
    const path = `logo-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("site-images").upload(path, file, { upsert: true });
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } else {
      const { data: urlData } = supabase.storage.from("site-images").getPublicUrl(path);
      await saveLogoImage(urlData.publicUrl);
    }
    setUploadingImage(false);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const handleSetLogoUrl = async () => {
    const url = logoUrlInput.trim();
    if (!url) return;
    await saveLogoImage(url);
    setLogoUrlInput("");
  };

  const handleRemoveLogo = async () => {
    await saveLogoImage("");
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
          {subTab !== "testimonials" && (
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={saving || Object.keys(editedValues).length === 0}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Discard
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You have {Object.keys(editedValues).length} unsaved change(s). This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Editing</AlertDialogCancel>
                    <AlertDialogAction onClick={() => setEditedValues({})} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Discard Changes
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button onClick={handleSaveAll} disabled={saving || Object.keys(editedValues).length === 0} className="gradient-caramel text-accent-foreground hover:opacity-90">
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving…" : `Save Changes${Object.keys(editedValues).length > 0 ? ` (${Object.keys(editedValues).length})` : ""}`}
              </Button>
            </div>
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

        {/* Navbar */}
        {subTab === "navbar" && (
          <div className="max-w-2xl space-y-8">
            {/* Logo */}
            <div>
              <h3 className="font-medium text-foreground mb-4">Site Logo</h3>
              <div className="rounded-lg border border-border bg-secondary/30 p-4">
                {getValue("navbar_logo_image") ? (
                  <div className="mb-4">
                    <div className="relative inline-block rounded-lg overflow-hidden border border-border bg-background p-3">
                      <img
                        src={getValue("navbar_logo_image")}
                        alt="Logo preview"
                        className="h-12 object-contain"
                      />
                      <button
                        onClick={handleRemoveLogo}
                        className="absolute top-1 right-1 rounded-full bg-destructive p-1 text-destructive-foreground hover:opacity-90 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground truncate">{getValue("navbar_logo_image")}</p>
                  </div>
                ) : (
                  <div className="mb-4 flex h-20 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-6 w-6 text-muted-foreground/50" />
                      <p className="mt-1 text-xs text-muted-foreground">No logo set (using default icon)</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Upload Logo</p>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={uploadingImage}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {uploadingImage ? "Uploading…" : "Choose File"}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs text-muted-foreground">OR</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">External Image URL</p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://example.com/logo.png"
                        value={logoUrlInput}
                        onChange={(e) => setLogoUrlInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSetLogoUrl(); }}
                        className="text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSetLogoUrl}
                        disabled={!logoUrlInput.trim()}
                        className="shrink-0"
                      >
                        <LinkIcon className="mr-1 h-4 w-4" /> Set URL
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navbar text fields */}
            <div>
              <h3 className="font-medium text-foreground mb-4">Navbar Content</h3>
              {renderContentFields("navbar")}
            </div>
          </div>
        )}

        {/* Hero */}
        {subTab === "hero" && (
          <div className="max-w-2xl space-y-8">
            {/* Background Image */}
            <div>
              <h3 className="font-medium text-foreground mb-4">Hero Background Image</h3>
              <div className="rounded-lg border border-border bg-secondary/30 p-4">
                {getValue("hero_bg_image") ? (
                  <div className="mb-4">
                    <div className="relative rounded-lg overflow-hidden border border-border">
                      <img
                        src={getValue("hero_bg_image")}
                        alt="Hero background preview"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={handleRemoveBgImage}
                        className="absolute top-2 right-2 rounded-full bg-destructive p-1.5 text-destructive-foreground hover:opacity-90 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground truncate">{getValue("hero_bg_image")}</p>
                  </div>
                ) : (
                  <div className="mb-4 flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground/50" />
                      <p className="mt-1 text-xs text-muted-foreground">No background image set (using default)</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Upload Image</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {uploadingImage ? "Uploading…" : "Choose File"}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs text-muted-foreground">OR</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">External Image URL</p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://example.com/image.jpg"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSetExternalUrl(); }}
                        className="text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSetExternalUrl}
                        disabled={!imageUrlInput.trim()}
                        className="shrink-0"
                      >
                        <LinkIcon className="mr-1 h-4 w-4" /> Set URL
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div>
              <h3 className="font-medium text-foreground mb-4">Hero Section Content</h3>
              {renderContentFields("hero")}
            </div>
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

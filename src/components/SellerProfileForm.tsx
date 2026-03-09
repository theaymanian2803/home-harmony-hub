import { useState, useEffect } from "react";
import { Save, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SellerProfile {
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  bio: string;
  avatar_url: string;
  website: string;
  show_phone: boolean;
  show_email: boolean;
}

export default function SellerProfileForm({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<SellerProfile>({
    full_name: "", email: "", phone: "", company_name: "", bio: "",
    avatar_url: "", website: "", show_phone: true, show_email: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, email, phone, company_name, bio, avatar_url, website, show_phone, show_email")
        .eq("id", userId)
        .single();
      if (data) {
        setProfile({
          full_name: data.full_name || "",
          email: data.email || "",
          phone: (data as any).phone || "",
          company_name: (data as any).company_name || "",
          bio: (data as any).bio || "",
          avatar_url: (data as any).avatar_url || "",
          website: (data as any).website || "",
          show_phone: (data as any).show_phone ?? true,
          show_email: (data as any).show_email ?? true,
        });
      }
      setLoading(false);
    };
    fetch();
  }, [userId]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2MB"); return; }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `avatars/${userId}.${ext}`;
    const { error } = await supabase.storage.from("site-images").upload(path, file, { upsert: true });
    if (error) { toast.error("Upload failed"); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("site-images").getPublicUrl(path);
    setProfile((p) => ({ ...p, avatar_url: urlData.publicUrl }));
    setUploading(false);
    toast.success("Avatar uploaded!");
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name || null,
      phone: profile.phone || null,
      company_name: profile.company_name || null,
      bio: profile.bio || null,
      avatar_url: profile.avatar_url || null,
      website: profile.website || null,
      show_phone: profile.show_phone,
      show_email: profile.show_email,
    } as any).eq("id", userId);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile saved successfully!");
  };

  if (loading) return <p className="py-8 text-center text-muted-foreground">Loading profile…</p>;

  return (
    <div className="mt-8 max-w-2xl space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">Your Seller Profile</h3>
        <p className="text-sm text-muted-foreground mb-6">This information is shown to potential buyers on your listings.</p>

        {/* Avatar */}
        <div className="mb-6 flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-muted-foreground">{profile.full_name?.[0]?.toUpperCase() || "?"}</span>
            )}
          </div>
          <div>
            <label className="cursor-pointer">
              <Button variant="outline" size="sm" asChild disabled={uploading}>
                <span>
                  {uploading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Upload className="mr-1 h-4 w-4" />}
                  {uploading ? "Uploading…" : "Upload Photo"}
                </span>
              </Button>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-foreground">Full Name *</Label>
              <Input value={profile.full_name} onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))} placeholder="John Doe" />
            </div>
            <div>
              <Label className="text-foreground">Company / Agency</Label>
              <Input value={profile.company_name} onChange={(e) => setProfile((p) => ({ ...p, company_name: e.target.value }))} placeholder="ABC Realty" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-foreground">Phone Number</Label>
              <Input value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} placeholder="+1 (555) 123-4567" />
            </div>
            <div>
              <Label className="text-foreground">Website</Label>
              <Input value={profile.website} onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))} placeholder="https://yourwebsite.com" />
            </div>
          </div>

          <div>
            <Label className="text-foreground">Email</Label>
            <Input value={profile.email} disabled className="bg-muted" />
            <p className="mt-1 text-xs text-muted-foreground">Email is managed through your account settings</p>
          </div>

          <div>
            <Label className="text-foreground">About / Bio</Label>
            <Textarea
              value={profile.bio}
              onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
              placeholder="Tell buyers about yourself, your experience, specialties…"
              rows={4}
            />
          </div>

          <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Contact Visibility</h4>
            <p className="text-xs text-muted-foreground">Choose what buyers can see on your listings</p>
            <div className="flex items-center justify-between">
              <Label className="text-sm text-foreground">Show phone number</Label>
              <Switch checked={profile.show_phone} onCheckedChange={(v) => setProfile((p) => ({ ...p, show_phone: v }))} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm text-foreground">Show email address</Label>
              <Switch checked={profile.show_email} onCheckedChange={(v) => setProfile((p) => ({ ...p, show_email: v }))} />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={handleSave} disabled={saving} className="gradient-caramel text-accent-foreground hover:opacity-90">
            {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
            {saving ? "Saving…" : "Save Profile"}
          </Button>
        </div>
      </div>
    </div>
  );
}

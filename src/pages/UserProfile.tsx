import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Heart, List, CreditCard, Edit, Save, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription, getListingLimit } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { properties as mockProperties, type Property, formatPrice } from "@/data/mockData";
import { useTranslation } from "react-i18next";

type Tab = "profile" | "saved" | "listings" | "subscription";

interface ProfileData { full_name: string | null; email: string | null; }

export default function UserProfile() {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { isSubscribed, details, cancelSubscription } = useSubscription();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [tab, setTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<ProfileData>({ full_name: null, email: null });
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [myListings, setMyListings] = useState<Property[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [loadingListings, setLoadingListings] = useState(true);

  useEffect(() => { if (!authLoading && !user) navigate("/auth"); }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase.from("profiles").select("full_name, email").eq("id", user.id).single();
      if (data) setProfile(data);
      setLoadingProfile(false);
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const fetchSaved = async () => {
      const { data } = await supabase.from("saved_properties").select("property_id, properties(*)").eq("user_id", user.id);
      if (data && data.length > 0) {
        const props: Property[] = data.filter((d: any) => d.properties).map((d: any) => {
          const p = d.properties;
          return { id: p.id, title: p.title, description: p.description || "", price: p.price, location: p.location || "", city: p.city || "", state: p.state || "", beds: p.beds || 0, baths: p.baths || 0, sqft: p.sqft || 0, type: (p.type as Property["type"]) || "House", amenities: p.amenities || [], images: p.images && p.images.length > 0 ? p.images : ["/placeholder.svg"], featured: p.featured || false, latitude: p.latitude ?? undefined, longitude: p.longitude ?? undefined, sellerId: p.user_id, sellerName: "Owner", createdAt: new Date(p.created_at).toLocaleDateString(), views: p.views || 0 };
        });
        setSavedProperties(props);
      }
      setLoadingSaved(false);
    };
    fetchSaved();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const fetchListings = async () => {
      const { data } = await supabase.from("properties").select("*").eq("user_id", user.id);
      if (data && data.length > 0) {
        const props: Property[] = data.map((p) => ({ id: p.id, title: p.title, description: p.description || "", price: p.price, location: p.location || "", city: p.city || "", state: p.state || "", beds: p.beds || 0, baths: p.baths || 0, sqft: p.sqft || 0, type: (p.type as Property["type"]) || "House", amenities: p.amenities || [], images: p.images && p.images.length > 0 ? p.images : ["/placeholder.svg"], featured: p.featured || false, latitude: p.latitude ?? undefined, longitude: p.longitude ?? undefined, sellerId: p.user_id, sellerName: "Owner", createdAt: new Date(p.created_at).toLocaleDateString(), views: p.views || 0, status: p.status || "active" }));
        setMyListings(props);
      }
      setLoadingListings(false);
    };
    fetchListings();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ full_name: editName }).eq("id", user.id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else { setProfile((prev) => ({ ...prev, full_name: editName })); setEditingProfile(false); toast({ title: t("profile.profileUpdated") }); }
  };

  const handleUnsave = async (propertyId: string) => {
    if (!user) return;
    await supabase.from("saved_properties").delete().eq("user_id", user.id).eq("property_id", propertyId);
    setSavedProperties((prev) => prev.filter((p) => p.id !== propertyId));
    toast({ title: t("profile.removedFromSaved") });
  };

  if (authLoading || !user) return null;

  const currentPlan = details?.plan || "free";
  const listingLimit = getListingLimit(currentPlan);

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: t("profile.myProfile"), icon: User },
    { id: "saved", label: t("profile.savedProperties"), icon: Heart },
    { id: "listings", label: t("profile.myListings"), icon: List },
    { id: "subscription", label: t("profile.planBilling"), icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pb-16 pt-24">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent"><User className="h-8 w-8" /></div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">{profile.full_name || t("profile.myAccount")}</h1>
            <p className="text-sm text-muted-foreground">{profile.email || user.email}</p>
          </div>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto border-b border-border pb-2">
          {tabs.map((tb) => (
            <button key={tb.id} onClick={() => setTab(tb.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === tb.id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"}`}>
              <tb.icon className="h-4 w-4" /> {tb.label}
            </button>
          ))}
        </div>

        {tab === "profile" && (
          <div className="max-w-2xl space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-foreground">{t("profile.personalInfo")}</h2>
                {!editingProfile && (
                  <Button variant="outline" size="sm" onClick={() => { setEditName(profile.full_name || ""); setEditingProfile(true); }}>
                    <Edit className="mr-1 h-4 w-4" /> {t("profile.edit")}
                  </Button>
                )}
              </div>
              {editingProfile ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">{t("profile.fullName")}</label>
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveProfile}><Save className="mr-1 h-4 w-4" /> {t("profile.save")}</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingProfile(false)}><X className="mr-1 h-4 w-4" /> {t("profile.cancel")}</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div><p className="text-xs text-muted-foreground">{t("profile.fullName")}</p><p className="text-sm font-medium text-foreground">{profile.full_name || t("profile.notSet")}</p></div>
                  <div><p className="text-xs text-muted-foreground">{t("profile.email")}</p><p className="text-sm font-medium text-foreground">{profile.email || user.email}</p></div>
                  <div><p className="text-xs text-muted-foreground">{t("profile.memberSince")}</p><p className="text-sm font-medium text-foreground">{new Date(user.created_at).toLocaleDateString()}</p></div>
                </div>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-card p-4 text-center"><p className="text-2xl font-bold text-foreground font-display">{myListings.length}</p><p className="text-sm text-muted-foreground">{t("profile.myListings")}</p></div>
              <div className="rounded-lg border border-border bg-card p-4 text-center"><p className="text-2xl font-bold text-foreground font-display">{savedProperties.length}</p><p className="text-sm text-muted-foreground">{t("profile.savedProperties")}</p></div>
              <div className="rounded-lg border border-border bg-card p-4 text-center"><p className="text-2xl font-bold text-foreground font-display capitalize">{currentPlan}</p><p className="text-sm text-muted-foreground">{t("profile.currentPlan")}</p></div>
            </div>
          </div>
        )}

        {tab === "saved" && (
          <div>
            {loadingSaved ? (<p className="py-12 text-center text-muted-foreground">{t("profile.loadingSaved")}</p>
            ) : savedProperties.length === 0 ? (
              <div className="py-16 text-center">
                <Heart className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
                <p className="text-lg font-semibold text-foreground">{t("profile.noSavedYet")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("profile.noSavedDesc")}</p>
                <Button className="mt-4 gradient-caramel text-accent-foreground" asChild><Link to="/search">{t("profile.browseProperties")}</Link></Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {savedProperties.map((p) => (
                  <div key={p.id} className="relative">
                    <PropertyCard property={p} />
                    <button onClick={() => handleUnsave(p.id)} className="absolute right-3 top-3 z-10 rounded-full bg-background/90 p-1.5 text-destructive shadow-md hover:bg-destructive hover:text-destructive-foreground transition-colors" title="Remove"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "listings" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{myListings.length}/{listingLimit === Infinity ? "∞" : listingLimit} {t("profile.listingsUsed")}</p>
              <Button size="sm" className="gradient-caramel text-accent-foreground" asChild><Link to="/dashboard">{t("profile.goToSellerDashboard")}</Link></Button>
            </div>
            {loadingListings ? (<p className="py-12 text-center text-muted-foreground">{t("profile.loadingListings")}</p>
            ) : myListings.length === 0 ? (
              <div className="py-16 text-center">
                <List className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
                <p className="text-lg font-semibold text-foreground">{t("profile.noListingsYet")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("profile.noListingsDesc")}</p>
                <Button className="mt-4 gradient-caramel text-accent-foreground" asChild><Link to="/dashboard">{t("profile.createListing")}</Link></Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {myListings.map((p) => (
                  <div key={p.id} className="relative">
                    <PropertyCard property={p} />
                    <Badge className={`absolute left-3 top-3 z-10 ${(p as any).status === "active" ? "bg-accent/90 text-accent-foreground" : (p as any).status === "pending" ? "bg-yellow-500/90 text-white" : "bg-destructive/90 text-destructive-foreground"}`}>{(p as any).status || "active"}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "subscription" && (
          <div className="max-w-2xl">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 font-display text-lg font-semibold text-foreground">{t("profile.currentPlan")}</h2>
              <div className="mb-4 flex items-center gap-3">
                <Badge className="bg-accent/10 text-accent capitalize text-base px-3 py-1">{currentPlan}</Badge>
                {isSubscribed && details?.status === "active" && <span className="text-sm text-muted-foreground">{t("profile.active")}</span>}
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{t("profile.listingLimit")}: {listingLimit === Infinity ? t("pricing.unlimited") : listingLimit}</p>
                <p>{t("profile.listingsUsedLabel")}: {myListings.length}</p>
                {details?.currentPeriodEnd && <p>{t("profile.nextBilling")}: {new Date(details.currentPeriodEnd).toLocaleDateString()}</p>}
              </div>
              <div className="mt-6 flex gap-3">
                <Button className="gradient-caramel text-accent-foreground" asChild>
                  <Link to="/pricing">{currentPlan === "free" ? t("profile.upgradePlan") : t("profile.changePlan")}</Link>
                </Button>
                {isSubscribed && details?.status === "active" && <Button variant="outline" onClick={cancelSubscription}>{t("profile.cancelSubscription")}</Button>}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

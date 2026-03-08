import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Heart, List, CreditCard, Settings, Edit, Save, X, Trash2, Eye,
} from "lucide-react";
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

type Tab = "profile" | "saved" | "listings" | "subscription";

interface ProfileData {
  full_name: string | null;
  email: string | null;
}

export default function UserProfile() {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { isSubscribed, details, cancelSubscription } = useSubscription();
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<ProfileData>({ full_name: null, email: null });
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [myListings, setMyListings] = useState<Property[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [loadingListings, setLoadingListings] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  // Fetch profile
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .single();
      if (data) setProfile(data);
      setLoadingProfile(false);
    };
    fetchProfile();
  }, [user]);

  // Fetch saved properties
  useEffect(() => {
    if (!user) return;
    const fetchSaved = async () => {
      const { data } = await supabase
        .from("saved_properties")
        .select("property_id, properties(*)")
        .eq("user_id", user.id);

      if (data && data.length > 0) {
        const props: Property[] = data
          .filter((d: any) => d.properties)
          .map((d: any) => {
            const p = d.properties;
            return {
              id: p.id,
              title: p.title,
              description: p.description || "",
              price: p.price,
              location: p.location || "",
              city: p.city || "",
              state: p.state || "",
              beds: p.beds || 0,
              baths: p.baths || 0,
              sqft: p.sqft || 0,
              type: (p.type as Property["type"]) || "House",
              amenities: p.amenities || [],
              images: p.images && p.images.length > 0 ? p.images : ["/placeholder.svg"],
              featured: p.featured || false,
              latitude: p.latitude ?? undefined,
              longitude: p.longitude ?? undefined,
              sellerId: p.user_id,
              sellerName: "Owner",
              createdAt: new Date(p.created_at).toLocaleDateString(),
              views: p.views || 0,
            };
          });
        setSavedProperties(props);
      }
      setLoadingSaved(false);
    };
    fetchSaved();
  }, [user]);

  // Fetch user's own listings
  useEffect(() => {
    if (!user) return;
    const fetchListings = async () => {
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", user.id);

      if (data && data.length > 0) {
        const props: Property[] = data.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description || "",
          price: p.price,
          location: p.location || "",
          city: p.city || "",
          state: p.state || "",
          beds: p.beds || 0,
          baths: p.baths || 0,
          sqft: p.sqft || 0,
          type: (p.type as Property["type"]) || "House",
          amenities: p.amenities || [],
          images: p.images && p.images.length > 0 ? p.images : ["/placeholder.svg"],
          featured: p.featured || false,
          latitude: p.latitude ?? undefined,
          longitude: p.longitude ?? undefined,
          sellerId: p.user_id,
          sellerName: "Owner",
          createdAt: new Date(p.created_at).toLocaleDateString(),
          views: p.views || 0,
          status: p.status || "active",
        }));
        setMyListings(props);
      }
      setLoadingListings(false);
    };
    fetchListings();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: editName })
      .eq("id", user.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setProfile((prev) => ({ ...prev, full_name: editName }));
      setEditingProfile(false);
      toast({ title: "Profile updated!" });
    }
  };

  const handleUnsave = async (propertyId: string) => {
    if (!user) return;
    await supabase
      .from("saved_properties")
      .delete()
      .eq("user_id", user.id)
      .eq("property_id", propertyId);
    setSavedProperties((prev) => prev.filter((p) => p.id !== propertyId));
    toast({ title: "Property removed from saved" });
  };

  if (authLoading || !user) return null;

  const currentPlan = details?.plan || "free";
  const listingLimit = getListingLimit(currentPlan);

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "saved", label: "Saved Properties", icon: Heart },
    { id: "listings", label: "My Listings", icon: List },
    { id: "subscription", label: "Plan & Billing", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pb-16 pt-24">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              {profile.full_name || "My Account"}
            </h1>
            <p className="text-sm text-muted-foreground">{profile.email || user.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 overflow-x-auto border-b border-border pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === "profile" && (
          <div className="max-w-2xl space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-foreground">Personal Information</h2>
                {!editingProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditName(profile.full_name || "");
                      setEditingProfile(true);
                    }}
                  >
                    <Edit className="mr-1 h-4 w-4" /> Edit
                  </Button>
                )}
              </div>

              {editingProfile ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Full Name</label>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveProfile}>
                      <Save className="mr-1 h-4 w-4" /> Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingProfile(false)}>
                      <X className="mr-1 h-4 w-4" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Full Name</p>
                    <p className="text-sm font-medium text-foreground">
                      {profile.full_name || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground">
                      {profile.email || user.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Member Since</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-card p-4 text-center">
                <p className="text-2xl font-bold text-foreground font-display">{myListings.length}</p>
                <p className="text-sm text-muted-foreground">My Listings</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4 text-center">
                <p className="text-2xl font-bold text-foreground font-display">{savedProperties.length}</p>
                <p className="text-sm text-muted-foreground">Saved Properties</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4 text-center">
                <p className="text-2xl font-bold text-foreground font-display capitalize">{currentPlan}</p>
                <p className="text-sm text-muted-foreground">Current Plan</p>
              </div>
            </div>
          </div>
        )}

        {/* Saved Properties Tab */}
        {tab === "saved" && (
          <div>
            {loadingSaved ? (
              <p className="py-12 text-center text-muted-foreground">Loading saved properties…</p>
            ) : savedProperties.length === 0 ? (
              <div className="py-16 text-center">
                <Heart className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
                <p className="text-lg font-semibold text-foreground">No saved properties yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Browse listings and save the ones you love.
                </p>
                <Button className="mt-4 gradient-caramel text-accent-foreground" asChild>
                  <Link to="/search">Browse Properties</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {savedProperties.map((p) => (
                  <div key={p.id} className="relative">
                    <PropertyCard property={p} />
                    <button
                      onClick={() => handleUnsave(p.id)}
                      className="absolute right-3 top-3 z-10 rounded-full bg-background/90 p-1.5 text-destructive shadow-md hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Listings Tab */}
        {tab === "listings" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {myListings.length}/{listingLimit === Infinity ? "∞" : listingLimit} listings used
              </p>
              <Button size="sm" className="gradient-caramel text-accent-foreground" asChild>
                <Link to="/dashboard">Go to Seller Dashboard</Link>
              </Button>
            </div>
            {loadingListings ? (
              <p className="py-12 text-center text-muted-foreground">Loading your listings…</p>
            ) : myListings.length === 0 ? (
              <div className="py-16 text-center">
                <List className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
                <p className="text-lg font-semibold text-foreground">No listings yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create your first property listing to get started.
                </p>
                <Button className="mt-4 gradient-caramel text-accent-foreground" asChild>
                  <Link to="/dashboard">Create Listing</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {myListings.map((p) => (
                  <div key={p.id} className="relative">
                    <PropertyCard property={p} />
                    <Badge
                      className={`absolute left-3 top-3 z-10 ${
                        (p as any).status === "active"
                          ? "bg-accent/90 text-accent-foreground"
                          : (p as any).status === "pending"
                          ? "bg-yellow-500/90 text-white"
                          : "bg-destructive/90 text-destructive-foreground"
                      }`}
                    >
                      {(p as any).status || "active"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Subscription Tab */}
        {tab === "subscription" && (
          <div className="max-w-2xl">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Current Plan</h2>
              <div className="mb-4 flex items-center gap-3">
                <Badge className="bg-accent/10 text-accent capitalize text-base px-3 py-1">
                  {currentPlan}
                </Badge>
                {isSubscribed && details?.status === "active" && (
                  <span className="text-sm text-muted-foreground">Active</span>
                )}
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Listing limit: {listingLimit === Infinity ? "Unlimited" : listingLimit}</p>
                <p>Listings used: {myListings.length}</p>
                {details?.currentPeriodEnd && (
                  <p>Next billing: {new Date(details.currentPeriodEnd).toLocaleDateString()}</p>
                )}
              </div>
              <div className="mt-6 flex gap-3">
                <Button className="gradient-caramel text-accent-foreground" asChild>
                  <Link to="/pricing">
                    {currentPlan === "free" ? "Upgrade Plan" : "Change Plan"}
                  </Link>
                </Button>
                {isSubscribed && details?.status === "active" && (
                  <Button variant="outline" onClick={cancelSubscription}>
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

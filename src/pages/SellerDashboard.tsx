import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Plus, List, Eye, MessageSquare, Trash2, Edit, Lock, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { formatPrice } from "@/data/mockData";
import PropertyForm, { type PropertyFormData } from "@/components/PropertyForm";

type Tab = "overview" | "create" | "manage" | "edit";
const FREE_LISTING_LIMIT = 2;

interface PropertyRow {
  id: string;
  title: string;
  price: number;
  views: number;
  status: string;
}

export default function SellerDashboard() {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { isSubscribed } = useSubscription();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [myListings, setMyListings] = useState<PropertyRow[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<PropertyFormData> | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  const refreshListings = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("properties")
      .select("id, title, price, views, status")
      .eq("user_id", user.id);
    setMyListings((data as PropertyRow[]) || []);
    setLoadingListings(false);
  };

  useEffect(() => {
    if (user) refreshListings();
  }, [user]);

  const atLimit = !isAdmin && !isSubscribed && myListings.length >= FREE_LISTING_LIMIT;

  const visibleTabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "create", label: "New Listing", icon: Plus },
    { id: "manage", label: "Manage", icon: List },
  ];

  const handleCreate = async (formData: PropertyFormData) => {
    if (atLimit) {
      toast({ title: "Listing limit reached", description: "Upgrade to Seller Pro to add unlimited listings.", variant: "destructive" });
      return;
    }
    if (!user) return;

    const { error } = await supabase.from("properties").insert({
      user_id: user.id,
      ...formData,
      status: isAdmin ? "active" : "pending",
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: isAdmin ? "Listing Published!" : "Listing Submitted!", description: isAdmin ? "Your property is now live." : "Your listing is pending admin approval." });
      await refreshListings();
      setTab("manage");
    }
  };

  const handleEdit = async (id: string) => {
    const { data } = await supabase
      .from("properties")
      .select("title, description, price, beds, baths, city, state, amenities, images")
      .eq("id", id)
      .single();

    if (data) {
      setEditingId(id);
      setEditData({
        title: data.title,
        description: data.description || "",
        price: data.price,
        beds: data.beds || 0,
        baths: data.baths || 0,
        city: data.city || "",
        state: data.state || "",
        amenities: data.amenities || [],
        images: data.images || [],
      });
      setTab("edit");
    }
  };

  const handleUpdate = async (formData: PropertyFormData) => {
    if (!editingId) return;

    const { error } = await supabase
      .from("properties")
      .update(formData)
      .eq("id", editingId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Listing Updated!", description: "Changes saved successfully." });
      setEditingId(null);
      setEditData(null);
      await refreshListings();
      setTab("manage");
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("properties").delete().eq("id", id);
    setMyListings((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Listing Deleted", variant: "destructive" });
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <div className="container mx-auto px-4 pb-16 pt-24">
        <h1 className="font-display text-3xl font-bold text-foreground">Seller Dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage your property listings</p>

        {/* Tabs */}
        <div className="mt-6 flex gap-2 border-b border-border pb-2">
          {visibleTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); if (t.id !== "edit") { setEditingId(null); setEditData(null); } }}
              className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
          {tab === "edit" && (
            <span className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
              <Edit className="h-4 w-4" /> Edit Listing
            </span>
          )}
        </div>

        {/* Free tier banner */}
        {!isAdmin && !isSubscribed && (
          <div className="mt-6 flex flex-col gap-3 rounded-lg border border-accent/30 bg-accent/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-2"><Lock className="h-5 w-5 text-accent" /></div>
              <div>
                <p className="text-sm font-semibold text-foreground">Free Plan — {myListings.length}/{FREE_LISTING_LIMIT} listings used</p>
                <p className="text-xs text-muted-foreground">Upgrade to Seller Pro for unlimited listings, analytics & more.</p>
              </div>
            </div>
            <Button size="sm" className="gradient-caramel text-accent-foreground hover:opacity-90" asChild>
              <Link to="/pricing">Upgrade <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </div>
        )}

        {/* Overview */}
        {tab === "overview" && (
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              { label: "Active Listings", value: myListings.length, icon: List },
              { label: "Total Views", value: myListings.reduce((s, p) => s + (p.views || 0), 0).toLocaleString(), icon: Eye },
              { label: "Messages", value: "—", icon: MessageSquare },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-accent/10 p-2"><stat.icon className="h-5 w-5 text-accent" /></div>
                  <div>
                    <p className="text-2xl font-bold text-foreground font-display">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create listing */}
        {tab === "create" && (
          <PropertyForm userId={user.id} onSubmit={handleCreate} submitLabel="Publish Listing" />
        )}

        {/* Edit listing */}
        {tab === "edit" && editData && (
          <div>
            <button
              onClick={() => { setTab("manage"); setEditingId(null); setEditData(null); }}
              className="mt-4 text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              ← Back to listings
            </button>
            <PropertyForm
              key={editingId}
              userId={user.id}
              initialData={editData}
              onSubmit={handleUpdate}
              submitLabel="Save Changes"
            />
          </div>
        )}

        {/* Manage */}
        {tab === "manage" && (
          <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-card">
            {myListings.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p>No listings yet.</p>
                <Button variant="link" className="text-accent" onClick={() => setTab("create")}>Create your first listing</Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myListings.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell>{formatPrice(p.price)}</TableCell>
                      <TableCell>{(p.views || 0).toLocaleString()}</TableCell>
                      <TableCell>
                        {p.status === "active" && (
                          <Badge variant="secondary" className="bg-accent/10 text-accent">Active</Badge>
                        )}
                        {p.status === "pending" && (
                          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">Pending</Badge>
                        )}
                        {p.status === "rejected" && (
                          <Badge variant="secondary" className="bg-destructive/10 text-destructive">Rejected</Badge>
                        )}
                        {!["active", "pending", "rejected"].includes(p.status) && (
                          <Badge variant="secondary">{p.status}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => handleEdit(p.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(p.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Plus, List, Eye, MessageSquare, Trash2, Edit, Image, Lock, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

type Tab = "overview" | "create" | "manage";
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

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchListings = async () => {
      const { data } = await supabase
        .from("properties")
        .select("id, title, price, views, status")
        .eq("user_id", user.id);
      setMyListings((data as PropertyRow[]) || []);
      setLoadingListings(false);
    };
    fetchListings();
  }, [user]);

  const atLimit = !isAdmin && !isSubscribed && myListings.length >= FREE_LISTING_LIMIT;

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "create", label: "New Listing", icon: Plus },
    { id: "manage", label: "Manage", icon: List },
  ];

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (atLimit) {
      toast({ title: "Listing limit reached", description: "Upgrade to Seller Pro to add unlimited listings.", variant: "destructive" });
      return;
    }
    if (!user) return;

    const form = new FormData(e.currentTarget);
    const { error } = await supabase.from("properties").insert({
      user_id: user.id,
      title: form.get("title") as string,
      description: form.get("description") as string,
      price: Number(form.get("price")),
      beds: Number(form.get("beds")),
      baths: Number(form.get("baths")),
      city: form.get("city") as string,
      state: form.get("state") as string,
      amenities: (form.get("amenities") as string)?.split(",").map((s) => s.trim()).filter(Boolean) || [],
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Listing Published!", description: "Your property is now live." });
      // Refresh listings
      const { data } = await supabase.from("properties").select("id, title, price, views, status").eq("user_id", user.id);
      setMyListings((data as PropertyRow[]) || []);
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
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Free tier banner */}
        {!isSubscribed && (
          <div className="mt-6 flex flex-col gap-3 rounded-lg border border-accent/30 bg-accent/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-2"><Lock className="h-5 w-5 text-accent" /></div>
              <div>
                <p className="text-sm font-semibold text-foreground">Free Plan — {myListings.length}/{FREE_LISTING_LIMIT} listings used</p>
                <p className="text-xs text-muted-foreground">Upgrade to Seller Pro for unlimited listings, analytics & more.</p>
              </div>
            </div>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-emerald-light" asChild>
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
          <form onSubmit={handleCreate} className="mt-8 max-w-2xl space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Title</label>
              <Input name="title" placeholder="e.g. Modern Luxury Villa" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Description</label>
              <Textarea name="description" placeholder="Describe the property…" rows={4} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Price ($)</label>
                <Input name="price" type="number" placeholder="500000" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Beds</label>
                <Input name="beds" type="number" placeholder="3" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Baths</label>
                <Input name="baths" type="number" placeholder="2" required />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">City</label>
                <Input name="city" placeholder="Los Angeles" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">State</label>
                <Input name="state" placeholder="CA" required />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Amenities</label>
              <Input name="amenities" placeholder="Pool, Garden, Garage (comma separated)" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Images</label>
              <div className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-accent">
                <div className="text-center">
                  <Image className="mx-auto h-8 w-8" />
                  <p className="mt-1 text-sm">Drag & drop or click to upload</p>
                </div>
              </div>
            </div>
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-emerald-light">
              Publish Listing
            </Button>
          </form>
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
                        <Badge variant="secondary" className="bg-accent/10 text-accent">
                          {p.status === "active" ? "Active" : p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => toast({ title: "Edit mode" })}>
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

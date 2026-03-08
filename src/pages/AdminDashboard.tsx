import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Home, Plus, Trash2, Edit, Shield, Eye,
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
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { formatPrice } from "@/data/mockData";

type Tab = "overview" | "properties" | "users" | "add-property";

interface PropertyRow {
  id: string;
  title: string;
  price: number;
  views: number;
  status: string;
  user_id: string;
  city: string;
  state: string;
}

interface ProfileRow {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [allProperties, setAllProperties] = useState<PropertyRow[]>([]);
  const [allUsers, setAllUsers] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user) navigate("/auth");
      else if (!isAdmin) navigate("/dashboard");
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchData = async () => {
      const [propRes, userRes] = await Promise.all([
        supabase.from("properties").select("id, title, price, views, status, user_id, city, state"),
        supabase.from("profiles").select("id, email, full_name, created_at"),
      ]);
      setAllProperties((propRes.data as PropertyRow[]) || []);
      setAllUsers((userRes.data as ProfileRow[]) || []);
      setLoading(false);
    };
    fetchData();
  }, [isAdmin]);

  const handleDeleteProperty = async (id: string) => {
    await supabase.from("properties").delete().eq("id", id);
    setAllProperties((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Property deleted", variant: "destructive" });
  };

  const handleCreateProperty = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      toast({ title: "Property Created!" });
      const { data } = await supabase.from("properties").select("id, title, price, views, status, user_id, city, state");
      setAllProperties((data as PropertyRow[]) || []);
      setTab("properties");
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "properties", label: "All Properties", icon: Home },
    { id: "users", label: "Users", icon: Users },
    { id: "add-property", label: "Add Property", icon: Plus },
  ];

  if (authLoading || adminLoading || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <div className="container mx-auto px-4 pb-16 pt-24">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-accent" />
          <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
        </div>
        <p className="text-sm text-muted-foreground">Manage all properties, users, and subscriptions</p>

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

        {/* Overview */}
        {tab === "overview" && (
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              { label: "Total Properties", value: allProperties.length, icon: Home },
              { label: "Total Users", value: allUsers.length, icon: Users },
              { label: "Total Views", value: allProperties.reduce((s, p) => s + (p.views || 0), 0).toLocaleString(), icon: Eye },
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

        {/* All Properties */}
        {tab === "properties" && (
          <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-card">
            {allProperties.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No properties yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allProperties.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell>{p.city}, {p.state}</TableCell>
                      <TableCell>{formatPrice(p.price)}</TableCell>
                      <TableCell>{(p.views || 0).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-accent/10 text-accent">{p.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteProperty(p.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}

        {/* Users */}
        {tab === "users" && (
          <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-card">
            {allUsers.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No users yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.full_name || "—"}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}

        {/* Add Property */}
        {tab === "add-property" && (
          <form onSubmit={handleCreateProperty} className="mt-8 max-w-2xl space-y-5">
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
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-emerald-light">
              Publish Property
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

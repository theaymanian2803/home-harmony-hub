import { useState } from "react";
import { Link } from "react-router-dom";
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
import Navbar from "@/components/Navbar";
import { properties, formatPrice } from "@/data/mockData";

type Tab = "overview" | "create" | "manage";

const FREE_LISTING_LIMIT = 2;

export default function SellerDashboard() {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("overview");
  const [isSubscribed] = useState(false);
  const myListings = properties.filter((p) => p.sellerId === "s1");
  const atLimit = !isSubscribed && myListings.length >= FREE_LISTING_LIMIT;

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "create", label: "New Listing", icon: Plus },
    { id: "manage", label: "Manage", icon: List },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (atLimit) {
      toast({ title: "Listing limit reached", description: "Upgrade to Seller Pro to add unlimited listings.", variant: "destructive" });
      return;
    }
    toast({ title: "Listing Published!", description: "Your property is now live." });
    setTab("manage");
  };

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
                tab === t.id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted"
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
              { label: "Active Listings", value: myListings.length, icon: List },
              { label: "Total Views", value: myListings.reduce((s, p) => s + p.views, 0).toLocaleString(), icon: Eye },
              { label: "Messages", value: "24", icon: MessageSquare },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-accent/10 p-2">
                    <stat.icon className="h-5 w-5 text-accent" />
                  </div>
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
              <Input placeholder="e.g. Modern Luxury Villa" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Description</label>
              <Textarea placeholder="Describe the property…" rows={4} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Price ($)</label>
                <Input type="number" placeholder="500000" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Beds</label>
                <Input type="number" placeholder="3" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Baths</label>
                <Input type="number" placeholder="2" required />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">City</label>
                <Input placeholder="Los Angeles" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">State</label>
                <Input placeholder="CA" required />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Amenities</label>
              <Input placeholder="Pool, Garden, Garage (comma separated)" />
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
                    <TableCell>{p.views.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-accent/10 text-accent">Active</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => toast({ title: "Edit mode" })}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => toast({ title: "Listing Deleted", variant: "destructive" })}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

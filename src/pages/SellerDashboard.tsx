import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Plus, List, Eye, MessageSquare, Trash2, Edit, Lock, ArrowRight, CreditCard, PartyPopper, X, Heart, CheckCircle, FileText,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription, getListingLimit } from "@/hooks/useSubscription";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { formatPrice } from "@/data/mockData";
import PropertyForm, { type PropertyFormData } from "@/components/PropertyForm";
import SubscriptionManagement from "@/components/SubscriptionManagement";
import DashboardAnalytics from "@/components/DashboardAnalytics";
import SellerProfileForm from "@/components/SellerProfileForm";
import { useTranslation } from "react-i18next";

type Tab = "overview" | "create" | "manage" | "edit" | "subscription" | "profile";
interface PropertyRow { id: string; title: string; price: number; views: number; status: string; }
interface SavesCount { property_id: string; saves_count: number; }

export default function SellerDashboard() {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { isSubscribed, details, cancelSubscription } = useSubscription();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("overview");
  const [myListings, setMyListings] = useState<PropertyRow[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<PropertyFormData> | null>(null);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const [savesData, setSavesData] = useState<SavesCount[]>([]);

  useEffect(() => {
    if (isSubscribed && details?.status === "active") {
      const bannerKey = `seller_pro_welcome_shown_${user?.id}`;
      if (!localStorage.getItem(bannerKey)) { setShowWelcomeBanner(true); localStorage.setItem(bannerKey, "true"); }
    }
  }, [isSubscribed, details, user?.id]);

  useEffect(() => { if (!authLoading && !user) navigate("/auth"); }, [user, authLoading, navigate]);

  const refreshListings = async () => {
    if (!user) return;
    const { data } = await supabase.from("properties").select("id, title, price, views, status").eq("user_id", user.id);
    setMyListings((data as PropertyRow[]) || []);
    setLoadingListings(false);
    const { data: saves } = await supabase.rpc("get_property_saves_count", { _user_id: user.id });
    setSavesData((saves as SavesCount[]) || []);
  };

  useEffect(() => { if (user) refreshListings(); }, [user]);

  const currentPlan = details?.plan || "free";
  const listingLimit = getListingLimit(currentPlan);
  const atLimit = !isAdmin && myListings.length >= listingLimit;

  const visibleTabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: t("dashboard.overview"), icon: LayoutDashboard },
    { id: "create", label: t("dashboard.newListing"), icon: Plus },
    { id: "manage", label: t("dashboard.manage"), icon: List },
    { id: "profile", label: "My Profile", icon: Edit },
    { id: "subscription", label: t("dashboard.subscription"), icon: CreditCard },
  ];

  const handleCreate = async (formData: PropertyFormData) => {
    if (atLimit) {
      toast({ title: t("dashboard.listingLimitReached"), description: `${t("dashboard.upgradeDesc")}`, variant: "destructive" });
      return;
    }
    if (!user) return;
    const { error } = await supabase.from("properties").insert({ user_id: user.id, ...formData, status: isAdmin ? "active" : "pending" });
    if (error) {
      if (error.message?.includes("Listing limit reached")) {
        toast({ title: t("dashboard.listingLimitReached"), description: t("dashboard.upgradeDesc"), variant: "destructive",
          action: (<Button size="sm" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground" asChild><Link to="/pricing">{t("dashboard.upgrade")}</Link></Button>),
        });
      } else { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    } else {
      toast({ title: isAdmin ? t("dashboard.listingPublished") : t("dashboard.listingSubmitted"), description: isAdmin ? t("dashboard.propertyLive") : t("dashboard.pendingApproval") });
      await refreshListings(); setTab("manage");
    }
  };

  const handleEdit = async (id: string) => {
    const { data } = await supabase.from("properties").select("*").eq("id", id).single();
    if (data) {
      setEditingId(id);
      setEditData({ title: data.title, description: data.description || "", price: data.price, beds: data.beds || 0, baths: data.baths || 0, sqft: data.sqft || 0, city: data.city || "", state: data.state || "", location: data.location || "", zip_code: (data as any).zip_code || "", neighborhood: (data as any).neighborhood || "", lot_size: (data as any).lot_size || 0, year_built: (data as any).year_built, parking: (data as any).parking || 0, stories: (data as any).stories || 1, heating: (data as any).heating || "", cooling: (data as any).cooling || "", flooring: (data as any).flooring || "", roof: (data as any).roof || "", hoa_fee: (data as any).hoa_fee || 0, property_style: (data as any).property_style || "", latitude: (data as any).latitude, longitude: (data as any).longitude, amenities: data.amenities || [], images: data.images || [] });
      setTab("edit");
    }
  };

  const handleUpdate = async (formData: PropertyFormData) => {
    if (!editingId) return;
    const { error } = await supabase.from("properties").update(formData).eq("id", editingId);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else { toast({ title: t("dashboard.listingUpdated"), description: t("dashboard.changesSaved") }); setEditingId(null); setEditData(null); await refreshListings(); setTab("manage"); }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("properties").delete().eq("id", id);
    setMyListings((prev) => prev.filter((p) => p.id !== id));
    toast({ title: t("dashboard.listingDeleted"), variant: "destructive" });
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("properties").update({ status: newStatus }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else {
      setMyListings((prev) => prev.map((p) => p.id === id ? { ...p, status: newStatus } : p));
      toast({ title: t("dashboard.statusUpdated") || "Status updated", description: `Property marked as ${newStatus}` });
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <div className="container mx-auto px-4 pb-16 pt-24">
        <h1 className="font-display text-4xl font-bold text-foreground">{t("dashboard.title")}</h1>
        <p className="text-base text-foreground/70">{t("dashboard.subtitle")}</p>

        <div className="mt-6 flex gap-2 border-b border-border pb-2">
          {visibleTabs.map((tb) => (
            <button key={tb.id} onClick={() => { setTab(tb.id); if (tb.id !== "edit") { setEditingId(null); setEditData(null); } }}
              className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === tb.id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"}`}>
              <tb.icon className="h-4 w-4" /> {tb.label}
            </button>
          ))}
          {tab === "edit" && (<span className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"><Edit className="h-4 w-4" /> {t("dashboard.editListing")}</span>)}
        </div>

        {!isAdmin && listingLimit !== Infinity && (
          <div className="mt-6 flex flex-col gap-3 rounded-lg border border-accent/30 bg-accent/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-2"><Lock className="h-5 w-5 text-accent" /></div>
              <div>
                <p className="text-sm font-semibold text-foreground">{currentPlan === "free" ? t("dashboard.freePlan") : t("dashboard.sellerPro")} — {myListings.length}/{listingLimit} {t("dashboard.listingsUsed")}</p>
                <p className="text-xs text-muted-foreground">{currentPlan === "free" ? t("dashboard.upgradeDesc") : t("dashboard.upgradeUnlimitedDesc")}</p>
              </div>
            </div>
            <Button size="sm" className="gradient-caramel text-accent-foreground hover:opacity-90" asChild><Link to="/pricing">{t("dashboard.upgrade")} <ArrowRight className="ml-1 h-3 w-3" /></Link></Button>
          </div>
        )}

        {showWelcomeBanner && (
          <div className="mt-6 relative flex flex-col gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2"><PartyPopper className="h-5 w-5 text-primary" /></div>
              <div><p className="text-sm font-semibold text-foreground">{t("dashboard.welcomePro")}</p><p className="text-xs text-muted-foreground">{t("dashboard.welcomeProDesc")}</p></div>
            </div>
            <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/5" onClick={() => setTab("create")}>{t("dashboard.createAListing")} <ArrowRight className="ml-1 h-3 w-3" /></Button>
            <button onClick={() => setShowWelcomeBanner(false)} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"><X className="h-4 w-4" /></button>
          </div>
        )}

        {tab === "overview" && (
          <div>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                { label: t("dashboard.activeListings"), value: myListings.length, icon: List },
                { label: t("dashboard.totalViews"), value: myListings.reduce((s, p) => s + (p.views || 0), 0).toLocaleString(), icon: Eye },
                { label: "Total Saves", value: savesData.reduce((s, d) => s + d.saves_count, 0).toLocaleString(), icon: Heart },
                { label: t("dashboard.messages"), value: "—", icon: MessageSquare },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg border border-border bg-card p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-accent/10 p-2"><stat.icon className="h-5 w-5 text-accent" /></div>
                    <div><p className="text-3xl font-bold text-foreground font-display">{stat.value}</p><p className="text-sm font-medium text-foreground/70">{stat.label}</p></div>
                  </div>
                </div>
              ))}
            </div>
            <DashboardAnalytics listings={myListings} savesData={savesData} />
          </div>
        )}

        {tab === "create" && <PropertyForm userId={user.id} onSubmit={handleCreate} submitLabel={t("dashboard.publishListing")} />}

        {tab === "edit" && editData && (
          <div>
            <button onClick={() => { setTab("manage"); setEditingId(null); setEditData(null); }} className="mt-4 text-sm text-muted-foreground hover:text-accent transition-colors">{t("dashboard.backToListings")}</button>
            <PropertyForm key={editingId} userId={user.id} initialData={editData} onSubmit={handleUpdate} submitLabel={t("dashboard.saveChanges")} />
          </div>
        )}

        {tab === "manage" && (
          <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-card">
            {myListings.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground"><p>{t("dashboard.noListings")}</p><Button variant="link" className="text-accent" onClick={() => setTab("create")}>{t("dashboard.createFirst")}</Button></div>
            ) : (
              <Table>
                <TableHeader><TableRow><TableHead>{t("dashboard.property")}</TableHead><TableHead>{t("dashboard.price")}</TableHead><TableHead>{t("dashboard.views")}</TableHead><TableHead>{t("dashboard.status")}</TableHead><TableHead className="text-right">{t("dashboard.actions")}</TableHead></TableRow></TableHeader>
                <TableBody>
                  {myListings.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell>{formatPrice(p.price)}</TableCell>
                      <TableCell>{(p.views || 0).toLocaleString()}</TableCell>
                      <TableCell>
                        {p.status === "active" && <Badge variant="secondary" className="bg-accent/10 text-accent">Active</Badge>}
                        {p.status === "pending" && <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">{t("dashboard.pending")}</Badge>}
                        {p.status === "rejected" && <Badge variant="secondary" className="bg-destructive/10 text-destructive">{t("dashboard.rejected")}</Badge>}
                        {p.status === "sold" && <Badge variant="secondary" className="bg-primary/10 text-primary">Sold</Badge>}
                        {p.status === "under_contract" && <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">Under Contract</Badge>}
                        {!["active", "pending", "rejected", "sold", "under_contract"].includes(p.status) && <Badge variant="secondary">{p.status}</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" title="Change status"><FileText className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {p.status !== "active" && <DropdownMenuItem onClick={() => handleStatusChange(p.id, "active")}><CheckCircle className="mr-2 h-4 w-4 text-accent" /> Mark Active</DropdownMenuItem>}
                              {p.status !== "under_contract" && <DropdownMenuItem onClick={() => handleStatusChange(p.id, "under_contract")}><FileText className="mr-2 h-4 w-4 text-blue-600" /> Under Contract</DropdownMenuItem>}
                              {p.status !== "sold" && <DropdownMenuItem onClick={() => handleStatusChange(p.id, "sold")}><CheckCircle className="mr-2 h-4 w-4 text-primary" /> Mark Sold</DropdownMenuItem>}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button size="icon" variant="ghost" onClick={() => handleEdit(p.id)}><Edit className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}

        {tab === "profile" && <SellerProfileForm userId={user.id} />}

        {tab === "subscription" && <SubscriptionManagement isSubscribed={isSubscribed} details={details} onCancel={cancelSubscription} />}
      </div>
    </div>
  );
}

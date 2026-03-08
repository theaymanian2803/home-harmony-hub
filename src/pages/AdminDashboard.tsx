import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Home, Plus, Trash2, Shield, Eye, CheckCircle, XCircle, Clock, Settings2, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { formatPrice } from "@/data/mockData";
import PropertyForm from "@/components/PropertyForm";
import AdminListingControls from "@/components/AdminListingControls";
import AdminLandingControls from "@/components/AdminLandingControls";
import { useTranslation } from "react-i18next";

type Tab = "overview" | "properties" | "pending" | "users" | "add-property" | "listing-controls" | "landing-page";
interface PropertyRow { id: string; title: string; price: number; views: number; status: string; user_id: string; city: string; state: string; }
interface ProfileRow { id: string; email: string; full_name: string; created_at: string; }

export default function AdminDashboard() {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { t } = useTranslation();
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

  const refreshData = async () => {
    const [propRes, userRes] = await Promise.all([
      supabase.from("properties").select("id, title, price, views, status, user_id, city, state"),
      supabase.from("profiles").select("id, email, full_name, created_at"),
    ]);
    setAllProperties((propRes.data as PropertyRow[]) || []);
    setAllUsers((userRes.data as ProfileRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { if (isAdmin) refreshData(); }, [isAdmin]);

  const pendingProperties = allProperties.filter((p) => p.status === "pending");

  const handleApprove = async (id: string) => {
    const { error } = await supabase.from("properties").update({ status: "active" }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: t("admin.propertyApproved"), description: t("admin.listingNowLive") }); setAllProperties((prev) => prev.map((p) => (p.id === id ? { ...p, status: "active" } : p))); }
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase.from("properties").update({ status: "rejected" }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: t("admin.propertyRejected"), variant: "destructive" }); setAllProperties((prev) => prev.map((p) => (p.id === id ? { ...p, status: "rejected" } : p))); }
  };

  const handleDeleteProperty = async (id: string) => {
    await supabase.from("properties").delete().eq("id", id);
    setAllProperties((prev) => prev.filter((p) => p.id !== id));
    toast({ title: t("admin.propertyDeleted"), variant: "destructive" });
  };

  const handleCreateProperty = async (formData: any) => {
    if (!user) return;
    const { error } = await supabase.from("properties").insert({ user_id: user.id, ...formData, status: "active" });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: t("admin.propertyCreated") }); await refreshData(); setTab("properties"); }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600"><Clock className="mr-1 h-3 w-3" />{t("dashboard.pending")}</Badge>;
      case "active": return <Badge variant="secondary" className="bg-accent/10 text-accent"><CheckCircle className="mr-1 h-3 w-3" />Active</Badge>;
      case "rejected": return <Badge variant="secondary" className="bg-destructive/10 text-destructive"><XCircle className="mr-1 h-3 w-3" />{t("dashboard.rejected")}</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "overview", label: t("admin.overview"), icon: LayoutDashboard },
    { id: "pending", label: t("admin.pendingApproval"), icon: Clock, count: pendingProperties.length },
    { id: "properties", label: t("admin.allProperties"), icon: Home },
    { id: "users", label: t("admin.users"), icon: Users },
    { id: "add-property", label: t("admin.addProperty"), icon: Plus },
    { id: "listing-controls", label: "Listing Controls", icon: Settings2 },
    { id: "landing-page", label: "Landing Page", icon: Layout },
  ];

  if (authLoading || adminLoading || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <div className="container mx-auto px-4 pb-16 pt-24">
        <div className="flex items-center gap-2"><Shield className="h-6 w-6 text-accent" /><h1 className="font-display text-3xl font-bold text-foreground">{t("admin.title")}</h1></div>
        <p className="text-sm text-muted-foreground">{t("admin.subtitle")}</p>

        <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-2">
          {tabs.map((tb) => (
            <button key={tb.id} onClick={() => setTab(tb.id)}
              className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === tb.id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"}`}>
              <tb.icon className="h-4 w-4" /> {tb.label}
              {tb.count !== undefined && tb.count > 0 && <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-500 px-1.5 text-xs font-bold text-white">{tb.count}</span>}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="mt-8 grid gap-6 sm:grid-cols-4">
            {[
              { label: t("admin.totalProperties"), value: allProperties.length, icon: Home },
              { label: t("admin.pendingApproval"), value: pendingProperties.length, icon: Clock },
              { label: t("admin.totalUsers"), value: allUsers.length, icon: Users },
              { label: t("admin.totalViews"), value: allProperties.reduce((s, p) => s + (p.views || 0), 0).toLocaleString(), icon: Eye },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border bg-card p-6 cursor-pointer hover:border-accent/50 transition-colors" onClick={() => {
                if (stat.label === t("admin.pendingApproval")) setTab("pending");
                else if (stat.label === t("admin.totalProperties")) setTab("properties");
                else if (stat.label === t("admin.totalUsers")) setTab("users");
              }}>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-accent/10 p-2"><stat.icon className="h-5 w-5 text-accent" /></div>
                  <div><p className="text-2xl font-bold text-foreground font-display">{stat.value}</p><p className="text-sm text-muted-foreground">{stat.label}</p></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "pending" && (
          <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-card">
            {pendingProperties.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground"><CheckCircle className="mx-auto h-8 w-8 text-accent mb-2" /><p>{t("admin.allCaughtUp")}</p></div>
            ) : (
              <Table>
                <TableHeader><TableRow><TableHead>{t("admin.title_col")}</TableHead><TableHead>{t("admin.location")}</TableHead><TableHead>{t("admin.price")}</TableHead><TableHead>{t("admin.status")}</TableHead><TableHead className="text-right">{t("admin.actions")}</TableHead></TableRow></TableHeader>
                <TableBody>
                  {pendingProperties.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell>{p.city}, {p.state}</TableCell>
                      <TableCell>{formatPrice(p.price)}</TableCell>
                      <TableCell>{getStatusBadge(p.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="outline" className="text-accent border-accent/30 hover:bg-accent hover:text-accent-foreground" onClick={() => handleApprove(p.id)}><CheckCircle className="mr-1 h-4 w-4" /> {t("admin.approve")}</Button>
                          <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground" onClick={() => handleReject(p.id)}><XCircle className="mr-1 h-4 w-4" /> {t("admin.reject")}</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}

        {tab === "properties" && (
          <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-card">
            {allProperties.length === 0 ? (<div className="p-8 text-center text-muted-foreground">{t("admin.noProperties")}</div>) : (
              <Table>
                <TableHeader><TableRow><TableHead>{t("admin.title_col")}</TableHead><TableHead>{t("admin.location")}</TableHead><TableHead>{t("admin.price")}</TableHead><TableHead>{t("admin.views")}</TableHead><TableHead>{t("admin.status")}</TableHead><TableHead className="text-right">{t("admin.actions")}</TableHead></TableRow></TableHeader>
                <TableBody>
                  {allProperties.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell>{p.city}, {p.state}</TableCell>
                      <TableCell>{formatPrice(p.price)}</TableCell>
                      <TableCell>{(p.views || 0).toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(p.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {p.status === "pending" && (<><Button size="icon" variant="ghost" className="text-accent" onClick={() => handleApprove(p.id)}><CheckCircle className="h-4 w-4" /></Button><Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleReject(p.id)}><XCircle className="h-4 w-4" /></Button></>)}
                          <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteProperty(p.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}

        {tab === "users" && (
          <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-card">
            {allUsers.length === 0 ? (<div className="p-8 text-center text-muted-foreground">{t("admin.noUsers")}</div>) : (
              <Table>
                <TableHeader><TableRow><TableHead>{t("admin.name")}</TableHead><TableHead>{t("admin.email")}</TableHead><TableHead>{t("admin.joined")}</TableHead></TableRow></TableHeader>
                <TableBody>
                  {allUsers.map((u) => (
                    <TableRow key={u.id}><TableCell className="font-medium">{u.full_name || "—"}</TableCell><TableCell>{u.email}</TableCell><TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}

        {tab === "add-property" && user && <PropertyForm userId={user.id} onSubmit={handleCreateProperty} submitLabel={t("admin.publishProperty")} />}

        {tab === "listing-controls" && <AdminListingControls />}

        {tab === "landing-page" && <AdminLandingControls />}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Building2, Menu, X, User, LogIn, LogOut, Shield, Home, Search, MapPin, DollarSign, Info, Mail, FileText, Users, ChevronDown, TrendingUp, Building, Landmark, TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { useSiteContent } from "@/hooks/useSiteContent";

function MegaMenuTrigger({ label, isActive, children }: { label: string; isActive?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        className={cn(
          "flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
          isActive ? "neu-pressed text-accent" : "text-muted-foreground hover:text-foreground"
        )}
      >
        {label}
        <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-1/2 top-full pt-2 -translate-x-1/2">
          <div className="min-w-[520px] rounded-2xl border border-border/60 bg-background/95 p-5 shadow-xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-200">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

function MegaMenuItem({ to, icon: Icon, title, description, onClick }: { to: string; icon: React.ElementType; title: string; description: string; onClick?: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-secondary/60"
    >
      <div className="mt-0.5 rounded-lg bg-accent/10 p-2 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { t } = useTranslation();
  const { getValue } = useSiteContent();

  const siteName = getValue("navbar_site_name", "EstateHub");
  const logoImage = getValue("navbar_logo_image");
  const ctaText = getValue("navbar_cta_text", t("nav.listProperty"));

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isPropertyPage = ["/search"].includes(location.pathname) || location.pathname.startsWith("/property");
  const isCompanyPage = ["/about", "/contact", "/pricing", "/terms", "/privacy"].includes(location.pathname);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5">
          {logoImage ? (
            <img src={logoImage} alt={siteName} className="h-9 w-auto object-contain" />
          ) : (
            <div className="gradient-caramel rounded-xl p-2">
              <Building2 className="h-5 w-5 text-accent-foreground" />
            </div>
          )}
          <span className="font-display text-xl font-bold text-foreground">{siteName}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            to="/"
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
              location.pathname === "/" ? "neu-pressed text-accent" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t("nav.home")}
          </Link>

          <MegaMenuTrigger label={t("nav.properties")} isActive={isPropertyPage}>
            <div className="grid grid-cols-2 gap-1">
              <MegaMenuItem to="/search" icon={Search} title={t("nav.browseAll")} description={t("nav.exploreAll")} />
              <MegaMenuItem to="/search?type=house" icon={Home} title={t("nav.houses")} description={t("nav.singleFamily")} />
              <MegaMenuItem to="/search?type=apartment" icon={Building} title={t("nav.apartments")} description={t("nav.urbanLiving")} />
              <MegaMenuItem to="/search?type=condo" icon={Landmark} title={t("nav.condos")} description={t("nav.modernCondos")} />
              <MegaMenuItem to="/search?type=land" icon={TreePine} title={t("nav.land")} description={t("nav.buildDream")} />
              <MegaMenuItem to="/search?type=commercial" icon={TrendingUp} title={t("nav.commercial")} description={t("nav.businessInvestment")} />
            </div>
            <div className="mt-3 border-t border-border/50 pt-3">
              <Link to="/search" className="flex items-center gap-2 text-xs font-medium text-accent hover:underline">
                <MapPin className="h-3 w-3" /> {t("nav.viewAllMap")} →
              </Link>
            </div>
          </MegaMenuTrigger>

          <MegaMenuTrigger label={t("nav.company")} isActive={isCompanyPage}>
            <div className="grid grid-cols-2 gap-1">
              <MegaMenuItem to="/about" icon={Info} title={t("nav.aboutUs")} description={t("nav.ourStory")} />
              <MegaMenuItem to="/contact" icon={Mail} title={t("nav.contact")} description={t("nav.getInTouch")} />
              <MegaMenuItem to="/pricing" icon={DollarSign} title={t("nav.pricing")} description={t("nav.plansForEvery")} />
              <MegaMenuItem to="/terms" icon={FileText} title={t("nav.terms")} description={t("nav.termsOfService")} />
              <MegaMenuItem to="/privacy" icon={Shield} title={t("nav.privacy")} description={t("nav.protectData")} />
              <MegaMenuItem to="/about" icon={Users} title={t("nav.ourTeam")} description={t("nav.meetPeople")} />
            </div>
          </MegaMenuTrigger>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <LanguageSwitcher />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <User className="mr-1 h-4 w-4" />
                  {user.user_metadata?.full_name || t("nav.account")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/profile">{t("nav.myProfile")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">{t("nav.sellerDashboard")}</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" /> {t("nav.adminPanel")}
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" /> {t("nav.signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground" asChild>
              <Link to="/auth"><LogIn className="mr-1 h-4 w-4" /> {t("nav.signIn")}</Link>
            </Button>
          )}
          <Button size="sm" className="gradient-caramel text-accent-foreground hover:opacity-90 rounded-xl shadow-md" asChild>
            <Link to={user ? "/dashboard" : "/auth"}>{ctaText}</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <LanguageSwitcher />
          <button className="text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl lg:hidden">
          <nav className="container mx-auto flex flex-col gap-1 px-4 py-4">
            <Link to="/" onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50">
              {t("nav.home")}
            </Link>

            <p className="mt-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">{t("nav.properties")}</p>
            {[
              { to: "/search", label: t("nav.browseAll") },
              { to: "/search?type=house", label: t("nav.houses") },
              { to: "/search?type=apartment", label: t("nav.apartments") },
              { to: "/search?type=condo", label: t("nav.condos") },
            ].map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                {link.label}
              </Link>
            ))}

            <p className="mt-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">{t("nav.company")}</p>
            {[
              { to: "/about", label: t("nav.aboutUs") },
              { to: "/contact", label: t("nav.contact") },
              { to: "/pricing", label: t("nav.pricing") },
            ].map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                {link.label}
              </Link>
            ))}

            {user && (
              <Link to="/profile" onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                {t("nav.myProfile")}
              </Link>
            )}
            {user && (
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                {t("nav.sellerDashboard")}
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground">
                <Shield className="mr-1 inline h-4 w-4" /> {t("nav.adminPanel")}
              </Link>
            )}
            {user ? (
              <button onClick={() => { handleSignOut(); setMobileOpen(false); }}
                className="rounded-xl px-4 py-2.5 text-left text-sm font-medium text-muted-foreground hover:text-foreground">
                {t("nav.signOut")}
              </button>
            ) : (
              <Link to="/auth" onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground">
                {t("nav.signIn")}
              </Link>
            )}
            <Button size="sm" className="mt-2 gradient-caramel text-accent-foreground hover:opacity-90 rounded-xl" asChild>
              <Link to={user ? "/dashboard" : "/auth"} onClick={() => setMobileOpen(false)}>{ctaText}</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

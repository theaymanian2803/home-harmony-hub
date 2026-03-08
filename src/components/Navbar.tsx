import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Building2, Menu, X, User, LogIn, LogOut, Shield, Home, Search, MapPin, DollarSign, Info, Phone, Mail, HelpCircle, FileText, Users, Star, ChevronDown, TrendingUp, Building, Landmark, TreePine } from "lucide-react";
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
          <div className="gradient-caramel rounded-xl p-2">
            <Building2 className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">EstateHub</span>
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
            Home
          </Link>

          {/* Properties Mega Menu */}
          <MegaMenuTrigger label="Properties" isActive={isPropertyPage}>
            <div className="grid grid-cols-2 gap-1">
              <MegaMenuItem to="/search" icon={Search} title="Browse All" description="Explore all available listings" />
              <MegaMenuItem to="/search?type=house" icon={Home} title="Houses" description="Single-family homes" />
              <MegaMenuItem to="/search?type=apartment" icon={Building} title="Apartments" description="Urban living spaces" />
              <MegaMenuItem to="/search?type=condo" icon={Landmark} title="Condos" description="Modern condominiums" />
              <MegaMenuItem to="/search?type=land" icon={TreePine} title="Land" description="Build your dream property" />
              <MegaMenuItem to="/search?type=commercial" icon={TrendingUp} title="Commercial" description="Business & investment" />
            </div>
            <div className="mt-3 border-t border-border/50 pt-3">
              <Link to="/search" className="flex items-center gap-2 text-xs font-medium text-accent hover:underline">
                <MapPin className="h-3 w-3" /> View all properties on the map →
              </Link>
            </div>
          </MegaMenuTrigger>

          {/* Company Mega Menu */}
          <MegaMenuTrigger label="Company" isActive={isCompanyPage}>
            <div className="grid grid-cols-2 gap-1">
              <MegaMenuItem to="/about" icon={Info} title="About Us" description="Our story and mission" />
              <MegaMenuItem to="/contact" icon={Mail} title="Contact" description="Get in touch with us" />
              <MegaMenuItem to="/pricing" icon={DollarSign} title="Pricing" description="Plans for every need" />
              <MegaMenuItem to="/terms" icon={FileText} title="Terms" description="Terms of service" />
              <MegaMenuItem to="/privacy" icon={Shield} title="Privacy" description="How we protect your data" />
              <MegaMenuItem to="/about" icon={Users} title="Our Team" description="Meet the people behind EstateHub" />
            </div>
          </MegaMenuTrigger>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <User className="mr-1 h-4 w-4" />
                  {user.user_metadata?.full_name || "Account"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Seller Dashboard</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" /> Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground" asChild>
              <Link to="/auth"><LogIn className="mr-1 h-4 w-4" /> Sign In</Link>
            </Button>
          )}
          <Button size="sm" className="gradient-caramel text-accent-foreground hover:opacity-90 rounded-xl shadow-md" asChild>
            <Link to={user ? "/dashboard" : "/auth"}>List Property</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="text-foreground lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl lg:hidden">
          <nav className="container mx-auto flex flex-col gap-1 px-4 py-4">
            <Link to="/" onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50">
              Home
            </Link>

            {/* Mobile Properties section */}
            <p className="mt-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Properties</p>
            {[
              { to: "/search", label: "Browse All" },
              { to: "/search?type=house", label: "Houses" },
              { to: "/search?type=apartment", label: "Apartments" },
              { to: "/search?type=condo", label: "Condos" },
            ].map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                {link.label}
              </Link>
            ))}

            {/* Mobile Company section */}
            <p className="mt-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Company</p>
            {[
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
              { to: "/pricing", label: "Pricing" },
            ].map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                {link.label}
              </Link>
            ))}

            {user && (
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground">
                Seller Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground">
                <Shield className="mr-1 inline h-4 w-4" /> Admin Panel
              </Link>
            )}
            {user ? (
              <button onClick={() => { handleSignOut(); setMobileOpen(false); }}
                className="rounded-xl px-4 py-2.5 text-left text-sm font-medium text-muted-foreground hover:text-foreground">
                Sign Out
              </button>
            ) : (
              <Link to="/auth" onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground">
                Sign In
              </Link>
            )}
            <Button size="sm" className="mt-2 gradient-caramel text-accent-foreground hover:opacity-90 rounded-xl" asChild>
              <Link to={user ? "/dashboard" : "/auth"} onClick={() => setMobileOpen(false)}>List Property</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

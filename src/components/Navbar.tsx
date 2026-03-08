import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Building2, Menu, X, User, LogIn, LogOut, Shield } from "lucide-react";
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

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/search", label: "Properties" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/pricing", label: "Pricing" },
];

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
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                location.pathname === link.to
                  ? "neu-pressed text-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
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
        <button className="text-foreground md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="container mx-auto flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
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

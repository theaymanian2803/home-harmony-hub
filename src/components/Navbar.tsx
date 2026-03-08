import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Building2, Menu, X, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/search", label: "Properties" },
  { to: "/pricing", label: "Pricing" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isTransparent = location.pathname === "/";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-primary/80 backdrop-blur-md"
          : "bg-primary shadow-lg"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Building2 className="h-7 w-7 text-accent" />
          <span className="font-display text-xl font-bold text-primary-foreground">
            EstateHub
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-accent text-accent-foreground"
                  : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              >
                <User className="mr-1 h-4 w-4" />
                Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/dashboard">Seller Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>My Favorites</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-emerald-light"
            asChild
          >
            <Link to="/pricing">List Property</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="text-primary-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-primary-foreground/10 bg-primary md:hidden">
          <nav className="container mx-auto flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-4 py-2 text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-4 py-2 text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10"
            >
              Seller Dashboard
            </Link>
            <Button
              size="sm"
              className="mt-2 bg-accent text-accent-foreground hover:bg-emerald-light"
              asChild
            >
              <Link to="/pricing" onClick={() => setMobileOpen(false)}>
                List Property
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

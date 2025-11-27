"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { BriefcaseIcon, MenuIcon, XIcon } from "lucide-react";
import { logout as authLogout, getStoredUser, isAuthenticated,  } from "@/services/authService";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState(null);

  useEffect(() => {
    // initialize from localStorage on mount
    setUser(getStoredUser());

    // update when auth changes in same tab
    const onAuthChanged = () => {
      setUser(getStoredUser());
    };

    window.addEventListener("authChanged", onAuthChanged);
    return () => {
      window.removeEventListener("authChanged", onAuthChanged);
    };
  }, []);

  const isActive = (path) => pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    try {
      authLogout();
      // will also trigger authChanged -> this effect will setUser(null)
      setUser(null);
      setIsMenuOpen(false);
      router.push("/");
    } catch (err) {
      console.log("Error logging out:", err);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BriefcaseIcon className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">JobHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : 'text-foreground'}`}
            >
              Home
            </Link>
            <Link
              href="/jobs"
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/jobs') ? 'text-primary' : 'text-foreground'}`}
            >
              Jobs
            </Link>
            <Link
              href="/companies"
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/companies') ? 'text-primary' : 'text-foreground'}`}
            >
              Companies
            </Link>
            {/* show Admin link only if user is admin */}
            {user?.role === "admin" ? (
              <Link
                href="/admin/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/admin/dashboard') ? 'text-primary' : 'text-foreground'}`}
              >
                Admin
              </Link>
            ) : null}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />
            {isAuthenticated() && user ? (
              <>
                <span className="text-sm text-foreground">Hi, {user.name ?? user.email}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/admin/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <ModeToggle />
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? (
                <XIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link href="/" onClick={toggleMenu} className={`block py-2 text-sm font-medium ${isActive('/') ? 'text-primary' : 'text-foreground'}`}>Home</Link>
            <Link href="/jobs" onClick={toggleMenu} className={`block py-2 text-sm font-medium ${isActive('/jobs') ? 'text-primary' : 'text-foreground'}`}>Jobs</Link>
            <Link href="/companies" onClick={toggleMenu} className={`block py-2 text-sm font-medium ${isActive('/companies') ? 'text-primary' : 'text-foreground'}`}>Companies</Link>

            {user?.role === "admin" ? (
              <Link href="/admin/dashboard" onClick={toggleMenu} className={`block py-2 text-sm font-medium ${isActive('/admin/dashboard') ? 'text-primary' : 'text-foreground'}`}>Admin</Link>
            ) : (
              <Link href="/admin/login" onClick={toggleMenu} className={`block py-2 text-sm font-medium ${isActive('/admin/login') ? 'text-primary' : 'text-foreground'}`}>Admin</Link>
            )}

            <div className="pt-2">
              {isAuthenticated() && user ? (
                <Button className="w-full" variant="outline" onClick={() => { toggleMenu(); handleLogout(); }}>
                  Logout
                </Button>
              ) : (
                <Link href="/admin/login" onClick={toggleMenu}>
                  <Button className="w-full" variant="outline">Employer Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

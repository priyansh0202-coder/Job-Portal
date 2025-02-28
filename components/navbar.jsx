"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { BriefcaseIcon, MenuIcon, XIcon } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
            <Link 
              href="/admin/login" 
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/admin/login') ? 'text-primary' : 'text-foreground'}`}
            >
              Admin
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />
            <Link href="/admin/login">
              <Button variant="outline" size="sm">
                Employer Login
              </Button>
            </Link>
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
            <Link 
              href="/" 
              className={`block py-2 text-sm font-medium ${isActive('/') ? 'text-primary' : 'text-foreground'}`}
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              href="/jobs" 
              className={`block py-2 text-sm font-medium ${isActive('/jobs') ? 'text-primary' : 'text-foreground'}`}
              onClick={toggleMenu}
            >
              Jobs
            </Link>
            <Link 
              href="/companies" 
              className={`block py-2 text-sm font-medium ${isActive('/companies') ? 'text-primary' : 'text-foreground'}`}
              onClick={toggleMenu}
            >
              Companies
            </Link>
            <Link 
              href="/admin/login" 
              className={`block py-2 text-sm font-medium ${isActive('/admin/login') ? 'text-primary' : 'text-foreground'}`}
              onClick={toggleMenu}
            >
              Admin
            </Link>
            <Link href="/admin/login" onClick={toggleMenu}>
              <Button className="w-full" variant="outline" size="sm">
                Employer Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
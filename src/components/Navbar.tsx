"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuMenu, LuSearch, LuX } from "react-icons/lu";
import { PiChatCircleDotsDuotone } from "react-icons/pi";
import { Button } from "./ui/Button";

// Temporary mock for Auth State
const isLoggedIn = false;

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const loggedOutRoutes = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const loggedInRoutes = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "Add Plan", path: "/items/add" },
    { name: "Manage Plans", path: "/items/manage" },
    { name: "About", path: "/about" },
  ];

  const routes = isLoggedIn ? loggedInRoutes : loggedOutRoutes;

  return (
    <nav className="sticky top-0 z-50 w-full bg-primary/95 backdrop-blur-md border-b border-primary-hover">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-4">
          <button 
            className="sm:hidden text-neutral-bg p-2 -ml-2 rounded-md hover:bg-primary-hover"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
          </button>
          <Link href="/" className="font-display font-bold text-xl text-neutral-bg flex items-center gap-2">
            <span className="text-accent">Travix</span> AI
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center h-full gap-6">
          {routes.map((route) => {
            const isActive = pathname === route.path || (route.path !== '/' && pathname.startsWith(route.path));
            return (
              <Link 
                key={route.name}
                href={route.path}
                className={`relative flex items-center h-full text-sm font-medium transition-colors ${isActive ? 'text-accent' : 'text-neutral-bg hover:text-accent-hover'}`}
              >
                {route.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-t-[2px]" />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="hidden lg:flex p-2 text-neutral-bg hover:text-accent transition-colors rounded-full" aria-label="Search">
            <LuSearch size={20} />
          </button>
          <button className="flex items-center gap-2 p-2 text-accent hover:text-accent-hover transition-colors rounded-full" aria-label="AI Assistant">
            <PiChatCircleDotsDuotone size={24} />
          </button>
          {!isLoggedIn && (
            <div className="hidden sm:flex">
              <Link href="/login">
                <Button variant="cta" size="sm">Login</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-primary border-b border-primary-hover px-6 pt-2 pb-6 flex flex-col gap-4">
          {routes.map((route) => {
            const isActive = pathname === route.path || (route.path !== '/' && pathname.startsWith(route.path));
            return (
              <Link
                key={route.name}
                href={route.path}
                className={`w-full font-medium text-lg py-2 ${isActive ? 'text-accent' : 'text-neutral-bg'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {route.name}
              </Link>
            )
          })}
          {!isLoggedIn && (
            <div className="mt-4">
              <Link href="/login" className="w-full block" onClick={() => setIsMenuOpen(false)}>
                <Button variant="cta" className="w-full">Login</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

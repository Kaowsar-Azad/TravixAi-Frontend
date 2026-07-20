"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuMenu, LuLogOut, LuX } from "react-icons/lu";
import { Button } from "./ui/Button";
import { useAuth } from "@/context/AuthContext";


export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const loggedOutRoutes = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "AI Assistant", path: "/ai-assistant" },
  ];

  const loggedInRoutes = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "My Bookings", path: "/my-bookings" },
  ];

  if (user?.role === "travel_agent" || user?.role === "admin") {
    loggedInRoutes.push(
      { name: "Add Plan", path: "/items/add" },
      { name: "Manage Plans", path: "/items/manage" }
    );
  }

  if (user?.role === "admin") {
    loggedInRoutes.push(
      { name: "Dashboard", path: "/admin/dashboard" }
    );
  }

  loggedInRoutes.push(
    { name: "About", path: "/about" },
    { name: "AI Assistant", path: "/ai-assistant" }
  );

  const routes = isLoggedIn ? loggedInRoutes : loggedOutRoutes;

  return (
    <nav className="sticky top-0 z-50 w-full bg-primary/95 backdrop-blur-md border-b border-primary-hover">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between relative">
        
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
          {!isLoggedIn ? (
            <div className="hidden sm:flex">
              <Link href="/login">
                <Button variant="cta" size="sm">Login</Button>
              </Link>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-2">
                {user.image ? (
                  <img src={user.image} alt="Profile" className="w-8 h-8 rounded-full border border-border bg-white object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full border border-neutral-bg/20 bg-accent flex items-center justify-center text-white font-bold text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <span className="text-sm font-medium text-neutral-bg">{user.name}</span>
              </div>
              <button 
                onClick={logout} 
                className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-white border border-rose-500/20 hover:border-rose-500 bg-rose-500/10 hover:bg-rose-500 transition-all duration-200 py-1.5 px-3 rounded-lg cursor-pointer shadow-sm hover:shadow-rose-500/20"
              >
                <LuLogOut size={14} />
                Logout
              </button>
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

          {!isLoggedIn ? (
            <div className="mt-4">
              <Link href="/login" className="w-full block" onClick={() => setIsMenuOpen(false)}>
                <Button variant="cta" className="w-full">Login</Button>
              </Link>
            </div>
          ) : (
            <div className="mt-4 border-t border-primary-hover pt-4 flex flex-col gap-4">
              <div className="flex items-center gap-3 px-2">
                {user.image ? (
                  <img src={user.image} alt="Profile" className="w-10 h-10 rounded-full border border-border bg-white object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full border border-border bg-accent flex items-center justify-center text-white font-bold text-lg">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <span className="font-medium text-neutral-bg">{user.name}</span>
              </div>
              <button 
                onClick={() => { logout(); setIsMenuOpen(false); }} 
                className="w-full flex items-center gap-2 font-medium text-lg py-2 text-destructive px-2 hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
              >
                <LuLogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

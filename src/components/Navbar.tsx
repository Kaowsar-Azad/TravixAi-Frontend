"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbar as HeroNavbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@heroui/react";
import { LuMenu, LuSearch } from "react-icons/lu";
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
    <HeroNavbar
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      className="bg-primary/95 backdrop-blur-md border-b border-primary-hover"
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-accent",
        ],
      }}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-neutral-bg"
          icon={<LuMenu className="text-neutral-bg" size={24} />}
        />
        <NavbarBrand>
          <Link href="/" className="font-display font-bold text-xl text-neutral-bg flex items-center gap-2">
            <span className="text-accent">Travix</span> AI
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        {routes.map((route) => (
          <NavbarItem key={route.name} isActive={pathname === route.path || (route.path !== '/' && pathname.startsWith(route.path))}>
            <Link 
              href={route.path}
              className={`text-sm font-medium ${pathname === route.path || (route.path !== '/' && pathname.startsWith(route.path)) ? 'text-accent' : 'text-neutral-bg hover:text-accent'} transition-colors`}
            >
              {route.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end" className="gap-2 sm:gap-4">
        <NavbarItem className="hidden lg:flex">
          <button className="p-2 text-neutral-bg hover:text-accent transition-colors rounded-full" aria-label="Search">
            <LuSearch size={20} />
          </button>
        </NavbarItem>
        <NavbarItem>
          <button className="flex items-center gap-2 p-2 text-accent hover:text-accent-hover transition-colors rounded-full" aria-label="AI Assistant">
            <PiChatCircleDotsDuotone size={24} />
          </button>
        </NavbarItem>
        {!isLoggedIn && (
          <NavbarItem className="hidden sm:flex">
            <Link href="/login">
              <Button variant="cta" size="sm">Login</Button>
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarMenu className="bg-primary pt-6">
        {routes.map((route, index) => (
          <NavbarMenuItem key={`${route.name}-${index}`}>
            <Link
              className={`w-full font-medium text-lg ${pathname === route.path || (route.path !== '/' && pathname.startsWith(route.path)) ? 'text-accent' : 'text-neutral-bg'}`}
              href={route.path}
              onClick={() => setIsMenuOpen(false)}
            >
              {route.name}
            </Link>
          </NavbarMenuItem>
        ))}
        {!isLoggedIn && (
          <NavbarMenuItem className="mt-4">
            <Link href="/login" className="w-full block" onClick={() => setIsMenuOpen(false)}>
              <Button variant="cta" className="w-full">Login</Button>
            </Link>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </HeroNavbar>
  );
}

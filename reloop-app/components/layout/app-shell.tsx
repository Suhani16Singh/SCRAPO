"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "@/components/brand/logo";
import { buttonClass } from "@/components/ui/button";
import { formatNumber, roleLabel } from "@/lib/format";
import { homeForRole } from "@/lib/prototype/model";
import { usePrototype } from "@/lib/prototype/session";
import { cx } from "@/lib/cx";
import type { Role } from "@/lib/types";

const donorNav = [
  { href: "/dashboard", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { href: "/devices/new", label: "List a device", icon: "M12 4v16m8-8H4" },
  { href: "/pickups", label: "Pickups", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
  { href: "/marketplace", label: "Marketplace", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
  { href: "/rewards", label: "Rewards", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
];

const recyclerNav = [{ href: "/recycler", label: "Assigned pickups", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" }];

const adminNav = [
  { href: "/admin#users", label: "Users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { href: "/admin#recyclers", label: "Recyclers", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
  { href: "/admin#donations", label: "Donations", icon: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" },
  { href: "/admin#reward-desk", label: "Rewards", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
  { href: "/admin#winners", label: "Winners", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
  { href: "/admin#impact", label: "Impact", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
];

function navFor(role: Role) {
  if (role === "admin") return adminNav;
  if (role === "recycler") return recyclerNav;
  return donorNav;
}

function NavIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, ready, setRole, signOut } = usePrototype();
  const [open, setOpen] = useState(false);
  const items = navFor(profile.role);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function changeRole(role: Role) {
    setRole(role);
    router.push(homeForRole(role));
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Workspace">
      {items.map((item) => {
        const active = pathname === item.href || (item.href.indexOf("#") === -1 && pathname.startsWith(`${item.href}/`));
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            onClick={() => setOpen(false)}
            className={cx(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
              active ? "bg-lime text-[#080908]" : "text-muted hover:bg-card hover:text-ink",
            )}
          >
            <NavIcon d={item.icon} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-line bg-sidebar px-4 py-5 lg:flex">
        <Logo />
        <p className="mt-8 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted">Workspace</p>
        <div className="mt-3">{nav}</div>
        <div className="mt-auto rounded-[18px] border border-line bg-card p-4">
          <p className="text-sm font-semibold text-ink">{ready ? profile.name : "Loading profile"}</p>
          <p className="text-xs text-muted">{roleLabel[profile.role]} · {profile.city}</p>
          {profile.role === "donor" || profile.role === "student" ? (
            <p className="mt-2 font-display text-lg text-lime">{formatNumber(profile.pointsMonth)} pts this month</p>
          ) : null}
          <Link href="/" className="mt-3 inline-block text-xs font-semibold text-lime hover:text-lime-deep">
            Back to the site
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        {/* Top navigation bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-background/95 px-4 py-3 backdrop-blur-md sm:px-6">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-card lg:hidden"
            aria-expanded={open}
            aria-controls="workspace-nav"
            onClick={() => setOpen(true)}
          >
            <span className="sr-only">Open workspace menu</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-ink" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <div className="lg:hidden">
            <Logo />
          </div>

          {/* Search bar (decorative) */}
          <div className="ml-auto hidden items-center gap-2 rounded-xl border border-line bg-card px-3 py-2 text-sm text-muted md:flex">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <circle cx="11" cy="11" r="6" />
              <path d="M16 16l4 4" strokeLinecap="round" />
            </svg>
            <span className="text-muted/60">Search...</span>
          </div>

          <label className="text-xs font-semibold text-muted">
            <span className="sr-only">Demo role</span>
            <select
              className="rounded-xl border border-line bg-card px-3 py-2 text-sm font-semibold text-ink"
              value={profile.role}
              aria-label="Demo role"
              onChange={(event) => changeRole(event.target.value as Role)}
            >
              <option value="donor">Demo role: Donor</option>
              <option value="student">Demo role: Student</option>
              <option value="recycler">Demo role: Recycler</option>
              <option value="admin">Demo role: Admin</option>
            </select>
          </label>

          {/* Notification bell */}
          <button type="button" className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-card text-muted hover:text-ink" aria-label="Notifications">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* Profile avatar */}
          <div className="grid h-9 w-9 place-items-center rounded-full bg-lime text-sm font-bold text-[#080908]">
            {(ready ? profile.name : "?").charAt(0)}
          </div>

          <button type="button" className={buttonClass("ghost", "sm")} onClick={signOut}>
            Reset profile
          </button>
        </header>
        <div className="px-4 py-6 sm:px-6 sm:py-8">{children}</div>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div id="workspace-nav" role="dialog" aria-modal="true" aria-label="Workspace menu" className="absolute inset-y-0 left-0 flex w-[min(100%,18rem)] flex-col bg-sidebar border-r border-line p-4">
            <div className="mb-4 flex items-center justify-between">
              <Logo />
              <button type="button" className="text-sm font-semibold text-muted hover:text-ink" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            {nav}
          </div>
        </div>
      ) : null}
    </div>
  );
}

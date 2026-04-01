"use client";

import { cn } from "@workspace/ui/lib/utils";
import * as React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SidebarTheme = "light" | "dark";
export type SidebarWidth = "sm" | "md" | "lg";

// ─── Constants ────────────────────────────────────────────────────────────────

const WIDTH_CLASSES: Record<SidebarWidth, string> = {
  sm: "w-48",
  md: "w-60",
  lg: "w-72",
};

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({
  className,
  theme = "light",
  width = "md",
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  theme?: SidebarTheme;
  width?: SidebarWidth;
}) {
  return (
    <aside
      data-slot="sidebar"
      data-theme={theme}
      className={cn(
        "flex flex-col h-full shrink-0",
        WIDTH_CLASSES[width],
        theme === "dark"
          ? "bg-zinc-900 text-zinc-100 border-zinc-800"
          : "bg-white text-zinc-900 border-zinc-200",
        "border-r",
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

// ─── SidebarHeader ───────────────────────────────────────────────────────────

function SidebarHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn(
        "flex items-center gap-2 px-4 py-[14px] shrink-0",
        className,
      )}
      {...props}
    />
  );
}

// ─── SidebarContent ──────────────────────────────────────────────────────────

function SidebarContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("flex-1 overflow-y-auto px-2 py-2", className)}
      {...props}
    />
  );
}

// ─── SidebarSection ──────────────────────────────────────────────────────────

function SidebarSection({
  className,
  label,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { label?: string }) {
  return (
    <div
      data-slot="sidebar-section"
      className={cn("mb-4 last:mb-0", className)}
      {...props}
    >
      {label && (
        <p className="px-2 py-1 mb-1 text-xs font-semibold uppercase tracking-wider opacity-40 select-none">
          {label}
        </p>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

// ─── SidebarNavItem ──────────────────────────────────────────────────────────

function SidebarNavItem({
  className,
  icon,
  badge,
  active = false,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: React.ReactNode;
  badge?: string;
  active?: boolean;
}) {
  return (
    <button
      data-slot="sidebar-nav-item"
      data-active={active}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left cursor-pointer",
        active
          ? "bg-zinc-900 text-white font-medium [aside[data-theme=dark]_&]:bg-white [aside[data-theme=dark]_&]:text-zinc-900"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 [aside[data-theme=dark]_&]:text-zinc-400 [aside[data-theme=dark]_&]:hover:bg-zinc-800 [aside[data-theme=dark]_&]:hover:text-zinc-100",
        className,
      )}
      {...props}
    >
      {icon && (
        <span className="shrink-0 size-4 flex items-center justify-center opacity-70 [button[data-active=true]_&]:opacity-100">
          {icon}
        </span>
      )}
      <span className="flex-1 truncate">{children}</span>
      {badge && (
        <span className="ml-auto shrink-0 text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-500 [aside[data-theme=dark]_&]:bg-zinc-800 [aside[data-theme=dark]_&]:text-zinc-400">
          {badge}
        </span>
      )}
    </button>
  );
}

// ─── SidebarDivider ──────────────────────────────────────────────────────────

function SidebarDivider({
  className,
  ...props
}: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      data-slot="sidebar-divider"
      className={cn("my-2 border-current opacity-10", className)}
      {...props}
    />
  );
}

// ─── SidebarFooter ───────────────────────────────────────────────────────────

function SidebarFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn(
        "shrink-0 px-2 py-2 border-t",
        "border-zinc-200 [aside[data-theme=dark]_&]:border-zinc-800",
        className,
      )}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarDivider,
  SidebarFooter,
  SidebarHeader,
  SidebarNavItem,
  SidebarSection,
};

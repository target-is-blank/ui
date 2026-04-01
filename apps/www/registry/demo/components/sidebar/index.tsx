"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarNavItem,
  SidebarSection,
} from "@/registry/components/sidebar";
import { cn } from "@workspace/ui/lib/utils";
import {
  BarChart2,
  Bell,
  Bookmark,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardCopy,
  CreditCard,
  FileText,
  Folder,
  Globe,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  Mail,
  Map,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Star,
  Trash2,
  User,
  Users,
  Zap,
} from "lucide-react";
import * as React from "react";

// ─── Icon Registry ────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={16} />,
  Home: <Home size={16} />,
  Users: <Users size={16} />,
  Settings: <Settings size={16} />,
  FileText: <FileText size={16} />,
  BarChart2: <BarChart2 size={16} />,
  Mail: <Mail size={16} />,
  Bell: <Bell size={16} />,
  Search: <Search size={16} />,
  Bookmark: <Bookmark size={16} />,
  Star: <Star size={16} />,
  Package: <Package size={16} />,
  ShoppingCart: <ShoppingCart size={16} />,
  CreditCard: <CreditCard size={16} />,
  Folder: <Folder size={16} />,
  Calendar: <Calendar size={16} />,
  Map: <Map size={16} />,
  Globe: <Globe size={16} />,
  HelpCircle: <HelpCircle size={16} />,
  User: <User size={16} />,
  LogOut: <LogOut size={16} />,
  Zap: <Zap size={16} />,
};

const ICON_NAMES = Object.keys(ICON_MAP);

// ─── State Model ─────────────────────────────────────────────────────────────

interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: string;
  active?: boolean;
}

interface SidebarSection {
  id: string;
  label?: string;
  items: NavItem[];
}

interface SidebarConfig {
  appName: string;
  showHeader: boolean;
  sections: SidebarSection[];
  showFooter: boolean;
  footerLabel: string;
  theme: "light" | "dark";
  width: "sm" | "md" | "lg";
}

// ─── Presets ──────────────────────────────────────────────────────────────────

const PRESETS: Record<string, SidebarConfig> = {
  dashboard: {
    appName: "Acme Inc.",
    showHeader: true,
    sections: [
      {
        id: "main",
        label: "Main",
        items: [
          {
            id: "1",
            label: "Dashboard",
            icon: "LayoutDashboard",
            active: true,
          },
          { id: "2", label: "Analytics", icon: "BarChart2" },
          { id: "3", label: "Users", icon: "Users", badge: "12" },
        ],
      },
      {
        id: "workspace",
        label: "Workspace",
        items: [
          { id: "4", label: "Projects", icon: "Folder" },
          { id: "5", label: "Documents", icon: "FileText" },
          { id: "6", label: "Calendar", icon: "Calendar" },
        ],
      },
    ],
    showFooter: true,
    footerLabel: "Account",
    theme: "light",
    width: "md",
  },
  settings: {
    appName: "Settings",
    showHeader: true,
    sections: [
      {
        id: "general",
        label: "General",
        items: [
          { id: "1", label: "Profile", icon: "User", active: true },
          { id: "2", label: "Account", icon: "Settings" },
          { id: "3", label: "Notifications", icon: "Bell", badge: "3" },
        ],
      },
      {
        id: "billing",
        label: "Billing",
        items: [
          { id: "4", label: "Plans", icon: "Zap" },
          { id: "5", label: "Billing", icon: "CreditCard" },
          { id: "6", label: "Invoices", icon: "FileText" },
        ],
      },
    ],
    showFooter: true,
    footerLabel: "Log out",
    theme: "light",
    width: "md",
  },
  ecommerce: {
    appName: "ShopBase",
    showHeader: true,
    sections: [
      {
        id: "store",
        label: "Store",
        items: [
          { id: "1", label: "Overview", icon: "Home", active: true },
          { id: "2", label: "Orders", icon: "ShoppingCart", badge: "7" },
          { id: "3", label: "Products", icon: "Package" },
          { id: "4", label: "Customers", icon: "Users" },
        ],
      },
      {
        id: "marketing",
        label: "Marketing",
        items: [
          { id: "5", label: "Campaigns", icon: "Star" },
          { id: "6", label: "Reports", icon: "BarChart2" },
        ],
      },
    ],
    showFooter: true,
    footerLabel: "Account",
    theme: "dark",
    width: "md",
  },
  minimal: {
    appName: "",
    showHeader: false,
    sections: [
      {
        id: "nav",
        items: [
          { id: "1", label: "Home", icon: "Home", active: true },
          { id: "2", label: "Search", icon: "Search" },
          { id: "3", label: "Bookmarks", icon: "Bookmark" },
          { id: "4", label: "Map", icon: "Map" },
          { id: "5", label: "Help", icon: "HelpCircle" },
        ],
      },
    ],
    showFooter: false,
    footerLabel: "",
    theme: "light",
    width: "sm",
  },
};

// ─── Code Generator ───────────────────────────────────────────────────────────

function generateTSX(config: SidebarConfig): string {
  const usedIcons = new Set<string>();
  config.sections.forEach((section) => {
    section.items.forEach((item) => {
      if (item.icon) usedIcons.add(item.icon);
    });
  });
  if (config.showFooter) usedIcons.add("User");

  const iconImports =
    usedIcons.size > 0 ? [...usedIcons].sort().join(",\n  ") : "User";

  const imports = [
    "Sidebar",
    "SidebarContent",
    config.showFooter ? "SidebarFooter" : null,
    config.showHeader ? "SidebarHeader" : null,
    "SidebarNavItem",
    config.sections.some((s) => s.label || config.sections.length > 1)
      ? "SidebarSection"
      : null,
  ]
    .filter(Boolean)
    .join(",\n  ");

  const sectionsCode = config.sections
    .map((section) => {
      const labelProp = section.label ? ` label="${section.label}"` : "";
      const itemsCode = section.items
        .map((item) => {
          const iconProp = item.icon
            ? ` icon={<${item.icon} size={16} />}`
            : "";
          const activeProp = item.active ? " active" : "";
          const badgeProp = item.badge ? ` badge="${item.badge}"` : "";
          return `          <SidebarNavItem${iconProp}${activeProp}${badgeProp}>\n            ${item.label}\n          </SidebarNavItem>`;
        })
        .join("\n");
      return `        <SidebarSection${labelProp}>\n${itemsCode}\n        </SidebarSection>`;
    })
    .join("\n");

  const headerCode = config.showHeader
    ? `\n      <SidebarHeader>\n        <span className="font-semibold text-sm">${config.appName}</span>\n      </SidebarHeader>`
    : "";

  const footerCode = config.showFooter
    ? `\n      <SidebarFooter>\n        <SidebarNavItem icon={<User size={16} />}>\n          ${config.footerLabel || "Account"}\n        </SidebarNavItem>\n      </SidebarFooter>`
    : "";

  const widthProp = config.width !== "md" ? ` width="${config.width}"` : "";
  const themeProp = config.theme !== "light" ? ` theme="${config.theme}"` : "";

  return `"use client";

import {
  ${imports},
} from "@/components/targetblank/components/sidebar";
import {
  ${iconImports},
} from "lucide-react";

export function AppSidebar() {
  return (
    <Sidebar${widthProp}${themeProp}>${headerCode}
      <SidebarContent>
${sectionsCode}
      </SidebarContent>${footerCode}
    </Sidebar>
  );
}`;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 8);
}

function defaultItem(): NavItem {
  return { id: uid(), label: "New Item", icon: "Home" };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
        active
          ? "bg-zinc-900 text-white"
          : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100",
      )}
    >
      {children}
    </button>
  );
}

function PresetCard({
  name,
  label,
  description,
  active,
  onClick,
}: {
  name: string;
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all",
        active
          ? "border-zinc-900 bg-zinc-50"
          : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50",
      )}
    >
      <div className="font-medium text-zinc-900">{label}</div>
      <div className="text-xs text-zinc-500 mt-0.5">{description}</div>
    </button>
  );
}

function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (icon: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2 py-1 rounded border border-zinc-200 bg-white hover:bg-zinc-50 text-xs text-zinc-600"
      >
        <span className="size-3.5 flex items-center justify-center">
          {ICON_MAP[value]}
        </span>
        <span>{value}</span>
        <ChevronDown size={10} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-lg border border-zinc-200 shadow-lg p-2 grid grid-cols-5 gap-1 w-48">
          {ICON_NAMES.map((name) => (
            <button
              key={name}
              title={name}
              onClick={() => {
                onChange(name);
                setOpen(false);
              }}
              className={cn(
                "flex items-center justify-center size-7 rounded hover:bg-zinc-100 transition-colors",
                value === name && "bg-zinc-100",
              )}
            >
              <span className="size-4 flex items-center justify-center text-zinc-600">
                {ICON_MAP[name]}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Builder ─────────────────────────────────────────────────────────────

export default function SidebarBuilderDemo() {
  const [config, setConfig] = React.useState<SidebarConfig>(PRESETS.dashboard);
  const [tab, setTab] = React.useState<"presets" | "items" | "style">("items");
  const [activePreset, setActivePreset] = React.useState<string>("dashboard");
  const [copied, setCopied] = React.useState(false);
  const [expandedSection, setExpandedSection] = React.useState<string | null>(
    config.sections[0]?.id ?? null,
  );
  const [showCode, setShowCode] = React.useState(false);

  const code = React.useMemo(() => generateTSX(config), [config]);

  function applyPreset(name: string) {
    setConfig(structuredClone(PRESETS[name]));
    setActivePreset(name);
    setExpandedSection(PRESETS[name].sections[0]?.id ?? null);
  }

  function copyCode() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function updateConfig(patch: Partial<SidebarConfig>) {
    setActivePreset("");
    setConfig((c) => ({ ...c, ...patch }));
  }

  function addSection() {
    const newSection: SidebarSection = {
      id: uid(),
      label: "New Section",
      items: [defaultItem()],
    };
    setConfig((c) => ({ ...c, sections: [...c.sections, newSection] }));
    setExpandedSection(newSection.id);
    setActivePreset("");
  }

  function removeSection(sectionId: string) {
    setConfig((c) => ({
      ...c,
      sections: c.sections.filter((s) => s.id !== sectionId),
    }));
    if (expandedSection === sectionId) setExpandedSection(null);
    setActivePreset("");
  }

  function updateSection(sectionId: string, patch: Partial<SidebarSection>) {
    setConfig((c) => ({
      ...c,
      sections: c.sections.map((s) =>
        s.id === sectionId ? { ...s, ...patch } : s,
      ),
    }));
    setActivePreset("");
  }

  function addItem(sectionId: string) {
    setConfig((c) => ({
      ...c,
      sections: c.sections.map((s) =>
        s.id === sectionId ? { ...s, items: [...s.items, defaultItem()] } : s,
      ),
    }));
    setActivePreset("");
  }

  function updateItem(
    sectionId: string,
    itemId: string,
    patch: Partial<NavItem>,
  ) {
    setConfig((c) => ({
      ...c,
      sections: c.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              items: s.items.map((item) =>
                item.id === itemId ? { ...item, ...patch } : item,
              ),
            }
          : s,
      ),
    }));
    setActivePreset("");
  }

  function removeItem(sectionId: string, itemId: string) {
    setConfig((c) => ({
      ...c,
      sections: c.sections.map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.filter((item) => item.id !== itemId) }
          : s,
      ),
    }));
    setActivePreset("");
  }

  function setActiveItem(sectionId: string, itemId: string) {
    setConfig((c) => ({
      ...c,
      sections: c.sections.map((s) => ({
        ...s,
        items: s.items.map((item) => ({
          ...item,
          active: s.id === sectionId && item.id === itemId,
        })),
      })),
    }));
    setActivePreset("");
  }

  return (
    <div className="w-full flex flex-col gap-0 rounded-xl border border-zinc-200 overflow-hidden bg-white not-prose">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-100 bg-zinc-50">
        <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">
          Sidebar Builder
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCode((s) => !s)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              showCode
                ? "bg-zinc-900 text-white"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200",
            )}
          >
            <FileText size={12} />
            {showCode ? "Hide code" : "Show code"}
          </button>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-700 transition-colors"
          >
            {copied ? (
              <>
                <Check size={12} />
                Copied!
              </>
            ) : (
              <>
                <ClipboardCopy size={12} />
                Copy TSX
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex min-h-[520px]">
        {/* Controls panel */}
        <div className="w-64 shrink-0 border-r border-zinc-100 flex flex-col">
          {/* Tabs */}
          <div className="flex items-center gap-1 px-3 py-2.5 border-b border-zinc-100">
            <TabBtn
              active={tab === "presets"}
              onClick={() => setTab("presets")}
            >
              Presets
            </TabBtn>
            <TabBtn active={tab === "items"} onClick={() => setTab("items")}>
              Items
            </TabBtn>
            <TabBtn active={tab === "style"} onClick={() => setTab("style")}>
              Style
            </TabBtn>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {/* Presets tab */}
            {tab === "presets" && (
              <div className="space-y-2">
                <PresetCard
                  name="dashboard"
                  label="Dashboard"
                  description="Analytics and workspace nav"
                  active={activePreset === "dashboard"}
                  onClick={() => applyPreset("dashboard")}
                />
                <PresetCard
                  name="settings"
                  label="Settings"
                  description="Profile, billing, notifications"
                  active={activePreset === "settings"}
                  onClick={() => applyPreset("settings")}
                />
                <PresetCard
                  name="ecommerce"
                  label="E-commerce"
                  description="Store management, dark theme"
                  active={activePreset === "ecommerce"}
                  onClick={() => applyPreset("ecommerce")}
                />
                <PresetCard
                  name="minimal"
                  label="Minimal"
                  description="Compact, icon-forward nav"
                  active={activePreset === "minimal"}
                  onClick={() => applyPreset("minimal")}
                />
              </div>
            )}

            {/* Items tab */}
            {tab === "items" && (
              <div className="space-y-3">
                {/* Header toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-600">
                    App Name
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.showHeader}
                      onChange={(e) =>
                        updateConfig({ showHeader: e.target.checked })
                      }
                      className="rounded"
                    />
                    <span className="text-xs text-zinc-500">Show</span>
                  </label>
                </div>
                {config.showHeader && (
                  <input
                    value={config.appName}
                    onChange={(e) => updateConfig({ appName: e.target.value })}
                    placeholder="App name…"
                    className="w-full px-2.5 py-1.5 text-xs rounded-md border border-zinc-200 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                )}

                {/* Sections */}
                <div className="space-y-2">
                  {config.sections.map((section) => (
                    <div
                      key={section.id}
                      className="rounded-lg border border-zinc-200 overflow-hidden"
                    >
                      {/* Section header */}
                      <div className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-50 border-b border-zinc-100">
                        <button
                          onClick={() =>
                            setExpandedSection(
                              expandedSection === section.id
                                ? null
                                : section.id,
                            )
                          }
                          className="flex-1 flex items-center gap-1.5 text-left"
                        >
                          {expandedSection === section.id ? (
                            <ChevronDown size={11} className="text-zinc-400" />
                          ) : (
                            <ChevronUp size={11} className="text-zinc-400" />
                          )}
                          <input
                            value={section.label ?? ""}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              updateSection(section.id, {
                                label: e.target.value || undefined,
                              })
                            }
                            placeholder="Section label (optional)"
                            className="flex-1 text-xs bg-transparent focus:outline-none text-zinc-600 placeholder:text-zinc-400"
                          />
                        </button>
                        {config.sections.length > 1 && (
                          <button
                            onClick={() => removeSection(section.id)}
                            className="text-zinc-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={11} />
                          </button>
                        )}
                      </div>

                      {/* Items */}
                      {expandedSection === section.id && (
                        <div className="p-2 space-y-1.5">
                          {section.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-1.5"
                            >
                              <IconPicker
                                value={item.icon}
                                onChange={(icon) =>
                                  updateItem(section.id, item.id, { icon })
                                }
                              />
                              <input
                                value={item.label}
                                onChange={(e) =>
                                  updateItem(section.id, item.id, {
                                    label: e.target.value,
                                  })
                                }
                                className="flex-1 min-w-0 px-2 py-1 text-xs rounded border border-zinc-200 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
                              />
                              <input
                                value={item.badge ?? ""}
                                onChange={(e) =>
                                  updateItem(section.id, item.id, {
                                    badge: e.target.value || undefined,
                                  })
                                }
                                placeholder="badge"
                                className="w-10 px-1.5 py-1 text-xs rounded border border-zinc-200 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-400 text-center"
                              />
                              <button
                                onClick={() =>
                                  setActiveItem(section.id, item.id)
                                }
                                className={cn(
                                  "size-5 rounded flex items-center justify-center transition-colors",
                                  item.active
                                    ? "bg-zinc-900 text-white"
                                    : "border border-zinc-200 hover:bg-zinc-100",
                                )}
                                title="Set as active"
                              >
                                <Check size={9} />
                              </button>
                              <button
                                onClick={() => removeItem(section.id, item.id)}
                                className="text-zinc-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addItem(section.id)}
                            className="w-full flex items-center gap-1 px-2 py-1 text-xs text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 rounded transition-colors"
                          >
                            <Plus size={11} />
                            Add item
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={addSection}
                    className="w-full flex items-center gap-1.5 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 rounded-lg border border-dashed border-zinc-200 hover:border-zinc-300 transition-colors"
                  >
                    <Plus size={11} />
                    Add section
                  </button>
                </div>

                {/* Footer toggle */}
                <div className="pt-1 border-t border-zinc-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-zinc-600">
                      Footer
                    </span>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.showFooter}
                        onChange={(e) =>
                          updateConfig({ showFooter: e.target.checked })
                        }
                        className="rounded"
                      />
                      <span className="text-xs text-zinc-500">Show</span>
                    </label>
                  </div>
                  {config.showFooter && (
                    <input
                      value={config.footerLabel}
                      onChange={(e) =>
                        updateConfig({ footerLabel: e.target.value })
                      }
                      placeholder="Footer label…"
                      className="w-full px-2.5 py-1.5 text-xs rounded-md border border-zinc-200 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Style tab */}
            {tab === "style" && (
              <div className="space-y-4">
                {/* Theme */}
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1.5">
                    Theme
                  </label>
                  <div className="flex gap-2">
                    {(["light", "dark"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => updateConfig({ theme: t })}
                        className={cn(
                          "flex-1 py-2 rounded-lg border text-xs font-medium capitalize transition-colors",
                          config.theme === t
                            ? "border-zinc-900 bg-zinc-900 text-white"
                            : "border-zinc-200 text-zinc-500 hover:border-zinc-300",
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Width */}
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1.5">
                    Width
                  </label>
                  <div className="flex gap-2">
                    {(["sm", "md", "lg"] as const).map((w) => (
                      <button
                        key={w}
                        onClick={() => updateConfig({ width: w })}
                        className={cn(
                          "flex-1 py-2 rounded-lg border text-xs font-medium capitalize transition-colors",
                          config.width === w
                            ? "border-zinc-900 bg-zinc-900 text-white"
                            : "border-zinc-200 text-zinc-500 hover:border-zinc-300",
                        )}
                      >
                        {w === "sm"
                          ? "Narrow"
                          : w === "md"
                            ? "Default"
                            : "Wide"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview info */}
                <div className="rounded-lg bg-zinc-50 border border-zinc-100 p-3 text-xs text-zinc-400 space-y-1">
                  <div className="font-medium text-zinc-500">Preview stats</div>
                  <div>
                    Sections:{" "}
                    <span className="text-zinc-700">
                      {config.sections.length}
                    </span>
                  </div>
                  <div>
                    Items:{" "}
                    <span className="text-zinc-700">
                      {config.sections.reduce(
                        (acc, s) => acc + s.items.length,
                        0,
                      )}
                    </span>
                  </div>
                  <div>
                    Width:{" "}
                    <span className="text-zinc-700">
                      {config.width === "sm"
                        ? "192px"
                        : config.width === "md"
                          ? "240px"
                          : "288px"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview + Code panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Preview */}
          <div
            className={cn(
              "flex-1 flex items-start justify-center transition-all",
              config.theme === "dark" ? "bg-zinc-800" : "bg-zinc-100",
              showCode ? "py-6" : "py-10",
            )}
          >
            <div className="shadow-xl rounded-xl overflow-hidden border border-zinc-200/50">
              <Sidebar theme={config.theme} width={config.width}>
                {config.showHeader && config.appName && (
                  <SidebarHeader>
                    <span className="font-semibold text-sm">
                      {config.appName}
                    </span>
                  </SidebarHeader>
                )}
                <SidebarContent>
                  {config.sections.map((section) => (
                    <SidebarSection key={section.id} label={section.label}>
                      {section.items.map((item) => (
                        <SidebarNavItem
                          key={item.id}
                          icon={item.icon ? ICON_MAP[item.icon] : undefined}
                          active={item.active}
                          badge={item.badge}
                          onClick={() => setActiveItem(section.id, item.id)}
                        >
                          {item.label}
                        </SidebarNavItem>
                      ))}
                    </SidebarSection>
                  ))}
                </SidebarContent>
                {config.showFooter && (
                  <SidebarFooter>
                    <SidebarNavItem icon={<User size={16} />}>
                      {config.footerLabel || "Account"}
                    </SidebarNavItem>
                  </SidebarFooter>
                )}
              </Sidebar>
            </div>
          </div>

          {/* Code output */}
          {showCode && (
            <div className="border-t border-zinc-200 bg-zinc-950">
              <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
                <span className="text-xs font-mono text-zinc-500">
                  AppSidebar.tsx
                </span>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check size={11} />
                      Copied
                    </>
                  ) : (
                    <>
                      <ClipboardCopy size={11} />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-[11px] leading-relaxed text-zinc-300 overflow-x-auto max-h-52 font-mono">
                <code>{code}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

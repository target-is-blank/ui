"use client";

import { Input } from "@workspace/ui/components/ui/input";
import { cn } from "@workspace/ui/lib/utils";
import { formatHex, oklch, parse } from "culori";
import { ChevronDownIcon } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { useEffect, useId, useState } from "react";
import { Icons } from "../icons";
import { CodeBlock, Pre } from "./codeblock";

const initialShadcnColors = {
  background: { light: "oklch(1 0 0)", dark: "oklch(0.145 0 0)" },
  foreground: { light: "oklch(0.145 0 0)", dark: "oklch(0.985 0 0)" },
  card: { light: "oklch(1 0 0)", dark: "oklch(0.205 0 0)" },
  "card-foreground": {
    light: "oklch(0.145 0 0)",
    dark: "oklch(0.985 0 0)",
  },
  popover: { light: "oklch(1 0 0)", dark: "oklch(0.269 0 0)" },
  "popover-foreground": {
    light: "oklch(0.145 0 0)",
    dark: "oklch(0.985 0 0)",
  },
  primary: { light: "oklch(0.205 0 0)", dark: "oklch(0.922 0 0)" },
  "primary-foreground": {
    light: "oklch(0.985 0 0)",
    dark: "oklch(0.205 0 0)",
  },
  secondary: { light: "oklch(0.97 0 0)", dark: "oklch(0.269 0 0)" },
  "secondary-foreground": {
    light: "oklch(0.205 0 0)",
    dark: "oklch(0.985 0 0)",
  },
  muted: { light: "oklch(0.97 0 0)", dark: "oklch(0.269 0 0)" },
  "muted-foreground": { light: "oklch(0.556 0 0)", dark: "oklch(0.708 0 0)" },
  accent: { light: "oklch(0.97 0 0)", dark: "oklch(0.371 0 0)" },
  "accent-foreground": {
    light: "oklch(0.205 0 0)",
    dark: "oklch(0.985 0 0)",
  },
  destructive: {
    light: "oklch(0.577 0.245 27.325)",
    dark: "oklch(0.704 0.191 22.216)",
  },
  border: { light: "oklch(0.922 0 0)", dark: "oklch(1 0 0 / 10%)" },
  input: { light: "oklch(0.922 0 0)", dark: "oklch(1 0 0 / 15%)" },
  ring: { light: "oklch(0.708 0 0)", dark: "oklch(0.556 0 0)" },
  "chart-1": {
    light: "oklch(0.646 0.222 41.116)",
    dark: "oklch(0.488 0.243 264.376)",
  },
  "chart-2": {
    light: "oklch(0.6 0.118 184.704)",
    dark: "oklch(0.696 0.17 162.48)",
  },
  "chart-3": {
    light: "oklch(0.398 0.07 227.392)",
    dark: "oklch(0.769 0.188 70.08)",
  },
  "chart-4": {
    light: "oklch(0.828 0.189 84.429)",
    dark: "oklch(0.627 0.265 303.9)",
  },
  "chart-5": {
    light: "oklch(0.769 0.188 70.08)",
    dark: "oklch(0.645 0.246 16.439)",
  },
  sidebar: { light: "oklch(0.985 0 0)", dark: "oklch(0.205 0 0)" },
  "sidebar-foreground": {
    light: "oklch(0.145 0 0)",
    dark: "oklch(0.985 0 0)",
  },
  "sidebar-primary": {
    light: "oklch(0.205 0 0)",
    dark: "oklch(0.488 0.243 264.376)",
  },
  "sidebar-primary-foreground": {
    light: "oklch(0.985 0 0)",
    dark: "oklch(0.985 0 0)",
  },
  "sidebar-accent": { light: "oklch(0.97 0 0)", dark: "oklch(0.269 0 0)" },
  "sidebar-accent-foreground": {
    light: "oklch(0.205 0 0)",
    dark: "oklch(0.985 0 0)",
  },
  "sidebar-border": { light: "oklch(0.922 0 0)", dark: "oklch(1 0 0 / 10%)" },
  "sidebar-ring": { light: "oklch(0.708 0 0)", dark: "oklch(0.439 0 0)" },
};

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (newColor: string) => void;
}) {
  const id = useId();
  const [hex, setHex] = useState(oklchToHex(value));

  useEffect(() => {
    setHex(oklchToHex(value));
  }, [value]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    setHex(newHex);
    if (/^#([0-9a-f]{3}){1,2}$/i.test(newHex)) {
      onChange(toOklch(newHex));
    }
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    setHex(newHex);
    onChange(toOklch(newHex));
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <div
            className="w-5 h-5 rounded-md border"
            style={{ backgroundColor: hex }}
          />
          <input
            type="color"
            className="absolute w-5 h-5 opacity-0 cursor-pointer"
            value={hex}
            onChange={handleColorPickerChange}
          />
        </div>
        <Input
          id={id}
          value={hex}
          onChange={handleHexChange}
          className="pl-10"
        />
      </div>
    </div>
  );
}

const oklchToHex = (oklchStr: string | undefined): string => {
  if (!oklchStr) return "#000000";
  const parsed = parse(oklchStr);
  if (!parsed) return "#000000";
  if (parsed.alpha) {
    delete parsed.alpha;
  }
  return formatHex(parsed);
};

const handleColorChange =
  (
    setColors: React.Dispatch<React.SetStateAction<typeof initialShadcnColors>>,
    name: string,
    theme: "light" | "dark",
  ) =>
  (newOklch: string) => {
    setColors((prev) => ({
      ...prev,
      [name as keyof typeof prev]: {
        ...prev[name as keyof typeof prev],
        [theme]: newOklch,
      },
    }));
  };

const themeStructure = {
  "Primary Colors": ["primary", "primary-foreground"],
  "Secondary Colors": ["secondary", "secondary-foreground"],
  "Accent Colors": ["accent", "accent-foreground", "destructive"],
  "Base Colors": ["background", "foreground", "muted", "muted-foreground"],
  "Card Colors": ["card", "card-foreground"],
  "Popover Colors": ["popover", "popover-foreground"],
  "Other Colors": ["border", "input", "ring"],
  "Chart Colors": ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  "Sidebar Colors": [
    "sidebar",
    "sidebar-foreground",
    "sidebar-primary",
    "sidebar-primary-foreground",
    "sidebar-accent",
    "sidebar-accent-foreground",
    "sidebar-border",
    "sidebar-ring",
  ],
};

export const ColorPalette = () => {
  const { theme } = useTheme() as { theme: "light" | "dark" | undefined };
  const [colors, setColors] =
    useState<typeof initialShadcnColors>(initialShadcnColors);
  const [openSections, setOpenSections] = useState<string[]>([
    "Primary Colors",
  ]);

  const toggleSection = (category: string) => {
    setOpenSections((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(themeStructure).map(([category, names]) => {
        const isOpen = openSections.includes(category);
        return (
          <div key={category} className="border border-muted rounded-md">
            <button
              className="w-full p-4 flex justify-between items-center text-left text-sm font-medium"
              onClick={() => toggleSection(category)}
            >
              {category}
              <ChevronDownIcon
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            {isOpen && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-t border-muted">
                {(names as (keyof typeof initialShadcnColors)[]).map((name) => (
                  <ColorInput
                    key={name}
                    label={name.charAt(0).toUpperCase() + name.slice(1)}
                    value={
                      colors[name as keyof typeof colors][theme ?? "light"]
                    }
                    onChange={handleColorChange(
                      setColors,
                      name,
                      theme ?? "light",
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
      <ThemeGenerator colors={colors} />
    </div>
  );
};

const toOklch = (color: string | undefined) => {
  if (!color) return "";
  const parsed = parse(color);
  if (!parsed) return "";
  const oklchColor = oklch(parsed);
  if (!oklchColor) return "";

  const l = oklchColor.l.toFixed(4);
  const c = oklchColor.c.toFixed(4);
  const h = oklchColor.h || 0;

  if (oklchColor.alpha && oklchColor.alpha < 1) {
    return `oklch(${l} ${c} ${h} / ${oklchColor.alpha.toFixed(2)})`;
  }

  return `oklch(${l} ${c} ${h})`;
};

const ThemeGenerator = ({ colors }: { colors: typeof initialShadcnColors }) => {
  const [css, setCss] = useState("");

  useEffect(() => {
    const generateCss = () => {
      let lightCss = ":root {\n  --radius: 0.625rem;\n";
      let darkCss = ".dark {\n";

      Object.entries(colors).forEach(([name, values]) => {
        lightCss += `  --${name}: ${values.light};\n`;
        darkCss += `  --${name}: ${values.dark};\n`;
      });

      lightCss += "}";
      darkCss += "}";

      setCss(`${lightCss}\n\n${darkCss}`);
    };

    generateCss();
  }, [colors]);

  return (
    <div className="mt-8">
      <CodeBlock
        icon={<Icons.css className="fill-primary" />}
        title="theme.css"
      >
        <Pre>
          <code>{css}</code>
        </Pre>
      </CodeBlock>
    </div>
  );
};

import { jsonLd } from "@/lib/json-ld";
import config from "@workspace/ui/config";
import "@workspace/ui/globals.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    template: "%s - Target Blank",
    default: "Target Blank - UI",
  },
  description:
    "Fully animated, open-source component distribution built with React, TypeScript, Tailwind CSS, Motion and Shadcn CLI. Browse a list of components you can install, modify, and use in your projects.",
  keywords: [
    "Target Blank",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
    "Open-source components",
    "Target Blank components",
    "UI library",
  ],
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/apple-touch-icon.png",
    },
  ],
  authors: [
    {
      name: config.author.name,
      url: config.author.url,
    },
  ],
  publisher: "Target Blank",
  openGraph: {
    title: "Target Blank",
    description:
      "Fully animated, open-source component distribution built with React, TypeScript, Tailwind CSS, Motion and Shadcn CLI. Browse a list of components you can install, modify, and use in your projects.",
    url: config.url,
    siteName: "Target Blank",
    images: [
      {
        url: `${config.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Target Blank",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@xehoss",
    title: "Target Blank",
    description:
      "Distribution of open-source components developed entirely in collaboration with designers, built with React, TypeScript, Tailwind CSS, Motion and Shadcn CLI. Explore a range of components, each more unique than the last.",
    images: [
      {
        url: `${config.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Target Blank",
      },
    ],
  },
};

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}

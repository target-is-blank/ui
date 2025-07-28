import type { MetadataRoute } from "next";

import { source } from "@/lib/source";
import config from "@workspace/ui/config";
import { getGithubLastEdit } from "fumadocs-core/server";

export const dynamic = "force-dynamic";
export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string): string => new URL(path, config.url).toString();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: url("/"),
      changeFrequency: "monthly",
      priority: 1,
      lastModified: new Date(),
    },
    {
      url: url("/docs"),
      changeFrequency: "weekly",
      priority: 0.9,
      lastModified: new Date(),
    },
  ];

  const docPages = await Promise.all(
    source.getPages().map(async (page) => {
      const time = await getGithubLastEdit({
        owner: config.author.github,
        repo: "ui",
        path: `content/docs/${page.file.path}`,
      });

      // Determine priority and change frequency based on page type
      let priority = 0.5;
      let changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] =
        "weekly";

      const slug = page.url.toLowerCase();

      // Higher priority for main documentation pages
      if (
        slug.includes("/installation") ||
        slug === "/docs" ||
        slug === "/docs/cli"
      ) {
        priority = 0.8;
        changeFrequency = "monthly";
      }
      // Medium-high priority for components and hooks
      else if (slug.includes("/components/") || slug.includes("/hooks/")) {
        priority = 0.7;
        changeFrequency = "weekly";
      }
      // Medium priority for animations, backgrounds, buttons, text
      else if (
        slug.includes("/animations/") ||
        slug.includes("/backgrounds/") ||
        slug.includes("/buttons/") ||
        slug.includes("/text/")
      ) {
        priority = 0.6;
        changeFrequency = "weekly";
      }
      // Lower priority for configuration and setup pages
      else if (slug.includes("/shadcn/") || slug.includes("/mcp")) {
        priority = 0.5;
        changeFrequency = "monthly";
      }

      return {
        url: url(page.url),
        lastModified: time ? new Date(time) : new Date(),
        changeFrequency,
        priority,
      } as MetadataRoute.Sitemap[number];
    }),
  );

  return [...staticPages, ...docPages];
}

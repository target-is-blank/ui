import type { MetadataRoute } from "next";

import { source } from "@/lib/source";
import config from "@workspace/ui/config";
import { getGithubLastEdit } from "fumadocs-core/server";
export const dynamic = "force-dynamic";

export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string): string => new URL(path, config.url).toString();

  return [
    {
      url: url("/"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: url("/docs"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...(await Promise.all(
      source.getPages().map(async (page) => {
        const time = await getGithubLastEdit({
          owner: config.author.github,
          repo: "ui",
          path: `content/docs/${page.file.path}`,
        });

        return {
          url: url(page.url),
          lastModified: time ? new Date(time) : undefined,
          changeFrequency: "weekly",
          priority: 0.5,
        } as MetadataRoute.Sitemap[number];
      }),
    )),
  ];
}

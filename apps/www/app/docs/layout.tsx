import { baseOptions } from "@/app/layout.config";
import { Icons } from "@/components/icons";
import { source } from "@/lib/source";
import config from "@workspace/ui/config";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      githubUrl={config.github.url}
      sidebar={{
        tabs: [
          {
            title: "Components",
            description: "Hello World!",
            // active for `/docs/components` and sub routes like `/docs/components/button`
            url: "/docs/buttons",
            // optionally, you can specify a set of urls which activates the item
            // urls: new Set(['/docs/test', '/docs/components']),
          },
          {
            title: "Icons",
            description: "Hello World!",
            url: "/docs/icons",
          },
        ],
      }}
      links={[
        {
          icon: <Icons.twitter />,
          url: config.x.url,
          text: "X",
          type: "icon",
        },
      ]}
      tree={source.pageTree}
      {...baseOptions}
    >
      {children}
    </DocsLayout>
  );
}

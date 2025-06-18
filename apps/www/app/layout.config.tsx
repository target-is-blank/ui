import { Icons } from "@/components/icons";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <Icons.logo containerClassName="md:mt-0.5 md:mb-2.5" size="sm" betaTag />
    ),
  },
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [],
};

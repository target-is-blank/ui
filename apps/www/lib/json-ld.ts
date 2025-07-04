export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://targentblank.dev/#website",
      url: "https://targentblank.dev",
      name: "Targent Blank",
      description:
        "Distribution of open-source components developed entirely in collaboration with designers, built with React, TypeScript, Tailwind CSS, Motion and Shadcn CLI. Explore a range of components, each more unique than the last.",
      inLanguage: "en",
      publisher: {
        "@id": "https://targentblank.dev/#organization",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://targentblank.dev/#organization",
      name: "Targent Blank",
      url: "https://targentblank.dev",
      logo: {
        "@type": "ImageObject",
        url: "https://targentblank.dev/icon-logo.png",
        width: 512,
        height: 512,
      },
    },
  ],
};

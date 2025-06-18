export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://targentblank.dev/#website",
      url: "https://targentblank.dev",
      name: "Targent Blank",
      description:
        "Fully animated, open-source component distribution built with React, TypeScript, Tailwind CSS, Motion and Shadcn CLI. Browse a list of components you can install, modify, and use in your projects.",
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

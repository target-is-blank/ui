"use client";

import { SplashScreen } from "@/components/splash-screen";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import Link from "next/link";

export default function HomePage() {
  const isMobile = useIsMobile();

  return (
    <main className="relative flex flex-1 flex-col justify-center text-center">
      <h1 className="mb-4 text-2xl font-bold">Hello World</h1>
      <SplashScreen transition={true} />
      <p className="text-fd-muted-foreground">
        You can open{" "}
        <Link
          href="/docs"
          className="text-fd-foreground font-semibold underline"
        >
          /docs
        </Link>{" "}
        and see the documentation.
      </p>
    </main>
  );
}

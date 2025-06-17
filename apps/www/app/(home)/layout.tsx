import { baseOptions } from "@/app/layout.config";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <HomeLayout {...baseOptions}>{children}</HomeLayout>;
}

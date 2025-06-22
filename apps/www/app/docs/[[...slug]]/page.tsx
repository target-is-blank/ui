import { CodeBlock, CodeBlockProps, Pre } from "@/components/docs/codeblock";
import { ColorPalette } from "@/components/docs/color-palette";
import { DocsAuthor } from "@/components/docs/docs-author";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { ComponentPreview } from "@/components/docs/docs-component-preview";
import { ComponentInstallation } from "@/components/docs/docs-components-installation";
import { ExternalLink } from "@/components/docs/docs-external-link";
import { source } from "@/lib/source";
import config from "@workspace/ui/config";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { TypeTable } from "fumadocs-ui/components/type-table";
import defaultMdxComponents from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  EditOnGitHub,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();
  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{ style: "clerk" }}
    >
      <DocsBreadcrumb slug={params.slug} />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="-my-1.5">
        {page.data.description}
      </DocsDescription>

      {page.data.author && (
        <DocsAuthor name={page.data.author.name} url={page.data.author?.url} />
      )}

      <div className="flex flex-row gap-2 items-center">
        <EditOnGitHub
          className="border-0"
          href={`${config.github.url}/blob/main/apps/www/content/docs/${params.slug ? `${params.slug.join("/")}.mdx` : "index.mdx"}`}
        />
      </div>

      <DocsBody>
        <MDX
          components={{
            ...defaultMdxComponents,
            ColorPalette,
            ComponentPreview,
            ComponentInstallation,
            TypeTable,
            ExternalLink,
            Steps,
            Step,
            pre: (props: CodeBlockProps) => (
              <CodeBlock {...props} className="">
                <Pre>{props.children}</Pre>
              </CodeBlock>
            ),
          }}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    authors: page.data?.author
      ? [
          {
            name: page.data.author.name,
            ...(page.data.author?.url && { url: page.data.author.url }),
          },
        ]
      : {
          name: config.author.name,
          url: config.author.url,
        },
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      url: config.url,
      siteName: config.name,
      images: [
        {
          url: `${config.url}/og-image.png`,
          width: 1200,
          height: 630,
          alt: config.name,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: config.x.url,
      title: page.data.title,
      description: page.data.description,
      images: [
        {
          url: `${config.url}/og-image.png`,
          width: 1200,
          height: 630,
          alt: config.name,
        },
      ],
    },
  };
}

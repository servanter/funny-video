import { allBlogs } from "contentlayer/generated";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

import { Mdx } from "@/components/mdx/mdx-components";
import "@/styles/mdx.css";

interface PageProps {
  params: {
    slug: string[];
  };
}

async function getBlogFromParams(params: { slug: string[] }) {
  const slug = params?.slug?.join("/");
  const post = allBlogs.find((post) => post.slugAsParams === slug);
  return post || null;
}

export async function generateStaticParams(): Promise<PageProps["params"][]> {
  return allBlogs.map((post) => ({
    slug: post.slugAsParams?.split("/"),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getBlogFromParams(params);
  if (!post) return {};
  return {
    title: `${post.title} | Funny Video Blog`,
    description: post.description,
    alternates: {
      canonical: `https://www.funny-video.top/blog/${post.slugAsParams}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getBlogFromParams(params);

  if (!post) {
    notFound();
  }

  return (
    <article className="container max-w-3xl py-6 lg:py-12">
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
        <h1 className="inline-block font-heading text-4xl lg:text-5xl font-bold">
          {post.title}
        </h1>
        {post.description && (
          <p className="text-xl text-muted-foreground">{post.description}</p>
        )}
      </div>
      <hr className="my-4" />
      <Mdx code={post.body.code} />
      <hr className="my-8" />
      <div className="rounded-lg bg-pink-50 p-6 text-center space-y-3">
        <p className="text-lg font-semibold text-gray-800">
          Ready to create your own funny video?
        </p>
        <p className="text-muted-foreground">
          Try Funny Video for free — no editing skills required.
        </p>
        <Link
          href="/#try-it-now"
          className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
        >
          Try it Free →
        </Link>
      </div>
    </article>
  );
}

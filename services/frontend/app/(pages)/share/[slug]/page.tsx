// page.tsx
import { Metadata } from "next";
import styles from "./page.module.css";
import Link from "next/link";
import HTMLContent from "@/app/components/HTMLContent/HTMLContent";
import { SnippetService } from "@/app/services/snippets.service";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const slug = (await params).slug;
    const response = await SnippetService.getByShareCode(slug);
    if (!response) throw new Error();
    let description = "";
    if (response.expired) {
      description = "Expired";
    } else {
      description = response.snippet.markdown.substring(0, 200) + "...";
    }

    return {
      title: `MDsnip.com - Shared Snippet`,
      description: description,
      openGraph: {
        title: `MDsnip.com - Shared Snippet`,
        description: description,
        url: `https://mdsnip.com/share/${slug}`,
        siteName: "MDsnip",
        type: "website",
      },
    };
  } catch {
    return {
      title: "MDsnip.com",
      description: "View markdown notes on MDsnip.com",
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  return (
    <div>
      <div className={styles.headerContainer}>
        <Link href={"/"}>
          <p>MDsnip</p>
        </Link>
      </div>
      <div className={styles.htmlContainer}>
        <HTMLContent slug={slug}></HTMLContent>
      </div>
    </div>
  );
}

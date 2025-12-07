import styles from "./page.module.css";
import HTMLContent from "@/components/HTMLContent/HTMLContent";
// import { SnippetService } from "@/services/snippets.service";
import { Link, useParams } from "react-router";

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }): Promise<Metadata> {
//   try {
//     const slug = (await params).slug;
//     const response = await SnippetService.getByShareCode(slug);
//     if (!response) throw new Error();
//     let description = "";
//     if (response.expired) {
//       description = "Expired";
//     } else {
//       description = response.snippet.markdown.substring(0, 200) + "...";
//     }

//     return {
//       title: `MDsnip.com - Shared Snippet`,
//       description: description,
//       openGraph: {
//         title: `MDsnip.com - Shared Snippet`,
//         description: description,
//         url: `https://mdsnip.com/share/${slug}`,
//         siteName: "MDsnip",
//         type: "website",
//       },
//     };
//   } catch {
//     return {
//       title: "MDsnip.com",
//       description: "View markdown notes on MDsnip.com",
//     };
//   }
// }

export default function SharePage() {
  const { shareId } = useParams();

  if (!shareId) return <p>No share id</p>;

  return (
    <div>
      <div className={styles.headerContainer}>
        <Link to={"/"}>
          <p>MDsnip</p>
        </Link>
      </div>
      <div className={styles.htmlContainer}>
        <HTMLContent slug={shareId}></HTMLContent>
      </div>
    </div>
  );
}

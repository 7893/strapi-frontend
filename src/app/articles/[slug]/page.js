import { getStrapiURL } from "@/utils/api-helpers";
import Markdown from "react-markdown";

async function getArticleBySlug(slug) {
  const url = new URL("/api/articles", getStrapiURL());
  url.searchParams.set("filters[slug][$eq]", slug);
  url.searchParams.set("populate", "*");

  const res = await fetch(url.href, { cache: "no-store" });
  const data = await res.json();
  return data.data[0];
}

async function getArticles() {
  const url = new URL("/api/articles", getStrapiURL());
  const res = await fetch(url.href, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch articles");
  }
  return res.json();
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.data.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticleRoute({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return <h1>Article Not Found!</h1>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>{article.title}</h1>
      <p>{article.description}</p>

      {article.blocks.map((block) => {
        switch (block.__component) {
          case "shared.rich-text":
            return <Markdown key={block.id}>{block.body}</Markdown>;
          case "shared.quote":
            return (
              <blockquote key={block.id}>
                <p>{block.body}</p>
                <cite>{block.title}</cite>
              </blockquote>
            );
          default:
            return null;
        }
      })}
    </main>
  );
}
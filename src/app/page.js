import { getStrapiURL } from "@/utils/api-helpers";
import Link from "next/link";

async function getArticles() {
  const url = new URL("/api/articles?populate=*", getStrapiURL());
  const res = await fetch(url.href, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch articles");
  }
  return res.json();
}

export default async function Home() {
  let data = await getArticles();

  if (!data || !data.data || data.data.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>No articles found. Check your Strapi backend.</h1>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>My Strapi Blog</h1>
      <ul>
        {data.data.map((article) => (
          <li key={article.id}>
            <Link href={`/articles/${article.slug}`}>
              <h2>{article.title}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
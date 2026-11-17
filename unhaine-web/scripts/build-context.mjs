import { writeFile, mkdir, readFile } from "node:fs/promises";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { parseFragment } from "parse5";
import { preparePosts } from "../src/data/preparePosts.js";

const pages = [
  ["/", "Home"],
  ["/about", "about/About"],
  ["/about/career", "about/Career"],
  ["/about/education", "about/Education"],
  ["/about/values", "about/Values"],
  ["/portfolio", "portfolio/Portfolio"],
  ["/portfolio/billain", "portfolio/Billain"],
  ["/portfolio/kata", "portfolio/Kata"],
  ["/contact", "Contact"],
];
const ignored = new Set(["svg", "nav", "aside", "dialog"]);
function plainText(node) {
  if (ignored.has(node.tagName)) return "";
  if (node.tagName === 'button' && !node.attrs?.some(attr => attr.name === 'class' && attr.value.split(/\s+/).includes('contact-address'))) return '';
  if (node.nodeName === "#text") return node.value;
  return ` ${node.childNodes?.map(plainText).join(" ") || ""} `;
}

// Render the same page components used by the site; do not maintain a second biography.
const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});
const documents = [];
try {
  for (const [path, component] of pages) {
    const { default: Page } = await server.ssrLoadModule(
      `/src/pages/${component}.jsx`,
    );
    const html = renderToStaticMarkup(
      createElement(
        MemoryRouter,
        { initialEntries: [path] },
        createElement(Page),
      ),
    );
    const text = plainText(parseFragment(html)).replace(/\s+/g, " ").trim();
    documents.push({ path, title: component.split("/").at(-1), text });
  }
} finally {
  await server.close();
}
const metadata = JSON.parse(await readFile("content/blog/posts.json", "utf8"));
documents.push({
  path: '/blog', title: 'Blog',
  text: metadata.map(post => `${post.date} ${post.title}: ${post.summary} https://unhaine.com/#/blog/${post.slug}`).join('\n'),
});
const manuscripts = Object.fromEntries(
  await Promise.all(
    metadata.map(async (post) => [
      `../../content/blog/${post.slug}.md`,
      await readFile(`content/blog/${post.slug}.md`, "utf8"),
    ]),
  ),
);
for (const post of preparePosts(metadata, manuscripts)) {
  documents.push({
    path: `/blog/${post.slug}`,
    title: post.title,
    text: `${post.summary}\n${post.markdown}`,
  });
}
const output = JSON.stringify({ version: 1, documents });
if (Buffer.byteLength(output) > 256_000)
  throw new Error("AI context exceeds the Worker content limit");
await mkdir("public", { recursive: true });
await writeFile("public/ai-context.json", output);
console.log(`Built AI context from ${documents.length} pages and articles.`);

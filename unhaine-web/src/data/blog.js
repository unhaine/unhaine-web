import metadata from "../../content/blog/posts.json";
import { marked } from "marked";
import { preparePosts } from "./preparePosts";

const manuscripts = import.meta.glob("../../content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

export const posts = preparePosts(metadata, manuscripts).map((post) => ({
  ...post,
  // Only repository-authored Markdown is rendered; visitor input never reaches this renderer.
  html: marked.parse(post.markdown),
}));
export const years = [...new Set(posts.map((post) => post.date.slice(0, 4)))];

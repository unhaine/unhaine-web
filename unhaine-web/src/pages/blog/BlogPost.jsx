import { useState } from "react";
import { Link, NavLink, useParams } from "react-router";
import { posts, years } from "../../data/blog";
import usePageMeta from "../../hooks/usePageMeta";
import NotFound from "../NotFound";

function ArchiveYear({ year, current }) {
  const [open, setOpen] = useState(
    () =>
      !window.matchMedia("(max-width: 780px)").matches &&
      current.date.startsWith(year),
  );
  const entries = posts.filter((post) => post.date.startsWith(year));
  return (
    <details
      className="archive-year"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary>
        {year}
        <span className="archive-count">{entries.length}</span>
      </summary>
      <ul>
        {entries.map((post) => (
          <li key={post.slug}>
            <NavLink
              to={`/blog/${post.slug}`}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {post.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </details>
  );
}

function Article({ post }) {
  usePageMeta(
    post.title,
    "blog-article-page document-page overview-page chat-enabled",
    post.summary,
  );
  return (
    <div className="document-layout">
      <aside className="detail-sidebar">
        <Link className="detail-parent" to="/blog">
          ← Blog
        </Link>
        <nav className="blog-archive" aria-label="연도별 글 목록">
          {years.map((year) => (
            <ArchiveYear
              key={`${post.slug}-${year}`}
              year={year}
              current={post}
            />
          ))}
        </nav>
      </aside>
      <article
        className="detail-content blog-article"
        aria-labelledby="article-title"
      >
        <header className="detail-heading article-heading">
          <div className="article-meta">
            <span>{post.category}</span>
            <time dateTime={post.date}>{post.date.replaceAll("-", ".")}</time>
          </div>
          <h1 id="article-title">{post.title}</h1>
          <p>
            <em>{post.summary}</em>
          </p>
        </header>
        <div className="article-body">
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
          <footer className="article-end">
            <Link className="text-link" to="/blog">
              전체 글 보기 ↗
            </Link>
          </footer>
        </div>
      </article>
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = posts.find((entry) => entry.slug === slug);
  return post ? <Article post={post} /> : <NotFound />;
}

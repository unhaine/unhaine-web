import { Link } from "react-router";
import { posts } from "../../data/blog";
import usePageMeta from "../../hooks/usePageMeta";

export default function Blog() {
  usePageMeta("Blog", "blog-page overview-page chat-enabled");
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">03 / BLOG</span>
        <h1>
          Learning by doing.
          <br />
          <em>Thinking in writing.</em>
        </h1>
        <p className="lead">
          배우고 만들며 발견한 것들을,
          <br className="intro-break" />
          생각과 경험의 기록으로 남깁니다.
        </p>
      </div>
      <section className="blog-posts" aria-label="최근 글">
        <div className="blog-list-heading">
          <span className="eyebrow">LATEST POSTS</span>
          <span className="muted small">
            {posts.length} {posts.length === 1 ? "POST" : "POSTS"}
          </span>
        </div>
        {posts.length ? (
          posts.map((post) => (
            <Link
              key={post.slug}
              className="blog-post-row"
              to={`/blog/${post.slug}`}
            >
              <time className="post-date" dateTime={post.date}>
                {post.date.replaceAll("-", ".")}
              </time>
              <div>
                <h2>{post.title}</h2>
                <p>{post.summary}</p>
              </div>
              <span className="arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          ))
        ) : (
          <p className="blog-empty">아직 등록된 글이 없습니다.</p>
        )}
      </section>
    </>
  );
}

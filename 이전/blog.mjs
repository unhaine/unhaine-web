import { readFile } from 'node:fs/promises';
import { marked } from 'marked';

const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[character]);
const href = post => `blog-${post.slug}.html`;
const dateLabel = post => post.date.replaceAll('-', '.');
const fill = (template, values) => template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
  if (!(key in values)) throw new Error(`Unknown blog template field: ${key}`);
  return values[key];
});

export async function renderBlog() {
  const posts = JSON.parse(await readFile('content/blog/posts.json', 'utf8'));
  if (!Array.isArray(posts)) throw new Error('Blog posts must be an array');
  const slugs = new Set();
  for (const post of posts) {
    if (typeof post.slug !== 'string'
      || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug) || slugs.has(post.slug)) {
      throw new Error(`Invalid or duplicate blog slug: ${post.slug}`);
    }
    slugs.add(post.slug);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date)
      || !Number.isFinite(Date.parse(post.date))
      || new Date(post.date).toISOString().slice(0, 10) !== post.date) {
      throw new Error(`Invalid blog date: ${post.slug}`);
    }
    for (const key of ['title', 'summary', 'category']) {
      if (typeof post[key] !== 'string' || !post[key].trim()) {
        throw new Error(`Missing blog ${key}: ${post.slug}`);
      }
    }
  }
  posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
  const indexTemplate = await readFile('templates/blog-index.html', 'utf8');
  const articleTemplate = await readFile('templates/blog-article.html', 'utf8');
  const years = [...new Set(posts.map(post => post.date.slice(0, 4)))];
  const archive = current => years.map(year => {
    const entries = posts.filter(post => post.date.startsWith(year));
    return `<details class="archive-year"${year === current.date.slice(0, 4) ? ' open' : ''}>
      <summary>${year}<span class="archive-count">${entries.length}</span></summary>
      <ul>${entries.map(post => `<li><a href="${href(post)}"${post.slug === current.slug ? ' class="active" aria-current="page"' : ''}>${escapeHtml(post.title)}</a></li>`).join('')}</ul>
    </details>`;
  }).join('');
  const rows = posts.map(post => `<a class="blog-post-row" href="${href(post)}">
    <time class="post-date" datetime="${post.date}">${dateLabel(post)}</time>
    <div><h2>${escapeHtml(post.title)}</h2><p>${escapeHtml(post.summary)}</p></div>
    <span class="arrow" aria-hidden="true">↗</span>
  </a>`).join('');
  const pages = new Map([['blog.html', fill(indexTemplate, {
    POST_COUNT: `${posts.length} ${posts.length === 1 ? 'POST' : 'POSTS'}`,
    POSTS: rows || '<p class="blog-empty">아직 등록된 글이 없습니다.</p>'
  })]]);
  for (const post of posts) {
    // Markdown is trusted, repository-authored content, never visitor input.
    const markdown = await readFile(`content/blog/${post.slug}.md`, 'utf8');
    pages.set(href(post), fill(articleTemplate, {
      TITLE: escapeHtml(post.title), SUMMARY: escapeHtml(post.summary),
      DATE: post.date, DATE_LABEL: dateLabel(post), CATEGORY: escapeHtml(post.category),
      ARCHIVE: archive(post), BODY: marked.parse(markdown)
    }));
  }
  return pages;
}

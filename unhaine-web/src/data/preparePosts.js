export function preparePosts(metadata, manuscripts) {
  if (!Array.isArray(metadata)) throw new Error("Blog posts must be an array");
  const slugs = new Set();
  return metadata
    .map((post) => {
      if (
        typeof post.slug !== "string" ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug) ||
        slugs.has(post.slug)
      ) {
        throw new Error(`Invalid or duplicate blog slug: ${post.slug}`);
      }
      slugs.add(post.slug);
      if (
        typeof post.date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(post.date) ||
        !Number.isFinite(Date.parse(post.date)) ||
        new Date(post.date).toISOString().slice(0, 10) !== post.date
      ) {
        throw new Error(`Invalid blog date: ${post.slug}`);
      }
      for (const key of ["title", "summary", "category"]) {
        if (typeof post[key] !== "string" || !post[key].trim())
          throw new Error(`Missing blog ${key}: ${post.slug}`);
      }
      const markdown = manuscripts[`../../content/blog/${post.slug}.md`];
      if (typeof markdown !== "string")
        throw new Error(`Missing blog manuscript: ${post.slug}`);
      return { ...post, markdown };
    })
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
    );
}

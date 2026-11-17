import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { preparePosts } from "../src/data/preparePosts.js";

const directory = new URL("../content/blog/", import.meta.url);
const metadata = JSON.parse(
  await readFile(new URL("posts.json", directory), "utf8"),
);
const manuscripts = Object.fromEntries(
  await Promise.all(
    (await readdir(directory))
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => [
        `../../content/blog/${file}`,
        await readFile(new URL(file, directory), "utf8"),
      ]),
  ),
);

test("all registered posts have a manuscript and sort newest first", () => {
  const posts = preparePosts(metadata, manuscripts);
  assert.equal(posts.length, metadata.length);
  assert.ok(posts.every((post) => post.markdown.trim().length > 0));
  for (let i = 1; i < posts.length; i++)
    assert.ok(posts[i - 1].date >= posts[i].date);
});

test("duplicate slugs and missing manuscripts fail with a useful error", () => {
  assert.throws(
    () => preparePosts([metadata[0], metadata[0]], manuscripts),
    /duplicate blog slug/,
  );
  assert.throws(() => preparePosts(metadata, {}), /Missing blog manuscript/);
});

test("impossible dates and missing required fields are rejected", () => {
  assert.throws(
    () => preparePosts([{ ...metadata[0], date: "2026-02-30" }], manuscripts),
    /Invalid blog date/,
  );
  assert.throws(
    () => preparePosts([{ ...metadata[0], title: " " }], manuscripts),
    /Missing blog title/,
  );
});

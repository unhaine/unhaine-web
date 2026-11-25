import { test } from "node:test";
import assert from "node:assert/strict";
import { getSwipeTarget } from "../src/lib/swipe-navigation.js";

const about = ["/about/career", "/about/education", "/about/values"];

test("left advances and right returns in the visible tab order", () => {
  assert.equal(getSwipeTarget(about, about[0], -110, 15), about[1]);
  assert.equal(getSwipeTarget(about, about[1], 110, -15), about[0]);
  assert.equal(getSwipeTarget(about, about[1], -110, 0), about[2]);
});

test("short drags, vertical scrolls, and diagonal gestures do not navigate", () => {
  for (const [x, y] of [[-35, 0], [10, 150], [-100, 120], [100, 80]])
    assert.equal(getSwipeTarget(about, about[1], x, y), null);
});

test("first and last tabs do not wrap or leave the current group", () => {
  assert.equal(getSwipeTarget(about, about[0], 120, 0), null);
  assert.equal(getSwipeTarget(about, about[2], -120, 0), null);
  assert.equal(getSwipeTarget(about, "/blog", -120, 0), null);
  assert.equal(getSwipeTarget([], "/", -120, 0), null);
  const projects = ["/portfolio/billain", "/portfolio/kata"];
  assert.equal(getSwipeTarget(projects, projects[0], -120, 0), projects[1]);
});

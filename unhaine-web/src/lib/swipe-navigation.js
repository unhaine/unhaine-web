export function getSwipeTarget(paths, currentPath, deltaX, deltaY) {
  if (Math.abs(deltaX) < 70 || Math.abs(deltaX) < Math.abs(deltaY) * 1.5)
    return null;
  const index = paths.indexOf(currentPath);
  if (index < 0) return null;
  return paths[index + (deltaX < 0 ? 1 : -1)] ?? null;
}

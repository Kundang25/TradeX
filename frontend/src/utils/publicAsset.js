/** Resolve paths to files in frontend/public (works on all routes and after deploy). */
export function publicAsset(path) {
  const clean = path.replace(/^\//, "");
  const base = process.env.PUBLIC_URL || "";
  return `${base}/${clean}`;
}

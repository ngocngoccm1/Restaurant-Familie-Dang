/** Keep assets and navigation inside the deployed GitHub Pages base path. */
export function siteUrl(path = ""): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

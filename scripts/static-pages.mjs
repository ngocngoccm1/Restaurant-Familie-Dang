import { readFile, writeFile } from "node:fs/promises";

// Real HTML entry points allow direct visits and refreshes on static hosting.
const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
for (const [slug, title] of [["impressum", "Impressum"], ["datenschutz", "Datenschutz"]]) {
  await writeFile(
    new URL(`../dist/${slug}.html`, import.meta.url),
    html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title} | Familie Dang</title>`),
  );
}
await writeFile(new URL("../dist/.nojekyll", import.meta.url), "");
console.log("Static entry points: index.html, impressum.html, datenschutz.html");

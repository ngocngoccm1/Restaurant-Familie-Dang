const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const baseUrl = process.env.QA_BASE_URL || process.argv[2] || "http://localhost:5173";
const fs = require("fs");
const assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch({
    headless: true,
    ...((process.env.CHROMIUM_EXECUTABLE || process.argv[3])
      ? { executablePath: process.env.CHROMIUM_EXECUTABLE || process.argv[3] }
      : {}),
  });
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  p.on("pageerror", (e) => console.log("PAGE ERROR", e.message));
  await p.goto(baseUrl + "/", { waitUntil: "networkidle", timeout: 60000 });
  await p.waitForTimeout(1300);
  await p.screenshot({ path: "qa/desktop-hero.png" });
  for (
    let y = 0;
    y < (await p.evaluate(() => document.body.scrollHeight));
    y += 700
  ) {
    await p.evaluate((y) => scrollTo(0, y), y);
    await p.waitForTimeout(90);
  }
  await p.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    scrollTo(0, 0);
  });
  await p.waitForTimeout(200);
  await p.screenshot({ path: "qa/desktop-full.png", fullPage: true });
  for (const [name, id] of [
    ["story", "#restaurant"],
    ["menu", "#speisekarte"],
    ["gallery", "#einblicke"],
    ["contact", "#kontakt"],
  ]) {
    await p
      .locator(id)
      .evaluate((e) =>
        scrollTo(0, e.getBoundingClientRect().top + scrollY - 130),
      );
    await p.waitForTimeout(300);
    await p.screenshot({ path: `qa/desktop-${name}.png` });
  }
  await p.setViewportSize({ width: 390, height: 844 });
  await p.evaluate(() => scrollTo(0, 0));
  await p.waitForTimeout(700);
  await p.screenshot({ path: "qa/mobile-hero.png" });
  for (
    let y = 0;
    y < (await p.evaluate(() => document.body.scrollHeight));
    y += 700
  ) {
    await p.evaluate((y) => scrollTo(0, y), y);
    await p.waitForTimeout(70);
  }
  await p.evaluate(() => scrollTo(0, 0));
  await p.waitForTimeout(200);
  await p.screenshot({ path: "qa/mobile-full.png", fullPage: true });
  await p
    .locator("#speisekarte")
    .evaluate((e) => scrollTo(0, e.getBoundingClientRect().top + scrollY - 95));
  await p.waitForTimeout(200);
  await p.screenshot({ path: "qa/mobile-menu.png" });
  const report = [];
  for (const width of [375, 390, 430, 768, 1024, 1440, 1920]) {
    await p.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
    await p.evaluate(() => scrollTo(0, 0));
    await p.waitForTimeout(100);
    await p.screenshot({path: `qa/hero-${width}.png`});
    report.push(
      await p.evaluate(() => ({
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        overflow: document.documentElement.scrollWidth > innerWidth,
        galleryNoteClear: document.querySelector('.gallery-note').getBoundingClientRect().top > Math.max(...[...document.querySelectorAll('.gallery-image')].map(el => el.getBoundingClientRect().bottom)),
        brokenImages: [...document.images]
          .filter((i) => i.complete && i.naturalWidth === 0)
          .map((i) => i.src),
      })),
    );
  }
  fs.writeFileSync("qa/responsive.json", JSON.stringify(report, null, 2));
  console.log(report);
  await b.close();
  assert(report.every(r => !r.overflow && r.galleryNoteClear && r.brokenImages.length === 0), "Responsive checks failed; see qa/responsive.json");
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

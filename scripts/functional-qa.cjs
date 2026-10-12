const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const baseUrl = process.env.QA_BASE_URL || process.argv[2] || "http://localhost:5173";
const fs = require("fs"),
  assert = require("assert/strict");
(async () => {
  const b = await chromium.launch({
    headless: true,
    ...((process.env.CHROMIUM_EXECUTABLE || process.argv[3])
      ? { executablePath: process.env.CHROMIUM_EXECUTABLE || process.argv[3] }
      : {}),
  });
  const context = await b.newContext({
    viewport: { width: 1440, height: 1000 },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const p = await context.newPage();
  const errors = [],
    badResponses = [],
    checks = [];
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  p.on("response", (r) => {
    if (r.status() >= 400)
      badResponses.push({ url: r.url(), status: r.status() });
  });
  const check = (name) => {
    checks.push(name);
    console.log("PASS", name);
  };
  await p.goto(baseUrl + "/", { waitUntil: "networkidle" });
  await p.evaluate(() => localStorage.removeItem("familie-dang-cart-v1"));
  await p.reload({ waitUntil: "networkidle" });
  const menu = JSON.parse(fs.readFileSync("src/data/menu.json", "utf8"));
  await p
    .locator(".category-nav button")
    .filter({ hasText: /^Alle Gerichte/ })
    .click();
  assert.equal(await p.locator(".dish-row").count(), 191);
  const rows = await p
    .locator(".dish-row")
    .evaluateAll((nodes) =>
      nodes.map((n) => ({
        id: n.dataset.dishId,
        name: n.querySelector("h4").textContent,
        price: n.querySelector(".dish-action>span").textContent,
      })),
    );
  for (const row of rows) {
    const dish = menu.items.find((i) => i.id === row.id);
    assert.equal(row.name, dish.name);
    assert(
      row.price.includes(
        new Intl.NumberFormat("de-DE", {
          style: "currency",
          currency: "EUR",
        }).format(dish.priceCents / 100),
      ),
    );
  }
  check("All 191 menu rows and minimum prices match JSON");
  for (const c of menu.categories) {
    await p
      .locator(".category-nav button")
      .filter({
        hasText: new RegExp("^" + c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      })
      .click();
    assert.equal(
      await p.locator(".dish-row").count(),
      menu.items.filter((i) => i.category === c).length,
    );
  }
  check("All 29 original categories work");
  const search = p.getByRole("textbox", { name: "Gericht oder Nummer suchen" });
  await search.fill("21");
  assert(await p.locator('[data-dish-id="21"]').isVisible());
  await search.fill("PHO");
  assert.equal(await p.locator(".dish-row").count(), 1);
  await search.fill("fruhlingsrollen");
  assert((await p.locator(".dish-row").count()) >= 2);
  await search.fill("no-such-dish");
  assert(await p.locator(".no-results").isVisible());
  await search.fill("21");
  await p.locator('[data-dish-id="21"] .dish-action button').click();
  check("Search by number, name, umlaut normalization and empty result");
  let dialog = p.getByRole("dialog");
  await dialog.getByRole("radio", { name: /C\. mit Rindfleisch/ }).check();
  await dialog.getByRole("checkbox", { name: /Reis/ }).check();
  await dialog.getByRole("checkbox", { name: /Erdnüsse-Soße/ }).check();
  await dialog.getByRole("button", { name: "Menge erhöhen" }).click();
  assert(
    (
      await dialog.getByRole("button", { name: /Hinzufügen/ }).innerText()
    ).includes("42,80"),
  );
  await dialog.getByRole("button", { name: /Hinzufügen/ }).click();
  await p.getByRole("button", { name: /Warenkorb öffnen, 2 Artikel/ }).click();
  dialog = p.getByRole("dialog");
  assert((await dialog.locator(".total").innerText()).includes("42,80"));
  check("Variant + 2 extras + quantity give exact 42,80 € total");
  await p.screenshot({ path: "qa/desktop-cart.png" });
  await dialog.getByRole("button", { name: /Menge erhöhen/ }).click();
  assert((await dialog.locator(".total").innerText()).includes("64,20"));
  await dialog.getByRole("button", { name: /Menge verringern/ }).click();
  await dialog.getByRole("button", { name: "Auswahl kopieren" }).click();
  const copied = await p.evaluate(() => navigator.clipboard.readText());
  assert(copied.includes("42,80"));
  assert(copied.includes("Rindfleisch"));
  assert(copied.includes("keine bestätigte Bestellung"));
  assert.equal(
    await dialog
      .getByRole("link", { name: "Restaurant anrufen" })
      .getAttribute("href"),
    "tel:+4990744299172",
  );
  assert((await dialog.innerText()).includes("nicht automatisch übermittelt"));
  check("Quantity controls, clipboard order summary and real phone handoff");
  await dialog.getByRole("button", { name: "Schließen" }).click();
  await p.reload({ waitUntil: "networkidle" });
  await p.getByRole("button", { name: /Warenkorb öffnen, 2 Artikel/ }).click();
  assert(
    (await p.getByRole("dialog").locator(".total").innerText()).includes(
      "42,80",
    ),
  );
  await p
    .getByRole("dialog")
    .getByRole("button", { name: "Schließen" })
    .click();
  check("Cart persists across reload");
  await search.fill("A1");
  await p.locator('[data-dish-id="A1"] .dish-action button').click();
  dialog = p.getByRole("dialog");
  await dialog.getByRole("radio", { name: "0,75 l" }).check();
  await dialog.getByRole("radio", { name: "Sprudel", exact: true }).check();
  assert(
    (
      await dialog.getByRole("button", { name: /Hinzufügen/ }).innerText()
    ).includes("5,50"),
  );
  await dialog.getByRole("button", { name: /Hinzufügen/ }).click();
  check("Water volume and still/sparkling choice");
  await search.fill("A8");
  await p.locator('[data-dish-id="A8"] .dish-action button').click();
  dialog = p.getByRole("dialog");
  await dialog.getByRole("radio", { name: "0,4 l" }).check();
  await dialog.getByRole("radio", { name: "Schorle", exact: true }).check();
  await dialog.getByRole("button", { name: /Hinzufügen/ }).click();
  check("Juice size and Schorle option");
  await search.fill("A32");
  await p.locator('[data-dish-id="A32"] .dish-action button').click();
  dialog = p.getByRole("dialog");
  await dialog.getByRole("radio", { name: "Kalt", exact: true }).check();
  await dialog.getByRole("button", { name: /Hinzufügen/ }).click();
  check("Coffee hot/cold option");
  await p.setViewportSize({ width: 390, height: 844 });
  await p.locator(".mobile-bar button").click();
  dialog = p.getByRole("dialog");
  assert((await dialog.locator(".total").innerText()).includes("57,10"));
  assert(
    await dialog.getByRole("button", { name: /Auswahl kopieren/ }).isVisible(),
  );
  assert(
    await dialog.getByRole("link", { name: "Restaurant anrufen" }).isVisible(),
  );
  await p.screenshot({ path: "qa/mobile-cart.png" });
  const overflow = await dialog.evaluate((e) => e.scrollWidth > e.clientWidth);
  assert(!overflow);
  await dialog
    .getByRole("button", { name: /entfernen/ })
    .first()
    .click();
  assert((await dialog.locator(".total").innerText()).includes("14,30"));
  check(
    "Mobile sticky cart, drawer, visible handoff controls, remove and total",
  );
  await p.keyboard.press("Escape");
  assert.equal(await p.getByRole("dialog").count(), 0);
  check("Escape closes dialogs");
  await p.locator(".mobile-nav-button").click();
  assert(await p.locator("#mobile-nav").isVisible());
  await p
    .locator("#mobile-nav a")
    .filter({ hasText: "Kontakt & Öffnungszeiten" })
    .click();
  assert.equal(await p.locator("#mobile-nav").count(), 0);
  check("Mobile navigation opens, navigates and closes");
  await p.locator(".contact-address .button").scrollIntoViewIfNeeded();
  assert(
    (await p.locator(".contact-address .button").getAttribute("href")).includes(
      "89420",
    ),
  );
  assert.equal(
    await p.locator(".header-phone").getAttribute("href"),
    "tel:+4990744299172",
  );
  assert.equal(await p.locator("iframe").count(), 0);
  check(
    "Correct address, telephone table inquiry, consent-safe external map link",
  );
  await p.locator(".gallery-one").scrollIntoViewIfNeeded();
  await p.locator(".gallery-one").click();
  assert(await p.getByRole("dialog").locator("img").isVisible());
  await p.keyboard.press("Escape");
  check("Gallery lightbox opens and closes");
  await p.locator(".menu-tools button").scrollIntoViewIfNeeded();
  await p.locator(".menu-tools button").click();
  assert(
    await p
      .getByRole("dialog")
      .getByRole("heading", { name: "Gut zu wissen." })
      .isVisible(),
  );
  assert(
    (await p.getByRole("dialog").innerText()).includes("Zahlen 12 und 13"),
  );
  await p.keyboard.press("Escape");
  check("Allergen legend with source ambiguities");
  const rects = [];
  for (const width of [375, 390, 430, 768, 1024, 1440, 1920]) {
    await p.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
    await search.fill("28");
    await p.locator('[data-dish-id="28"] .dish-action button').click();
    dialog = p.getByRole("dialog");
    const r = await dialog.evaluate((e) => ({
      width: innerWidth,
      rect: e.getBoundingClientRect().toJSON(),
      overflow: e.scrollWidth > e.clientWidth,
    }));
    assert(!r.overflow);
    assert(r.rect.left >= 0 && r.rect.right <= width + 1);
    await dialog.getByRole("radio", { name: /G\. Lachs/ }).check();
    assert(
      (
        await dialog.getByRole("button", { name: /Hinzufügen/ }).innerText()
      ).includes("17,90"),
    );
    await p.screenshot({ path: `qa/variant-${width}.png` });
    rects.push(r);
    await p.keyboard.press("Escape");
  }
  check("Variant dialog fits all seven requested widths");
  await p.goto(baseUrl + "/impressum.html", { waitUntil: "networkidle" });
  assert.equal(
    await p.getByRole("heading", { level: 1 }).innerText(),
    "Impressum",
  );
  assert(
    (await p.locator("main").innerText()).includes(
      "noch kein vollständiges Impressum",
    ),
  );
  await p.goto(baseUrl + "/datenschutz.html", { waitUntil: "networkidle" });
  assert.equal(
    await p.getByRole("heading", { level: 1 }).innerText(),
    "Datenschutz",
  );
  check("Legal pages expose pending operator details honestly");
  await p.goto(baseUrl + "/", { waitUntil: "networkidle" });
  for (
    let y = 0;
    y < (await p.evaluate(() => document.body.scrollHeight));
    y += 900
  ) {
    await p.evaluate((y) => scrollTo(0, y), y);
    await p.waitForTimeout(80);
  }
  const broken = await p.evaluate(() =>
    [...document.images]
      .filter((i) => !i.complete || i.naturalWidth === 0)
      .map((i) => i.src),
  );
  assert.deepEqual(broken, []);
  assert.deepEqual(errors, []);
  assert.deepEqual(badResponses, []);
  check("All visible images load, no browser errors or failed responses");
  const links = await p
    .locator("a[href]")
    .evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")))]);
  for (const href of links.filter(
    (h) => h.includes("#") && !/^https?:/.test(h),
  )) {
    const id = href.split("#")[1];
    assert((await p.locator('[id="' + id + '"]').count()) > 0, href);
  }
  for (const path of [
    "/impressum.html",
    "/datenschutz.html",
    "/speisekarte.pdf",
    "/favicon.svg",
  ])
    assert.equal((await context.request.get(baseUrl + path)).status(), 200);
  check("Internal anchors, legal routes and PDF return valid destinations");
  await p.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await p.evaluate(
      () => getComputedStyle(document.querySelector(".hero img")).animationName,
    ),
    "none",
  );
  assert.equal(
    await p.evaluate(
      () => getComputedStyle(document.querySelector(".reveal")).opacity,
    ),
    "1",
  );
  check("Reduced motion suppresses hero animation and reveal hiding");
  fs.writeFileSync(
    "qa/functional.json",
    JSON.stringify(
      {
        passed: true,
        checks,
        errors,
        badResponses,
        dialogViewports: rects,
        links,
      },
      null,
      2,
    ),
  );
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

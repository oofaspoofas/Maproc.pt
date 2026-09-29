import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const route of ["/", "/portfolios/maquinas-corte-laser/"]) {
  test(`${route} renders without broken images, errors or accessibility violations`, async ({
    page,
  }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-PT");
    // Traverse the real page so lazy-loaded images and reveal enhancements are exercised.
    for (const img of await page.locator("main img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          img.evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
          ),
        )
        .toBe(true);
    }
    await expect(page.locator("main")).not.toContainText("undefined");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
    const labels = await new AxeBuilder({ page })
      .withRules(["label-content-name-mismatch"])
      .analyze();
    expect(labels.violations).toEqual([]);
    expect(errors).toEqual([]);
    await page.evaluate(() => {
      (document.activeElement as HTMLElement)?.blur();
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.screenshot({ path: testInfo.outputPath("viewport.png") });
    await page.screenshot({
      path: testInfo.outputPath("full-page.png"),
      fullPage: true,
    });
  });
}

test("homepage keeps the service, machinery, partner and contact content", async ({
  page,
}) => {
  await page.goto("/");
  for (const text of [
    "Consultoria pró-ativa",
    "Formação",
    "Suporte",
    "HBD 400",
    "HBD350",
    "Nano Jet",
    "Representante Oficial",
    "Helder Ramires",
  ]) {
    await expect(page.getByText(text, { exact: true }).first()).toBeVisible();
  }
  await expect(
    page
      .getByRole("link", { name: "comercial@maproc.pt", exact: true })
      .first(),
  ).toHaveAttribute("href", "mailto:comercial@maproc.pt");
  await expect(
    page.getByRole("button", {
      name: "Envio indisponível nesta pré-visualização",
    }),
  ).toBeDisabled();
});

test("video is opt-in and can be opened and closed with the keyboard", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("iframe")).toHaveCount(0);
  const trigger = page.getByRole("button", {
    name: /Ver vídeo.*Máquinas corte a laser/,
  });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator("iframe")).toHaveAttribute(
    "src",
    /youtube-nocookie\.com\/embed\/m9wsTmZPO-c/,
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("mobile navigation opens, navigates and closes", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Abrir menu" });
  await menu.click();
  const nav = page.getByRole("navigation", { name: "Menu móvel" });
  await expect(nav).toBeVisible();
  await nav.getByRole("link", { name: "Corte a laser", exact: true }).click();
  await expect(page).toHaveURL(/portfolios\/maquinas-corte-laser/);
  await expect(nav).not.toBeVisible();
});

test("five Bystronic models preserve specs and real catalogue links", async ({
  page,
}) => {
  await page.goto("/portfolios/maquinas-corte-laser/");
  const cards = page.locator("[data-model]");
  await expect(cards).toHaveCount(5);
  await expect(
    cards
      .filter({
        has: page.getByRole("heading", {
          name: "ByCut Star 4020",
          exact: true,
        }),
      })
      .locator("ul"),
  ).toHaveCount(0);
  await expect(
    cards
      .filter({
        has: page.getByRole("heading", {
          name: "Robot Installation (automação)",
          exact: true,
        }),
      })
      .locator("ul"),
  ).toHaveCount(0);
  await expect(
    cards.filter({
      has: page.getByRole("heading", { name: "ByCut Smart", exact: true }),
    }),
  ).toContainText("40,02 x 8,20 pés");
  await expect(
    page.getByRole("link", { name: /Catálogo/ }).first(),
  ).toHaveAttribute("href", /^https:\/\/btp\.bystronic\.com\//);
  await expect(page.locator("main")).not.toContainText(
    "as published on the site",
  );
});

test("320px and reduced motion keep all sections readable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of ["/", "/portfolios/maquinas-corte-laser/"]) {
    await page.goto(route);
    for (const section of await page.locator("main section").all()) {
      await section.scrollIntoViewIfNeeded();
      await expect(section).toBeVisible();
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const hidden = await page
      .locator("[data-reveal]")
      .evaluateAll((els) =>
        els.some((el) => getComputedStyle(el).opacity !== "1"),
      );
    expect(hidden).toBe(false);
  }
});

test("source slider, consultancy and automation copy remain available", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("main")).toContainText("Avançamos consigo.");
  await expect(page.locator("main")).toContainText(
    "Seja pioneiro na tecnologia.",
  );
  await expect(page.locator("main")).toContainText(
    "Nas últimas décadas, testemunhamos a evolução da tecnologia.",
  );
  await expect(page.locator("main")).toContainText(
    "Qual é o equipamento de corte com jato de água ideal para você?",
  );
  await expect(page.locator("main")).toContainText(
    "NEWS: Orientação estratégica para o sucesso empresarial.",
  );
  await page.goto("/portfolios/maquinas-corte-laser/");
  await expect(page.getByRole("blockquote")).toContainText(
    "Aproveite ao máximo do potencial das nossas soluções de automação",
  );
});

test("desktop dropdown restores keyboard focus on Escape", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/");
  const summary = page.locator(".nav-dropdown summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await expect(
    page
      .getByRole("navigation", { name: "Principal", exact: true })
      .getByRole("link", { name: "Corte a laser", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(summary).toBeFocused();
  await expect(page.locator(".nav-dropdown")).not.toHaveAttribute("open");
});

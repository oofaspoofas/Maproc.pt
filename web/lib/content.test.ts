import { describe, expect, it } from "vitest";
import {
  loadPage,
  loadProducts,
  productsByBrand,
  loadSalesContact,
  localAsset,
} from "./content";

describe("source content and assets", () => {
  it("preserves all 22 source products and five brands", () => {
    const products = loadProducts();
    expect(products).toHaveLength(22);
    expect(new Set(products.map((p) => p.brand)).size).toBe(5);
    expect(products.every((p) => Array.isArray(p.specs))).toBe(true);
  });
  it("keeps empty specs empty rather than inventing values", () => {
    expect(
      productsByBrand("Bystronic").find((p) => p.name === "ByCut Star 4020")
        ?.specs,
    ).toEqual([]);
    expect(
      productsByBrand("Flow").every(
        (p) => !p.description_pt && p.specs.length === 0,
      ),
    ).toBe(true);
  });
  it("filters brands without mixing ESAB copy-paste cards into Bystronic", () => {
    expect(productsByBrand("Bystronic")).toHaveLength(5);
    expect(productsByBrand("unknown")).toEqual([]);
  });
  it("retains original SEO copy and language", () => {
    expect(loadPage("home").language).toBe("pt-PT");
    expect(loadPage("home").meta_description).toContain("Máquinas para chapa");
    expect(loadPage("portfolios_maquinas-corte-laser").canonical).toContain(
      "/portfolios/maquinas-corte-laser/",
    );
  });
  it("reads the actual sales contact", () => {
    expect(loadSalesContact().phone).toBe("+351 919 847 589");
    expect(loadSalesContact().territory).toBe("Portugal / Espanha");
  });
  it("maps only valid source assets and rejects missing or template imagery", () => {
    expect(
      localAsset("https://maproc.pt/wp-content/uploads/2024/03/logo1.png"),
    ).toBe("/assets/maproc/logo1.webp");
    expect(
      localAsset("https://maproc.pt/wp-content/uploads/2024/05/sobrenos.jpg"),
    ).toBeUndefined();
    expect(
      localAsset(
        "https://maproc.pt/wp-content/uploads/2024/02/shape_img_new.png",
      ),
    ).toBeUndefined();
  });
});

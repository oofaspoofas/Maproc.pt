import fs from "node:fs";
import path from "node:path";
import approvedAssets from "./asset-policy.json";

export type Product = {
  brand: string;
  category?: string;
  page?: string;
  name: string;
  description_pt?: string;
  specs: string[];
  catalog_url?: string;
  cta?: string;
  note?: string;
};
export type SalesContact = {
  role: string;
  name: string;
  phone: string;
  availability: string;
  territory: string;
};
export type Block = {
  type: string;
  text?: string;
  level?: number;
  src?: string;
  alt?: string;
  items?: string[];
};
export type SourcePage = {
  slug: string;
  title: string;
  canonical: string;
  meta_description: string;
  language: string;
  blocks: Block[];
  widgets: {
    widget: string;
    text: string[];
    images: { src: string; alt: string }[];
    links: { text: string; href: string }[];
    videos: string[];
  }[];
};
type ProductsFile = {
  products: Product[];
  meta: { sales_contact: SalesContact };
};
type Asset = { url: string; file: string; status: string };
const dataRoot = path.resolve(process.cwd(), "../data");

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(dataRoot, file), "utf8")) as T;
}
export function loadProducts(): Product[] {
  return readJson<ProductsFile>("content/products.json").products.map((p) => ({
    ...p,
    specs: p.specs ?? [],
  }));
}
export function productsByBrand(brand: string): Product[] {
  return loadProducts().filter((p) => p.brand === brand);
}
export function loadSalesContact(): SalesContact {
  return readJson<ProductsFile>("content/products.json").meta.sales_contact;
}
export function loadPage(
  slug: "home" | "portfolios_maquinas-corte-laser",
): SourcePage {
  return readJson<SourcePage>(`content/${slug}.json`);
}
export function sourceText(page: SourcePage, startsWith: string): string {
  const text =
    page.blocks.find((b) => b.text?.startsWith(startsWith))?.text ??
    page.widgets.flatMap((w) => w.text).find((t) => t.startsWith(startsWith));
  if (!text) throw new Error(`Source copy not found: ${startsWith}`);
  return text;
}
export function assetPath(relative: string): string {
  if (!approvedAssets.includes(relative))
    throw new Error(`Unapproved asset: ${relative}`);
  return `/assets/${relative.replace(/\.(png|jpe?g)$/i, ".webp")}`;
}
export function localAsset(url: string): string | undefined {
  const asset = readJson<Asset[]>("assets/assets-manifest.json").find(
    (a) => a.url === url && a.status === "ok",
  );
  const relative = asset?.file.replace("data/assets/", "");
  return relative && approvedAssets.includes(relative)
    ? assetPath(relative)
    : undefined;
}
export function productImages(page: SourcePage): string[] {
  const widget = page.widgets.find((w) => w.widget === "rs-service-slider");
  if (!widget) throw new Error("Missing Bystronic model image widget");
  return widget.images.map((image) => {
    const local = localAsset(image.src);
    if (!local) throw new Error(`Missing model image: ${image.src}`);
    return local;
  });
}

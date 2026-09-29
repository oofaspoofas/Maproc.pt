import type { Metadata } from "next";
import {
  loadPage,
  productsByBrand,
  loadSalesContact,
  sourceText,
  assetPath,
} from "@/lib/content";
import { Hero } from "@/components/home/Hero";
import { ValueProps } from "@/components/home/ValueProps";
import { BrandStory } from "@/components/home/BrandStory";
import { MachineGrid } from "@/components/home/MachineGrid";
import { HbdSection } from "@/components/home/HbdSection";
import { AboutPartners } from "@/components/home/AboutPartners";
import { ContactSection } from "@/components/home/ContactSection";

const home = loadPage("home");
export const metadata: Metadata = {
  title: { absolute: home.title },
  description: home.meta_description,
  alternates: { canonical: home.canonical },
};

export default function Home() {
  const services = home.widgets
    .filter((w) => w.widget === "rs-service-grid")
    .slice(0, 4)
    .map((w) => ({ title: w.text[1], description: w.text[2] }));
  const hbdWidget = home.widgets.find((w) => w.widget === "rs-service-slider")!;
  const hbdImages = [
    "hbd__6089c097-3f65-486c-a001-1cd66c0437e9.png_640xaf.png",
    "hbd__9eb6fc63-27a2-4d7f-9223-ba05297f40ab.png_640xaf.png",
    "hbd__4ade64eb-ea89-4720-810b-4ebd4dfa4d3b.png_640xaf.png",
    "hbd__a4244c27-3106-4a63-834d-da7853dae04f.png_640xaf.png",
  ];
  const hbd = productsByBrand("HBD").map((p, i) => ({
    ...p,
    description_pt: hbdWidget.text[i * 4 + 1],
    image: assetPath(`third-party/${hbdImages[i]}`),
  }));
  return (
    <>
      <Hero
        introduction={`${sourceText(home, "Avançamos consigo.")} ${sourceText(home, "Seja pioneiro")}`}
      />
      <ValueProps services={services} consultancy={sourceText(home, "NEWS:")} />
      <BrandStory
        introduction={sourceText(home, "Nas últimas décadas")}
        flowHeading={sourceText(home, "Qual é o equipamento")}
        lvdCopy={sourceText(home, "A série Easy-Form")}
        flowCopy={sourceText(home, "Corte praticamente")}
        flowProducts={productsByBrand("Flow")}
      />
      <MachineGrid />
      <HbdSection
        products={hbd}
        introduction={sourceText(home, "Fundada em 2007")}
      />
      <AboutPartners
        about={sourceText(home, "A MAPROC é especializada")}
        objective={sourceText(home, "O nosso objetivo")}
      />
      <ContactSection
        sales={loadSalesContact()}
        introduction={sourceText(home, "Um especialista")}
      />
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  loadPage,
  productsByBrand,
  loadSalesContact,
  productImages,
  sourceText,
} from "@/lib/content";
import { ModelCard } from "@/components/product/ModelCard";
import { SalesContact } from "@/components/product/SalesContact";
import { Arrow } from "@/components/ui/Arrow";
const source = loadPage("portfolios_maquinas-corte-laser");
export const metadata: Metadata = {
  title: "Máquinas corte a laser Bystronic",
  description: source.meta_description,
  alternates: { canonical: source.canonical },
};
export default function LaserPage() {
  const products = productsByBrand("Bystronic");
  const images = productImages(source);
  const text = (prefix: string) => sourceText(source, prefix);
  return (
    <>
      <section className="product-hero dark-section">
        <div className="container">
          <nav aria-label="Localização" className="breadcrumbs">
            <Link href="/">Início</Link>
            <span aria-hidden="true">/</span>
            <span>Corte a laser</span>
          </nav>
          <div className="product-hero-grid">
            <div>
              <p className="eyebrow">Bystronic · Corte a laser</p>
              <h1>{text("Corte rápido")}</h1>
              <p>{text("As máquinas de corte a laser Bystronic")}</p>
              <a className="button button-orange" href="#modelos">
                Explorar modelos <Arrow diagonal />
              </a>
            </div>
            <div className="product-hero-image">
              <Image
                src="/assets/third-party/bystronic__SSC_V3_06.webp"
                alt="Cabeça de corte a laser Bystronic em funcionamento"
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 767px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>
      <section
        className="product-intro light-section section-space"
        aria-labelledby="intro-title"
      >
        <div className="container">
          <h2 id="intro-title">{text("Rápido, flexível")}</h2>
          <div className="product-intro-grid">
            <p>
              {text("As nossas máquinas")} {text("A versão automatizada")}
            </p>
            <div>
              <h3>{text("Produtividade máxima")}</h3>
              <p>
                {text("O ByStar Fiber é incrivelmente rápido pois")}{" "}
                {text("Processa os seus pedidos")}
              </p>
            </div>
          </div>
          <blockquote className="automation-quote">
            <p>{text("“Aproveite ao máximo")}</p>
            <footer>Helder Ramires</footer>
          </blockquote>
        </div>
      </section>
      <section
        id="modelos"
        className="models-section light-section section-space"
        aria-labelledby="models-title"
      >
        <div className="container">
          <div className="section-heading">
            <h2 id="models-title">Modelos disponíveis</h2>
            <p>{text("Faça download")}</p>
          </div>
          <nav className="model-index" aria-label="Modelos Bystronic">
            {products.map((p, i) => (
              <a key={p.name} href={`#modelo-${i + 1}`}>
                {p.name.replace(" (automação)", "")}
                <Arrow diagonal size={15} />
              </a>
            ))}
          </nav>
          <div className="model-list">
            {products.map((p, i) => (
              <ModelCard key={p.name} product={p} image={images[i]} index={i} />
            ))}
          </div>
        </div>
      </section>
      <section
        className="product-details light-section section-space"
        aria-labelledby="productivity-title"
      >
        <div className="container">
          <h2 id="productivity-title">{text("Mais produtividade")}</h2>
          <div className="product-intro-grid">
            <div>
              <p>{text("A ByStar Fiber aumentará")}</p>
              <p>{text("Com o laser de fibra")}</p>
              <p>{text("Leve sua produção")}</p>
            </div>
            <div>
              <p>{text("Alcançe a máxima")}</p>
              <p>{text("O software inteligente")}</p>
              <p>{text("O pós-processamento")}</p>
              <p>{text("E esse é")}</p>
            </div>
          </div>
        </div>
      </section>
      <section
        className="product-contact dark-section section-space"
        aria-labelledby="product-contact-title"
      >
        <div className="container">
          <h2 id="product-contact-title">Tem um projecto em mente?</h2>
          <p>{text("A sua melhor escolha")}</p>
          <SalesContact sales={loadSalesContact()} />
          <Link className="button button-orange" href="/#contacto">
            Pedir proposta <Arrow diagonal />
          </Link>
        </div>
      </section>
      <aside className="product-sticky" aria-label="Contacto comercial">
        <span>
          Bystronic <span>Corte a laser</span>
        </span>
        <Link className="button button-orange" href="/#contacto">
          Pedir proposta <Arrow diagonal size={17} />
        </Link>
      </aside>
    </>
  );
}

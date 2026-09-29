import Image from "next/image";
import type { Product } from "@/lib/content";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";
export function BrandStory({
  lvdCopy,
  flowCopy,
  flowProducts,
  introduction,
  flowHeading,
}: {
  lvdCopy: string;
  flowCopy: string;
  flowProducts: Product[];
  introduction: string;
  flowHeading: string;
}) {
  return (
    <section
      className="brand-story dark-section section-space"
      aria-labelledby="process-title"
    >
      <div className="container story-layout">
        <div className="story-intro">
          <p className="eyebrow">Processamento de chapa</p>
          <h2 id="process-title">A melhor escolha para o seu processo.</h2>
          <p className="story-description">{introduction}</p>
          <a href="#maquinas" className="text-link">
            Explorar máquinas <Arrow diagonal />
          </a>
        </div>
        <div className="story-cards">
          <Reveal>
            <article className="story-card">
              <div className="story-image">
                <Image
                  src="/assets/maproc/lvd.webp"
                  alt="Operação do sistema de quinagem LVD"
                  fill
                  sizes="(max-width: 767px) 100vw, 50vw"
                />
              </div>
              <div className="story-card-body">
                <h3>LVD</h3>
                <p>{lvdCopy}</p>
                <ul className="inline-tags">
                  <li>Corte a laser</li>
                  <li>Corte de laser para tubo</li>
                  <li>Quinadoras</li>
                </ul>
                <a className="text-link" href="#contacto">
                  Pedir proposta <Arrow diagonal />
                </a>
              </div>
            </article>
          </Reveal>
          <Reveal>
            <article className="story-card" id="flow">
              <div className="story-image">
                <Image
                  src="/assets/maproc/flow.webp"
                  alt="Cabeça de corte por jato de água Flow"
                  fill
                  sizes="(max-width: 767px) 100vw, 50vw"
                />
              </div>
              <div className="story-card-body">
                <h3>Flow</h3>
                <h4 className="flow-question">{flowHeading}</h4>
                <p>{flowCopy}</p>
                <ul className="inline-tags">
                  {flowProducts.map((p) => (
                    <li key={p.name}>{p.name}</li>
                  ))}
                </ul>
                <a className="text-link" href="#contacto">
                  Pedir proposta <Arrow diagonal />
                </a>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import type { Product } from "@/lib/content";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";
export function HbdSection({
  products,
  introduction,
}: {
  products: (Product & { image: string })[];
  introduction: string;
}) {
  return (
    <section
      id="hbd"
      className="hbd-section light-section section-space"
      aria-labelledby="hbd-title"
    >
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Impressão metálica 3D</p>
          <h2 id="hbd-title">HBD Máquinas aditivas</h2>
          <p>{introduction}</p>
        </div>
        <div className="hbd-grid">
          {products.map((p) => (
            <Reveal key={p.name}>
              <article className="hbd-card">
                <div className="hbd-image">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 1023px) 50vw, 25vw"
                  />
                </div>
                <h3>{p.name}</h3>
                <p>{p.description_pt}</p>
                {p.catalog_url && (
                  <a
                    className="text-link"
                    href={p.catalog_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Catálogo PDF <Arrow diagonal size={18} />
                  </a>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

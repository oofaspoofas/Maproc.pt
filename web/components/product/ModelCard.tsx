import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/content";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";
export function ModelCard({
  product,
  image,
  index,
}: {
  product: Product;
  image: string;
  index: number;
}) {
  return (
    <Reveal>
      <article
        className="model-card"
        data-model={product.name}
        id={`modelo-${index + 1}`}
      >
        <div className="model-image">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 767px) 100vw, 55vw"
          />
        </div>
        <div className="model-copy">
          <p className="model-category">{product.category}</p>
          <h3>{product.name}</h3>
          {product.description_pt && <p>{product.description_pt}</p>}
          {product.specs.length > 0 && (
            <ul className="spec-list">
              {product.specs.map((spec) => (
                <li key={spec}>
                  {spec.replace(" (as published on the site)", "")}
                </li>
              ))}
            </ul>
          )}
          {product.name === "ByCut Smart" && (
            <p className="source-note">
              Dimensões conforme publicadas no site de origem; unidade por
              confirmar.
            </p>
          )}
          <div className="model-actions">
            <Link className="button button-navy" href="/#contacto">
              Pedir proposta <Arrow diagonal />
            </Link>
            {product.catalog_url && (
              <a
                className="text-link"
                href={product.catalog_url}
                target="_blank"
                rel="noreferrer"
              >
                Catálogo <Arrow diagonal size={18} />
              </a>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

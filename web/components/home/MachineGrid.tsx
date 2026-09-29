import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";
const machines = [
  {
    id: "laser",
    name: "Bystronic",
    label: "Corte a laser",
    image:
      "/assets/third-party/bystronic__ByCut-Star-4020-two-doors-title.webp",
    href: "/portfolios/maquinas-corte-laser/",
    feature: true,
  },
  {
    id: "quinadoras",
    name: "LVD Quinadoras",
    label: "Quinadoras",
    image: "/assets/maproc/quinadora.webp",
    href: "#contacto",
  },
  {
    id: "tubo",
    name: "LVD corte tubo a laser",
    label: "Corte tubo a laser",
    image: "/assets/maproc/icon.webp",
    href: "#contacto",
  },
  {
    id: "esab",
    name: "ESAB Máquinas CNC",
    label: "Máquinas CNC",
    image: "/assets/maproc/mut1477936999890979049.webp",
    href: "#contacto",
  },
];
export function MachineGrid() {
  return (
    <section
      className="machines light-section section-space"
      id="maquinas"
      aria-labelledby="machines-title"
    >
      <div className="container">
        <div className="section-heading">
          <h2 id="machines-title">
            Explore as
            <br />
            nossas máquinas.
          </h2>
          <p>
            A melhor solução tecnológica para o seu negócio. Ao longo dos anos,
            crescemos tendo em conta as exigências dos nossos clientes e as
            exigências do mercado.
          </p>
        </div>
        <div className="machine-grid">
          {machines.map((m) => (
            <Reveal className={m.feature ? "machine-feature" : ""} key={m.id}>
              <article
                className={`machine-card ${m.feature ? "featured" : ""}`}
                id={m.id}
              >
                <div className="machine-image">
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    sizes={
                      m.feature
                        ? "(max-width: 767px) 100vw, 60vw"
                        : "(max-width: 767px) 100vw, 35vw"
                    }
                  />
                </div>
                <div className="machine-info">
                  <div>
                    <p>{m.label}</p>
                    <h3>{m.name}</h3>
                  </div>
                  <Link
                    className="circle-link"
                    href={m.href}
                    aria-label={
                      m.feature
                        ? "Explorar Bystronic: corte a laser"
                        : `Pedir proposta: ${m.name}`
                    }
                  >
                    <Arrow diagonal size={25} />
                  </Link>
                </div>
                {m.feature && (
                  <Link className="text-link" href={m.href}>
                    Conhecer a gama <Arrow />
                  </Link>
                )}
              </article>
            </Reveal>
          ))}
        </div>
        <div className="project-stat">
          <strong>650</strong>
          <span>Projectos com sucesso</span>
          <a href="#contacto" className="text-link">
            Pedir proposta <Arrow diagonal />
          </a>
        </div>
      </div>
    </section>
  );
}

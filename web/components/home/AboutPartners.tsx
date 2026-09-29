import Image from "next/image";
import { site } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
const partners = [
  { name: "LVD", src: "/assets/maproc/transferir.webp" },
  { name: "Flow", src: "/assets/maproc/flow-waterjet-logo.webp" },
  { name: "ESAB", src: "/assets/maproc/esab-logo.webp" },
  { name: "HBD", src: "/assets/maproc/hdb-logo2.webp" },
  { name: "Voortman", src: "/assets/maproc/voortman-logo.webp" },
];
export function AboutPartners({
  about,
  objective,
}: {
  about: string;
  objective: string;
}) {
  return (
    <section
      className="about-section dark-section section-space"
      id="sobre"
      aria-labelledby="about-title"
    >
      <div className="container">
        <Reveal className="about-layout">
          <div className="about-image">
            <Image
              src="/assets/maproc/experience-center_ByUK2.webp"
              alt="Centro de experiência Bystronic com máquinas de processamento de chapa"
              fill
              sizes="(max-width: 767px) 100vw, 45vw"
            />
          </div>
          <div className="about-copy">
            <h2 id="about-title">Mais de 30 anos de experiência.</h2>
            <p>{about}</p>
            <p>{objective}</p>
          </div>
        </Reveal>
        <dl className="counters">
          {site.counters.map((c) => (
            <div key={c.label}>
              <dt>{c.label}</dt>
              <dd>{c.value}</dd>
            </div>
          ))}
        </dl>
        <div className="partners" id="parceiros">
          <h3>Representante Oficial</h3>
          <div className="partner-strip">
            {partners.map((p) => (
              <div className="partner-logo" key={p.name}>
                <Image src={p.src} alt={p.name} width={150} height={65} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

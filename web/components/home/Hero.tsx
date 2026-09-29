import Image from "next/image";
import { Arrow } from "@/components/ui/Arrow";
import { VideoPoster } from "@/components/ui/VideoPoster";

export function Hero({ introduction }: { introduction: string }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-visual">
        <Image
          src="/assets/third-party/lvdgroup__sparks_840x520.webp"
          alt="Corte a laser de tubo LVD em operação"
          fill
          sizes="(max-width: 767px) 100vw, 70vw"
          loading="eager"
          fetchPriority="high"
        />
      </div>
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">Máquinas e processos para chapa</p>
          <h1 id="hero-title">
            WE SERVE
            <br />
            <span>SUCCESS.</span>
          </h1>
          <p className="hero-description">{introduction}</p>
          <div className="hero-actions">
            <a className="button button-orange" href="#maquinas">
              Explorar máquinas <Arrow diagonal />
            </a>
            <a className="text-link" href="#contacto">
              Pedir proposta <Arrow diagonal />
            </a>
          </div>
        </div>
      </div>
      <div className="hero-video-bar container">
        <p>
          Máquinas corte a laser
          <br />
          <span>Corte jato de água</span>
        </p>
        <VideoPoster
          videoId="m9wsTmZPO-c"
          title="Máquinas corte a laser"
          poster="/assets/video/m9wsTmZPO-c.webp"
        />
        <VideoPoster
          videoId="ycHS9QzxS0c"
          title="Corte jato de água"
          poster="/assets/video/ycHS9QzxS0c.webp"
        />
      </div>
    </section>
  );
}

import Link from "next/link";
import { site } from "@/lib/site";
import { Arrow } from "@/components/ui/Arrow";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <Link href="/" className="footer-brand">
            MAPROC<span>WE SERVE SUCCESS</span>
          </Link>
          <p>
            Máquinas e processos para chapa.
            <br />
            Mais de 30 anos de experiência em lasers industriais.
          </p>
          <a className="text-link" href="mailto:rh@maproc.pt">
            Recrutamento <Arrow diagonal />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} MAPROC</span>
          <nav aria-label="Redes sociais">
            {site.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                {s.label}
                <Arrow diagonal size={14} />
              </a>
            ))}
          </nav>
          <span>Portugal / Espanha</span>
        </div>
      </div>
    </footer>
  );
}

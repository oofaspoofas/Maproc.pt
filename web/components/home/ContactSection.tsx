import { site } from "@/lib/site";
import type { SalesContact as SalesContactType } from "@/lib/content";
import { SalesContact } from "@/components/product/SalesContact";
import { Arrow } from "@/components/ui/Arrow";
export function ContactSection({
  sales,
  introduction,
}: {
  sales: SalesContactType;
  introduction: string;
}) {
  return (
    <section
      id="contacto"
      className="contact-section dark-section section-space"
      aria-labelledby="contact-title"
    >
      <div className="container">
        <h2 id="contact-title">
          Tem um projecto?
          <br />
          <span>Conte connosco.</span>
        </h2>
        <div className="contact-layout">
          <div className="contact-details">
            <p className="contact-intro">{introduction}</p>
            <a className="contact-email" href={`mailto:${site.emails.sales}`}>
              {site.emails.sales}
              <Arrow diagonal size={23} />
            </a>
            <dl className="contact-facts">
              <div>
                <dt>Telefone</dt>
                <dd>
                  <a href={site.phoneHref}>{site.phone}</a>
                </dd>
              </div>
              <div>
                <dt>Horário</dt>
                <dd>{site.hours}</dd>
              </div>
              <div className="address">
                <dt>Aveiro, Portugal</dt>
                <dd>{site.address}</dd>
              </div>
            </dl>
            <SalesContact sales={sales} compact />
          </div>
          <div className="contact-form">
            <h3>Entre em contacto</h3>
            <p id="form-notice" className="form-notice">
              Nesta pré-visualização, o formulário não envia mensagens.
              Contacte-nos por email ou telefone.
            </p>
            <fieldset disabled aria-describedby="form-notice">
              <legend className="sr-only">
                Formulário de contacto em pré-visualização
              </legend>
              <div className="form-row">
                <label>
                  Nome
                  <input
                    autoComplete="name"
                    name="name"
                    type="text"
                    placeholder="O seu nome"
                  />
                </label>
                <label>
                  Email
                  <input
                    autoComplete="email"
                    name="email"
                    type="email"
                    placeholder="O seu email"
                  />
                </label>
              </div>
              <label>
                Telefone
                <input
                  autoComplete="tel"
                  name="phone"
                  type="tel"
                  placeholder="O seu contacto"
                />
              </label>
              <label>
                Mensagem
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Conte-nos o que tem em mente"
                />
              </label>
              <button className="button button-unavailable" disabled>
                Envio indisponível nesta pré-visualização
              </button>
            </fieldset>
            <a className="text-link" href={`mailto:${site.emails.sales}`}>
              Enviar email <Arrow diagonal />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

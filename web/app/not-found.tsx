import Link from "next/link";
export default function NotFound() {
  return (
    <section className="dark-section section-space">
      <div className="container">
        <h1 className="text-5xl mb-6">Página não encontrada</h1>
        <p className="mb-8">
          A página que procura não está disponível nesta pré-visualização.
        </p>
        <Link className="button button-orange" href="/">
          Voltar ao início
        </Link>
      </div>
    </section>
  );
}

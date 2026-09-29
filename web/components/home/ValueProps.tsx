import {
  ChatsCircleIcon,
  GraduationCapIcon,
  CrosshairIcon,
  HeadsetIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/Reveal";
const icons = [ChatsCircleIcon, GraduationCapIcon, CrosshairIcon, HeadsetIcon];
export function ValueProps({
  services,
  consultancy,
}: {
  services: { title: string; description: string }[];
  consultancy: string;
}) {
  return (
    <section className="services dark-section" aria-label="Serviços MAPROC">
      <div className="container services-grid">
        {services.map((s, i) => {
          const Icon = icons[i];
          return (
            <Reveal key={s.title}>
              <article>
                <Icon size={29} weight="light" aria-hidden="true" />
                <h2>{s.title}</h2>
                <p>{s.description}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
      <p className="container services-note">{consultancy}</p>
    </section>
  );
}

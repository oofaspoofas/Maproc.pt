"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import {
  ArrowUpRightIcon,
  CaretDownIcon,
  ListIcon,
  XIcon,
} from "@phosphor-icons/react";

const machines = [
  { label: "Corte a laser", href: "/portfolios/maquinas-corte-laser/" },
  { label: "Quinadoras", href: "/#quinadoras" },
  { label: "Corte tubo a laser", href: "/#tubo" },
  { label: "ESAB", href: "/#esab" },
  { label: "Flow", href: "/#flow" },
  { label: "Impressão metálica 3D", href: "/#hbd" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const dropdown = useRef<HTMLDetailsElement>(null);
  const dropdownSummary = useRef<HTMLElement>(null);
  function close() {
    setOpen(false);
    if (dropdown.current) dropdown.current.open = false;
  }
  return (
    <header
      className="site-header"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          const desktopWasOpen = dropdown.current?.open;
          close();
          if (desktopWasOpen) dropdownSummary.current?.focus();
          else menuButton.current?.focus();
        }
      }}
    >
      <a className="skip-link" href="#conteudo">
        Saltar para o conteúdo
      </a>
      <div className="header-inner container">
        <Link className="brand" href="/" onClick={close}>
          <Image
            src="/assets/maproc/logo1-e1731927765959.webp"
            alt=""
            width={43}
            height={43}
            loading="eager"
          />
          <span>
            MAPROC<small>WE SERVE SUCCESS</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Principal">
          <Link href="/#sobre">Sobre nós</Link>
          <details ref={dropdown} className="nav-dropdown">
            <summary ref={dropdownSummary}>
              Máquinas <CaretDownIcon size={12} />
            </summary>
            <div className="dropdown-panel">
              {machines.map((item) => (
                <Link key={item.label} href={item.href} onClick={close}>
                  {item.label}
                  <ArrowUpRightIcon size={16} />
                </Link>
              ))}
            </div>
          </details>
          <Link href="/#parceiros">Marcas</Link>
          <Link href="/#contacto">Contactos</Link>
        </nav>
        <Link href="/#contacto" className="button button-orange header-cta">
          Pedir proposta <ArrowUpRightIcon size={18} />
        </Link>
        <button
          ref={menuButton}
          className="icon-button mobile-menu-button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <XIcon size={25} /> : <ListIcon size={25} />}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Menu móvel">
          <Link href="/#sobre" onClick={close}>
            Sobre nós
          </Link>
          {machines.map((item) => (
            <Link key={item.label} href={item.href} onClick={close}>
              {item.label}
              <ArrowUpRightIcon size={18} />
            </Link>
          ))}
          <Link href="/#parceiros" onClick={close}>
            Marcas
          </Link>
          <Link href="/#contacto" onClick={close}>
            Contactos
          </Link>
        </nav>
      )}
    </header>
  );
}

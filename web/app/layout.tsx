import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/chrome/Header";
import { Footer } from "@/components/chrome/Footer";
import "./globals.css";

const manrope = localFont({
  src: "../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  variable: "--font-manrope",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL("https://maproc.pt"),
  title: { default: "MAPROC: Máquinas para chapa", template: "%s | MAPROC" },
  description:
    "Máquinas para chapa, A MAPROC é especializada em máquinas corte a laser, em processos para chapa e equipamentos de corte e deformação.",
  robots: { index: false, follow: false },
  icons: { icon: "/assets/maproc/favicon-32x32-1.webp" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-PT" data-scroll-behavior="smooth">
      <body className={manrope.variable}>
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

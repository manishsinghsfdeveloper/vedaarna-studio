import type { ReactNode } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
  wide,
  heroStrip,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
  wide?: boolean;
  heroStrip?: boolean;
}) {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Optional hero title strip */}
      {heroStrip ? (
        <>
          <div
            className="w-full py-8 text-center"
            style={{ backgroundColor: "#f0dfd4" }}
          >
            <h1 className="text-xl md:text-2xl tracking-[0.2em] uppercase">{title}</h1>
          </div>
          <main className="mx-auto w-full max-w-7xl px-6 py-12 md:px-10">
            {intro && (
              <p className="mb-8 text-sm leading-relaxed text-muted-foreground">{intro}</p>
            )}
            {children}
          </main>
        </>
      ) : (
        <main className={`mx-auto px-6 py-16 ${wide ? "max-w-6xl" : "max-w-3xl"}`}>
          <p className="text-[11px] tracking-[0.24em] text-muted-foreground uppercase">{eyebrow}</p>
          <h1 className="mt-4 text-3xl md:text-4xl">{title}</h1>
          {intro && <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{intro}</p>}
          <div className="mt-12">{children}</div>
        </main>
      )}

      <Footer />
    </div>
  );
}

export function Prose({ sections }: { sections: { heading: string; body: string[] }[] }) {
  return (
    <div className="space-y-8">
      {sections.map((s) => (
        <section key={s.heading}>
          <h2 className="text-sm font-bold tracking-[0.12em] uppercase text-foreground">
            {s.heading}
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
            {s.body.map((p, i) => (
              <p key={i} className="leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

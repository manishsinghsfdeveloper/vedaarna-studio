import type { ReactNode } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
  wide,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className={`mx-auto px-6 py-16 ${wide ? "max-w-6xl" : "max-w-3xl"}`}>
        <p className="text-[11px] tracking-[0.24em] text-muted-foreground uppercase">{eyebrow}</p>
        <h1 className="mt-4 text-3xl md:text-4xl">{title}</h1>
        {intro && <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{intro}</p>}
        <div className="mt-12">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

export function Prose({ sections }: { sections: { heading: string; body: string[] }[] }) {
  return (
    <div className="space-y-10">
      {sections.map((s) => (
        <section key={s.heading}>
          <h2 className="text-sm tracking-[0.16em] uppercase">{s.heading}</h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
            {s.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

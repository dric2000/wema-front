import { MessageCircle, Sparkles } from "lucide-react";

import { Container } from "@/components/section";

const productLinks = [
  { href: "#probleme", label: "Le problème" },
  { href: "#comment-ca-marche", label: "Comment ça marche" },
  { href: "#faq", label: "Questions fréquentes" },
];

function Footer() {
  return (
    <footer className="w-full border-t border-border bg-muted">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-[2fr_1fr_1fr]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="size-5 text-warning" />
              <span className="text-lg font-semibold text-foreground">
                Wemá
              </span>
            </div>
            <p className="max-w-xs text-sm text-muted-foreground italic">
              Le cahier qui écoute.
            </p>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <MessageCircle className="size-4 text-primary" />
              Disponible sur WhatsApp
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-foreground">
              Produit
            </span>
            <ul className="flex flex-col gap-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-foreground">
              Le projet
            </span>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>GrokBot Cotonou Hackathon × Devs Days</li>
              <li>9 &amp; 10 septembre 2026</li>
              <li>Porteur : Merveilleux Azihou</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © 2026 Wemá. Prototype réalisé dans le cadre du GrokBot Cotonou
          Hackathon × Devs Days.
        </div>
      </Container>
    </footer>
  );
}

export { Footer };

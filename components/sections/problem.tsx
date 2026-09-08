import Image from "next/image";
import { AlertTriangle, type LucideIcon, Package, Scale } from "lucide-react";

import { Section } from "@/components/section";

interface ProblemPoint {
  icon: LucideIcon;
  title: string;
  description: string;
}

const problems: ProblemPoint[] = [
  {
    icon: AlertTriangle,
    title: "Les crédits ne sont pas recouvrés",
    description:
      "La vente à crédit est la norme du marché. Quand le cahier est mal tenu ou illisible, la créance disparaît - c'est de la trésorerie perdue.",
  },
  {
    icon: Package,
    title: "Le stock n'est pas piloté",
    description:
      "Sans historique des sorties, l'approvisionnement se fait à l'intuition : rupture sur ce qui tourne, capital immobilisé sur le reste.",
  },
  {
    icon: Scale,
    title: "La rentabilité est inconnue",
    description:
      "Chiffre d'affaires et bénéfice se confondent. Sans séparation ni historique, impossible de savoir si l'activité gagne ou perd de l'argent.",
  },
];

function Problem() {
  return (
    <Section id="probleme">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="pointer-events-none absolute inset-0 -z-10 scale-90 rounded-full bg-primary/10 blur-3xl" />
          <Image
            src="/images/mockup-triple-screens.png"
            alt="Écrans Wemá : conversation WhatsApp, tableau de bord et stock"
            width={1536}
            height={1024}
            className="h-auto w-full drop-shadow-2xl"
          />
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-primary">
              Le problème
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Ce que le cahier ne dit jamais
            </h2>
            <p className="max-w-lg text-muted-foreground">
              Trois pertes qui se cumulent, marché après marché, faute d&apos;un
              suivi fiable des ventes, du stock et des crédits.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {problems.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <Icon className="size-5" />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

export { Problem };

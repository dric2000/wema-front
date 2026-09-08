import Image from "next/image";
import {
  CheckCircle2,
  Link2,
  type LucideIcon,
  MessageCircle,
  Undo2,
} from "lucide-react";

import { Section } from "@/components/section";
import { cn } from "@/lib/utils";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const leftFeatures: Feature[] = [
  {
    icon: MessageCircle,
    title: "Elle parle comme au marché",
    description:
      "Wemá comprend le français parlé du quotidien, avec les tournures et insertions locales habituelles.",
  },
  {
    icon: Undo2,
    title: "Correction en un mot",
    description:
      "Une erreur ? Il suffit de répondre « non, c'est deux bidons » pour corriger la transaction.",
  },
];

const rightFeatures: Feature[] = [
  {
    icon: CheckCircle2,
    title: "Confirmation immédiate",
    description:
      "Chaque vocal reçoit un accusé clair en quelques secondes : montant, client, stock restant.",
  },
  {
    icon: Link2,
    title: "Traçable jusqu'au vocal source",
    description:
      "Chaque transaction reste liée au message d'origine, pour vérifier ce que le système a compris.",
  },
];

function FeatureItem({
  icon: Icon,
  title,
  description,
  align = "left",
}: Feature & { align?: "left" | "right" }) {
  return (
    <div
      className={cn(
        "flex items-start gap-4",
        align === "right" && "lg:flex-row-reverse lg:text-right"
      )}
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
        <Icon className="size-5" />
      </span>
      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function HowItWorks() {
  return (
    <Section id="comment-ca-marche" background="muted">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-sm font-medium text-primary">
          Comment ça marche
        </span>
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Un vocal suffit pour tout mettre à jour
        </h2>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-10">
        <div className="flex flex-col gap-10 lg:justify-center">
          {leftFeatures.map((feature) => (
            <FeatureItem key={feature.title} {...feature} />
          ))}
        </div>

        <div className="relative mx-auto w-full max-w-65">
          <div className="pointer-events-none absolute inset-0 -z-10 scale-90 rounded-full bg-primary/10 blur-3xl" />
          <Image
            src="/images/mockup-dashboard-transparent.png"
            alt="Tableau de bord Wemá avec ventes, créances et stock"
            width={408}
            height={612}
            className="h-auto w-full drop-shadow-2xl"
          />
        </div>

        <div className="flex flex-col gap-10 lg:justify-center">
          {rightFeatures.map((feature) => (
            <FeatureItem key={feature.title} {...feature} align="right" />
          ))}
        </div>
      </div>
    </Section>
  );
}

export { HowItWorks };

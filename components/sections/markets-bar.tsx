import { HandCoins, Landmark, Scissors, Store, Users, Wheat } from "lucide-react";

import { Section } from "@/components/section";

const segments = [
  { icon: Store, label: "Marchés urbains" },
  { icon: HandCoins, label: "Commerces de quartier" },
  { icon: Wheat, label: "Produits agricoles" },
  { icon: Scissors, label: "Artisanat" },
  { icon: Users, label: "Coopératives" },
  { icon: Landmark, label: "Microfinance" },
];

function MarketsBar() {
  return (
    <Section className="py-5 sm:py-16">
      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">
          Pensé pour le commerce de proximité béninois
        </h2>
        <p className="text-sm text-muted-foreground">
          Des marchés urbains aux coopératives partenaires
        </p>
      </div>
      <div className="mt-10 grid grid-cols-3 gap-x-6 gap-y-8 sm:grid-cols-6">
        {segments.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 text-center"
          >
            <span className="flex size-12 items-center justify-center rounded-full border border-border text-primary">
              <Icon className="size-5" />
            </span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

export { MarketsBar };

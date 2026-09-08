import { FileX, Languages, Mic, Smartphone } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const trustPoints = [
  { icon: Smartphone, label: "Sans installation" },
  { icon: FileX, label: "Sans formulaire" },
  { icon: Languages, label: "En français du marché" },
];

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-linear-to-br from-[#0b3b2d] via-primary to-[#1f9270] text-white">
      <div
        className="pointer-events-none absolute left-6 top-10 h-28 w-40 opacity-30 sm:left-10 sm:top-14"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1.5px)",
          backgroundSize: "14px 14px",
        }}
      />
      <div className="pointer-events-none absolute right-10 top-12 hidden size-14 rounded-full border-2 border-white/25 sm:block lg:right-16" />
      <div className="pointer-events-none absolute -right-16 bottom-0 size-72 rounded-full bg-warning/30 blur-3xl" />

      <Container className="relative z-10 grid items-center gap-12 pt-24 pb-28 lg:grid-cols-2 lg:gap-16 lg:pt-28 lg:pb-36">
        <div className="flex flex-col items-start gap-6">
          <Badge
            variant="outline"
            className="border-white/25 bg-white/10 text-white backdrop-blur"
          >
            Assistant vocal WhatsApp
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Elle parle. Wemá s&apos;occupe du reste.
          </h1>
          <p className="max-w-xl text-lg text-white/80">
            Zéro saisie, zéro formulaire, zéro appli à installer. La commerçante
            envoie un message vocal sur WhatsApp comme elle le fait déjà tous
            les jours - Wemá note la vente, met à jour le stock et suit les
            créances à sa place.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
            >
              Essayer sur WhatsApp
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10"
            >
              Voir comment ça marche
            </Button>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4 pt-4">
            {trustPoints.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-full bg-white/15">
                  <Icon className="size-4.5 text-white" />
                </span>
                <span className="text-sm text-white/85">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md scale-110 lg:max-w-lg">
          <div className="pointer-events-none absolute inset-0 -z-10 scale-90 rounded-full bg-white/15 blur-3xl" />
          <Image
            src="/images/mockup-hero-transparent.png"
            alt="Conversation WhatsApp Wemá et tableau de bord des ventes"
            width={612}
            height={408}
            priority
            className="h-auto w-full drop-shadow-2xl"
          />
          <div className="absolute -left-2 bottom-8 flex size-14 items-center justify-center rounded-full bg-white shadow-xl sm:-left-4 sm:bottom-12">
            <Mic className="size-6 text-primary" />
          </div>
        </div>
      </Container>

      <svg
        className="absolute inset-x-0 bottom-0 h-16 w-full text-background sm:h-20"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0,40 C240,90 480,0 720,30 C960,60 1200,100 1440,50 L1440,100 L0,100 Z"
          fill="currentColor"
        />
      </svg>
    </section>
  );
}

export { Hero };

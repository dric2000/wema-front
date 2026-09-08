import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section } from "@/components/section";

const faqs = [
  {
    question: "Wemá comprend-il le fon ou le yoruba ?",
    answer:
      "Pas pour l'instant, et nous ne le prétendons pas. Wemá traite le français parlé du marché, avec les insertions locales courantes, ce qui couvre la majorité des échanges commerciaux observés. Les langues nationales sont un axe de développement identifié, pas une promesse actuelle.",
  },
  {
    question: "En quoi est-ce différent de ChatGPT ?",
    answer:
      "Un assistant généraliste ne conserve pas d'état métier : il ne connaît ni votre stock, ni vos clientes, ni vos soldes, et ne relance personne. Wemá est un système de gestion dont l'interface est simplement conversationnelle.",
  },
  {
    question: "Que se passe-t-il si Wemá se trompe ?",
    answer:
      "Chaque transaction est confirmée et reste corrigible en langage naturel avant d'être considérée comme définitive — il suffit de répondre pour corriger un montant, une quantité ou un client.",
  },
  {
    question: "Ça fonctionne sans bonne connexion internet ?",
    answer:
      "WhatsApp reste utilisable sur des connexions dégradées. Le message vocal part en file d'attente et se synchronise dès le retour du réseau.",
  },
  {
    question: "Mes données sont-elles protégées ?",
    answer:
      "Vos données vous appartiennent. Aucun partage avec un tiers — coopérative ou institution de microfinance — sans votre consentement explicite.",
  },
  {
    question: "Est-ce payant ?",
    answer:
      "L'objectif est un abonnement mensuel très léger, avec une gratuité en dessous d'un certain volume de transactions. Ce modèle est encore en cours de validation auprès des premières utilisatrices.",
  },
];

function Faq() {
  return (
    <Section id="faq">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-2 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Questions fréquentes
        </h2>
        <p className="text-muted-foreground">
          Tout ce qu&apos;il faut savoir avant d&apos;essayer Wemá.
        </p>
      </div>

      <Accordion multiple className="mt-12">
        {faqs.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}

export { Faq };

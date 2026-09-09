import {
  Box,
  FileText,
  House,
  Settings,
  ShoppingCart,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface DashboardNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  subtitle: string;
}

export const dashboardNavItems: DashboardNavItem[] = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: House,
    subtitle: "Voici l'activité de votre commerce aujourd'hui",
  },
  {
    title: "Ventes",
    href: "/dashboard/ventes",
    icon: ShoppingCart,
    subtitle: "Consultez l'historique et le détail de vos ventes",
  },
  {
    title: "Créances",
    href: "/dashboard/creances",
    icon: Users,
    subtitle: "Suivez les soldes dus par vos clientes",
  },
  {
    title: "Stock",
    href: "/dashboard/stock",
    icon: Box,
    subtitle: "Suivez vos stocks de marchandises et réapprovisionnements",
  },
  {
    title: "Clientes",
    href: "/dashboard/clientes",
    icon: User,
    subtitle: "Retrouvez vos clientes et leur historique",
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: FileText,
    subtitle: "Journal complet des ventes, paiements et dépenses",
  },
  {
    title: "Paramètres",
    href: "/dashboard/parametres",
    icon: Settings,
    subtitle: "Gérez votre compte et vos préférences",
  },
];

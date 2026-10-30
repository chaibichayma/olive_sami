

import {
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardList,
  Container,
  Droplet,
  Factory,
  FileText,
  HardHat,
  Home,
  Settings,
  ShieldCheck,
  Tags,
  UserCheck,
  UserRound,
  UserX,
  Users,
  Wallet,
  Wrench,
  Building2,
  ShoppingCart,
} from 'lucide-react';

import { type MenuConfig } from './types';

export const MENU_SIDEBAR: MenuConfig = [
  {
    title: 'Tableau de bord',
    icon: Home,
    path: '/store-admin/dashboard',
  },

  {
    title: 'Paramétrage',
    icon: Settings,
    children: [
      {
        title: 'Fonctions',
        icon: Wrench,
        path: '/store-admin/functions',
      },
      {
  title: 'Départements',
  icon: Building2,
  path: '/store-admin/departements',
},
      {
        title: 'Citernes',
        icon: Container,
        path: '/store-admin/tanks',
      },
      {
  title: 'Rubriques',
  icon: Tags,
  path: '/store-admin/rubrics',
},
    ],
  },

  {
    title: 'Sécurité',
    icon: ShieldCheck,
    children: [
      {
        title: 'Utilisateurs',
        icon: Users,
        path: '/store-admin/users',
      }
    ],
  },

  {
    title: 'Production',
    icon: Factory,
    children: [
      {
        title: 'Saison',
        icon: CalendarDays,
        path: '/store-admin/saison',
      },
      {
        title: 'Compte',
        icon: BriefcaseBusiness,
        path: '/store-admin/accounts',
      },
      {
        title: 'Bon de réception',
        icon: FileText,
        path: '/store-admin/reception-vouchers',
      },
      {
  title: 'Traitement des bases',
  icon: Settings,
  path: '/store-admin/traitement-bases',
},
      {
        title: 'Vente huile',
        icon: ShoppingCart,
        path: '/store-admin/oil-sales',
      },
      {
        title: 'Achat huile',
        icon: Droplet,
        path: '/store-admin/oil-purchases',
      },
    ],
  },

  {
    title: 'Trésorerie',
    icon: Wallet,
    children: [],
  },

  {
    title: 'Gestion Administrative',
    icon: ClipboardList,
    children: [
      {
        title: 'Gestion des ouvriers',
        icon: HardHat,
        path: '/store-admin/workers',
      },
      {
        title: 'Planning des ouvriers',
        icon: CalendarDays,
        path: '/store-admin/worker-plannings',
      },
      {
  title: 'Gestion des présences',
  icon: UserCheck,
  path: '/store-admin/worker-attendances',
},
      {
        title: 'Paiement des ouvriers',
        icon: Wallet,
        path: '/store-admin/worker-payments',
      },
    ],
  },

  {
    title: 'Édition et statistiques',
    icon: BarChart3,
    children: [],
  },
];

export const MENU_SIDEBAR_CUSTOM: MenuConfig = MENU_SIDEBAR;
export const MENU_SIDEBAR_COMPACT: MenuConfig = MENU_SIDEBAR;

export const MENU_MEGA: MenuConfig = [];
export const MENU_MEGA_MOBILE: MenuConfig = [];
export const MENU_HELP: MenuConfig = [];

export const MENU_ROOT: MenuConfig = [
  {
    title: 'Tableau de bord',
    icon: Home,
    rootPath: '/store-admin/',
    path: '/store-admin/dashboard',
    childrenIndex: 0,
  },
  {
    title: '1. Paramétrage',
    icon: Settings,
    rootPath: '/store-admin/',
    path: '/store-admin/functions',
    childrenIndex: 1,
  },
  {
    title: '2. Sécurité',
    icon: ShieldCheck,
    rootPath: '/store-admin/',
    path: '/store-admin/users',
    childrenIndex: 2,
  },
  {
    title: '3. Production',
    icon: Factory,
    rootPath: '/store-admin/',
    path: '/store-admin/saison',
    childrenIndex: 3,
  },
  {
    title: '4. Trésorerie',
    icon: Wallet,
    rootPath: '/store-admin/',
    path: '/store-admin/treasury',
    childrenIndex: 4,
  },
  {
    title: '5. Gestion Administrative',
    icon: ClipboardList,
    rootPath: '/store-admin/',
    path: '/store-admin/workers',
    childrenIndex: 5,
  },
  {
    title: '6. Édition et statistiques',
    icon: BarChart3,
    rootPath: '/store-admin/',
    path: '/store-admin/reports',
    childrenIndex: 6,
  },
];

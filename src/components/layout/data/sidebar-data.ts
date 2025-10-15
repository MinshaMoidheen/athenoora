import {
  IconHome,
  IconUsers,
  IconShoppingBag,
  IconPercentage,
  IconShoppingCart,
  IconTrendingUp,
  IconBuilding,
  IconSettings,
  IconHelp,
  IconPlus,
  IconBrandWhatsapp,
  IconNetwork,
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'reoring',
    email: 'reoring@gmail.com',
    avatar: '/avatars/default.svg',
  },
  teams: [
    {
      name: 'Next Shadcn Admin',
      logo: Command,
      plan: 'Next.js + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: '',
      items: [
        {
          title: 'Home',
          url: '/',
          icon: IconHome,
        },
        {
          title: 'Parties',
          icon: IconUsers,
          items: [
            {
              title: 'Party Details',
              url: '/parties',
              icon: IconPlus,
            },
            {
              title: 'WhatsApp Connect',
              url: '/parties/whatsapp-connect',
              icon: IconBrandWhatsapp,
            },
            {
              title: 'Vyapar Network',
              url: '/parties/vyapar-network',
              icon: IconNetwork,
            },
          ],
        },
        {
          title: 'Items',
          url: '/items',
          icon: IconShoppingBag,
          // badge: '+',
        },
        {
          title: 'Sale',
          icon: IconPercentage,
          items: [
            {
              title: 'Sale Invoices',
              url: '/sales',
              
            },
            {
              title: 'Estimate/ Quotation',
              url: '/sales/estimates',
              
            },
            {
              title: 'Proforma Invoice',
              url: '/sales/proforma',
            },
            {
              title: 'Payment-In',
              url: '/sales/payment-in',
              
            },
            {
              title: 'Sale Order',
              url: '/sales/order',
              // icon: IconPlus,
            },
            {
              title: 'Delivery Challan',
              url: '/sales/delivery',
              
            },
            {
              title: 'Sale Return/ Credit Note',
              url: '/sales/return',
             
            },
          ],
        },
        {
          title: 'Purchase & Expense',
          url: '/purchase',
          icon: IconShoppingCart,
        },
        {
          title: 'Grow Your Business',
          url: '/grow',
          icon: IconTrendingUp,
        },
        {
          title: 'Cash & Bank',
          url: '/cash-bank',
          icon: IconBuilding,
        },
        {
          title: 'Settings',
          url: '/settings',
          icon: IconSettings,
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: IconHelp,
        },
      ],
    },
  ],
}

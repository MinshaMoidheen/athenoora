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
  IconBook,
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd, BookOpen, Users, GraduationCap, UserCheck, Download, FileText, Folder } from 'lucide-react'
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
          title: 'Course Classes',
          url: '/course-classes',
          icon: BookOpen,
        },
        {
          title: 'Sections',
          url: '/sections',
          icon: Users,
        },
        {
          title: 'Subjects',
          url: '/subjects',
          icon: GraduationCap,
        },
        {
          title: 'Teachers',
          url: '/teachers',
          icon: UserCheck,
        },
        {
          title: 'Folders',
          url: '/folders',
          icon: Folder,
        },
        {
          title: 'Export',
          url: '/export',
          icon: Download,
        },
        {
          title: 'Logs',
          url: '/logs',
          icon: FileText,
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

import { MessageCircle, Send, Hash, Gamepad2 } from 'lucide-react'
import type { ComponentType } from 'react'

export interface ChannelDefinition {
  id: string
  title: string
  description: string
  icon: ComponentType<{ className?: string }>
  color: string
}

export const AVAILABLE_CHANNELS: ChannelDefinition[] = [
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    description: 'Chat with your agent on WhatsApp — the most popular messaging app.',
    icon: MessageCircle,
    color: 'text-green-500',
  },
  {
    id: 'telegram',
    title: 'Telegram',
    description: 'Add your agent to Telegram for fast, secure conversations.',
    icon: Send,
    color: 'text-blue-500',
  },
  {
    id: 'slack',
    title: 'Slack',
    description: 'Bring your agent into your Slack workspace as a bot.',
    icon: Hash,
    color: 'text-purple-500',
  },
  {
    id: 'discord',
    title: 'Discord',
    description: 'Deploy your agent as a Discord bot for your community.',
    icon: Gamepad2,
    color: 'text-indigo-500',
  },
]

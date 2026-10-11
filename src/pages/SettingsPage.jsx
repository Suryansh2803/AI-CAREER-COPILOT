import { motion } from 'framer-motion'
import { Settings, Bell, Shield, Palette, User, ChevronRight } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const settingsGroups = [
  {
    title: 'Account',
    icon: User,
    items: [
      { label: 'Personal Information', description: 'Update your name, email and bio' },
      { label: 'Change Password', description: 'Manage your account security' },
      { label: 'Connected Accounts', description: 'GitHub, LinkedIn, Google' },
    ],
  },
  {
    title: 'Notifications',
    icon: Bell,
    items: [
      { label: 'Email Notifications', description: 'Job matches, career insights', badge: 'On' },
      { label: 'Push Notifications', description: 'Browser and mobile alerts', badge: 'Off' },
      { label: 'Weekly Digest', description: 'Career progress summaries', badge: 'On' },
    ],
  },
  {
    title: 'Privacy & Security',
    icon: Shield,
    items: [
      { label: 'Profile Visibility', description: 'Control who sees your profile' },
      { label: 'Data Export', description: 'Download your career data' },
      { label: 'Delete Account', description: 'Permanently remove your account', danger: true },
    ],
  },
  {
    title: 'Appearance',
    icon: Palette,
    items: [
      { label: 'Theme', description: 'Dark mode (active)', badge: 'Dark' },
      { label: 'Accent Color', description: 'Cyan / Purple / Blue' },
    ],
  },
]

export default function SettingsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-gray-400 text-sm">Manage your account preferences</p>
      </motion.div>

      <div className="space-y-5">
        {settingsGroups.map((group, gi) => (
          <Card key={group.title} animate delay={gi * 0.08}>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-card-border">
              <group.icon size={16} className="text-cyan-400" />
              <h2 className="text-sm font-semibold text-gray-200">{group.title}</h2>
            </div>
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-800/60 transition-colors group text-left"
                >
                  <div>
                    <p className={`text-sm font-medium ${item.danger ? 'text-red-400' : 'text-gray-200'}`}>
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <Badge variant={item.badge === 'On' ? 'green' : 'default'} size="sm">
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 text-center text-xs text-gray-600">
        AI Career Copilot v1.0.0 · Phase 1 Foundation
      </div>
    </div>
  )
}

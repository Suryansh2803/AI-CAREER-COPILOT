import { motion } from 'framer-motion'
import { UserCircle, Mail, MapPin, Briefcase, Edit3, Camera } from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import ProgressBar from '../components/ui/ProgressBar'

import { useAuth } from '../context/AuthContext'

const skills = ['React.js', 'JavaScript', 'Python', 'Node.js', 'TypeScript', 'SQL', 'Git']

export default function ProfilePage() {
  const { user } = useAuth()
  const userName = user?.name || 'Suryansh Dev'
  const userEmail = user?.email || 'suryansh@example.com'

  const profileFields = [
    { label: 'Email', value: userEmail, icon: Mail },
    { label: 'Location', value: 'Mumbai, India', icon: MapPin },
    { label: 'Current Role', value: user?.onboardingData?.targetRole || 'Computer Science Student', icon: Briefcase },
  ]
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.h1
        className="text-2xl font-bold text-white mb-6"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        My Profile
      </motion.h1>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Profile card */}
        <Card animate className="lg:col-span-1 text-center">
          {/* Avatar with camera edit */}
          <div className="relative inline-block mb-4">
            <Avatar name={userName} size="xl" status="online" />
            <button className="absolute -bottom-1 -right-1 h-7 w-7 bg-cyan-500 hover:bg-cyan-400 rounded-full flex items-center justify-center transition-colors shadow-glow-cyan">
              <Camera size={13} className="text-bg-primary" />
            </button>
          </div>

          <h2 className="text-lg font-bold text-white">{userName}</h2>
          <p className="text-sm text-gray-400 mb-3">CS Student · Aspiring SWE</p>

          <div className="flex justify-center gap-2 mb-5">
            <Badge variant="cyan" dot>Pro Member</Badge>
            <Badge variant="purple">Active</Badge>
          </div>

          <div className="space-y-2.5 text-left">
            {profileFields.map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <f.icon size={14} className="text-gray-500 flex-shrink-0" />
                <div>
                  <p className="text-2xs text-gray-600">{f.label}</p>
                  <p className="text-xs text-gray-300">{f.value}</p>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" size="sm" icon={Edit3} fullWidth className="mt-5">
            Edit Profile
          </Button>
        </Card>

        {/* Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Profile completion */}
          <Card animate delay={0.1}>
            <Card.Header>
              <div className="flex items-center justify-between">
                <div>
                  <Card.Title>Profile Completeness</Card.Title>
                  <Card.Description>Complete your profile for better AI recommendations</Card.Description>
                </div>
                <span className="text-2xl font-bold gradient-text">68%</span>
              </div>
            </Card.Header>
            <ProgressBar value={68} variant="gradient" size="md" />
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {[
                { label: 'Basic Info', done: true },
                { label: 'Skills', done: true },
                { label: 'Resume Upload', done: false },
                { label: 'Career Goals', done: true },
                { label: 'Work Experience', done: false },
                { label: 'Education', done: true },
              ].map((item) => (
                <div key={item.label} className={`flex items-center gap-2 ${item.done ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${item.done ? 'bg-emerald-400' : 'bg-gray-700'}`} />
                  {item.label}
                </div>
              ))}
            </div>
          </Card>

          {/* Skills */}
          <Card animate delay={0.15}>
            <Card.Header>
              <div className="flex items-center justify-between">
                <Card.Title>Skills</Card.Title>
                <Button variant="ghost" size="xs" icon={Edit3}>Edit</Button>
              </div>
            </Card.Header>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="default" size="lg">{skill}</Badge>
              ))}
              <button className="badge bg-gray-800/50 border border-dashed border-gray-700 text-gray-500 hover:border-cyan-500/30 hover:text-cyan-400 transition-colors text-xs px-3 py-1">
                + Add skill
              </button>
            </div>
          </Card>

          {/* About */}
          <Card animate delay={0.2}>
            <Card.Header>
              <div className="flex items-center justify-between">
                <Card.Title>About</Card.Title>
                <Button variant="ghost" size="xs" icon={Edit3}>Edit</Button>
              </div>
            </Card.Header>
            <p className="text-sm text-gray-400 leading-relaxed">
              Passionate computer science student with a focus on full-stack development and AI applications. 
              Looking for opportunities to work at innovative tech companies where I can apply my skills 
              and grow as a software engineer.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

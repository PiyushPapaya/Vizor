import { Shield, Lock, Zap, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const badges = [
  {
    icon: Shield,
    key: 'no_account',
    label: 'No account needed',
  },
  {
    icon: Lock,
    key: 'privacy_first',
    label: 'Privacy-first · data stays local',
  },
  {
    icon: Zap,
    key: 'instant',
    label: 'Instant · no installation',
  },
  {
    icon: Github,
    key: 'open_source',
    label: 'Free & open source',
  },
];

export default function TrustBadges() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 mt-6"
    >
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <motion.div
            key={badge.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-muted/30 backdrop-blur-sm border border-border/40 hover:border-primary/40 transition-colors max-w-full"
          >
            <Icon className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-[11px] sm:text-xs font-medium text-muted-foreground break-words">
              {badge.label}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

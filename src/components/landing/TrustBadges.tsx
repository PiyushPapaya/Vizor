import { Shield, Lock, Zap, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const badges = [
  {
    icon: Shield,
    key: 'no_account',
    label: 'No account needed',
  },
  {
    icon: Lock,
    key: 'privacy_first',
    label: 'Privacy-first • Data stays local',
  },
  {
    icon: Zap,
    key: 'instant',
    label: 'Instant • No installation',
  },
  {
    icon: Users,
    key: 'trusted',
    label: 'Trusted by 10,000+ users',
  },
];

export default function TrustBadges() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-6"
    >
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <motion.div
            key={badge.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 backdrop-blur-sm border border-border/40 hover:border-primary/40 transition-colors"
          >
            <Icon className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              {badge.label}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

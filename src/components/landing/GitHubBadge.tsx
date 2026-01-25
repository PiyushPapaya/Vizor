import { Star, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function GitHubBadge() {
  const [stars, setStars] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch GitHub stars (replace with your actual repo)
    // For now, using a placeholder value
    setTimeout(() => {
      setStars(847); // Placeholder - update with real API call
      setLoading(false);
    }, 500);

    // Uncomment to use real GitHub API:
    /*
    fetch('https://api.github.com/repos/YOUR_USERNAME/vizor')
      .then(res => res.json())
      .then(data => {
        setStars(data.stargazers_count);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    */
  }, []);

  if (loading || stars === null) {
    return null;
  }

  return (
    <motion.a
      href="https://github.com/YOUR_USERNAME/vizor"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 backdrop-blur-sm border border-border/40 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
    >
      <Github className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      <div className="flex items-center gap-1.5">
        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
        <span className="font-semibold text-foreground">
          {stars.toLocaleString()}
        </span>
        <span className="text-sm text-muted-foreground">stars on GitHub</span>
      </div>
    </motion.a>
  );
}

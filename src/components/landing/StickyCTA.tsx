import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`fixed z-40 transition-all duration-500 ease-out
        bottom-[max(0.75rem,env(safe-area-inset-bottom))] 
        left-3 right-3 sm:left-auto sm:right-4 md:right-6 sm:bottom-6
        ${isVisible 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
    >
      <Link to="/app" className="block">
        <Button
          size="lg"
          className="w-full sm:w-auto shadow-2xl shadow-primary/25 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 text-sm sm:text-base px-5 sm:px-7 h-12 sm:h-13 rounded-xl font-bold"
        >
          Start now
          <ArrowRight className="ml-1.5 sm:ml-2 w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Button>
      </Link>
    </div>
  );
}

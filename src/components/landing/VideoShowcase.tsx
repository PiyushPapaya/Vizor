import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useState } from 'react';

export default function VideoShowcase() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-muted/30 to-background" />
      
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 text-sm px-4 py-2">
            Demo
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Watch how it works
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            From CSV to chart in under a minute
          </p>
        </div>

        {/* Single Featured Demo Video */}
        <Card className="bg-card border border-border/60 overflow-hidden shadow-xl">
          <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20">
            {showVideo ? (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <p className="text-muted-foreground">Video player would load here</p>
              </div>
            ) : (
              <>
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop" 
                  alt="Vizor Demo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group hover:bg-black/30 transition-colors cursor-pointer" onClick={() => setShowVideo(true)}>
                  <div className="w-20 h-20 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-10 h-10 text-white ml-1" fill="white" />
                  </div>
                </div>
                <Badge variant="secondary" className="absolute bottom-4 right-4 bg-black/70 text-white backdrop-blur-sm">
                  0:45
                </Badge>
              </>
            )}
          </div>
        </Card>

        <div className="text-center mt-8">
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => setShowVideo(true)}
          >
            <Play className="mr-2" />
            Watch demo
          </Button>
        </div>
      </div>
    </section>
  );
}

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Video, Youtube } from 'lucide-react';
import { useState } from 'react';

const videos = [
  {
    title: 'Getting Started with Vizor',
    duration: '5:24',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
    category: 'Tutorial',
    videoId: 'dQw4w9WgXcQ'
  },
  {
    title: 'Creating Advanced Visualizations',
    duration: '8:15',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
    category: 'Advanced',
    videoId: 'dQw4w9WgXcQ'
  },
  {
    title: 'Data Import & Export Guide',
    duration: '6:42',
    thumbnail: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=450&fit=crop',
    category: 'Tutorial',
    videoId: 'dQw4w9WgXcQ'
  }
];

export default function VideoShowcase() {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-muted/30 to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 text-sm px-4 py-2">
            <Video className="w-4 h-4 mr-2 inline" />
            Video Tutorials
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
            Learn by Watching
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Follow along with quick video tutorials — we'll show you everything step-by-step
          </p>
        </div>

        {/* Featured Video */}
        <Card className="bg-card border border-border/60 overflow-hidden mb-12 shadow-xl">
          <div className="grid md:grid-cols-2 gap-0">
            <div 
              className="relative aspect-video md:aspect-auto bg-gradient-to-br from-primary/20 to-accent/20 cursor-pointer group"
              onClick={() => setSelectedVideo(0)}
            >
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop" 
                alt="Featured Tutorial"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 text-white ml-1" fill="white" />
                </div>
              </div>
              <Badge className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm">
                Featured
              </Badge>
              <Badge variant="secondary" className="absolute bottom-4 right-4 bg-black/70 text-white backdrop-blur-sm">
                12:34
              </Badge>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <Badge className="w-fit mb-4">Tutorial</Badge>
              <h3 className="text-3xl font-bold mb-4">
                Your Complete Vizor Walkthrough
              </h3>
              <p className="text-muted-foreground mb-6 text-lg">
                Everything you need to get started — from your first chart to advanced customization. We'll walk you through it all, one step at a time.
              </p>
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="group"
                  onClick={() => setSelectedVideo(0)}
                >
                  <Play className="mr-2 group-hover:scale-110 transition-transform" />
                  Watch Now
                </Button>
                <Button size="lg" variant="outline">
                  <Youtube className="mr-2" />
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <Card 
              key={index}
              className="group cursor-pointer overflow-hidden bg-card border border-border/60 hover:shadow-xl transition-shadow duration-300"
              onClick={() => setSelectedVideo(index)}
            >
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white ml-1" fill="white" />
                  </div>
                </div>
                <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm">
                  {video.category}
                </Badge>
                <Badge variant="secondary" className="absolute bottom-3 right-3 bg-black/70 text-white backdrop-blur-sm text-xs">
                  {video.duration}
                </Badge>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
              </div>
            </Card>
          ))}
        </div>

        {/* Video Player Modal */}
        {selectedVideo !== null && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={() => setSelectedVideo(null)}
          >
            <div className="relative max-w-6xl w-full aspect-video">
              <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <Youtube className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-xl">Video Player</p>
                  <p className="text-sm text-white/60 mt-2">
                    Replace with actual video embed (YouTube, Vimeo, etc.)
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                onClick={() => setSelectedVideo(null)}
              >
                ✕
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

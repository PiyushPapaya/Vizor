import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Image, Maximize2 } from 'lucide-react';
import { useState } from 'react';

const galleryImages = [
  {
    title: 'Beautiful Bar Charts',
    category: 'Bar Charts',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    description: 'Create stunning bar charts with custom colors and animations'
  },
  {
    title: 'Dynamic Line Graphs',
    category: 'Line Charts',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    description: 'Track trends with smooth, responsive line charts'
  },
  {
    title: 'Interactive Pie Charts',
    category: 'Pie Charts',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop',
    description: 'Visualize proportions with elegant pie and donut charts'
  },
  {
    title: 'Complex Data Dashboards',
    category: 'Dashboards',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    description: 'Combine multiple charts into comprehensive dashboards'
  },
  {
    title: 'Real-time Analytics',
    category: 'Analytics',
    image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&h=600&fit=crop',
    description: 'Monitor live data with real-time updating charts'
  },
  {
    title: 'Custom Visualizations',
    category: 'Custom',
    image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&h=600&fit=crop',
    description: 'Design unique visualizations tailored to your needs'
  }
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 text-sm px-4 py-2">
            <Image className="w-4 h-4 mr-2 inline" />
            Gallery
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
            See What's Possible
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Real examples from people just like you — turning data into beautiful stories that make an impact
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((item, index) => (
            <Card 
              key={index}
              className="group cursor-pointer overflow-hidden bg-card border border-border/60 hover:shadow-xl transition-shadow duration-300"
              onClick={() => setSelectedImage(index)}
            >
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Maximize2 className="w-8 h-8 text-white" />
                </div>
                <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm">
                  {item.category}
                </Badge>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage !== null && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-6xl w-full">
              <img 
                src={galleryImages[selectedImage].image} 
                alt={galleryImages[selectedImage].title}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <Badge className="mb-2">
                  {galleryImages[selectedImage].category}
                </Badge>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {galleryImages[selectedImage].title}
                </h3>
                <p className="text-white/80">
                  {galleryImages[selectedImage].description}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                onClick={() => setSelectedImage(null)}
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

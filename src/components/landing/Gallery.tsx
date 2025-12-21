import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Image, Maximize2 } from 'lucide-react';
import { useState } from 'react';

const galleryImages = [
  {
    title: 'Survey data to clean bar chart',
    category: 'Bar Charts',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    description: 'Messy survey results transformed into a clean, presentation-ready bar chart in seconds.',
    problem: 'Survey data'
  },
  {
    title: 'Sales trends over time',
    category: 'Line Charts',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    description: 'Monthly sales numbers become a clear line graph that shows growth at a glance.',
    problem: 'Sales tracking'
  },
  {
    title: 'Budget breakdown made simple',
    category: 'Pie Charts',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop',
    description: 'Complex budget spreadsheets turned into an easy-to-read pie chart for your team.',
    problem: 'Budget visualization'
  },
  {
    title: 'Analytics dashboard in minutes',
    category: 'Dashboards',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    description: 'Multiple data sources combined into one comprehensive dashboard without coding.',
    problem: 'Multiple metrics'
  },
  {
    title: 'Project progress at a glance',
    category: 'Analytics',
    image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&h=600&fit=crop',
    description: 'Task completion rates visualized so everyone knows where the project stands.',
    problem: 'Project tracking'
  },
  {
    title: 'Student grades made clear',
    category: 'Custom',
    image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&h=600&fit=crop',
    description: 'Grade distributions displayed in a way students and parents actually understand.',
    problem: 'Grade reporting'
  }
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 md:px-8 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <Badge className="mb-3 sm:mb-4 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
            <Image className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 inline" />
            Examples
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
            Real problems. Real solutions.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            See how Vizor turns messy data into clear answers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {galleryImages.map((item, index) => (
            <Card 
              key={index}
              className="group cursor-pointer overflow-hidden bg-card border-2 border-border/60 hover:border-primary/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 touch-target"
              onClick={() => setSelectedImage(index)}
            >
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Maximize2 className="w-8 h-8 text-white" />
                </div>
                <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm">
                  {item.category}
                </Badge>
              </div>
              <div className="p-4 sm:p-5 md:p-6">
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
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

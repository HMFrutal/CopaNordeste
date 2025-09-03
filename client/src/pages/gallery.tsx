import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Celebração de vitória com troféu",
      title: "Celebração do Campeão 2024"
    },
    {
      src: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Ação intensa durante partida",
      title: "Momento Decisivo da Final"
    },
    {
      src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Reunião estratégica da equipe",
      title: "Estratégia de Jogo"
    },
    {
      src: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Vista do estádio moderno",
      title: "Estádio Arena Nordeste"
    },
    {
      src: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Jogadores em disputa de bola",
      title: "Disputa Acirrada"
    },
    {
      src: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Torcida comemorando",
      title: "A Festa da Torcida"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Galeria de Fotos</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Reviva os melhores momentos das edições anteriores da Copa Nordeste
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div 
                key={index} 
                className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedImage(image.src)}
                data-testid={`gallery-image-${index}`}
              >
                <img 
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
                  <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-semibold text-lg" data-testid={`gallery-title-${index}`}>{image.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
          data-testid="lightbox-modal"
        >
          <div className="relative max-w-5xl max-h-full">
            <img 
              src={selectedImage}
              alt="Imagem ampliada"
              className="max-w-full max-h-full object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
              data-testid="button-close-lightbox"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

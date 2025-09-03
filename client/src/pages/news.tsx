import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import type { News } from "@shared/schema";

export default function NewsPage() {
  const { data: news, isLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Notícias</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Acompanhe todas as novidades e atualizações da Copa Nordeste 2025
            </p>
          </div>

          {isLoading ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-64 w-full" />
                  <CardContent className="p-8">
                    <Skeleton className="h-4 w-32 mb-4" />
                    <Skeleton className="h-8 w-full mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-6" />
                    <Skeleton className="h-10 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !news || news.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Nenhuma notícia disponível no momento.</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {news.map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-shadow" data-testid={`card-news-${article.id}`}>
                  <img 
                    src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                    alt={article.title}
                    className="w-full h-64 object-cover"
                  />
                  <CardContent className="p-8">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span data-testid={`text-date-${article.id}`}>{article.publishedAt}</span>
                      <span className="mx-2">•</span>
                      <span data-testid={`text-author-${article.id}`}>Por {article.author}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4" data-testid={`text-title-${article.id}`}>
                      {article.title}
                    </h2>
                    <p className="text-gray-600 mb-6" data-testid={`text-excerpt-${article.id}`}>
                      {article.excerpt || article.content.substring(0, 150) + "..."}
                    </p>
                    <Button 
                      className="bg-primary hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
                      data-testid={`button-read-more-${article.id}`}
                    >
                      Ler Mais
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {news && news.length > 0 && (
            <div className="text-center mt-12">
              <Button 
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
                data-testid="button-load-more"
              >
                Carregar Mais Notícias
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

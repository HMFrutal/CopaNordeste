import { useQuery } from "@tanstack/react-query";
import { Calendar, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import TournamentShield from "@/components/tournament-shield";
import { Link } from "wouter";
import type { Team, News } from "@shared/schema";

export default function Home() {
  const { data: teams, isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const { data: news, isLoading: newsLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const topTeams = teams?.slice(0, 3) || [];
  const latestNews = news?.slice(0, 2) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="gradient-hero py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                Copa Nordeste
                <span className="block text-2xl lg:text-4xl font-semibold mt-2">7ª Edição • 2025</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl">
                O maior torneio regional de futebol de campo reunindo as melhores equipes do Nordeste. 
                Organizado por Gonzaga, Celim e Vitor - Regional Frutal MG.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/competitions">
                  <Button 
                    className="bg-white text-primary hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg"
                    data-testid="button-view-competitions"
                  >
                    Ver Competições
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button 
                    variant="outline"
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-semibold py-3 px-8 rounded-lg"
                    data-testid="button-register-team"
                  >
                    Inscrever Equipe
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0 flex justify-center">
              <TournamentShield />
            </div>
          </div>
        </div>
      </section>

      {/* Competition Info */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Calendário de Competições</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Confira o calendário completo da Copa Nordeste 2025 e acompanhe todos os jogos!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow" data-testid="card-phase-groups">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Fase de Grupos</h3>
                  <p className="text-gray-600">15 de Março - 30 de Abril</p>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 24 equipes participantes</li>
                  <li>• 6 grupos com 4 times cada</li>
                  <li>• Jogos aos finais de semana</li>
                  <li>• Classificam-se os 2 melhores</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow" data-testid="card-phase-elimination">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Fase Eliminatória</h3>
                  <p className="text-gray-600">5 de Maio - 15 de Junho</p>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Oitavas de final</li>
                  <li>• Quartas de final</li>
                  <li>• Semifinais</li>
                  <li>• Jogos eliminatórios</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow md:col-span-2 lg:col-span-1" data-testid="card-phase-final">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Grande Final</h3>
                  <p className="text-gray-600">22 de Junho</p>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Estádio principal</li>
                  <li>• Cerimônia de premiação</li>
                  <li>• Transmissão ao vivo</li>
                  <li>• Festa de encerramento</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/competitions">
              <Button 
                className="bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg"
                data-testid="button-full-calendar"
              >
                Ver Calendário Completo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Top Teams Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Classificação</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Acompanhe a classificação dos times na Copa Nordeste 2025
            </p>
          </div>

          {teamsLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {topTeams.map((team, index) => (
                <Card key={team.id} className="hover:shadow-xl transition-shadow" data-testid={`card-team-${team.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-yellow-600'
                      }`}>
                        <span className="text-white font-bold text-sm">{team.name.substring(0, 2)}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{team.name}</h3>
                        <p className="text-sm text-gray-600">{team.city} - {team.state}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="font-bold text-primary" data-testid={`text-games-${team.id}`}>{team.gamesPlayed}</div>
                        <div className="text-xs text-gray-600">Jogos</div>
                      </div>
                      <div>
                        <div className="font-bold text-green-600" data-testid={`text-wins-${team.id}`}>{team.wins}</div>
                        <div className="text-xs text-gray-600">Vitórias</div>
                      </div>
                      <div>
                        <div className="font-bold text-yellow-600" data-testid={`text-points-${team.id}`}>{team.points}</div>
                        <div className="text-xs text-gray-600">Pontos</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/teams">
              <Button 
                className="bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg"
                data-testid="button-view-all-teams"
              >
                Ver Todas as Equipes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Últimas Notícias</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Acompanhe todas as novidades da Copa Nordeste 2025
            </p>
          </div>

          {newsLoading ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse overflow-hidden">
                  <div className="h-64 bg-gray-200"></div>
                  <CardContent className="p-8">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {latestNews.map((article) => (
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-4" data-testid={`text-title-${article.id}`}>
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-6" data-testid={`text-excerpt-${article.id}`}>
                      {article.excerpt}
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

          <div className="text-center mt-12">
            <Link href="/news">
              <Button 
                className="bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg"
                data-testid="button-all-news"
              >
                Ver Todas as Notícias
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

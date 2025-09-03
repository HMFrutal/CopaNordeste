import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import type { Team } from "@shared/schema";

export default function Teams() {
  const { data: teams, isLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Equipes Participantes</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conheça todas as equipes que disputarão o título da Copa Nordeste 2025
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <img 
              src="https://images.unsplash.com/photo-1560272564-c83b66b1ad12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Celebração após gol" 
              className="rounded-xl shadow-lg w-full h-48 object-cover" 
            />
            <img 
              src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Jogadores em ação" 
              className="rounded-xl shadow-lg w-full h-48 object-cover" 
            />
            <img 
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Estratégia de time" 
              className="rounded-xl shadow-lg w-full h-48 object-cover" 
            />
            <img 
              src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Estádio moderno" 
              className="rounded-xl shadow-lg w-full h-48 object-cover" 
            />
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Skeleton className="w-12 h-12 rounded-full mr-4" />
                      <div>
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <Skeleton className="h-6 w-8 mx-auto mb-1" />
                        <Skeleton className="h-3 w-12 mx-auto" />
                      </div>
                      <div>
                        <Skeleton className="h-6 w-8 mx-auto mb-1" />
                        <Skeleton className="h-3 w-12 mx-auto" />
                      </div>
                      <div>
                        <Skeleton className="h-6 w-8 mx-auto mb-1" />
                        <Skeleton className="h-3 w-12 mx-auto" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !teams || teams.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Nenhuma equipe cadastrada ainda.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <Card key={team.id} className="hover:shadow-xl transition-shadow" data-testid={`card-team-${team.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-sm">{team.name.substring(0, 2)}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900" data-testid={`text-team-name-${team.id}`}>{team.name}</h3>
                        <p className="text-sm text-gray-600" data-testid={`text-team-location-${team.id}`}>{team.city} - {team.state}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <div className="font-bold text-primary" data-testid={`text-games-${team.id}`}>{team.gamesPlayed}</div>
                        <div className="text-xs text-gray-600">Jogos</div>
                      </div>
                      <div>
                        <div className="font-bold text-green-600" data-testid={`text-wins-${team.id}`}>{team.wins}</div>
                        <div className="text-xs text-gray-600">Vitórias</div>
                      </div>
                      <div>
                        <div className="font-bold text-gray-600" data-testid={`text-draws-${team.id}`}>{team.draws}</div>
                        <div className="text-xs text-gray-600">Empates</div>
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
        </div>
      </section>

      <Footer />
    </div>
  );
}

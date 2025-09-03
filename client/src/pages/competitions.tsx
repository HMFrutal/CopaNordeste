import { useQuery } from "@tanstack/react-query";
import { Calendar, Trophy, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import type { Competition } from "@shared/schema";

export default function Competitions() {
  const { data: competitions, isLoading } = useQuery<Competition[]>({
    queryKey: ["/api/competitions"],
  });

  const phases = [
    {
      title: "Fase de Grupos",
      period: "15 de Março - 30 de Abril",
      icon: Calendar,
      color: "bg-primary",
      details: [
        "24 equipes participantes",
        "6 grupos com 4 times cada",
        "Jogos aos finais de semana",
        "Classificam-se os 2 melhores"
      ]
    },
    {
      title: "Fase Eliminatória",
      period: "5 de Maio - 15 de Junho",
      icon: Trophy,
      color: "bg-accent",
      details: [
        "Oitavas de final",
        "Quartas de final",
        "Semifinais",
        "Jogos eliminatórios"
      ]
    },
    {
      title: "Grande Final",
      period: "22 de Junho",
      icon: Star,
      color: "bg-yellow-500",
      details: [
        "Estádio principal",
        "Cerimônia de premiação",
        "Transmissão ao vivo",
        "Festa de encerramento"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Calendário de Competições</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Confira o calendário completo da Copa Nordeste 2025 e acompanhe todos os jogos!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {phases.map((phase, index) => {
              const IconComponent = phase.icon;
              return (
                <Card key={index} className="hover:shadow-xl transition-shadow" data-testid={`card-phase-${index}`}>
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <div className={`w-16 h-16 ${phase.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2" data-testid={`text-phase-title-${index}`}>{phase.title}</h3>
                      <p className="text-gray-600" data-testid={`text-phase-period-${index}`}>{phase.period}</p>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {phase.details.map((detail, detailIndex) => (
                        <li key={detailIndex} data-testid={`text-phase-detail-${index}-${detailIndex}`}>• {detail}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-12 w-64 mx-auto" />
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-8 w-48 mb-4" />
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-4 w-40" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : !competitions || competitions.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-primary mb-4">Competições</h2>
              <p className="text-xl text-gray-600">Informações sobre as competições em breve.</p>
            </div>
          ) : (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-primary text-center">Competições Ativas</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {competitions.map((competition) => (
                  <Card key={competition.id} className="hover:shadow-xl transition-shadow" data-testid={`card-competition-${competition.id}`}>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2" data-testid={`text-competition-name-${competition.id}`}>
                        {competition.name}
                      </h3>
                      <p className="text-gray-600 mb-4" data-testid={`text-competition-description-${competition.id}`}>
                        {competition.description}
                      </p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span data-testid={`text-start-date-${competition.id}`}>Início: {competition.startDate}</span>
                        <span data-testid={`text-end-date-${competition.id}`}>Fim: {competition.endDate}</span>
                      </div>
                      <div className="mt-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          competition.isActive 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`} data-testid={`text-status-${competition.id}`}>
                          {competition.isActive ? "Ativa" : "Inativa"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

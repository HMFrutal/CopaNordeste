import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit3, Calendar, Users, Trophy } from "lucide-react";
import type { Championship } from "@shared/schema";

export default function ChampionshipDetailsPage() {
  const { id } = useParams();

  const { data: championship, isLoading, error } = useQuery<Championship>({
    queryKey: ["/api/admin/championships", id],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !championship) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Campeonato não encontrado</h1>
            <Link href="/admin/championships">
              <Button>Voltar para Campeonatos</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin/championships">
              <Button variant="ghost" size="sm" data-testid="button-back">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {championship.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Detalhes do campeonato
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Link href={`/admin/championships/${championship.id}/edit`}>
              <Button data-testid="button-edit-championship">
                <Edit3 className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Principais */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-amber-600" />
                  Informações Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Nome do Campeonato
                  </label>
                  <p className="text-lg font-semibold mt-1">{championship.name}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Data de Início
                    </label>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-2 text-green-600" />
                      <span className="font-medium">
                        {championship.startDate.split('-').reverse().join('/')}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Data de Término
                    </label>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-2 text-red-600" />
                      <span className="font-medium">
                        {championship.endDate.split('-').reverse().join('/')}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Ativo
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Criado em
                  </label>
                  <p className="mt-1">
                    {new Date(championship.createdAt || '').toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Times Inscritos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Partidas Jogadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">0</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Gols Marcados</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Imagem do Campeonato */}
            {championship.image ? (
              <Card>
                <CardHeader>
                  <CardTitle>Imagem do Campeonato</CardTitle>
                </CardHeader>
                <CardContent>
                  <img 
                    src={championship.image} 
                    alt={championship.name}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Imagem do Campeonato</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Nenhuma imagem cadastrada</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ações Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>
                  Gerencie os dados do campeonato
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/admin/championships/${championship.id}/edit`}>
                  <Button variant="outline" className="w-full" data-testid="button-edit-sidebar">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Editar Campeonato
                  </Button>
                </Link>
                <Button variant="outline" className="w-full" disabled>
                  <Users className="h-4 w-4 mr-2" />
                  Gerenciar Times
                  <Badge variant="secondary" className="ml-2">Em breve</Badge>
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  <Calendar className="h-4 w-4 mr-2" />
                  Criar Partidas
                  <Badge variant="secondary" className="ml-2">Em breve</Badge>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
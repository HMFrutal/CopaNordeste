// Removido import não usado
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Users, MapPin } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { AdminTeam } from "@shared/schema";

export default function TeamsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar times
  const {
    data: teams = [],
    isLoading,
  } = useQuery<AdminTeam[]>({
    queryKey: ["/api/admin/teams"],
  });

  // Mutation para deletar time
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/admin/teams/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/teams"] });
      toast({
        title: "Sucesso!",
        description: "Time excluído com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Erro ao excluir time:", error);
      toast({
        title: "Erro!",
        description: "Não foi possível excluir o time. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="flex justify-between pt-4">
                        <Skeleton className="h-9 w-20" />
                        <Skeleton className="h-9 w-20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Gerenciar Times
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gerencie todos os times que participarão dos campeonatos. 
                Os mesmos times podem ser reutilizados em vários campeonatos.
              </p>
            </div>
            <Link href="/admin/teams/new">
              <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-create-team">
                <Plus className="h-4 w-4 mr-2" />
                Criar Time
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total de Times
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {teams.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-4">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Cidades Representadas
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {new Set(teams.filter(t => t.city).map(t => t.city)).size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Times com Logo
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {teams.filter(t => t.image).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Times */}
          {teams.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhum time cadastrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Comece criando seu primeiro time para participar dos campeonatos
                </p>
                <Link href="/admin/teams/new">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Time
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <Card key={team.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1" data-testid={`text-team-name-${team.id}`}>
                        {team.name}
                      </CardTitle>
                      {team.image && (
                        <img
                          src={team.image}
                          alt={team.name}
                          className="h-8 w-8 object-cover rounded"
                          data-testid={`img-team-logo-${team.id}`}
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {team.city && team.state && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span data-testid={`text-team-location-${team.id}`}>
                            {team.city}, {team.state}
                          </span>
                        </div>
                      )}

                      {team.rg && (
                        <div className="text-sm text-gray-600 dark:text-gray-400" data-testid={`text-team-rg-${team.id}`}>
                          <strong>RG/CNPJ:</strong> {team.rg}
                        </div>
                      )}

                      {team.email && (
                        <div className="text-sm text-gray-600 dark:text-gray-400" data-testid={`text-team-email-${team.id}`}>
                          <strong>Email:</strong> {team.email}
                        </div>
                      )}

                      {team.phone && (
                        <div className="text-sm text-gray-600 dark:text-gray-400" data-testid={`text-team-phone-${team.id}`}>
                          <strong>Telefone:</strong> {team.phone}
                        </div>
                      )}

                      <div className="flex justify-between pt-4">
                        <Link href={`/admin/teams/${team.id}/edit`}>
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`button-edit-team-${team.id}`}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        </Link>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              data-testid={`button-delete-team-${team.id}`}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Excluir
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Time</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o time "{team.name}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(team.id)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={deleteMutation.isPending}
                              >
                                {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
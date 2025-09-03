import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, ArrowLeft, Trophy, Users, Calendar, Flag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Championship } from "@shared/schema";

export default function ChampionshipsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; championship: Championship | null }>({
    open: false,
    championship: null
  });

  // Query para buscar campeonatos
  const { data: championships = [], isLoading } = useQuery<Championship[]>({
    queryKey: ["/api/admin/championships"],
  });

  // Mutation para deletar campeonato
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/admin/championships/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/championships"] });
      toast({
        title: "Sucesso",
        description: "Campeonato deletado com sucesso",
      });
      setDeleteDialog({ open: false, championship: null });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao deletar campeonato",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (championship: Championship) => {
    setDeleteDialog({ open: true, championship });
  };

  const confirmDelete = () => {
    if (deleteDialog.championship) {
      deleteMutation.mutate(deleteDialog.championship.id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Ativo", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      inactive: { label: "Inativo", className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200" },
      finished: { label: "Finalizado", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando campeonatos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/admin">
                <Button variant="outline" size="sm" className="mr-4" data-testid="button-back">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Gestão de Campeonatos
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Gerencie todos os campeonatos e competições
                </p>
              </div>
            </div>
            <Link href="/admin/championships/new">
              <Button data-testid="button-new-championship">
                <Plus className="h-4 w-4 mr-2" />
                Novo Campeonato
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {championships.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Nenhum campeonato cadastrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Comece criando seu primeiro campeonato
              </p>
              <Link href="/admin/championships/new">
                <Button data-testid="button-create-first">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Campeonato
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {championships.map((championship: Championship) => (
              <Card key={championship.id} className="hover:shadow-lg transition-shadow" data-testid={`championship-card-${championship.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{championship.name}</CardTitle>
                      <CardDescription className="mt-1">
                        Campeonato criado em {new Date(championship.createdAt || '').toLocaleDateString('pt-BR')}
                      </CardDescription>
                    </div>
                    {getStatusBadge('active')}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Informações do campeonato */}
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {championship.startDate.split('-').reverse().join('/')} - 
                        {championship.endDate 
                          ? championship.endDate.split('-').reverse().join('/')
                          : ' Em andamento'
                        }
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4 mr-2" />
                      <span>0 times inscritos</span>
                    </div>

                    {championship.image && (
                      <div className="flex items-center justify-center">
                        <img 
                          src={championship.image} 
                          alt={championship.name}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    {/* Ações */}
                    <div className="flex justify-between pt-4 border-t">
                      <Link href={`/admin/championships/${championship.id}`}>
                        <Button variant="outline" size="sm" data-testid={`button-view-${championship.id}`}>
                          Ver Detalhes
                        </Button>
                      </Link>
                      
                      <div className="flex gap-2">
                        <Link href={`/admin/championships/${championship.id}/edit`}>
                          <Button variant="outline" size="sm" data-testid={`button-edit-${championship.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(championship)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          data-testid={`button-delete-${championship.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, championship: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar o campeonato "{deleteDialog.championship?.name}"?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialog({ open: false, championship: null })}
              data-testid="button-cancel-delete"
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deletando..." : "Deletar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
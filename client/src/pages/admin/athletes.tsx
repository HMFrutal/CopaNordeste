import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { User, Plus, Search, Edit, Trash2, FileImage } from "lucide-react";
import { useLocation } from "wouter";
import { type Athlete } from "@shared/schema";

export default function AthletesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [location, setLocation] = useLocation();

  const { data: athletes = [], isLoading } = useQuery({
    queryKey: ["/api/admin/athletes"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/admin/athletes/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/athletes"] });
      setDeleteDialogOpen(false);
      setSelectedAthlete(null);
    },
  });

  const filteredAthletes = athletes.filter((athlete: Athlete) =>
    athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (athlete.document && athlete.document.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (id: string) => {
    setLocation(`/admin/athletes/${id}/edit`);
  };

  const handleDelete = (athlete: Athlete) => {
    setSelectedAthlete(athlete);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAthlete) {
      deleteMutation.mutate(selectedAthlete.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Atletas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie os atletas do torneio
          </p>
        </div>
        <Button
          onClick={() => setLocation("/admin/athletes/new")}
          className="bg-navy-600 hover:bg-navy-700 text-white"
          data-testid="button-new-athlete"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Atleta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Lista de Atletas
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome ou documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-athletes"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600"></div>
            </div>
          ) : filteredAthletes.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? "Nenhum atleta encontrado" : "Nenhum atleta cadastrado"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAthletes.map((athlete: Athlete) => (
                <Card key={athlete.id} className="hover:shadow-md transition-shadow" data-testid={`card-athlete-${athlete.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {athlete.image ? (
                          <img
                            src={athlete.image}
                            alt={athlete.name}
                            className="h-12 w-12 rounded-full object-cover"
                            data-testid={`img-athlete-${athlete.id}`}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-navy-100 dark:bg-navy-800 flex items-center justify-center">
                            <User className="h-6 w-6 text-navy-600 dark:text-navy-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white" data-testid={`text-athlete-name-${athlete.id}`}>
                            {athlete.name}
                          </h3>
                          {athlete.document && (
                            <p className="text-sm text-gray-600 dark:text-gray-400" data-testid={`text-athlete-document-${athlete.id}`}>
                              {athlete.document}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {athlete.image ? "Com foto" : "Sem foto"}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(athlete.id)}
                          data-testid={`button-edit-athlete-${athlete.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(athlete)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          data-testid={`button-delete-athlete-${athlete.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent data-testid="dialog-delete-athlete">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o atleta "{selectedAthlete?.name}"? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
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
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
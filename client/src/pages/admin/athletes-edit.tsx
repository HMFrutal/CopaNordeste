import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, Save, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ImageUploader } from "@/components/ImageUploader";

import { insertAthleteSchema, type InsertAthlete, type Athlete } from "@shared/schema";
import type { AdminTeam } from "@shared/schema";

export default function AthletesEditPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/athletes/:id");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState<string>("");

  const athleteId = params?.id || "";

  // Buscar dados do atleta
  const { data: athlete, isLoading: isLoadingAthlete } = useQuery<Athlete>({
    queryKey: ["/api/admin/athletes", athleteId],
    enabled: !!athleteId,
  });

  // Buscar times disponíveis
  const { data: teams = [] } = useQuery<AdminTeam[]>({
    queryKey: ["/api/admin/teams"],
  });

  const form = useForm<InsertAthlete>({
    resolver: zodResolver(insertAthleteSchema),
    defaultValues: {
      name: "",
      document: "",
      image: "",
      teamId: "none",
    },
  });

  // Atualizar formulário quando dados carregarem
  useEffect(() => {
    if (athlete) {
      const athleteData = athlete as any;
      form.reset({
        name: athleteData.name || "",
        document: athleteData.document || "",
        image: athleteData.image || "",
        teamId: athleteData.teamId || "none",
      });
      setImageUrl(athleteData.image || "");
    }
  }, [athlete, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: InsertAthlete) => {
      const response = await apiRequest(`/api/admin/athletes/${athleteId}`, "PUT", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Atleta atualizado!",
        description: "As informações do atleta foram atualizadas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/athletes"] });
      setLocation("/admin/athletes");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar o atleta.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertAthlete) => {
    const formattedData = {
      ...data,
      image: imageUrl || null,
      teamId: data.teamId === "none" ? undefined : data.teamId || undefined,
    };
    updateMutation.mutate(formattedData);
  };

  const handleImageChange = (url: string) => {
    setImageUrl(url);
    form.setValue("image", url);
  };

  if (isLoadingAthlete) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600"></div>
      </div>
    );
  }

  if (!athlete) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Atleta não encontrado
        </h1>
        <Button onClick={() => setLocation("/admin/athletes")}>
          Voltar à lista
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => setLocation("/admin/athletes")}
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Editar Atleta
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Atualize as informações do atleta
          </p>
        </div>
      </div>

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Dados do Atleta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Campos principais */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Nome */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    placeholder="Nome completo do atleta"
                    {...form.register("name")}
                    data-testid="input-name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
                  )}
                </div>

                {/* Documento */}
                <div className="space-y-2">
                  <Label htmlFor="document">Documento</Label>
                  <Input
                    id="document"
                    placeholder="CPF, RG ou outro documento"
                    {...form.register("document")}
                    data-testid="input-document"
                  />
                  {form.formState.errors.document && (
                    <p className="text-sm text-red-600">{form.formState.errors.document.message}</p>
                  )}
                </div>
              </div>

              {/* Seleção de Time */}
              <div className="space-y-2">
                <Label>Time</Label>
                <FormField
                  control={form.control}
                  name="teamId"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-team">
                            <SelectValue placeholder="Selecione um time (opcional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none" data-testid="select-team-none">
                            <span className="text-gray-500">Nenhum time</span>
                          </SelectItem>
                          {teams.map((team) => (
                            <SelectItem key={team.id} value={team.id} data-testid={`select-team-${team.id}`}>
                              <div className="flex items-center space-x-2">
                                {team.image && (
                                  <img src={team.image} alt={team.name} className="w-4 h-4 rounded" />
                                )}
                                <span>{team.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Upload de Imagem */}
              <div className="space-y-2">
                <Label>Foto do Atleta</Label>
                <ImageUploader
                  value={imageUrl}
                  onChange={handleImageChange}
                  placeholder="Selecionar foto do atleta"
                />
                {imageUrl && (
                  <div className="mt-3">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                      data-testid="img-preview"
                    />
                  </div>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/admin/athletes")}
                  data-testid="button-cancel"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="bg-navy-600 hover:bg-navy-700 text-white"
                  data-testid="button-save"
                >
                  {updateMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
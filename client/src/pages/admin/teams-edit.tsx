import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { ImageUploader } from "@/components/ImageUploader";
import { insertAdminTeamSchema, type InsertAdminTeam, type AdminTeam } from "@shared/schema";

type FormData = InsertAdminTeam;

export default function TeamsEditPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const params = useParams();
  const queryClient = useQueryClient();
  const teamId = params.id;
  const [imageUrl, setImageUrl] = useState<string>("");

  // Buscar dados do time
  const {
    data: team,
    isLoading,
  } = useQuery<AdminTeam>({
    queryKey: [`/api/admin/teams/${teamId}`],
    enabled: !!teamId,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(insertAdminTeamSchema),
    defaultValues: {
      name: "",
      image: "",
      responsible: "",
      phone: "",
    },
  });

  // Atualizar form quando dados carregarem
  React.useEffect(() => {
    if (team) {
      form.reset({
        name: team.name || "",
        image: team.image || "",
        responsible: team.responsible || "",
        phone: team.phone || "",
      });
      setImageUrl(team.image || "");
    }
  }, [team, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest(`/api/admin/teams/${teamId}`, "PUT", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/teams"] });
      queryClient.invalidateQueries({ queryKey: [`/api/admin/teams/${teamId}`] });
      toast({
        title: "Sucesso!",
        description: "Time atualizado com sucesso.",
      });
      setLocation("/admin/teams");
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao atualizar time",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    const formattedData = {
      ...data,
      image: imageUrl || null,
    };
    updateMutation.mutate(formattedData);
  };

  const handleImageChange = (url: string) => {
    setImageUrl(url);
    form.setValue("image", url);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
            <Skeleton className="h-32" />
            <div className="flex justify-end space-x-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => setLocation("/admin/teams")}
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Editar Time
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Edite as informações do time
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Time</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Nome */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Time *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nome do time"
                          {...field}
                          data-testid="input-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Responsável */}
                <FormField
                  control={form.control}
                  name="responsible"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsável</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nome do responsável"
                          {...field}
                          data-testid="input-responsible"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Telefone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Telefone de contato"
                          {...field}
                          data-testid="input-phone"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Upload de Imagem */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Logo do Time</label>
                <ImageUploader
                  value={imageUrl}
                  onChange={handleImageChange}
                  placeholder="Selecionar logo do time"
                />
                {imageUrl && (
                  <div className="mt-3">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="h-24 w-24 rounded-lg object-cover border-2 border-gray-200"
                      data-testid="img-preview"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/admin/teams")}
                  data-testid="button-cancel"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
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
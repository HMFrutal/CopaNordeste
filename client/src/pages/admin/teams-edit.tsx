import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Form, 
  FormControl, 
  FormDescription, 
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

interface TeamsEditPageProps {
  params: { id: string };
}

export default function TeamsEditPage({ params }: TeamsEditPageProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const teamId = params.id;

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
      rg: "",
      city: "",
      state: "",
      phone: "",
      email: "",
    },
  });

  // Atualizar form quando dados carregarem
  React.useEffect(() => {
    if (team) {
      form.reset({
        name: team.name || "",
        image: team.image || "",
        rg: team.rg || "",
        city: team.city || "",
        state: team.state || "",
        phone: team.phone || "",
        email: team.email || "",
      });
    }
  }, [team, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiRequest(`/api/admin/teams/${teamId}`, "PUT", data);
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
    onError: (error) => {
      console.error("Erro ao atualizar time:", error);
      toast({
        title: "Erro!",
        description: "Não foi possível atualizar o time. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    updateMutation.mutate(data);
  };

  const handleImageChange = (imageUrl: string) => {
    form.setValue("image", imageUrl);
  };

  const handleImageRemove = () => {
    form.setValue("image", "");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-16" />
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[...Array(7)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Time não encontrado
            </h1>
            <Button onClick={() => setLocation("/admin/teams")}>
              Voltar para Times
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/admin/teams")}
              className="text-gray-600 hover:text-gray-900"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Editar Time
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Edite as informações do time "{team.name}"
              </p>
            </div>
          </div>

          {/* Formulário */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Time</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Nome do Time */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Time *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Atlético Nordeste FC"
                            {...field}
                            data-testid="input-team-name"
                          />
                        </FormControl>
                        <FormDescription>
                          Nome oficial completo do time
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Logo do Time */}
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo do Time</FormLabel>
                        <FormControl>
                          <ImageUploader 
                            value={field.value || ""}
                            onChange={handleImageChange}
                            onRemove={handleImageRemove}
                            placeholder="Carregar nova logo"
                          />
                        </FormControl>
                        <FormDescription>
                          Faça upload da logo oficial do time (opcional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* RG/CNPJ */}
                  <FormField
                    control={form.control}
                    name="rg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RG/CNPJ</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: 12.345.678/0001-90"
                            {...field}
                            data-testid="input-team-rg"
                          />
                        </FormControl>
                        <FormDescription>
                          Documento de identificação do time (RG do responsável ou CNPJ)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Cidade e Estado em linha */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Recife"
                              {...field}
                              data-testid="input-team-city"
                            />
                          </FormControl>
                          <FormDescription>
                            Cidade sede do time
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: PE"
                              {...field}
                              data-testid="input-team-state"
                            />
                          </FormControl>
                          <FormDescription>
                            Sigla do estado
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Telefone e Email em linha */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: (81) 98765-4321"
                              {...field}
                              data-testid="input-team-phone"
                            />
                          </FormControl>
                          <FormDescription>
                            Telefone de contato do time
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Ex: contato@atletico.com.br"
                              {...field}
                              data-testid="input-team-email"
                            />
                          </FormControl>
                          <FormDescription>
                            Email oficial do time
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Botões de ação */}
                  <div className="flex justify-end space-x-4 pt-6">
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
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={updateMutation.isPending}
                      data-testid="button-submit"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
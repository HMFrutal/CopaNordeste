import React from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ImageUploader } from "@/components/ImageUploader";
import type { Championship } from "@shared/schema";
import { insertChampionshipSchema } from "@shared/schema";

type FormData = z.infer<typeof insertChampionshipSchema>;

export default function ChampionshipEditPage() {
  const { id } = useParams();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: championship, isLoading, error } = useQuery<Championship>({
    queryKey: ["/api/admin/championships", id],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(insertChampionshipSchema),
    defaultValues: {
      name: "",
      image: null,
      startDate: "",
      endDate: "",
    },
  });

  // Preencher formulário quando os dados chegarem
  React.useEffect(() => {
    if (championship) {
      form.reset({
        name: championship.name,
        image: championship.image,
        startDate: championship.startDate,
        endDate: championship.endDate,
      });
    }
  }, [championship, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiRequest(`/api/admin/championships/${id}`, "PUT", data);
    },
    onSuccess: (updatedChampionship) => {
      toast({
        title: "Campeonato atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
      
      // Invalidar cache
      queryClient.invalidateQueries({ queryKey: ["/api/admin/championships"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/championships", id] });
      
      // Redirecionar para detalhes
      setLocation(`/admin/championships/${id}`);
    },
    onError: (error) => {
      console.error("Erro ao atualizar:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Houve um problema ao salvar as alterações. Tente novamente.",
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
    form.setValue("image", null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-96 bg-gray-200 rounded mb-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !championship) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href={`/admin/championships/${id}`}>
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Editar Campeonato
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Altere as informações do campeonato "{championship.name}"
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Campeonato</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para atualizar o campeonato
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    {/* Nome do Campeonato */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Campeonato *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Copa Nordeste 2025"
                              data-testid="input-name"
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value)}
                              onFocus={(e) => e.target.select()}
                              autoComplete="off"
                              type="text"
                            />
                          </FormControl>
                          <FormDescription>
                            Digite o nome oficial do campeonato
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Datas */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Início *</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                data-testid="input-start-date"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Término *</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                data-testid="input-end-date"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Upload de Imagem */}
                  <div>
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Imagem do Campeonato</FormLabel>
                          <FormControl>
                            <ImageUploader 
                              value={field.value || ""}
                              onChange={handleImageChange}
                              onRemove={handleImageRemove}
                              placeholder="Carregar nova imagem"
                            />
                          </FormControl>
                          <FormDescription>
                            Faça upload da imagem oficial do campeonato (opcional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Pré-visualização */}
                {(form.watch("name") || form.watch("startDate") || form.watch("endDate")) && (
                  <div className="pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-4">Pré-visualização</h3>
                    <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-blue-900 dark:text-blue-100">
                              {form.watch("name") || "Nome do campeonato"}
                            </CardTitle>
                            <CardDescription className="text-blue-700 dark:text-blue-300">
                              {form.watch("startDate") && form.watch("endDate")
                                ? `${new Date(form.watch("startDate")!).toLocaleDateString('pt-BR')} - ${new Date(form.watch("endDate")!).toLocaleDateString('pt-BR')}`
                                : "Período a ser definido"
                              }
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </div>
                )}

                {/* Botões */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Link href={`/admin/championships/${id}`}>
                    <Button variant="outline" data-testid="button-cancel">
                      Cancelar
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    disabled={updateMutation.isPending}
                    data-testid="button-save"
                    className="bg-primary hover:bg-primary/90"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
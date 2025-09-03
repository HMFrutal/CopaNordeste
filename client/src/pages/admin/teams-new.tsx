// Removido import não usado
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { insertAdminTeamSchema, type InsertAdminTeam } from "@shared/schema";

type FormData = InsertAdminTeam;

export default function TeamsNewPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

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

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiRequest("/api/admin/teams", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/teams"] });
      toast({
        title: "Sucesso!",
        description: "Time criado com sucesso.",
      });
      setLocation("/admin/teams");
    },
    onError: (error) => {
      console.error("Erro ao criar time:", error);
      toast({
        title: "Erro!",
        description: "Não foi possível criar o time. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createMutation.mutate(data);
  };

  const handleImageChange = (imageUrl: string) => {
    form.setValue("image", imageUrl);
  };

  const handleImageRemove = () => {
    form.setValue("image", "");
  };

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
                Criar Novo Time
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Preencha as informações básicas do time
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
                            placeholder="Carregar logo do time"
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
                      disabled={createMutation.isPending}
                      data-testid="button-submit"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {createMutation.isPending ? "Salvando..." : "Salvar Time"}
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
import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Calendar, Image, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "@/components/ImageUploader";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertChampionshipSchema, type InsertChampionship } from "@shared/schema";

export default function NewChampionshipPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertChampionship>({
    resolver: zodResolver(insertChampionshipSchema),
    defaultValues: {
      name: "",
      image: null,
      startDate: "",
      endDate: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertChampionship) => {
      return await apiRequest("/api/admin/championships", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Campeonato criado com sucesso!",
        description: "O novo campeonato foi adicionado ao sistema.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/championships"] });
      setLocation("/admin/championships");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar campeonato",
        description: error?.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertChampionship) => {
    createMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/admin/championships")}
              data-testid="back-button"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Novo Campeonato
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Cadastre um novo campeonato no sistema
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Informações do Campeonato</span>
            </CardTitle>
            <CardDescription>
              Preencha as informações básicas do campeonato
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Nome */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <Type className="h-4 w-4" />
                        <span>Nome do Campeonato</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Copa Nordeste 2025"
                          data-testid="input-name"
                          value={field.value}
                          onChange={(e) => {
                            console.log("Input onChange:", e.target.value);
                            field.onChange(e.target.value);
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Imagem */}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <Image className="h-4 w-4" />
                        <span>Imagem do Campeonato</span>
                      </FormLabel>
                      <FormControl>
                        <ImageUploader
                          value={field.value || ""}
                          onChange={(url) => {
                            console.log("ImageUploader onChange chamado com:", url);
                            field.onChange(url);
                          }}
                          placeholder="Carregar imagem do campeonato"
                          data-testid="image-uploader"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Datas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Data de Início</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            data-testid="input-start-date"
                            {...field}
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
                        <FormLabel className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Data de Fim</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            data-testid="input-end-date"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setLocation("/admin/championships")}
                    data-testid="button-cancel"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={createMutation.isPending}
                    data-testid="button-save"
                  >
                    {createMutation.isPending ? "Salvando..." : "Salvar Campeonato"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Preview Card */}
        {(form.watch("name") || form.watch("image")) && (
          <Card className="max-w-2xl mt-6">
            <CardHeader>
              <CardTitle>Pré-visualização</CardTitle>
              <CardDescription>
                Como o campeonato aparecerá no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                {form.watch("image") && (
                  <img
                    src={form.watch("image") || ""}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {form.watch("name") || "Nome do Campeonato"}
                  </h3>
                  {form.watch("startDate") && form.watch("endDate") && (
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(form.watch("startDate")).toLocaleDateString("pt-BR")} - {" "}
                      {new Date(form.watch("endDate")).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
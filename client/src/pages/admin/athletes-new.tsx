import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { User, Save, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertAthleteSchema, type InsertAthlete } from "@shared/schema";
import { ImageUploader } from "@/components/ImageUploader";

export default function AthletesNewPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string>("");

  const form = useForm<InsertAthlete>({
    resolver: zodResolver(insertAthleteSchema),
    defaultValues: {
      name: "",
      document: "",
      image: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertAthlete) => {
      const response = await apiRequest("/api/admin/athletes", "POST", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/athletes"] });
      toast({
        title: "Sucesso!",
        description: "Atleta criado com sucesso.",
      });
      setLocation("/admin/athletes");
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao criar atleta",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertAthlete) => {
    const formattedData = {
      ...data,
      image: imageUrl || null,
    };
    createMutation.mutate(formattedData);
  };

  const handleImageChange = (url: string) => {
    setImageUrl(url);
    form.setValue("image", url);
  };

  return (
    <div className="space-y-6">
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
            Novo Atleta
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Cadastre um novo atleta no sistema
          </p>
        </div>
      </div>

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
              <div className="grid gap-6 md:grid-cols-2">
                {/* Nome */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nome completo do atleta"
                          {...field}
                          data-testid="input-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Documento */}
                <FormField
                  control={form.control}
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documento</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="CPF, RG ou outro documento"
                          {...field}
                          data-testid="input-document"
                        />
                      </FormControl>
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

              <div className="flex justify-end space-x-4">
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
                  disabled={createMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  data-testid="button-save"
                >
                  {createMutation.isPending ? (
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
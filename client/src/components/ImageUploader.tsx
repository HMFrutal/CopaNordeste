import { useState, useRef } from "react";
import Uppy from "@uppy/core";
import { DashboardModal } from "@uppy/react";
import AwsS3 from "@uppy/aws-s3";
import type { UploadResult } from "@uppy/core";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Image } from "lucide-react";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  placeholder?: string;
  maxFileSize?: number;
  className?: string;
}

export function ImageUploader({
  value,
  onChange,
  onRemove,
  placeholder = "Carregar imagem",
  maxFileSize = 10485760, // 10MB
  className = "",
}: ImageUploaderProps) {
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uppy] = useState(() => {
    const uppyInstance = new Uppy({
      restrictions: {
        maxNumberOfFiles: 1,
        maxFileSize,
        allowedFileTypes: ["image/*"],
      },
      autoProceed: false,
    })
      .use(AwsS3, {
        shouldUseMultipart: false,
        getUploadParameters: async (file) => {
          console.log("Iniciando upload para arquivo:", file.name);
          try {
            const response = await fetch("/api/objects/upload", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            });
            
            if (!response.ok) {
              throw new Error("Falha ao obter URL de upload");
            }
            
            const data = await response.json();
            console.log("URL de upload obtida:", data.uploadURL);
            
            return {
              method: "PUT" as const,
              url: data.uploadURL,
            };
          } catch (error) {
            console.error("Erro ao obter URL de upload:", error);
            throw error;
          }
        },
      })
      .on("upload", () => {
        console.log("Upload iniciado");
        setIsUploading(true);
      })
      .on("complete", (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
        console.log("Upload completo:", result);
        setIsUploading(false);
        setShowModal(false);
        
        if (result.successful && result.successful.length > 0) {
          const uploadedFile = result.successful[0];
          const imageUrl = uploadedFile.uploadURL;
          
          if (imageUrl) {
            // Converter URL do Google Storage para URL da aplicação
            const normalizedUrl = normalizeImageUrl(imageUrl);
            console.log("URL normalizada:", normalizedUrl);
            onChange(normalizedUrl);
          }
        }
      })
      .on("error", (error) => {
        console.error("Erro no upload:", error);
        setIsUploading(false);
      });
      
    return uppyInstance;
  });

  const normalizeImageUrl = (googleStorageUrl: string): string => {
    // Converter URL do Google Storage para URL relativa da aplicação
    if (googleStorageUrl.includes("storage.googleapis.com")) {
      // Extrair o caminho do objeto da URL do Google Storage
      const url = new URL(googleStorageUrl);
      const pathParts = url.pathname.split("/");
      
      if (pathParts.length >= 3) {
        // O caminho após o bucket é o que precisamos
        const objectPath = pathParts.slice(2).join("/");
        return `/objects/${objectPath}`;
      }
    }
    
    return googleStorageUrl;
  };

  // Função para upload direto via input file (fallback)
  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("Arquivo selecionado via input:", file.name);
    setIsUploading(true);

    try {
      // Obter URL de upload
      const response = await fetch("/api/objects/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) throw new Error("Falha ao obter URL de upload");
      
      const { uploadURL } = await response.json();
      console.log("URL de upload obtida:", uploadURL);

      // Fazer upload do arquivo
      const uploadResponse = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadResponse.ok) throw new Error("Falha no upload");

      // Normalizar URL e chamar onChange
      const normalizedUrl = normalizeImageUrl(uploadURL);
      console.log("URL normalizada:", normalizedUrl);
      onChange(normalizedUrl);
      
    } catch (error) {
      console.error("Erro no upload:", error);
    } finally {
      setIsUploading(false);
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    console.log("Clique no botão de upload...");
    
    // Tentar usar input file nativo primeiro (mais confiável)
    if (fileInputRef.current) {
      console.log("Usando input file nativo");
      fileInputRef.current.click();
    } else {
      console.log("Fallback para modal Uppy");
      setShowModal(true);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    } else {
      onChange("");
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Preview da imagem atual */}
      {value && (
        <Card>
          <CardContent className="p-4">
            <div className="relative group">
              <img
                src={value}
                alt="Imagem selecionada"
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder-image.svg";
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  data-testid="remove-image"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remover
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        data-testid="hidden-file-input"
      />

      {/* Botão de upload */}
      <div className="flex flex-col space-y-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleUploadClick}
          disabled={isUploading}
          className="h-12"
          data-testid="upload-image-button"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Enviando...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              {value ? "Alterar Imagem" : placeholder}
            </>
          )}
        </Button>
        
        <p className="text-xs text-gray-500 text-center">
          Formatos suportados: JPG, PNG, GIF. Tamanho máximo: {Math.round(maxFileSize / 1024 / 1024)}MB
        </p>
      </div>

      {/* Modal de upload */}
      {showModal && (
        <DashboardModal
          uppy={uppy}
          open={showModal}
          onRequestClose={() => {
            console.log("Fechando modal...");
            setShowModal(false);
          }}
          proudlyDisplayPoweredByUppy={false}
          closeModalOnClickOutside={true}
          locale={{
            strings: {
              dropPasteFiles: "Arraste arquivos aqui ou %{browseFiles}",
              browseFiles: "procure",
              uploadComplete: "Upload concluído",
              uploadFailed: "Falha no upload",
              uploadingXFiles: {
                0: "Enviando %{smart_count} arquivo",
                1: "Enviando %{smart_count} arquivos",
              },
              complete: "Concluído",
            },
          }}
        />
      )}
    </div>
  );
}
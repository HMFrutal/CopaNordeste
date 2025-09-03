import { useState } from "react";
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

  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles: 1,
        maxFileSize,
        allowedFileTypes: ["image/*"],
      },
      autoProceed: false,
    })
      .use(AwsS3, {
        shouldUseMultipart: false,
        getUploadParameters: async () => {
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
            return {
              method: "PUT",
              url: data.uploadURL,
            };
          } catch (error) {
            console.error("Erro ao obter URL de upload:", error);
            throw error;
          }
        },
      })
      .on("upload", () => {
        setIsUploading(true);
      })
      .on("complete", (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
        setIsUploading(false);
        setShowModal(false);
        
        if (result.successful && result.successful.length > 0) {
          const uploadedFile = result.successful[0];
          const imageUrl = uploadedFile.uploadURL;
          
          if (imageUrl) {
            // Converter URL do Google Storage para URL da aplicação
            const normalizedUrl = normalizeImageUrl(imageUrl);
            onChange(normalizedUrl);
          }
        }
      })
      .on("error", (error) => {
        setIsUploading(false);
        console.error("Erro no upload:", error);
      })
  );

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

  const handleUploadClick = () => {
    setShowModal(true);
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
      <DashboardModal
        uppy={uppy}
        open={showModal}
        onRequestClose={() => setShowModal(false)}
        proudlyDisplayPoweredByUppy={false}
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
    </div>
  );
}
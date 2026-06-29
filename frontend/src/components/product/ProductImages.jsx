import { useState } from "react";

function ProductImages({ images = [] }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageError, setImageError] = useState({});

  // Garantir que images seja um array válido e não vazio
  const validImages = Array.isArray(images) && images.length > 0 ? images : [];
  const hasImages = validImages.length > 0;

  const handleImageError = (index) => {
    setImageError((prev) => ({ ...prev, [index]: true }));
  };

  const currentImage = hasImages && !imageError[selectedImage] 
    ? validImages[selectedImage] 
    : "https://via.placeholder.com/500?text=Imagem+indisponivel";

  // Se não houver imagens, mostrar placeholder
  if (!hasImages) {
    return (
      <div className="bg-slate-100 aspect-square rounded-lg flex items-center justify-center">
        <p className="text-slate-400">Sem imagens disponíveis</p>
      </div>
    );
  }

  return (
    <div className="product-images">
      {/* Imagem principal */}
      <div className="mb-4 bg-slate-100 rounded-lg overflow-hidden">
        <img
          src={currentImage}
          alt={`Imagem principal do produto`}
          className="w-full aspect-square object-cover transition-all duration-300 hover:scale-105"
          onError={() => handleImageError(selectedImage)}
        />
      </div>

      {/* Miniaturas (thumbnails) - máximo 4 imagens no total */}
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {validImages.slice(0, 4).map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedImage(index)}
              className={`flex shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                selectedImage === index
                  ? "border-blue-600 ring-2 ring-blue-200"
                  : "border-slate-200 hover:border-slate-400"
              }`}
            >
              <img
                src={image}
                alt={`Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
                onError={() => handleImageError(index)}
              />
            </button>
          ))}
        </div>
      )}

      {/* Indicador de quantas imagens (opcional) */}
      {validImages.length > 1 && (
        <p className="text-xs text-slate-500 mt-3 text-center">
          Imagem {selectedImage + 1} de {Math.min(validImages.length, 4)}
        </p>
      )}
    </div>
  );
}

export default ProductImages;
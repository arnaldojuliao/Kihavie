import { useState, useCallback, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import { FaSearchPlus, FaSearchMinus, FaCheck, FaTimes } from "react-icons/fa";

/**
 * Cria uma imagem recortada a partir de uma source e coordenadas de corte.
 * Devolve uma DataURL pronta para upload.
 */
const createCroppedImage = async (imageSrc, pixelCrop) => {
  const image = new Image();
  image.crossOrigin = "anonymous";

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Tamanho de saída (ajusta para boa qualidade)
      const outputSize = 400;
      canvas.width = outputSize;
      canvas.height = outputSize;

      // Desenha fundo branco (caso a imagem tenha transparência)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, outputSize, outputSize);

      // Desenha a imagem recortada
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        outputSize,
        outputSize
      );

      // Converte para JPEG com qualidade 0.9
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      resolve(dataUrl);
    };
    image.onerror = () => reject(new Error("Falha ao carregar imagem"));
    image.src = imageSrc;
  });
};

export default function ImageCropperModal({
  imageSrc,
  onSave,
  onCancel,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const previewTimeoutRef = useRef(null);

  // Cleanup do timeout ao desmontar
  useEffect(() => {
    return () => {
      if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current);
    };
  }, []);

  // Gera preview com debounce quando o utilizador solta o clique
  const handleCropComplete = useCallback(
    (_, croppedPixels) => {
      setCroppedAreaPixels(croppedPixels);
      if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = setTimeout(async () => {
        try {
          const cropped = await createCroppedImage(imageSrc, croppedPixels);
          setPreviewUrl(cropped);
        } catch {
          // ignora erro de preview
        }
      }, 300);
    },
    [imageSrc]
  );

  const handleSave = async () => {
    if (!croppedAreaPixels || saving) return;
    setSaving(true);
    try {
      const croppedDataUrl = await createCroppedImage(imageSrc, croppedAreaPixels);
      await onSave(croppedDataUrl);
    } catch (err) {
      console.error("Erro ao recortar imagem:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current);
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Ajustar foto de perfil</h2>
          <button
            onClick={handleCancel}
            className="text-slate-400 hover:text-slate-600 transition p-1"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Corpo - Cropper */}
        <div className="relative w-full h-80 bg-slate-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        {/* Controlo de Zoom */}
        <div className="flex items-center justify-center gap-4 px-6 py-4 border-b border-slate-200">
          <FaSearchMinus className="text-slate-500 shrink-0" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full max-w-60 accent-blue-600 cursor-pointer"
          />
          <FaSearchPlus className="text-slate-500 shrink-0" />
        </div>

        {/* Preview + Ações */}
        <div className="flex items-center gap-6 px-6 py-4">
          {/* Preview mini */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-slate-500 font-medium">Pré-visualização</span>
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-100">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">
                  ...
                </div>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex-1 flex gap-3 justify-end">
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !croppedAreaPixels}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
            >
              {saving ? (
                "A guardar..."
              ) : (
                <>
                  <FaCheck /> Guardar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { useProducts } from "../../context/ProductContext";
import { useAuth } from "../../context/AuthContext";

function AddProduct() {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const { user, isStoreOwner } = useAuth();
  const storeId = user?.storeId;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  // Imagem principal
  const [mainImagePreview, setMainImagePreview] = useState(null);

  // 3 imagens extra
  const [extraImages, setExtraImages] = useState([null, null, null]);
  const [extraImagePreviews, setExtraImagePreviews] = useState([
    null,
    null,
    null,
  ]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setMainImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleExtraImageChange = (index, e) => {
    const file = e.target.files[0];
    const nextFiles = [...extraImages];
    const nextPreviews = [...extraImagePreviews];

    if (!file) {
      nextFiles[index] = null;
      nextPreviews[index] = null;
      setExtraImages(nextFiles);
      setExtraImagePreviews(nextPreviews);
      return;
    }

    nextFiles[index] = file;
    setExtraImages(nextFiles);

    const reader = new FileReader();
    reader.onload = () => {
      nextPreviews[index] = reader.result;
      setExtraImagePreviews(nextPreviews);
    };
    reader.readAsDataURL(file);
  };

  const generateSku = () => {
    const prefix = formData.name
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 3);
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `${prefix || "PRD"}-${randomDigits}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!mainImagePreview) {
      setError("Adicione a imagem principal do produto.");
      return;
    }

    // Verifica se o utilizador tem uma loja (storeId)
    if (!isStoreOwner || !storeId) {
      setError(
        "Você precisa ser proprietário de uma loja para adicionar produtos.",
      );
      return;
    }

    setLoading(true);

    try {
      // Recolhe todas as imagens: principal + extras não nulas
      const allImages = [
        mainImagePreview,
        ...extraImagePreviews.filter(Boolean),
      ];

      const newProduct = {
        ...formData,
        sku: generateSku(),
        image: mainImagePreview, // mantido por compatibilidade (mas será convertido)
        extraImages: extraImagePreviews.filter(Boolean),
        images: allImages, // campo principal para todas as imagens
        storeId: storeId, // associa à loja do utilizador
      };

      await addProduct(newProduct);
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard/products");
      }, 1500);
    } catch (err) {
      setError(err.message || "Erro ao adicionar produto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Adicionar novo produto</h1>
        <p className="text-slate-600">
          Preencha os dados abaixo para cadastrar um novo produto
        </p>
      </div>

      <div className="max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-lg p-8 space-y-6"
        >
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nome do produto
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descrição
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Preço (MT)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Estoque
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Categoria
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Selecione...</option>
                <option value="Eletrônicos">Eletrônicos</option>
                <option value="Acessórios">Acessórios</option>
                <option value="Mochilas">Mochilas</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
          </div>

          {/* Secção de Imagens */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Imagens do produto
              </label>
              <div className="grid gap-4">
                {/* Imagem principal */}
                <label className="relative block h-56 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 text-center overflow-hidden cursor-pointer hover:border-blue-500 hover:bg-white transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    required
                    className="sr-only"
                  />

                  {mainImagePreview ? (
                    <img
                      src={mainImagePreview}
                      alt="Imagem principal"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-500">
                      <FiPlus className="text-4xl" />
                      <div>
                        <p className="font-semibold">Imagem principal</p>
                        <p className="text-sm text-slate-500">
                          Clique para adicionar
                        </p>
                      </div>
                    </div>
                  )}

                  <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                    Principal
                  </span>
                </label>

                {/* Imagens extra (3) */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {extraImages.map((_, index) => (
                    <label
                      key={index}
                      className="relative flex-1 h-36 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 overflow-hidden cursor-pointer hover:border-blue-500 hover:bg-white transition"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleExtraImageChange(index, e)}
                        className="sr-only"
                      />

                      {extraImagePreviews[index] ? (
                        <img
                          src={extraImagePreviews[index]}
                          alt={`Imagem extra ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-500">
                          <FiPlus className="text-3xl" />
                          <span className="text-sm font-semibold">
                            Adicionar
                          </span>
                        </div>
                      )}

                      <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                        Extra {index + 1}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                A primeira imagem é a principal. As restantes serão exibidas
                como galeria na página do produto.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              Produto adicionado com sucesso! Você será redirecionado...
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {loading ? "Salvando..." : "Salvar produto"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/products")}
              className="flex-1 bg-slate-200 text-slate-900 py-3 rounded-lg font-semibold hover:bg-slate-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;

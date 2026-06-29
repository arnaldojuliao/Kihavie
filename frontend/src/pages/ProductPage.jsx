import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ProductImages from "../components/product/ProductImages";
import ProductDetail from "../components/product/ProductDetail";
import ProductGrid from "../components/product/ProductGrid";
import { useProducts } from "../context/ProductContext";
import { FaArrowLeft } from "react-icons/fa6";

function ProductPage() {
  const { id } = useParams();
  const { activeProducts } = useProducts();
  const productId = Number(id);

  const product = activeProducts.find((item) => item.id === productId);

  // Função para obter o array de imagens do produto (prioriza images, depois image isolada)
  const getProductImages = (prod) => {
    if (prod?.images && Array.isArray(prod.images) && prod.images.length > 0) {
      return prod.images;
    }
    if (prod?.image) return [prod.image];
    return ["https://via.placeholder.com/250?text=Sem+imagem"];
  };

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const relatedProducts = useMemo(
    () => activeProducts.filter((item) => item.id !== productId).slice(0, 4),
    [activeProducts, productId],
  );

  if (!product) {
    return (
      <div className="product-page">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <Link to="/" className="text-blue-600 hover:underline">
            Voltar à página inicial
          </Link>
        </div>
      </div>
    );
  }

  // Prepara o produto para o componente ProductDetail (ele espera product com price, name, etc.)
  // O ProductImages receberá o array de imagens diretamente
  const productImages = getProductImages(product);

  return (
    <div className="product-page">
      <Link
        to="/"
        className="text-red-600 font-bold hover:underline mb-4 flex items-center gap-2 text-xl"
      >
        <FaArrowLeft /> Voltar
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <ProductImages images={productImages} />
        </div>
        <div>
          <ProductDetail product={product} />
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-slate-200">
          <h2 className="text-2xl font-semibold mb-6">Produtos relacionados</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}

export default ProductPage;
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { FiShoppingCart } from "react-icons/fi";
import { FaBan, FaCheckCircle } from "react-icons/fa";
import { adminApi } from "../../services/api";
import { useState } from "react";
import { useProducts } from "../../context/ProductContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();
  const { refreshProducts } = useProducts();
  const [blocking, setBlocking] = useState(false);

  // Obtém a imagem principal (primeira do array images, ou fallback para image antiga)
  const getMainImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.image) return product.image;
    return "https://via.placeholder.com/250?text=Sem+imagem";
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.blocked) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: getMainImage(),
      quantity: 1,
      storeId: product.storeId,
    });
  };

  const handleToggleBlock = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (blocking) return;
    setBlocking(true);
    try {
      await adminApi.adminToggleBlockProduct(product.id);
      refreshProducts();
    } catch (err) {
      console.error("Erro ao bloquear produto:", err);
    } finally {
      setBlocking(false);
    }
  };

  return (
    <Link
      to={product.blocked ? undefined : `/product/${product.id}`}
      className={`product-card bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow relative ${
        product.blocked ? "opacity-60 border-2 border-red-400" : "active:border border-slate-500"
      }`}
    >
      {product.blocked && (
        <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <FaBan /> Bloqueado
        </div>
      )}
      <div className="aspect-square bg-slate-100 overflow-hidden">
        <img
          src={getMainImage()}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold truncate">{product.name}</h3>
        <p className="text-xs text-slate-600 line-clamp-2 mt-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-base">
            MT {product.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1.5">
            {isAdmin && (
              <button
                type="button"
                onClick={handleToggleBlock}
                disabled={blocking}
                title={product.blocked ? "Desbloquear produto" : "Bloquear produto (inadequado)"}
                className={`py-3 px-3 absolute top-2 right-2 rounded-full text-sm transition ${
                  product.blocked
                    ? "bg-green-100 text-green-700 hover:bg-green-400"
                    : "bg-red-50 text-red-600 hover:bg-red-400"
                }`}
              >
                {product.blocked ? <FaCheckCircle size={16} /> : <FaBan size={16} />}
              </button>
            )}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`bg-blue-600 text-white px-4 py-2 rounded text-xs hover:bg-blue-800 ${
                product.blocked ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FiShoppingCart />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
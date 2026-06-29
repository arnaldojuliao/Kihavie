// components/product/ProductDetail.jsx
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { FaStar, FaWhatsapp } from "react-icons/fa6";
import { getStoreById } from "../../services/storeService";

function ProductDetail({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [store, setStore] = useState(null);

useEffect(() => {
  const fetchStore = async () => {
    if (product.storeId) {
      const storeData = await getStoreById(product.storeId);
      setStore(storeData);
    }
  };
  fetchStore();
}, [product.storeId]);

  const imageSource = product.image || product.images?.[0] || "https://via.placeholder.com/250?text=Sem+imagem";

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageSource,
      quantity,
      storeId: product.storeId,
    });
    setFeedback("Produto adicionado ao carrinho!");
    setTimeout(() => setFeedback(""), 3000);
  };

  const handleBuyNow = () => {
    // Adiciona o produto ao carrinho com a quantidade selecionada
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageSource,
      quantity,
      storeId: product.storeId,
    });
    // Redireciona para o checkout
    navigate("/checkout");
  };

  const increaseQuantity = () => setQuantity((q) => q + 1);
  const decreaseQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  const supplierPhone = store?.phone || "258870000000";
  const whatsappLink = `https://wa.me/${supplierPhone.replace(/\D/g, "")}?text=Olá! Estou interessado no produto ${product.name} (${product.id})`;

  return (
    <div className="product-detail">
      <div className="flex justify-between items-start relative">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        {store && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 absolute top-0 right-0 p-1.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
            title="Conversar com o fornecedor"
          >
            <FaWhatsapp size={50} />
          </a>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className="flex text-yellow-400 text-2xl">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}><FaStar /></span>
          ))}
        </div>
        <span className="text-sm text-slate-600">(234 avaliações)</span>
      </div>

      <p className="text-slate-600 text-lg  mb-4">{product.description}</p>

      <div className="bg-slate-50 rounded-lg mb-2">
        <p className="text-black font-semibold ">Preço</p>
        <p className="text-4xl font-bold text-slate-900">MT {product.price.toFixed(2)}</p>
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold text-slate-700 mb-2">Quantidade</p>
        <div className="flex items-center gap-3">
          <button onClick={decreaseQuantity} className="px-3 py-2 border rounded">-</button>
          <span className="px-4 py-2 border rounded">{quantity}</span>
          <button onClick={increaseQuantity} className="px-3 py-2 border rounded">+</button>
        </div>
      </div>

      {/* Botões lado a lado */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Adicionar ao Carrinho
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
        >
          Comprar Agora
        </button>
      </div>

      {feedback && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {feedback}
        </div>
      )}

      {product.storeId && (
        <Link to={`/store/${product.storeId}`} className="inline-block text-blue-600 hover:underline">
          Ver mais produtos desta loja
        </Link>
      )}

      <div className="mt-4 border-t border-slate-200">
        <h3 className="text-2xl font-semibold mb-2">Informações</h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li><strong>SKU:</strong> {product.sku || "N/A"}</li>
          <li><strong>Categoria:</strong> {product.category || "Geral"}</li>
          <li><strong>Em estoque:</strong> {product.stock > 0 ? "Sim" : "Não"}</li>
          <li><strong>Envio:</strong> Cálculo na finalização</li>
        </ul>
      </div>
    </div>
  );
}

export default ProductDetail;
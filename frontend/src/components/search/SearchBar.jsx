import { useEffect, useState } from "react";
import { useProducts } from "../../context/ProductContext";
import { FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function SearchBar({ fechar, initialSearch = "" }) {
  const { activeProducts = [] } = useProducts();
  const [procurar, setProcurar] = useState(initialSearch);
  const [sugestoes, setSugestoes] = useState([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (procurar.trim() === "") {
        setSugestoes([]);
      } else {
        if (Array.isArray(activeProducts)) {
          const filtrados = activeProducts.filter((produto) =>
            produto.name?.toLowerCase().includes(procurar.toLowerCase()) ||
            produto.description?.toLowerCase().includes(procurar.toLowerCase())
          );
          setSugestoes(filtrados);
        } else {
          setSugestoes([]);
        }
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [procurar, activeProducts]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const destacarTexto = (texto, busca) => {
    if (!busca.trim() || !texto) return texto;
    const escapedBusca = busca.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedBusca})`, 'gi');
    const partes = texto.split(regex);
    return partes.map((parte, idx) => {
      if (idx % 2 === 1) {
        return (
          <mark key={idx} className="bg-yellow-300 px-0.5 rounded">
            {parte}
          </mark>
        );
      }
      return parte;
    });
  };

  return (
    <div className="min-h-screen w-full bg-white fixed left-0 top-0 z-999">
      <div className="flex justify-center gap-4 items-center py-4 mb-5 px-4 bg-white">
        <button onClick={fechar} className="text-black">
          <FiX size={35} />
        </button>
        <input
          type="text"
          autoFocus
          value={procurar}
          onChange={(e) => setProcurar(e.target.value)}
          placeholder="O que estás a procurar..."
          className="py-1 px-5 w-full rounded-xl border max-w-md"
        />
      </div>

      <div className="px-4 pb-8">
        {procurar.trim() !== "" && sugestoes.length === 0 ? (
          <p className="font-semibold text-center text-gray-500">
            Nenhum produto encontrado para "<strong>{procurar}</strong>"
          </p>
        ) : (
          <div className="space-y-3">
            {sugestoes.map((produto) => (
              <Link
                to={`/product/${produto.id}`}
                key={produto.id}
                className="block"
              >
                <div className="px-4 py-4 shadow-md rounded-lg bg-gray-50 hover:bg-gray-200 transition">
                  <p className="font-semibold text-lg">
                    {destacarTexto(produto.name, procurar)}
                  </p>
                  <p className="text-sm text-gray-600">{produto.description}</p>
                  <p className="text-sm font-bold text-red-500 mt-1">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "MZN",   // ← corrigido
                    }).format(produto.price || 0)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
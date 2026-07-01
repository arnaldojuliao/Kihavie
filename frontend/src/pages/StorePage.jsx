import { useParams, Link, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import ProductGrid from "../components/product/ProductGrid";
import { getStoreById } from "../services/storeService";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import {
  FaStar,
  FaCalendarAlt,
  FaTruck,
  FaShieldAlt,
  FaHeadset,
} from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { BiPlus } from "react-icons/bi";

const CACHE_KEY_STORE = "kihavie_store_";
const CACHE_TTL = 10 * 60 * 1000; // 10 min

function StorePage() {
  const { storeId } = useParams();
  const location = useLocation();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { products } = useProducts();

  const [store, setStore] = useState(() => {
    // 1. Prioridade máxima: dados vindos da navegação (ex: ProductDetail)
    if (location.state?.store) return location.state.store;
    // 2. Fallback: cache localStorage
    try {
      const raw = localStorage.getItem(CACHE_KEY_STORE + storeId);
      if (raw) {
        const { data, timestamp } = JSON.parse(raw);
        if (Date.now() - timestamp < CACHE_TTL) return data;
        localStorage.removeItem(CACHE_KEY_STORE + storeId);
      }
    } catch { /* ignora */ }
    return null; // precisa carregar da API
  });

  // Produtos filtrados do cache global (instantâneo)
  const storeProducts = useMemo(
    () => products.filter((p) => String(p.storeId) === storeId),
    [products, storeId]
  );

  const isOwner = isAuthenticated && String(user?.storeId) === storeId;

  useEffect(() => {
    // Se já temos a loja correta para este storeId, não precisa buscar
    if (store && String(store.id) === storeId) return;

    // Tentar dados vindos da navegação (route state)
    const stateStore = location.state?.store;
    if (stateStore && String(stateStore.id) === storeId) {
      setStore(stateStore);
      // Guarda no cache para visitas futuras
      try {
        if (!localStorage.getItem(CACHE_KEY_STORE + storeId)) {
          localStorage.setItem(
            CACHE_KEY_STORE + storeId,
            JSON.stringify({ data: stateStore, timestamp: Date.now() })
          );
        }
      } catch { /* ignora */ }
      return;
    }

    // Tentar cache localStorage
    try {
      const raw = localStorage.getItem(CACHE_KEY_STORE + storeId);
      if (raw) {
        const { data, timestamp } = JSON.parse(raw);
        if (Date.now() - timestamp < CACHE_TTL) {
          setStore(data);
          return;
        }
        localStorage.removeItem(CACHE_KEY_STORE + storeId);
      }
    } catch { /* ignora */ }

    // Buscar da API
    setStore(null);
    getStoreById(storeId)
      .then((storeData) => {
        if (!storeData) {
          setStore(undefined);
          return;
        }
        setStore(storeData);
        try {
          localStorage.setItem(
            CACHE_KEY_STORE + storeId,
            JSON.stringify({ data: storeData, timestamp: Date.now() })
          );
        } catch { /* localStorage cheio */ }
      })
      .catch(() => setStore(undefined));
  }, [storeId, location.state?.store]);

  const getSettingsLink = () => {
    if (isOwner) {
      // Dono da loja (seja admin ou não) → dashboard normal
      return "/dashboard";
    }
    if (isAdmin) {
      // Administrador a ver loja de outro → painel admin
      return `/admin/store/dashboard`;
    }
    return null; // sem permissão (não mostra ícone)
  };

  if (store === null) {
    return null; // ainda carregando — não renderiza nada
  }

  if (store === undefined) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Loja não encontrada</h1>
        <Link to="/search" className="text-blue-600 hover:underline">
          Voltar para busca
        </Link>
      </div>
    );
  }

  return (
    <div className="store-page max-w-6xl mx-auto relative z-0">
      {/* Cabeçalho da loja */}
      <div className="relative rounded-xl overflow-hidden mb-8 bg-linear-to-r from-blue-700 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative p-8 md:p-12">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                {store.name}
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl mb-6">
                {store.description || "Bem-vindo à nossa loja!"}
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  <span>{store.rating || "4.8"}</span>
                  <span className="text-blue-200">
                    ({store.reviews || 0} avaliações)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt />
                  <span>
                    Desde{" "}
                    {store.createdAt
                      ? new Date(store.createdAt).getFullYear()
                      : "2024"}
                  </span>
                </div>
              </div>
            </div>

            {getSettingsLink() && (
              <Link
                to={getSettingsLink()}
                className="bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition"
                title={isOwner ? "Gerir a minha loja" : "Administrar loja"}
              >
                <FiSettings size={24} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Seção de produtos */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Produtos ({storeProducts.length})
          </h2>
          {isOwner && (
            <Link
              to="/dashboard/add-product"
              className="bg-green-600 hover:bg-green-700 flex gap-2 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition"
            >
              <BiPlus size={20} /> Adicionar produto
            </Link>
          )}
        </div>

        {storeProducts.length > 0 ? (
          <ProductGrid products={storeProducts} />
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-lg">
            <p className="text-slate-500">
              Esta loja ainda não possui produtos.
            </p>
            {isOwner ? (
              <Link
                to="/dashboard/add-product"
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                Clique aqui para adicionar seu primeiro produto
              </Link>
            ) : (
              <Link
                to="/search"
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                Explorar outras lojas
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Info adicional */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-8 border-t border-slate-200">
        <div className="bg-slate-50 p-5 rounded-xl flex items-start gap-3">
          <FaTruck className="text-blue-600 text-xl mt-1" />
          <div>
            <h3 className="font-semibold text-slate-900">Entrega Rápida</h3>
            <p className="text-sm text-slate-600">
              Enviamos seu pedido em até 24h
            </p>
          </div>
        </div>
        <div className="bg-slate-50 p-5 rounded-xl flex items-start gap-3">
          <FaShieldAlt className="text-blue-600 text-xl mt-1" />
          <div>
            <h3 className="font-semibold text-slate-900">Produtos Originais</h3>
            <p className="text-sm text-slate-600">Garantia de autenticidade</p>
          </div>
        </div>
        <div className="bg-slate-50 p-5 rounded-xl flex items-start gap-3">
          <FaHeadset className="text-blue-600 text-xl mt-1" />
          <div>
            <h3 className="font-semibold text-slate-900">Suporte ao Cliente</h3>
            <p className="text-sm text-slate-600">Estamos aqui para ajudar</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StorePage;

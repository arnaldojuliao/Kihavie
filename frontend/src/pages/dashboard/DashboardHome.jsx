import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getProductsByStoreId } from "../../services/productService";
import {
  getOrdersByStoreId,
  getStoreRevenue,
} from "../../services/orderService";
import { adminApi } from "../../services/api";
import { getStoreStats, getAllStores } from "../../services/storeService";
import { FaEdit } from "react-icons/fa";
import { BsBox, BsClipboard2Check, BsBuilding, BsPeople } from "react-icons/bs";
import { MdStorefront } from "react-icons/md";

function DashboardHome() {
  const navigate = useNavigate();
  const { user, upgradeToStoreOwner, isStoreOwner, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
    totalStores: 0,
    totalUsers: 0,
  });

  // Função para carregar estatísticas globais para admin
  const fetchGlobalStats = async () => {
    try {
      const [stores, usersCountData] = await Promise.all([
        getAllStores(),
        adminApi.getUsersCount().catch(() => ({ count: 0 })),
      ]);
      let totalProds = 0, totalOrders = 0, totalRev = 0;
      for (const store of stores) {
        try {
          const storeStats = await getStoreStats(store.id);
          totalProds += Number(storeStats.totalProducts) || 0;
          totalOrders += Number(storeStats.totalOrders) || 0;
          totalRev += Number(storeStats.totalRevenue) || 0;
        } catch { /* skip */ }
      }
      setStats({
        totalProducts: totalProds,
        totalOrders: totalOrders,
        pendingOrders: 0,
        revenue: totalRev,
        totalStores: stores.length,
        totalUsers: usersCountData.count || 0,
      });
    } catch (err) {
      console.error("Erro ao carregar estatísticas globais:", err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchGlobalStats();
      return;
    }

    const fetchStats = async () => {
      if (isStoreOwner && user?.storeId) {
        const storeId = user.storeId;
        try {
          const products = await getProductsByStoreId(storeId);
          const orders = await getOrdersByStoreId(storeId);
          const pending = orders.filter((o) => o.status === "Processando");
          const revenue = await getStoreRevenue();
          setStats({
            totalProducts: products.filter((p) => p.stock > 0).length,
            totalOrders: orders.length,
            pendingOrders: pending.length,
            revenue: revenue,
          });
        } catch (err) {
          console.error("Erro ao carregar estatísticas:", err);
        }
      }
    };

    fetchStats();
  }, [isAdmin, isStoreOwner, user, navigate]);

  // === ADMIN DASHBOARD ===
  if (isAdmin) {
    return (
      <div className="admin-dashboard">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Painel de Administração</h1>
          <p className="text-slate-600">Bem-vindo, {user?.name}! Visão geral da plataforma.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white border rounded-lg p-3 sm:p-6 shadow-sm">
            <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">
              <BsPeople className="text-indigo-600" />
            </div>
            <p className="text-slate-600 text-xs sm:text-sm">Utilizadores</p>
            <p className="text-lg sm:text-2xl font-bold">{stats.totalUsers || 0}</p>
          </div>
          <div className="bg-white border rounded-lg p-3 sm:p-6 shadow-sm">
            <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">
              <BsBuilding className="text-blue-600" />
            </div>
            <p className="text-slate-600 text-xs sm:text-sm">Lojas</p>
            <p className="text-lg sm:text-2xl font-bold">{stats.totalStores || 0}</p>
          </div>
          <div className="bg-white border rounded-lg p-3 sm:p-6 shadow-sm">
            <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">
              <BsBox className="text-green-600" />
            </div>
            <p className="text-slate-600 text-xs sm:text-sm">Produtos</p>
            <p className="text-lg sm:text-2xl font-bold">{stats.totalProducts}</p>
          </div>
          <div className="bg-white border rounded-lg p-3 sm:p-6 shadow-sm">
            <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">
              <BsClipboard2Check className="text-purple-600" />
            </div>
            <p className="text-slate-600 text-xs sm:text-sm">Pedidos</p>
            <p className="text-lg sm:text-2xl font-bold">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white border rounded-lg p-3 sm:p-6 shadow-sm col-span-1">
            <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">💰</div>
            <p className="text-slate-600 text-xs sm:text-sm">Receita Total</p>
            <p className="text-lg sm:text-2xl font-bold">MT {Number(stats.revenue).toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link to="/admin/stores" className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition hover:border-blue-300">
            <div className="flex items-center gap-4">
              <div className="text-3xl">
                <MdStorefront className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Gerir Lojas</h3>
                <p className="text-slate-500 text-sm">Visualizar, ativar/suspender lojas</p>
              </div>
            </div>
          </Link>
          <Link to="/admin/users" className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition hover:border-green-300">
            <div className="flex items-center gap-4">
              <div className="text-3xl">
                <BsPeople className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Utilizadores</h3>
                <p className="text-slate-500 text-sm">Gerir utilizadores e permissões</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  if (!isStoreOwner || !user?.storeId) {
    return (
      <div className="dashboard-home">
        <h1 className="text-3xl font-bold mb-2">Bem-vindo, {user?.name}!</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Ativar pacote vendedor
            </h2>
            <p className="mb-4">
              Com o pacote vendedor você pode criar sua loja e cadastrar
              produtos.
            </p>
            <button
              onClick={upgradeToStoreOwner}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Ativar por MT 500,00
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      <h1 className="text-xl sm:text-2xl font-bold mb-2">Bem Vindo</h1>
      <span className="text-3xl sm:text-5xl font-black text-end">{user?.name}!</span>
      <p className="text-slate-600 mb-6 mt-2 text-base sm:text-xl">
        Aqui estão os dados reais da sua loja.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-8">
        <div className="bg-white flex flex-col items-center shadow-2xl p-4 sm:p-6 rounded-lg">
          <div className="text-3xl sm:text-5xl mb-2">📦</div>
          <p className="text-slate-600 text-xs sm:text-sm">Produtos ativos</p>
          <p className="text-lg sm:text-2xl font-bold">{stats.totalProducts}</p>
        </div>
        <div className="bg-white flex flex-col items-center shadow-2xl p-4 sm:p-6 rounded-lg">
          <div className="text-3xl sm:text-5xl mb-2">📋</div>
          <p className="text-slate-600 text-xs sm:text-sm">Pedidos totais</p>
          <p className="text-lg sm:text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white flex flex-col items-center shadow-2xl p-4 sm:p-6 rounded-lg">
          <div className="text-3xl sm:text-5xl mb-2">⏳</div>
          <p className="text-slate-600 text-xs sm:text-sm">Pedidos pendentes</p>
          <p className="text-lg sm:text-2xl font-bold">{stats.pendingOrders}</p>
        </div>
        <div className="bg-white flex flex-col items-center shadow-2xl p-4 sm:p-6 rounded-lg">
          <div className="text-3xl sm:text-5xl mb-2">💰</div>
          <p className="text-slate-600 text-xs sm:text-sm">Receita total</p>
          <p className="text-lg sm:text-2xl font-bold">MT {stats.revenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white shadow-2xl p-4 sm:p-6 rounded-lg">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Ações Rápidas</h2>
          <div className="space-y-2 text-base sm:text-xl">
            <Link
              to="/dashboard/settings"
              className="flex items-center gap-2 bg-blue-50 py-2 px-1 rounded"
            >
              <FaEdit size={20} /> Editar a Loja
            </Link>
            <Link
              to="/dashboard/products"
              className="flex items-center gap-2 bg-slate-50 py-2 px-1 rounded"
            >
              <BsBox size={20} /> Gerenciar produtos
            </Link>
            <Link
              to="/dashboard/orders"
              className="flex items-center gap-2 bg-slate-50 py-2 px-1 rounded"
            >
              <BsClipboard2Check size={20} /> Ver pedidos
            </Link>
          </div>
        </div>
        <div className="bg-white shadow-2xl p-4 sm:p-6 rounded-lg">
          <h2 className="text-base sm:text-lg font-semibold mb-4">Últimas vendas</h2>
          <div className="space-y-2">
            <p className="text-slate-500 text-sm sm:text-base">Nenhuma venda recente.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;

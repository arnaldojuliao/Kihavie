import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStores, getStoreStats } from "../../services/storeService";

function AdminStoresPage() {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeStatsMap, setStoreStatsMap] = useState({});
  const [stats, setStats] = useState({
    totalStores: 0,
    activeStores: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const allStores = await getAllStores();
      let active = 0,
        totalProds = 0,
        totalRev = 0;
      const statsMap = {};
      for (const store of allStores) {
        if (store.status === "active") active++;
        try {
          const storeStats = await getStoreStats(store.id);
          statsMap[store.id] = storeStats;
          totalProds += storeStats.totalProducts || 0;
          totalRev += storeStats.totalRevenue || 0;
        } catch {
          statsMap[store.id] = { totalProducts: 0, totalRevenue: 0 };
        }
      }
      setStoreStatsMap(statsMap);
      setStats({
        totalStores: allStores.length,
        activeStores: active,
        totalProducts: totalProds,
        totalRevenue: totalRev,
      });
      setStores(allStores);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading)
    return <div className="p-8 text-center text-slate-500">Carregando...</div>;

  return (
    <div className="admin-stores-page px-4 sm:px-6 py-4 sm:py-6">
      {/* Cabeçalho */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Administração de Lojas
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Gerencie todas as lojas da plataforma.
        </p>
      </div>

      {/* Cards de estatísticas - responsivo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white border rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="text-xl sm:text-2xl font-bold">
            {stats.totalStores}
          </div>
          <div className="text-slate-600 text-xs sm:text-sm">
            Total de Lojas
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="text-xl sm:text-2xl font-bold">
            {stats.activeStores}
          </div>
          <div className="text-slate-600 text-xs sm:text-sm">Lojas Ativas</div>
        </div>
        <div className="bg-white border rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="text-xl sm:text-2xl font-bold">
            {stats.totalProducts}
          </div>
          <div className="text-slate-600 text-xs sm:text-sm">
            Total de Produtos
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="text-xl sm:text-2xl font-bold">
            MT {stats.totalRevenue.toFixed(2)}
          </div>
          <div className="text-slate-600 text-xs sm:text-sm">Receita Total</div>
        </div>
      </div>

      {/* Tabela responsiva com rolagem horizontal */}
      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-150 md:w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-slate-700">
                  Loja
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-slate-700">
                  Proprietário
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-slate-700">
                  Produtos
                </th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-slate-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => {
                const storeStats = storeStatsMap[store.id] || { totalProducts: 0, totalRevenue: 0 };
                return (
                  <tr
                    key={store.id}
                    onClick={() => navigate(`/admin/store/${store.id}`)}
                    className="border-b hover:bg-slate-50 cursor-pointer transition"
                  >
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="font-medium text-sm sm:text-base truncate max-w-37.5 sm:max-w-none">
                        {store.name}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        ID: {store.id}
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4">
                      <div className="text-sm sm:text-base truncate max-w-30 sm:max-w-50">
                        {store.ownerName}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {store.ownerEmail}
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 text-sm">
                      {storeStats.totalProducts}
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          store.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {store.status === "active" ? "Ativa" : "Suspensa"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mensagem quando não houver lojas */}
        {stores.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-sm">
            Nenhuma loja encontrada.
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminStoresPage;

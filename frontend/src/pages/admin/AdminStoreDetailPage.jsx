import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getStoreById } from "../../services/storeService";
import { getProductsByStoreId } from "../../services/productService";
import { getOrdersByStoreId, getStoreRevenue } from "../../services/orderService";
import { updateStoreStatus } from "../../services/storeService";
import { adminApi } from "../../services/api";
import { useProducts } from "../../context/ProductContext";
import { FaEdit, FaTrash, FaBan, FaCheckCircle, FaTimes, FaSave } from "react-icons/fa";

function AdminStoreDetailPage() {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", price: "", stock: "" });

  const { refreshProducts } = useProducts();

  const fetchData = async () => {
    const storeData = await getStoreById(storeId);
    if (!storeData) { setLoading(false); return; }
    setStore(storeData);
    const storeProducts = await getProductsByStoreId(storeId);
    setProducts(storeProducts);
    const storeOrders = await getOrdersByStoreId(storeId);
    setOrders(storeOrders);
    const totalRevenue = await getStoreRevenue(storeId);
    setRevenue(totalRevenue);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [storeId]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Toggle store status
  const handleToggleStatus = async () => {
    if (!window.confirm(`Tem certeza que deseja ${store.status === "active" ? "suspender" : "ativar"} esta loja?`)) return;
    try {
      await updateStoreStatus(storeId);
      showMessage("success", `Loja ${store.status === "active" ? "suspensa" : "ativada"} com sucesso!`);
      // Atualizar dados
      const storeData = await getStoreById(storeId);
      setStore(storeData);
    } catch (err) {
      showMessage("error", "Erro ao alterar status da loja: " + err.message);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Tem certeza que deseja eliminar o produto "${productName}"? Esta ação é irreversível.`)) return;
    try {
      await adminApi.adminDeleteProduct(productId);
      refreshProducts();
      setProducts(prev => prev.filter(p => p.id !== productId));
      showMessage("success", `Produto "${productName}" eliminado com sucesso.`);
    } catch (err) {
      showMessage("error", "Erro ao eliminar produto: " + err.message);
    }
  };

  // Edit product
  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      stock: product.stock?.toString() || "0",
    });
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setEditForm({ name: "", description: "", price: "", stock: "" });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const updated = await adminApi.adminUpdateProduct(editingProduct.id, {
        name: editForm.name,
        description: editForm.description,
        price: parseFloat(editForm.price),
        stock: parseInt(editForm.stock),
      });
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...updated } : p));
      refreshProducts();
      showMessage("success", `Produto "${editForm.name}" atualizado com sucesso.`);
      closeEditModal();
    } catch (err) {
      showMessage("error", "Erro ao atualizar produto: " + err.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Carregando...</div>;
  if (!store) return <div className="p-8 text-center">Loja não encontrada</div>;

  return (
    <div className="admin-store-detail-page px-4 sm:px-6 py-4 sm:py-6">
      {/* Notificações */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.type === "success"
            ? "bg-green-100 text-green-700 border border-green-400"
            : "bg-red-100 text-red-700 border border-red-400"
        }`}>
          {message.text}
        </div>
      )}

      {/* Cabeçalho */}
      <div className="mb-6">
        <Link to="/admin/stores" className="text-blue-600 hover:underline text-sm">← Voltar para lista</Link>
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{store.name}</h1>
            <p className="text-slate-600 text-sm">Gestão administrativa da loja</p>
          </div>
          <button
            onClick={handleToggleStatus}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              store.status === "active"
                ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
            }`}
          >
            {store.status === "active" ? <><FaBan /> Suspender Loja</> : <><FaCheckCircle /> Ativar Loja</>}
          </button>
        </div>
      </div>

      {/* Informações da loja + estatísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Informações da Loja</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="font-medium text-slate-600">Proprietário</label>
              <p>{store.ownerName}</p>
            </div>
            <div>
              <label className="font-medium text-slate-600">Email</label>
              <p>{store.ownerEmail}</p>
            </div>
            <div>
              <label className="font-medium text-slate-600">Status</label>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                store.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {store.status === "active" ? "Ativa" : "Suspensa"}
              </span>
            </div>
            <div>
              <label className="font-medium text-slate-600">Criada em</label>
              <p>{store.createdAt ? new Date(store.createdAt).toLocaleDateString() : "—"}</p>
            </div>
          </div>
          <div className="mt-4">
            <label className="font-medium text-slate-600">Descrição</label>
            <p className="text-slate-700">{store.description || "Sem descrição"}</p>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Estatísticas</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">Produtos:</span>
              <span className="font-bold text-lg">{products.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">Pedidos:</span>
              <span className="font-bold text-lg">{orders.length}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600">Receita Total:</span>
              <span className="font-bold text-lg text-green-700">MT {Number(revenue).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Produtos da Loja */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-slate-50 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Produtos da Loja</h2>
          <span className="text-sm text-slate-500">{products.length} produto{products.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-150 md:w-full">
            <thead>
              <tr className="border-b bg-slate-50/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Produto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Preço</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Estoque</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b hover:bg-slate-50 transition">
                  <td className="px-4 py-3">
                    <div className="font-medium text-sm">{product.name}</div>
                    {product.sku && <div className="text-xs text-slate-400">SKU: {product.sku}</div>}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    MT {Number(product.price).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm">{product.stock ?? 0}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      product.stock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {product.stock > 0 ? "Disponível" : "Sem stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => openEditModal(product)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded text-xs font-medium hover:bg-blue-100 transition"
                      >
                        <FaEdit /> Editar
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded text-xs font-medium hover:bg-red-100 transition"
                      >
                        <FaTrash /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-sm">
            Nenhum produto cadastrado nesta loja.
          </div>
        )}
      </div>

      {/* Modal de Edição de Produto */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Editar Produto</h3>
              <button onClick={closeEditModal} className="text-slate-400 hover:text-slate-600">
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Preço (MT)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={editForm.price}
                    onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={editForm.stock}
                    onChange={e => setEditForm({ ...editForm, stock: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  <FaSave /> Salvar Alterações
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 bg-slate-200 text-slate-700 py-2.5 rounded-lg hover:bg-slate-300 transition font-medium"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminStoreDetailPage;

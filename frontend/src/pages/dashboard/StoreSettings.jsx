import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getStoreById, updateStore } from "../../services/storeService";
import { Link } from "react-router-dom";

function StoreSettings() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [storeId, setStoreId] = useState(null);

  useEffect(() => {
  const fetchStore = async () => {
    if (user?.storeId) {
      const store = await getStoreById(user.storeId);
      if (store) {
        setStoreId(store.id);
        setFormData({
          name: store.name || "",
          description: store.description || "",
          email: store.email || user.email || "",
          phone: store.phone || "",
          address: store.address || "",
          city: store.city || "",
          state: store.state || "",
          zipCode: store.zipCode || "",
        });
      }
    }
  };
  fetchStore();
}, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!storeId) {
      setMessage({
        type: "error",
        text: "Nenhuma loja encontrada para este usuário.",
      });
      setLoading(false);
      return;
    }

    try {
      await updateStore(storeId, {
        name: formData.name,
        description: formData.description,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      });
      setMessage({
        type: "success",
        text: "Configurações salvas com sucesso!",
      });
      setTimeout(() => setMessage(null), 2000);
    } catch {
      setMessage({ type: "error", text: "Erro ao salvar configurações." });
    } finally {
      setLoading(false);
    }
  };

  if (!storeId) {
    return (
      <div className="store-settings">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">
            Você ainda não possui uma loja. Ative o pacote vendedor primeiro.
          </p>
          <Link
            to="/dashboard"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
          >
            Ir para Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="store-settings">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configurações da loja</h1>
        <p className="text-slate-600">
          Gerencie as informações e preferências da sua loja
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        <div className="bg-white border shadow-xl border-slate-200 rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-6">Informações da loja</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nome da loja
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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Descrição
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border shadow-xl border-slate-200 rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-6">Endereço</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Endereço
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
             
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  NUIT
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`px-4 py-3 rounded ${message.type === "success" ? "bg-green-100 text-green-700 border border-green-400" : "bg-red-100 text-red-700 border border-red-400"}`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {loading ? "Salvando..." : "Salvar configurações"}
        </button>
      </form>
    </div>
  );
}

export default StoreSettings;

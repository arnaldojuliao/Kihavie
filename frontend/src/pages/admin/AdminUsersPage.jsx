import { useEffect, useState } from "react";
import { adminApi } from "../../services/api";
import { FaUserShield, FaStore, FaUser } from "react-icons/fa";
import { BsShieldCheck } from "react-icons/bs";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const fetchUsers = async () => {
    try {
      const data = await adminApi.getAllUsers();
      setUsers(data);
    } catch (err) {
      setMessage({ type: "error", text: "Erro ao carregar utilizadores: " + err.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, []);

  const handleChangeRole = async (userId, newRole) => {
    try {
      await adminApi.changeUserRole(userId, newRole);
      setMessage({ type: "success", text: `Role alterado para ${newRole} com sucesso!` });
      fetchUsers();
    } catch (err) {
      setMessage({ type: "error", text: "Erro ao alterar role: " + err.message });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            <BsShieldCheck /> Admin
          </span>
        );
      case "storeOwner":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <FaStore /> Loja
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            <FaUser /> Cliente
          </span>
        );
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin": return <FaUserShield className="text-purple-600" />;
      case "storeOwner": return <FaStore className="text-blue-600" />;
      default: return <FaUser className="text-slate-500" />;
    }
  };

  if (loading) return (
    <div className="p-8 text-center text-slate-500">Carregando utilizadores...</div>
  );

  return (
    <div className="admin-users-page px-4 sm:px-6 py-4 sm:py-6">
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.type === "success"
            ? "bg-green-100 text-green-700 border border-green-400"
            : "bg-red-100 text-red-700 border border-red-400"
        }`}>
          {message.text}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Gestão de Utilizadores</h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Total de {users.length} utilizador{users.length !== 1 ? "es" : ""} registados.
        </p>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-150 md:w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-slate-700">Utilizador</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-slate-700">Email</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-slate-700">Role</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-slate-700">Loja ID</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-slate-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-slate-50 transition">
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-lg">
                        {getRoleIcon(user.role)}
                      </div>
                      <div>
                        <div className="font-medium text-sm sm:text-base">{user.name}</div>
                        <div className="text-xs text-slate-400">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-sm text-slate-600">{user.email}</td>
                  <td className="px-3 sm:px-4 py-3">{getRoleBadge(user.role)}</td>
                  <td className="px-3 sm:px-4 py-3 text-sm text-slate-500">
                    {user.storeId || "—"}
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex gap-2 flex-wrap">
                      {user.role !== "admin" && (
                        <button
                          onClick={() => {
                            if (confirmAction === user.id) {
                              handleChangeRole(user.id, "admin");
                              setConfirmAction(null);
                            } else {
                              setConfirmAction(user.id);
                              setTimeout(() => setConfirmAction(null), 3000);
                            }
                          }}
                          className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                            confirmAction === user.id
                              ? "bg-purple-600 text-white"
                              : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                          }`}
                        >
                          {confirmAction === user.id ? "Confirmar?" : "Admin"}
                        </button>
                      )}
                      {user.role !== "storeOwner" && user.role !== "admin" && (
                        <button
                          onClick={() => {
                            if (confirmAction === `store-${user.id}`) {
                              handleChangeRole(user.id, "storeOwner");
                              setConfirmAction(null);
                            } else {
                              setConfirmAction(`store-${user.id}`);
                              setTimeout(() => setConfirmAction(null), 3000);
                            }
                          }}
                          className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                            confirmAction === `store-${user.id}`
                              ? "bg-blue-600 text-white"
                              : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                          }`}
                        >
                          {confirmAction === `store-${user.id}` ? "Confirmar?" : "Proprietário"}
                        </button>
                      )}
                      {user.role !== "client" && (
                        <button
                          onClick={() => {
                            if (confirmAction === `client-${user.id}`) {
                              handleChangeRole(user.id, "client");
                              setConfirmAction(null);
                            } else {
                              setConfirmAction(`client-${user.id}`);
                              setTimeout(() => setConfirmAction(null), 3000);
                            }
                          }}
                          className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                            confirmAction === `client-${user.id}`
                              ? "bg-slate-600 text-white"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {confirmAction === `client-${user.id}` ? "Confirmar?" : "Cliente"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-sm">
            Nenhum utilizador encontrado.
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsersPage;

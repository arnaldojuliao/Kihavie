import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "../components/ui/Avatar";
import ImageCropperModal from "../components/ui/ImageCropperModal";
import {
  FaCamera,
  FaUserCircle,
  FaStore,
  FaShieldAlt,
  FaFileAlt,
  FaKey,
  FaTrashAlt,
  FaSignOutAlt,
  FaAngleDown,
} from "react-icons/fa";
import { BiArrowFromRight } from "react-icons/bi";

function UserSettingsPage() {
  const {
    user,
    logout,
    isStoreOwner,
    isAdmin,
    updateUser,
    updateProfileImage,
    profileImage,
  } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editData, setEditData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [cropImageSrc, setCropImageSrc] = useState(null);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setEditData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
  }, [user]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCropImageSrc(event.target.result);
    };
    reader.readAsDataURL(file);
    // Limpa o input para permitir selecionar o mesmo ficheiro novamente
    e.target.value = "";
  };

  const handleCropSave = async (croppedDataUrl) => {
    await updateProfileImage(croppedDataUrl);
    setCropImageSrc(null);
    setMessage({ type: "success", text: "Foto de perfil atualizada!" });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleCropCancel = () => {
    setCropImageSrc(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // === Modal de edição de perfil ===
  const openEditModal = () => {
    setEditData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setShowEditModal(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!updateUser) {
      setMessage({
        type: "error",
        text: "Função updateUser não disponível no contexto.",
      });
      return;
    }
    try {
      await updateUser({
        name: editData.name,
        email: editData.email,
        phone: editData.phone,
      });
      setShowEditModal(false);
      setMessage({ type: "success", text: "Informações atualizadas!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch {
      setMessage({ type: "error", text: "Erro ao atualizar informações." });
    }
  };

  // === Logout ===
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // === Alterar senha (mock) ===
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      setMessage({ type: "error", text: "As novas senhas não coincidem." });
      return;
    }
    setMessage({
      type: "info",
      text: "Funcionalidade em desenvolvimento. Nenhuma alteração foi feita.",
    });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    setPasswordData({ current: "", new: "", confirm: "" });
    setShowPasswordModal(false);
  };

  // === Eliminar conta (mock) ===
  const handleDeleteAccount = async () => {
    setMessage({
      type: "info",
      text: "Funcionalidade em desenvolvimento. Conta não foi excluída.",
    });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    setShowDeleteModal(false);
  };

  // Determinar tipo de conta
  let accountType = "Cliente simples";
  if (isAdmin) accountType = "Administrador";
  else if (isStoreOwner) accountType = "Proprietário de loja";

  return (
    <div className="user-settings-page max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Minha Conta</h1>
      <p className="text-slate-600 mb-8">
        Gerencie suas informações pessoais e configurações da conta.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Seção 1: Perfil */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center gap-6 mb-6">
              {/* Área da imagem - clicar para trocar foto */}
              <div className="relative w-24 h-24  group">
                {profileImage ? (
                  <Avatar src={profileImage} alt="Perfil" size={96} />
                ) : (
                  <FaUserCircle
                    className="w-24 h-24 text-slate-400 cursor-pointer"
                    onClick={triggerFileInput}
                  />
                )}
                <div
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:h-24 transition cursor-pointer"
                  onClick={triggerFileInput}
                >
                  <FaCamera className="text-white text-xl" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="flex-1" onClick={openEditModal}>
                <h2 className="text-xl font-semibold text-slate-900">
                  {user?.name}
                </h2>
                <p className="text-slate-600">{user?.email}</p>
                {user?.phone && (
                  <p className="text-slate-500 text-sm">{user.phone}</p>
                )}
                <p className="text-sm text-slate-500 mt-1">
                  Membro desde{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("pt-BR")
                    : new Date().toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <h3 className="font-medium text-slate-900 mb-2">
                Informações pessoais
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">Nome completo:</span>{" "}
                  <span className="font-medium">{user?.name}</span>
                </div>
                <div>
                  <span className="text-slate-500">Email:</span>{" "}
                  <span className="font-medium">{user?.email}</span>
                </div>
                <div>
                  <span className="text-slate-500">Telefone:</span>{" "}
                  <span className="font-medium">
                    {user?.phone ? user.phone : "Não informado"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">ID do usuário:</span>{" "}
                  <span className="font-medium">{user?.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seção 2: Tipo de conta e loja */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FaStore className="text-blue-600" /> Tipo de Conta e Loja
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Tipo de conta:</span>
                <span className="font-semibold text-slate-900">
                  {accountType}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Possui loja:</span>
                <span className="font-semibold text-slate-900">
                  {isStoreOwner
                    ? user?.storeId
                      ? "Sim (Ativa)"
                      : "Sim, mas sem loja vinculada"
                    : "Não"}
                </span>
              </div>
              {isStoreOwner && user?.storeId && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600">ID da loja:</span>
                  <Link
                    to={`/store/${user.storeId}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {user.storeId} → Ver loja
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Seção 3: Termos e Condições */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FaFileAlt className="text-blue-600" /> Documentos Legais
            </h2>
            <div className="space-y-3">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-slate-700 hover:text-blue-600">
                  Termos e Condições
                  <span className="transition group-open:rotate-180">
                    <FaAngleDown />
                  </span>
                </summary>
                <div className="mt-3 text-sm text-slate-600 border-t pt-3">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. O
                    uso desta plataforma implica na aceitação integral destes
                    termos.
                  </p>
                </div>
              </details>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-slate-700 hover:text-blue-600">
                  Política de Privacidade
                  <span className="transition group-open:rotate-180">
                    <FaAngleDown />
                  </span>
                </summary>
                <div className="mt-3 text-sm text-slate-600 border-t pt-3">
                  <p>
                    Seus dados são protegidos. Não compartilhamos informações
                    sem consentimento.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Coluna lateral - Ações */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Ações da conta
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center justify-between px-4 py-2 bg-slate-50 rounded-lg hover:bg-slate-100"
              >
                <span className="flex items-center gap-2">
                  <FaKey /> Alterar senha
                </span>
                <BiArrowFromRight />
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center justify-between px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
              >
                <span className="flex items-center gap-2">
                  <FaTrashAlt /> Eliminar conta
                </span>
                <BiArrowFromRight />
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300"
              >
                <span className="flex items-center gap-2">
                  <FaSignOutAlt /> Sair da conta
                </span>
                <BiArrowFromRight />
              </button>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <FaShieldAlt className="inline mr-2" />
            Sua conta está protegida.
          </div>
        </div>
      </div>

      {/* Modal de Edição de Perfil */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Editar perfil</h2>
            <form onSubmit={handleSaveProfile}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full border rounded-lg px-3 py-2"
                    value={editData.email}
                    onChange={(e) =>
                      setEditData({ ...editData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    className="w-full border rounded-lg px-3 py-2"
                    value={editData.phone}
                    onChange={(e) =>
                      setEditData({ ...editData, phone: e.target.value })
                    }
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-slate-200 py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Alterar Senha */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Alterar senha</h2>
            <form onSubmit={handleChangePassword}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Senha atual
                  </label>
                  <input
                    type="password"
                    className="w-full border rounded-lg px-3 py-2"
                    value={passwordData.current}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        current: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nova senha
                  </label>
                  <input
                    type="password"
                    className="w-full border rounded-lg px-3 py-2"
                    value={passwordData.new}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, new: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Confirmar nova senha
                  </label>
                  <input
                    type="password"
                    className="w-full border rounded-lg px-3 py-2"
                    value={passwordData.confirm}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirm: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
                >
                  Alterar
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-slate-200 py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Eliminar Conta */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Eliminar conta
            </h2>
            <p className="text-slate-600 mb-4">
              Tem certeza? Esta ação é irreversível.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                Sim, eliminar
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-slate-200 py-2 rounded-lg hover:bg-slate-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Corte de Imagem */}
      {cropImageSrc && (
        <ImageCropperModal
          imageSrc={cropImageSrc}
          onSave={handleCropSave}
          onCancel={handleCropCancel}
        />
      )}

      {/* Mensagem flutuante */}
      {message.text && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow text-white ${
            message.type === "success"
              ? "bg-green-600"
              : message.type === "error"
                ? "bg-red-600"
                : "bg-blue-600"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}

export default UserSettingsPage;

import { useState } from "react";
import { BsShop } from "react-icons/bs";
import { FiShoppingCart, FiUserPlus } from "react-icons/fi";
import { SlHome } from "react-icons/sl";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { FaUserCircle } from "react-icons/fa";

function Footer() {
  const { totalItems } = useCart();
  const {
    isAuthenticated,
    isStoreOwner,
    user,
    upgradeToStoreOwner,
    profileImage,
    refreshUser
  } = useAuth();
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const {refreshProducts} = useProducts();

  const handleShopClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!isStoreOwner) {
      setShowUpgradeModal(true);
      return;
    }

    if (isStoreOwner) {
      if (user?.storeId) {
        navigate(`/store/${user.storeId}`);
      } else {
        // Tenta recuperar loja ou redireciona para criar
        navigate("/dashboard/settings");
        setShowUpgradeModal(true);
      }
    }
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const updatedUser = await upgradeToStoreOwner();
      await refreshUser();
      await refreshProducts();
      await refreshProducts(); 
      setShowUpgradeModal(false);
      
      if (updatedUser?.storeId) {
        navigate(`/store/${updatedUser.storeId}`);
      } else {
        navigate("/dashboard");
      }
    } catch {
      alert("Erro ao ativar loja. Tente novamente.");
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <footer className="footer bg-white text-sm text-slate-600 w-full flex justify-center px-4 pt-2 pb-2 fixed bottom-0 border-t border-slate-200">
      <ul className="flex gap-6 sm:gap-12 items-center">
        <li>
          <Link to="/" className="block hover:text-blue-600">
            <SlHome size={38} />
          </Link>
        </li>
        <li>
          <button
            type="button"
            onClick={handleShopClick}
            className="block hover:text-blue-600 focus:outline-none"
          >
            <BsShop size={38} />
          </button>
        </li>
        <li>
          <Link to="/cart" className="relative block hover:text-blue-600">
            <div className="relative">
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-5 text-center">
                  {totalItems}
                </span>
              )}
              <FiShoppingCart size={38} />
            </div>
          </Link>
        </li>
        <li>
          {isAuthenticated ? (
            <Link
              to={isStoreOwner ? "/settings" : "/settings"}
              className="hover:text-blue-600"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Perfil"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle size={38} />
              )}
            </Link>
          ) : (
            <Link to="/login" className="hover:text-blue-600">
              <FiUserPlus size={38} />
            </Link>
          )}
        </li>
      </ul>

      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Criar sua loja</h2>
            <p className="text-slate-600 mb-4">
              Para vender os seus produtos na Kihavie, você precisa
              ativar o pacote vendedor.
            </p>
            <p className="text-lg font-semibold text-blue-600 mb-6">
              Valor: <span className="text-2xl">MT 500,00</span> (pagamento
              único)
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={upgrading}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-slate-400"
              >
                {upgrading ? "Processando..." : "Pagar agora"}
              </button>
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 bg-slate-200 text-slate-800 py-2 rounded-lg font-semibold hover:bg-slate-300"
              >
                Cancelar
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center">
              Ao pagar, você terá acesso ao painel de vendedor e poderá
              cadastrar produtos.
            </p>
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;

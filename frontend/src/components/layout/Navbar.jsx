import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { IoSearch } from "react-icons/io5";
import { BsInfoCircle } from "react-icons/bs";
import { MdCall, MdDashboard } from "react-icons/md";
import { FiLogOut, FiSettings, FiUsers } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa";

function Navbar() {
  const { logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="navbar sticky top-0 z-50 bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      <Link to="/" className="text-3xl font-black">
        Kihavie
      </Link>

      <nav className="flex gap-3 items-center">
        <Link to="/search" className="hover:text-blue-600" title="Pesquisar">
          <IoSearch size={22} />
        </Link>
        <Link to="/about" className="hover:text-blue-600" title="Sobre nós">
          <BsInfoCircle size={22} />
        </Link>
        <Link to="/contact" className="hover:text-blue-600" title="Contacto">
          <MdCall size={22} />
        </Link>

        {isAuthenticated ? (
          <div className="flex gap-3 items-center">
            {isAdmin && (
              <>
                <Link to="/admin/stores" className="hover:text-blue-600" title="Admin - Lojas">
                  <MdDashboard size={22} />
                </Link>
                <Link to="/admin/users" className="hover:text-blue-600" title="Utilizadores">
                  <FiUsers size={22} />
                </Link>
              </>
            )}
          </div>
        ) : (
          <Link to="/login" className="hover:text-blue-600" title="Entrar">
            <FaUserPlus size={22} />
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { IoSearch } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { BsInfoCircle, BsThreeDotsVertical, BsShieldCheck } from "react-icons/bs";
import { MdCall, MdDashboard } from "react-icons/md";
import { FiLogOut, FiSettings, FiUsers } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa";

function Navbar() {
  const { logout, isAuthenticated, isAdmin } = useAuth();
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="navbar sticky top-0 z-50 bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      <Link to="/" className="text-3xl font-black">
        Kihavie
      </Link>

      <nav className="flex gap-4 items-center">
        <Link to="/search" className="hover:text-blue-600">
          <IoSearch size={25} />
        </Link>
        <div ref={menuRef} className="relative">
          <button
            className="border border-white/30 px-0.5 py-0.5 rounded-md"
            onClick={() => setMenu(!menu)}
          >
            <BsThreeDotsVertical size={28} />
          </button>

          {menu && (
            <div className="absolute right-0 z-50 bg-white flex flex-col px-4 pb-4 gap-3 mt-3 text-xl font-semibold">
              <Link
                to="/about"
                className="flex gap-2 pt-2 items-center border-b border-white/40 hover:text-blue-600"
                onClick={() => setMenu(false)}
              >
                <BsInfoCircle /> Sobre nós
              </Link>
              <Link
                to="/contact"
                className="flex gap-2 items-center border-b border-white/40 hover:text-blue-600"
                onClick={() => setMenu(false)}
              >
                <MdCall /> Contacto
              </Link>
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <>
                      <Link
                        to="/admin/stores"
                        className="flex gap-2 items-center border-b border-white/40 hover:text-blue-600 text-blue-700"
                        onClick={() => setMenu(false)}
                      >
                        <BsShieldCheck /> Admin - Lojas
                      </Link>
                      <Link
                        to="/admin/users"
                        className="flex gap-2 items-center border-b border-white/40 hover:text-blue-600"
                        onClick={() => setMenu(false)}
                      >
                        <FiUsers /> Utilizadores
                      </Link>
                      <Link
                        to="/dashboard"
                        className="flex gap-2 items-center border-b border-white/40 hover:text-blue-600"
                        onClick={() => setMenu(false)}
                      >
                        <MdDashboard /> Painel Admin
                      </Link>
                    </>
                  )}
                  {!isAdmin && (
                    <Link
                      to="/dashboard"
                      className="flex gap-2 items-center border-b border-white/40 hover:text-blue-600"
                      onClick={() => setMenu(false)}
                    >
                      <MdDashboard /> Painel
                    </Link>
                  )}
                  <Link
                    to="/settings"
                    className="flex gap-2 items-center border-b border-white/40 hover:text-blue-600"
                    onClick={() => setMenu(false)}
                  >
                    <FiSettings /> Definições
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex gap-2 items-center border-b border-white/40 text-red-800 hover:text-red-500"
                  >
                    <FiLogOut /> Sair
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex gap-2 items-center border-b border-white/40 hover:text-blue-600"
                  onClick={() => setMenu(false)}
                >
                  <FaUserPlus /> Entrar
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
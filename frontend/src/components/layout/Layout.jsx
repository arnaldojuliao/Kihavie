import Navbar from "./Navbar";
import Footer from "./Footer";
import Spinner from "../ui/Spinner";
import { useAuth } from "../../context/AuthContext";

function Layout({ children }) {
  const { isLoading: authLoading, isLoggingIn, isLoggingOut } = useAuth();

  const isLoading = authLoading || isLoggingIn || isLoggingOut;

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="layout-wrapper min-h-screen bg-slate-50 text-slate-900 pb-12">
      <Navbar />
      <div className="layout-content flex gap-6 px-4 pb-6 pt-3 max-w-7xl mx-auto">
        <main className="flex-1 bg-white/20 min-h-[calc(100vh-200px)]">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
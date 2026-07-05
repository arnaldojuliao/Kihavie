import { useRef, useEffect } from "react";
import ProductGrid from "../components/product/ProductGrid";
import { useProducts } from "../context/ProductContext";
import { Link } from "react-router-dom";

function Home() {
  const { activeProducts } = useProducts();
  const topProducts = activeProducts.slice(0, 4);
  const cardRefs = useRef([]);

  useEffect(() => {
    const currentRefs = cardRefs.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [topProducts]);

  return (
    <div className="home-page">
      {/* Categorias */}
      <article className="mb-4 flex flex-col sm:flex-row gap-2 sm:justify-between font-bold">
        <Link className="bg-blue-600 rounded-md p-2 active:scale-95 text-white text-center text-sm sm:text-base">
          🇨🇳 Mande da China
        </Link>
        <Link className="bg-red-700 rounded-md p-2 active:scale-95 text-white text-center text-sm sm:text-base">
          🔧 Manutenção de Dispositivos
        </Link>
      </article>

      {/* Os Mais Vendidos */}
      <section className="mb-8">
        <div className="flex items-center justify-center flex-col mb-3">
          <p className="text-black text-2xl font-semibold">⚡ Os Mais Vendidos</p>
          <p className="text-slate-600 text-center text-sm">
            Os produtos mais populares da nossa plataforma
          </p>
        </div>

        <div className="overflow-x-auto flex gap-3 pb-3 scroll-smooth snap-x snap-mandatory" style={{ scrollbarWidth: "thin" }}>
          {topProducts.length > 0 ? (
            topProducts.map((product, index) => {
              const image =
                product.images?.[0] ||
                product.image ||
                "https://via.placeholder.com/250?text=Sem+imagem";
              return (
                <Link
                  key={product.id}
                  ref={(el) => { cardRefs.current[index] = el; }}
                  to={`/product/${product.id}`}
                  className="shrink-0 w-[calc(50%-0.375rem)] sm:w-[calc(25%-0.75rem)] snap-start group opacity-0 translate-y-6 transition-all duration-500 ease-out"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-slate-100 overflow-hidden">
                      <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2 sm:p-3">
                      <h3 className="font-semibold text-xs sm:text-sm text-center truncate">
                        {product.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="text-slate-500 text-center w-full py-8">
              Nenhum produto disponível no momento.
            </p>
          )}
        </div>
      </section>

      {/* Todos os produtos */}
      <section>
        <p className="text-black font-semibold text-xl mb-3">
          Encontre os melhores produtos
        </p>
        <ProductGrid products={activeProducts} />
      </section>
    </div>
  );
}

export default Home;

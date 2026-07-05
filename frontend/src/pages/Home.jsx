import { useRef, useEffect, useState } from "react";
import ProductGrid from "../components/product/ProductGrid";
import ProductCard from "../components/product/ProductCard";
import { useProducts } from "../context/ProductContext";
import { Link } from "react-router-dom";

function Home() {
  const { activeProducts } = useProducts();
  const scrollRef = useRef(null);
  const animRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Duplicar produtos para dar volume ao scroll infinito
  const extendedProducts = [...activeProducts, ...activeProducts, ...activeProducts];

  useEffect(() => {
    const animate = () => {
      if (!scrollRef.current || isHovered) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }
      const container = scrollRef.current;
      container.scrollLeft += 0.8;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 10) {
        container.scrollLeft = container.clientWidth * 0.33;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isHovered]);

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

        <div
          ref={scrollRef}
          className="overflow-x-auto flex gap-4 pb-3 scroll-smooth"
          style={{ scrollbarWidth: "thin" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {extendedProducts.length > 0 ? (
            extendedProducts.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="shrink-0 w-44 sm:w-52"
              >
                <ProductCard product={product} />
              </div>
            ))
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

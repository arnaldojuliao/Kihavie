import { useRef, useEffect, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductGrid from "../components/product/ProductGrid";
import { useProducts } from "../context/ProductContext";
import { Link } from "react-router-dom";

function Home() {
  const { activeProducts } = useProducts();
  const topProducts = activeProducts.slice(0, 4);
  const trackRef = useRef(null);
  const animationRef = useRef(null);
  const isPausedRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Duplicate products for seamless infinite loop
  const carouselProducts = [...topProducts, ...topProducts];

  useEffect(() => {
    const track = trackRef.current;
    if (!track || topProducts.length === 0) return;

    const cardWidth = 100; // px
    const gap = 12; // gap-3 = 12px
    const step = cardWidth + gap; // 112px per card
    const halfIndex = topProducts.length; // reset when we've scrolled past the first half

    const scroll = () => {
      if (isPausedRef.current) {
        animationRef.current = requestAnimationFrame(scroll);
        return;
      }

      const currentScroll = track.scrollLeft;
      const target = currentScroll + 1;

      // If we've scrolled past the original set, reset smoothly
      if (currentScroll >= step * halfIndex) {
        track.scrollLeft = 0;
      } else {
        track.scrollLeft = target;
      }

      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);

    // Pause on hover
    const handleMouseEnter = () => { isPausedRef.current = true; };
    const handleMouseLeave = () => { isPausedRef.current = false; };
    track.addEventListener("mouseenter", handleMouseEnter);
    track.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      track.removeEventListener("mouseenter", handleMouseEnter);
      track.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [topProducts]);

  const scrollByCard = useCallback((direction) => {
    const track = trackRef.current;
    if (!track) return;

    const cardWidth = 100;
    const gap = 12;
    const step = cardWidth + gap;

    // Temporarily pause auto-scroll for 4 seconds
    isPausedRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, 4000);

    track.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="home-page">
      {/* Categorias */}
      <article className="mb-4 flex flex-col sm:flex-row gap-2 sm:justify-between font-bold">
        <Link className="bg-blue-600 rounded-md p-2 active:scale-95 text-white text-center text-sm sm:text-base">
          Mande da China
        </Link>
        <Link className="bg-red-700 rounded-md p-2 active:scale-95 text-white text-center text-sm sm:text-base">
          Manutenção de Dispositivos
        </Link>
      </article>

      {/* Os Mais Vendidos — Carrossel automático */}
      <section className="mb-8">
        <div className="flex items-center justify-center flex-col mb-3">
          <p className="text-black text-2xl font-semibold">Os Mais Vendidos</p>
          <p className="text-slate-600 text-center text-sm">
            Os produtos mais populares da nossa plataforma
          </p>
        </div>

        <div className="relative group/carousel">
          {/* Left edge shadow */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-[5]" />

          {/* Right edge shadow */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-[5]" />

          {/* Left arrow */}
          <button
            onClick={() => scrollByCard("left")}
            className="absolute left-0 top-0 bottom-0 z-10 w-8 opacity-60 md:opacity-0 md:group-hover/carousel:opacity-100 transition-opacity duration-200 flex items-center justify-center bg-gradient-to-r from-white/80 to-transparent hover:from-white cursor-pointer"
            aria-label="Anterior"
          >
            <FiChevronLeft className="text-slate-700" size={22} />
          </button>

          {/* Right arrow */}
          <button
            onClick={() => scrollByCard("right")}
            className="absolute right-0 top-0 bottom-0 z-10 w-8 opacity-60 md:opacity-0 md:group-hover/carousel:opacity-100 transition-opacity duration-200 flex items-center justify-center bg-gradient-to-l from-white/80 to-transparent hover:from-white cursor-pointer"
            aria-label="Seguinte"
          >
            <FiChevronRight className="text-slate-700" size={22} />
          </button>

        <div
          ref={trackRef}
          className="flex gap-3 overflow-x-auto hidden-scrollbar"
        >
          {carouselProducts.length > 0 ? (
            carouselProducts.map((product, index) => {
              const image =
                product.images?.[0] ||
                product.image ||
                "https://via.placeholder.com/250?text=Sem+imagem";
              return (
                <Link
                  key={`${product.id}-${index}`}
                  to={`/product/${product.id}`}
                  className="shrink-0 w-[100px] group"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    <div className="w-[100px] h-[100px] bg-slate-100 overflow-hidden">
                      <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-1">
                      <h3 className="font-semibold text-[10px] leading-tight text-center truncate">
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

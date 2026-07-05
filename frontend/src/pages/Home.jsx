import { useRef, useEffect, useCallback } from "react";
import { FiChevronLeft, FiChevronRight, FiShoppingCart } from "react-icons/fi";
import ProductGrid from "../components/product/ProductGrid";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function Home() {
  const { activeProducts } = useProducts();
  const { addToCart } = useCart();
  const topProducts = activeProducts.slice(0, 4);
  const trackRef = useRef(null);
  const intervalRef = useRef(null);
  const isPausedRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Duplicate products for seamless infinite loop
  const carouselProducts = [...topProducts, ...topProducts];

  const getStep = useCallback(() => {
    const firstCard = trackRef.current?.children[0];
    if (!firstCard) return 112;
    return firstCard.offsetWidth + 12;
  }, []);

  // Card-by-card auto-scroll every 3 seconds (Shoppable UGC Video Slider style)
  useEffect(() => {
    const track = trackRef.current;
    if (!track || topProducts.length === 0) return;

    const halfIndex = topProducts.length;

    const scrollNext = () => {
      if (isPausedRef.current) return;

      const step = getStep();
      const currentScroll = track.scrollLeft;

      // If we've scrolled past the original set, reset seamlessly
      if (currentScroll >= step * (halfIndex - 0.5)) {
        track.scrollLeft = 0;
      } else {
        track.scrollBy({ left: step, behavior: "smooth" });
      }
    };

    intervalRef.current = setInterval(scrollNext, 3000);

    // Pause on hover / touch
    const handleMouseEnter = () => { isPausedRef.current = true; };
    const handleMouseLeave = () => { isPausedRef.current = false; };
    track.addEventListener("mouseenter", handleMouseEnter);
    track.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      track.removeEventListener("mouseenter", handleMouseEnter);
      track.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [topProducts, getStep]);

  const scrollByCard = useCallback((direction) => {
    const track = trackRef.current;
    if (!track) return;

    const step = getStep();

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
  }, [getStep]);

  const getMainImage = (product) => {
    if (product.images && product.images.length > 0) return product.images[0];
    if (product.image) return product.image;
    return "https://via.placeholder.com/250?text=Sem+imagem";
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: getMainImage(product),
      quantity: 1,
      storeId: product.storeId,
    });
  };

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

      {/* Os Mais Vendidos — Shoppable UGC Video Slider */}
      <section className="mb-8">
        <div className="flex items-center justify-center flex-col mb-3">
          <p className="text-black text-2xl font-semibold">Os Mais Vendidos</p>
          <p className="text-slate-600 text-center text-sm">
            Deslize para explorar os produtos mais populares
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
            className="flex gap-3 overflow-x-auto hidden-scrollbar pb-1"
          >
            {carouselProducts.length > 0 ? (
              carouselProducts.map((product, index) => {
                const image = getMainImage(product);
                return (
                  <Link
                    key={`${product.id}-${index}`}
                    to={`/product/${product.id}`}
                    className="shrink-0 w-[55vw] sm:w-[200px] md:w-[220px] group/card"
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative">
                      {/* Image — tall portrait aspect ratio (UGC video style) */}
                      <div className="w-full h-[70vw] sm:h-[270px] md:h-[290px] bg-slate-100 overflow-hidden relative">
                        <img
                          src={image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                        />
                        {/* Price badge overlay */}
                        <div className="absolute bottom-2 left-2 bg-black/65 text-white text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm">
                          MT {Number(product.price).toFixed(2)}
                        </div>
                        {/* Shopping CTA — always visible on mobile, hover on desktop */}
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="absolute bottom-2 right-2 bg-blue-600 text-white p-2.5 rounded-full shadow-lg hover:bg-blue-700 active:scale-90 transition-all duration-200 md:opacity-0 md:group-hover/card:opacity-100"
                          aria-label="Adicionar ao carrinho"
                        >
                          <FiShoppingCart size={16} />
                        </button>
                      </div>
                      {/* Product info */}
                      <div className="p-2.5">
                        <h3 className="font-semibold text-xs sm:text-sm leading-tight truncate">
                          {product.name}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate">
                          {product.description || "Produto popular"}
                        </p>
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

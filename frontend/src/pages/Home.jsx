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
  const mobileProducts = topProducts.slice(0, 3);
  const trackRef = useRef(null);
  const intervalRef = useRef(null);
  const isPausedRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Duplicate products for seamless infinite loop
  const carouselProducts = [...mobileProducts, ...mobileProducts];

  const getStep = useCallback(() => {
    const firstCard = trackRef.current?.children[0];
    if (!firstCard) return 112;
    return firstCard.offsetWidth + 12;
  }, []);

  // Card-by-card auto-scroll every 3 seconds (Shoppable UGC Video Slider style)
  useEffect(() => {
    const track = trackRef.current;
    if (!track || mobileProducts.length === 0) return;

    const halfIndex = mobileProducts.length;

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
  }, [mobileProducts, getStep]);

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
            className="hidden sm:flex absolute left-0 top-0 bottom-0 z-10 w-8 opacity-60 md:opacity-0 md:group-hover/carousel:opacity-100 transition-opacity duration-200 items-center justify-center bg-gradient-to-r from-white/80 to-transparent hover:from-white cursor-pointer"
            aria-label="Anterior"
          >
            <FiChevronLeft className="text-slate-700" size={22} />
          </button>

          {/* Right arrow */}
          <button
            onClick={() => scrollByCard("right")}
            className="hidden sm:flex absolute right-0 top-0 bottom-0 z-10 w-8 opacity-60 md:opacity-0 md:group-hover/carousel:opacity-100 transition-opacity duration-200 items-center justify-center bg-gradient-to-l from-white/80 to-transparent hover:from-white cursor-pointer"
            aria-label="Seguinte"
          >
            <FiChevronRight className="text-slate-700" size={22} />
          </button>

          <div
            ref={trackRef}
            className="flex items-end justify-center gap-1.5 sm:gap-3 overflow-x-auto hidden-scrollbar pb-2 pt-1 px-1"
          >
            {carouselProducts.length > 0 ? (
              carouselProducts.map((product, index) => {
                const image = getMainImage(product);
                const isCenter = index % mobileProducts.length === 1;
                return (
                  <Link
                    key={`${product.id}-${index}`}
                    to={`/product/${product.id}`}
                    className={`shrink-0 group/card transition-all duration-300 ${isCenter ? "w-[130px] sm:w-[200px] md:w-[220px] scale-[1.03]" : "w-[90px] sm:w-[170px] md:w-[200px] opacity-90"}`}
                  >
                    <div className={`bg-white rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(15,23,42,0.10)] hover:shadow-[0_12px_30px_rgba(15,23,42,0.16)] transition-all duration-300 relative border ${isCenter ? "border-blue-200 shadow-[0_10px_28px_rgba(37,99,235,0.16)]" : "border-slate-100"} ${isCenter ? "ring-1 ring-blue-100" : ""}`}>
                      {/* Image — tall portrait aspect ratio (UGC video style) */}
                      <div className={`w-full ${isCenter ? "h-[180px] sm:h-[270px] md:h-[290px]" : "h-[120px] sm:h-[230px] md:h-[250px]"} bg-slate-100 overflow-hidden relative rounded-t-2xl`}>
                        <img
                          src={image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                        />
                        {isCenter && (
                          <>
                            <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-slate-900/20 to-transparent" />
                            <div className="absolute top-2 left-2 bg-blue-600/90 text-[10px] font-semibold text-white px-2 py-1 rounded-full">
                              Destaque
                            </div>
                          </>
                        )}
                        {/* Price badge overlay */}
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                          MT {Number(product.price).toFixed(2)}
                        </div>
                        {/* Shopping CTA — always visible on mobile, hover on desktop */}
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 active:scale-90 transition-all duration-200 md:opacity-0 md:group-hover/card:opacity-100"
                          aria-label="Adicionar ao carrinho"
                        >
                          <FiShoppingCart size={16} />
                        </button>
                      </div>
                      {/* Product info */}
                      <div className="p-2.5">
                        <h3 className={`font-semibold text-[10px] sm:text-sm leading-tight truncate ${isCenter ? "text-slate-900" : "text-slate-700"}`}>
                          {product.name}
                        </h3>
                        <p className="text-[9px] sm:text-xs text-slate-400 mt-0.5 truncate">
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

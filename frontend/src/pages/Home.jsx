import { useState, useEffect, useRef, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductGrid from "../components/product/ProductGrid";
import { useProducts } from "../context/ProductContext";
import { Link } from "react-router-dom";

function Home() {
  const { activeProducts } = useProducts();
  const products = activeProducts.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isPausedRef = useRef(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const getProduct = useCallback(
    (offset) => {
      if (products.length === 0) return null;
      return products[(currentIndex + offset + products.length) % products.length];
    },
    [products.length, currentIndex]
  );

  // Auto-rotation every 3 seconds
  useEffect(() => {
    if (products.length === 0) return;
    intervalRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setCurrentIndex((prev) => (prev + 1) % products.length);
      }
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [products.length]);

  const goNext = useCallback(() => {
    isPausedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, 4000);
    setCurrentIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);

  const goPrev = useCallback(() => {
    isPausedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, 4000);
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  }, [products.length]);

  const getMainImage = (product) => {
    if (!product) return "https://via.placeholder.com/250?text=Sem+imagem";
    if (product.images && product.images.length > 0) return product.images[0];
    if (product.image) return product.image;
    return "https://via.placeholder.com/250?text=Sem+imagem";
  };

  const centerProduct = getProduct(0);
  const leftProduct = getProduct(-1);
  const rightProduct = getProduct(1);

  const renderCard = (product, position, widthClass, heightClass) => {
    const isCenter = position === "center";
    const image = getMainImage(product);
    return (
      <Link
        key={position}
        to={product ? `/product/${product.id}` : "#"}
        className={`shrink-0 group/card transition-all duration-300 ${widthClass} ${isCenter ? "sm:scale-[1.03]" : "opacity-90"}`}
        onMouseEnter={() => { isPausedRef.current = true; }}
        onMouseLeave={() => { isPausedRef.current = false; }}
      >
        <div
          className={`bg-white rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(15,23,42,0.10)] hover:shadow-[0_12px_30px_rgba(15,23,42,0.16)] transition-all duration-300 relative border ${
            isCenter
              ? "border-blue-200 shadow-[0_10px_28px_rgba(37,99,235,0.16)] ring-1 ring-blue-100"
              : "border-slate-100"
          }`}
        >
          {/* Animated content — remounts on product change */}
          <div key={product?.id || position} className={isCenter ? "animate-fade-scale-in" : "animate-fade-slide-in"}>
            <div className={`w-full ${heightClass} bg-slate-100 overflow-hidden relative rounded-t-2xl`}>
              {product ? (
                <img
                  src={image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                  Sem produto
                </div>
              )}
              {isCenter && product && (
                <>
                  <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-slate-900/20 to-transparent" />
                  <div className="absolute top-2 left-2 bg-blue-600/90 text-[10px] font-semibold text-white px-2 py-1 rounded-full">
                    Destaque
                  </div>
                </>
              )}
            </div>
            {/* Product name — always visible */}
            {product && (
              <div className="px-2 pb-2 pt-1.5">
                <h4 className={`text-[10px] sm:text-xs leading-tight truncate font-medium ${
                  isCenter ? "text-slate-900" : "text-slate-500"
                }`}>
                  {product.name}
                </h4>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
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

        <div className="relative group/carousel overflow-hidden max-w-[360px] sm:max-w-[480px] md:max-w-[560px] mx-auto">
          {/* Left edge shadow */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-[5]" />

          {/* Right edge shadow */}
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-[5]" />

          {/* Left arrow */}
          <button
            onClick={goPrev}
            className="hidden sm:flex absolute left-0 top-0 bottom-0 z-10 w-8 opacity-60 md:opacity-0 md:group-hover/carousel:opacity-100 transition-opacity duration-200 items-center justify-center bg-gradient-to-r from-white/80 to-transparent hover:from-white cursor-pointer"
            aria-label="Anterior"
          >
            <FiChevronLeft className="text-slate-700" size={22} />
          </button>

          {/* Right arrow */}
          <button
            onClick={goNext}
            className="hidden sm:flex absolute right-0 top-0 bottom-0 z-10 w-8 opacity-60 md:opacity-0 md:group-hover/carousel:opacity-100 transition-opacity duration-200 items-center justify-center bg-gradient-to-l from-white/80 to-transparent hover:from-white cursor-pointer"
            aria-label="Seguinte"
          >
            <FiChevronRight className="text-slate-700" size={22} />
          </button>

          {/* 3 fixed molds — only the product content cycles */}
          <div className="flex justify-center items-center gap-1.5 sm:gap-3 pb-2 pt-1 px-1">
            {products.length > 0 ? (
              <>
                {renderCard(leftProduct, "left", "w-[100px] sm:w-[150px] md:w-[180px]", "h-[100px] sm:h-[230px] md:h-[250px]")}
                {renderCard(centerProduct, "center", "w-[220px] sm:w-[260px] md:w-[300px]", "h-[150px] sm:h-[270px] md:h-[290px]")}
                {renderCard(rightProduct, "right", "w-[100px] sm:w-[150px] md:w-[180px]", "h-[100px] sm:h-[230px] md:h-[250px]")}
              </>
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
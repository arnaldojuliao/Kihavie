import { useRef, useEffect, useState } from "react";
import ProductGrid from "../components/product/ProductGrid";
import { useProducts } from "../context/ProductContext";
import { Link } from "react-router-dom";
import { agents } from "../data/agentsData";
import AgentCard from "../components/agent/AgentCard";

function Home() {
  const { activeProducts } = useProducts();
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Repetir agentes 3 vezes para dar volume ao scroll infinito
  const extendedAgents = [...agents, ...agents, ...agents];

  useEffect(() => {
    const animate = () => {
      if (!containerRef.current || isHovered) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      const container = containerRef.current;
      container.scrollLeft += 1;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const maxScroll = scrollWidth - clientWidth;
      if (container.scrollLeft >= maxScroll - 10) {
        container.scrollLeft = clientWidth;
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isHovered]);

  return (
    <div className="home-page">
      <article className="mb-4 flex justify-between font-bold">
        <Link className="bg-blue-600 rounded-md p-2 active:shadow-red-500 active:shadow  text-white">
          Mande da China
        </Link>
        <Link className="bg-red-700 rounded-md p-2 active:shadow-blue-600 active:shadow text-white">
          Manutencao de Dispositivos
        </Link>
      </article>

      <div className="mb-4 flex items-center justify-center flex-col">
        <p className="text-black text-2xl font-semibold">Agentes de Compras</p>
        <p className="text-slate-600 text-center">
          Contrate um agente para comprar produtos em seu nome. O agente faz a
          compra, o desembaraço e entrega.
        </p>

        <div
          ref={containerRef}
          className="overflow-hidden md:w-full w-96 flex items-center justify-center gap-4 mt-2 pb-2 scroll-smooth"
          style={{ scrollbarWidth: "thin" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {extendedAgents.map((agent, index) => (
            <div
              key={`${agent.id}-${index}`}
              className="flex shrink-0"
            >
              <AgentCard
                agent={agent}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              />
            </div>
          ))}
        </div>
      </div>

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

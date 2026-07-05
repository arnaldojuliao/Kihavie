import { useEffect } from "react";

/**
 * Hook que faz scroll ao topo da página sempre que a dependência mudar.
 * @param {*} dependency - Valor a observar (ex: id de rota, storeId, etc.)
 * @param {"instant" | "smooth"} [behavior="instant"] - Comportamento do scroll
 */
export function useScrollToTop(dependency, behavior = "instant") {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior });
  }, [dependency]); // eslint-disable-line react-hooks/exhaustive-deps
}

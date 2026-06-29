import ProductCard from "./ProductCard";

function ProductGrid({ products = [] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Nenhum produto encontrado.</p>
      </div>
    );
  }

  return (
    <div className="product-grid grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;

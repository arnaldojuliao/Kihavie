import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";

function CartPage() {
  const { cart, totalItems, totalPrice, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <h1 className="text-3xl font-bold mb-6">Seu Carrinho</h1>
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <p className="text-slate-600 text-lg mb-4">Seu Carrinho está vazio</p>
          <Link
            to="/"
            className="inline-block bg-blue-600 active:scale-95 font-bold text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="text-3xl font-bold mb-6">Seu Carrinho</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-slate-200">
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-4 flex gap-3">
            <Link
              to="/search"
              className="flex-1 border active:scale-95 text-center bg-blue-600 text-white font-bold px-4 py-3 rounded-lg hover:bg-blue-800"
            >
              Continuar Comprando
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="flex-1 text-white active:scale-95 font-bold bg-red-500 border border-red-200 rounded-lg hover:bg-red-700"
            >
              Limpar Carrinho
            </button>
          </div>
        </div>

        <div>
          <CartSummary totalItems={totalItems} totalPrice={totalPrice} />
        </div>
      </div>
    </div>
  );
}

export default CartPage;

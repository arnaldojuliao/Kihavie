import { Link } from "react-router-dom";

function CartSummary({ totalItems, totalPrice }) {
  const taxAmount = totalPrice * 0.1;
  const shippingCost = totalPrice > 0 ? 10 : 0;
  const finalTotal = totalPrice + taxAmount + shippingCost;

  return (
    <div className="cart-summary bg-slate-100 shadow-2xl rounded-lg p-4 sm:p-6 sticky top-6 h-fit">
      <h2 className="text-lg font-semibold mb-4">Resumo da compra</h2>

      <div className="space-y-3 mb-4 pb-4 border-b border-slate-300">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Subtotal ({totalItems} itens)</span>
          <span className="font-medium">MT {totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Impostos (10%)</span>
          <span className="font-medium">MT {taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Envio</span>
          <span className="font-medium">MT {shippingCost.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between mb-6 text-lg font-bold">
        <span>Total</span>
        <span>MT {finalTotal.toFixed(2)}</span>
      </div>

      {totalItems > 0 ? (
        <Link
          to="/checkout"
          className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 mb-3"
        >
          Finalizar Compra
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="w-full bg-slate-300 text-slate-500 text-center py-3 rounded-lg font-semibold cursor-not-allowed mb-3"
        >
          Finalizar Compra
        </button>
      )}

      <Link
        to="/search"
        className="block text-center text-blue-600 hover:underline "
      >
        Continuar Comprando
      </Link>
    </div>
  );
}

export default CartSummary;
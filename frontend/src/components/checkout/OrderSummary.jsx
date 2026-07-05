import { useCart } from "../../context/CartContext";
import { calculateCartTotals } from "../../utils/cartCalculations";

function OrderSummary() {
  const { cart, totalPrice } = useCart();

  const { taxAmount, shippingCost, finalTotal } = calculateCartTotals(totalPrice);

  return (
    <div className="order-summary shadow-xl bg-slate-50 rounded-lg p-6 h-fit sticky top-6">
      <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>

      <div className="space-y-2 mb-4 pb-4 border-b border-slate-300 max-h-48 overflow-y-auto">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-slate-700">
              {item.name} x {item.quantity}
            </span>
            <span className="font-medium">
              MT {(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3 mb-4 pb-4 border-b border-slate-300">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Subtotal</span>
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

      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>MT {finalTotal.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default OrderSummary;
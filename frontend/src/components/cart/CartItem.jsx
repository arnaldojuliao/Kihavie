import { BiTrash } from "react-icons/bi";
import { useCart } from "../../context/CartContext";

function CartItem({ item }) {
  const { updateItemQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      updateItemQuantity(item.id, newQuantity);
    }
  };

  const subtotal = item.price * item.quantity;

  return (
    <div className="cart-item flex gap-3 sm:gap-4 shadow-xl border-b border-slate-200 py-2">
      <div className="w-16 sm:w-20 h-16 sm:h-20 bg-slate-100 rounded flex shrink-0 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-slate-900 mb-1">{item.name}</h3>
        <p className="text-sm text-slate-500 mb-3">
          MT {item.price.toFixed(2)}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="px-2 border border-slate-300 rounded hover:bg-slate-100 font-black text-2xl"
          >
            -
          </button>
          <span className="px-3 py-1 border border-slate-300 rounded text-lg min-w-12 text-center">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="px-2 border border-slate-300 rounded hover:bg-slate-100 text-2xl"
          >
            +
          </button>
        </div>
      </div>

      <div className="text-left flex flex-col items-center pr-4">
        <p className="font-bold pb-3 text-slate-900">MT {subtotal.toFixed(2)}</p>
        <button
          type="button"
          onClick={() => removeFromCart(item.id)}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          <BiTrash size={34}/>
        </button>
      </div>
    </div>
  );
}

export default CartItem;
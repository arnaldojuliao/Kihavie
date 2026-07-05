import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getOrdersByStoreId } from "../../services/orderService";

function MyOrders() {
  const { storeid } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    const fetchOrders = async () => {
      if (storeid) {
        const allOrders = await getOrdersByStoreId(storeid);
        setOrders(allOrders);
      }
    };
    fetchOrders();
  }, [storeid]);

  const getStatusColor = (status) => {
    switch(status) {
      case "Entregue": return "bg-green-100 text-green-800";
      case "Enviado": return "bg-blue-100 text-blue-800";
      case "Processando": return "bg-yellow-100 text-yellow-800";
      default: return "bg-slate-100";
    }
  };

  const filteredOrders = filter === "todos" ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="px-1">
      <h1 className="text-xl sm:text-3xl font-bold mb-2">Meus pedidos</h1>
      <div className="flex gap-1.5 sm:gap-2 mb-4 overflow-x-auto pb-1">
        {["todos", "Processando", "Enviado", "Entregue"].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-2 sm:px-3 py-1.5 rounded text-xs sm:text-sm whitespace-nowrap font-medium ${filter === s ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"}`}>
            {s === "todos" ? "Todos" : s}
          </button>
        ))}
      </div>
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-120">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold">Pedido</th>
                <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold">Data</th>
                <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold">Total</th>
                <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className="border-b hover:bg-slate-50">
                  <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm truncate max-w-20 sm:max-w-none">{order.id}</td>
                  <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap">MT {order.totalAmount.toFixed(2)}</td>
                  <td className="px-2 sm:px-4 py-2"><span className={`inline-block px-1.5 sm:px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>{order.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
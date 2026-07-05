import { Link } from "react-router-dom";

function OrderSuccess() {
  const lastOrder = localStorage.getItem("last_order");
  const order = lastOrder ? JSON.parse(lastOrder) : null;

  if (!order) {
    return (
      <div className="order-success-page">
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Nenhum pedido encontrado</h1>
          <p className="text-slate-600 mb-6">
            Parece que você ainda não completou uma compra.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Voltar para home
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="order-success-page">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Pedido confirmado!
          </h1>
          <p className="text-slate-600">
            Seu pedido foi realizado com sucesso. Você receberá um email de
            confirmação em breve.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-8 mb-8">
          <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-200">
            <div>
              <p className="text-sm text-slate-600 mb-1">Número do Pedido</p>
              <p className="text-lg font-semibold text-slate-900">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Data do Pedido</p>
              <p className="text-lg font-semibold text-slate-900">
                {formattedDate}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Itens do Pedido</h2>
            <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">
                      Quantidade: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-slate-900">
                    MT {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 pb-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold mb-4">Dados de Entrega</h2>
            <div className="space-y-2 text-sm text-slate-700">
              <p>
                <strong>Nome:</strong> {order.shippingData.fullName}
              </p>
              <p>
                <strong>Email:</strong> {order.shippingData.email}
              </p>
              <p>
                <strong>Telefone:</strong> {order.shippingData.phone}
              </p>
              <p>
                <strong>Endereço:</strong> {order.shippingData.address}
              </p>
              <p>
                <strong>Cidade:</strong> {order.shippingData.city},{" "}
                {order.shippingData.state} - {order.shippingData.zipCode}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between text-slate-700 mb-3">
              <span>Subtotal</span>
              <span>MT {order.subtotal?.toFixed(2) ?? ((order.totalAmount - 10) / 1.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-700 mb-3">
              <span>Impostos (10%)</span>
              <span>MT {order.taxAmount?.toFixed(2) ?? ((order.totalAmount - 10) / 11).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-700 mb-3">
              <span>Envio</span>
              <span>MT {order.shippingCost?.toFixed(2) ?? "10.00"}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-slate-200">
              <span>Total</span>
              <span>MT {order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-semibold mb-2">Próximos passos:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Você receberá um email de confirmação</li>
              <li>Seu pedido será processado em até 24 horas</li>
              <li>Você receberá um código de rastreamento por email</li>
              <li>Prazo de entrega: 5-7 dias úteis</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 text-center"
          >
            Voltar para Home
          </Link>
          <Link
            to="/search"
            className="inline-block border border-blue-600 text-blue-600 px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-50 text-center"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
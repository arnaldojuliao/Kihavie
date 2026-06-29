function PaymentMethodSelector({ onSelect, selectedMethod }) {
  const methods = [
    { id: "chat", name: "Conversar", icon: "💬" },
    { id: "mobile", name: "Carteira Móvel", icon: "📱"},
    { id: "visa", name: "Cartão VISA", icon: "💳" },
  ];

  return (
    <div className="payment-method-selector mb-6">
      <h3 className="text-lg font-semibold mb-3">Escolha a forma de pagamento</h3>
      <div className="grid grid-cols-3 md:grid-cols-3 gap-2">
        {methods.map(method => (
          <label key={method.id} className={`shadow-xl flex flex-col justify-center items-center hover:border rounded-lg p-4  cursor-pointer transition ${selectedMethod === method.id ? "border-blue-600 bg-blue-50" : "border-slate-200  hover:border-blue-300"}`}>
            <input type="radio" name="paymentMethod" value={method.id} checked={selectedMethod === method.id} onChange={() => onSelect(method.id)} className="hidden" />
            <div className="text-3xl mb-2">{method.icon}</div>
            <div className="font-semibold">{method.name}</div>
           
          </label>
        ))}
      </div>
    </div>
  );
}

export default PaymentMethodSelector;
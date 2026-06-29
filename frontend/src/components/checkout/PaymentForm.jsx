import { useState } from "react";
import { useToast } from "../../context/ToastContext";


function PaymentForm({ onSubmit, loading, totalAmount}) {
  const [formData, setFormData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const { showToast } = useToast();

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "cardNumber") {
      value = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
    }

    if (name === "expiryDate") {
      value = value.replace(/(\d{2})(\d)/, "$1/$2");
    }

    if (name === "cvv") {
      value = value.slice(0, 3);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cardNumber = formData.cardNumber.replace(/\s/g, "");
    if (cardNumber.length !== 16) {
      showToast("Número de cartão inválido");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Dados de Pagamento</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-800">
            <strong>Demonstração:</strong> Use qualquer número de cartão válido
            para simular
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Titular do Cartão
            </label>
            <input
              type="text"
              name="cardholderName"
              value={formData.cardholderName}
              onChange={handleChange}
              required
              placeholder="Nome do titular"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Número do Cartão
            </label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              required
              placeholder="0000 0000 0000 0000"
              maxLength="19"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Validade (MM/AA)
              </label>
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                required
                placeholder="MM/AA"
                maxLength="5"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                required
                placeholder="123"
                maxLength="3"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-lg"
      >
        {loading
          ? "Processando pagamento..."
          : `Pagar MT ${totalAmount.toFixed(2)}`}
      </button>

      <p className="text-xs text-slate-500 text-center">
        Sua transação é segura e encriptada.
      </p>
    </form>
  );
}

export default PaymentForm;
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CheckoutForm from "../components/checkout/CheckoutForm";
import PaymentForm from "../components/checkout/PaymentForm";
import PaymentMethodSelector from "../components/checkout/PaymentMethodSelector";
import OrderSummary from "../components/checkout/OrderSummary";
import { saveOrder } from "../services/orderService";
import { getStoreById } from "../services/storeService";
import { useToast } from "../context/ToastContext";
import { BiArrowBack } from "react-icons/bi";

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState("shipping");
  const [loading, setLoading] = useState(false);
  const [shippingData, setShippingData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const { showToast } = useToast();

  const taxAmount = totalPrice * 0.1;
  const shippingCost = 10;
  const finalTotal = totalPrice + taxAmount + shippingCost;

  if (!user) return <div className="p-8 text-center">Carregando...</div>;
  if (cart.length === 0)
    return <div className="p-8 text-center">Carrinho vazio</div>;

  const uniqueStores = [...new Set(cart.map((item) => item.storeId))];
  if (uniqueStores.length > 1) {
    showToast(
      "Seu carrinho contém produtos de lojas diferentes. Finalize compras separadamente.",
      "error",
    );
    return (
      <div className="checkout-page">
        <h1 className="text-3xl font-bold mb-4">Atenção</h1>
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6 text-center">
          <p className="text-yellow-800 mb-4">
            Seu carrinho contém produtos de{" "}
            <strong>{uniqueStores.length} lojas diferentes</strong>.
          </p>
          <p className="text-slate-600 mb-6">
            Para finalizar a compra, por favor, separe os itens por loja ou
            remova os produtos de uma das lojas.
          </p>
          <Link
            to="/cart"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Voltar ao carrinho
          </Link>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = (data) => {
    setShippingData(data);
    setStep("payment");
  };

  // Salva o pedido e limpa o carrinho
  const saveOrderAndClearCart = async () => {
    setLoading(true);
    try {
      const order = {
        id: `ORD-${Date.now()}`,
        items: cart,
        shippingData,
        paymentMethod,
        totalAmount: finalTotal,
        status: paymentMethod === "chat" ? "Aguardando contato" : "Processando",
        storeId: cart[0]?.storeId,
        createdAt: new Date(),
      };
      await saveOrder(order); // 👈 AGUARDA O PEDIDO SER SALVO
      localStorage.setItem("last_order", JSON.stringify(order));
      clearCart();
      return order;
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fluxo normal (cartão, etc.)
  const finalizeOrder = async () => {
    await saveOrderAndClearCart();
    navigate("/order-success");
  };

  const handleChatPayment = async () => {
    if (!cart.length) return;

    const storeId = cart[0].storeId;
    const store = await getStoreById(storeId);
    const phone = store?.phone;
    if (!phone) {
      showToast(
        "Número de WhatsApp do fornecedor não cadastrado. Entre em contato pelo suporte.",
        "error",
      );
      return;
    }

    // Monta a mensagem com os produtos e dados de entrega
    const productList = cart
      .map((item) => `- ${item.name} (x${item.quantity})`)
      .join("\n");

    const message = `Olá! Gostaria de falar sobre os seguintes produtos:\n${productList}\n\nTotal aproximado: MT ${finalTotal.toFixed(2)}\nMeu nome: ${shippingData?.fullName || user.name}\nEndereço: ${shippingData?.address || "a confirmar"}\n\nComo podemos acertar a entrega e o pagamento?`;

    const encodedMessage = encodeURIComponent(message);
    // Remove qualquer caractere não numérico do telefone
    const cleanPhone = phone.replace(/\D/g, "");
    const whatsappLink = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    // Salva o pedido antes de abrir o WhatsApp
    setLoading(true);
    try {
      await saveOrderAndClearCart();
      // Abre o WhatsApp em uma nova aba
      window.open(whatsappLink, "_blank");
      // Aguarda um pouco e redireciona para a página de sucesso
      setTimeout(() => {
        navigate("/order-success");
      }, 500);
    } catch {
      showToast("Erro ao finalizar pedido. Tente novamente.", "error");
      setLoading(false);
    }
  };

  const handlePaymentSubmit = () => {
    finalizeOrder();
  };

  const handleAlternativePayment = () => {
    if (paymentMethod === "chat") {
      handleChatPayment(); // 👈 Aqui chama o WhatsApp
    } else if (paymentMethod === "mobile") {
      showToast(
        "Instruções para pagamento via M-Pesa: envie o valor para o número 84 000 0000 e confirme no chat.",
      );
      finalizeOrder({ mobileNumber: "840000000" });
    }
  };

  return (
    <div className="checkout-page">
      <h1 className="text-3xl font-bold mb-2">Finalizar o Pagamento</h1>
      <div className="flex gap-2 mb-6">
        <span
          className={`px-4 py-2 rounded ${
            step === "shipping" ? "bg-blue-600 text-white" : "bg-slate-200"
          }`}
        >
          1. Envio
        </span>
        <span
          className={`px-4 py-2 rounded ${
            step === "payment" ? "bg-blue-600 text-white" : "bg-slate-200"
          }`}
        >
          2. Pagamento
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === "shipping" ? (
            <div className="bg-white border p-6 rounded-lg">
              <CheckoutForm onSubmit={handleShippingSubmit} />
            </div>
          ) : (
            <div className="bg-white shadow-2xl  p-6 rounded-lg">
              <button
                onClick={() => setStep("shipping")}
                className="text-blue-600 flex gap-2 items-center mb-4"
              >
                <BiArrowBack /> Voltar
              </button>

              <PaymentMethodSelector
                selectedMethod={paymentMethod}
                onSelect={setPaymentMethod}
              />

              {paymentMethod === "visa" && (
                <PaymentForm
                  onSubmit={handlePaymentSubmit}
                  loading={loading}
                  totalAmount={finalTotal}
                />
              )}

              {(paymentMethod === "chat" || paymentMethod === "mobile") && (
                <div className="mt-4 p-4 bg-yellow-50 shadow-current shadow rounded">
                  <p className="mb-3">
                    Você escolheu pagamento via{" "}
                    {paymentMethod === "chat"
                      ? "contacto com fornecedor"
                      : "carteira móvel"}
                    .
                  </p>
                  <div className="flex justify-center">
                    <button
                      onClick={handleAlternativePayment}
                      disabled={loading}
                      className="bg-green-600 text-white px-6 py-2 rounded disabled:bg-slate-400"
                    >
                      {loading
                        ? "Processando..."
                        : paymentMethod === "chat"
                          ? "Confirmar e abrir WhatsApp"
                          : "Confirmar pedido (pagamento externo)"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div>
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

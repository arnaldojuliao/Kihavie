import { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FcClock } from "react-icons/fc";
import { IoCall } from "react-icons/io5";
import { SiGmail } from "react-icons/si";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simular envio do formulário
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="max-w-6xl mx-auto py-5">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Contacte-nos
          </h1>
          <p className="text-lg text-slate-600">
            Estamos aqui para ajudar. Entre em contato conosco!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                Informações de contato
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl"><SiGmail color="red"/></div>
                  <div className="flex gap-2">
                    <p className="font-medium text-slate-900">Email</p>
                    <p className="text-slate-600">logo@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl"><IoCall color="red"/></div>
                  <div className="flex gap-2">
                    <p className="font-medium text-slate-900">Telefone</p>
                    <p className="text-slate-600">(+258) 87-000-000-0</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-2xl"><FaLocationDot color="red"/></div>
                  <div className="flex gap-2">
                    <p className="font-medium text-slate-900">Endereço</p>
                    <p className="text-slate-600">
                      Rua das Compras, 123
                      <br />
                      São Paulo - SP
                      <br />
                      CEP: 01234-567
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-2xl"><FcClock color="red"/></div>
                  <div>
                    <p className="font-medium text-slate-900">
                      Horário de atendimento
                    </p>
                    <p className="text-slate-600">
                      Segunda a Sexta: 8h às 18h
                      <br />
                      Sábado: 8h às 12h
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Perguntas frequentes
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-slate-900">
                    Como faço para vender?
                  </p>
                  <p className="text-sm text-slate-600">
                    Crie uma conta e adquira o pacote de loja no seu dashboard.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    Como rastrear meu pedido?
                  </p>
                  <p className="text-sm text-slate-600">
                    Acesse seu histórico de pedidos no dashboard.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    Problemas com pagamento?
                  </p>
                  <p className="text-sm text-slate-600">
                    Entre em contato conosco pelo email de suporte.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">
              Envie sua mensagem
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Assunto
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Selecione um assunto</option>
                  <option value="suporte">Suporte técnico</option>
                  <option value="vendas">Vendas</option>
                  <option value="reclamacao">Reclamação</option>
                  <option value="sugestao">Sugestão</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mensagem
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Digite sua mensagem aqui..."
                />
              </div>

              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  Mensagem enviada com sucesso! Entraremos em contato em breve.
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white active:shadow-red-500 active:shadow py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {loading ? "Enviando..." : "Enviar mensagem"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;

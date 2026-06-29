import { FaStar } from "react-icons/fa";

function AgentCard({ agent, onMouseEnter, onMouseLeave }) {
  const whatsappLink = `https://wa.me/${agent.whatsapp}?text=Olá! Gostaria de contratar seus serviços de agente de compras.`;

  const handleImageClick = () => {
    window.open(whatsappLink, "_blank");
  };

  // Usa o ano do agente se existir, senão "2024"
  const agentSinceYear = agent.createdAt
    ? new Date(agent.createdAt).getFullYear()
    : "2024";

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Imagem */}
      <img
        src={agent.avatar}
        alt={agent.name}
        className="w-28 h-28 rounded-full object-cover border-3 border-blue-500 shadow-sm hover:shadow-md transition cursor-pointer"
        onClick={handleImageClick}
      />

      <div className="absolute bottom-9 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white px-2.5 py-0.5 rounded-full shadow flex items-center gap-1 text-sm font-semibold">
        <FaStar className="fill-yellow-400" size={14} />
        <span>{agent.rating}</span>
      </div>

      <div className="mt-2 text-center">
        <p className="text-xs text-slate-500">Desde {agentSinceYear}</p>
       
      </div>
    </div>
  );
}

export default AgentCard;
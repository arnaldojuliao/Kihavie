/**
 * Formata uma data para o padrão brasileiro (dd/mm/aaaa)
 * @param {Date|string} date - Data a ser formatada
 * @returns {string} Data formatada (ex: 31/12/2024)
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-BR');
};

/**
 * Formata uma data com hora (dd/mm/aaaa HH:MM)
 * @param {Date|string} date - Data a ser formatada
 * @returns {string} Data e hora formatada
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString('pt-BR');
};

/**
 * Retorna o tempo relativo (ex: "há 2 dias")
 * @param {Date|string} date - Data a ser comparada
 * @returns {string} Texto relativo
 */
export const timeAgo = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'agora mesmo';
  if (diffMins < 60) return `há ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
  if (diffHours < 24) return `há ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
  if (diffDays < 30) return `há ${diffDays} dia${diffDays !== 1 ? 's' : ''}`;
  
  return formatDate(d);
};
/**
 * Formata um valor numérico para moeda Metical (MT)
 * @param {number} value - Valor a ser formatado
 * @returns {string} Ex: "MT 1.234,56"
 */
export const formatPrice = (value) => {
  if (value === undefined || value === null) return 'MT 0,00';
  const num = Number(value);
  if (isNaN(num)) return 'MT 0,00';
  return `MT ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Formata valor sem o símbolo da moeda
 * @param {number} value 
 * @returns {string} Ex: "1.234,56"
 */
export const formatNumber = (value) => {
  if (value === undefined || value === null) return '0,00';
  const num = Number(value);
  if (isNaN(num)) return '0,00';
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
/**
 * Formata um valor numérico para moeda Metical (MT)
 * @param {number} value - Valor a ser formatado
 * @returns {string} Ex: "MT 1.234,56"
 */
export const formatPrice = (value) => {
  if (value === undefined || value === null) return 'MT 0,00';
  const num = Number(value);
  if (isNaN(num)) return 'MT 0,00';
  // Formatação manual para garantir separadores correctos (ex: 1.234,56)
  const formatted = num
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `MT ${formatted}`;
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
  return num
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
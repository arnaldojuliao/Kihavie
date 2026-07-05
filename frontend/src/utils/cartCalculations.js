/**
 * Centraliza os cálculos do carrinho (subtotal, imposto, envio, total)
 * para garantir consistência em toda a aplicação.
 *
 * @param {number} totalPrice - Soma dos preços dos itens no carrinho
 * @param {object} [options]
 * @param {number} [options.taxRate=0.1] - Percentagem de imposto (0.1 = 10%)
 * @param {number} [options.shipping=10] - Custo fixo de envio
 * @param {boolean} [options.freeShippingIfEmpty=true] - Envio grátis quando carrinho vazio
 * @returns {{ subtotal: number, taxAmount: number, shippingCost: number, finalTotal: number }}
 */
export function calculateCartTotals(totalPrice, options = {}) {
  const {
    taxRate = 0.1,
    shipping = 10,
    freeShippingIfEmpty = true,
  } = options;

  const subtotal = totalPrice;
  const taxAmount = subtotal * taxRate;
  const shippingCost = freeShippingIfEmpty && totalPrice <= 0 ? 0 : shipping;
  const finalTotal = subtotal + taxAmount + shippingCost;

  return { subtotal, taxAmount, shippingCost, finalTotal };
}

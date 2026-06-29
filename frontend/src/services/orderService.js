import { orderApi } from './api';

const normalizeOrder = (order) => ({
  ...order,
  id: order.id || order.id,
  storeId: order.storeId?.id || order.storeId,
  userId: order.userId?.id || order.userId,
});

export const getAllOrders = async () => {
  console.warn('getAllOrders não implementado na API pública');
  return [];
};

export const saveOrder = async (orderPayload) => {
  const newOrder = await orderApi.createOrder(orderPayload);
  return normalizeOrder(newOrder);
};

export const getOrdersByStoreId = async (storeId) => {
  const orders = await orderApi.getStoreOrders(storeId);
  return orders.map(normalizeOrder);
};

export const getStoreRevenue = async (storeId) => {
  // Se storeId for fornecido, chama endpoint específico (admin view)
  if (storeId) {
    const revenue = await orderApi.getStoreRevenueById(storeId);
    return revenue;
  }
  const revenue = await orderApi.getStoreRevenue();
  return revenue;
};

export const getPendingOrdersByStoreId = async (storeId) => {
  const orders = await getOrdersByStoreId(storeId);
  return orders.filter(order => order.status !== 'Entregue' && order.status !== 'Cancelado');
};

export const getOrdersByStatus = async (storeId, status) => {
  const orders = await getOrdersByStoreId(storeId);
  return orders.filter(o => o.status === status);
};

export const updateOrderStatus = async (orderId, status) => {
  const updated = await orderApi.updateOrderStatus(orderId, status);
  return normalizeOrder(updated);
};
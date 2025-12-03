import api from './api';

export interface Order {
  _id: string;
  group: any;
  orderedBy: any;
  items: any[];
  platform: string;
  totalAmount: number;
  currency: string;
  status: string;
  externalOrderId?: string;
  deliveryAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const orderService = {
  async createOrder(data: {
    groupId: string;
    platform: string;
    deliveryAddress?: string;
    automate?: boolean;
  }): Promise<Order> {
    const response = await api.post('/orders', data);
    return response.data.order;
  },

  async getOrders(params?: { groupId?: string; status?: string }): Promise<Order[]> {
    const response = await api.get('/orders', { params });
    return response.data.orders;
  },

  async getOrderById(id: string): Promise<Order> {
    const response = await api.get(`/orders/${id}`);
    return response.data.order;
  },

  async updateOrderStatus(
    id: string,
    data: { status?: string; externalOrderId?: string; notes?: string }
  ): Promise<Order> {
    const response = await api.put(`/orders/${id}/status`, data);
    return response.data.order;
  },
};

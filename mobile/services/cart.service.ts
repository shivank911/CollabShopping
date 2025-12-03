import api from './api';

export interface CartItem {
  product: any;
  quantity: number;
  addedBy: any;
  addedAt: string;
}

export interface Cart {
  _id: string;
  group: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export const cartService = {
  async getCart(groupId: string): Promise<Cart> {
    const response = await api.get(`/carts/${groupId}`);
    return response.data.cart;
  },

  async addToCart(groupId: string, productId: string, quantity: number = 1): Promise<Cart> {
    const response = await api.post(`/carts/${groupId}/items`, { productId, quantity });
    return response.data.cart;
  },

  async updateCartItem(groupId: string, productId: string, quantity: number): Promise<Cart> {
    const response = await api.put(`/carts/${groupId}/items/${productId}`, { quantity });
    return response.data.cart;
  },

  async removeFromCart(groupId: string, productId: string): Promise<Cart> {
    const response = await api.delete(`/carts/${groupId}/items/${productId}`);
    return response.data.cart;
  },

  async clearCart(groupId: string): Promise<Cart> {
    const response = await api.delete(`/carts/${groupId}`);
    return response.data.cart;
  },
};

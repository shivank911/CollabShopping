import api from './api';

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  imageUrl?: string;
  productUrl: string;
  platform: string;
  externalId: string;
  category?: string;
  brand?: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export const productService = {
  async scrapeProduct(url: string): Promise<Product> {
    const response = await api.post('/products/scrape', { url });
    return response.data.product;
  },

  async getProducts(params?: {
    platform?: string;
    search?: string;
    limit?: number;
    skip?: number;
  }): Promise<{ products: Product[]; total: number }> {
    const response = await api.get('/products', { params });
    return response.data;
  },

  async getProductById(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data.product;
  },
};

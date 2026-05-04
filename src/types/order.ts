import { Product } from './product';

export interface Buyer {
  name: string;
  phone: string;
  address: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  buyer: Buyer;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'Pendiente' | 'Procesando' | 'Completado' | 'Cancelado';
  createdAt: Date;
  comments?: string;
  paymentMethod?: 'Transferencia Nequi' | 'Transferencia Bancolombia' | 'Transferencia Breve' | 'Efectivo' | 'A crédito';
  paymentDate?: string;
  transactionReference?: string;
}

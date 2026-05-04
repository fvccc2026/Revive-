import { Order } from './order';

export interface Customer {
  id: string; // Typically the phone number or a hash
  name: string;
  phone: string;
  address: string;
  totalPurchases: number;
  orderCount: number;
  lastOrderDate: Date | string;
  history: Order[];
}

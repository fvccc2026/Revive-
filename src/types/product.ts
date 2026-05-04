export interface CostBreakdown {
  id: string;
  label: string;
  value: number;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  cost: number;
  price: number;
  margin: number;
  image: string;
  costBreakdown?: CostBreakdown[];
  initialStock?: number;
}

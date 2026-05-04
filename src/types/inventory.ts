export type MovementType = 'STOCK_IN' | 'SALE' | 'SAMPLE' | 'LOSS';

export interface InventoryMovement {
  id: string;
  date: string;
  type: MovementType;
  itemType: 'RAW' | 'FINISHED';
  productId: number;
  quantity: number;
  reference?: string; // Order ID or Purchase Order ID
  notes?: string;
}

export interface RawMaterial {
  id: number;
  name: string;
  category: 'MATERIA PRIMA' | 'ENVASES Y EMPAQUES';
  unit: string; // e.g. g, ml, kg, und
  unitCost: number;
  totalCost: number; // For parameterization
  stock: number;
}

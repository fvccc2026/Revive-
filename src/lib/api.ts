import { supabase } from './supabase';
import { Product } from '../types/product';
import { Order } from '../types/order';
import { InventoryMovement, RawMaterial } from '../types/inventory';

// PRODUCTS
export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data || [];
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product | null> => {
  const { data, error } = await supabase.from('products').insert([product]).select().single();
  if (error) {
    console.error('Error creating product:', error);
    return null;
  }
  return data;
};

export const updateProduct = async (product: Product): Promise<Product | null> => {
  const { data, error } = await supabase.from('products').update(product).eq('id', product.id).select().single();
  if (error) {
    console.error('Error updating product:', error);
    return null;
  }
  return data;
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    console.error('Error deleting product:', error);
    return false;
  }
  return true;
};

// ORDERS
export const fetchOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase.from('orders').select('*');
  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
  return data || [];
};

export const createOrder = async (order: Order): Promise<Order | null> => {
  const { data, error } = await supabase.from('orders').insert([order]).select().single();
  if (error) {
    console.error('Error creating order:', error);
    return null;
  }
  return data;
};

export const updateOrder = async (order: Order): Promise<Order | null> => {
  const { data, error } = await supabase.from('orders').update(order).eq('id', order.id).select().single();
  if (error) {
    console.error('Error updating order:', error);
    return null;
  }
  return data;
};

export const deleteOrder = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) {
    console.error('Error deleting order:', error);
    return false;
  }
  return true;
};

// RAW MATERIALS
export const fetchRawMaterials = async (): Promise<RawMaterial[]> => {
  const { data, error } = await supabase.from('raw_materials').select('*');
  if (error) {
    console.error('Error fetching raw materials:', error);
    return [];
  }
  return (data || []).map(rm => ({
    id: rm.id,
    name: rm.name,
    category: rm.category,
    unitCost: rm.cost, // DB has 'cost', frontend has 'unitCost'
    unit: rm.unit,
    stock: rm.initialStock, // DB has 'initialStock', frontend has 'stock'
    totalCost: rm.cost * rm.initialStock
  }));
};

export const createRawMaterial = async (material: RawMaterial): Promise<RawMaterial | null> => {
  const dbRm = {
    name: material.name,
    category: material.category,
    cost: material.unitCost,
    unit: material.unit,
    initialStock: material.stock
  };
  const { data, error } = await supabase.from('raw_materials').insert([dbRm]).select().single();
  if (error) {
    console.error('Error creating raw material:', error);
    return null;
  }
  return {
    id: data.id,
    name: data.name,
    category: data.category,
    unitCost: data.cost,
    unit: data.unit,
    stock: data.initialStock,
    totalCost: data.cost * data.initialStock
  };
};

export const updateRawMaterial = async (material: RawMaterial): Promise<RawMaterial | null> => {
  const dbRm = {
    name: material.name,
    category: material.category,
    cost: material.unitCost,
    unit: material.unit,
    initialStock: material.stock
  };
  const { data, error } = await supabase.from('raw_materials').update(dbRm).eq('id', material.id).select().single();
  if (error) {
    console.error('Error updating raw material:', error);
    return null;
  }
  return {
    id: data.id,
    name: data.name,
    category: data.category,
    unitCost: data.cost,
    unit: data.unit,
    stock: data.initialStock,
    totalCost: data.cost * data.initialStock
  };
};

export const deleteRawMaterial = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('raw_materials').delete().eq('id', id);
  if (error) {
    console.error('Error deleting raw material:', error);
    return false;
  }
  return true;
};

const mapDbToMovement = (dbMov: any): InventoryMovement => ({
  id: dbMov.id,
  date: dbMov.date,
  type: dbMov.reason,
  itemType: dbMov.itemType === 'product' ? 'FINISHED' : 'RAW',
  productId: isNaN(Number(dbMov.itemId)) ? dbMov.itemId : Number(dbMov.itemId),
  quantity: dbMov.quantity,
  reference: dbMov.referenceId,
  notes: dbMov.notes
});

const mapMovementToDb = (mov: InventoryMovement): any => ({
  itemId: mov.productId.toString(),
  itemType: mov.itemType === 'FINISHED' ? 'product' : 'raw_material',
  type: ['STOCK_IN'].includes(mov.type) ? 'in' : 'out',
  quantity: mov.quantity,
  date: mov.date,
  reason: mov.type,
  referenceId: mov.reference,
  notes: mov.notes || ''
});

// MOVEMENTS
export const fetchMovements = async (): Promise<InventoryMovement[]> => {
  const { data, error } = await supabase.from('inventory_movements').select('*');
  if (error) {
    console.error('Error fetching movements:', error);
    return [];
  }
  return (data || []).map(mapDbToMovement);
};

export const createMovement = async (movement: InventoryMovement): Promise<InventoryMovement | null> => {
  const { data, error } = await supabase.from('inventory_movements').insert([mapMovementToDb(movement)]).select().single();
  if (error) {
    console.error('Error creating movement:', error);
    return null;
  }
  return mapDbToMovement(data);
};

export const createMovementsBatch = async (movements: InventoryMovement[]): Promise<boolean> => {
  const { error } = await supabase.from('inventory_movements').insert(movements.map(mapMovementToDb));
  if (error) {
    console.error('Error creating movements batch:', error);
    return false;
  }
  return true;
};

export const updateMovement = async (movement: InventoryMovement): Promise<InventoryMovement | null> => {
  const { data, error } = await supabase.from('inventory_movements').update(mapMovementToDb(movement)).eq('id', movement.id).select().single();
  if (error) {
    console.error('Error updating movement:', error);
    return null;
  }
  return mapDbToMovement(data);
};

export const deleteMovement = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('inventory_movements').delete().eq('id', id);
  if (error) {
    console.error('Error deleting movement:', error);
    return false;
  }
  return true;
};

import React, { useState } from 'react';
import { Plus, CheckCircle, TrendingUp, X, FileText, ShoppingBag, MapPin, Phone, User, Search, Trash2, Edit2, CreditCard, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import { Product } from '../types/product';
import { Order, OrderItem } from '../types/order';
import { InventoryMovement } from '../types/inventory';

interface OrderManagementProps {
  products?: Product[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  movements: InventoryMovement[];
  setMovements: (m: InventoryMovement[]) => void;
}

export function OrderManagement({ products = [], orders, setOrders, movements, setMovements }: OrderManagementProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Form state
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('A crédito');
  const [paymentDate, setPaymentDate] = useState('');
  const [transactionReference, setTransactionReference] = useState('');
  
  const filteredProducts = [...products]
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const subtotal = orderItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const deliveryFee = subtotal >= 50000 || subtotal === 0 ? 0 : 5000;
  const total = subtotal + deliveryFee;

  const totalPorCobrar = orders.reduce((sum, o) => sum + o.total, 0);

  const handleAddProduct = (product: Product) => {
    const existing = orderItems.find(i => i.product.id === product.id);
    if (existing) {
      setOrderItems(orderItems.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setOrderItems([...orderItems, { product, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (productId: string | number, qty: number) => {
    if (qty <= 0) {
      setOrderItems(orderItems.filter(i => i.product.id !== productId));
    } else {
      setOrderItems(orderItems.map(i => i.product.id === productId ? { ...i, quantity: qty } : i));
    }
  };

  const handleRemoveProduct = (productId: string | number) => {
    setOrderItems(orderItems.filter(i => i.product.id !== productId));
  };

  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone || !buyerAddress || orderItems.length === 0) {
      alert("Por favor, completa todos los datos del comprador y añade al menos un producto.");
      return;
    }
    
    const api = await import('../lib/api');

    if (editingOrderId) {
      const orderToUpdate = orders.find(o => o.id === editingOrderId);
      if (orderToUpdate) {
        const updatedOrder = {
          ...orderToUpdate,
          buyer: { name: buyerName, phone: buyerPhone, address: buyerAddress },
          items: orderItems,
          subtotal,
          deliveryFee,
          total,
          paymentMethod,
          paymentDate,
          transactionReference
        };
        await api.updateOrder(updatedOrder);
        setOrders(orders.map(o => o.id === editingOrderId ? updatedOrder : o));
      }
    } else {
      const newOrder: Order = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        buyer: { name: buyerName, phone: buyerPhone, address: buyerAddress },
        items: orderItems,
        subtotal,
        deliveryFee,
        total,
        status: 'Pendiente',
        createdAt: new Date(),
        paymentMethod,
        paymentDate,
        transactionReference
      };
      
      const createdOrder = await api.createOrder(newOrder);
      if (createdOrder) {
        setOrders([createdOrder, ...orders]);
      } else {
        setOrders([newOrder, ...orders]);
      }
      
      // Generate inventory movements for sales
      const newMovements: InventoryMovement[] = orderItems.map(item => ({
        id: Date.now().toString() + Math.random().toString(),
        date: new Date().toISOString(),
        type: 'SALE',
        itemType: 'FINISHED',
        productId: item.product.id,
        quantity: item.quantity,
        reference: newOrder.id,
        notes: `Venta automática pedido ${newOrder.id}`
      }));
      // Map to db column names for Supabase
      const dbMovements = newMovements.map(m => ({
        id: m.id,
        itemId: m.productId.toString(),
        itemType: 'product',
        type: 'out',
        quantity: m.quantity,
        date: m.date,
        reason: 'Sale',
        referenceId: m.reference
      }));
      await api.createMovementsBatch(dbMovements as any);
      setMovements([...movements, ...newMovements]);
    }
    
    setDrawerOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setBuyerName('');
    setBuyerPhone('');
    setBuyerAddress('');
    setOrderItems([]);
    setPaymentMethod('A crédito');
    setPaymentDate('');
    setTransactionReference('');
    setEditingOrderId(null);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrderId(order.id);
    setBuyerName(order.buyer.name);
    setBuyerPhone(order.buyer.phone);
    setBuyerAddress(order.buyer.address);
    setOrderItems(order.items);
    setPaymentMethod(order.paymentMethod || 'A crédito');
    setPaymentDate(order.paymentDate || '');
    setTransactionReference(order.transactionReference || '');
    setDrawerOpen(true);
  };

  const handleDeleteOrder = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
      const api = await import('../lib/api');
      await api.deleteOrder(id);
      setOrders(orders.filter(o => o.id !== id));
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <header className="fixed top-0 right-0 left-64 h-20 bg-surface/90 backdrop-blur-xl flex justify-between items-center px-12 z-40 border-b border-outline/5">
        <div>
          <h2 className="font-black text-2xl tracking-tighter text-primary">Gestión de Pedidos</h2>
          <p className="text-[10px] font-black text-tertiary uppercase tracking-[0.2em] mt-1">Control de Operaciones</p>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setDrawerOpen(true)}
            className="bg-primary text-white flex items-center gap-2 px-8 py-3 rounded-xl font-black text-xs shadow-xl shadow-primary/20 hover:bg-primary/95 transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus className="w-4 h-4" />
            Nuevo Pedido
          </button>
        </div>
      </header>

      <div className={cn("flex-1 p-12 space-y-10 overflow-y-auto mt-20 transition-all duration-500", drawerOpen ? "mr-[500px]" : "mr-0")}>
        <section className="grid grid-cols-12 gap-8 h-56">
          <div className="col-span-5 bg-primary p-10 rounded-[40px] flex flex-col justify-between text-white relative shadow-2xl shadow-primary/20 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-tertiary-fixed bg-white/5 px-4 py-2 rounded-xl backdrop-blur-md inline-block">Pedidos de Hoy</span>
              <div className="mt-8 flex items-baseline gap-4">
                <span className="text-7xl font-black tracking-tighter">{orders.length}</span>
                {orders.length > 0 && (
                  <span className="text-xs font-black text-tertiary-fixed flex items-center gap-1 uppercase tracking-widest">
                    <TrendingUp className="w-4 h-4" /> Activo
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-7 bg-surface p-10 rounded-[40px] flex flex-col justify-between shadow-sm border border-outline/5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-tertiary mb-4 block">Total por Cobrar</span>
                <div className="mt-2">
                  <span className="text-5xl font-black text-primary tracking-tighter">${totalPorCobrar.toLocaleString('es-CO')}</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-surface-dim rounded-2xl flex items-center justify-center border border-outline/5">
                <FileText className="text-tertiary w-8 h-8" />
              </div>
            </div>
            {orders.length === 0 && (
              <p className="text-sm font-bold text-tertiary mt-8">Aún no hay pedidos registrados hoy.</p>
            )}
          </div>
        </section>

        <section className="bg-surface rounded-[40px] shadow-sm border border-outline/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-dim/50 border-b border-outline/5">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-tertiary">ID Pedido</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-tertiary">Cliente</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-tertiary">Productos</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-tertiary">Total</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-tertiary">Pago</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-tertiary">Estado</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-tertiary text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-10 py-16 text-center text-tertiary font-bold">
                    No hay pedidos. Haz clic en "Nuevo Pedido" para comenzar.
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="hover:bg-surface-dim transition-colors group">
                    <td className="px-10 py-6 text-sm font-black text-primary">{order.id}</td>
                    <td className="px-10 py-6">
                      <p className="text-sm font-black text-primary">{order.buyer.name}</p>
                      <p className="text-xs font-bold text-tertiary">{order.buyer.phone}</p>
                    </td>
                    <td className="px-10 py-6 text-sm font-bold text-tertiary">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} ítems
                    </td>
                    <td className="px-10 py-6 text-sm font-black text-primary">${order.total.toLocaleString('es-CO')}</td>
                    <td className="px-10 py-6">
                      <p className="text-sm font-black text-primary">{order.paymentMethod || 'N/A'}</p>
                      {order.transactionReference && <p className="text-[10px] font-bold text-tertiary">Ref: {order.transactionReference}</p>}
                      {order.paymentDate && <p className="text-[10px] font-bold text-tertiary">Vence/Pagó: {order.paymentDate}</p>}
                    </td>
                    <td className="px-10 py-6">
                      <span className="px-4 py-2 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-black uppercase rounded-lg tracking-widest inline-block">{order.status}</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleEditOrder(order)}
                          className="w-8 h-8 rounded-lg bg-surface-dim flex items-center justify-center text-tertiary hover:text-primary transition-colors"
                          title="Editar pedido"
                          aria-label="Editar pedido"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(order.id)}
                          className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center text-error hover:bg-error hover:text-white transition-colors"
                          title="Eliminar pedido"
                          aria-label="Eliminar pedido"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>

      <aside className={cn("fixed right-0 top-0 mt-20 w-[500px] bg-surface h-[calc(100vh-5rem)] border-l border-outline/5 shadow-2xl z-30 flex flex-col transition-transform duration-500", drawerOpen ? "translate-x-0" : "translate-x-full")}>
        <div className="p-8 border-b border-outline/5 bg-surface-dim/30 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black text-primary tracking-tighter">{editingOrderId ? 'Editar Pedido' : 'Crear Pedido'}</h3>
            <p className="text-[10px] font-black text-tertiary uppercase tracking-[0.2em] mt-1">{editingOrderId ? 'Modificar venta existente' : 'Registrar nueva venta'}</p>
          </div>
          <button 
            onClick={() => { setDrawerOpen(false); resetForm(); }}
            className="w-10 h-10 flex items-center justify-center hover:bg-outline/5 rounded-xl transition-all text-tertiary"
            title="Cerrar formulario"
            aria-label="Cerrar formulario"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <form id="order-form" onSubmit={handleSaveOrder} className="space-y-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                <User className="w-4 h-4 text-tertiary" /> Datos del Comprador
              </h4>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Nombre completo" 
                  required
                  value={buyerName}
                  onChange={e => setBuyerName(e.target.value)}
                  className="w-full bg-surface-dim border border-outline/10 rounded-xl px-4 py-3 text-sm font-bold text-primary outline-none focus:border-primary/30 transition-colors"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Phone className="w-4 h-4 text-tertiary absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type="tel" 
                      placeholder="Teléfono" 
                      required
                      value={buyerPhone}
                      onChange={e => setBuyerPhone(e.target.value)}
                      className="w-full bg-surface-dim border border-outline/10 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-primary outline-none focus:border-primary/30 transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-tertiary absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Dirección" 
                      required
                      value={buyerAddress}
                      onChange={e => setBuyerAddress(e.target.value)}
                      className="w-full bg-surface-dim border border-outline/10 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-primary outline-none focus:border-primary/30 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-tertiary" /> Método de Pago
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-tertiary absolute left-4 top-1/2 -translate-y-1/2" />
                  <select
                    value={paymentMethod || ''}
                    onChange={e => setPaymentMethod(e.target.value as Order['paymentMethod'])}
                    title="Método de Pago"
                    aria-label="Método de Pago"
                    className="w-full bg-surface-dim border border-outline/10 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-primary outline-none focus:border-primary/30 transition-colors appearance-none"
                  >
                    <option value="A crédito">A crédito</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia Bancolombia">Transferencia Bancolombia</option>
                    <option value="Transferencia Breve">Transferencia Breve</option>
                    <option value="Transferencia Nequi">Transferencia Nequi</option>
                  </select>
                </div>
                <div className="relative" title="Fecha de pago o recordatorio de cobro">
                  <Calendar className="w-4 h-4 text-tertiary absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={e => setPaymentDate(e.target.value)}
                    title="Fecha de Pago o Recordatorio"
                    aria-label="Fecha de Pago o Recordatorio"
                    className="w-full bg-surface-dim border border-outline/10 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-primary outline-none focus:border-primary/30 transition-colors"
                  />
                </div>
              </div>
              {paymentMethod?.includes('Transferencia') && (
                <div className="relative" title="Número de comprobante o referencia">
                  <FileText className="w-4 h-4 text-tertiary absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Número de comprobante o referencia..."
                    value={transactionReference}
                    onChange={e => setTransactionReference(e.target.value)}
                    title="Número de Comprobante"
                    aria-label="Número de Comprobante"
                    className="w-full bg-surface-dim border border-outline/10 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-primary outline-none focus:border-primary/30 transition-colors"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-tertiary" /> Productos
              </h4>
              
              <div className="relative">
                <Search className="w-4 h-4 text-tertiary absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Buscar producto para agregar..." 
                  value={searchTerm}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-surface-dim border border-outline/10 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-primary outline-none focus:border-primary/30 transition-colors"
                />

                {isSearchFocused && filteredProducts.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-surface border border-outline/10 shadow-2xl rounded-xl max-h-60 overflow-y-auto p-2 space-y-1">
                    {filteredProducts.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => { handleAddProduct(p); setSearchTerm(''); setIsSearchFocused(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-surface-dim rounded-lg flex justify-between items-center group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-black text-primary">{p.name}</p>
                          <p className="text-[10px] font-bold text-tertiary">${p.price.toLocaleString('es-CO')}</p>
                        </div>
                        <Plus className="w-4 h-4 text-tertiary group-hover:text-primary" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3 mt-4">
                {orderItems.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-outline/10 rounded-xl">
                    <p className="text-xs font-bold text-tertiary">No hay productos en el pedido</p>
                  </div>
                ) : (
                  orderItems.map(item => (
                    <div key={item.product.id} className="flex justify-between items-center p-3 bg-surface-dim border border-outline/5 rounded-xl">
                      <div className="flex-1">
                        <p className="text-sm font-black text-primary truncate max-w-[200px]">{item.product.name}</p>
                        <p className="text-[10px] font-bold text-tertiary">${item.product.price.toLocaleString('es-CO')}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-surface border border-outline/10 rounded-lg">
                          <button 
                            type="button"
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-tertiary hover:text-primary font-black"
                          >-</button>
                          <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                          <button 
                            type="button"
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-tertiary hover:text-primary font-black"
                          >+</button>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleRemoveProduct(item.product.id)}
                          className="w-8 h-8 flex items-center justify-center text-error/50 hover:text-error bg-error/5 hover:bg-error/10 rounded-lg transition-colors"
                          title="Eliminar producto"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="p-8 border-t border-outline/5 bg-surface-dim/30 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold text-tertiary uppercase tracking-widest">
              <span>Subtotal</span>
              <span className="text-primary font-black">${subtotal.toLocaleString('es-CO')}</span>
            </div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
              <span className="text-tertiary">Envío (Gratis &gt; 50K)</span>
              <span className={deliveryFee === 0 && subtotal > 0 ? "text-tertiary-fixed font-black" : "text-primary font-black"}>
                {deliveryFee === 0 && subtotal > 0 ? "GRATIS" : `$${deliveryFee.toLocaleString('es-CO')}`}
              </span>
            </div>
            <div className="pt-4 border-t border-outline/10 flex justify-between items-end">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Total</span>
              <span className="text-4xl font-black text-primary tracking-tighter">${total.toLocaleString('es-CO')}</span>
            </div>
          </div>
          <button 
            type="submit"
            form="order-form"
            className="w-full py-4 bg-primary text-white font-black rounded-xl shadow-xl shadow-primary/20 hover:bg-primary/95 transition-all text-xs uppercase tracking-widest active:scale-95"
          >
            Confirmar Pedido
          </button>
        </div>
      </aside>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { Search, Bell, UserCircle, PlusCircle, Users, Mail, Phone, MapPin, X, ShoppingBag, CreditCard, Calendar } from 'lucide-react';
import { Order } from '../types/order';
import { Customer } from '../types/customer';

interface CustomerManagementProps {
  orders: Order[];
}

export function CustomerManagement({ orders }: CustomerManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const customers = useMemo(() => {
    const customerMap = new Map<string, Customer>();

    orders.forEach(order => {
      // Use phone as the unique identifier. Fallback to name if phone is missing.
      const id = order.buyer.phone || order.buyer.name;
      
      if (!customerMap.has(id)) {
        customerMap.set(id, {
          id,
          name: order.buyer.name,
          phone: order.buyer.phone,
          address: order.buyer.address,
          totalPurchases: 0,
          orderCount: 0,
          lastOrderDate: order.createdAt,
          history: []
        });
      }

      const customer = customerMap.get(id)!;
      customer.history.push(order);
      customer.totalPurchases += order.total;
      customer.orderCount += 1;
      
      const orderDate = new Date(order.createdAt);
      const lastDate = new Date(customer.lastOrderDate);
      if (orderDate > lastDate) {
        customer.lastOrderDate = order.createdAt;
      }
    });

    return Array.from(customerMap.values())
      .sort((a, b) => b.totalPurchases - a.totalPurchases);
  }, [orders]);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const totalCustomers = customers.length;
  // A high value customer could be one with >= $100k or >1 order
  const recurringCustomers = customers.filter(c => c.orderCount > 1).length;
  const retentionRate = totalCustomers > 0 ? Math.round((recurringCustomers / totalCustomers) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 right-0 left-64 h-20 bg-surface-container/90 backdrop-blur-xl z-30 flex justify-between items-center px-12 border-b border-outline/10">
        <div className="flex items-center gap-6">
          <h2 className="font-bold text-2xl text-primary tracking-tighter">Gestión de Clientes</h2>
          <div className="h-6 w-px bg-outline/20"></div>
          <span className="text-[10px] font-bold text-secondary tracking-[0.2em] uppercase">Vanguard Nexus</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="relative flex items-center group">
            <Search className="absolute left-4 text-outline w-4 h-4 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar clientes por nombre o teléfono..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-2.5 bg-white border border-outline/10 rounded-xl focus:ring-2 focus:ring-primary/5 text-sm w-72 transition-all outline-none font-medium text-primary shadow-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <button title="Notificaciones" className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-all text-secondary border border-outline/5">
              <Bell className="w-5 h-5" />
            </button>
            <button title="Perfil de Usuario" className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-all text-secondary border border-outline/5">
              <UserCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="pt-32 px-12 pb-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h3 className="text-4xl font-black text-primary tracking-tighter">Directorio de Clientes</h3>
            <p className="text-secondary mt-3 max-w-lg text-sm font-medium leading-relaxed">Gestione las relaciones con sus clientes y visualice su historial de interacción. Generado automáticamente desde los pedidos.</p>
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="bg-surface-container-low rounded-[32px] p-12 text-center border border-outline/5 mb-16">
            <UserCircle className="w-16 h-16 text-outline/30 mx-auto mb-4" />
            <h4 className="text-xl font-black text-primary mb-2">No hay clientes aún</h4>
            <p className="text-secondary text-sm">Los clientes se crearán automáticamente a medida que agregues pedidos en el módulo de ventas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-outline/10 hover:shadow-xl transition-all group flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center border border-outline/5 flex-shrink-0">
                    <UserCircle className="w-8 h-8 text-primary" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-black text-primary text-lg truncate" title={customer.name}>{customer.name}</h4>
                    <p className="text-[10px] font-black text-tertiary uppercase tracking-widest">{customer.orderCount} Pedido{customer.orderCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="space-y-3 flex-grow mb-6">
                  <div className="flex items-center gap-3 text-secondary text-sm">
                    <Phone className="w-4 h-4 text-tertiary" />
                    <span className="font-medium truncate">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-secondary text-sm">
                    <MapPin className="w-4 h-4 text-tertiary" />
                    <span className="font-medium truncate">{customer.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-secondary text-sm">
                    <ShoppingBag className="w-4 h-4 text-tertiary" />
                    <span className="font-black text-primary">${customer.totalPurchases.toLocaleString('es-CO')}</span>
                  </div>
                </div>
                <button 
                  title="Ver Perfil Detallado" 
                  onClick={() => setSelectedCustomer(customer)}
                  className="w-full mt-auto py-3 bg-surface-container-high rounded-xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all"
                >
                  Ver Detalles
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="bg-primary p-12 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-primary/20 relative overflow-hidden">
            <div className="relative z-10">
                <h4 className="text-3xl font-black mb-4 tracking-tighter text-white">Segmentación Avanzada</h4>
                <p className="text-white/60 text-sm max-w-md font-medium">Analice el comportamiento de sus clientes para crear campañas de fidelización más efectivas.</p>
            </div>
            <div className="flex items-center gap-8 relative z-10 mt-8 md:mt-0">
                <div className="text-center">
                    <div className="text-4xl font-black text-white">{totalCustomers}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">Totales</div>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-black text-tertiary-fixed">{retentionRate}%</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">Retención</div>
                </div>
            </div>
            <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none bg-[radial-gradient(circle_at_top_right,var(--color-tertiary-fixed),transparent_70%)]"></div>
        </div>
      </div>

      {/* Customer Detail Drawer */}
      <div className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-all duration-500 ${selectedCustomer ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute right-0 top-0 bottom-0 w-[600px] bg-background shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${selectedCustomer ? 'translate-x-0' : 'translate-x-full'}`}>
          {selectedCustomer && (
            <div className="flex flex-col h-full">
              <div className="p-8 border-b border-outline/10 flex justify-between items-center bg-white">
                <div>
                  <h3 className="text-2xl font-black text-primary tracking-tighter">Historial del Cliente</h3>
                  <p className="text-[10px] font-black text-tertiary uppercase tracking-[0.2em] mt-1">{selectedCustomer.name}</p>
                </div>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  title="Cerrar Detalles"
                  aria-label="Cerrar Detalles"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-dim hover:bg-surface-container-high transition-colors text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-surface-container-lowest">
                {/* Customer Summary */}
                <div className="bg-white p-6 rounded-3xl border border-outline/5 shadow-sm">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] font-black text-tertiary uppercase tracking-widest mb-1">Total Comprado</p>
                      <p className="text-2xl font-black text-primary">${selectedCustomer.totalPurchases.toLocaleString('es-CO')}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-tertiary uppercase tracking-widest mb-1">Pedidos Totales</p>
                      <p className="text-2xl font-black text-primary">{selectedCustomer.orderCount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-tertiary uppercase tracking-widest mb-1">Teléfono</p>
                      <p className="text-sm font-bold text-secondary">{selectedCustomer.phone}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-tertiary uppercase tracking-widest mb-1">Dirección</p>
                      <p className="text-sm font-bold text-secondary">{selectedCustomer.address}</p>
                    </div>
                  </div>
                </div>

                {/* Orders History */}
                <div>
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-tertiary" /> Pedidos Anteriores
                  </h4>
                  <div className="space-y-4">
                    {selectedCustomer.history.slice().reverse().map(order => (
                      <div key={order.id} className="bg-white p-6 rounded-[24px] border border-outline/5 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-[10px] font-black text-tertiary uppercase tracking-widest">{order.id}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-3 h-3 text-secondary" />
                              <span className="text-xs font-medium text-secondary">
                                {new Date(order.createdAt).toLocaleDateString('es-CO')}
                              </span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                            order.status === 'Entregado' ? 'bg-[#E8D5B5]/20 text-[#8B7355]' :
                            order.status === 'En Camino' ? 'bg-[#98B8A8]/20 text-[#4A6B5B]' :
                            'bg-surface-container-high text-secondary'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          {order.items.map(item => (
                            <div key={item.product.id} className="flex justify-between items-center text-sm">
                              <span className="font-medium text-primary">
                                <span className="font-bold text-tertiary mr-2">{item.quantity}x</span>
                                {item.product.name}
                              </span>
                              <span className="font-bold text-primary">${(item.quantity * item.product.price).toLocaleString('es-CO')}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="pt-4 border-t border-outline/5 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-tertiary" />
                            <span className="text-xs font-bold text-secondary">{order.paymentMethod || 'Efectivo'}</span>
                          </div>
                          <span className="text-lg font-black text-primary">${order.total.toLocaleString('es-CO')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

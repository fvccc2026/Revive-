import React, { useState, useMemo } from 'react';
import { Search, Settings, Filter, Plus, TrendingUp, Edit2, Trash2, Eye, EyeOff, Package, Database, Activity, ArrowDownToLine, ArrowUpFromLine, X } from 'lucide-react';
import { Product } from '../types/product';
import { InventoryMovement, RawMaterial, MovementType } from '../types/inventory';

interface ProductCatalogProps {
  products: Product[];
  movements: InventoryMovement[];
  setMovements: (m: InventoryMovement[]) => void;
  rawMaterials: RawMaterial[];
  setRawMaterials: (r: RawMaterial[]) => void;
  onNewProduct: () => void;
  onEditProduct: (id: number) => void;
  onDeleteProduct: (id: number) => void;
}

type Tab = 'FINISHED' | 'RAW' | 'MOVEMENTS';

export function ProductCatalog({ 
  products, 
  movements, setMovements,
  rawMaterials, setRawMaterials,
  onNewProduct, onEditProduct, onDeleteProduct 
}: ProductCatalogProps) {
  const [activeTab, setActiveTab] = useState<Tab>('FINISHED');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas las Categorías');
  const [showCosts, setShowCosts] = useState(false);

  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showRawMaterialModal, setShowRawMaterialModal] = useState(false);

  const [editingRawMaterial, setEditingRawMaterial] = useState<RawMaterial | null>(null);
  const [editingMovement, setEditingMovement] = useState<InventoryMovement | null>(null);

  const categories = ['Todas las Categorías', ...Array.from(new Set(products.map(p => p.category)))];

  const getProductStock = (productId: number, type: 'RAW' | 'FINISHED', initialStock: number = 0) => {
    const productMovements = movements.filter(m => m.productId === productId && m.itemType === type);
    const stockIn = productMovements.filter(m => m.type === 'STOCK_IN').reduce((sum, m) => sum + m.quantity, 0);
    const stockOut = productMovements.filter(m => ['SALE', 'SAMPLE', 'LOSS'].includes(m.type)).reduce((sum, m) => sum + m.quantity, 0);
    return initialStock + stockIn - stockOut;
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas las Categorías' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      onDeleteProduct(id);
    }
  };

  const handleDeleteRawMaterial = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta materia prima/empaque?')) {
      const api = await import('../lib/api');
      await api.deleteRawMaterial(id.toString());
      setRawMaterials(rawMaterials.filter(rm => rm.id !== id));
    }
  };

  const handleDeleteMovement = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este movimiento?')) {
      const api = await import('../lib/api');
      await api.deleteMovement(id);
      setMovements(movements.filter(m => m.id !== id));
    }
  };

  const totalFinishedGoodsCost = products.reduce((sum, p) => sum + getProductStock(p.id, 'FINISHED', p.initialStock || 0) * p.cost, 0);
  const totalRawMaterialsCost = rawMaterials.reduce((sum, rm) => sum + getProductStock(rm.id, 'RAW', rm.stock) * rm.unitCost, 0);
  const globalInventoryCost = totalFinishedGoodsCost + totalRawMaterialsCost;

  return (
    <div className="min-h-screen bg-background relative pb-20">
      <header className="fixed top-0 right-0 left-64 h-24 bg-surface/90 backdrop-blur-xl z-40 flex flex-col justify-center px-12 border-b border-outline/5 shadow-sm">
        <div className="flex justify-between items-center w-full">
          <div>
            <h2 className="font-black text-2xl tracking-tighter text-primary">Sistema de Inventario</h2>
            <div className="flex gap-6 mt-3">
              <button 
                onClick={() => setActiveTab('FINISHED')}
                className={`text-[11px] font-black uppercase tracking-[0.1em] pb-2 border-b-2 transition-all ${activeTab === 'FINISHED' ? 'border-primary text-primary' : 'border-transparent text-tertiary hover:text-primary'}`}
              >
                <Package className="w-4 h-4 inline-block mr-2" /> Productos Terminados
              </button>
              <button 
                onClick={() => setActiveTab('RAW')}
                className={`text-[11px] font-black uppercase tracking-[0.1em] pb-2 border-b-2 transition-all ${activeTab === 'RAW' ? 'border-primary text-primary' : 'border-transparent text-tertiary hover:text-primary'}`}
              >
                <Database className="w-4 h-4 inline-block mr-2" /> Materias Primas
              </button>
              <button 
                onClick={() => setActiveTab('MOVEMENTS')}
                className={`text-[11px] font-black uppercase tracking-[0.1em] pb-2 border-b-2 transition-all ${activeTab === 'MOVEMENTS' ? 'border-primary text-primary' : 'border-transparent text-tertiary hover:text-primary'}`}
              >
                <Activity className="w-4 h-4 inline-block mr-2" /> Movimientos
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {activeTab === 'FINISHED' && (
              <>
                <button 
                  onClick={() => setShowCosts(!showCosts)}
                  className={`px-6 py-3 rounded-xl font-black text-xs flex items-center gap-3 transition-all active:scale-95 shadow-sm uppercase tracking-widest border ${showCosts ? 'bg-primary text-white border-primary shadow-primary/20' : 'bg-surface text-primary border-outline/10 hover:bg-surface-dim'}`}
                >
                  {showCosts ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  <span>{showCosts ? 'Ocultar Costos' : 'Ver Costos'}</span>
                </button>
                <button 
                  onClick={onNewProduct} 
                  className="bg-primary text-white px-8 py-3 rounded-xl font-black text-xs flex items-center gap-3 hover:bg-primary/95 transition-all active:scale-95 shadow-xl shadow-primary/20 uppercase tracking-widest"
                >
                  <Plus className="w-5 h-5" />
                  <span>Nuevo Producto</span>
                </button>
              </>
            )}
            {activeTab === 'RAW' && (
              <button 
                onClick={() => { setEditingRawMaterial(null); setShowRawMaterialModal(true); }} 
                className="bg-primary text-white px-8 py-3 rounded-xl font-black text-xs flex items-center gap-3 hover:bg-primary/95 transition-all active:scale-95 shadow-xl shadow-primary/20 uppercase tracking-widest"
              >
                <Plus className="w-5 h-5" />
                <span>Nueva Materia Prima</span>
              </button>
            )}
            {activeTab === 'MOVEMENTS' && (
              <button 
                onClick={() => { setEditingMovement(null); setShowMovementModal(true); }} 
                className="bg-primary text-white px-8 py-3 rounded-xl font-black text-xs flex items-center gap-3 hover:bg-primary/95 transition-all active:scale-95 shadow-xl shadow-primary/20 uppercase tracking-widest"
              >
                <Plus className="w-5 h-5" />
                <span>Registrar Movimiento</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="pt-36 px-12 pb-12">
        {activeTab === 'FINISHED' && (
          <div className="bg-surface rounded-[40px] p-12 border border-outline/5 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-primary tracking-tighter">Catálogo de Productos Terminados</h3>
              <div className="bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10 text-right">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 block mb-1">Costo Total Productos Terminados</span>
                <span className="text-xl font-black text-primary">${totalFinishedGoodsCost.toLocaleString('es-CO')} COP</span>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 mb-12 items-end">
              <div className="flex-1">
                <label id="search-label" className="block text-[10px] font-black uppercase tracking-[0.2em] text-tertiary mb-3 ml-1">Buscar Producto</label>
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors w-5 h-5" />
                  <input 
                    type="text" 
                    title="Buscar productos"
                    aria-labelledby="search-label"
                    placeholder="Nombre, SKU..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-background border border-outline/10 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all outline-none text-primary font-bold shadow-sm" 
                  />
                </div>
              </div>
              <div className="w-full md:w-72">
                <label id="category-label" className="block text-[10px] font-black uppercase tracking-[0.2em] text-tertiary mb-3 ml-1">Filtrar por Categoría</label>
                <select 
                  title="Seleccionar categoría"
                  aria-labelledby="category-label"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-6 py-4 bg-background border border-outline/10 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-primary font-bold appearance-none shadow-sm cursor-pointer"
                >
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline/10">
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-tertiary">Nombre</th>
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-tertiary">SKU</th>
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-tertiary">Categoría</th>
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-tertiary">Stock</th>
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-tertiary">Costo Unit.</th>
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-tertiary">Precio Sug.</th>
                    <th className="text-right py-4 text-[10px] font-black uppercase tracking-widest text-tertiary">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => {
                    const stock = getProductStock(product.id, 'FINISHED', product.initialStock || 0);
                    return (
                      <tr key={product.id} className="border-b border-outline/5 hover:bg-surface-dim/50 transition-colors">
                        <td className="py-4 font-bold text-primary">{product.name}</td>
                        <td className="py-4 text-tertiary text-sm">{product.sku}</td>
                        <td className="py-4">
                          <span className="bg-surface-dim px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-secondary">{product.category}</span>
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${stock <= 10 ? 'bg-error/10 text-error' : 'bg-success/10 text-success'}`}>
                            {stock} und
                          </span>
                        </td>
                        <td className="py-4 font-bold text-primary">{showCosts ? `$${product.cost.toLocaleString('es-CO')}` : '****'}</td>
                        <td className="py-4 font-bold text-primary">${product.price.toLocaleString('es-CO')}</td>
                        <td className="py-4 text-right">
                          <button onClick={() => onEditProduct(product.id)} className="p-2 text-tertiary hover:text-primary transition-colors" title="Editar"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(product.id)} className="p-2 text-tertiary hover:text-error transition-colors" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'RAW' && (
          <div className="bg-surface rounded-[40px] p-12 border border-outline/5 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-primary tracking-tighter">Directorio de Materias Primas</h3>
              <div className="bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10 text-right">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 block mb-1">Costo Total Materias Primas</span>
                <span className="text-xl font-black text-primary">${totalRawMaterialsCost.toLocaleString('es-CO')} COP</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline/10">
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-tertiary">Nombre</th>
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-tertiary">Categoría</th>
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-tertiary">Stock</th>
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-tertiary">Unidad</th>
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-tertiary">Costo Unitario</th>
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-tertiary">Costo Total Disp.</th>
                    <th className="text-right py-4 text-[10px] font-black uppercase tracking-widest text-tertiary">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rawMaterials.length === 0 ? (
                    <tr><td colSpan={6} className="py-12 text-center text-tertiary font-bold">No hay materias primas ni empaques registrados</td></tr>
                  ) : (
                    rawMaterials.map(rm => {
                      const stock = getProductStock(rm.id, 'RAW', rm.stock);
                      return (
                        <tr key={rm.id} className="border-b border-outline/5 hover:bg-secondary/5 transition-colors">
                          <td className="py-6 font-bold text-primary">{rm.name}</td>
                          <td className="py-6">
                            <span className="bg-surface-dim text-primary text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-outline/5">{rm.category}</span>
                          </td>
                          <td className="py-6 font-black text-primary">{stock}</td>
                          <td className="py-6 text-tertiary">{rm.unit}</td>
                          <td className="py-6 font-bold">${rm.unitCost.toLocaleString('es-CO')}</td>
                          <td className="py-6 font-black text-primary">${(stock * rm.unitCost).toLocaleString('es-CO')}</td>
                          <td className="py-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => { setEditingRawMaterial(rm); setShowRawMaterialModal(true); }} title="Editar" className="w-8 h-8 rounded-lg bg-surface-dim flex items-center justify-center text-primary hover:bg-surface"><Edit2 className="w-4 h-4" /></button>
                              <button onClick={() => handleDeleteRawMaterial(rm.id)} title="Eliminar" className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center text-error hover:bg-error/20"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'MOVEMENTS' && (
          <div className="bg-surface rounded-[40px] p-12 border border-outline/5 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-primary tracking-tighter">Historial de Movimientos</h3>
              <div className="bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10 text-right">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 block mb-1">Valor Total del Inventario</span>
                <span className="text-xl font-black text-primary">${globalInventoryCost.toLocaleString('es-CO')} COP</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline/10">
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-tertiary">Fecha</th>
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-tertiary">Tipo</th>
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-tertiary">Ítem</th>
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-tertiary">Producto/Insumo</th>
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-tertiary">Cantidad</th>
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-tertiary">Ref/Notas</th>
                    <th className="text-right py-4 text-[10px] font-black uppercase tracking-widest text-tertiary">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.length === 0 ? (
                    <tr><td colSpan={6} className="py-12 text-center text-tertiary font-bold">No hay movimientos registrados</td></tr>
                  ) : (
                    [...movements].reverse().map(m => {
                      const itemData = m.itemType === 'FINISHED' 
                        ? products.find(p => p.id === m.productId)?.name 
                        : rawMaterials.find(r => r.id === m.productId)?.name;
                      
                      const isEntry = m.type === 'STOCK_IN';
                      
                      return (
                        <tr key={m.id} className="border-b border-outline/5 hover:bg-secondary/5 transition-colors">
                          <td className="py-6 font-bold text-tertiary">{new Date(m.date).toLocaleDateString()}</td>
                          <td className="py-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${isEntry ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'}`}>
                              {isEntry ? <ArrowDownToLine className="w-3 h-3" /> : <ArrowUpFromLine className="w-3 h-3" />}
                              {m.type === 'STOCK_IN' ? 'Entrada' : m.type === 'SALE' ? 'Venta' : m.type === 'SAMPLE' ? 'Muestra' : 'Avería'}
                            </span>
                          </td>
                          <td className="py-6 text-[10px] font-black text-tertiary uppercase">{m.itemType === 'FINISHED' ? 'Terminado' : 'Materia P.'}</td>
                          <td className="py-6 font-bold text-primary">{itemData || 'Desconocido'}</td>
                          <td className={`py-6 font-black ${isEntry ? 'text-secondary' : 'text-error'}`}>{isEntry ? '+' : '-'}{m.quantity}</td>
                          <td className="py-6 text-sm text-tertiary">{m.reference || m.notes || '-'}</td>
                          <td className="py-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => { setEditingMovement(m); setShowMovementModal(true); }} title="Editar" className="w-8 h-8 rounded-lg bg-surface-dim flex items-center justify-center text-primary hover:bg-surface"><Edit2 className="w-4 h-4" /></button>
                              <button onClick={() => handleDeleteMovement(m.id)} title="Eliminar" className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center text-error hover:bg-error/20"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Raw Material Modal */}
      {showRawMaterialModal && (
        <RawMaterialModal 
          editingItem={editingRawMaterial || undefined}
          onClose={() => { setShowRawMaterialModal(false); setEditingRawMaterial(null); }}
          onSave={async (rm) => {
            const api = await import('../lib/api');
            if (editingRawMaterial) {
              await api.updateRawMaterial({ ...rm, id: editingRawMaterial.id });
              setRawMaterials(rawMaterials.map(r => r.id === editingRawMaterial.id ? { ...rm, id: r.id } : r));
            } else {
              const newRm = await api.createRawMaterial(rm as any);
              if (newRm) setRawMaterials([...rawMaterials, newRm]);
              else setRawMaterials([...rawMaterials, { ...rm, id: Date.now() }]);
            }
            setShowRawMaterialModal(false);
            setEditingRawMaterial(null);
          }}
        />
      )}

      {/* Movement Modal */}
      {showMovementModal && (
        <MovementModal 
          editingItem={editingMovement || undefined}
          products={products}
          rawMaterials={rawMaterials}
          onClose={() => { setShowMovementModal(false); setEditingMovement(null); }}
          onSave={async (mov) => {
            const api = await import('../lib/api');
            if (editingMovement) {
              const dbMov = {
                id: editingMovement.id,
                itemId: mov.productId.toString(),
                itemType: mov.itemType === 'FINISHED' ? 'product' : 'raw_material',
                type: mov.type === 'STOCK_IN' ? 'in' : 'out',
                quantity: mov.quantity,
                date: mov.date,
                reason: mov.type,
                notes: mov.notes,
                referenceId: mov.reference
              };
              await api.updateMovement(dbMov as any);
              setMovements(movements.map(m => m.id === editingMovement.id ? { ...mov, id: m.id } : m));
            } else {
              const id = Date.now().toString();
              const dbMov = {
                id,
                itemId: mov.productId.toString(),
                itemType: mov.itemType === 'FINISHED' ? 'product' : 'raw_material',
                type: mov.type === 'STOCK_IN' ? 'in' : 'out',
                quantity: mov.quantity,
                date: mov.date,
                reason: mov.type,
                notes: mov.notes,
                referenceId: mov.reference
              };
              await api.createMovementsBatch([dbMov as any]);
              setMovements([...movements, { ...mov, id }]);
            }
            setShowMovementModal(false);
            setEditingMovement(null);
          }}
        />
      )}
    </div>
  );
}

function RawMaterialModal({ editingItem, onClose, onSave }: { editingItem?: RawMaterial, onClose: () => void, onSave: (r: Omit<RawMaterial, 'id'>) => void }) {
  const [formData, setFormData] = useState<{name: string, category: 'MATERIA PRIMA' | 'ENVASES Y EMPAQUES', unit: string, unitCost: number, stock: number}>({ 
    name: editingItem?.name || '', 
    category: editingItem?.category || 'MATERIA PRIMA', 
    unit: editingItem?.unit || 'g', 
    unitCost: editingItem?.unitCost || 0, 
    stock: editingItem?.stock || 0 
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
      <div className="bg-surface rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl border border-outline/10">
        <div className="p-8 border-b border-outline/10 flex justify-between items-center bg-white">
          <h3 className="text-2xl font-black text-primary tracking-tighter">Nueva Materia Prima / Empaque</h3>
          <button onClick={onClose} title="Cerrar" aria-label="Cerrar" className="w-10 h-10 rounded-full bg-surface-dim flex items-center justify-center text-primary"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-tertiary mb-3 ml-1">Nombre</label>
              <input type="text" placeholder="Ej: Avena, Frascos..." title="Nombre" aria-label="Nombre del Insumo" className="w-full px-6 py-4 bg-surface border border-outline/10 rounded-2xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-tertiary mb-3 ml-1">Categoría</label>
              <select title="Categoría" aria-label="Categoría" className="w-full px-6 py-4 bg-surface border border-outline/10 rounded-2xl" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                <option value="MATERIA PRIMA">Materia Prima</option>
                <option value="ENVASES Y EMPAQUES">Envases y Empaques</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-tertiary mb-3 ml-1">Unidad Medida</label>
              <select title="Unidad Medida" aria-label="Unidad Medida" className="w-full px-6 py-4 bg-surface border border-outline/10 rounded-2xl" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                <option value="g">Gramos (g)</option>
                <option value="kg">Kilogramos (kg)</option>
                <option value="ml">Mililitros (ml)</option>
                <option value="L">Litros (L)</option>
                <option value="und">Unidades</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-tertiary mb-3 ml-1">Stock Inicial</label>
              <input type="number" placeholder="Ej: 100" title="Stock Inicial" aria-label="Stock Inicial" className="w-full px-6 py-4 bg-surface border border-outline/10 rounded-2xl" value={formData.stock || ''} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-tertiary mb-3 ml-1">Costo por Unidad ($)</label>
            <input type="number" placeholder="Ej: 50" title="Costo por Unidad" aria-label="Costo por Unidad" className="w-full px-6 py-4 bg-surface border border-outline/10 rounded-2xl" value={formData.unitCost || ''} onChange={e => setFormData({...formData, unitCost: Number(e.target.value)})} />
          </div>
          <button onClick={() => onSave({...formData, totalCost: formData.stock * formData.unitCost})} className="w-full py-4 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-colors mt-4">Guardar Insumo / Empaque</button>
        </div>
      </div>
    </div>
  );
}

function MovementModal({ editingItem, products, rawMaterials, onClose, onSave }: { editingItem?: InventoryMovement, products: Product[], rawMaterials: RawMaterial[], onClose: () => void, onSave: (m: Omit<InventoryMovement, 'id'>) => void }) {
  const [formData, setFormData] = useState({
    itemType: editingItem?.itemType || ('FINISHED' as 'RAW'|'FINISHED'),
    productId: editingItem?.productId ? String(editingItem.productId) : '',
    type: editingItem?.type || ('STOCK_IN' as MovementType),
    quantity: editingItem?.quantity || 0,
    reference: editingItem?.reference || '',
    notes: editingItem?.notes || ''
  });

  const itemsList = formData.itemType === 'FINISHED' ? products : rawMaterials;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
      <div className="bg-surface rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl border border-outline/10">
        <div className="p-8 border-b border-outline/10 flex justify-between items-center bg-white">
          <h3 className="text-2xl font-black text-primary tracking-tighter">Registrar Movimiento</h3>
          <button onClick={onClose} title="Cerrar" aria-label="Cerrar" className="w-10 h-10 rounded-full bg-surface-dim flex items-center justify-center text-primary"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-tertiary mb-3 ml-1">Clase de Ítem</label>
              <select title="Clase de Ítem" aria-label="Clase de Ítem" className="w-full px-6 py-4 bg-surface border border-outline/10 rounded-2xl" value={formData.itemType} onChange={e => setFormData({...formData, itemType: e.target.value as any, productId: ''})}>
                <option value="FINISHED">Prod. Terminado</option>
                <option value="RAW">Materia Prima</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-tertiary mb-3 ml-1">Tipo de Movimiento</label>
              <select title="Tipo de Movimiento" aria-label="Tipo de Movimiento" className="w-full px-6 py-4 bg-surface border border-outline/10 rounded-2xl" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                <option value="STOCK_IN">Entrada (Compra/Prod)</option>
                <option value="SAMPLE">Salida (Muestra)</option>
                <option value="LOSS">Salida (Avería/Pérdida)</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-tertiary mb-3 ml-1">Seleccionar Ítem</label>
            <select title="Seleccionar Ítem" aria-label="Seleccionar Ítem" className="w-full px-6 py-4 bg-surface border border-outline/10 rounded-2xl" value={formData.productId} onChange={e => setFormData({...formData, productId: e.target.value})}>
              <option value="">Seleccione...</option>
              {itemsList.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-tertiary mb-3 ml-1">Cantidad</label>
              <input type="number" placeholder="Ej: 5" title="Cantidad" aria-label="Cantidad" className="w-full px-6 py-4 bg-surface border border-outline/10 rounded-2xl" value={formData.quantity || ''} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-tertiary mb-3 ml-1">Referencia (Opcional)</label>
              <input type="text" placeholder="Ej: OC-1024" title="Referencia" aria-label="Referencia" className="w-full px-6 py-4 bg-surface border border-outline/10 rounded-2xl" value={formData.reference} onChange={e => setFormData({...formData, reference: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-tertiary mb-3 ml-1">Notas Adicionales</label>
            <textarea placeholder="Observaciones..." title="Notas" aria-label="Notas Adicionales" className="w-full px-6 py-4 bg-surface border border-outline/10 rounded-2xl resize-none h-24" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
          </div>

          <button 
            disabled={!formData.productId || formData.quantity <= 0}
            onClick={() => onSave({
              ...formData, 
              date: editingItem?.date || new Date().toISOString(), 
              productId: Number(formData.productId)
            })} 
            className="w-full py-4 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-colors disabled:opacity-50 mt-4"
          >
            Guardar Movimiento
          </button>
        </div>
      </div>
    </div>
  );
}

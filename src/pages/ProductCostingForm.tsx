import React, { useState, useEffect } from 'react';
import { ArrowLeft, PlusCircle, DollarSign, TrendingUp, ArrowUpRight, X, Image as ImageIcon } from 'lucide-react';
import { Product, CostBreakdown } from '../types/product';

interface ProductCostingFormProps {
  product: Product | null | undefined;
  categories: string[];
  onSave: (p: Product) => void;
  onCancel: () => void;
}

export function ProductCostingForm({ product, categories, onSave, onCancel }: ProductCostingFormProps) {
  const [name, setName] = useState(product?.name || '');
  const [sku, setSku] = useState(product?.sku || '');
  const [category, setCategory] = useState(product?.category || '');
  const [image, setImage] = useState(product?.image || '');
  const [price, setPrice] = useState(product?.price || 0);
  const [initialStock, setInitialStock] = useState(product?.initialStock || 0);
  
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown[]>(
    product?.costBreakdown || [{ id: Date.now().toString(), label: 'Costo Base', value: product?.cost || 0 }]
  );

  const [showCosts, setShowCosts] = useState(false);
  const totalCost = costBreakdown.reduce((sum, item) => sum + item.value, 0);
  const margin = price > 0 ? Number((((price - totalCost) / price) * 100).toFixed(1)) : 0;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCostItem = () => {
    setCostBreakdown([
      ...costBreakdown,
      { id: Date.now().toString(), label: 'Nuevo Concepto', value: 0 }
    ]);
  };

  const handleUpdateCostItem = (id: string, field: 'label' | 'value', value: string | number) => {
    setCostBreakdown(costBreakdown.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleRemoveCostItem = (id: string) => {
    setCostBreakdown(costBreakdown.filter(item => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: product?.id || Date.now(),
      name,
      sku,
      category,
      image: image || '/placeholder.png',
      price,
      cost: totalCost,
      margin,
      costBreakdown,
      initialStock
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 right-0 left-64 h-20 bg-surface/90 backdrop-blur-xl z-40 flex justify-between items-center px-12 border-b border-outline/5">
        <div className="flex items-center gap-4">
          <button 
            title="Regresar al Catálogo"
            onClick={onCancel} 
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-dim transition-all text-primary border border-outline/10 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-black text-2xl tracking-tighter text-primary">{product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <p className="text-[10px] font-black text-tertiary uppercase tracking-[0.2em] mt-0.5">Calculadora de Costos</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={handleSubmit}
            title="Finalizar y Publicar"
            className="bg-primary text-white px-8 py-2.5 rounded-xl font-black text-xs hover:bg-primary/95 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest"
          >
            Finalizar Producto
          </button>
        </div>
      </header>

      <div className="pt-32 px-12 pb-12">
        <form id="costing-form" onSubmit={handleSubmit} className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-8 space-y-10">
            <section className="bg-surface p-10 rounded-[40px] border border-outline/5 shadow-sm">
              <h3 className="text-xl font-black text-primary mb-8 tracking-tighter flex items-center gap-3">
                <div className="w-2 h-8 bg-tertiary rounded-full"></div>
                Información del Producto
              </h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2">
                  <label id="product-name-label" className="block text-[10px] font-black uppercase tracking-[0.2em] text-tertiary mb-3 ml-1">Nombre Comercial</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ej. Parfait Premium" 
                    className="w-full px-6 py-4.5 bg-background border border-outline/10 rounded-2xl focus:ring-4 focus:ring-primary/5 outline-none text-primary font-bold transition-all" 
                  />
                </div>
                <div>
                  <label id="sku-label" className="block text-[10px] font-black uppercase tracking-[0.2em] text-tertiary mb-3 ml-1">SKU / Identificador</label>
                  <input 
                    type="text" 
                    required
                    value={sku}
                    onChange={e => setSku(e.target.value)}
                    placeholder="REV-000-XX" 
                    className="w-full px-6 py-4.5 bg-background border border-outline/10 rounded-2xl focus:ring-4 focus:ring-primary/5 outline-none text-primary font-bold transition-all" 
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label id="category-select-label" className="block text-[10px] font-black uppercase tracking-[0.2em] text-tertiary mb-3 ml-1">Categoría Maestra</label>
                  <input 
                    type="text"
                    required
                    list="category-options"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    placeholder="Escribe o selecciona..."
                    className="w-full px-6 py-4.5 bg-background border border-outline/10 rounded-2xl focus:ring-4 focus:ring-primary/5 outline-none text-primary font-bold transition-all"
                  />
                  <datalist id="category-options">
                    {categories.filter(c => c !== 'Todas las Categorías').map(c => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label id="stock-label" className="block text-[10px] font-black uppercase tracking-[0.2em] text-tertiary mb-3 ml-1">Stock Inicial</label>
                  <input 
                    type="number" 
                    value={initialStock || ''}
                    onChange={e => setInitialStock(Number(e.target.value))}
                    placeholder="Ej. 100" 
                    className="w-full px-6 py-4.5 bg-background border border-outline/10 rounded-2xl focus:ring-4 focus:ring-primary/5 outline-none text-primary font-bold transition-all" 
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-tertiary mb-3 ml-1">Fotografía del Producto (URL o Archivo)</label>
                  <div className="flex flex-col gap-4">
                    <div className="relative group">
                      <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                      <input 
                        type="text"
                        value={image}
                        onChange={e => setImage(e.target.value)}
                        placeholder="Ruta manual (ej. /Mermelada de Fresa.PNG)"
                        className="w-full pl-14 pr-6 py-4.5 bg-background border border-outline/10 rounded-2xl focus:ring-4 focus:ring-primary/5 outline-none text-primary font-bold transition-all"
                      />
                    </div>
                    <div className="flex gap-6 items-center">
                      {image ? (
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-background border border-outline/10 flex-shrink-0 relative group/img">
                          <img src={image} alt="Vista previa" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            title="Eliminar imagen"
                            onClick={() => setImage('')}
                            className="absolute inset-0 bg-error/80 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity backdrop-blur-sm"
                          >
                            <X className="w-6 h-6" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-background border border-outline/10 flex items-center justify-center flex-shrink-0 border-dashed">
                          <ImageIcon className="w-8 h-8 text-outline/50" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="relative group cursor-pointer">
                          <input 
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            title="Buscar imagen"
                          />
                          <div className="w-full px-6 py-4.5 bg-background border border-outline/10 rounded-2xl group-hover:border-primary/20 text-primary font-bold transition-all flex items-center justify-center gap-3 group-hover:bg-surface-dim shadow-sm">
                            <ImageIcon className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                            <span>Haz clic para buscar imagen en tu PC</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-surface p-10 rounded-[40px] border border-outline/5 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-primary tracking-tighter flex items-center gap-3">
                  <div className="w-2 h-8 bg-secondary rounded-full"></div>
                  Desglose de Costos
                </h3>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setShowCosts(!showCosts)}
                    className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:text-primary/80 transition-colors bg-outline/5 px-4 py-2 rounded-xl"
                  >
                    {showCosts ? 'Ocultar Costos' : 'Ver Costos de Producto'}
                  </button>
                  {showCosts && (
                    <button 
                      type="button"
                      onClick={handleAddCostItem}
                      className="flex items-center gap-2 text-[10px] font-black text-secondary uppercase tracking-[0.2em] hover:text-primary transition-colors bg-secondary/10 px-4 py-2 rounded-xl"
                    >
                      <PlusCircle className="w-4 h-4" /> Añadir Concepto
                    </button>
                  )}
                </div>
              </div>
              
              {showCosts && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  {costBreakdown.map((cost, idx) => (
                    <div key={cost.id} className="flex items-center justify-between p-6 bg-background rounded-3xl border border-outline/5 transition-all hover:border-outline/20 group">
                      <div className="flex items-center gap-5 flex-1">
                        <div className={`w-12 h-12 bg-surface-dim border border-outline/10 rounded-2xl flex items-center justify-center shadow-sm`}>
                          <DollarSign className="text-primary w-5 h-5" />
                        </div>
                        <div className="flex-1 max-w-sm">
                          <input 
                            type="text"
                            value={cost.label}
                            onChange={e => handleUpdateCostItem(cost.id, 'label', e.target.value)}
                            placeholder="Nombre del Concepto"
                            className="font-bold text-primary text-sm tracking-tight w-full bg-transparent border-b-2 border-transparent focus:border-primary/20 outline-none px-2 py-1 transition-colors"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                         <input 
                          type="number" 
                          value={cost.value || ''}
                          onChange={e => handleUpdateCostItem(cost.id, 'value', Number(e.target.value))}
                          placeholder="0"
                          title="Valor del costo"
                          aria-label="Valor del costo"
                          className="w-32 text-right bg-transparent border-b-2 border-outline/10 focus:border-primary outline-none py-1 font-black text-xl text-primary transition-all" 
                         />
                         <button 
                          type="button"
                          onClick={() => handleRemoveCostItem(cost.id)}
                          title="Eliminar concepto de costo"
                          aria-label="Eliminar concepto de costo"
                          className="w-10 h-10 rounded-xl hover:bg-error/10 text-outline hover:text-error transition-all flex items-center justify-center"
                         >
                          <X className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="bg-primary text-white p-10 rounded-[40px] shadow-2xl shadow-primary/30 relative overflow-hidden">
                <div className="relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-tertiary-fixed mb-10 inline-block bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md">Análisis de Rentabilidad</span>
                  
                  <div className="mb-12">
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Costo Total Unitario</p>
                    <h4 className="text-5xl font-black tracking-tighter">{showCosts ? `$${totalCost.toLocaleString('es-CO')}` : '****'}</h4>
                  </div>

                  <div className="space-y-6 mb-12">
                    <div className="flex justify-between items-end border-b border-white/20 pb-4">
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Precio Venta</p>
                      <input 
                        type="number"
                        value={price || ''}
                        onChange={e => setPrice(Number(e.target.value))}
                        className="w-32 text-right bg-transparent outline-none font-black text-2xl text-tertiary-fixed"
                        placeholder="0"
                      />
                    </div>
                    {showCosts ? (
                      <>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <style>{`.progress-dynamic-width { width: ${Math.min(Math.max(margin, 0), 100)}%; }`}</style>
                          <div 
                            className={`progress-dynamic-width h-full shadow-[0_0_15px_rgba(232,213,181,0.5)] transition-all ${margin > 0 ? 'bg-tertiary-fixed' : 'bg-error'}`}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-xs font-bold">
                           <span className="text-white/30 tracking-widest uppercase">Punto Equilibrio: ${totalCost.toLocaleString('es-CO')}</span>
                           <span className={`${margin >= 0 ? 'text-tertiary-fixed' : 'text-error'} tracking-widest uppercase`}>Margen: {margin}%</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-white/30 tracking-widest uppercase">Punto Equilibrio: ****</span>
                        <span className="text-white/30 tracking-widest uppercase">Margen: ****</span>
                      </div>
                    )}
                  </div>

                  <button 
                    type="button"
                    className="w-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    <TrendingUp className="w-4 h-4 text-tertiary-fixed" />
                    Optimizar con GenAI
                  </button>
                </div>
                
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-tertiary-fixed/10 blur-[80px] rounded-full"></div>
              </div>

              <div className="bg-surface border border-outline/5 p-10 rounded-[40px] shadow-sm">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-tertiary mb-6">Trazabilidad de Proyección</h4>
                <div className="space-y-6">
                   <div className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-3 h-3 rounded-full bg-secondary"></div>
                      <p className="text-xs font-bold text-primary flex-1 group-hover:translate-x-1 transition-transform">Simulación de Escenarios</p>
                      <ArrowUpRight className="w-4 h-4 text-outline" />
                   </div>
                   <div className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                      <p className="text-xs font-bold text-primary flex-1 group-hover:translate-x-1 transition-transform">Análisis Impositivo</p>
                      <ArrowUpRight className="w-4 h-4 text-outline" />
                   </div>
                </div>
                
                <div className="mt-10 pt-10 border-t border-outline/5">
                   <div className="p-6 bg-background rounded-3xl border border-outline/5 relative overflow-hidden">
                      <p className="text-[9px] font-black text-tertiary uppercase tracking-widest mb-2">Estado del Costeo</p>
                      <div className="flex items-center gap-3">
                         <div className={`w-3 h-3 rounded-full animate-pulse shadow-sm ${margin > 30 ? 'bg-emerald-500 shadow-emerald-500/50' : margin > 0 ? 'bg-yellow-500 shadow-yellow-500/50' : 'bg-error shadow-error/50'}`}></div>
                         <p className="text-sm font-black text-primary">
                           {margin > 30 ? 'Margen Saludable' : margin > 0 ? 'Margen Ajustado' : 'Pérdida Detectada'}
                         </p>
                      </div>
                      <div className="absolute right-0 top-0 h-full w-24 bg-linear-to-l from-emerald-50/50 to-transparent opacity-50"></div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

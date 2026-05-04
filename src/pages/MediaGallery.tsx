import React, { useState } from 'react';
import { Search, Bell, Settings, Filter, CloudUpload, Eye, Download, ImagePlus, Package } from 'lucide-react';
import { Product } from '../types/product';

interface MediaGalleryProps {
  products?: Product[];
}

export function MediaGallery({ products = [] }: MediaGalleryProps) {
  const [search, setSearch] = useState('');

  // Filtrar productos que tengan imagen válida (descartar imágenes por defecto)
  const productsWithImages = products.filter(p => 
    p.image && 
    !p.image.includes('placeholder.com') &&
    p.image.trim() !== ''
  );

  const filteredImages = productsWithImages.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 right-0 left-64 h-20 bg-surface-container/90 backdrop-blur-xl z-40 flex justify-between items-center px-12 border-b border-outline/10">
        <div className="flex items-center gap-6">
          <h2 className="font-bold text-2xl text-primary tracking-tighter">Galería de Productos</h2>
          <div className="h-6 w-px bg-outline/20"></div>
          <span className="text-[10px] font-bold text-secondary tracking-[0.2em] uppercase">Recursos Visuales</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o categoría..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-6 py-2.5 bg-white border border-outline/10 rounded-xl focus:ring-2 focus:ring-primary/5 text-sm w-72 transition-all outline-none font-medium text-primary shadow-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-all text-secondary border border-outline/5" aria-label="Notificaciones" title="Notificaciones">
              <Bell className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-all text-secondary border border-outline/5" aria-label="Configuración" title="Configuración">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="pt-32 px-12 pb-20">
        <section className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-on-tertiary-fixed mb-3 block">Visual Assets Catalog</span>
            <h1 className="text-5xl font-black tracking-tighter text-primary mb-5">Media de Inventario</h1>
            <p className="text-secondary text-sm font-medium leading-relaxed max-w-xl">
              Imágenes extraídas automáticamente del inventario de productos terminados. 
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-8 py-4 rounded-xl font-black text-primary flex items-center gap-3 bg-white border border-outline/10 shadow-sm hover:bg-surface-container-low transition-all text-xs uppercase tracking-widest">
              <Filter className="w-5 h-5" />
              Filtrar
            </button>
            <button className="bg-primary text-white px-8 py-4 rounded-xl font-black flex items-center gap-3 shadow-xl shadow-primary/20 hover:bg-primary/95 transition-all active:scale-95 text-xs uppercase tracking-widest">
              <CloudUpload className="w-5 h-5" />
              Subir Imagen
            </button>
          </div>
        </section>

        {filteredImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-surface rounded-3xl border border-outline/5 shadow-sm text-tertiary">
            <ImagePlus className="w-16 h-16 mb-4 text-outline/30" />
            <p className="font-bold text-lg">No hay imágenes disponibles</p>
            <p className="text-sm">Agrega fotos a tus productos en el inventario.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredImages.map(product => (
              <div key={product.id} className="group relative overflow-hidden rounded-3xl bg-surface-container-low shadow-sm border border-outline/5 aspect-square">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 backdrop-blur-[2px]">
                  <h3 className="text-xl font-black text-white mb-2 tracking-tighter leading-tight">{product.name}</h3>
                  <div className="flex gap-2 mb-4">
                    <span className="bg-white/20 text-white text-[9px] px-3 py-1 rounded-lg font-black uppercase tracking-widest border border-white/10">{product.category}</span>
                  </div>
                  <div className="flex justify-between items-center text-white/70 border-t border-white/10 pt-4">
                    <span className="text-[9px] font-bold uppercase tracking-widest">SKU: {product.sku}</span>
                    <button className="bg-white text-primary w-10 h-10 flex items-center justify-center rounded-xl shadow-lg hover:scale-110 transition-transform active:scale-95" aria-label="Ver Detalles" title="Ver Detalles">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

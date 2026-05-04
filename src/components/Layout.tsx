import { ReactNode } from 'react';
import { 
  Package, 
  CreditCard, 
  ShoppingCart, 
  Users, 
  Image as ImageIcon, 
  Settings,
  Diamond
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Page } from '../App';

interface LayoutProps {
  page: Page;
  setPage: (page: Page) => void;
  children: ReactNode;
}

export function Layout({ page, setPage, children }: LayoutProps) {
  const isParam = page === 'parametrizacion' || page === 'costeo';
  const isGal = page === 'campanas' || page === 'medios';

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar - Modern Vanguard V2 */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-surface shadow-2xl flex flex-col py-8 z-50 border-r border-outline/10">
        <div className="px-8 mb-12 flex items-center gap-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Diamond className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-primary text-2xl font-black tracking-tighter">Revive+</h1>
            <p className="text-tertiary-fixed text-[10px] font-black uppercase tracking-[0.2em] mt-0.5">Vanguard Nexus 2.0</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 px-4">
          <button 
            title="Inventario"
            onClick={() => setPage('inventario')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group",
              page === 'inventario' ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
            )}
          >
            <Package className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="font-bold tracking-tight text-sm">Inventario</span>
          </button>
          
          <button 
            title="Ventas"
            onClick={() => setPage('ventas')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group",
              page === 'ventas' ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
            )}
          >
            <CreditCard className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="font-bold tracking-tight text-sm">Ventas</span>
          </button>

          <button 
            title="Pedidos"
            onClick={() => setPage('pedidos')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group",
              page === 'pedidos' ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
            )}
          >
            <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="font-bold tracking-tight text-sm">Pedidos</span>
          </button>

          <button 
            title="Clientes"
            onClick={() => setPage('clientes')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group",
              page === 'clientes' ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
            )}
          >
            <Users className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="font-bold tracking-tight text-sm">Clientes</span>
          </button>

          <button 
            title="Galería Visual"
            onClick={() => setPage('campanas')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group",
              isGal ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
            )}
          >
            <ImageIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="font-bold tracking-tight text-sm">Galería Visual</span>
          </button>

          <div className="h-px bg-outline/10 my-6 mx-4"></div>

          <button 
            title="Configuración"
            onClick={() => setPage('parametrizacion')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group",
              page === 'parametrizacion' || page === 'costeo' ? "bg-tertiary text-on-tertiary shadow-xl shadow-tertiary/20 font-black" : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
            )}
          >
            <Settings className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="font-bold tracking-tight text-sm">Parametrización</span>
          </button>
        </nav>

        <div className="px-5 pt-6 mt-auto border-t border-outline/5">
          <div className="flex items-center gap-3 bg-background p-4 rounded-2xl border border-outline/5 hover:border-outline/10 transition-all cursor-pointer group shadow-sm">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-surface-dim relative border border-outline/10">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTSUmxt0UPyyFryp5fTaTwAzqlEa32rGMghvfCfZuvQ2k22LIWLr2lNu0vczeRjbbTPHNWCws0qU35rAFJ5uVG13lgXWJEIr91guMvaooorgcKXhNXjY37OkweSzK_UFxFVLpD6BqfnimwxF80TFCiKU8KTYUbslT2TmJVHolFJHoHe1xk9S8kS6He4CbWSSQaGrBqoEThfk7ScyTBym_gYAK5J7ODPYE3PRW3FLGf9b23ldNEim25OLSr-y_q88CBpjbLkxSVp-5e" 
                alt="Profile" 
                title="Perfil de Usuario"
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-primary">Admin Nexus</span>
              <span className="text-[9px] text-tertiary font-black uppercase tracking-[0.1em]">Super Operational</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="ml-64 flex-1">
        {children}
      </main>
    </div>
  );
}


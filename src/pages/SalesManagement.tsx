import React from 'react';
import { Search, Bell, UserCircle, PlusCircle, TrendingUp, CreditCard, ArrowUpRight } from 'lucide-react';

export function SalesManagement() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 right-0 left-64 h-20 bg-surface-container/90 backdrop-blur-xl z-40 flex justify-between items-center px-12 border-b border-outline/10">
        <div className="flex items-center gap-6">
          <h2 className="font-bold text-2xl text-primary tracking-tighter">Gestión de Ventas</h2>
          <div className="h-6 w-px bg-outline/20"></div>
          <span className="text-[10px] font-bold text-secondary tracking-[0.2em] uppercase">Vanguard Nexus</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="relative flex items-center group">
            <Search className="absolute left-4 text-outline w-4 h-4 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar ventas..." 
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
            <h3 className="text-4xl font-black text-primary tracking-tighter">Panel de Ingresos</h3>
            <p className="text-secondary mt-3 max-w-lg text-sm font-medium leading-relaxed">Monitoree el flujo de caja y el rendimiento comercial en tiempo real.</p>
          </div>
          <button title="Nueva Venta" className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-black text-sm shadow-xl shadow-primary/20 hover:bg-primary/95 transition-all active:scale-95 uppercase tracking-widest">
            <PlusCircle className="w-5 h-5" />
            Generar Venta
          </button>
        </div>

        <div className="grid grid-cols-12 gap-8 mb-16">
          <div className="col-span-12 md:col-span-4 bg-white p-10 rounded-2xl shadow-sm border border-outline/10 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Facturación Mensual</span>
              <div className="bg-surface-container-low p-3 rounded-xl border border-outline/5">
                <TrendingUp className="text-on-tertiary-fixed w-5 h-5" />
              </div>
            </div>
            <div className="mt-8">
              <div className="text-5xl font-black text-primary tracking-tighter">$42.8k</div>
              <p className="text-xs text-emerald-600 mt-4 flex items-center gap-2 font-bold bg-emerald-50 w-fit px-3 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3" /> +18% vs mes anterior
              </p>
            </div>
          </div>
          <div className="col-span-12 md:col-span-8 bg-tertiary text-on-tertiary p-10 rounded-3xl relative overflow-hidden flex items-center justify-between shadow-2xl shadow-tertiary/20">
            <div className="relative z-10 w-2/3">
              <span className="bg-white/10 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-lg border border-white/5 backdrop-blur-md mb-6 inline-block">Métrica de Conversión</span>
              <h4 className="text-3xl font-black mb-3 tracking-tighter">Tasa de Cierre: 24%</h4>
              <p className="text-on-tertiary/60 text-sm mb-8 font-medium">Su equipo de ventas ha incrementado la efectividad en un 5% esta semana.</p>
              <div className="flex gap-6">
                <div className="bg-white/5 border border-white/10 backdrop-blur-md px-6 py-4 rounded-2xl">
                  <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Ticket Promedio</p>
                  <p className="text-2xl font-black text-white">$156.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-outline/10 p-12 text-center">
            <div className="w-20 h-20 bg-surface-container rounded-3xl flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-10 h-10 text-primary" />
            </div>
            <h4 className="text-2xl font-black text-primary mb-2">Historial de Transacciones</h4>
            <p className="text-secondary text-sm max-w-sm mx-auto mb-8 font-medium">Las ventas recientes aparecerán aquí una vez que se procesen los pedidos.</p>
        </div>
      </div>
    </div>
  );
}

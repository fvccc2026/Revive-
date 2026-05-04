import React from 'react';
import { Search, Bell, UserCircle, PlusCircle, TrendingUp, History, ArrowUpRight, FolderOpen, ImagePlus } from 'lucide-react';

export function CampaignManagement({ onOpenGallery }: { onOpenGallery: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 right-0 left-64 h-20 bg-surface-container/90 backdrop-blur-xl z-40 flex justify-between items-center px-12 border-b border-outline/10">
        <div className="flex items-center gap-6">
          <h2 className="font-bold text-2xl text-primary tracking-tighter">Gestión de Campañas</h2>
          <div className="h-6 w-px bg-outline/20"></div>
          <span className="text-[10px] font-bold text-secondary tracking-[0.2em] uppercase">Vanguard Nexus</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="relative flex items-center group">
            <Search className="absolute left-4 text-outline w-4 h-4 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar campañas..." 
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
            <h3 className="text-4xl font-black text-primary tracking-tighter">Estrategia Publicitaria</h3>
            <p className="text-secondary mt-3 max-w-lg text-sm font-medium leading-relaxed">Supervise el rendimiento y la trazabilidad de sus campañas actuales e históricas con integración directa a la galería maestra de la marca.</p>
          </div>
          <button className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-black text-sm shadow-xl shadow-primary/20 hover:bg-primary/95 transition-all active:scale-95 uppercase tracking-widest">
            <PlusCircle className="w-5 h-5" />
            Crear Campaña
          </button>
        </div>

        <div className="grid grid-cols-12 gap-8 mb-16">
          <div className="col-span-12 md:col-span-4 bg-white p-10 rounded-2xl shadow-sm border border-outline/10 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Alcance Total Mes</span>
              <div className="bg-surface-container-low p-3 rounded-xl border border-outline/5">
                <TrendingUp className="text-on-tertiary-fixed w-5 h-5" />
              </div>
            </div>
            <div className="mt-8">
              <div className="text-5xl font-black text-primary tracking-tighter">1.2M</div>
              <p className="text-xs text-emerald-600 mt-4 flex items-center gap-2 font-bold bg-emerald-50 w-fit px-3 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3" /> +12% vs mes anterior
              </p>
            </div>
          </div>
          <div className="col-span-12 md:col-span-8 bg-primary text-white p-10 rounded-3xl relative overflow-hidden flex items-center justify-between shadow-2xl shadow-primary/20">
            <div className="relative z-10 w-2/3">
              <span className="bg-white/10 text-tertiary-fixed text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-lg border border-white/5 backdrop-blur-md mb-6 inline-block">Campaña Destacada</span>
              <h4 className="text-3xl font-black mb-3 tracking-tighter">Summer Renaissance 2026</h4>
              <p className="text-white/60 text-sm mb-8 font-medium">Alta conversión detectada en canales premium. Optimización recomendada.</p>
              <div className="flex gap-6">
                <div className="bg-white/5 border border-white/10 backdrop-blur-md px-6 py-4 rounded-2xl">
                  <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">ROAS</p>
                  <p className="text-2xl font-black text-tertiary-fixed">4.8x</p>
                </div>
                <div className="bg-white/5 border border-white/10 backdrop-blur-md px-6 py-4 rounded-2xl">
                  <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Clicks</p>
                  <p className="text-2xl font-black text-tertiary-fixed">24.5k</p>
                </div>
              </div>
            </div>
            <div className="absolute right-0 top-0 h-full w-2/5 opacity-60">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAN0jGL2PHuRjNblh8SqC9S81Nl7SxXTRgNlZ1nMvj2kHx9UY0oYJSlm6wSG-S1U_hxcCLEzMqD4PvKkG61lLHXtkpIuViIANiPbQVYKMYgH2cGMUKLtQJZF86dcQ8sZLzmFoHwnWPPFdk-qVy7yIrD0qC-PQoyooMiEzLBPVDltKjfjNGwO-xQ-kzblk0O9UQ9eJ3_Munh6ZXJoRRPsa3ADKws947M6-fVS7RJRShgiFd982p6C8N2-TgH24sqEshuhaWVgIlGaoC0" alt="Highlight" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary"></div>
            </div>
          </div>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-outline/10 overflow-hidden mb-16">
            <div className="grid grid-cols-12 px-10 py-6 border-b border-outline/10 bg-surface-container-low/30">
              <div className="col-span-4 text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Campaña</div>
              <div className="col-span-2 text-[10px] font-black text-secondary uppercase tracking-[0.2em] text-center">Estado</div>
              <div className="col-span-2 text-[10px] font-black text-secondary uppercase tracking-[0.2em] text-right">Alcance Est.</div>
              <div className="col-span-2 text-[10px] font-black text-secondary uppercase tracking-[0.2em] text-center">Activos</div>
              <div className="col-span-2 text-[10px] font-black text-secondary uppercase tracking-[0.2em] text-right">Lanzamiento</div>
            </div>
            
            <div className="divide-y divide-outline/5">
              <div className="grid grid-cols-12 px-10 py-8 items-center hover:bg-surface-container-low transition-colors group cursor-pointer">
                <div className="col-span-4 flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center border border-outline/5 shadow-sm">
                    <TrendingUp className="text-on-tertiary-fixed w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-black text-primary text-base group-hover:text-on-tertiary-fixed transition-colors">Eco-Tech Launch</p>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1">4 Productos asociados</p>
                  </div>
                </div>
                <div className="col-span-2 flex justify-center">
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-4 py-1.5 rounded-lg uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span> Activa
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  <p className="font-black text-primary text-lg">450,000</p>
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-tighter">Impresiones</p>
                </div>
                <div className="col-span-2 flex justify-center -space-x-4">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjvlutElysh8wscEazAdjBttcxbV-3lfwde1AM-BefcHJde_FDslds6qSFSa_8Hgm4nqp4-DoFJnv5MZSzWl1jdjlPpK0_iCw0LAltRXHOij1wAmKgIE-dy-IYpeyzoZYb-s5UBifbOVaCi79GPcwi3q-GC896X1lfdVTBIdqcanRtFJ8eANZwpmHrsmLzmgwZbWRNogOdTzylzXa6t87_kJy43kZXCeujvFkpMReafoAgQkB_tAAFMyFMPzZVPo0rpKtsTQvc_zcr" alt="Producto Eco-Tech" className="w-10 h-10 rounded-xl border-2 border-white object-cover shadow-sm ring-1 ring-outline/5" />
                  <div className="w-10 h-10 rounded-xl border-2 border-white bg-surface-container-high text-[10px] flex items-center justify-center font-black text-primary shadow-sm ring-1 ring-outline/5">+5</div>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-sm font-black text-primary">12 May 2026</p>
                  <p className="text-[10px] font-bold text-on-tertiary-fixed uppercase tracking-tight mt-1">Finaliza en 5d</p>
                </div>
              </div>

              <div className="grid grid-cols-12 px-10 py-8 items-center hover:bg-surface-container-low transition-colors group cursor-pointer">
                <div className="col-span-4 flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center border border-outline/5 shadow-sm">
                    <History className="text-secondary w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-black text-primary text-base group-hover:text-secondary transition-colors">Winter Rebranding</p>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1">Todo el catálogo</p>
                  </div>
                </div>
                <div className="col-span-2 flex justify-center">
                  <span className="bg-surface-container text-secondary text-[10px] font-black px-4 py-1.5 rounded-lg uppercase tracking-widest border border-outline/5">Finalizada</span>
                </div>
                <div className="col-span-2 text-right">
                  <p className="font-black text-primary text-lg">2.4M</p>
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-tighter">Alcance Real</p>
                </div>
                <div className="col-span-2 flex justify-center -space-x-4">
                   <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDZl4iHI4bN9tIvV97gHWTAKbIX5umMUPq06uKpHbyxO_oQFytjrCwfUqQ4bm0CqN8UKpshkM56Nk_Mb4LjyFzn_Czdb3v8lrPIjwrgHHncogmoNuhYpTKo5xKTf9EPIabaRWNyPsrgPkYf-1cZLMnluSE9RNbdx5E19Hi5glrrHKIMjGRI3Pefodb7xCrSQDUr0spaS_vYCrVY0AVjEaNh2dAIpBp7QPG_UJfKc-EPd3OXNUUw6WeK53PE93UIhz9ucVaXz4ZbIFk" alt="Producto Winter Rebranding" className="w-10 h-10 rounded-xl border-2 border-white object-cover shadow-sm ring-1 ring-outline/5" />
                   <div className="w-10 h-10 rounded-xl border-2 border-white bg-surface-container-high text-[10px] flex items-center justify-center font-black text-primary shadow-sm ring-1 ring-outline/5">+12</div>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-sm font-black text-primary">15 Feb 2026</p>
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-tight mt-1 italic">Archivo histórico</p>
                </div>
              </div>
            </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-2xl font-black text-primary tracking-tighter">Trazabilidad Visual</h4>
            <button onClick={onOpenGallery} className="bg-white px-6 py-2.5 rounded-xl text-xs font-black text-primary border border-outline/10 shadow-sm hover:bg-surface-container-low transition-all flex items-center gap-2 uppercase tracking-widest">
              Gallería Completa <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-outline/5">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsJh0tjkUtySYXHsxzijWytZCsYLEySKa1Uhdpecsq7ZBAxwykiNIc2kY-9nJVqjS_faNV0hMzuOnS380ElvVoVpKIHBXTNnKgTq80d-kOX9NJ8VKiXa1h6QGJovzVuxiAVrCqoSQ2hRwGyx2OC2m6J-buzROl1nY_zMp6wpqbdGZUYvWNj3kPacgJW9hRLPWphpFS75PmtLZVQwU9oEkLoaSyfiYgIEUEzZZ4K0-wDi6NF6oybD177M6TfGFpW6qJ0xGIzUMo5eqS" alt="Asset" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <p className="text-[10px] text-tertiary-fixed font-black uppercase tracking-[0.2em] mb-2">Campaña Activa</p>
                <p className="text-white font-black text-lg tracking-tight">Eco-Tech Launch</p>
              </div>
              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 text-[10px] text-white font-black uppercase tracking-widest shadow-xl">
                  Asset ID #042
              </div>
            </div>
            
            <button 
              onClick={onOpenGallery}
              className="flex flex-col justify-center items-center gap-5 bg-white border-2 border-dashed border-outline/20 rounded-2xl p-8 text-center hover:bg-surface-container-low hover:border-primary/20 transition-all group shadow-sm active:scale-95"
            >
              <div className="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ImagePlus className="w-8 h-8 text-on-tertiary-fixed" />
              </div>
              <div>
                <p className="font-black text-primary text-base">Vincular Assets</p>
                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1">Seleccionar de la galería maestra</p>
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

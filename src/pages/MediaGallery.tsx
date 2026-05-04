import React from 'react';
import { Search, Bell, Settings, Filter, CloudUpload, Eye, Download, UserCircle, PlusCircle, TrendingUp, History, ArrowUpRight, FolderOpen, ImagePlus } from 'lucide-react';

export function MediaGallery() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 right-0 left-64 h-20 bg-surface-container/90 backdrop-blur-xl z-40 flex justify-between items-center px-12 border-b border-outline/10">
        <div className="flex items-center gap-6">
          <h2 className="font-bold text-2xl text-primary tracking-tighter">Galería de Medios</h2>
          <div className="h-6 w-px bg-outline/20"></div>
          <span className="text-[10px] font-bold text-secondary tracking-[0.2em] uppercase">Recursos Visuales</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar activos..." 
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
            <h1 className="text-5xl font-black tracking-tighter text-primary mb-5">Revive Nexus Media</h1>
            <p className="text-secondary text-sm font-medium leading-relaxed max-w-xl">
              Gestione los activos visuales premium para campañas de marketing y catálogo de productos. Curaduría editorial optimizada para la identidad visual de la marca.
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

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main Large Item */}
          <div className="md:col-span-8 group relative overflow-hidden rounded-3xl bg-surface-container-low shadow-sm border border-outline/5 aspect-video md:aspect-auto h-[480px]">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAz40B-O_lboqKM5Z9I56rv90Vj9DU8oDJ15OHMb8xyEEF_4Nqqj7_O-BswnfpSmEEk2u2vwXBXZ2ayei9RzNovHgV-QVoxaFkjzPtf7VA38Slw-DjAL6Qxt4wZvZ-S7W1bR1Z0AGyQjtpPwhpg1tijJZ9YlM0h2gRuumzAkyT-iuNxlbBNQsAuo52o5_PxUwiRXvmiaLQnAuNY0r_BWP65tYNNpg3YHcrSTNmgxCgGGblEvmblkkpeeXtks9TNg0fb6NxJprs_PN1W"
              alt="Granos de Origen - Etíope"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10 backdrop-blur-[2px]">
              <div className="flex justify-between items-end text-white relative z-10">
                <div>
                  <h3 className="text-3xl font-black mb-3 tracking-tighter">Granos de Origen - Etíope</h3>
                  <div className="flex gap-4 mb-6">
                    <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] px-4 py-1.5 rounded-lg font-black uppercase tracking-widest border border-white/10">Campaña Verano</span>
                    <span className="bg-white/10 text-white text-[10px] px-4 py-1.5 rounded-lg font-black uppercase tracking-widest border border-white/5 backdrop-blur-md">Stock 2026</span>
                  </div>
                  <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Cargado el 12 Oct, 2026 • 4.2 MB • 4000x3000px</p>
                </div>
                <button className="bg-white text-primary w-14 h-14 flex items-center justify-center rounded-2xl shadow-2xl hover:scale-110 transition-transform active:scale-95" aria-label="Descargar" title="Descargar">
                  <Download className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 group relative overflow-hidden rounded-3xl bg-surface-container-low shadow-sm border border-outline/5 h-[480px]">
             <img 
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuBORoo_uVEBtqNbSpDvTTM5jxJZr7xGBGrauiTKJ-sWRbEB2YeEV-9Ztsnwqyh-ZHi7XicdtYoiapAqunqNYq-hWCigluMK5GsfjOe57HKNX1gn96nNCrVtoQvrnoTRb-2VkbWRQIg42jpXRZzKbvVDvYB-zmGF67r4fqKdMfpwpeAnLbSHDBnt1F3xabCeGbfFNjtFZBKZ1d3RLXG0XyTZC0qZxE_FodPHdnSRiSU6GUlWca4D5OMpiRdmX25iN_5GYJDGtc6wqDP0"
               alt="Signature Latte Art"
               className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 backdrop-blur-[2px]">
               <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">Signature Latte Art</h3>
               <p className="text-tertiary-fixed text-[10px] uppercase tracking-[0.2em] font-black mb-6">Editorial Content</p>
               <div className="flex justify-between items-center text-white/50 border-t border-white/10 pt-6">
                 <span className="text-[10px] font-bold uppercase tracking-widest italic">Cargado hace 2 días</span>
                 <Eye className="w-5 h-5" />
               </div>
             </div>
          </div>

          <div className="md:col-span-4 group relative overflow-hidden rounded-3xl bg-surface-container-low shadow-sm border border-outline/5 h-[320px]">
             <img 
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1uH_KVVvmshp1AI-1ya9ikoABVX65DMqz9bdaEGb_pdetJmqWhMPIINnrkiDZfHF_AFeBDZ1cesydwL2MGzeInLKoxhgUaJR3UdIb5aOnVtLjX0NwYlejqpeg0G9RCRXDyvWhlrNbCPTYc9ng6V5LGxUDz02b5NiM3_OHuy5Hy2_heGXXwMv76_tzJG2GvQKoRUmjXywnDqPiltIcU61eZPDJt9t1qsBypgtbYsM4DEIRT35oI63ocy1g70zlQzr1Eq8uH2_NltKW"
               alt="Eco-Tumblers 2026"
               className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
               <h3 className="text-xl font-black text-white mb-1 tracking-tighter">Eco-Tumblers 2026</h3>
               <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-4">Merchandising / Accesorios</p>
               <span className="text-white/40 text-[10px] font-bold uppercase tracking-tighter">15 Oct, 2026</span>
             </div>
          </div>

          <div className="md:col-span-4 group relative overflow-hidden rounded-3xl bg-surface-container-low shadow-sm border border-outline/5 h-[320px]">
             <img 
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsNgjzxIZaR_QVlOTRMG0sZwvyma9fSqYTmvEKFTWG4FE2m7UkzEZqEMGkMTZvuox3q0xf5LvGyHJYaRvRhdL_hVZiQLaBgp2mu6GjvIKTLkoI-yz_MZhzQZihnxtOxnTYW-UwMFd3JPidGj0oojsafasIeTAqnuJP3JhyrnVUS3rh9i7b5QJKXTzgAaC4rjTTlBOKhfjeANsmlA-BIu8C2eek1iYdAHGzXk9MjKAvuJ3JbP_6OdX1rmZnYfm02VGuGzZv3WwssIRN"
               alt="Estilo de Vida Nexus"
               className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
               <h3 className="text-xl font-black text-white mb-1 tracking-tighter">Estilo de Vida Nexus</h3>
               <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-4">Campaña: Conexión Humana</p>
               <span className="text-white/40 text-[10px] font-bold uppercase tracking-tighter">20 Oct, 2026</span>
             </div>
          </div>
          
          <div className="md:col-span-4 group relative overflow-hidden rounded-3xl bg-surface-container-low shadow-sm border border-outline/5 h-[320px]">
             <img 
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwFSP9-L1P0B6UCxBPfJS8aTUhNgAGRlkkV4HwGVGg3NY5Qt0RdL8JF1dB80C4iCCFOCk-zWDCV8Mvq9NkhppQw307CPW_VYUwErEzM6L7fnc0X83SgWbbrPGOBPeRGMZGmJ6M9DmLoVDACizzIFdY9ZMP11sCTIelHWPnGqNZ9PZxDc7EctwmZrEB0q-f1DAywOOOd5R6lTBmSFRrcdYs95p-izgm9p0L1OJ1MYVpEBHnAuUagq6V9GHomQNgbOUYQtLsaUo4N93q"
               alt="Métodos de Extracción"
               className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
               <h3 className="text-xl font-black text-white mb-1 tracking-tighter">Métodos de Extracción</h3>
               <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-4">Educativo / Web</p>
               <span className="text-white/40 text-[10px] font-bold uppercase tracking-tighter">22 Oct, 2026</span>
             </div>
          </div>

          <div className="md:col-span-12 group relative overflow-hidden rounded-[40px] bg-primary h-[240px] shadow-2xl shadow-primary/30 mt-8 border border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,213,181,0.1),transparent_70%)]"></div>
            <div className="absolute inset-0 flex items-center justify-between px-16 z-10">
              <div className="flex items-center gap-12">
                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-700">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgzb89Rev-yLN0vQcaLeTfbmI69SVIGh37HKm1WpP9pd9m7Q-J8mZraBHbD7wyzF6GmIl5sqU2Z8vFgts7SRqdCk3Ge82xvllQSbw9srXP5Y21W-3Izi4Dle5qCUhfg8NT0cW5u048CIW6kl8iPv2V3YR97rVa_wZkvPX7EoEu--LVqCnDBOZlw99UNQPONJhRCUxJrolJQserZiQQ4ElnatmUBpV36IpmMp1GkzXYQFxXLLD5A68B6kfPsd58NGenZDT39ZvT58cp" alt="Próxima Campaña" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-tertiary-fixed text-[10px] font-black uppercase tracking-[0.3em] mb-3 block">Early Access Preview</span>
                  <h2 className="text-4xl font-black text-white tracking-tighter">Próxima Campaña: Invierno Dorado</h2>
                  <p className="text-white/40 font-bold text-sm mt-2 uppercase tracking-widest">8 recursos visuales listos • Lanzamiento en 14 días</p>
                </div>
              </div>
              <button className="bg-tertiary-fixed text-on-tertiary-fixed px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-tertiary-fixed/90 transition-all shadow-xl active:scale-95">
                Explorar Carpeta
              </button>
            </div>
          </div>
        </div>

        <div className="mt-20 flex justify-center">
          <button className="bg-white text-primary border border-outline/10 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-surface-container-low transition-all shadow-sm active:scale-95">
            Cargar más activos
          </button>
        </div>
      </div>
    </div>
  );
}

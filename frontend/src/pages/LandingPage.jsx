import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed, Clock, MapPin, Phone, ShieldCheck,
  Sparkles, ChefHat, ArrowRight, X, Home, Truck, CheckCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

/* ── Order Mode Modal ─────────────────────────────────────────── */
function OrderModal({ tables, onClose, onDineIn, onDelivery }) {
  const [mode, setMode] = useState(null);          // 'dine' | 'delivery'
  const [selectedTable, setSelectedTable] = useState('');
  const [address, setAddress] = useState('');

  const handleConfirm = () => {
    if (mode === 'dine') {
      if (!selectedTable) return;
      onDineIn(selectedTable);
    } else if (mode === 'delivery') {
      if (!address.trim()) return;
      onDelivery(address.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-end sm:items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-800 rounded-[28px] w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-orange-100 uppercase tracking-widest">Place an Order</p>
            <h3 className="font-black text-white text-lg">How would you like to order?</h3>
          </div>
          <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Mode picker */}
          {!mode && (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setMode('dine')}
                className="flex flex-col items-center gap-3 p-6 bg-slate-800 hover:bg-orange-500/10 border border-slate-700 hover:border-orange-500/50 rounded-2xl transition cursor-pointer group"
              >
                <div className="w-12 h-12 bg-orange-500/10 group-hover:bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-400">
                  <Home size={24} />
                </div>
                <div className="text-center">
                  <div className="font-bold text-white text-sm">Dining In</div>
                  <div className="text-slate-400 text-[10px] mt-0.5">I'm at the restaurant</div>
                </div>
              </button>
              <button
                onClick={() => setMode('delivery')}
                className="flex flex-col items-center gap-3 p-6 bg-slate-800 hover:bg-orange-500/10 border border-slate-700 hover:border-orange-500/50 rounded-2xl transition cursor-pointer group"
              >
                <div className="w-12 h-12 bg-orange-500/10 group-hover:bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-400">
                  <Truck size={24} />
                </div>
                <div className="text-center">
                  <div className="font-bold text-white text-sm">Delivery</div>
                  <div className="text-slate-400 text-[10px] mt-0.5">Deliver to my address</div>
                </div>
              </button>
            </div>
          )}

          {/* Dine In — table selector */}
          {mode === 'dine' && (
            <div className="flex flex-col gap-4">
              <button onClick={() => setMode(null)} className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition w-fit cursor-pointer">
                ← Back
              </button>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Select Your Table</label>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                  {tables.map(t => (
                    <button
                      key={t._id}
                      onClick={() => setSelectedTable(t.number)}
                      className={`py-3 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                        selectedTable === t.number
                          ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-orange-500/40'
                      }`}
                    >
                      {selectedTable === t.number && <CheckCircle size={11} />}
                      {t.number}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleConfirm}
                disabled={!selectedTable}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold text-sm py-3.5 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                View Menu for {selectedTable || '…'} <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Delivery — address input */}
          {mode === 'delivery' && (
            <div className="flex flex-col gap-4">
              <button onClick={() => setMode(null)} className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition w-fit cursor-pointer">
                ← Back
              </button>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Delivery Address</label>
                <textarea
                  rows={3}
                  placeholder="Enter your full delivery address…"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none resize-none transition"
                />
              </div>
              <button
                onClick={handleConfirm}
                disabled={!address.trim()}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold text-sm py-3.5 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                Browse Menu <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Landing Page ─────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const { settings, items, tables } = useApp();
  const [showOrderModal, setShowOrderModal] = useState(false);

  const restaurantName = settings?.restaurantName || 'BiteQR Cafe';
  const restaurantAddress = settings?.address || '';
  const restaurantPhone = settings?.phoneNumber ? `+${settings.phoneNumber}` : '';
  const logoUrl = settings?.logoUrl;
  const currencySymbol = settings?.currencySymbol || '₹';
  const googleMapUrl = settings?.googleMapUrl;

  // Pick first 3 available items for showcase
  const featuredDishes = items.filter(i => i.isAvailable).slice(0, 3);

  const handleDineIn = (tableNumber) => {
    setShowOrderModal(false);
    navigate(`/menu?table=${encodeURIComponent(tableNumber)}`);
  };

  const handleDelivery = (address) => {
    setShowOrderModal(false);
    navigate(`/menu?delivery=true&address=${encodeURIComponent(address)}`);
  };

  const handleOrderClick = () => {
    if (tables.length > 0) {
      setShowOrderModal(true);
    } else {
      navigate('/menu?delivery=true');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans">
      {showOrderModal && (
        <OrderModal
          tables={tables}
          onClose={() => setShowOrderModal(false)}
          onDineIn={handleDineIn}
          onDelivery={handleDelivery}
        />
      )}

      {/* Background orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Nav */}
      <header className="max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between border-b border-slate-900/60 sticky top-0 bg-slate-950/80 backdrop-blur-md z-40">
        <div className="flex items-center gap-2.5">
          {logoUrl ? (
            <img src={logoUrl} alt={restaurantName} className="w-9 h-9 rounded-xl object-cover shadow-lg shadow-orange-500/20" />
          ) : (
            <div className="bg-gradient-premium p-2 rounded-xl text-white shadow-lg shadow-orange-500/20">
              <UtensilsCrossed size={20} />
            </div>
          )}
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
            {restaurantName}
          </span>
        </div>
        <div className="flex items-center gap-5">
          <button onClick={() => setShowOrderModal(true)} className="hidden sm:inline-block text-xs font-bold text-slate-300 hover:text-white transition duration-300 cursor-pointer">
            Browse Menu
          </button>
          <button onClick={handleOrderClick} className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition duration-300 shadow-md cursor-pointer">
            Order Online
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto w-full px-6 pt-12 pb-20 grid lg:grid-cols-12 gap-12 items-center z-10">
        <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider self-center lg:self-start">
            <Sparkles size={12} /> Exquisite Dine-In Experience
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white">
            Fine Dining Meets <br />
            <span className="bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent">
              Contactless Ordering
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
            Welcome to {restaurantName}. Experience fresh ingredients, gourmet recipes, and commission-free ordering right from your table. Simply scan, choose, and order via WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-4">
            <button
              onClick={handleOrderClick}
              className="w-full sm:w-auto bg-gradient-premium hover:opacity-95 text-white font-bold text-xs px-8 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition cursor-pointer"
            >
              Scan Table / Order Online <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 border-t border-slate-900 pt-8 mt-4 text-left max-w-md">
            <div>
              <span className="text-white font-black text-lg sm:text-2xl block">100%</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Fresh Meals</span>
            </div>
            <div>
              <span className="text-white font-black text-lg sm:text-2xl block">0%</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Commission</span>
            </div>
            <div>
              <span className="text-white font-black text-lg sm:text-2xl block">&lt; 15m</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Prep Time</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[380px] aspect-[4/5] rounded-[32px] overflow-hidden border border-slate-800/80 shadow-2xl group">
            {/* Hero image — uses admin settings hero if provided, else fallback to rich food scene */}
            <img
              src={settings?.heroImageUrl || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=80"}
              alt="Fine dining restaurant"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-6 inset-x-6 glassmorphism p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="bg-orange-500 p-2.5 rounded-xl text-white">
                <ChefHat size={18} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-orange-400 tracking-wider">Chef Special</span>
                <h4 className="text-xs font-black text-white">{featuredDishes[0]?.name || 'Truffle Parmesan Pizza'}</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-slate-900/30 border-y border-slate-900/60 py-20 z-10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest block mb-2">Modern Dining</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Scan, Tap, and Relish</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-3">Ordering from your table has never been easier. No apps to download, no wait times.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              ['01', 'Scan Table QR', 'Scan the QR code placed at your dining table. This automatically pairs your order with your table.'],
              ['02', 'Select Cuisine', 'Browse our visual menu, filter by dietary requirements (Veg/Egg/Spicy), and configure quantities.'],
              ['03', 'Order via WhatsApp', 'Tap checkout to send a structured order to our staff directly via WhatsApp. No commission.'],
            ].map(([step, title, desc]) => (
              <div key={step} className="bg-slate-950 border border-slate-900 p-8 rounded-3xl flex flex-col gap-4 text-center items-center">
                <div className="w-12 h-12 bg-orange-600/10 text-orange-500 border border-orange-500/20 rounded-2xl flex items-center justify-center font-bold text-base">{step}</div>
                <h3 className="font-bold text-base text-white">{title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Menu Items — from database */}
      <section className="max-w-7xl mx-auto w-full px-6 py-20 z-10 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest block mb-2">Signature Dishes</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Curated Specialties</h2>
          </div>
          <button onClick={handleOrderClick} className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition cursor-pointer">
            Explore Full Menu <ArrowRight size={14} />
          </button>
        </div>

        {featuredDishes.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDishes.map((dish) => (
              <div key={dish._id} className="bg-slate-900/30 border border-slate-900/80 rounded-[28px] overflow-hidden flex flex-col justify-between hover:border-orange-500/30 transition duration-300">
                <div>
                  <div className="w-full h-48 bg-slate-800 relative overflow-hidden">
                    {dish.image ? (
                      <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <UtensilsCrossed size={40} />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-1">
                      {dish.isVeg && !dish.isEgg && (
                        <span className="w-5 h-5 border border-emerald-500 rounded bg-slate-950 flex items-center justify-center shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        </span>
                      )}
                      {dish.isEgg && (
                        <span className="w-5 h-5 border border-amber-500 rounded bg-slate-950 flex items-center justify-center shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        </span>
                      )}
                      {!dish.isVeg && !dish.isEgg && (
                        <span className="w-5 h-5 border border-red-500 rounded bg-slate-950 flex items-center justify-center shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-base text-white">{dish.name}</h3>
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed line-clamp-3">{dish.description}</p>
                  </div>
                </div>
                <div className="p-5 pt-0 border-t border-slate-900/60 mt-3 flex justify-between items-center">
                  <span className="font-black text-base text-white">{currencySymbol}{dish.price}</span>
                  <button
                    onClick={handleOrderClick}
                    className="bg-slate-900 hover:bg-orange-500 hover:text-white border border-slate-800 hover:border-orange-500 text-orange-400 text-[10px] font-extrabold px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            <UtensilsCrossed size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-sm">Menu items loading…</p>
          </div>
        )}
      </section>

      {/* Trust Section */}
      <section className="bg-slate-900/10 border-t border-slate-900/40 py-16 z-10 relative">
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            [ChefHat, 'Gourmet Chefs', 'Meals prepared by certified culinary artisans passionate about flavor profiles.'],
            [Clock, 'Fast Service', 'Direct table queues ensure quick notifications for faster kitchen prep times.'],
            [ShieldCheck, 'Hygiene Assured', 'Highest standards of contactless ordering and kitchen safety guidelines.'],
            [MapPin, 'Premium Location', 'Relaxed lounge environments with curated indoor and outdoor seating.'],
          ].map(([Icon, title, desc]) => (
            <div key={title} className="flex gap-4">
              <div className="text-orange-500 mt-1 flex-shrink-0"><Icon size={22} /></div>
              <div>
                <h4 className="font-bold text-sm text-white">{title}</h4>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact & Hours */}
      <section className="max-w-7xl mx-auto w-full px-6 py-20 z-10 relative grid md:grid-cols-2 gap-12 border-t border-slate-900">
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest block mb-2">Reach Us</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Location &amp; Contact</h2>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Stop by for a sensory experience of flavor. Book an event space or inquire about catering reservations.
          </p>
          <div className="flex flex-col gap-3.5 mt-2">
            {restaurantAddress && (
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <MapPin size={16} className="text-orange-500" /> {restaurantAddress}
              </div>
            )}
            {restaurantPhone && (
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <Phone size={16} className="text-orange-500" /> {restaurantPhone}
              </div>
            )}
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Clock size={16} className="text-orange-500" /> Open Daily: 11:00 AM – 11:30 PM
            </div>
          </div>
        </div>

        <div className="bg-slate-900/35 border border-slate-900 p-8 rounded-3xl flex flex-col justify-between">
          <h3 className="font-extrabold text-base text-white mb-4">Hours of Operations</h3>
          <div className="flex flex-col gap-3">
            {[['Monday – Friday', '11:00 AM – 11:00 PM'], ['Saturday', '11:00 AM – 12:00 AM'], ['Sunday', '10:00 AM – 11:30 PM']].map(([day, hours]) => (
              <div key={day} className="flex justify-between border-b border-slate-900 pb-2 text-xs last:border-0">
                <span className="text-slate-400">{day}</span>
                <span className="text-white font-bold">{hours}</span>
              </div>
            ))}
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold p-3.5 rounded-2xl flex items-center justify-center gap-2 mt-6">
            <Sparkles size={12} /> Table Reservations recommended for weekends.
          </div>
        </div>
      </section>

      {/* Map Section */}
      {googleMapUrl && (
        <section className="w-full h-[400px] border-t border-slate-900 bg-slate-900 z-10 relative">
          <iframe 
            src={googleMapUrl} 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Restaurant Location Map"
          ></iframe>
        </section>
      )}

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 py-10 bg-slate-950 z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-premium p-1.5 rounded-lg text-white">
              <UtensilsCrossed size={16} />
            </div>
            <span className="font-extrabold text-base text-white">{restaurantName}</span>
          </div>
          <p className="text-[11px] text-slate-500">&copy; {new Date().getFullYear()} {restaurantName}. All rights reserved.</p>
          <button onClick={() => navigate('/admin')} className="text-[10px] text-slate-500 hover:text-white font-bold uppercase tracking-wider transition cursor-pointer">
            Control Panel
          </button>
        </div>
      </footer>
    </div>
  );
}

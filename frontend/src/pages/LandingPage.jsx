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
    <div className="fixed inset-0 bg-stone-900/60 z-[100] flex items-end sm:items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white border border-stone-200 rounded-[28px] w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-stone-50 border-b border-stone-100 p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Place an Order</p>
            <h3 className="font-black text-stone-800 text-lg">How would you like to order?</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-xl text-stone-500 transition cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Mode picker */}
          {!mode && (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setMode('dine')}
                className="flex flex-col items-center gap-3 p-6 bg-stone-50 hover:bg-orange-50 border border-stone-200 hover:border-orange-200 rounded-2xl transition cursor-pointer group shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 bg-white group-hover:bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500 border border-stone-100 group-hover:border-orange-200 shadow-sm">
                  <Home size={24} />
                </div>
                <div className="text-center">
                  <div className="font-bold text-stone-800 text-sm">Dining In</div>
                  <div className="text-stone-500 text-[10px] mt-0.5">I'm at the restaurant</div>
                </div>
              </button>
              <button
                onClick={() => setMode('delivery')}
                className="flex flex-col items-center gap-3 p-6 bg-stone-50 hover:bg-orange-50 border border-stone-200 hover:border-orange-200 rounded-2xl transition cursor-pointer group shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 bg-white group-hover:bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500 border border-stone-100 group-hover:border-orange-200 shadow-sm">
                  <Truck size={24} />
                </div>
                <div className="text-center">
                  <div className="font-bold text-stone-800 text-sm">Delivery</div>
                  <div className="text-stone-500 text-[10px] mt-0.5">Deliver to my address</div>
                </div>
              </button>
            </div>
          )}

          {/* Dine In — table selector */}
          {mode === 'dine' && (
            <div className="flex flex-col gap-4">
              <button onClick={() => setMode(null)} className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 transition w-fit cursor-pointer">
                ← Back
              </button>
              <div>
                <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">Select Your Table</label>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                  {tables.map(t => (
                    <button
                      key={t._id}
                      onClick={() => setSelectedTable(t.number)}
                      className={`py-3 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                        selectedTable === t.number
                          ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20'
                          : 'bg-white border-stone-200 text-stone-600 hover:border-orange-300'
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
                className="w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white font-bold text-sm py-3.5 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                View Menu for {selectedTable || '…'} <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Delivery — address input */}
          {mode === 'delivery' && (
            <div className="flex flex-col gap-4">
              <button onClick={() => setMode(null)} className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 transition w-fit cursor-pointer">
                ← Back
              </button>
              <div>
                <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">Delivery Address</label>
                <textarea
                  rows={3}
                  placeholder="Enter your full delivery address…"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 focus:border-orange-400 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 resize-none transition"
                />
              </div>
              <button
                onClick={handleConfirm}
                disabled={!address.trim()}
                className="w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white font-bold text-sm py-3.5 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
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
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 flex flex-col relative font-sans">
      {showOrderModal && (
        <OrderModal
          tables={tables}
          onClose={() => setShowOrderModal(false)}
          onDineIn={handleDineIn}
          onDelivery={handleDelivery}
        />
      )}

      {/* Nav */}
      <header className="max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between sticky top-0 bg-[#faf8f5]/90 backdrop-blur-md z-40 border-b border-stone-200/60">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt={restaurantName} className="w-10 h-10 rounded-full object-cover shadow-sm border border-stone-200" />
          ) : (
            <div className="bg-stone-900 p-2 rounded-full text-white shadow-sm">
              <UtensilsCrossed size={18} />
            </div>
          )}
          <span className="font-extrabold text-xl tracking-tight text-stone-900 font-serif">
            {restaurantName}
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setShowOrderModal(true)} className="hidden sm:inline-block text-xs font-bold text-stone-500 hover:text-stone-900 transition duration-300 cursor-pointer uppercase tracking-wider">
            Menu
          </button>
          <button onClick={handleOrderClick} className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-5 py-2.5 rounded-full transition duration-300 shadow-md shadow-stone-900/10 cursor-pointer uppercase tracking-wider">
            Order Online
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto w-full px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center z-10">
        <div className="flex flex-col gap-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-orange-100/50 text-orange-700 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider self-center lg:self-start border border-orange-200/50">
            <Sparkles size={12} /> A Culinary Journey
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.1] text-stone-900 font-serif">
            Taste the <br />
            <span className="text-orange-600 italic font-medium">Extraordinary.</span>
          </h1>
          <p className="text-sm sm:text-base text-stone-500 max-w-xl leading-relaxed mx-auto lg:mx-0">
            Welcome to {restaurantName}. Discover our carefully curated menu featuring fresh ingredients and masterful preparation. Enjoy a seamless dining experience with our contactless ordering system.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-6">
            <button
              onClick={handleOrderClick}
              className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm px-8 py-4 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 transition cursor-pointer"
            >
              Explore Menu <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-6 pt-10 mt-6 border-t border-stone-200 text-left">
            <div>
              <span className="text-stone-900 font-black text-2xl block font-serif">100%</span>
              <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-1 block">Fresh Ingredients</span>
            </div>
            <div>
              <span className="text-stone-900 font-black text-2xl block font-serif">Chef</span>
              <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-1 block">Crafted Recipes</span>
            </div>
            <div>
              <span className="text-stone-900 font-black text-2xl block font-serif">Fast</span>
              <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-1 block">Table Service</span>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[500px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl shadow-stone-900/10 group">
            <img
              src={settings?.heroImageUrl || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=80"}
              alt="Fine dining restaurant"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-[1.5s]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-60" />
            
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg flex items-center gap-4 transform translate-y-2 group-hover:translate-y-0 transition duration-500">
              <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                <ChefHat size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider">Chef's Recommendation</span>
                <h4 className="text-sm font-black text-stone-900">{featuredDishes[0]?.name || 'Truffle Mushroom Risotto'}</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Items */}
      <section className="bg-white py-24 z-10 relative border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-14 gap-4">
            <div>
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest block mb-3">Our Menu</span>
              <h2 className="text-3xl sm:text-5xl font-black text-stone-900 font-serif">Signature Dishes</h2>
            </div>
            <button onClick={handleOrderClick} className="text-sm font-bold text-stone-600 hover:text-orange-600 flex items-center gap-2 transition cursor-pointer border-b border-stone-300 hover:border-orange-600 pb-1">
              View Full Menu <ArrowRight size={14} />
            </button>
          </div>

          {featuredDishes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDishes.map((dish) => (
                <div key={dish._id} className="group cursor-pointer" onClick={handleOrderClick}>
                  <div className="w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-5 bg-stone-100 relative shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                    {dish.image ? (
                      <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <UtensilsCrossed size={48} strokeWidth={1} />
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4 flex gap-1.5">
                      {dish.isVeg && !dish.isEgg && (
                        <span className="bg-white p-1.5 rounded-md shadow-sm border border-stone-100" title="Vegetarian">
                          <span className="w-3 h-3 border border-emerald-500 rounded-sm flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          </span>
                        </span>
                      )}
                      {dish.isEgg && (
                        <span className="bg-white p-1.5 rounded-md shadow-sm border border-stone-100" title="Contains Egg">
                          <span className="w-3 h-3 border border-amber-500 rounded-sm flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          </span>
                        </span>
                      )}
                      {!dish.isVeg && !dish.isEgg && (
                        <span className="bg-white p-1.5 rounded-md shadow-sm border border-stone-100" title="Non-Vegetarian">
                          <span className="w-3 h-3 border border-red-500 rounded-sm flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="px-2">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h3 className="font-bold text-lg text-stone-900 font-serif leading-tight group-hover:text-orange-600 transition-colors">{dish.name}</h3>
                      <span className="font-black text-lg text-orange-600 whitespace-nowrap">{currencySymbol}{dish.price}</span>
                    </div>
                    <p className="text-stone-500 text-sm leading-relaxed line-clamp-2">{dish.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-stone-400">
              <UtensilsCrossed size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm">Curating our menu...</p>
            </div>
          )}
        </div>
      </section>

      {/* Experience / Features */}
      <section className="py-24 z-10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest block mb-3">The Experience</span>
            <h2 className="text-3xl sm:text-5xl font-black text-stone-900 font-serif">Impeccable Service</h2>
            <p className="text-sm sm:text-base text-stone-500 mt-4">We combine traditional hospitality with modern convenience to ensure your dining experience is nothing short of perfect.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              [ChefHat, 'Master Chefs', 'Culinary experts crafting exquisite flavors.'],
              [Clock, 'No Waiting', 'Order from your table, your way.'],
              [ShieldCheck, 'Premium Quality', 'Only the finest, freshest ingredients used.'],
              [MapPin, 'Beautiful Ambiance', 'A relaxing atmosphere for every occasion.'],
            ].map(([Icon, title, desc]) => (
              <div key={title} className="flex flex-col items-center gap-4 p-6">
                <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-2">
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <h4 className="font-bold text-lg text-stone-900 font-serif">{title}</h4>
                <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Map Section (Side by Side) */}
      <section className="border-t border-stone-200 bg-white">
        <div className="grid lg:grid-cols-2">
          
          {/* Info Side */}
          <div className="p-12 lg:p-24 flex flex-col justify-center max-w-2xl mx-auto lg:ml-auto w-full">
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest block mb-3">Visit Us</span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 font-serif mb-8">Location & Hours</h2>
            
            <div className="space-y-6 mb-12">
              {restaurantAddress && (
                <div className="flex items-start gap-4 text-stone-600">
                  <MapPin size={20} className="text-orange-600 flex-shrink-0 mt-1" /> 
                  <span className="text-base leading-relaxed">{restaurantAddress}</span>
                </div>
              )}
              {restaurantPhone && (
                <div className="flex items-center gap-4 text-stone-600">
                  <Phone size={20} className="text-orange-600 flex-shrink-0" /> 
                  <span className="text-base">{restaurantPhone}</span>
                </div>
              )}
            </div>

            <div className="bg-stone-50 border border-stone-100 p-8 rounded-3xl">
              <h3 className="font-bold text-sm uppercase tracking-wider text-stone-800 mb-6">Opening Hours</h3>
              <div className="space-y-4">
                {[['Monday – Friday', '11:00 AM – 11:00 PM'], ['Saturday', '11:00 AM – 12:00 AM'], ['Sunday', '10:00 AM – 11:30 PM']].map(([day, hours]) => (
                  <div key={day} className="flex justify-between border-b border-stone-200/60 pb-3 text-sm last:border-0 last:pb-0">
                    <span className="text-stone-500">{day}</span>
                    <span className="text-stone-900 font-medium">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map Side */}
          <div className="min-h-[400px] lg:min-h-full bg-stone-100 relative">
            {googleMapUrl ? (
              <iframe 
                src={googleMapUrl} 
                width="100%" 
                height="100%" 
                className="absolute inset-0 w-full h-full object-cover"
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Restaurant Location Map"
              ></iframe>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 p-6 text-center">
                <MapPin size={48} className="mb-4 opacity-20" />
                <p>Location map not configured.</p>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-stone-950 text-stone-400 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-full text-white">
              <UtensilsCrossed size={16} />
            </div>
            <span className="font-extrabold text-lg text-white font-serif">{restaurantName}</span>
          </div>
          <p className="text-xs">&copy; {new Date().getFullYear()} {restaurantName}. All rights reserved.</p>
          <button onClick={() => navigate('/admin')} className="text-[10px] text-stone-500 hover:text-white font-bold uppercase tracking-wider transition cursor-pointer">
            Admin Login
          </button>
        </div>
      </footer>
    </div>
  );
}

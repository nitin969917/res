import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UtensilsCrossed, Clock, MapPin, Phone, ShieldCheck, 
  Sparkles, ChefHat, ArrowRight, Flame 
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  // Featured menu items for showcase
  const featuredDishes = [
    {
      name: 'Classic Margherita Pizza',
      desc: 'San Marzano tomato sauce, fresh mozzarella, heirloom cherry tomatoes, fresh basil, and extra virgin olive oil.',
      price: '₹490',
      tag: 'Veg',
      image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'Truffle Parmesan Fries',
      desc: 'Crispy golden fries tossed in white truffle oil, grated parmesan cheese, and fresh parsley, served with garlic aioli.',
      price: '₹320',
      tag: 'Veg',
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'The Ultimate Egg-Club Burger',
      desc: 'Double stacked grilled burger with fried farm egg, cheddar cheese slice, caramelized onions, and smoky BBQ sauce.',
      price: '₹420',
      tag: 'Contains Egg',
      image: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=600&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Navigation Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between border-b border-slate-900/60 sticky top-0 bg-slate-950/80 backdrop-blur-md z-40">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-premium p-2 rounded-xl text-white shadow-lg shadow-orange-500/20">
            <UtensilsCrossed size={20} />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
            BiteQR Cafe
          </span>
        </div>

        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate('/menu?table=Table%203')}
            className="hidden sm:inline-block text-xs font-bold text-slate-300 hover:text-white transition duration-300"
          >
            Browse Menu
          </button>
          <button
            onClick={() => navigate('/menu?table=Table%203')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4.5 py-2.5 rounded-xl transition duration-300 shadow-md cursor-pointer"
          >
            Order Online
          </button>
        </div>
      </header>

      {/* Hero Section */}
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
            Welcome to BiteQR Cafe. Experience fresh ingredients, gourmet recipe designs, and commission-free ordering right from your table. Simply scan, choose, and order via WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-4">
            <button
              onClick={() => navigate('/menu?table=Table%203')}
              className="w-full sm:w-auto bg-gradient-premium hover:opacity-95 text-white font-bold text-xs px-8 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition cursor-pointer"
            >
              Scan Table / Open Menu
              <ArrowRight size={14} />
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

        {/* Hero Image / Collage */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[380px] aspect-[4/5] rounded-[32px] overflow-hidden border border-slate-800/80 shadow-2xl group">
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80" 
              alt="Culinary dining table" 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
            
            {/* Overlay badge */}
            <div className="absolute bottom-6 inset-x-6 glassmorphism p-4.5 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="bg-orange-500 p-2.5 rounded-xl text-white">
                <ChefHat size={18} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-orange-400 tracking-wider">Chef Special</span>
                <h4 className="text-xs font-black text-white">Truffle Parmesan Pizza</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / The Digital Concept */}
      <section className="bg-slate-900/30 border-y border-slate-900/60 py-20 z-10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest block mb-2">Modern Dining</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Scan, Tap, and Relish</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-3">Ordering from your table has never been easier. No apps to download, no wait times.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-slate-950 border border-slate-900 p-8 rounded-3xl flex flex-col gap-4 text-center items-center">
              <div className="w-12 h-12 bg-orange-600/10 text-orange-500 border border-orange-500/20 rounded-2xl flex items-center justify-center font-bold text-base">
                01
              </div>
              <h3 className="font-bold text-base text-white">Scan Table QR</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Scan the QR code placed at your dining table using any smartphone camera. This automatically pairs your order with your table ID.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-950 border border-slate-900 p-8 rounded-3xl flex flex-col gap-4 text-center items-center">
              <div className="w-12 h-12 bg-orange-600/10 text-orange-500 border border-orange-500/20 rounded-2xl flex items-center justify-center font-bold text-base">
                02
              </div>
              <h3 className="font-bold text-base text-white">Select Cuisine</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Browse our visual menu containing gourmet foods, filter by dietary requirements (Veg/Egg/Spicy), and configure item quantities.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-950 border border-slate-900 p-8 rounded-3xl flex flex-col gap-4 text-center items-center">
              <div className="w-12 h-12 bg-orange-600/10 text-orange-500 border border-orange-500/20 rounded-2xl flex items-center justify-center font-bold text-base">
                03
              </div>
              <h3 className="font-bold text-base text-white">Order via WhatsApp</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Tap checkout to generate a structured message on WhatsApp. Submit to our staff to instantly push your meal into preparation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Culinary Showcase */}
      <section className="max-w-7xl mx-auto w-full px-6 py-20 z-10 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest block mb-2">Signature Dishes</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Curated Specialties</h2>
          </div>
          <button
            onClick={() => navigate('/menu?table=Table%203')}
            className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition"
          >
            Explore Full Menu <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredDishes.map((dish, idx) => (
            <div key={idx} className="bg-slate-900/30 border border-slate-900/80 rounded-[28px] overflow-hidden flex flex-col justify-between hover:border-orange-500/30 transition duration-300">
              <div>
                <div className="w-full h-48 bg-slate-800 relative overflow-hidden">
                  <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 flex gap-1">
                    {dish.tag === 'Veg' && (
                      <span className="w-5 h-5 border border-emerald-500 rounded bg-slate-950 flex items-center justify-center shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      </span>
                    )}
                    {dish.tag === 'Contains Egg' && (
                      <span className="w-5 h-5 border border-amber-500 rounded bg-slate-950 flex items-center justify-center shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-base text-white">{dish.name}</h3>
                  <p className="text-slate-400 text-xs mt-2 leading-relaxed line-clamp-3">{dish.desc}</p>
                </div>
              </div>
              <div className="p-5 pt-0 border-t border-slate-900/60 mt-3 flex justify-between items-center">
                <span className="font-black text-base text-white">{dish.price}</span>
                <button
                  onClick={() => navigate('/menu?table=Table%203')}
                  className="bg-slate-900 hover:bg-orange-500 hover:text-white border border-slate-800 hover:border-orange-500 text-orange-400 text-[10px] font-extrabold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Culinary Values / Trust */}
      <section className="bg-slate-900/10 border-t border-slate-900/40 py-16 z-10 relative">
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex gap-4">
            <div className="text-orange-500 mt-1 flex-shrink-0">
              <ChefHat size={22} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Gourmet Chefs</h4>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">Meals prepared by certified culinary artisans passionate about flavor profiles.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-orange-500 mt-1 flex-shrink-0">
              <Clock size={22} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Fast Service</h4>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">Direct table queues ensure quick notifications for faster kitchen prep times.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-orange-500 mt-1 flex-shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Hygiene Assured</h4>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">Highest standards of contactless ordering and kitchen safety guidelines.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-orange-500 mt-1 flex-shrink-0">
              <MapPin size={22} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Premium Location</h4>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">Relaxed lounge environments with curated indoor and outdoor seating.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Hours Info Section */}
      <section className="max-w-7xl mx-auto w-full px-6 py-20 z-10 relative grid md:grid-cols-2 gap-12 border-t border-slate-900">
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest block mb-2">Reach Us</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Location & Contact</h2>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Stop by for a sensory experience of flavor. Alternatively, you can book an event space or inquire about catering reservations.
          </p>
          <div className="flex flex-col gap-3.5 mt-2">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <MapPin size={16} className="text-orange-500" />
              456 Gourmet Boulevard, Foodie Plaza, New Delhi
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Phone size={16} className="text-orange-500" />
              +91 98765 43210
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Clock size={16} className="text-orange-500" />
              Open Daily: 11:00 AM - 11:30 PM
            </div>
          </div>
        </div>

        {/* Operating hours table */}
        <div className="bg-slate-900/35 border border-slate-900 p-8 rounded-3xl flex flex-col justify-between">
          <h3 className="font-extrabold text-base text-white mb-4">Hours of Operations</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between border-b border-slate-900 pb-2 text-xs">
              <span className="text-slate-400">Monday - Friday</span>
              <span className="text-white font-bold">11:00 AM - 11:00 PM</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-2 text-xs">
              <span className="text-slate-400">Saturday</span>
              <span className="text-white font-bold">11:00 AM - 12:00 AM</span>
            </div>
            <div className="flex justify-between pb-2 text-xs">
              <span className="text-slate-400">Sunday</span>
              <span className="text-white font-bold">10:00 AM - 11:30 PM</span>
            </div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold p-3.5 rounded-2xl flex items-center justify-center gap-2 mt-6">
            <Sparkles size={12} /> Table Reservations recommended for weekends.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 py-10 bg-slate-950 z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-premium p-1.5 rounded-lg text-white">
              <UtensilsCrossed size={16} />
            </div>
            <span className="font-extrabold text-base text-white">BiteQR Cafe</span>
          </div>

          <p className="text-[11px] text-slate-500">&copy; {new Date().getFullYear()} BiteQR Restaurant Group. All rights reserved.</p>

          <div className="flex items-center gap-4.5">
            <a href="#" className="text-slate-500 hover:text-orange-400 transition" aria-label="Facebook">
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
              </svg>
            </a>
            <a href="#" className="text-slate-500 hover:text-orange-400 transition" aria-label="Instagram">
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <span className="text-slate-800">|</span>
            <button
              onClick={() => navigate('/admin')}
              className="text-[10px] text-slate-500 hover:text-white font-bold uppercase tracking-wider transition cursor-pointer"
            >
              Control Panel
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

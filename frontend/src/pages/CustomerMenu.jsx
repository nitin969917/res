import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, Search, X, Plus, Minus, Flame, 
  Leaf, AlertTriangle, ChevronRight, Info, CheckCircle2 
} from 'lucide-react';

export default function CustomerMenu() {
  const [searchParams] = useSearchParams();
  const tableParam = searchParams.get('table');
  const isDelivery = searchParams.get('delivery') === 'true';
  const deliveryAddress = searchParams.get('address') || '';

  const {
    settings,
    categories,
    items,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [spicyOnly, setSpicyOnly] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderNote, setOrderNote] = useState('');
  const [customTable, setCustomTable] = useState('Table 1');

  const currentTable = isDelivery
    ? `Delivery – ${deliveryAddress || 'Address not provided'}`
    : (tableParam || customTable);

  // Filter items
  const filteredItems = items.filter(item => {
    // Availability filter - we want to show out of stock items too but disabled
    // Category filter
    if (selectedCategory !== 'all' && item.category?._id !== selectedCategory && item.category !== selectedCategory) {
      return false;
    }
    // Search query
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !item.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Veg only
    if (vegOnly && !item.isVeg) {
      return false;
    }
    // Spicy only
    if (spicyOnly && !item.isSpicy) {
      return false;
    }
    return true;
  });

  // Calculate totals
  const cartSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const taxRate = settings.taxRate || 0;
  const taxAmount = (cartSubtotal * taxRate) / 100;
  const cartTotal = cartSubtotal + taxAmount;
  const totalItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Send order to WhatsApp
  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    let orderText = isDelivery
      ? `*🛵 DELIVERY ORDER*\n📍 Address: ${deliveryAddress}\n`
      : `*🍽️ NEW ORDER - ${currentTable.toUpperCase()}*\n`;
    orderText += `=========================\n\n`;

    cart.forEach(item => {
      const typeBadge = item.isVeg ? '🟢' : item.isEgg ? '🟡' : '🔴';
      orderText += `${typeBadge} *${item.quantity}x ${item.name}*\n`;
      orderText += `   Price: ${settings.currencySymbol}${item.price} each\n`;
      orderText += `   Subtotal: ${settings.currencySymbol}${item.price * item.quantity}\n\n`;
    });

    orderText += `=========================\n`;
    orderText += `Subtotal: ${settings.currencySymbol}${cartSubtotal.toFixed(2)}\n`;
    if (taxRate > 0) {
      orderText += `Tax (${taxRate}%): ${settings.currencySymbol}${taxAmount.toFixed(2)}\n`;
    }
    orderText += `*Total Amount: ${settings.currencySymbol}${cartTotal.toFixed(2)}*\n\n`;

    if (orderNote.trim()) {
      orderText += `📝 *Note from customer:*\n`;
      orderText += `_${orderNote.trim()}_\n\n`;
    }

    orderText += `📍 Ordered via BiteQR Menu`;

    // Clean phone number: remove any non-digit character except +
    const cleanPhone = settings.phoneNumber.replace(/[^\d+]/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(orderText)}`;
    
    // Open in new window
    window.open(whatsappUrl, '_blank');
    clearCart();
    setOrderNote('');
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans pb-24">
      {/* Header banner */}
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings.logoUrl && (
              <img 
                src={settings.logoUrl} 
                alt={settings.restaurantName} 
                className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/20 shadow-sm"
              />
            )}
            <div>
              <h1 className="font-extrabold text-lg tracking-tight text-slate-900">{settings.restaurantName}</h1>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Fresh & Hot Delivery
              </p>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-xl flex flex-col items-center">
            <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">Table</span>
            <span className="text-sm font-black text-orange-950">{currentTable}</span>
          </div>
        </div>
      </header>

      {/* Main Body container */}
      <main className="max-w-md mx-auto w-full px-4 flex-1 mt-4">
        {/* Table Param Alert if missing */}
        {!tableParam && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col gap-2 shadow-sm">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <AlertTriangle size={18} />
              No table QR detected
            </div>
            <p className="text-xs text-amber-700 leading-relaxed">
              You accessed this menu without scanning a table QR code. For ordering, please pick a table below:
            </p>
            <div className="flex gap-2 mt-1">
              <select 
                value={customTable} 
                onChange={(e) => setCustomTable(e.target.value)}
                className="bg-white border border-amber-200 text-xs rounded-xl px-3 py-1.5 font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 flex-1 shadow-sm"
              >
                <option value="Table 1">Table 1</option>
                <option value="Table 2">Table 2</option>
                <option value="Table 3">Table 3</option>
                <option value="Table 4">Table 4</option>
                <option value="Table 5">Table 5</option>
              </select>
              <div className="bg-amber-100 text-amber-800 font-bold text-[10px] px-2.5 py-1.5 rounded-xl flex items-center justify-center uppercase tracking-wider">
                Demo Mode
              </div>
            </div>
          </div>
        )}

        {/* Search bar & filter pill controls */}
        <div className="flex flex-col gap-3 mb-5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search delicious food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm transition-all-300"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all-300 cursor-pointer shadow-sm ${
                vegOnly 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Veg Only
            </button>
            <button
              onClick={() => setSpicyOnly(!spicyOnly)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all-300 cursor-pointer shadow-sm ${
                spicyOnly 
                  ? 'bg-red-50 border-red-200 text-red-700 font-semibold' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Flame size={12} className="text-red-500 fill-red-500" />
              Spicy Only
            </button>
          </div>
        </div>

        {/* Categories Bar (Horizontal Swipe) */}
        <div className="mb-6 -mx-4 px-4 overflow-x-auto no-scrollbar flex items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap cursor-pointer transition-all-300 shadow-sm ${
              selectedCategory === 'all'
                ? 'bg-orange-500 text-white shadow-orange-500/10'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap cursor-pointer transition-all-300 shadow-sm ${
                selectedCategory === cat._id
                  ? 'bg-orange-500 text-white shadow-orange-500/10'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="flex flex-col gap-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm px-6">
              <ShoppingBag size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="font-bold text-slate-700 text-lg mb-1">No items found</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                We couldn't find any items matching your preferences. Try resetting your search or filters!
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const cartItem = cart.find((i) => i._id === item._id);
              return (
                <div
                  key={item._id}
                  className={`bg-white rounded-3xl p-3.5 border border-slate-100 shadow-sm flex gap-4 transition-all-300 relative ${
                    !item.isAvailable ? 'opacity-65 select-none' : ''
                  }`}
                >
                  {/* Food image */}
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] text-white font-bold uppercase tracking-wider">
                        Sold Out
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="font-extrabold text-sm text-slate-900 leading-tight">{item.name}</h3>
                        {/* Food diet tags */}
                        <div className="flex gap-1 flex-shrink-0">
                          {item.isVeg && (
                            <span className="w-4 h-4 border border-emerald-500 rounded bg-white flex items-center justify-center" title="Veg">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            </span>
                          )}
                          {item.isEgg && (
                            <span className="w-4 h-4 border border-amber-500 rounded bg-white flex items-center justify-center" title="Egg">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            </span>
                          )}
                          {item.isSpicy && (
                            <span className="w-4 h-4 border border-red-500 rounded bg-white flex items-center justify-center" title="Spicy">
                              <Flame size={10} className="text-red-500 fill-red-500" />
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-extrabold text-sm text-slate-900">
                        {settings.currencySymbol}{item.price}
                      </span>

                      {/* Add button */}
                      {item.isAvailable && (
                        <div className="flex items-center">
                          {cartItem ? (
                            <div className="flex items-center bg-orange-50 border border-orange-200 rounded-xl px-1 py-1 shadow-sm">
                              <button
                                onClick={() => removeFromCart(item)}
                                className="w-7 h-7 bg-white hover:bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold transition-all-300 cursor-pointer"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="px-3 text-xs font-black text-orange-950">{cartItem.quantity}</span>
                              <button
                                onClick={() => addToCart(item)}
                                className="w-7 h-7 bg-white hover:bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold transition-all-300 cursor-pointer"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(item)}
                              className="px-4 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-xs font-black text-orange-600 rounded-xl transition-all-300 cursor-pointer shadow-sm"
                            >
                              ADD +
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Floating Bottom Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 p-4 z-40 max-w-md mx-auto">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-gradient-premium hover:bg-gradient-premium-hover text-white p-4 rounded-2xl flex items-center justify-between shadow-xl shadow-orange-500/25 transition-all-300 transform active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <ShoppingBag size={18} />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-orange-100 block font-bold uppercase tracking-wider">
                  {totalItemsCount} item{totalItemsCount > 1 ? 's' : ''} added
                </span>
                <span className="font-extrabold text-sm">View Cart Summary</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base">
                {settings.currencySymbol}{cartTotal.toFixed(2)}
              </span>
              <ChevronRight size={16} />
            </div>
          </button>
        </div>
      )}

      {/* Cart Drawer BackDrop */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 max-w-md mx-auto"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Cart Drawer Bottom Sheet */}
      <div
        className={`fixed bottom-0 inset-x-0 max-w-md mx-auto bg-white rounded-t-[32px] shadow-2xl z-50 transform transition-transform duration-300 max-h-[85vh] flex flex-col ${
          isCartOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag handle line */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-3 flex-shrink-0"></div>

        {/* Header */}
        <div className="px-6 pb-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="text-orange-500" size={20} />
            <h2 className="font-black text-lg text-slate-900">Your Basket</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-all-300 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Cart items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {cart.map((item) => (
            <div key={item._id} className="flex items-center justify-between border-b border-slate-50 pb-3">
              <div className="flex-1 pr-3">
                <h4 className="font-bold text-sm text-slate-800 leading-snug">{item.name}</h4>
                <span className="text-xs text-slate-500 font-medium mt-0.5 block">
                  {settings.currencySymbol}{item.price} each
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* Quantity adjuster */}
                <div className="flex items-center bg-slate-100 rounded-xl p-1">
                  <button
                    onClick={() => removeFromCart(item)}
                    className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-slate-700 transition-all cursor-pointer shadow-sm"
                  >
                    <Minus size={10} />
                  </button>
                  <span className="px-2.5 text-xs font-extrabold text-slate-800">{item.quantity}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-slate-700 transition-all cursor-pointer shadow-sm"
                  >
                    <Plus size={10} />
                  </button>
                </div>
                <span className="font-bold text-sm text-slate-900 w-16 text-right">
                  {settings.currencySymbol}{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}

          {/* Add special instructions */}
          <div className="mt-2">
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              Special Instructions / Notes
            </label>
            <textarea
              placeholder="E.g., No onion/garlic, make it extra spicy, serve drinks first..."
              rows={2}
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white resize-none shadow-inner"
            ></textarea>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-slate-50 p-6 border-t border-slate-100 flex-shrink-0 flex flex-col gap-2.5">
          <div className="flex justify-between text-xs text-slate-500 font-semibold">
            <span>Subtotal</span>
            <span>{settings.currencySymbol}{cartSubtotal.toFixed(2)}</span>
          </div>
          {taxRate > 0 && (
            <div className="flex justify-between text-xs text-slate-500 font-semibold">
              <span>GST/Restaurant Tax ({taxRate}%)</span>
              <span>{settings.currencySymbol}{taxAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-slate-900 border-t border-slate-200/60 pt-3 mt-1">
            <span className="font-black text-sm uppercase tracking-wide">Grand Total</span>
            <span className="font-black text-lg text-orange-600">
              {settings.currencySymbol}{cartTotal.toFixed(2)}
            </span>
          </div>

          {/* Place order button */}
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-gradient-premium hover:bg-gradient-premium-hover text-white py-4 rounded-2xl font-black text-sm mt-3 tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <ShoppingBag size={18} />
            SEND ORDER VIA WHATSAPP
          </button>
          <p className="text-[10px] text-center text-slate-400 font-medium flex items-center justify-center gap-1 mt-1">
            <Info size={10} />
            This will open WhatsApp pre-filled with your order details.
          </p>
        </div>
      </div>
    </div>
  );
}

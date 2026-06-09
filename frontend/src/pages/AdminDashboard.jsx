import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  FolderPlus, Plus, Edit, Trash2, Settings, QrCode, 
  UtensilsCrossed, LogOut, ToggleLeft, ToggleRight,
  Info, Leaf, Flame, Image, Download, Save, RefreshCw, Upload, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import QRTabSection from '../components/QRTabSection';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const {
    settings,
    categories,
    items,
    tables,
    user,
    isDemoMode,
    logoutAdmin,
    updateSettings,
    addCategory,
    updateCategory,
    deleteCategory,
    addItem,
    updateItem,
    deleteItem,
    addTable,
    deleteTable
  } = useApp();

  const [activeTab, setActiveTab] = useState('items');

  // Category State
  const [catName, setCatName] = useState('');
  const [catOrder, setCatOrder] = useState('0');
  const [editingCat, setEditingCat] = useState(null);

  // Item State
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCat, setItemCat] = useState('');
  const [itemImgUrl, setItemImgUrl] = useState('');
  const [itemImgFile, setItemImgFile] = useState(null);
  const [itemAvailable, setItemAvailable] = useState(true);
  const [itemVeg, setItemVeg] = useState(false);
  const [itemEgg, setItemEgg] = useState(false);
  const [itemSpicy, setItemSpicy] = useState(false);

  // Table State (managed inside QRTabSection now)

  // Settings State
  const [restName, setRestName] = useState(settings.restaurantName);
  const [restPhone, setRestPhone] = useState(settings.phoneNumber);
  const [restCurrency, setRestCurrency] = useState(settings.currency);
  const [restSymbol, setRestSymbol] = useState(settings.currencySymbol);
  const [restAddress, setRestAddress] = useState(settings.address);
  const [restTax, setRestTax] = useState(settings.taxRate);
  const [restLogoUrl, setRestLogoUrl] = useState(settings.logoUrl);
  const [restLogoFile, setRestLogoFile] = useState(null);

  // Handle Logout
  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin');
  };

  // CATEGORY ACTIONS
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return;

    let success;
    if (editingCat) {
      success = await updateCategory(editingCat._id, catName, catOrder);
    } else {
      success = await addCategory(catName, catOrder);
    }

    if (success) {
      setCatName('');
      setCatOrder('0');
      setEditingCat(null);
    }
  };

  const handleEditCategoryClick = (cat) => {
    setEditingCat(cat);
    setCatName(cat.name);
    setCatOrder(cat.order.toString());
  };

  // ITEM ACTIONS
  const handleOpenNewItemModal = () => {
    setEditingItem(null);
    setItemName('');
    setItemDesc('');
    setItemPrice('');
    setItemCat(categories[0]?._id || '');
    setItemImgUrl('');
    setItemImgFile(null);
    setItemAvailable(true);
    setItemVeg(false);
    setItemEgg(false);
    setItemSpicy(false);
    setIsItemModalOpen(true);
  };

  const handleOpenEditItemModal = (item) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemDesc(item.description || '');
    setItemPrice(item.price.toString());
    setItemCat(item.category?._id || item.category || '');
    setItemImgUrl(item.image || '');
    setItemImgFile(null);
    setItemAvailable(item.isAvailable);
    setItemVeg(item.isVeg);
    setItemEgg(item.isEgg);
    setItemSpicy(item.isSpicy);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!itemName.trim() || !itemPrice || !itemCat) {
      toast.error('Required fields are missing.');
      return;
    }

    const formData = new FormData();
    formData.append('name', itemName);
    formData.append('description', itemDesc);
    formData.append('price', itemPrice);
    formData.append('category', itemCat);
    formData.append('isAvailable', itemAvailable);
    formData.append('isVeg', itemVeg);
    formData.append('isEgg', itemEgg);
    formData.append('isSpicy', itemSpicy);
    formData.append('image', itemImgUrl);
    
    if (itemImgFile) {
      formData.append('imageFile', itemImgFile);
    }

    let success;
    if (editingItem) {
      success = await updateItem(editingItem._id, formData);
    } else {
      success = await addItem(formData);
    }

    if (success) {
      setIsItemModalOpen(false);
    }
  };

  const handleToggleAvailability = async (item) => {
    const formData = new FormData();
    formData.append('isAvailable', !item.isAvailable);
    await updateItem(item._id, formData);
  };

  // TABLE ACTIONS are handled inside QRTabSection component

  // SETTINGS ACTION
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('restaurantName', restName);
    formData.append('phoneNumber', restPhone);
    formData.append('currency', restCurrency);
    formData.append('currencySymbol', restSymbol);
    formData.append('address', restAddress);
    formData.append('taxRate', restTax);
    formData.append('logoUrl', restLogoUrl);
    
    if (restLogoFile) {
      formData.append('logoFile', restLogoFile);
    }

    await updateSettings(formData);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* Top Banner */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-premium p-2.5 rounded-xl text-white shadow-md">
              <UtensilsCrossed size={20} />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
                BiteQR Admin
                {isDemoMode && (
                  <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                    Demo Mode
                  </span>
                )}
              </h1>
              <p className="text-[10px] text-slate-400">Managing: {settings.restaurantName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden md:flex items-center gap-2.5 bg-slate-800/60 border border-slate-800 px-3.5 py-1.5 rounded-xl">
                {user.avatar && (
                  <img src={user.avatar} alt={user.displayName} className="w-6 h-6 rounded-full border border-orange-500/20" />
                )}
                <span className="text-xs font-bold text-slate-200">{user.displayName}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white px-3.5 py-2 rounded-xl border border-red-500/20 hover:border-red-600 transition-all duration-300 cursor-pointer shadow-sm"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 flex flex-row md:flex-col gap-2 md:gap-1.5 overflow-x-auto no-scrollbar pb-3 md:pb-0">
          <button
            onClick={() => setActiveTab('items')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 w-full cursor-pointer ${
              activeTab === 'items'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/15'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <UtensilsCrossed size={16} />
            Menu Items
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 w-full cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/15'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FolderPlus size={16} />
            Categories
          </button>
          <button
            onClick={() => setActiveTab('tables')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 w-full cursor-pointer ${
              activeTab === 'tables'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/15'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <QrCode size={16} />
            Table QR Generator
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 w-full cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/15'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Settings size={16} />
            Settings
          </button>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 bg-white rounded-[32px] p-6 border border-slate-200/60 shadow-sm min-h-[500px]">
          {/* ================= CATEGORIES TAB ================= */}
          {activeTab === 'categories' && (
            <div className="animate-fade-in flex flex-col gap-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Manage Categories</h2>
                  <p className="text-xs text-slate-500 mt-1">Organize your food items into simple browseable groups.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8 items-start">
                {/* Category Form */}
                <form onSubmit={handleSaveCategory} className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex flex-col gap-4">
                  <h3 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2">
                    {editingCat ? 'Edit Category' : 'Create Category'}
                  </h3>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5 tracking-wider">Category Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Italian Pizzas"
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/15 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5 tracking-wider">Display Order</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={catOrder}
                      onChange={(e) => setCatOrder(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/15 focus:border-orange-500"
                    />
                  </div>
                  <div className="flex gap-2.5 mt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
                    >
                      {editingCat ? 'Update' : 'Create'}
                    </button>
                    {editingCat && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCat(null);
                          setCatName('');
                          setCatOrder('0');
                        }}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                {/* Categories Table list */}
                <div className="md:col-span-2 flex flex-col gap-3">
                  <div className="border border-slate-150 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse bg-white">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-150 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          <th className="py-3.5 px-4">Order</th>
                          <th className="py-3.5 px-4">Category Name</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.length === 0 ? (
                          <tr>
                            <td colSpan="3" className="text-center py-12 text-slate-400 text-xs">
                              No categories created yet. Build one to catalog your menu items!
                            </td>
                          </tr>
                        ) : (
                          categories.map((cat) => (
                            <tr key={cat._id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50">
                              <td className="py-3 px-4 font-black text-xs text-orange-600">{cat.order}</td>
                              <td className="py-3 px-4 font-bold text-xs text-slate-900">{cat.name}</td>
                              <td className="py-3 px-4 text-right flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleEditCategoryClick(cat)}
                                  className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm('Deleting this category will delete all items inside it. Proceed?')) {
                                      deleteCategory(cat._id);
                                    }
                                  }}
                                  className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= MENU ITEMS TAB ================= */}
          {activeTab === 'items' && (
            <div className="animate-fade-in flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Menu Catalog</h2>
                  <p className="text-xs text-slate-500 mt-1">Add, modify, and review your digital culinary catalog.</p>
                </div>
                <button
                  onClick={handleOpenNewItemModal}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4.5 py-3 rounded-2xl flex items-center gap-2 shadow-md cursor-pointer transition"
                >
                  <Plus size={16} />
                  Add New Item
                </button>
              </div>

              {/* Items list sorted by Category */}
              {items.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
                  <UtensilsCrossed size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="font-bold text-slate-700 text-lg mb-1">Menu is empty</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Create your categories first, then add menu items with details, tags, and photos to publish.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {/* Group items by Category */}
                  {categories.map((cat) => {
                    const catItems = items.filter(
                      (i) => i.category?._id === cat._id || i.category === cat._id
                    );
                    if (catItems.length === 0) return null;
                    
                    return (
                      <div key={cat._id} className="flex flex-col gap-3">
                        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                          <span className="w-1.5 h-3 bg-orange-500 rounded-full"></span>
                          {cat.name}
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full font-bold">
                            {catItems.length}
                          </span>
                        </h3>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {catItems.map((item) => (
                            <div
                              key={item._id}
                              className={`bg-white border rounded-2xl p-3 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between ${
                                !item.isAvailable ? 'border-slate-200 bg-slate-50/50' : 'border-slate-100'
                              }`}
                            >
                              <div>
                                {/* Photo */}
                                <div className="w-full h-32 rounded-xl bg-slate-100 overflow-hidden mb-3 relative">
                                  <img
                                    src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
                                    alt={item.name}
                                    className={`w-full h-full object-cover ${!item.isAvailable ? 'grayscale opacity-70' : ''}`}
                                  />
                                  <div className="absolute top-2 right-2 flex gap-1">
                                    {item.isVeg && (
                                      <span className="w-5 h-5 border border-emerald-500 rounded bg-white flex items-center justify-center shadow-sm" title="Veg">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                      </span>
                                    )}
                                    {item.isEgg && (
                                      <span className="w-5 h-5 border border-amber-500 rounded bg-white flex items-center justify-center shadow-sm" title="Egg">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                      </span>
                                    )}
                                    {item.isSpicy && (
                                      <span className="w-5 h-5 border border-red-500 rounded bg-white flex items-center justify-center shadow-sm" title="Spicy">
                                        <Flame size={10} className="text-red-500 fill-red-500" />
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{item.name}</h4>
                                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                  {item.description}
                                </p>
                              </div>

                              <div className="flex items-center justify-between border-t border-slate-100/80 pt-2.5 mt-3">
                                <span className="font-black text-sm text-slate-900">
                                  {settings.currencySymbol}{item.price}
                                </span>
                                
                                <div className="flex items-center gap-1.5">
                                  {/* Availability toggle */}
                                  <button
                                    onClick={() => handleToggleAvailability(item)}
                                    className="p-1 text-slate-500 hover:text-slate-800 transition cursor-pointer"
                                    title={item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                                  >
                                    {item.isAvailable ? (
                                      <ToggleRight size={22} className="text-emerald-500" />
                                    ) : (
                                      <ToggleLeft size={22} className="text-slate-400" />
                                    )}
                                  </button>
                                  {/* Edit button */}
                                  <button
                                    onClick={() => handleOpenEditItemModal(item)}
                                    className="p-1.5 bg-slate-50 hover:bg-slate-150 text-slate-600 rounded-lg cursor-pointer transition border border-slate-200/40"
                                    title="Edit details"
                                  >
                                    <Edit size={12} />
                                  </button>
                                  {/* Delete button */}
                                  <button
                                    onClick={() => {
                                      if (confirm('Delete this item from menu?')) {
                                        deleteItem(item._id);
                                      }
                                    }}
                                    className="p-1.5 bg-red-50/50 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer transition border border-red-100/40"
                                    title="Remove"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= TABLE QR GENERATOR TAB ================= */}
          {activeTab === 'tables' && (
            <QRTabSection
              tables={tables}
              settings={settings}
              addTable={addTable}
              deleteTable={deleteTable}
            />
          )}

          {/* ================= SETTINGS TAB ================= */}
          {activeTab === 'settings' && (
            <div className="animate-fade-in flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">Restaurant Settings</h2>
                <p className="text-xs text-slate-500 mt-1">Configure restaurant contact numbers, currency details, taxes, and branding.</p>
              </div>

              <div className="grid lg:grid-cols-5 gap-8 items-start">
                {/* Form */}
                <form onSubmit={handleSaveSettings} className="lg:col-span-3 flex flex-col gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5 tracking-wider">Restaurant Name</label>
                      <input
                        type="text"
                        value={restName}
                        onChange={(e) => setRestName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/15 focus:border-orange-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5 tracking-wider">WhatsApp Phone Number *</label>
                      <input
                        type="text"
                        value={restPhone}
                        placeholder="e.g. 919876543210 (with country code)"
                        onChange={(e) => setRestPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/15 focus:border-orange-500 focus:bg-white"
                      />
                      <span className="text-[9px] text-slate-400 mt-1 block">Include country code without + or spaces.</span>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5 tracking-wider">Currency Code</label>
                      <input
                        type="text"
                        value={restCurrency}
                        placeholder="INR, USD, EUR"
                        onChange={(e) => setRestCurrency(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/15 focus:border-orange-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5 tracking-wider">Currency Symbol</label>
                      <input
                        type="text"
                        value={restSymbol}
                        placeholder="₹, $, €"
                        onChange={(e) => setRestSymbol(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/15 focus:border-orange-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5 tracking-wider">GST/Tax Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={restTax}
                        placeholder="5"
                        onChange={(e) => setRestTax(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/15 focus:border-orange-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5 tracking-wider">Restaurant Address</label>
                    <input
                      type="text"
                      value={restAddress}
                      onChange={(e) => setRestAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/15 focus:border-orange-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5 tracking-wider">Logo Image URL</label>
                      <input
                        type="text"
                        value={restLogoUrl}
                        onChange={(e) => setRestLogoUrl(e.target.value)}
                        placeholder="Paste image URL here"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/15 focus:border-orange-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5 tracking-wider">Or Upload Logo file</label>
                      <div className="relative w-full border border-slate-200 border-dashed bg-slate-50 hover:bg-slate-100 rounded-xl px-4 py-2.5 flex items-center justify-between cursor-pointer transition">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setRestLogoFile(e.target.files[0]);
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <span className="text-[11px] text-slate-500 truncate pr-4">
                          {restLogoFile ? restLogoFile.name : 'Select branding image...'}
                        </span>
                        <Upload size={14} className="text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer mt-3"
                  >
                    <Save size={14} />
                    Save Settings
                  </button>
                </form>

                {/* Dynamic Preview panel - WOW factor! */}
                <div className="lg:col-span-2 bg-[#f1f5f9] border border-slate-200 p-4 rounded-3xl flex flex-col items-center">
                  <span className="text-[10px] font-extrabold uppercase text-slate-500 mb-2 tracking-wider flex items-center gap-1.5 self-start">
                    <Info size={12} /> Mobile Header Preview
                  </span>
                  
                  {/* Mock Phone Container */}
                  <div className="w-full max-w-[280px] bg-white border-4 border-slate-900 rounded-[32px] overflow-hidden shadow-lg flex flex-col relative aspect-[9/16]">
                    {/* Speaker notch */}
                    <div className="w-16 h-3.5 bg-slate-900 rounded-b-xl mx-auto absolute top-0 inset-x-0 z-20"></div>
                    
                    {/* Header */}
                    <div className="bg-white border-b border-slate-100 shadow-sm p-3 pt-6 flex items-center justify-between z-10">
                      <div className="flex items-center gap-2">
                        {restLogoFile ? (
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-black text-orange-500 border border-orange-200">Logo</div>
                        ) : restLogoUrl ? (
                          <img src={restLogoUrl} alt="Logo" className="w-8 h-8 rounded-full object-cover border border-orange-500/20" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">Logo</div>
                        )}
                        <div>
                          <h4 className="font-extrabold text-[10px] text-slate-900 truncate max-w-[120px]">{restName || 'BiteQR Cafe'}</h4>
                          <span className="text-[7px] text-slate-500 flex items-center gap-0.5 mt-0.5">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                            Fresh Delivery
                          </span>
                        </div>
                      </div>
                      <div className="bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-lg text-center leading-none">
                        <span className="text-[6px] text-orange-500 font-bold uppercase block">Table</span>
                        <span className="text-[8px] font-black text-orange-950">Table 3</span>
                      </div>
                    </div>

                    {/* Mock body */}
                    <div className="flex-1 bg-slate-50 p-3 flex flex-col gap-3.5 overflow-hidden">
                      {/* Search mock */}
                      <div className="w-full bg-white border border-slate-200 rounded-lg p-1.5 flex items-center gap-1.5">
                        <div className="w-3 h-3 bg-slate-300 rounded-full flex-shrink-0"></div>
                        <div className="w-24 h-2 bg-slate-200 rounded"></div>
                      </div>
                      
                      {/* Categories mock */}
                      <div className="flex gap-1.5 overflow-hidden">
                        <div className="px-2.5 py-1 bg-orange-500 rounded-full text-[7px] font-extrabold text-white">Main</div>
                        <div className="px-2.5 py-1 bg-white border border-slate-200 rounded-full text-[7px] text-slate-600">Drinks</div>
                        <div className="px-2.5 py-1 bg-white border border-slate-200 rounded-full text-[7px] text-slate-600">Deserts</div>
                      </div>

                      {/* Mock Item */}
                      <div className="bg-white rounded-xl p-2 border border-slate-100 shadow-sm flex gap-2">
                        <div className="w-12 h-12 rounded-lg bg-slate-200 flex-shrink-0"></div>
                        <div className="flex-1 flex flex-col justify-between py-0.5 leading-none">
                          <div>
                            <div className="h-2.5 bg-slate-300 rounded w-16 mb-1"></div>
                            <div className="h-1.5 bg-slate-200 rounded w-20"></div>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <div className="h-2 bg-slate-800 rounded w-6"></div>
                            <div className="h-3.5 bg-orange-50 border border-orange-200 rounded px-1.5 py-0.5 text-[6px] text-orange-600 font-bold">ADD +</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= EDIT MENU ITEM MODAL ================= */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative animate-fade-in">
            <button
              onClick={() => setIsItemModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full cursor-pointer transition"
            >
              <X size={18} />
            </button>

            <h3 className="font-extrabold text-lg text-slate-900 mb-6 border-b border-slate-100 pb-3 flex items-center gap-2">
              <UtensilsCrossed size={18} className="text-orange-500" />
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h3>

            <form onSubmit={handleSaveItem} className="flex flex-col gap-4.5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5 tracking-wider">Item Name *</label>
                  <input
                    type="text"
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. Pasta Primavera"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/15 focus:border-orange-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5 tracking-wider">Price * ({settings.currencySymbol})</label>
                  <input
                    type="number"
                    required
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    placeholder="250"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/15 focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5 tracking-wider">Category *</label>
                <select
                  required
                  value={itemCat}
                  onChange={(e) => setItemCat(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/15 focus:border-orange-500 focus:bg-white"
                >
                  <option value="" disabled>Select category...</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5 tracking-wider">Description</label>
                <textarea
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  placeholder="Tell customers about the flavor, ingredients, and portions..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/15 focus:border-orange-500 focus:bg-white resize-none"
                ></textarea>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5 tracking-wider">Image Link URL</label>
                  <input
                    type="text"
                    value={itemImgUrl}
                    onChange={(e) => setItemImgUrl(e.target.value)}
                    placeholder="Paste food image URL"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/15 focus:border-orange-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5 tracking-wider">Or Upload food photo</label>
                  <div className="relative w-full border border-slate-200 border-dashed bg-slate-50 hover:bg-slate-100 rounded-xl px-4 py-2.5 flex items-center justify-between cursor-pointer transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setItemImgFile(e.target.files[0]);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-500 truncate pr-4">
                      {itemImgFile ? itemImgFile.name : 'Select file...'}
                    </span>
                    <Upload size={14} className="text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Diet Tags and Availability */}
              <div className="bg-slate-50 p-4.5 rounded-2xl flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isVeg"
                    checked={itemVeg}
                    onChange={(e) => setItemVeg(e.target.checked)}
                    className="w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="isVeg" className="text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer">
                    <span className="w-2.5 h-2.5 border border-emerald-500 bg-white rounded flex items-center justify-center"><span className="w-1 h-1 rounded-full bg-emerald-600"></span></span>
                    Veg
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isEgg"
                    checked={itemEgg}
                    onChange={(e) => setItemEgg(e.target.checked)}
                    className="w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="isEgg" className="text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer">
                    <span className="w-2.5 h-2.5 border border-amber-500 bg-white rounded flex items-center justify-center"><span className="w-1 h-1 rounded-full bg-amber-500"></span></span>
                    Contains Egg
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isSpicy"
                    checked={itemSpicy}
                    onChange={(e) => setItemSpicy(e.target.checked)}
                    className="w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="isSpicy" className="text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer">
                    <Flame size={12} className="text-red-500 fill-red-500" />
                    Spicy
                  </label>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={itemAvailable}
                    onChange={(e) => setItemAvailable(e.target.checked)}
                    className="w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="isAvailable" className="text-xs font-bold text-slate-700 cursor-pointer">
                    In Stock (Available)
                  </label>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl cursor-pointer transition shadow-md"
                >
                  {editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

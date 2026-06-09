import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

const AppContext = createContext();

// In production, API calls go to /api (proxied by Nginx to the backend container).
// VITE_API_URL can override this for local development.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const AppProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper for requests with credentials
  const apiFetch = async (endpoint, options = {}) => {
    options.credentials = 'include';
    if (!options.headers) options.headers = {};
    if (!(options.body instanceof FormData) && !options.headers['Content-Type']) {
      options.headers['Content-Type'] = 'application/json';
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }
    return response.json();
  };

  // Fetch all initial data
  const initApp = async () => {
    setLoading(true);
    try {
      const [authData, settingsData, categoriesData, itemsData, tablesData] = await Promise.all([
        apiFetch('/auth/current_user').catch(() => ({ isAuthenticated: false })),
        apiFetch('/settings'),
        apiFetch('/categories'),
        apiFetch('/items'),
        apiFetch('/tables'),
      ]);

      if (authData.isAuthenticated) {
        setUser(authData.user);
        setIsAuthenticated(true);
      }
      setSettings(settingsData);
      setCategories(categoriesData);
      setItems(itemsData);
      setTables(tablesData);
    } catch (error) {
      console.error('Failed to load app data:', error.message);
      toast.error('Unable to connect to server. Please try again.', { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { initApp(); }, []);

  // Cart
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        toast.success(`Increased ${item.name} quantity`);
        return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      toast.success(`Added ${item.name} to cart`);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      toast.error(`Removed ${item.name} from cart`);
      return prev.filter(i => i._id !== item._id);
    });
  };

  const updateCartQuantity = (itemId, qty) => {
    if (qty <= 0) setCart(prev => prev.filter(i => i._id !== itemId));
    else setCart(prev => prev.map(i => i._id === itemId ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setCart([]);

  // Auth
  const logoutAdmin = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    } catch {
      toast.error('Logout failed');
    }
  };

  // Settings
  const updateSettings = async (formData) => {
    try {
      const data = await apiFetch('/settings', { method: 'PUT', body: formData });
      setSettings(data);
      toast.success('Restaurant settings saved!');
      return true;
    } catch (error) {
      toast.error(error.message || 'Failed to save settings');
      return false;
    }
  };

  // Categories
  const addCategory = async (name, order) => {
    try {
      const data = await apiFetch('/categories', { method: 'POST', body: JSON.stringify({ name, order }) });
      setCategories(prev => [...prev, data]);
      toast.success('Category added!');
      return true;
    } catch (error) { toast.error(error.message || 'Failed to add category'); return false; }
  };

  const updateCategory = async (id, name, order) => {
    try {
      const data = await apiFetch(`/categories/${id}`, { method: 'PUT', body: JSON.stringify({ name, order }) });
      setCategories(prev => prev.map(c => c._id === id ? data : c));
      toast.success('Category updated!');
      return true;
    } catch (error) { toast.error(error.message || 'Failed to update category'); return false; }
  };

  const deleteCategory = async (id) => {
    try {
      await apiFetch(`/categories/${id}`, { method: 'DELETE' });
      setCategories(prev => prev.filter(c => c._id !== id));
      setItems(prev => prev.filter(item => item.category !== id));
      toast.success('Category deleted!');
      return true;
    } catch (error) { toast.error(error.message || 'Failed to delete category'); return false; }
  };

  // Items
  const addItem = async (formData) => {
    try {
      const data = await apiFetch('/items', { method: 'POST', body: formData });
      setItems(prev => [...prev, data]);
      toast.success('Menu item created!');
      return true;
    } catch (error) { toast.error(error.message || 'Failed to create menu item'); return false; }
  };

  const updateItem = async (id, formData) => {
    try {
      const data = await apiFetch(`/items/${id}`, { method: 'PUT', body: formData });
      setItems(prev => prev.map(item => item._id === id ? data : item));
      toast.success('Menu item updated!');
      return true;
    } catch (error) { toast.error(error.message || 'Failed to update menu item'); return false; }
  };

  const deleteItem = async (id) => {
    try {
      await apiFetch(`/items/${id}`, { method: 'DELETE' });
      setItems(prev => prev.filter(item => item._id !== id));
      toast.success('Menu item deleted!');
      return true;
    } catch (error) { toast.error(error.message || 'Failed to delete menu item'); return false; }
  };

  // Tables
  const addTable = async (number) => {
    try {
      const data = await apiFetch('/tables', { method: 'POST', body: JSON.stringify({ number }) });
      setTables(prev => [...prev, data]);
      toast.success('Table added!');
      return true;
    } catch (error) { toast.error(error.message || 'Failed to add table'); return false; }
  };

  const deleteTable = async (id) => {
    try {
      await apiFetch(`/tables/${id}`, { method: 'DELETE' });
      setTables(prev => prev.filter(t => t._id !== id));
      toast.success('Table deleted!');
      return true;
    } catch (error) { toast.error(error.message || 'Failed to delete table'); return false; }
  };

  return (
    <AppContext.Provider value={{
      settings, categories, items, tables, cart,
      user, isAuthenticated, loading,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      logoutAdmin, updateSettings,
      addCategory, updateCategory, deleteCategory,
      addItem, updateItem, deleteItem,
      addTable, deleteTable,
      refreshData: initApp,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

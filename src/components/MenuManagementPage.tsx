import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  Plus,
  UtensilsCrossed,
  Pizza,
  Layers,
  Sparkles,
  Tag,
  Check,
  Trash2,
  Edit2,
  DollarSign,
  Info,
  Sliders,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Image as ImageIcon,
  Flame,
  CheckCircle,
  Eye
} from 'lucide-react';
import { OrderItem, DishVariation, DishAddon } from '../types/pos';
import {
  MENU_CATALOG,
  MENU_CATEGORIES,
  PIZZA_DEFAULT_VARIATIONS,
  PIZZA_DEFAULT_ADDONS
} from '../data/mockData';

export interface CustomCategory {
  id: string;
  name: string;
  type: 'standard' | 'pizza' | 'plate-wise';
  description?: string;
  dishCount?: number;
}

interface MenuManagementPageProps {
  onBack: () => void;
  onNavigateToBilling?: (table?: any) => void;
  onSelectDishForBilling?: (dish: OrderItem) => void;
}

const INITIAL_CATEGORIES: CustomCategory[] = [
  { id: 'cat-pizza', name: 'Freshly made Pizzas', type: 'pizza', description: 'Fresh stone-baked pizzas with small, medium & large sizes' },
  { id: 'cat-fine-pizza', name: 'Fine Pizza', type: 'pizza', description: 'Artisanal gourmet pizzas' },
  { id: 'cat-main', name: 'Main Course', type: 'plate-wise', description: 'Rich Indian curries, handis and gravies with full/half plate portions' },
  { id: 'cat-biryani', name: 'Biryani & Rice', type: 'plate-wise', description: 'Fragrant dum biryanis and specialty rices with half/full plate pricing' },
  { id: 'cat-tandoor', name: 'Tandoori Starters', type: 'plate-wise', description: 'Clay oven roasted kebabs and tikkas with half/full plate options' },
  { id: 'cat-fav', name: 'Favorite Items', type: 'standard', description: 'Most ordered chef specialties' },
  { id: 'cat-street', name: 'Street Side Favs', type: 'standard', description: 'Quick bites, pav bhaji and snacks' },
  { id: 'cat-beverages', name: 'Soft Drink & Beverages', type: 'standard', description: 'Chilled beverages, mocktails and hot chai' },
  { id: 'cat-desserts', name: 'Indian Desserts', type: 'standard', description: 'Traditional and fusion desserts' },
];

export const MenuManagementPage: React.FC<MenuManagementPageProps> = ({
  onBack,
  onNavigateToBilling,
}) => {
  // Main Tab: 'pos-menu' (Menu same as POS billing) vs 'create-items' (Category creation and add item)
  const [activeTab, setActiveTab] = useState<'pos-menu' | 'create-items'>('pos-menu');

  // Categories and Dishes state
  const [categories, setCategories] = useState<CustomCategory[]>(INITIAL_CATEGORIES);
  const [menuItems, setMenuItems] = useState<OrderItem[]>(MENU_CATALOG);

  // Tab 1 (POS Menu View) filters
  const [selectedPosCategory, setSelectedPosCategory] = useState<string>('All');
  const [posSearchQuery, setPosSearchQuery] = useState<string>('');
  const [posTypeFilter, setPosTypeFilter] = useState<string>('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // -------------------------------------------------------------
  // TAB 2 - SUB-SECTION A: CREATE CATEGORY FORM STATE
  // -------------------------------------------------------------
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [newCategoryType, setNewCategoryType] = useState<'standard' | 'pizza' | 'plate-wise'>('standard');
  const [newCategoryDesc, setNewCategoryDesc] = useState<string>('');

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    const catExists = categories.some(
      (c) => c.name.toLowerCase() === newCategoryName.trim().toLowerCase()
    );
    if (catExists) {
      alert(`Category "${newCategoryName.trim()}" already exists!`);
      return;
    }

    const newCat: CustomCategory = {
      id: `cat-${Date.now()}`,
      name: newCategoryName.trim(),
      type: newCategoryType,
      description: newCategoryDesc.trim() || undefined,
    };

    setCategories((prev) => [...prev, newCat]);
    
    // Also append to MENU_CATEGORIES in mockData if not present
    if (!MENU_CATEGORIES.includes(newCat.name)) {
      MENU_CATEGORIES.push(newCat.name);
    }

    // Auto set the new item category dropdown to this newly created category
    setItemCategory(newCat.name);

    // Auto detect type for new item form
    if (newCat.type === 'pizza') {
      setPortionMode('pizza');
    } else if (newCat.type === 'plate-wise') {
      setPortionMode('plate');
    } else {
      setPortionMode('standard');
    }

    setNewCategoryName('');
    setNewCategoryDesc('');
    showToast(`Category "${newCat.name}" created successfully!`);
  };

  // -------------------------------------------------------------
  // TAB 2 - SUB-SECTION B: ADD DISH / ITEM FORM STATE
  // -------------------------------------------------------------
  const [itemName, setItemName] = useState<string>('');
  const [itemCategory, setItemCategory] = useState<string>('Freshly made Pizzas');
  const [isVeg, setIsVeg] = useState<boolean>(true);
  const [shortCode, setShortCode] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  // Portion and Pricing Mode:
  // 'standard': Single fixed price
  // 'pizza': Automatic Pizza sizes (Small / Medium / Large / XL)
  // 'plate': Automatic Plate-wise portions (Half Plate [decreased price] / Full Plate [standard/increased price])
  const [portionMode, setPortionMode] = useState<'standard' | 'pizza' | 'plate'>('pizza');

  // Standard fixed price
  const [standardPrice, setStandardPrice] = useState<number>(250);

  // Pizza Sizes Pricing
  const [pizzaSmallPrice, setPizzaSmallPrice] = useState<number>(199);
  const [pizzaMediumPrice, setPizzaMediumPrice] = useState<number>(349);
  const [pizzaLargePrice, setPizzaLargePrice] = useState<number>(549);

  // Pizza Addons (Cheese Burst, Thin Crust, Pan Base)
  const [pizzaCheeseBurst, setPizzaCheeseBurst] = useState<boolean>(true);
  const [pizzaThinCrust, setPizzaThinCrust] = useState<boolean>(true);
  const [pizzaPanBase, setPizzaPanBase] = useState<boolean>(true);

  // Plate-Wise Portion Pricing (Half Plate vs Full Plate)
  const [plateHalfPrice, setPlateHalfPrice] = useState<number>(140);
  const [plateFullPrice, setPlateFullPrice] = useState<number>(260);

  // ⚡ SMART CATEGORY AUTO-DETECTION:
  // When category changes, automatically configure portion & pricing mode!
  const handleCategoryChange = (selectedCatName: string) => {
    setItemCategory(selectedCatName);

    const lower = selectedCatName.toLowerCase();
    const matchedCategory = categories.find((c) => c.name.toLowerCase() === lower);

    if (
      matchedCategory?.type === 'pizza' ||
      lower.includes('pizza')
    ) {
      // Auto-switch to Pizza Mode with Small, Medium, Large
      setPortionMode('pizza');
    } else if (
      matchedCategory?.type === 'plate-wise' ||
      lower.includes('handi') ||
      lower.includes('curry') ||
      lower.includes('main') ||
      lower.includes('biryani') ||
      lower.includes('rice') ||
      lower.includes('tandoor') ||
      lower.includes('chinese') ||
      lower.includes('starter')
    ) {
      // Auto-switch to Plate-Wise Mode with Half Plate & Full Plate
      setPortionMode('plate');
    } else {
      setPortionMode('standard');
    }
  };

  // Generate a random shortcode based on item name
  const handleGenerateShortCode = () => {
    if (!itemName.trim()) return;
    const words = itemName.trim().split(' ');
    let code = '';
    if (words.length >= 2) {
      code = (words[0][0] + words[1][0]).toUpperCase() + Math.floor(10 + Math.random() * 90);
    } else {
      code = itemName.slice(0, 2).toUpperCase() + Math.floor(10 + Math.random() * 90);
    }
    setShortCode(code);
  };

  // Handle adding new dish
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) {
      alert('Please enter a dish/item name.');
      return;
    }

    let variationsList: DishVariation[] = [];
    let addonsList: DishAddon[] = [];
    let basePrice = standardPrice;
    let customizationText = '';

    if (portionMode === 'pizza') {
      basePrice = pizzaLargePrice;
      variationsList = [
        { id: `v-sm-${Date.now()}`, name: 'Small (7 inch)', price: pizzaSmallPrice },
        { id: `v-med-${Date.now()}`, name: 'Medium (9 inch)', price: pizzaMediumPrice },
        { id: `v-lg-${Date.now()}`, name: 'Large (11 inch)', price: pizzaLargePrice },
      ];

      addonsList = [];
      if (pizzaCheeseBurst) addonsList.push({ id: 'a-cb', name: 'Cheese Burst Crust', price: 80 });
      if (pizzaThinCrust) addonsList.push({ id: 'a-tc', name: 'Thin & Crispy Crust', price: 50 });
      if (pizzaPanBase) addonsList.push({ id: 'a-pb', name: 'Pan Base Hand Tossed', price: 40 });

      customizationText = `Sizes: Small (₹${pizzaSmallPrice}), Med (₹${pizzaMediumPrice}), Lg (₹${pizzaLargePrice})`;
    } else if (portionMode === 'plate') {
      basePrice = plateFullPrice;
      variationsList = [
        { id: `v-half-${Date.now()}`, name: 'Half Plate', price: plateHalfPrice },
        { id: `v-full-${Date.now()}`, name: 'Full Plate', price: plateFullPrice },
      ];

      customizationText = `Plate: Half (₹${plateHalfPrice}), Full (₹${plateFullPrice})`;
    }

    const newItem: OrderItem = {
      id: `dish-${Date.now()}`,
      name: itemName.trim(),
      price: basePrice,
      quantity: 1,
      category: itemCategory,
      notes: notes.trim() || undefined,
      isVeg: isVeg,
      shortCode: shortCode.trim() || undefined,
      customization: customizationText || undefined,
      hasVariations: variationsList.length > 0,
      variations: variationsList.length > 0 ? variationsList : undefined,
      addonsList: addonsList.length > 0 ? addonsList : undefined,
      image:
        imageUrl.trim() ||
        (portionMode === 'pizza'
          ? 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop&q=80'
          : isVeg
          ? 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop&q=80'),
    };

    // Update in-memory MENU_CATALOG so other pages (POS Billing, Item On/Off) see it immediately!
    MENU_CATALOG.unshift(newItem);
    setMenuItems([...MENU_CATALOG]);

    // Reset inputs
    setItemName('');
    setShortCode('');
    setNotes('');
    setImageUrl('');

    showToast(`Added "${newItem.name}" to ${newItem.category}!`);
  };

  // Filter items in Tab 1 (POS Billing Menu View)
  const filteredPosItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCategory =
        selectedPosCategory === 'All'
          ? true
          : selectedPosCategory === 'Favorites'
          ? item.category.toLowerCase().includes('fav')
          : item.category.toLowerCase() === selectedPosCategory.toLowerCase();

      const matchQuery =
        !posSearchQuery.trim() ||
        item.name.toLowerCase().includes(posSearchQuery.toLowerCase()) ||
        (item.shortCode && item.shortCode.toLowerCase().includes(posSearchQuery.toLowerCase()));

      if (posTypeFilter !== 'All') {
        const isPizza = item.category.toLowerCase().includes('pizza') || item.variations?.some(v => v.name.toLowerCase().includes('small') || v.name.toLowerCase().includes('large'));
        const isPlate = item.variations?.some(v => v.name.toLowerCase().includes('plate'));
        if (posTypeFilter === 'Pizza' && !isPizza) return false;
        if (posTypeFilter === 'Plate' && !isPlate) return false;
        if (posTypeFilter === 'Variations' && (!item.variations || item.variations.length === 0)) return false;
        if (posTypeFilter === 'Addons' && (!item.addons || item.addons.length === 0)) return false;
      }

      return matchCategory && matchQuery;
    });
  }, [menuItems, selectedPosCategory, posSearchQuery, posTypeFilter]);

  return (
    <div className="flex-1 flex flex-col bg-[#fdfaf6] h-[calc(100vh-56px)] overflow-hidden select-none text-stone-800 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-5 z-50 bg-[#731b21] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-maroon-600 animate-slideIn">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. TOP HEADER BAR: Menu Title & Action Buttons             */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-[#ded5c2] px-4 sm:px-6 py-2.5 flex items-center justify-between flex-shrink-0 shadow-2xs">
        <div className="flex items-center">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
            Menu Management
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('create-items')}
            className="px-2.5 py-1 rounded-md bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-semibold transition-all shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#fdfaf6]" />
            <span>Add Dish</span>
          </button>

          <button
            onClick={onBack}
            className="px-2.5 py-1 rounded-md border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-all shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-stone-700" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. TWO MAIN OPTIONS TABS:                                 */}
      {/* Option 1: Menu same as POS Billing                        */}
      {/* Option 2: Category & Item Creation (Pizza & Plate-wise)   */}
      {/* ========================================================= */}
      <div className="bg-[#ede8dd] border-b border-[#ded5c2] px-4 sm:px-6 py-1.5 flex items-center justify-between flex-shrink-0 shadow-2xs">
        <div className="flex items-center gap-2">
          
          {/* OPTION 1 TAB: Menu Same as POS Billing */}
          <button
            onClick={() => setActiveTab('pos-menu')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              activeTab === 'pos-menu'
                ? 'bg-[#731b21] text-white'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-300'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>1. Menu (POS Billing Catalog)</span>
          </button>

          {/* OPTION 2 TAB: Create Category & Add Item */}
          <button
            onClick={() => setActiveTab('create-items')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              activeTab === 'create-items'
                ? 'bg-[#731b21] text-white'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-300'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>2. Create Category & Add Item</span>
          </button>

        </div>

        <div className="text-xs text-stone-600 font-semibold hidden md:block">
          {activeTab === 'pos-menu' ? (
            <span>Showing live dishes as viewed in POS billing</span>
          ) : (
            <span>Add pizza sizes or plate-wise portions with auto price adjustment</span>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: MENU SAME AS IN POS BILLING                        */}
      {/* ========================================================= */}
      {activeTab === 'pos-menu' && (
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Category Navigation Bar (Matching POS Billing) */}
          <div className="w-56 sm:w-64 bg-white border-r border-[#ded5c2] flex flex-col flex-shrink-0 overflow-y-auto">
            <div className="p-3 border-b border-stone-200 bg-[#f9f7f2] font-bold text-xs uppercase tracking-wider text-stone-600">
              Categories
            </div>
            <div className="p-2 space-y-1">
              <button
                onClick={() => setSelectedPosCategory('All')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  selectedPosCategory === 'All'
                    ? 'bg-[#731b21] text-white shadow-2xs'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[10px] opacity-80">{menuItems.length}</span>
              </button>

              {categories.map((cat) => {
                const count = menuItems.filter(
                  (i) => i.category.toLowerCase() === cat.name.toLowerCase()
                ).length;
                const isSelected = selectedPosCategory.toLowerCase() === cat.name.toLowerCase();

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedPosCategory(cat.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#731b21] text-white shadow-2xs font-bold'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate pr-1">
                      {cat.type === 'pizza' && <Pizza className="w-3 h-3 text-amber-500 flex-shrink-0" />}
                      {cat.type === 'plate-wise' && <Layers className="w-3 h-3 text-blue-500 flex-shrink-0" />}
                      <span className="truncate">{cat.name}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/10">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Menu Items Grid (Matching POS Billing Screen UI) */}
          <div className="flex-1 flex flex-col bg-[#fdfaf6] overflow-hidden">
            
            {/* Search (Left) & Filter (Right) Sub-bar */}
            <div className="bg-white border-b border-[#ded5c2] px-4 sm:px-6 py-2 flex items-center justify-between gap-2.5 flex-shrink-0">
              
              {/* Search Bar - Positioned on Left Side */}
              <div className="relative w-52 sm:w-64">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={posSearchQuery}
                  onChange={(e) => setPosSearchQuery(e.target.value)}
                  placeholder="Search dish or shortcode..."
                  className="w-full pl-8 pr-2.5 py-1 text-xs bg-stone-50 hover:bg-white focus:bg-white border border-stone-300 rounded-md focus:outline-none focus:border-[#731b21] font-medium transition-all"
                />
              </div>

              {/* Filter Option on Right Side */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                    posTypeFilter !== 'All'
                      ? 'bg-amber-50 border-amber-300 text-[#731b21] font-bold shadow-2xs'
                      : 'bg-white hover:bg-stone-50 border-stone-300 text-stone-700'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-stone-500" />
                  <span>Filter{posTypeFilter !== 'All' ? `: ${posTypeFilter}` : ''}</span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {isFilterDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setIsFilterDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-xl border border-stone-200 py-1 z-30 animate-fadeIn text-xs">
                      <div className="px-3 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100">
                        Filter by Dish Type
                      </div>
                      {[
                        { id: 'All', label: 'All Dishes' },
                        { id: 'Pizza', label: 'Pizza Portions' },
                        { id: 'Plate', label: 'Plate-wise Portions' },
                        { id: 'Variations', label: 'With Variations' },
                        { id: 'Addons', label: 'With Add-ons' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setPosTypeFilter(opt.id);
                            setIsFilterDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer ${
                            posTypeFilter === opt.id
                              ? 'font-bold text-[#731b21] bg-red-50/50'
                              : 'text-stone-700'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {posTypeFilter === opt.id && (
                            <Check className="w-3.5 h-3.5 text-[#731b21]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Food Dishes Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              {filteredPosItems.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center text-stone-500">
                  <UtensilsCrossed className="w-8 h-8 text-stone-300 mb-2" />
                  <p className="text-sm font-bold text-stone-700">No dishes found</p>
                  <p className="text-xs text-stone-400 mt-1">Try another category or add a new dish</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {filteredPosItems.map((dish) => {
                    const isPizza = dish.category.toLowerCase().includes('pizza') || dish.variations?.some(v => v.name.toLowerCase().includes('small'));
                    const isPlate = dish.variations?.some(v => v.name.toLowerCase().includes('plate'));

                    return (
                      <div
                        key={dish.id}
                        className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-[#731b21]/40 transition-all flex flex-col group"
                      >
                        {/* Food Image with Veg/Non-Veg icon */}
                        <div className="relative h-24 w-full bg-stone-100 overflow-hidden">
                          {dish.image ? (
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400">
                              <UtensilsCrossed className="w-6 h-6" />
                            </div>
                          )}

                          {/* Veg / Non-Veg Indicator */}
                          <div className="absolute top-1.5 right-1.5 bg-white/90 p-0.5 rounded shadow-2xs">
                            <span
                              className={`w-3 h-3 rounded-full flex items-center justify-center border ${
                                dish.isVeg !== false
                                  ? 'border-emerald-600 bg-white'
                                  : 'border-rose-600 bg-white'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  dish.isVeg !== false ? 'bg-emerald-600' : 'bg-rose-600'
                                }`}
                              />
                            </span>
                          </div>

                          {/* Shortcode Badge */}
                          {dish.shortCode && (
                            <div className="absolute bottom-1 left-1.5 bg-black/70 text-white font-mono text-[9px] font-bold px-1.5 py-0.2 rounded">
                              {dish.shortCode}
                            </div>
                          )}
                        </div>

                        {/* Card Info */}
                        <div className="p-2.5 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-xs text-stone-900 line-clamp-1 group-hover:text-[#731b21] transition-colors">
                              {dish.name}
                            </h4>
                            <p className="text-[10px] text-stone-500 truncate mt-0.5">
                              {dish.category}
                            </p>
                          </div>

                          {/* Variations / Pricing Tag */}
                          <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between">
                            <div>
                              {dish.hasVariations ? (
                                <div>
                                  <span className="text-[9px] text-stone-500 block leading-none">Starting from</span>
                                  <span className="font-mono font-bold text-xs text-[#731b21]">
                                    ₹{Math.min(...(dish.variations?.map(v => v.price) || [dish.price]))}
                                  </span>
                                </div>
                              ) : (
                                <span className="font-mono font-bold text-xs text-[#731b21]">
                                  ₹{dish.price}
                                </span>
                              )}
                            </div>

                            {/* Portion Badge */}
                            {isPizza && (
                              <span className="text-[9px] font-bold bg-amber-50 text-amber-800 px-1 py-0.5 rounded border border-amber-200">
                                🍕 S/M/L
                              </span>
                            )}
                            {isPlate && (
                              <span className="text-[9px] font-bold bg-blue-50 text-blue-800 px-1 py-0.5 rounded border border-blue-200">
                                🍽️ Half/Full
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: CREATE CATEGORY & ADD ITEM IN THAT CATEGORY        */}
      {/* ========================================================= */}
      {activeTab === 'create-items' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#fdfaf6]">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* ----------------------------------------------------- */}
            {/* SECTION A: CREATE NEW CATEGORY                         */}
            {/* ----------------------------------------------------- */}
            <div className="bg-white rounded-2xl border border-stone-300 shadow-2xs overflow-hidden">
              <div className="bg-[#ede8dd] px-5 py-3 border-b border-stone-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#731b21]" />
                  <h3 className="font-bold text-sm text-stone-900">
                    1. Create New Menu Category
                  </h3>
                </div>
                <span className="text-xs text-stone-500 font-semibold">
                  {categories.length} Categories Active
                </span>
              </div>

              <div className="p-5">
                <form onSubmit={handleCreateCategory} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                  
                  {/* Category Name */}
                  <div className="md:col-span-1 space-y-1">
                    <label className="text-xs font-bold text-stone-700 block">
                      Category Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="e.g. Gourmet Pizzas, Handi Specialties"
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] font-medium"
                      required
                    />
                  </div>

                  {/* Category Type (Smart Sizing Template) */}
                  <div className="md:col-span-1 space-y-1">
                    <label className="text-xs font-bold text-stone-700 block">
                      Category Portion Behavior <span className="text-rose-600">*</span>
                    </label>
                    <select
                      value={newCategoryType}
                      onChange={(e) => setNewCategoryType(e.target.value as any)}
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] font-semibold text-stone-800"
                    >
                      <option value="standard">Standard (Fixed Single Price)</option>
                      <option value="pizza">🍕 Pizza Type (Auto Small / Medium / Large)</option>
                      <option value="plate-wise">🍽️ Plate-Wise (Auto Half Plate / Full Plate)</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-1 space-y-1">
                    <label className="text-xs font-bold text-stone-700 block">
                      Category Description
                    </label>
                    <input
                      type="text"
                      value={newCategoryDesc}
                      onChange={(e) => setNewCategoryDesc(e.target.value)}
                      placeholder="e.g. Hand tossed crusts or rich curries"
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21]"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="md:col-span-1">
                    <button
                      type="submit"
                      className="w-full py-2 rounded-lg bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#fdfaf6]" />
                      <span>Create Category</span>
                    </button>
                  </div>

                </form>

                {/* Existing Categories Badges */}
                <div className="mt-4 pt-3 border-t border-stone-200">
                  <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
                    Current Categories:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((cat) => (
                      <span
                        key={cat.id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          cat.type === 'pizza'
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : cat.type === 'plate-wise'
                            ? 'bg-blue-50 text-blue-900 border-blue-300'
                            : 'bg-stone-100 text-stone-800 border-stone-300'
                        }`}
                      >
                        {cat.type === 'pizza' && <span>🍕</span>}
                        {cat.type === 'plate-wise' && <span>🍽️</span>}
                        <span>{cat.name}</span>
                        <span className="text-[10px] opacity-60">
                          ({cat.type === 'pizza' ? 'Pizza' : cat.type === 'plate-wise' ? 'Plate' : 'Std'})
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ----------------------------------------------------- */}
            {/* SECTION B: ADD ITEM IN CATEGORY                        */}
            {/* Features:                                              */}
            {/* 1. Category selector                                   */}
            {/* 2. Auto-selects pizza sizes (Small, Medium, Large)     */}
            {/* 3. Plate-wise: Full Plate & Half Plate (decreased /    */}
            {/*    increased price set during addition)                */}
            {/* ----------------------------------------------------- */}
            <div className="bg-white rounded-2xl border border-stone-300 shadow-2xs overflow-hidden">
              <div className="bg-[#ede8dd] px-5 py-3 border-b border-stone-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#731b21]" />
                  <h3 className="font-bold text-sm text-stone-900">
                    2. Add Item / Dish in Category
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold bg-[#731b21] text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {portionMode === 'pizza'
                      ? '🍕 Pizza Sizes Mode'
                      : portionMode === 'plate'
                      ? '🍽️ Plate-Wise Mode'
                      : 'Fixed Price Mode'}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSaveItem} className="p-5 space-y-5">
                
                {/* Row 1: Dish Name, Category Selector, Food Type */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Dish Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 block">
                      Dish / Item Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={itemName}
                      onChange={(e) => {
                        setItemName(e.target.value);
                      }}
                      onBlur={() => {
                        if (!shortCode && itemName) handleGenerateShortCode();
                      }}
                      placeholder="e.g. Paneer Butter Handi, Peri Peri Pizza"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] font-semibold text-stone-900"
                      required
                    />
                  </div>

                  {/* Choose Category (triggers Smart Auto-Detection) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-700 block">
                        Choose Category <span className="text-rose-600">*</span>
                      </label>
                      <span className="text-[10px] text-amber-800 font-bold">
                        ⚡ Auto-Detects Sizes
                      </span>
                    </div>
                    <select
                      value={itemCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] font-bold text-stone-900"
                      required
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.type === 'pizza' ? '🍕 ' : c.type === 'plate-wise' ? '🍽️ ' : ''}
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Veg / Non-Veg / Food Type */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 block">
                      Dietary Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setIsVeg(true)}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                          isVeg
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-400 shadow-2xs'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                        <span>Vegetarian</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsVeg(false)}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                          !isVeg
                            ? 'bg-rose-50 text-rose-800 border-rose-400 shadow-2xs'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                        <span>Non-Veg</span>
                      </button>
                    </div>
                  </div>

                </div>

                {/* Row 2: Manual Portion & Pricing Mode Selector */}
                <div className="bg-[#f9f7f2] p-3.5 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-xs font-extrabold text-stone-900 block">
                        Portion & Pricing Configuration
                      </span>
                      <span className="text-[11px] text-stone-500">
                        Automatically selected based on category, or switch manually below:
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPortionMode('pizza')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          portionMode === 'pizza'
                            ? 'bg-[#731b21] text-white shadow-2xs'
                            : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        <Pizza className="w-3.5 h-3.5" />
                        <span>Pizza Sizes (Small / Med / Large)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPortionMode('plate')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          portionMode === 'plate'
                            ? 'bg-[#731b21] text-white shadow-2xs'
                            : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Plate-Wise (Half / Full Plate)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPortionMode('standard')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          portionMode === 'standard'
                            ? 'bg-[#731b21] text-white shadow-2xs'
                            : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Standard Fixed Price</span>
                      </button>
                    </div>
                  </div>

                  {/* ------------------------------------------------- */}
                  {/* CASE 1: PIZZA CATEGORY SIZES (Small, Medium, Large) */}
                  {/* ------------------------------------------------- */}
                  {portionMode === 'pizza' && (
                    <div className="bg-white p-4 rounded-xl border border-amber-300 shadow-2xs space-y-4 animate-fadeIn">
                      <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                        <Pizza className="w-4 h-4 text-amber-600" />
                        <span>Pizza Sizing: Prices automatically set for Small, Medium & Large</span>
                      </div>

                      {/* 3 Size Price Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        
                        {/* Small */}
                        <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-stone-800">Small (7 inch)</span>
                            <span className="text-[10px] text-stone-500 font-bold">Personal</span>
                          </div>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-stone-400 font-bold text-xs">₹</span>
                            <input
                              type="number"
                              value={pizzaSmallPrice}
                              onChange={(e) => setPizzaSmallPrice(Number(e.target.value))}
                              min={0}
                              className="w-full pl-7 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded focus:border-[#731b21] font-mono font-bold text-stone-900"
                              placeholder="Price"
                            />
                          </div>
                        </div>

                        {/* Medium */}
                        <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-stone-800">Medium (9 inch)</span>
                            <span className="text-[10px] text-stone-500 font-bold">Standard</span>
                          </div>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-stone-400 font-bold text-xs">₹</span>
                            <input
                              type="number"
                              value={pizzaMediumPrice}
                              onChange={(e) => setPizzaMediumPrice(Number(e.target.value))}
                              min={0}
                              className="w-full pl-7 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded focus:border-[#731b21] font-mono font-bold text-stone-900"
                              placeholder="Price"
                            />
                          </div>
                        </div>

                        {/* Large */}
                        <div className="bg-stone-50 p-3 rounded-lg border border-amber-300 bg-amber-50/30 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-amber-950">Large (11 inch)</span>
                            <span className="text-[10px] text-amber-800 font-bold">Family Sharing</span>
                          </div>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-stone-400 font-bold text-xs">₹</span>
                            <input
                              type="number"
                              value={pizzaLargePrice}
                              onChange={(e) => setPizzaLargePrice(Number(e.target.value))}
                              min={0}
                              className="w-full pl-7 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded focus:border-[#731b21] font-mono font-bold text-stone-900"
                              placeholder="Price"
                            />
                          </div>
                        </div>

                      </div>

                      {/* Pizza Crust & Addon Options */}
                      <div className="pt-2 border-t border-stone-200">
                        <span className="text-[11px] font-bold text-stone-600 block mb-2">
                          Available Pizza Crust Addon Options:
                        </span>
                        <div className="flex flex-wrap gap-4 text-xs font-medium text-stone-700">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={pizzaCheeseBurst}
                              onChange={(e) => setPizzaCheeseBurst(e.target.checked)}
                              className="w-4 h-4 rounded text-[#731b21]"
                            />
                            <span>Cheese Burst (+₹80)</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={pizzaThinCrust}
                              onChange={(e) => setPizzaThinCrust(e.target.checked)}
                              className="w-4 h-4 rounded text-[#731b21]"
                            />
                            <span>Thin & Crispy Crust (+₹50)</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={pizzaPanBase}
                              onChange={(e) => setPizzaPanBase(e.target.checked)}
                              className="w-4 h-4 rounded text-[#731b21]"
                            />
                            <span>Pan Base Hand Tossed (+₹40)</span>
                          </label>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* ------------------------------------------------- */}
                  {/* CASE 2: PLATE-WISE PORTIONS (Half Plate / Full)   */}
                  {/* ------------------------------------------------- */}
                  {portionMode === 'plate' && (
                    <div className="bg-white p-4 rounded-xl border border-blue-300 shadow-2xs space-y-4 animate-fadeIn">
                      <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                        <Layers className="w-4 h-4 text-blue-600" />
                        <span>Plate-Wise Portions: Configure decreased price for Half Plate and standard/increased price for Full Plate</span>
                      </div>

                      {/* 2 Portion Inputs: Half Plate vs Full Plate */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        {/* Half Plate (Decreased price) */}
                        <div className="bg-blue-50/40 p-3.5 rounded-xl border border-blue-200 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-blue-500" />
                              <span className="text-xs font-black text-blue-950">Half Plate</span>
                            </div>
                            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                              Decreased Price Portion
                            </span>
                          </div>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-stone-400 font-bold text-xs">₹</span>
                            <input
                              type="number"
                              value={plateHalfPrice}
                              onChange={(e) => setPlateHalfPrice(Number(e.target.value))}
                              min={0}
                              className="w-full pl-7 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:border-[#731b21] font-mono font-bold text-stone-900"
                              placeholder="Half Plate Price"
                              required
                            />
                          </div>
                          <span className="text-[10px] text-stone-500 block">
                            Ideal for single person dining or light appetite
                          </span>
                        </div>

                        {/* Full Plate (Standard / Increased price) */}
                        <div className="bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-200 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-600" />
                              <span className="text-xs font-black text-emerald-950">Full Plate</span>
                            </div>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                              Standard / Full Portion
                            </span>
                          </div>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-stone-400 font-bold text-xs">₹</span>
                            <input
                              type="number"
                              value={plateFullPrice}
                              onChange={(e) => setPlateFullPrice(Number(e.target.value))}
                              min={0}
                              className="w-full pl-7 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:border-[#731b21] font-mono font-bold text-stone-900"
                              placeholder="Full Plate Price"
                              required
                            />
                          </div>
                          <span className="text-[10px] text-stone-500 block">
                            Full family serving portion (e.g. 2-3 persons)
                          </span>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* ------------------------------------------------- */}
                  {/* CASE 3: STANDARD FIXED PRICE                      */}
                  {/* ------------------------------------------------- */}
                  {portionMode === 'standard' && (
                    <div className="bg-white p-4 rounded-xl border border-stone-300 shadow-2xs space-y-3 animate-fadeIn">
                      <div className="flex items-center gap-2 text-stone-800 font-bold text-xs">
                        <DollarSign className="w-4 h-4 text-[#731b21]" />
                        <span>Fixed Single Price</span>
                      </div>
                      <div className="max-w-xs relative">
                        <span className="absolute left-3 top-2.5 text-stone-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={standardPrice}
                          onChange={(e) => setStandardPrice(Number(e.target.value))}
                          min={0}
                          className="w-full pl-7 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:border-[#731b21] font-mono font-bold text-stone-900"
                          placeholder="Dish Price (₹)"
                          required
                        />
                      </div>
                    </div>
                  )}

                </div>

                {/* Row 3: Shortcode, Kitchen Notes & Customization, Food Photo URL */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Shortcode with Auto Generate Button */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-700 block">
                        Dish Short Code
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateShortCode}
                        className="text-[10px] text-[#731b21] hover:underline font-bold"
                      >
                        ⚡ Generate
                      </button>
                    </div>
                    <input
                      type="text"
                      value={shortCode}
                      onChange={(e) => setShortCode(e.target.value.toUpperCase())}
                      placeholder="e.g. PB01, MFH02"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] font-mono font-bold uppercase"
                    />
                  </div>

                  {/* Kitchen Special Notes */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 block">
                      Kitchen Special Notes
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Medium Spicy, Less oil"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21]"
                    />
                  </div>

                  {/* Photo URL */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 block">
                      Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Paste image URL or leave blank for default"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21]"
                    />
                  </div>

                </div>

                {/* Submit Row */}
                <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                  <div className="text-xs text-stone-500 font-medium">
                    New dish will be immediately active and usable in POS billing and live view.
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('pos-menu')}
                      className="px-4 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold cursor-pointer transition-all"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95"
                    >
                      <Plus className="w-4 h-4 text-[#fdfaf6]" />
                      <span>Add Dish to Menu</span>
                    </button>
                  </div>
                </div>

              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};


import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Clock,
  LayoutGrid,
  Globe,
  RefreshCw,
  Search,
  Check,
  X,
  AlertCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { ItemTurnOffModal } from './ItemTurnOffModal';

interface MenuItemStatus {
  id: string;
  name: string;
  onlineName?: string;
  category: string;
  isVeg: boolean;
  isOn: boolean;
  offDuration?: string;
  offUntil?: string;
}

interface ItemOnOffPageProps {
  onBack: () => void;
}

const INITIAL_MENU_ITEMS: MenuItemStatus[] = [
  // Main Course
  { id: 'mc-1', name: 'Butter Chicken', category: 'Main Course', isVeg: false, isOn: true },
  { id: 'mc-2', name: 'Kadai Veg', category: 'Main Course', isVeg: true, isOn: true },
  { id: 'mc-3', name: 'Paneer Shashlik Kebab', category: 'Main Course', isVeg: true, isOn: true },
  { id: 'mc-4', name: 'Palak Paneer', category: 'Main Course', isVeg: true, isOn: true },
  { id: 'mc-5', name: 'Mutton Rara', category: 'Main Course', isVeg: false, isOn: true },
  { id: 'mc-6', name: 'Mutton Curry', category: 'Main Course', isVeg: false, isOn: true },
  { id: 'mc-7', name: 'Mutton Korma', category: 'Main Course', isVeg: false, isOn: false, offDuration: '2 Hours' },

  // Beverages & Mocktails
  { id: 'bev-1', name: 'Special Masala Chai', category: 'Beverages', isVeg: true, isOn: true },
  { id: 'bev-2', name: 'Fresh Lime Soda (Sweet & Salt)', category: 'Beverages', isVeg: true, isOn: true },
  { id: 'bev-3', name: 'Solkadhi Special', category: 'Beverages', isVeg: true, isOn: false, offDuration: '4 Hours' },
  { id: 'bev-4', name: 'Virgin Mojito Mint', category: 'Mocktails', isVeg: true, isOn: true },
  { id: 'bev-5', name: 'Blue Lagoon Cooler', category: 'Mocktails', isVeg: true, isOn: true },

  // Indian Desserts & Western Desserts
  { id: 'des-1', name: 'Gulab Jamun with Rabdi', category: 'Indian Desserts', isVeg: true, isOn: true },
  { id: 'des-2', name: 'Rasmalai Royal Saffron', category: 'Indian Desserts', isVeg: true, isOn: true },
  { id: 'des-3', name: 'Chocolate Lava Cake', category: 'Western Desserts', isVeg: true, isOn: true },
  { id: 'des-4', name: 'Sizzling Brownie with Ice Cream', category: 'Western Desserts', isVeg: true, isOn: true },

  // Appetizers & Indian
  { id: 'app-1', name: 'Paneer Tikka Angara', category: 'Veg Appetizers', isVeg: true, isOn: true },
  { id: 'app-2', name: 'Hara Bhara Kebab', category: 'Veg Appetizers', isVeg: true, isOn: true },
  { id: 'app-3', name: 'Crispy Corn Salt & Pepper', category: 'Veg Appetizers', isVeg: true, isOn: true },
  { id: 'ind-1', name: 'Dal Makhani Special', category: 'Indian', isVeg: true, isOn: true },
  { id: 'ind-2', name: 'Butter Naan Basket', category: 'Indian', isVeg: true, isOn: true },
];

const CATEGORIES = [
  'All',
  'Beverages',
  'Main Course',
  'Western Desserts',
  'Indian Desserts',
  'Indian',
  'Mocktails',
  'Cocktails',
  'Soft Drinks',
  'Veg Appetizers',
];

export const ItemOnOffPage: React.FC<ItemOnOffPageProps> = ({ onBack }) => {
  // Top Action Buttons
  const [activeHeaderAction, setActiveHeaderAction] = useState<string>('Dine In Item On/Off');

  // Sub-views: Recent | All | Whitelabel
  const [activeSubTab, setActiveSubTab] = useState<'recent' | 'all' | 'whitelabel'>('whitelabel');

  // Selected Category on Left Sidebar
  const [selectedCategory, setSelectedCategory] = useState<string>('Main Course');

  // Filters
  const [searchName, setSearchName] = useState<string>('');
  const [onlineName, setOnlineName] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('All Categories');
  const [statusFilter, setStatusFilter] = useState<'all' | 'on' | 'off'>('all');

  // Items State
  const [items, setItems] = useState<MenuItemStatus[]>(INITIAL_MENU_ITEMS);

  // Modal State for turning item OFF
  const [turnOffTargetItem, setTurnOffTargetItem] = useState<MenuItemStatus | null>(null);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter (either left sidebar or dropdown)
      if (filterCategory !== 'All Categories' && item.category !== filterCategory) {
        return false;
      }
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Name search
      if (searchName.trim()) {
        const q = searchName.toLowerCase();
        if (!item.name.toLowerCase().includes(q)) return false;
      }

      // Status filter
      if (statusFilter === 'on' && !item.isOn) return false;
      if (statusFilter === 'off' && item.isOn) return false;

      // Sub-tab filter
      if (activeSubTab === 'recent' && item.isOn) return false; // Show recently modified/off items

      return true;
    });
  }, [items, selectedCategory, filterCategory, searchName, statusFilter, activeSubTab]);

  // Toggle Item On / Off
  const handleToggleClick = (item: MenuItemStatus) => {
    if (item.isOn) {
      // Opening the modal to select duration
      setTurnOffTargetItem(item);
    } else {
      // Immediately turn back ON
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, isOn: true, offDuration: undefined } : it))
      );
      showToast(`${item.name} is now turned ON and available!`);
    }
  };

  // Confirm Turning OFF with duration
  const handleConfirmTurnOff = (itemName: string, durationLabel: string) => {
    setItems((prev) =>
      prev.map((it) =>
        it.name === itemName
          ? {
              ...it,
              isOn: false,
              offDuration: durationLabel,
            }
          : it
      )
    );
    showToast(`${itemName} turned OFF for ${durationLabel}.`);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#fdfaf6] h-[calc(100vh-56px)] overflow-hidden select-none text-stone-800 font-sans">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-16 right-6 z-50 bg-[#731b21] text-[#fdfaf6] px-4 py-2 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 border border-amber-300/40 animate-slideIn">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* TOP ACTION BAR matching Image 2                           */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-[#ded5c2] px-4 sm:px-6 py-2 flex items-center justify-between flex-shrink-0 shadow-2xs flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            'Dine In Item On/Off',
            'Auto Accept/MFR',
            'Addon On/Off',
            'Store On/Off',
            'Configuration',
          ].map((action) => {
            const isSelected = activeHeaderAction === action;
            return (
              <button
                key={action}
                onClick={() => setActiveHeaderAction(action)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer shadow-2xs border ${
                  isSelected
                    ? 'border-[#731b21] text-[#731b21] bg-red-50/40'
                    : 'border-stone-300 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                {action}
              </button>
            );
          })}
        </div>

        {/* Back Button matching Image 2 */}
        <button
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-md border border-[#731b21] bg-white hover:bg-stone-50 text-[#731b21] text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#731b21]" />
          <span>Back</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* SUB-TABS: Recent | All | Whitelabel matching Image 2       */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-[#ded5c2] px-4 sm:px-6 py-2 flex items-center gap-6 flex-shrink-0 text-xs font-bold">
        {/* Recent */}
        <button
          onClick={() => setActiveSubTab('recent')}
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer relative pb-1 ${
            activeSubTab === 'recent'
              ? 'text-[#731b21]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Recent</span>
          {activeSubTab === 'recent' && (
            <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#731b21]" />
          )}
        </button>

        {/* All */}
        <button
          onClick={() => setActiveSubTab('all')}
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer relative pb-1 ${
            activeSubTab === 'all'
              ? 'text-[#731b21]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>All</span>
          {activeSubTab === 'all' && (
            <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#731b21]" />
          )}
        </button>

        {/* Whitelabel */}
        <button
          onClick={() => setActiveSubTab('whitelabel')}
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer relative pb-1 ${
            activeSubTab === 'whitelabel'
              ? 'text-[#731b21]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className="relative">
            <Globe className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-emerald-600 absolute -top-0.5 -right-0.5 border border-white" />
          </div>
          <span>Whitelabel</span>
          {activeSubTab === 'whitelabel' && (
            <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#731b21]" />
          )}
        </button>
      </div>

      {/* ========================================================= */}
      {/* SEARCH & FILTER BAR matching Image 2                      */}
      {/* ========================================================= */}
      <div className="bg-[#f9f7f2] border-b border-[#ded5c2] px-4 sm:px-6 py-2.5 flex items-center gap-2.5 flex-wrap flex-shrink-0">
        {/* Name input */}
        <input
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Name"
          className="w-36 sm:w-44 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-md focus:outline-none focus:border-[#731b21] shadow-2xs font-medium"
        />

        {/* Online Display Name */}
        <input
          type="text"
          value={onlineName}
          onChange={(e) => setOnlineName(e.target.value)}
          placeholder="Online Display Name"
          className="w-40 sm:w-48 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-md focus:outline-none focus:border-[#731b21] shadow-2xs font-medium"
        />

        {/* All Categories Dropdown */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-md focus:outline-none focus:border-[#731b21] shadow-2xs font-medium cursor-pointer"
        >
          <option value="All Categories">All Categories</option>
          {CATEGORIES.filter((c) => c !== 'All').map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Status Dropdown: All | On | Off */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-md focus:outline-none focus:border-[#731b21] shadow-2xs font-medium cursor-pointer"
        >
          <option value="all">All</option>
          <option value="on">Turned ON</option>
          <option value="off">Turned OFF</option>
        </select>

        {/* Action Buttons: Show | Clear | Refresh */}
        <button
          onClick={() => showToast('Displaying filtered menu items')}
          className="px-4 py-1.5 rounded-md bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          Show
        </button>

        <button
          onClick={() => {
            setSearchName('');
            setOnlineName('');
            setFilterCategory('All Categories');
            setStatusFilter('all');
            setSelectedCategory('All');
          }}
          className="px-3.5 py-1.5 rounded-md border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-2xs cursor-pointer"
        >
          Clear
        </button>

        <button
          onClick={() => showToast('Menu item statuses refreshed')}
          className="px-3 py-1.5 rounded-md border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-2xs cursor-pointer flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5 text-stone-600" />
          <span>Refresh</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* MAIN TWO-COLUMN VIEW matching Image 2                     */}
      {/* Left: Category Sidebar | Right: Items with ON/OFF switch  */}
      {/* ========================================================= */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* Left Category Sidebar matching Image 2 */}
        <div className="w-48 sm:w-56 bg-white border-r border-[#ded5c2] flex flex-col overflow-y-auto flex-shrink-0">
          <div className="p-2 space-y-1">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-md text-xs font-bold transition-all flex items-center justify-between cursor-pointer border-l-3 ${
                    isSelected
                      ? 'border-l-[#731b21] bg-red-50/50 text-[#731b21]'
                      : 'border-l-transparent text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span>{cat}</span>
                  {/* Subtle placeholder bar as shown in Image 2 */}
                  <span className="w-8 h-2 rounded bg-stone-200 opacity-60" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Main Item List matching Image 2 */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
          <div className="max-w-4xl mx-auto space-y-3">
            
            {/* Category Title Heading */}
            <div className="pb-2 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-800">
                {selectedCategory === 'All' ? 'All Dishes' : selectedCategory} ({filteredItems.length})
              </h3>
              <span className="text-[11px] text-stone-500 font-medium">
                Click toggle to mark item OFF with time duration
              </span>
            </div>

            {filteredItems.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center text-stone-400 text-xs font-semibold">
                <AlertCircle className="w-6 h-6 mb-1 text-stone-300" />
                <span>No menu dishes match current selection</span>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 px-2 flex items-center justify-between hover:bg-stone-50/80 rounded-lg transition-colors group"
                  >
                    
                    {/* Left: Checkbox + Name + Veg/NonVeg Indicator */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="accent-[#731b21] w-4 h-4 rounded cursor-pointer"
                      />

                      {/* Veg / Non-Veg symbol matching Image 2 */}
                      <span
                        className={`w-4 h-4 border flex items-center justify-center rounded-xs flex-shrink-0 ${
                          item.isVeg
                            ? 'border-emerald-600'
                            : 'border-rose-700'
                        }`}
                        title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                      >
                        {item.isVeg ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        ) : (
                          <span className="text-[10px] font-black text-rose-700 leading-none">▲</span>
                        )}
                      </span>

                      {/* Item Name */}
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-[#731b21] transition-colors">
                          {item.name}
                        </span>
                        {!item.isOn && item.offDuration && (
                          <span className="text-[10px] font-semibold text-rose-600 font-mono">
                            Turned OFF ({item.offDuration})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Toggle Switch matching Image 2 + Refresh icon */}
                    <div className="flex items-center gap-3">
                      
                      {/* ON / OFF Switch */}
                      <button
                        onClick={() => handleToggleClick(item)}
                        title={item.isOn ? 'Click to turn item OFF' : 'Click to turn item ON'}
                        className={`h-6 px-3 rounded-md text-[11px] font-extrabold flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 ${
                          item.isOn
                            ? 'bg-[#22c55e] text-white hover:bg-[#16a34a]'
                            : 'bg-stone-300 text-stone-700 hover:bg-stone-400'
                        }`}
                      >
                        {item.isOn ? 'ON' : 'OFF'}
                      </button>

                      {/* Refresh button */}
                      <button
                        onClick={() => showToast(`Synchronized ${item.name}`)}
                        className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Sync with Aggregators (Swiggy/Zomato)"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>

                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* ITEM TURN OFF DURATION MODAL matching Image 3             */}
      {/* ========================================================= */}
      {turnOffTargetItem && (
        <ItemTurnOffModal
          isOpen={Boolean(turnOffTargetItem)}
          itemName={turnOffTargetItem.name}
          onClose={() => setTurnOffTargetItem(null)}
          onConfirmOff={handleConfirmTurnOff}
        />
      )}

    </div>
  );
};


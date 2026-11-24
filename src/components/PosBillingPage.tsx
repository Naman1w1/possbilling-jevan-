import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Minus,
  X,
  ChevronDown,
  User,
  Users,
  MessageSquare,
  UserPlus,
  ArrowLeft,
  Check,
  Percent,
  Receipt,
  UtensilsCrossed,
  Layers,
  Bike,
  ShoppingBag,
  CreditCard,
  Banknote,
  MoreHorizontal,
  Ban,
  Clock,
  Sparkles,
  Wallet,
  QrCode,
  MapPin,
  Phone,
  Tag,
  Trash2,
  FileCheck
} from 'lucide-react';
import { Table, OrderItem, DishVariation, DishAddon } from '../types/pos';
import { MENU_CATALOG, MENU_CATEGORIES, MENU_GROUPS } from '../data/mockData';
import { CancelItemModal } from './CancelItemModal';
import { DishVariationModal } from './DishVariationModal';
import { PartPaymentModal, PaymentPartEntry } from './PartPaymentModal';
import { SplitBillModal } from './SplitBillModal';
import { DuePaymentModal } from './DuePaymentModal';
import { AppliedDiscountModal } from './AppliedDiscountModal';
import { OrderWiseCommentsModal } from './OrderWiseCommentsModal';
import { DishSpecialNotesModal } from './DishSpecialNotesModal';

interface PosBillingPageProps {
  table: Table;
  onBackToTables: () => void;
  onUpdateTable: (updated: Table) => void;
  onPrintBill: (table: Table) => void;
}

export const PosBillingPage: React.FC<PosBillingPageProps> = ({
  table,
  onBackToTables,
  onUpdateTable,
  onPrintBill,
}) => {
  // Local active state
  const [selectedGroup, setSelectedGroup] = useState<string>('Globel Grills');
  const [selectedCategory, setSelectedCategory] = useState<string>('Freshly made Pizzas');
  const [itemSearch, setItemSearch] = useState<string>('');
  const [shortCodeInput, setShortCodeInput] = useState<string>('');
  const [orderType, setOrderType] = useState<'Dine In' | 'Delivery' | 'Pick Up'>('Dine In');
  const [guestCount, setGuestCount] = useState<number>(table.guests || 1);
  const [paymentMode, setPaymentMode] = useState<'Not Paid' | 'Cash' | 'Card' | 'Other'>('Not Paid');
  const [isPaidChecked, setIsPaidChecked] = useState<boolean>(table.status === 'paid');
  const [isComplimentary, setIsComplimentary] = useState<boolean>(false);
  const [isSalesReturn, setIsSalesReturn] = useState<boolean>(false);
  const [bogoApplied, setBogoApplied] = useState<boolean>(false);
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>(table.customerName || '');
  const [customerPhone, setCustomerPhone] = useState<string>(table.customerPhone || '');
  const [customerLocation, setCustomerLocation] = useState<string>(table.customerLocation || '');
  const [customerLocality, setCustomerLocality] = useState<string>('Near City Center');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState<boolean>(false);
  const [dueCustomerInfo, setDueCustomerInfo] = useState<{
    name: string;
    phone: string;
    location: string;
    totalAmount?: number;
    paidAmount?: number;
    dueAmount?: number;
    paidMode?: string;
    notes?: string;
  } | null>(table.dueCustomer || null);

  // Discount state
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState<boolean>(false);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState<string>('');

  // Comments & Notes Modals state
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState<boolean>(false);
  const [itemForSpecialNotes, setItemForSpecialNotes] = useState<OrderItem | null>(null);

  // New Modals state
  const [itemToCancel, setItemToCancel] = useState<OrderItem | null>(null);
  const [variationItem, setVariationItem] = useState<OrderItem | null>(null);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState<boolean>(false);
  const [isPartPaymentModalOpen, setIsPartPaymentModalOpen] = useState<boolean>(false);
  const [isDuePaymentModalOpen, setIsDuePaymentModalOpen] = useState<boolean>(false);
  const [isOtherMenuOpen, setIsOtherMenuOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Current items in this table's order
  const [currentItems, setCurrentItems] = useState<OrderItem[]>(
    table.items.length > 0
      ? table.items
      : [
          // Default demo item matching screenshot if empty
          {
            id: 'p-1',
            name: 'Capsicum & Onion (Large (11 inch))',
            price: 259,
            quantity: 5,
            category: 'Freshly made Pizzas',
            customization: 'Freshly Made Pizzas: Extra Cheeses',
            isVeg: true,
            shortCode: 'P01',
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop&q=80'
          }
        ]
  );

  // Filter items in center grid
  const filteredItems = useMemo(() => {
    return MENU_CATALOG.filter((item) => {
      const matchCat =
        selectedCategory === 'Favorite Items'
          ? true
          : item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchQuery =
        !itemSearch.trim() ||
        item.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
        (item.shortCode && item.shortCode.toLowerCase().includes(itemSearch.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [selectedCategory, itemSearch]);

  // Handle adding an item from the menu grid
  const handleAddItem = (item: OrderItem) => {
    setCurrentItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            ...item,
            quantity: 1,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ];
      }
    });
  };

  // Stepper for quantity
  const handleUpdateQty = (itemId: string, delta: number) => {
    setCurrentItems((prev) =>
      prev
        .map((it) => {
          if (it.id === itemId) {
            const next = it.quantity + delta;
            return next > 0 ? { ...it, quantity: next } : null;
          }
          return it;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  // Direct manual quantity typing (e.g. customer wants 20 Butter Naan)
  const handleDirectQtyChange = (itemId: string, newQty: number) => {
    setCurrentItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, quantity: Math.max(1, newQty) } : it))
    );
  };

  // When a dish card in the menu is clicked
  const handleDishClick = (item: OrderItem) => {
    if (item.hasVariations || item.category.toLowerCase().includes('pizza')) {
      setVariationItem(item);
    } else {
      handleAddItem(item);
      showToast(`Added ${item.name}`);
    }
  };

  // Confirm variation selection (Image 2)
  const handleConfirmVariation = (
    baseItem: OrderItem,
    variation: DishVariation,
    addons: DishAddon[],
    totalPrice: number
  ) => {
    const addonsStr = addons.length > 0 ? addons.map((a) => a.name).join(', ') : '';
    const customText = `${variation.name}${addonsStr ? ` · ${addonsStr}` : ''}`;
    const configuredItem: OrderItem = {
      ...baseItem,
      id: `${baseItem.id}-${variation.id}-${Date.now().toString().slice(-4)}`,
      name: `${baseItem.name} (${variation.name})`,
      price: totalPrice,
      quantity: 1,
      customization: customText,
      selectedVariation: variation.name,
      selectedAddons: addons.map((a) => a.name),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCurrentItems((prev) => [...prev, configuredItem]);
    showToast(`Added ${configuredItem.name}`);
  };

  // Initiate item cancellation with square reason box (Image 1)
  const handleInitiateCancel = (item: OrderItem) => {
    setItemToCancel(item);
  };

  // Confirm item cancel with reason
  const handleConfirmCancelItem = (item: OrderItem, reason: string) => {
    setCurrentItems((prev) => prev.filter((it) => it.id !== item.id));
    showToast(`Deleted ${item.name} · Reason: ${reason}`);
  };

  // Confirm split bill (Image 4)
  const handleConfirmSplit = (details: { mode: string; portions: number; perPortionAmount: number }) => {
    showToast(`Bill splitted into ${details.portions} portions (₹${details.perPortionAmount.toFixed(2)} each)`);
  };

  // Confirm due payment
  const handleConfirmDue = (dueData: {
    fullName: string;
    mobileNo: string;
    location: string;
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
    paidMode?: 'Cash' | 'Online/UPI' | 'Card';
    notes?: string;
  }) => {
    setPaymentMode('Due' as any);
    setIsPaidChecked(dueData.dueAmount === 0);
    setCustomerName(dueData.fullName);
    setCustomerPhone(dueData.mobileNo);
    setCustomerLocation(dueData.location);
    setDueCustomerInfo({
      name: dueData.fullName,
      phone: dueData.mobileNo,
      location: dueData.location,
      totalAmount: dueData.totalAmount,
      paidAmount: dueData.paidAmount,
      dueAmount: dueData.dueAmount,
      paidMode: dueData.paidMode,
      notes: dueData.notes,
    });
    if (dueData.paidAmount > 0) {
      showToast(
        `Due recorded for ${dueData.fullName}: Paid ₹${dueData.paidAmount.toFixed(2)} (${dueData.paidMode || 'Cash'}), Due ₹${dueData.dueAmount.toFixed(2)}`
      );
    } else {
      showToast(`Due payment recorded for ${dueData.fullName} (Due ₹${dueData.dueAmount.toFixed(2)})`);
    }
  };

  // Remove an item
  const handleRemoveItem = (itemId: string) => {
    setCurrentItems((prev) => prev.filter((it) => it.id !== itemId));
  };

  // Short code direct enter
  const handleShortCodeSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && shortCodeInput.trim()) {
      const found = MENU_CATALOG.find(
        (it) => it.shortCode?.toLowerCase() === shortCodeInput.trim().toLowerCase()
      );
      if (found) {
        handleAddItem(found);
        setShortCodeInput('');
      } else {
        alert(`Short code "${shortCodeInput}" not found!`);
      }
    }
  };

  // Calculations
  const rawSubtotal = currentItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const bogoDiscount = bogoApplied ? Math.min(259, rawSubtotal * 0.15) : 0;
  const customDiscount =
    discountValue > 0
      ? discountType === 'percentage'
        ? (rawSubtotal * discountValue) / 100
        : Math.min(rawSubtotal, discountValue)
      : 0;
  const totalDiscount = Math.round(bogoDiscount + customDiscount);
  const taxableSubtotal = isComplimentary ? 0 : Math.max(0, rawSubtotal - totalDiscount);
  const taxes = taxableSubtotal * 0.05; // 5% GST
  const grandTotal = Math.round(taxableSubtotal + taxes);

  // Sync back to table object and return
  const syncTable = (status: Table['status']) => {
    const updated: Table = {
      ...table,
      status: currentItems.length === 0 ? 'blank' : status,
      amount: grandTotal,
      items: currentItems,
      guests: guestCount,
      orderType: orderType,
      durationMinutes: table.durationMinutes || 1,
      seatedAt: table.seatedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      kotNo: table.kotNo || `KOT-${Math.floor(400 + Math.random() * 90)}`,
      billNo: table.billNo || `B-${Math.floor(1000 + Math.random() * 900)}`,
      customerName: customerName,
      customerPhone: customerPhone,
      customerLocation: customerLocation,
      paymentMode: paymentMode,
      dueCustomer: dueCustomerInfo || undefined,
    };
    onUpdateTable(updated);
    return updated;
  };

  // Bottom action buttons
  const handleSave = () => {
    syncTable('running');
    alert(`Order for Table ${table.id} saved successfully!`);
    onBackToTables();
  };

  const handleSaveAndPrint = () => {
    const updated = syncTable('printed');
    onPrintBill(updated);
  };

  const handleSaveAndEBill = () => {
    syncTable('printed');
    alert(`E-Bill SMS and WhatsApp invoice sent for Table ${table.id}!`);
    onBackToTables();
  };

  const handleKOT = () => {
    syncTable('kot');
    alert(`Kitchen Order Ticket (KOT) sent to prep kitchen!`);
    onBackToTables();
  };

  const handleKOTAndPrint = () => {
    const updated = syncTable('kot');
    alert(`KOT fired and Kitchen Slip printed for Table ${table.id}!`);
    onPrintBill(updated);
  };

  const handleHold = () => {
    syncTable('running');
    alert(`Order placed on HOLD for Table ${table.id}.`);
    onBackToTables();
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#f7f4ed] overflow-hidden select-none">
      
      {/* Sub-bar with Navigation Back to Floor View & Table Context */}
      <div className="bg-[#ede8dd] border-b border-[#ded5c2] px-3 sm:px-5 py-1.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToTables}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/90 hover:bg-white text-maroon-900 border border-stone-300 text-xs font-bold transition-all shadow-2xs hover:shadow active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Table View</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-maroon-950">Active Table:</span>
            <span className="font-roman font-bold px-2 py-0.5 rounded bg-maroon-800 text-[#fdfaf6]">
              {table.id}
            </span>
            <span className="text-stone-500 font-medium">({table.zone} Zone)</span>
          </div>
        </div>

        <div className="text-xs text-stone-600 font-medium hidden sm:flex items-center gap-3">
          <span>Server: <strong>{table.serverName || 'Captain Ramesh'}</strong></span>
          <span>•</span>
          <span>Terminal: <strong>POS-01</strong></span>
        </div>
      </div>

      {/* 2 Main Divisions: Division 1 (Scrollable Menu) & Division 2 (Fixed Billing Panel) */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
        
        {/* ========================================================= */}
        {/* DIVISION 1: MENU SECTION (Categories + Food Items Grid)    */}
        {/* ========================================================= */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden border-r border-[#ded5c2]">
          
          {/* Sub-division: Categories Sidebar */}
          <div className="w-full lg:w-48 xl:w-52 bg-white/80 border-b lg:border-b-0 lg:border-r border-[#ded5c2] flex flex-col flex-shrink-0 h-full overflow-hidden">
            
            {/* Group Dropdown matching reference image */}
            <div className="p-2 border-b border-[#ded5c2] bg-[#f9f7f2] flex-shrink-0">
              <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                GROUP
              </div>
              <div className="relative">
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full appearance-none bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-stone-800 focus:outline-none focus:border-maroon-800 cursor-pointer shadow-2xs"
                >
                  {MENU_GROUPS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Categories List (independently scrollable) */}
            <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-stone-100 flex lg:flex-col overflow-x-auto lg:overflow-x-hidden">
              {MENU_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2.5 text-xs font-semibold transition-all whitespace-nowrap lg:whitespace-normal flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-maroon-100/70 text-maroon-900 border-l-4 border-maroon-800 font-bold'
                        : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <span>{cat}</span>
                    {cat === 'Favorite Items' && <span className="text-amber-500 text-xs">★</span>}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Sub-division: Food Items Section (independently scrollable) */}
          <div className="flex-1 min-h-0 h-full flex flex-col overflow-hidden bg-[#faf7f2]/50">
            
            {/* Top Search & Short Code Row */}
            <div className="p-2.5 bg-white border-b border-[#ded5c2] flex items-center gap-2.5 flex-shrink-0">
              {/* Search item input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2" />
                <input
                  type="text"
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                  placeholder="Search item"
                  className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-stone-50 hover:bg-white focus:bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-maroon-800 transition-all font-medium"
                />
                {itemSearch && (
                  <button
                    onClick={() => setItemSearch('')}
                    className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Short code input */}
              <div className="w-28 sm:w-36">
                <input
                  type="text"
                  value={shortCodeInput}
                  onChange={(e) => setShortCodeInput(e.target.value)}
                  onKeyDown={handleShortCodeSubmit}
                  placeholder="Short Code"
                  className="w-full px-3 py-1.5 text-xs sm:text-sm bg-stone-50 hover:bg-white focus:bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-maroon-800 font-mono text-center uppercase font-bold"
                />
              </div>
            </div>

            {/* Food Items Cards Grid - ONLY THIS SCROLLS */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-2.5 sm:gap-3 auto-rows-max">
              {filteredItems.map((item) => {
                const isCustomizable = item.hasVariations || item.category.toLowerCase().includes('pizza');
                return (
                  <div
                    key={item.id}
                    onClick={() => handleDishClick(item)}
                    className="group relative bg-white border border-[#ded5c2] hover:border-maroon-800/80 rounded-xl p-2 sm:p-2.5 flex items-center gap-2.5 shadow-2xs hover:shadow-md transition-all cursor-pointer select-none active:scale-98"
                  >
                    {/* Food Image - Reduced compact shape size so text has plenty of room */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100 border border-stone-200">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                          <UtensilsCrossed className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Details - Clear spacing, no overlapping text */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      {/* Top Row: Dish Name + Shortcode & Veg/Non-Veg Badges (Moved outside the price) */}
                      <div className="flex items-start justify-between gap-1.5">
                        <h4 className="text-xs sm:text-[13px] font-bold text-stone-800 group-hover:text-maroon-900 leading-tight line-clamp-2 transition-colors flex-1">
                          {item.name}
                        </h4>

                        {/* Top-Right Badges: Shortcode & Veg Indicator cleanly together */}
                        <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                          {item.shortCode && (
                            <span className="text-[9px] font-mono font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 select-none leading-none">
                              {item.shortCode}
                            </span>
                          )}
                          <div
                            className={`w-3.5 h-3.5 border flex items-center justify-center rounded-xs flex-shrink-0 ${
                              item.isVeg !== false
                                ? 'border-emerald-600 bg-white'
                                : 'border-rose-600 bg-white'
                            }`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.isVeg !== false ? 'bg-emerald-600' : 'bg-rose-600'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Middle: Sizes & Addons Badge */}
                      {isCustomizable && (
                        <div className="mt-1">
                          <span className="inline-block text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 leading-none">
                            Sizes &amp; Addons
                          </span>
                        </div>
                      )}

                      {/* Bottom Row: Clean Price with Zero Overlap */}
                      <div className="mt-1.5 flex items-baseline">
                        <span className="text-xs sm:text-sm font-extrabold font-mono text-stone-900 tracking-tight">
                          ₹{item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* DIVISION 2: BILLING SECTION (Fixed Position, Non-Scrollable) */}
        {/* ========================================================= */}
        <div className="w-full lg:w-[420px] xl:w-[480px] bg-white border-l border-[#ded5c2] flex flex-col flex-shrink-0 shadow-lg h-full overflow-hidden">
          
          {/* Top Order Type Tabs matching reference UI */}
          <div className="grid grid-cols-3 border-b border-[#ded5c2] bg-[#f9f7f2] flex-shrink-0">
            <button
              onClick={() => setOrderType('Dine In')}
              className={`py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                orderType === 'Dine In'
                  ? 'bg-maroon-100/60 text-maroon-900 border-b-2 border-maroon-800'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Dine In</span>
            </button>

            <button
              onClick={() => setOrderType('Delivery')}
              className={`py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                orderType === 'Delivery'
                  ? 'bg-maroon-100/60 text-maroon-900 border-b-2 border-maroon-800'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Delivery</span>
            </button>

            <button
              onClick={() => setOrderType('Pick Up')}
              className={`py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                orderType === 'Pick Up'
                  ? 'bg-maroon-100/60 text-maroon-900 border-b-2 border-maroon-800'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Pick Up</span>
            </button>
          </div>

          {/* Table & Guest Meta Bar matching reference image */}
          <div className="px-3 py-2 border-b border-[#ded5c2] flex items-center justify-between bg-white text-xs flex-shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              {/* Table code pill */}
              <div className="px-2 py-1 rounded bg-stone-100 border border-stone-300 font-bold font-roman text-maroon-900 flex items-center gap-1">
                <span className="text-[10px] text-stone-500 font-mono">T</span>
                <span>{table.id}</span>
              </div>

              {/* Customer icon button toggles customer form */}
              <button
                title="Customer Form (Mobile, Name, Address, Locality)"
                onClick={() => setIsCustomerFormOpen(!isCustomerFormOpen)}
                className={`p-1.5 rounded border transition-all cursor-pointer ${
                  isCustomerFormOpen || customerName || customerPhone
                    ? 'border-maroon-800 bg-maroon-50 text-maroon-900 font-bold shadow-2xs'
                    : 'border-stone-200 hover:bg-stone-100 text-stone-600'
                }`}
              >
                <User className="w-3.5 h-3.5" />
              </button>

              {/* Guest count */}
              <button
                onClick={() => setGuestCount((g) => (g >= 12 ? 1 : g + 1))}
                className="px-2 py-1 rounded border border-stone-200 hover:bg-stone-100 text-maroon-900 font-bold flex items-center gap-1 font-mono cursor-pointer"
                title="Guest count"
              >
                <Users className="w-3.5 h-3.5 text-stone-600" />
                <span>{guestCount}</span>
              </button>

              {/* Order Wise Comments / Special Requests button */}
              <button
                title="Order Wise Comments / Special Requests"
                onClick={() => setIsCommentsModalOpen(true)}
                className={`p-1.5 rounded border transition-all cursor-pointer ${
                  orderNotes ? 'text-amber-800 bg-amber-100 border-amber-300 font-bold' : 'border-stone-200 hover:bg-stone-100 text-stone-600'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>

            </div>

            {/* Floor badge on right (e.g. First Floor / AC Hall) with Times New Roman font */}
            <div className="px-3 py-1 rounded font-bold text-xs bg-amber-400 text-stone-950 shadow-2xs font-roman tracking-normal">
              {table.zone === 'AC' ? 'First Floor' : `${table.zone} Floor`}
            </div>
          </div>

          {/* Customer Form matching Image 2 */}
          {isCustomerFormOpen && (
            <div className="p-3 bg-white border-b border-[#ded5c2] shadow-2xs animate-fadeIn space-y-2 flex-shrink-0">
              <div className="flex items-start justify-between gap-3">
                {/* 4 Form Fields matching Image 2 */}
                <div className="flex-1 space-y-1.5 text-xs">
                  
                  {/* Mobile Field */}
                  <div className="flex items-center gap-2">
                    <span className="w-14 font-bold text-stone-600 text-[11px]">Mobile:</span>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Enter mobile number"
                      className="flex-1 h-7 px-2 bg-stone-50 hover:bg-white focus:bg-white border border-stone-300 rounded text-xs font-mono font-medium focus:outline-none focus:border-[#731b21]"
                    />
                  </div>

                  {/* Name Field */}
                  <div className="flex items-center gap-2">
                    <span className="w-14 font-bold text-stone-600 text-[11px]">Name:</span>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter customer full name"
                      className="flex-1 h-7 px-2 bg-stone-50 hover:bg-white focus:bg-white border border-stone-300 rounded text-xs font-medium focus:outline-none focus:border-[#731b21]"
                    />
                  </div>

                  {/* Address Field */}
                  <div className="flex items-center gap-2 relative">
                    <span className="w-14 font-bold text-stone-600 text-[11px]">Add:</span>
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Flat, building, street address"
                      className="flex-1 h-7 pl-2 pr-6 bg-stone-50 hover:bg-white focus:bg-white border border-stone-300 rounded text-xs font-medium focus:outline-none focus:border-[#731b21]"
                    />
                    {customerAddress && (
                      <button
                        type="button"
                        onClick={() => setCustomerAddress('')}
                        className="absolute right-1.5 top-1.5 text-stone-400 hover:text-stone-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Locality Field */}
                  <div className="flex items-center gap-2">
                    <span className="w-14 font-bold text-stone-600 text-[11px]">Locality:</span>
                    <input
                      type="text"
                      value={customerLocality}
                      onChange={(e) => setCustomerLocality(e.target.value)}
                      placeholder="Area / landmark"
                      className="flex-1 h-7 px-2 bg-stone-50 hover:bg-white focus:bg-white border border-stone-300 rounded text-xs font-medium focus:outline-none focus:border-[#731b21]"
                    />
                  </div>

                </div>

                {/* Right Side Quick Action Icons matching Image 2 */}
                <div className="flex flex-col items-center gap-2 pt-1">
                  <div className="flex items-center gap-1.5 text-stone-500">
                    <button
                      type="button"
                      title="Customer History / Past Orders"
                      onClick={() => alert(`Past Orders for ${customerName || 'Guest'}:\n• Last Visit: Yesterday (₹450)\n• Total Visits: 12`)}
                      className="p-1 rounded hover:bg-stone-100 hover:text-stone-800"
                    >
                      <Clock className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="GST Tax Invoice"
                      onClick={() => alert('GST number captured for corporate billing')}
                      className="p-1 rounded hover:bg-stone-100 hover:text-stone-800"
                    >
                      <FileCheck className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Customer Wallet / Loyalty Balance"
                      onClick={() => alert(`Loyalty points for ${customerName || 'Customer'}: 240 pts (₹120 value)`)}
                      className="p-1 rounded bg-sky-50 text-sky-700 hover:bg-sky-100"
                    >
                      <Wallet className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Clear Customer Form"
                      onClick={() => {
                        setCustomerName('');
                        setCustomerPhone('');
                        setCustomerAddress('');
                        setCustomerLocality('');
                      }}
                      className="p-1 rounded hover:bg-red-50 text-stone-400 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Collapse toggle */}
                  <button
                    type="button"
                    onClick={() => setIsCustomerFormOpen(false)}
                    className="text-[10px] text-stone-400 hover:text-stone-700 mt-1"
                  >
                    ▲ hide
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Column Header for Items matching reference image */}
          <div className="px-3 py-1.5 bg-[#f6f2e9] border-b border-[#ded5c2] flex items-center justify-between text-[11px] font-bold text-stone-600 uppercase tracking-wider flex-shrink-0">
            <span>ITEMS</span>
            <div className="flex items-center gap-4">
              <span className="text-maroon-800 lowercase cursor-pointer underline text-[10px]">
                check items
              </span>
              <span className="w-16 text-center">QTY.</span>
              <span className="w-16 text-right">PRICE</span>
            </div>
          </div>

          {/* Items List matching reference UI */}
          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-stone-100 p-2">
            {currentItems.length === 0 ? (
              <div className="text-center py-16 text-xs text-stone-400">
                No items added yet. Click on items from the menu grid to add.
              </div>
            ) : (
              currentItems.map((it) => (
                <div key={it.id} className="py-2.5 px-1 flex items-start justify-between gap-2">
                  
                  {/* Left: Remove button & Title / Customization note */}
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <button
                      onClick={() => handleInitiateCancel(it)}
                      className="mt-0.5 text-rose-500 hover:text-rose-700 active:scale-90 transition-all flex-shrink-0 cursor-pointer"
                      title="Cancel item with reason"
                    >
                      <X className="w-4 h-4 rounded-full bg-rose-50 p-0.5" />
                    </button>

                    {/* Title & Customization Note: Click to open Special Notes modal (Image 4) */}
                    <div
                      onClick={() => setItemForSpecialNotes(it)}
                      className="min-w-0 cursor-pointer group/item flex-1"
                      title="Click to add/edit special notes (Less spicy, no onion/garlic, etc.)"
                    >
                      <div className="text-xs font-bold text-stone-900 leading-tight group-hover/item:text-[#731b21] transition-colors flex items-center gap-1.5">
                        <span>{it.name}</span>
                        <span className="opacity-0 group-hover/item:opacity-100 text-[9px] text-amber-800 bg-amber-50 px-1 py-0.2 rounded border border-amber-200 transition-opacity">
                          ✎ note
                        </span>
                      </div>
                      {it.customization ? (
                        <div className="text-[10px] text-stone-500 leading-tight mt-0.5 group-hover/item:text-[#731b21] font-medium">
                          {it.customization}
                        </div>
                      ) : (
                        <div className="text-[9px] text-stone-400 opacity-0 group-hover/item:opacity-100 transition-opacity">
                          + add special note
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Quantity Stepper & Price / Unit Price */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Stepper with manual typing: [-] [ 20 ] [+] */}
                    <div className="flex items-center border border-stone-300 rounded-md overflow-hidden bg-white shadow-2xs">
                      <button
                        onClick={() => handleUpdateQty(it.id, -1)}
                        className="px-2 py-1 text-stone-600 hover:bg-stone-100 active:scale-95 cursor-pointer"
                        title="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="999"
                        value={it.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          handleDirectQtyChange(it.id, isNaN(val) ? 1 : val);
                        }}
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                        className="w-10 sm:w-12 py-1 text-xs font-bold font-mono text-center bg-transparent border-x border-stone-200 focus:bg-amber-50 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-text select-all"
                        title="Click to manually type quantity (e.g. 20 Butter Naan)"
                      />
                      <button
                        onClick={() => handleUpdateQty(it.id, 1)}
                        className="px-2 py-1 text-stone-600 hover:bg-stone-100 active:scale-95 cursor-pointer"
                        title="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price and Unit Price underneath */}
                    <div className="text-right w-16">
                      <div className="text-xs font-bold font-mono text-stone-900">
                        {(it.price * it.quantity).toFixed(2)}
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono">
                        {it.price.toFixed(2)}
                      </div>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>

          {/* Bogo Offer, Split, Complimentary, Sales Return, Total matching reference UI */}
          <div className="p-2.5 bg-[#faf7f2] border-t border-[#ded5c2] space-y-2 flex-shrink-0">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              
              <div className="flex items-center gap-2">
                {/* BOGO Offer button */}
                <button
                  onClick={() => setBogoApplied(!bogoApplied)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                    bogoApplied
                      ? 'bg-amber-400 text-maroon-950 ring-2 ring-amber-500'
                      : 'bg-[#faebd7] hover:bg-[#f5deb3] text-amber-900 border border-amber-300/80 shadow-2xs'
                  }`}
                >
                  Bogo Offer
                </button>

                {/* Split button */}
                <button
                  type="button"
                  onClick={() => setIsSplitModalOpen(true)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-stone-200 hover:bg-stone-300 text-stone-700 shadow-2xs cursor-pointer active:scale-95 transition-all"
                >
                  Split
                </button>

                {/* Complimentary Checkbox */}
                <label className="flex items-center gap-1 text-[11px] font-medium text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isComplimentary}
                    onChange={(e) => setIsComplimentary(e.target.checked)}
                    className="rounded text-maroon-800 focus:ring-maroon-800"
                  />
                  <span>Complimentary</span>
                </label>

                {/* Sales Return Checkbox */}
                <label className="flex items-center gap-1 text-[11px] font-medium text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSalesReturn}
                    onChange={(e) => setIsSalesReturn(e.target.checked)}
                    className="rounded text-maroon-800 focus:ring-maroon-800"
                  />
                  <span>Sales Return</span>
                </label>
              </div>

              {/* Total Display */}
              <div className="flex items-baseline gap-1.5 ml-auto">
                <span className="text-xs font-semibold text-stone-600">Total:</span>
                <span className="text-xl font-extrabold font-mono text-stone-900">
                  {grandTotal}
                </span>
              </div>

            </div>

            {/* Payment Modes Row matching reference image */}
            <div className="pt-2 border-t border-stone-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                {/* Not Paid */}
                <button
                  onClick={() => {
                    setPaymentMode('Not Paid');
                    setIsPaidChecked(false);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold inline-flex items-center gap-1 transition-all ${
                    paymentMode === 'Not Paid'
                      ? 'bg-stone-300 text-stone-900 border border-stone-400 font-extrabold shadow-2xs'
                      : 'bg-stone-100 text-stone-600 border border-stone-200'
                  }`}
                >
                  <Ban className="w-3 h-3 text-stone-500" />
                  <span>Not Paid</span>
                </button>

                {/* Cash */}
                <button
                  onClick={() => {
                    setPaymentMode('Cash');
                    setIsPaidChecked(true);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold inline-flex items-center gap-1 transition-all ${
                    paymentMode === 'Cash'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-400 font-extrabold shadow-2xs'
                      : 'bg-stone-100 text-stone-600 border border-stone-200'
                  }`}
                >
                  <Banknote className="w-3 h-3 text-emerald-700" />
                  <span>Cash</span>
                </button>

                {/* Card */}
                <button
                  onClick={() => {
                    setPaymentMode('Card');
                    setIsPaidChecked(true);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold inline-flex items-center gap-1 transition-all ${
                    paymentMode === 'Card'
                      ? 'bg-blue-100 text-blue-900 border border-blue-400 font-extrabold shadow-2xs'
                      : 'bg-stone-100 text-stone-600 border border-stone-200'
                  }`}
                >
                  <CreditCard className="w-3 h-3 text-blue-700" />
                  <span>Card</span>
                </button>

                {/* Other button with dropdown options */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsOtherMenuOpen(!isOtherMenuOpen)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold inline-flex items-center gap-1 transition-all cursor-pointer ${
                      paymentMode === 'Other' || paymentMode === 'Due' || paymentMode === 'Part' || paymentMode === 'Online/UPI'
                        ? 'bg-purple-100 text-purple-900 border border-purple-400 font-extrabold shadow-2xs'
                        : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200'
                    }`}
                  >
                    <span>
                      {paymentMode === 'Due'
                        ? dueCustomerInfo && dueCustomerInfo.paidAmount && dueCustomerInfo.paidAmount > 0
                          ? `Due ₹${dueCustomerInfo.dueAmount} (Paid ₹${dueCustomerInfo.paidAmount})`
                          : 'Due Payment'
                        : paymentMode === 'Part'
                        ? 'Part Payment'
                        : paymentMode === 'Online/UPI'
                        ? 'Online/UPI'
                        : 'Other ▾'}
                    </span>
                  </button>

                  {/* Dropdown containing Online/UPI, Part Payment, Due Payment, Wallets */}
                  {isOtherMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setIsOtherMenuOpen(false)}
                      />
                      <div className="absolute bottom-full left-0 mb-1.5 w-48 bg-white rounded-xl shadow-2xl border border-stone-200 py-1 z-40 animate-fadeIn text-xs font-semibold">
                        
                        {/* 1. Online / UPI */}
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentMode('Online/UPI' as any);
                            setIsPaidChecked(true);
                            setIsOtherMenuOpen(false);
                            showToast('Payment mode: Online / UPI (GPay, PhonePe, Paytm)');
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-stone-50 flex items-center gap-2 text-stone-800 transition-colors"
                        >
                          <QrCode className="w-3.5 h-3.5 text-blue-600" />
                          <span>Online / UPI</span>
                        </button>

                        {/* 2. Part Payment */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsPartPaymentModalOpen(true);
                            setIsOtherMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-stone-50 flex items-center gap-2 text-stone-800 transition-colors"
                        >
                          <Percent className="w-3.5 h-3.5 text-purple-600" />
                          <span>Part Payment</span>
                        </button>

                        {/* 3. Due Payment */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsDuePaymentModalOpen(true);
                            setIsOtherMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-stone-50 flex items-center gap-2 text-stone-800 transition-colors"
                        >
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Due Payment</span>
                        </button>

                        {/* 4. Wallets */}
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentMode('Other');
                            setIsPaidChecked(true);
                            setIsOtherMenuOpen(false);
                            showToast('Payment mode: Wallets');
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-stone-50 flex items-center gap-2 text-stone-800 transition-colors"
                        >
                          <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Wallets</span>
                        </button>

                      </div>
                    </>
                  )}
                </div>

                {/* Discount button matching Image 1 */}
                <button
                  type="button"
                  onClick={() => setIsDiscountModalOpen(true)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold inline-flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95 ${
                    discountValue > 0
                      ? 'bg-amber-100 text-amber-900 border border-amber-400 font-extrabold'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                  }`}
                  title="Apply Discount (Percentage, Fixed or Coupon Code)"
                >
                  <Percent className="w-3 h-3 text-amber-700" />
                  <span>
                    {discountValue > 0
                      ? `Discount (${discountType === 'percentage' ? `${discountValue}%` : `₹${discountValue}`})`
                      : 'Discount'}
                  </span>
                </button>
              </div>

              {/* It's Paid Checkbox */}
              <label className="flex items-center gap-1 text-[11px] font-bold text-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPaidChecked}
                  onChange={(e) => {
                    setIsPaidChecked(e.target.checked);
                    if (e.target.checked && paymentMode === 'Not Paid') {
                      setPaymentMode('Cash');
                    }
                  }}
                  className="rounded text-maroon-800 focus:ring-maroon-800"
                />
                <span>It's Paid</span>
              </label>
            </div>
          </div>

          {/* Bottom Action Buttons Row (Save, Save & Print, Save & EBill, KOT, KOT & Print, Hold) */}
          <div className="p-2.5 bg-[#ede8dd] border-t border-[#ded5c2] grid grid-cols-3 sm:grid-cols-6 gap-1.5 flex-shrink-0">
            {/* Save (Maroon, text #fdfaf6) */}
            <button
              onClick={handleSave}
              className="btn-premium-maroon py-2 rounded-lg text-xs font-bold text-[#fdfaf6] shadow-xs active:scale-95 text-center"
            >
              Save
            </button>

            {/* Save & Print (Maroon, text #fdfaf6) */}
            <button
              onClick={handleSaveAndPrint}
              className="btn-premium-maroon py-2 rounded-lg text-xs font-bold text-[#fdfaf6] shadow-xs active:scale-95 text-center"
            >
              Save & Print
            </button>

            {/* Save & EBill (Maroon, text #fdfaf6) */}
            <button
              onClick={handleSaveAndEBill}
              className="btn-premium-maroon py-2 rounded-lg text-xs font-bold text-[#fdfaf6] shadow-xs active:scale-95 text-center"
            >
              Save & EBill
            </button>

            {/* KOT (Dark Slate, text #fdfaf6) */}
            <button
              onClick={handleKOT}
              className="bg-slate-800 hover:bg-slate-900 text-[#fdfaf6] py-2 rounded-lg text-xs font-bold shadow-xs active:scale-95 text-center transition-all"
            >
              KOT
            </button>

            {/* KOT & Print (Dark Slate, text #fdfaf6) */}
            <button
              onClick={handleKOTAndPrint}
              className="bg-slate-800 hover:bg-slate-900 text-[#fdfaf6] py-2 rounded-lg text-xs font-bold shadow-xs active:scale-95 text-center transition-all"
            >
              KOT & Print
            </button>

            {/* Hold (Dark Slate, text #fdfaf6) */}
            <button
              onClick={handleHold}
              className="bg-slate-800 hover:bg-slate-900 text-[#fdfaf6] py-2 rounded-lg text-xs font-bold shadow-xs active:scale-95 text-center transition-all"
            >
              Hold
            </button>
          </div>

        </div>

      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 right-4 z-50 bg-[#731b21] text-[#fdfaf6] text-xs font-semibold px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 border border-amber-300/40 animate-slideIn">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Square Item Cancellation Modal (Image 1) */}
      <CancelItemModal
        isOpen={Boolean(itemToCancel)}
        item={itemToCancel}
        onClose={() => setItemToCancel(null)}
        onConfirmCancel={handleConfirmCancelItem}
      />

      {/* 2. Dish Variations & Addons Modal (Image 2) */}
      <DishVariationModal
        isOpen={Boolean(variationItem)}
        item={variationItem}
        onClose={() => setVariationItem(null)}
        onConfirm={handleConfirmVariation}
      />

      {/* 3. Part Payment Modal (Image 3) */}
      <PartPaymentModal
        isOpen={isPartPaymentModalOpen}
        onClose={() => setIsPartPaymentModalOpen(false)}
        billNo={table.billNo || '861'}
        totalPayable={grandTotal}
        onConfirmPartPayment={(parts, action) => {
          setPaymentMode('Part' as any);
          setIsPaidChecked(true);
          showToast(`Part payment recorded (${parts.length} parts)`);
          if (action === 'print') {
            handleSaveAndPrint();
          } else if (action === 'ebill') {
            handleSaveAndEBill();
          } else {
            handleSave();
          }
        }}
        onOpenDuePayment={() => {
          setIsPartPaymentModalOpen(false);
          setIsDuePaymentModalOpen(true);
        }}
      />

      {/* 4. Split Bill Modal (Image 4) */}
      <SplitBillModal
        isOpen={isSplitModalOpen}
        onClose={() => setIsSplitModalOpen(false)}
        items={currentItems}
        totalAmount={grandTotal}
        onConfirmSplit={handleConfirmSplit}
      />

      {/* 5. Due Payment Modal (Image 3 / Due details) */}
      <DuePaymentModal
        isOpen={isDuePaymentModalOpen}
        onClose={() => setIsDuePaymentModalOpen(false)}
        totalAmount={grandTotal}
        initialName={customerName}
        initialPhone={customerPhone}
        initialLocation={customerLocation}
        onConfirmDue={handleConfirmDue}
      />

      {/* 6. Applied Discount Modal (Image 1) */}
      <AppliedDiscountModal
        isOpen={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
        items={currentItems}
        subtotal={rawSubtotal}
        currentDiscountValue={discountValue}
        currentDiscountType={discountType}
        onApplyDiscount={(disc) => {
          setDiscountType(disc.type);
          setDiscountValue(disc.value);
          setDiscountReason(disc.reason);
          showToast(
            `Discount applied: ${disc.type === 'percentage' ? `${disc.value}%` : `₹${disc.value}`} (${disc.reason})`
          );
        }}
      />

      {/* 7. Order Wise Comments Modal (Image 3) */}
      <OrderWiseCommentsModal
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        currentComment={orderNotes}
        onSaveComment={(cmt) => {
          setOrderNotes(cmt);
          showToast('Order comments updated for kitchen');
        }}
      />

      {/* 8. Dish Special Notes Modal (Image 4) */}
      <DishSpecialNotesModal
        isOpen={Boolean(itemForSpecialNotes)}
        item={itemForSpecialNotes}
        onClose={() => setItemForSpecialNotes(null)}
        onSaveNotes={(targetItem, specialNote) => {
          setCurrentItems((prev) =>
            prev.map((it) => (it.id === targetItem.id ? { ...it, customization: specialNote } : it))
          );
          showToast(`Note updated for ${targetItem.name}`);
        }}
      />

    </div>
  );
};


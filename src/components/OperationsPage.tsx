import React, { useState } from 'react';
import {
  FileText,
  Receipt,
  CreditCard,
  Radio,
  Printer,
  LayoutGrid,
  Sliders,
  Banknote,
  TrendingDown,
  ArrowDownCircle,
  Percent,
  RefreshCw,
  Calculator,
  BookOpen,
  ToggleLeft,
  ToggleRight,
  Calendar,
  Users,
  MessageSquare,
  Boxes,
  UserCheck,
  Bell,
  HelpCircle,
  Languages,
  Settings,
  CheckCircle2,
  Clock,
  X,
  Search,
  Check,
  AlertTriangle,
  Sparkles,
  ReceiptText,
  Tag,
  Wallet,
  ChefHat,
  SlidersHorizontal
} from 'lucide-react';
import { Table, Reservation, TaxRule, DiscountRule } from '../types/pos';
import { MENU_CATALOG, MOCK_RESERVATIONS, MOCK_TAX_RULES, MOCK_DISCOUNT_RULES } from '../data/mockData';
import { DayEndSummaryPage } from './DayEndSummaryPage';
import { DuePaymentPage } from './DuePaymentPage';
import { TableManagementPage } from './TableManagementPage';
import { BillKotPrintPage } from './BillKotPrintPage';
import { ItemOnOffPage } from './ItemOnOffPage';
import { MenuManagementPage } from './MenuManagementPage';
import { TaxesManagementPage } from './TaxesManagementPage';
import { DiscountsManagementPage } from './DiscountsManagementPage';
import { TableReservationPage } from './TableReservationPage';

interface OperationsPageProps {
  onNavigateToBilling: (table?: Table) => void;
  onNavigateToTables: () => void;
  onOpenReservation: () => void;
  onOpenKds: () => void;
  onOpenLiveView?: () => void;
  onOpenOrders?: () => void;
  onOpenReports: () => void;
  onOpenSettings: () => void;
  tables: Table[];
  onPrintBill?: (table: Table) => void;
  onUpdateTables?: (tables: Table[]) => void;
  initialOpenSection?: 'tables' | 'menu' | 'reservation' | 'taxes' | 'discounts' | null;
  reservations?: Reservation[];
  onUpdateReservations?: (res: Reservation[]) => void;
  onSeatCustomer?: (tableId: string, guestName: string, partySize: number) => void;
  taxRules?: TaxRule[];
  onUpdateTaxRules?: (rules: TaxRule[]) => void;
  discountRules?: DiscountRule[];
  onUpdateDiscountRules?: (rules: DiscountRule[]) => void;
}

export const OperationsPage: React.FC<OperationsPageProps> = ({
  onNavigateToBilling,
  onNavigateToTables,
  onOpenReservation,
  onOpenKds,
  onOpenLiveView,
  onOpenOrders,
  onOpenReports,
  onOpenSettings,
  tables,
  onPrintBill,
  onUpdateTables,
  initialOpenSection,
  reservations = MOCK_RESERVATIONS,
  onUpdateReservations,
  onSeatCustomer,
  taxRules = MOCK_TAX_RULES,
  onUpdateTaxRules,
  discountRules = MOCK_DISCOUNT_RULES,
  onUpdateDiscountRules,
}) => {
  // Modal states for interactive features
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isDayEndOpen, setIsDayEndOpen] = useState<boolean>(false);
  const [isDuePaymentPageOpen, setIsDuePaymentPageOpen] = useState<boolean>(false);
  const [isTableManagementOpen, setIsTableManagementOpen] = useState<boolean>(initialOpenSection === 'tables');
  const [isBillKotPrintOpen, setIsBillKotPrintOpen] = useState<boolean>(false);
  const [isItemOnOffOpen, setIsItemOnOffOpen] = useState<boolean>(false);
  const [isMenuManagementOpen, setIsMenuManagementOpen] = useState<boolean>(initialOpenSection === 'menu');
  const [isTaxesOpen, setIsTaxesOpen] = useState<boolean>(initialOpenSection === 'taxes');
  const [isDiscountsOpen, setIsDiscountsOpen] = useState<boolean>(initialOpenSection === 'discounts');
  const [isReservationPageOpen, setIsReservationPageOpen] = useState<boolean>(initialOpenSection === 'reservation');
  const [syncProgress, setSyncProgress] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialOpenSection === 'tables') setIsTableManagementOpen(true);
    if (initialOpenSection === 'menu') setIsMenuManagementOpen(true);
    if (initialOpenSection === 'taxes') setIsTaxesOpen(true);
    if (initialOpenSection === 'discounts') setIsDiscountsOpen(true);
    if (initialOpenSection === 'reservation') setIsReservationPageOpen(true);
  }, [initialOpenSection]);

  // In-memory stock toggle state for Menu Item On/Off
  const [itemAvailability, setItemAvailability] = useState<Record<string, boolean>>({
    'p-1': true,
    'p-2': true,
    'p-3': true,
    'p-4': true,
    'p-5': true,
    'fp-1': true,
    'fav-1': true,
    'fav-2': true,
    'sd-1': true,
    'st-1': true,
    'mok-1': false, // Solkadhi 86ed demo
  });

  // Cash flow demo register
  const [cashEntries, setCashEntries] = useState([
    { id: 1, type: 'Opening Float', amount: 2000, time: '11:00 AM', note: 'Morning opening balance' },
    { id: 2, type: 'Cash In', amount: 3500, time: '02:30 PM', note: 'Bill settlements counter #1' },
    { id: 3, type: 'Expense', amount: 450, time: '04:15 PM', note: 'Dairy milk purchase' },
    { id: 4, type: 'Withdrawal', amount: 1000, time: '05:00 PM', note: 'Safe drop transfer' },
  ]);
  const [newCashAmount, setNewCashAmount] = useState('');
  const [newCashNote, setNewCashNote] = useState('');
  const [cashActionType, setCashActionType] = useState<'Cash Flow' | 'Expense' | 'Withdrawal'>('Cash Flow');

  // Customer Directory demo data
  const customerList = [
    { name: 'Aditya Patil', phone: '+91 98220 11442', visits: 14, spend: 12450, favorite: 'Maharashtrian Thali' },
    { name: 'Pooja Kulkarni', phone: '+91 94223 99881', visits: 8, spend: 6890, favorite: 'Capsicum & Onion Pizza' },
    { name: 'Rohan Deshmukh', phone: '+91 98812 33455', visits: 21, spend: 28400, favorite: 'Tandoori Paneer Tikka' },
    { name: 'Neha Joshi', phone: '+91 91580 44556', visits: 5, spend: 3200, favorite: 'Fresh Lime Soda' },
  ];

  // Feedback demo data
  const feedbackList = [
    { customer: 'Aditya Patil', rating: 5, comment: 'Authentic flavors and super quick service! Loved the Solkadhi.', date: 'Today, 2:45 PM' },
    { customer: 'Suresh More', rating: 4, comment: 'Pizzas were crisp and loaded with toppings. Friendly staff.', date: 'Today, 1:30 PM' },
    { customer: 'Meera Rao', rating: 5, comment: 'Best Maharashtrian restaurant in town for family dinners.', date: 'Yesterday' },
  ];

  // Inventory items
  const inventoryItems = [
    { item: 'Pizza Dough Balls (11")', stock: 35, unit: 'pcs', threshold: 15, status: 'Good' },
    { item: 'Fresh Mozzarella Cheese', stock: 4.5, unit: 'kg', threshold: 5, status: 'Low' },
    { item: 'Malai Paneer', stock: 12, unit: 'kg', threshold: 6, status: 'Good' },
    { item: 'Solkadhi Kokum Concentrate', stock: 1.2, unit: 'Ltr', threshold: 3, status: 'Critical' },
    { item: 'Amul Table Butter', stock: 8, unit: 'blocks', threshold: 4, status: 'Good' },
  ];

  // Show temporary toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle Manual Sync
  const handleManualSync = () => {
    setSyncProgress(true);
    setTimeout(() => {
      setSyncProgress(false);
      triggerToast('Cloud synchronization completed! All offline orders & inventory synced.');
    }, 1200);
  };

  // Toggle item in stock / 86
  const toggleItemStock = (id: string) => {
    setItemAvailability((prev) => {
      const next = !prev[id];
      triggerToast(`Item status updated to ${next ? 'In Stock (ON)' : 'Out of Stock (OFF)'}`);
      return { ...prev, [id]: next };
    });
  };

  // Add Cash Entry
  const handleAddCashEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCashAmount) return;
    const val = parseFloat(newCashAmount);
    setCashEntries((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: cashActionType,
        amount: val,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        note: newCashNote || `${cashActionType} transaction`
      }
    ]);
    setNewCashAmount('');
    setNewCashNote('');
    triggerToast(`${cashActionType} of ₹${val} recorded successfully!`);
  };

  // Total in cash drawer
  const totalCashDrawer = cashEntries.reduce((acc, it) => {
    if (it.type === 'Expense' || it.type === 'Withdrawal') return acc - it.amount;
    return acc + it.amount;
  }, 0);

  // Reusable Tile component
  const OperationTile: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    highlight?: boolean;
    badge?: string;
  }> = ({ icon, label, onClick, highlight = false, badge }) => (
    <button
      onClick={onClick}
      className={`relative p-3 sm:p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer group active:scale-98 select-none ${
        highlight
          ? 'bg-amber-50/70 border-amber-300 hover:border-maroon-800 hover:bg-amber-100/50 shadow-2xs'
          : 'bg-white hover:bg-[#fbf9f4] border-[#e2dacf] hover:border-maroon-800/80 shadow-2xs hover:shadow-xs'
      }`}
    >
      <div className="w-9 h-9 rounded-lg bg-[#f7f3ea] group-hover:bg-maroon-100/70 border border-[#e7e0d3] group-hover:border-maroon-300 flex items-center justify-center text-stone-700 group-hover:text-maroon-900 transition-colors flex-shrink-0 shadow-2xs">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs sm:text-[13px] font-semibold text-stone-800 group-hover:text-maroon-950 transition-colors truncate">
          {label}
        </div>
      </div>
      {badge && (
        <span className="absolute top-2 right-2 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-maroon-800 text-white">
          {badge}
        </span>
      )}
    </button>
  );

  if (isDayEndOpen) {
    return <DayEndSummaryPage onBack={() => setIsDayEndOpen(false)} />;
  }

  if (isDuePaymentPageOpen) {
    return <DuePaymentPage onBack={() => setIsDuePaymentPageOpen(false)} />;
  }

  if (isTableManagementOpen) {
    return (
      <TableManagementPage
        tables={tables}
        onBack={() => setIsTableManagementOpen(false)}
        onNavigateToBilling={onNavigateToBilling}
        onUpdateTables={onUpdateTables}
        onPrintBill={onPrintBill}
      />
    );
  }

  if (isBillKotPrintOpen) {
    return (
      <BillKotPrintPage
        tables={tables}
        onBack={() => setIsBillKotPrintOpen(false)}
        onNavigateToBilling={onNavigateToBilling}
        onPrintBill={onPrintBill}
      />
    );
  }

  if (isItemOnOffOpen) {
    return <ItemOnOffPage onBack={() => setIsItemOnOffOpen(false)} />;
  }

  if (isMenuManagementOpen) {
    return (
      <MenuManagementPage
        onBack={() => setIsMenuManagementOpen(false)}
        onNavigateToBilling={onNavigateToBilling}
      />
    );
  }

  if (isTaxesOpen) {
    return (
      <TaxesManagementPage
        onBack={() => setIsTaxesOpen(false)}
        taxRules={taxRules}
        onUpdateTaxRules={onUpdateTaxRules}
      />
    );
  }

  if (isDiscountsOpen) {
    return (
      <DiscountsManagementPage
        onBack={() => setIsDiscountsOpen(false)}
        discountRules={discountRules}
        onUpdateDiscountRules={onUpdateDiscountRules}
      />
    );
  }

  if (isReservationPageOpen) {
    return (
      <TableReservationPage
        onBack={() => setIsReservationPageOpen(false)}
        tables={tables}
        reservations={reservations}
        onUpdateReservations={onUpdateReservations}
        onSeatCustomer={onSeatCustomer}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#f7f4ed] overflow-hidden select-none">
      
      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed top-16 right-5 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-stone-700 animate-slideIn">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sub-bar: Operations Title (Placed on the left where the table view button was) */}
      <div className="bg-[#ede8dd] border-b border-[#ded5c2] px-4 sm:px-6 py-2.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center">
          <h2 className="font-roman font-bold text-lg sm:text-xl text-maroon-950 tracking-normal drop-shadow-2xs">
            Operations
          </h2>
        </div>
      </div>

      {/* Main Body Area: Full Width Grid (Scrollable) */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6">
        
        {/* ========================================================= */}
        {/* 1. ORDERS & BILLING                                       */}
        {/* ========================================================= */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-maroon-100/80 border border-maroon-300 flex items-center justify-center shadow-2xs">
              <ReceiptText className="w-4 h-4 text-maroon-900" />
            </div>
            <h3 className="font-roman font-bold text-base sm:text-lg text-maroon-950 tracking-normal drop-shadow-2xs">
              Orders & Billing
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-3.5">
            <OperationTile
              icon={<FileText className="w-4 h-4" />}
              label="Orders"
              onClick={() => {
                if (onOpenOrders) onOpenOrders();
                else setActiveModal('live-orders');
              }}
              badge="14"
            />
            <OperationTile
              icon={<Receipt className="w-4 h-4" />}
              label="KOTs"
              onClick={onOpenKds}
              badge="4 Prep"
            />
            <OperationTile
              icon={<CreditCard className="w-4 h-4" />}
              label="Due Payment"
              onClick={() => setIsDuePaymentPageOpen(true)}
            />
            <OperationTile
              icon={<Calculator className="w-4 h-4" />}
              label="Billing Screen"
              onClick={() => onNavigateToBilling()}
              highlight
            />
            <OperationTile
              icon={<Radio className="w-4 h-4" />}
              label="Live View"
              onClick={onOpenLiveView ? onOpenLiveView : () => setActiveModal('live-view')}
            />
            <OperationTile
              icon={<Printer className="w-4 h-4" />}
              label="Bill / KOT Print"
              onClick={() => setIsBillKotPrintOpen(true)}
              highlight
            />
            <OperationTile
              icon={<LayoutGrid className="w-4 h-4" />}
              label="Tables"
              onClick={() => setIsTableManagementOpen(true)}
              highlight
            />
            <OperationTile
              icon={<Sliders className="w-4 h-4" />}
              label="Custom Order Status"
              onClick={() => setActiveModal('custom-status')}
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. PAYMENTS & FINANCE                                     */}
        {/* ========================================================= */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-maroon-100/80 border border-maroon-300 flex items-center justify-center shadow-2xs">
              <Wallet className="w-4 h-4 text-maroon-900" />
            </div>
            <h3 className="font-roman font-bold text-base sm:text-lg text-maroon-950 tracking-normal drop-shadow-2xs">
              Payment & Finance
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-3.5">
            <OperationTile
              icon={<Banknote className="w-4 h-4" />}
              label="Cash Flow"
              onClick={() => {
                setCashActionType('Cash Flow');
                setActiveModal('cash-register');
              }}
            />
            <OperationTile
              icon={<Calendar className="w-4 h-4 text-[#731b21]" />}
              label="Day End"
              highlight
              onClick={() => setIsDayEndOpen(true)}
            />
            <OperationTile
              icon={<ArrowDownCircle className="w-4 h-4" />}
              label="Withdrawal"
              onClick={() => {
                setCashActionType('Withdrawal');
                setActiveModal('cash-register');
              }}
            />
            <OperationTile
              icon={<Percent className="w-4 h-4" />}
              label="Tax"
              onClick={() => setIsTaxesOpen(true)}
              highlight
            />
            <OperationTile
              icon={<Percent className="w-4 h-4" />}
              label="Discount"
              onClick={() => setIsDiscountsOpen(true)}
              highlight
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. MENU & INVENTORY                                       */}
        {/* ========================================================= */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-maroon-100/80 border border-maroon-300 flex items-center justify-center shadow-2xs">
              <ChefHat className="w-4 h-4 text-maroon-900" />
            </div>
            <h3 className="font-roman font-bold text-base sm:text-lg text-maroon-950 tracking-normal drop-shadow-2xs">
              Menu & Inventory
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-3.5">
            <OperationTile
              icon={<BookOpen className="w-4 h-4" />}
              label="Menu"
              onClick={() => setIsMenuManagementOpen(true)}
              highlight
            />
            <OperationTile
              icon={<ToggleRight className="w-4 h-4" />}
              label="Menu Item On Off"
              onClick={() => setIsItemOnOffOpen(true)}
              highlight
            />
            <OperationTile
              icon={<Calendar className="w-4 h-4" />}
              label="Table Reservation"
              onClick={() => setIsReservationPageOpen(true)}
              highlight
            />
            <OperationTile
              icon={<Users className="w-4 h-4" />}
              label="Customers"
              onClick={() => setActiveModal('customers')}
            />
            <OperationTile
              icon={<MessageSquare className="w-4 h-4" />}
              label="Feedback"
              onClick={() => setActiveModal('feedback')}
            />
            <OperationTile
              icon={<Boxes className="w-4 h-4" />}
              label="Inventory"
              onClick={() => setActiveModal('inventory')}
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. SYSTEM SETTINGS                                        */}
        {/* ========================================================= */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-maroon-100/80 border border-maroon-300 flex items-center justify-center shadow-2xs">
              <SlidersHorizontal className="w-4 h-4 text-maroon-900" />
            </div>
            <h3 className="font-roman font-bold text-base sm:text-lg text-maroon-950 tracking-normal drop-shadow-2xs">
              System Setting
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-3.5">
            <OperationTile
              icon={<UserCheck className="w-4 h-4" />}
              label="Billing User Profile"
              onClick={onOpenSettings}
            />
            <OperationTile
              icon={<RefreshCw className={`w-4 h-4 ${syncProgress ? 'animate-spin text-maroon-900' : ''}`} />}
              label={syncProgress ? 'Syncing...' : 'Manual Sync'}
              onClick={handleManualSync}
            />
            <OperationTile
              icon={<Bell className="w-4 h-4" />}
              label="Alerts"
              onClick={() => setActiveModal('alerts')}
              badge="3"
            />
            <OperationTile
              icon={<HelpCircle className="w-4 h-4" />}
              label="Shortcuts"
              onClick={() => setActiveModal('shortcuts')}
            />
            <OperationTile
              icon={<Languages className="w-4 h-4" />}
              label="Language"
              onClick={() => setActiveModal('language')}
            />
            <OperationTile
              icon={<Settings className="w-4 h-4" />}
              label="Settings"
              onClick={onOpenSettings}
            />
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* INTERACTIVE FEATURE MODALS                                */}
      {/* ========================================================= */}

      {/* 1. Menu Item On / Off (86 Out-of-Stock Toggle Modal) */}
      {activeModal === 'menu-toggle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs select-none">
          <div className="bg-[#f7f4ed] w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-gradient-to-r from-maroon-900 to-maroon-800 px-5 py-3.5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                  <ToggleRight className="w-5 h-5 text-amber-300" />
                  <span>Menu Item On / Off (Kitchen Stock Toggle)</span>
                </h3>
                <p className="text-xs text-amber-200/80">Turn paused or out-of-stock items off in real-time</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto divide-y divide-stone-200">
              {MENU_CATALOG.slice(0, 12).map((dish) => {
                const inStock = itemAvailability[dish.id] !== false;
                return (
                  <div key={dish.id} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3.5 h-3.5 border flex items-center justify-center rounded-xs ${dish.isVeg !== false ? 'border-emerald-600' : 'border-rose-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${dish.isVeg !== false ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-stone-900">{dish.name}</div>
                        <div className="text-[11px] text-stone-500 font-mono">₹{dish.price.toFixed(2)} • {dish.category}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleItemStock(dish.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        inStock
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-rose-100 text-rose-900 border border-rose-300'
                      }`}
                    >
                      {inStock ? (
                        <>
                          <ToggleRight className="w-4 h-4 text-emerald-700" />
                          <span>In Stock (ON)</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4 text-rose-700" />
                          <span>Out of Stock (OFF)</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="px-5 py-3 bg-[#ede8dd] border-t border-stone-300 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-lg bg-maroon-800 text-white font-bold text-xs hover:bg-maroon-900"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Cash Flow / Expense / Withdrawal Modal */}
      {activeModal === 'cash-register' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs select-none">
          <div className="bg-[#f7f4ed] w-full max-w-xl rounded-2xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col max-h-[88vh]">
            <div className="bg-gradient-to-r from-maroon-900 to-maroon-800 px-5 py-3.5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-amber-300" />
                  <span>Cash Flow, Expense & Withdrawal Register</span>
                </h3>
                <p className="text-xs text-amber-200/80">Current Drawer Balance: ₹{totalCashDrawer.toLocaleString('en-IN')}</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              {/* Add Entry Form */}
              <form onSubmit={handleAddCashEntry} className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-3">
                <div className="flex gap-2">
                  {(['Cash Flow', 'Expense', 'Withdrawal'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setCashActionType(t)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        cashActionType === t
                          ? 'bg-maroon-800 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={newCashAmount}
                    onChange={(e) => setNewCashAmount(e.target.value)}
                    className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono font-bold"
                  />
                  <input
                    type="text"
                    placeholder="Reason / Note"
                    value={newCashNote}
                    onChange={(e) => setNewCashNote(e.target.value)}
                    className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all"
                >
                  Record Entry
                </button>
              </form>

              {/* Transactions List */}
              <div className="divide-y divide-stone-100 bg-white rounded-xl border border-stone-200 p-3">
                <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">Today's Cash Ledger</div>
                {cashEntries.map((it) => (
                  <div key={it.id} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-stone-800">{it.type}</div>
                      <div className="text-[10px] text-stone-500">{it.note} • {it.time}</div>
                    </div>
                    <div className={`font-mono font-bold ${it.type === 'Expense' || it.type === 'Withdrawal' ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {it.type === 'Expense' || it.type === 'Withdrawal' ? '-' : '+'}₹{it.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-5 py-3 bg-[#ede8dd] border-t border-stone-300 flex justify-between items-center text-xs">
              <span className="text-stone-600">Register: <strong>Counter #1 (Manager)</strong></span>
              <button onClick={() => setActiveModal(null)} className="px-4 py-1.5 rounded-lg bg-maroon-800 text-white font-bold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Customers CRM Modal */}
      {activeModal === 'customers' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs select-none">
          <div className="bg-[#f7f4ed] w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-gradient-to-r from-maroon-900 to-maroon-800 px-5 py-3.5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-300" />
                  <span>Customer Directory & Loyalty Profiles</span>
                </h3>
                <p className="text-xs text-amber-200/80">Manage regular diners, loyalty points, and purchase history</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-2.5">
              {customerList.map((c, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-100 text-maroon-900 font-bold text-xs flex items-center justify-center font-mono">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-stone-900">{c.name}</div>
                      <div className="text-[11px] text-stone-500 font-mono">{c.phone}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold font-mono text-stone-900">₹{c.spend.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-stone-500">{c.visits} Visits • Prefers: {c.favorite}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 py-3 bg-[#ede8dd] border-t border-stone-300 flex justify-end">
              <button onClick={() => setActiveModal(null)} className="px-4 py-1.5 rounded-lg bg-maroon-800 text-white font-bold text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Feedback & Reviews Modal */}
      {activeModal === 'feedback' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs select-none">
          <div className="bg-[#f7f4ed] w-full max-w-xl rounded-2xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-gradient-to-r from-maroon-900 to-maroon-800 px-5 py-3.5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-300" />
                  <span>Customer Reviews & Guest Feedback</span>
                </h3>
                <p className="text-xs text-amber-200/80">Average Dining Rating: 4.8 / 5.0 (★)</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              {feedbackList.map((f, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white border border-stone-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-stone-900">{f.customer}</span>
                    <span className="text-[11px] text-amber-500 font-bold font-mono">{'★'.repeat(f.rating)}</span>
                  </div>
                  <p className="text-xs text-stone-600 italic">"{f.comment}"</p>
                  <div className="text-[10px] text-stone-400 mt-2">{f.date}</div>
                </div>
              ))}
            </div>

            <div className="px-5 py-3 bg-[#ede8dd] border-t border-stone-300 flex justify-end">
              <button onClick={() => setActiveModal(null)} className="px-4 py-1.5 rounded-lg bg-maroon-800 text-white font-bold text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Inventory & Stock Modal */}
      {activeModal === 'inventory' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs select-none">
          <div className="bg-[#f7f4ed] w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-gradient-to-r from-maroon-900 to-maroon-800 px-5 py-3.5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                  <Boxes className="w-5 h-5 text-amber-300" />
                  <span>Kitchen Raw Material & Inventory Levels</span>
                </h3>
                <p className="text-xs text-amber-200/80">Track store room requisitions and threshold alerts</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-2.5">
              {inventoryItems.map((inv, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-stone-900">{inv.item}</div>
                    <div className="text-[10px] text-stone-500">Min. Alert Level: {inv.threshold} {inv.unit}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-stone-900">{inv.stock} {inv.unit}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      inv.status === 'Critical'
                        ? 'bg-rose-100 text-rose-800'
                        : inv.status === 'Low'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 py-3 bg-[#ede8dd] border-t border-stone-300 flex justify-end">
              <button onClick={() => setActiveModal(null)} className="px-4 py-1.5 rounded-lg bg-maroon-800 text-white font-bold text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Keyboard Shortcuts Modal */}
      {activeModal === 'shortcuts' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs select-none">
          <div className="bg-[#f7f4ed] w-full max-w-md rounded-2xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-maroon-900 to-maroon-800 px-5 py-3.5 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-300" />
                <span>POS Keyboard Shortcuts</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-2 text-xs">
              {[
                { key: 'F1', desc: 'Home Table Floor Map' },
                { key: 'F2', desc: 'Search Dish Item / Short Code' },
                { key: 'F3', desc: 'Kitchen Order Ticket (KOT)' },
                { key: 'F4', desc: 'Save & Print Invoice' },
                { key: 'F8', desc: 'Quick Cash Payment' },
                { key: 'Esc', desc: 'Close Active Modal / Back' },
              ].map((s, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-white border border-stone-200 flex items-center justify-between">
                  <span className="font-mono font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-900 border border-stone-300">{s.key}</span>
                  <span className="text-stone-700 font-medium">{s.desc}</span>
                </div>
              ))}
            </div>

            <div className="px-5 py-3 bg-[#ede8dd] border-t border-stone-300 flex justify-end">
              <button onClick={() => setActiveModal(null)} className="px-4 py-1.5 rounded-lg bg-maroon-800 text-white font-bold text-xs">
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Tax & Discount Modal */}
      {activeModal === 'tax-discount' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs select-none">
          <div className="bg-[#f7f4ed] w-full max-w-md rounded-2xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-maroon-900 to-maroon-800 px-5 py-3.5 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <Percent className="w-5 h-5 text-amber-300" />
                <span>Taxation & Discount Rules</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2">
                <div className="font-bold text-stone-900">Current Tax Setup</div>
                <div className="flex justify-between text-stone-600">
                  <span>Central GST (CGST)</span>
                  <span className="font-mono font-bold">2.5%</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>State GST (SGST)</span>
                  <span className="font-mono font-bold">2.5%</span>
                </div>
                <div className="flex justify-between text-stone-900 font-bold pt-1 border-t border-stone-100">
                  <span>Total Applied GST</span>
                  <span className="font-mono text-maroon-900">5.0%</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2">
                <div className="font-bold text-stone-900">Active Discount Programs</div>
                <div className="flex justify-between text-stone-600">
                  <span>BOGO Pizza Offer</span>
                  <span className="font-mono text-emerald-700 font-bold">Enabled</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Complimentary Manager Pass</span>
                  <span className="font-mono text-emerald-700 font-bold">Enabled</span>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-[#ede8dd] border-t border-stone-300 flex justify-end">
              <button onClick={() => setActiveModal(null)} className="px-4 py-1.5 rounded-lg bg-maroon-800 text-white font-bold text-xs">
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Live View / Active Orders Modal */}
      {(activeModal === 'live-view' || activeModal === 'live-orders' || activeModal === 'online-orders') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs select-none">
          <div className="bg-[#f7f4ed] w-full max-w-xl rounded-2xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-gradient-to-r from-maroon-900 to-maroon-800 px-5 py-3.5 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base capitalize">
                {activeModal.replace('-', ' ')}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-2.5">
              {tables.filter((t) => t.status !== 'blank').map((t) => (
                <div key={t.id} className="p-3.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-stone-900 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-maroon-800 text-white font-roman">{t.id}</span>
                      <span>({t.zone} Zone)</span>
                    </div>
                    <div className="text-[10px] text-stone-500 mt-1">
                      KOT: {t.kotNo} • Seated: {t.seatedAt} • Server: {t.serverName}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-stone-900">₹{t.amount.toFixed(2)}</div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 py-3 bg-[#ede8dd] border-t border-stone-300 flex justify-end">
              <button onClick={() => setActiveModal(null)} className="px-4 py-1.5 rounded-lg bg-maroon-800 text-white font-bold text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Alerts Modal */}
      {activeModal === 'alerts' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs select-none">
          <div className="bg-[#f7f4ed] w-full max-w-md rounded-2xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-maroon-900 to-maroon-800 px-5 py-3.5 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-300" />
                <span>Active System Alerts</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-700" />
                  <span>Table A1 Exceeded Expected Seating Time</span>
                </div>
                <div className="text-[11px] text-rose-700 mt-1">Seated for &gt; 4 hours. Captain informed to present bill.</div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                <div className="font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>Low Inventory: Solkadhi Kokum</span>
                </div>
                <div className="text-[11px] text-amber-700 mt-1">Only 1.2 Liters left in storage. Reorder recommended.</div>
              </div>

              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900">
                <div className="font-bold flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-blue-700" />
                  <span>Swiggy Online Delivery Pending Accept</span>
                </div>
                <div className="text-[11px] text-blue-700 mt-1">Order #SW-9821 awaiting kitchen acceptance.</div>
              </div>
            </div>

            <div className="px-5 py-3 bg-[#ede8dd] border-t border-stone-300 flex justify-end">
              <button onClick={() => setActiveModal(null)} className="px-4 py-1.5 rounded-lg bg-maroon-800 text-white font-bold text-xs">
                Acknowledge All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. Language Switcher Modal */}
      {activeModal === 'language' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs select-none">
          <div className="bg-[#f7f4ed] w-full max-w-sm rounded-2xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-maroon-900 to-maroon-800 px-5 py-3.5 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <Languages className="w-5 h-5 text-amber-300" />
                <span>Interface Language</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-2 text-xs">
              {['English (India)', 'मराठी (Marathi)', 'हिंदी (Hindi)'].map((lang, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    triggerToast(`Language changed to ${lang}`);
                    setActiveModal(null);
                  }}
                  className="w-full p-3 rounded-xl bg-white border border-stone-200 hover:border-maroon-800 flex items-center justify-between font-bold text-stone-800 hover:text-maroon-950 transition-all cursor-pointer"
                >
                  <span>{lang}</span>
                  {idx === 0 && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};


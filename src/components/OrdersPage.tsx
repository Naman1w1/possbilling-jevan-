import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  UtensilsCrossed,
  Bike,
  ShoppingBag,
  Layers,
  Printer,
  Eye,
  XCircle,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Table, OrderItem } from '../types/pos';

export interface PosOrderRecord {
  id: string;
  orderNo: string;
  orderType: 'Dine In' | 'Delivery' | 'Pick Up';
  tableOrChannel: string;
  floorZone: string;
  billingUser?: string;
  customerPhone?: string;
  customerName?: string;
  customerAddress?: string;
  customerLocality?: string;
  noOfPersons?: number | string;
  paymentType: 'Cash' | 'Card' | 'Online/UPI' | 'Due' | 'Part';
  netAmount: number;
  tax: number;
  discount: number;
  grandTotal: number;
  settlementAmount?: string | number;
  status: 'saved' | 'printed' | 'cancelled' | 'paid';
  printedTimes?: number;
  serviceTax?: string | number;
  couponCode?: string;
  deliveryCharge?: string | number;
  tip?: string | number;
  subOrderType?: string;
  settlementCounter?: string;
  settlementBy?: string;
  sequenceName?: string;
  category: 'current' | 'online' | 'advance';
  createdAt: string;
  items: Array<OrderItem & { specialNote?: string }>;
}

interface OrdersPageProps {
  tables?: Table[];
  onBack: () => void;
  onNavigateToBilling?: (table?: Table) => void;
  onPrintBill?: (table: Table) => void;
}

const INITIAL_ORDERS_DATA: PosOrderRecord[] = [
  {
    id: 'ord-878',
    orderNo: '878',
    orderType: 'Dine In',
    tableOrChannel: 'Dine In (4)',
    floorZone: 'Ground Floor',
    billingUser: 'biller',
    paymentType: 'Cash',
    netAmount: 150.00,
    tax: 0.00,
    discount: 0.00,
    grandTotal: 150.00,
    status: 'printed',
    printedTimes: 1,
    subOrderType: 'Ground Floor',
    settlementCounter: 'main',
    settlementBy: 'biller (biller)',
    category: 'current',
    createdAt: '2026-11-06 02:45:33',
    items: [{ id: '1', name: 'Pav Bhaji Special', price: 150, quantity: 1, category: 'Street Side', specialNote: 'Extra Butter' }],
  },
  {
    id: 'ord-877',
    orderNo: '877',
    orderType: 'Dine In',
    tableOrChannel: 'Dine In (14)',
    floorZone: 'BASEMENT',
    billingUser: 'biller',
    paymentType: 'Cash',
    netAmount: 460.00,
    tax: 0.00,
    discount: 0.00,
    grandTotal: 460.00,
    status: 'printed',
    printedTimes: 1,
    subOrderType: 'BASEMENT',
    settlementCounter: 'main',
    settlementBy: 'biller (biller)',
    category: 'current',
    createdAt: '2026-11-06 02:45:07',
    items: [
      { id: '2', name: 'Spring Roll', price: 150, quantity: 1, category: 'Fast Food', specialNote: '--' },
      { id: '3', name: 'Tandoori Pasta', price: 145, quantity: 1, category: 'Fast Food', specialNote: 'Spicy' },
      { id: '4', name: 'Special Garlic Bread', price: 165, quantity: 1, category: 'Fast Food', specialNote: 'Extra Cheese' },
    ],
  },
  {
    id: 'ord-876',
    orderNo: '876',
    orderType: 'Dine In',
    tableOrChannel: 'Dine In (7)',
    floorZone: 'Ground Floor',
    billingUser: 'biller',
    customerPhone: '9034142334',
    customerName: 'Bharat Miglani',
    paymentType: 'Cash',
    netAmount: 1580.00,
    tax: 0.00,
    discount: 158.00,
    grandTotal: 1422.00,
    status: 'printed',
    printedTimes: 2,
    subOrderType: 'Ground Floor',
    settlementCounter: 'main',
    settlementBy: 'biller (biller)',
    category: 'current',
    createdAt: '2026-11-06 02:45:02',
    items: [
      { id: '5', name: 'Mexican Farm House (Large)', price: 649, quantity: 2, category: 'Pizza', specialNote: 'Pan Base' },
      { id: '6', name: 'Chilled Cola Can', price: 50, quantity: 2, category: 'Drink', specialNote: 'With Ice' },
    ],
  },
  {
    id: 'ord-875',
    orderNo: '875',
    orderType: 'Dine In',
    tableOrChannel: 'Dine In (6)',
    floorZone: 'Ground Floor',
    paymentType: 'Cash',
    netAmount: 590.00,
    tax: 0.00,
    discount: 0.00,
    grandTotal: 590.00,
    status: 'printed',
    category: 'current',
    createdAt: '2026-11-06 02:44:53',
    items: [{ id: '6', name: 'Kadhai Paneer Handi', price: 340, quantity: 1, category: 'Curry' }],
  },
  {
    id: 'ord-874',
    orderNo: '874',
    orderType: 'Dine In',
    tableOrChannel: 'Dine In (5)',
    floorZone: 'Ground Floor',
    paymentType: 'Cash',
    netAmount: 878.00,
    tax: 0.00,
    discount: 0.00,
    grandTotal: 878.00,
    status: 'printed',
    category: 'current',
    createdAt: '2026-11-06 02:44:49',
    items: [{ id: '7', name: 'Veg Dum Biryani Special', price: 320, quantity: 2, category: 'Rice' }],
  },
  {
    id: 'ord-873',
    orderNo: '873',
    orderType: 'Dine In',
    tableOrChannel: 'Dine In (4)',
    floorZone: 'Ground Floor',
    paymentType: 'Cash',
    netAmount: 640.00,
    tax: 0.00,
    discount: 0.00,
    grandTotal: 640.00,
    status: 'printed',
    category: 'current',
    createdAt: '2026-11-06 02:44:45',
    items: [{ id: '8', name: 'Dal Makhani Handi', price: 280, quantity: 1, category: 'Dal' }],
  },
  {
    id: 'ord-872',
    orderNo: '872',
    orderType: 'Dine In',
    tableOrChannel: 'Dine In (4)',
    floorZone: 'Ground Floor',
    paymentType: 'Cash',
    netAmount: 180.00,
    tax: 0.00,
    discount: 0.00,
    grandTotal: 180.00,
    status: 'printed',
    category: 'current',
    createdAt: '2026-11-06 02:32:36',
    items: [{ id: '9', name: 'Butter Naan Basket', price: 180, quantity: 1, category: 'Tandoor' }],
  },
  // Online orders
  {
    id: 'ord-871',
    orderNo: '871',
    orderType: 'Delivery',
    tableOrChannel: 'Swiggy Express',
    floorZone: 'Online Dispatch',
    customerPhone: '9822319082',
    customerName: 'Anil Deshmukh',
    paymentType: 'Online/UPI',
    netAmount: 720.00,
    tax: 36.00,
    discount: 50.00,
    grandTotal: 706.00,
    status: 'paid',
    category: 'online',
    createdAt: '2026-11-06 02:28:10',
    items: [{ id: '10', name: 'Paneer Tikka Masala', price: 320, quantity: 2, category: 'Curry' }],
  },
  {
    id: 'ord-870',
    orderNo: '870',
    orderType: 'Pick Up',
    tableOrChannel: 'Counter Takeaway',
    floorZone: 'Main Counter',
    customerPhone: '9422018833',
    customerName: 'Vikram Joshi',
    paymentType: 'Cash',
    netAmount: 350.00,
    tax: 0.00,
    discount: 0.00,
    grandTotal: 350.00,
    status: 'saved',
    category: 'current',
    createdAt: '2026-11-06 02:20:00',
    items: [{ id: '11', name: 'Special Maharashtrian Thali', price: 350, quantity: 1, category: 'Thali' }],
  },
];

export const OrdersPage: React.FC<OrdersPageProps> = ({
  tables,
  onBack,
  onNavigateToBilling,
  onPrintBill,
}) => {
  // Top category tab: 'current' | 'online' | 'advance'
  const [activeTab, setActiveTab] = useState<'current' | 'online' | 'advance'>('current');

  // Sub-filter: 'all' | 'Dine In' | 'Delivery' | 'Pick Up'
  const [selectedType, setSelectedType] = useState<string>('all');

  // Search input
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Orders dataset
  const [orders, setOrders] = useState<PosOrderRecord[]>(INITIAL_ORDERS_DATA);

  // Selected Order for View Detail Modal
  const [viewingOrder, setViewingOrder] = useState<PosOrderRecord | null>(null);

  // Filtered dataset
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // 1. Category match
      if (ord.category !== activeTab) return false;

      // 2. Order type sub-filter
      if (selectedType !== 'all' && ord.orderType !== selectedType) return false;

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNo = ord.orderNo.toLowerCase().includes(q);
        const matchesTable = ord.tableOrChannel.toLowerCase().includes(q);
        const matchesName = ord.customerName?.toLowerCase().includes(q) || false;
        const matchesPhone = ord.customerPhone?.includes(q) || false;
        if (!matchesNo && !matchesTable && !matchesName && !matchesPhone) return false;
      }

      return true;
    });
  }, [orders, activeTab, selectedType, searchQuery]);

  // Actions
  const handleReprintOrder = (ord: PosOrderRecord) => {
    if (onPrintBill && tables) {
      const matched = tables.find((t) => t.id === ord.orderNo || t.items.length > 0) || tables[0];
      onPrintBill(matched);
    } else {
      alert(`Reprinting invoice for Order #${ord.orderNo}...`);
    }
  };

  const handleCancelOrder = (ord: PosOrderRecord) => {
    const reason = prompt(`Enter cancellation reason for Order #${ord.orderNo}:`, 'Customer cancelled order');
    if (reason) {
      setOrders((prev) =>
        prev.map((o) => (o.id === ord.id ? { ...o, status: 'cancelled' } : o))
      );
      alert(`Order #${ord.orderNo} cancelled.\nReason: ${reason}`);
    }
  };

  // If viewing an order in detail, render the dedicated Order Detail view matching user reference image
  if (viewingOrder) {
    return (
      <div className="flex-1 flex flex-col bg-[#fdfaf6] h-[calc(100vh-56px)] overflow-y-auto select-none text-stone-800 font-sans p-4 sm:p-6">
        
        {/* Top Header matching reference: Order Detail on left, [← Back] on right */}
        <div className="flex items-center justify-between border-b border-[#ded5c2] pb-3 mb-4 flex-shrink-0">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
            Order Detail
          </h2>
          <button
            onClick={() => setViewingOrder(null)}
            className="px-4 py-1.5 rounded border border-[#731b21] bg-white hover:bg-stone-50 text-[#731b21] text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#731b21]" />
            <span>Back</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* Table 1: Primary Order Meta                                */}
        {/* ========================================================= */}
        <div className="overflow-x-auto border border-stone-300 rounded shadow-2xs bg-white mb-4 flex-shrink-0">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#ede8dd] text-stone-800 font-bold border-b border-stone-300">
              <tr>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">Order No.</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">Billing User</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">Customer Name</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">Customer Phone</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">Customer Address</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">Customer Locality</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">No. of Persons</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">Order Type</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">Payment Type</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap text-right">Total Tax</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap text-right">Total Discount</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap text-right">Grand Total</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right">Settlement Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white text-stone-800">
              <tr className="hover:bg-stone-50/80 transition-colors">
                <td className="py-3 px-3 border-r border-stone-200 font-mono font-bold">{viewingOrder.orderNo}</td>
                <td className="py-3 px-3 border-r border-stone-200">{viewingOrder.billingUser || 'biller'}</td>
                <td className="py-3 px-3 border-r border-stone-200">{viewingOrder.customerName || '-'}</td>
                <td className="py-3 px-3 border-r border-stone-200 font-mono">{viewingOrder.customerPhone || '-'}</td>
                <td className="py-3 px-3 border-r border-stone-200">{viewingOrder.customerAddress || '-'}</td>
                <td className="py-3 px-3 border-r border-stone-200">{viewingOrder.customerLocality || '-'}</td>
                <td className="py-3 px-3 border-r border-stone-200 text-center">{viewingOrder.noOfPersons || '-'}</td>
                <td className="py-3 px-3 border-r border-stone-200 font-semibold">{viewingOrder.tableOrChannel}</td>
                <td className="py-3 px-3 border-r border-stone-200 font-medium">{viewingOrder.paymentType}</td>
                <td className="py-3 px-3 border-r border-stone-200 text-right font-mono">{viewingOrder.tax.toFixed(2)}</td>
                <td className="py-3 px-3 border-r border-stone-200 text-right font-mono">({viewingOrder.discount.toFixed(2)})</td>
                <td className="py-3 px-3 border-r border-stone-200 text-right font-mono font-black">{viewingOrder.grandTotal.toFixed(2)}</td>
                <td className="py-3 px-3 text-right font-mono">{viewingOrder.settlementAmount !== undefined ? viewingOrder.settlementAmount : '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ========================================================= */}
        {/* Table 2: Order Status, Routing & Settlement               */}
        {/* ========================================================= */}
        <div className="overflow-x-auto border border-stone-300 rounded shadow-2xs bg-white mb-6 flex-shrink-0">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#ede8dd] text-stone-800 font-bold border-b border-stone-300">
              <tr>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">Order Status</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">Printed</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">Service Tax</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">Coupon Code</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">Delivery Charge</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">Tip</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">Sub Order Type</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">Settlement</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Sequence Name</th>
              </tr>
            </thead>
            <tbody className="bg-white text-stone-800">
              <tr className="hover:bg-stone-50/80 transition-colors">
                <td className="py-3 px-3 border-r border-stone-200 font-semibold capitalize">
                  {viewingOrder.status === 'printed' ? 'Printed' : viewingOrder.status}
                </td>
                <td className="py-3 px-3 border-r border-stone-200">
                  {viewingOrder.printedTimes
                    ? `Yes (${viewingOrder.printedTimes} time(s))`
                    : viewingOrder.status === 'printed'
                    ? 'Yes (1 time(s))'
                    : 'No'}
                </td>
                <td className="py-3 px-3 border-r border-stone-200">{viewingOrder.serviceTax || '-'}</td>
                <td className="py-3 px-3 border-r border-stone-200">{viewingOrder.couponCode || '-'}</td>
                <td className="py-3 px-3 border-r border-stone-200">{viewingOrder.deliveryCharge || '-'}</td>
                <td className="py-3 px-3 border-r border-stone-200">{viewingOrder.tip || '-'}</td>
                <td className="py-3 px-3 border-r border-stone-200 font-bold uppercase">{viewingOrder.subOrderType || viewingOrder.floorZone}</td>
                <td className="py-3 px-3 border-r border-stone-200 text-[11px] leading-tight">
                  <div><span className="text-stone-500">Counter : </span><span className="font-semibold">{viewingOrder.settlementCounter || 'main'}</span></div>
                  <div><span className="text-stone-500">By : </span><span className="font-semibold">{viewingOrder.settlementBy || 'biller (biller)'}</span></div>
                </td>
                <td className="py-3 px-3">{viewingOrder.sequenceName || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ========================================================= */}
        {/* Table 3: Order Items Section                              */}
        {/* ========================================================= */}
        <div className="mb-6 flex-shrink-0">
          <h3 className="font-bold text-stone-900 text-sm mb-2.5">
            Order Items
          </h3>
          <div className="overflow-x-auto border border-stone-300 rounded shadow-2xs bg-white">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-[#ede8dd] text-stone-800 font-bold border-b border-stone-300">
                <tr>
                  <th className="py-2.5 px-3 border-r border-stone-300">Item Name</th>
                  <th className="py-2.5 px-3 border-r border-stone-300">Special Note</th>
                  <th className="py-2.5 px-3 border-r border-stone-300 text-center w-28">Quantity</th>
                  <th className="py-2.5 px-3 border-r border-stone-300 text-right w-32">Unit Price</th>
                  <th className="py-2.5 px-3 text-right w-32">Total Price</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-stone-200 text-stone-800">
                {viewingOrder.items.map((it, idx) => {
                  const qty = it.quantity || 1;
                  const unitPrice = it.price;
                  const totalPrice = unitPrice * qty;
                  const note = it.specialNote || (it as any).notes || (it as any).specialNotes || '--';
                  return (
                    <tr key={idx} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-3 border-r border-stone-200 font-medium">{it.name}</td>
                      <td className="py-3 px-3 border-r border-stone-200 text-stone-600">{note}</td>
                      <td className="py-3 px-3 border-r border-stone-200 text-center font-mono font-bold">{qty}</td>
                      <td className="py-3 px-3 border-r border-stone-200 text-right font-mono">{unitPrice.toFixed(0)}</td>
                      <td className="py-3 px-3 text-right font-mono font-black">{totalPrice.toFixed(0)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="mt-auto pt-4 border-t border-[#ded5c2] flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setViewingOrder(null)}
            className="px-4 py-2 rounded-lg text-xs font-semibold border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            ← Back to Orders List
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCancelOrder(viewingOrder)}
              className="px-4 py-2 rounded-lg text-xs font-bold border border-rose-300 text-rose-800 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              Cancel Order
            </button>
            <button
              onClick={() => handleReprintOrder(viewingOrder)}
              className="px-5 py-2 rounded-lg text-xs font-bold bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-[#fdfaf6]" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#fdfaf6] h-[calc(100vh-56px)] overflow-hidden select-none text-stone-800 font-sans">
      
      {/* ========================================================= */}
      {/* TOP BAR: Current Order | Online Order | Advance Order      */}
      {/* Top right: Get Past Orders | ← Back                       */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-[#ded5c2] px-4 sm:px-6 py-2.5 flex items-center justify-between flex-shrink-0 shadow-2xs">
        
        {/* Left: Top Category Tabs matching Image 5 */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          <button
            onClick={() => setActiveTab('current')}
            className={`px-4 sm:px-6 py-2 rounded-t-lg text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'current'
                ? 'border-[#731b21] text-[#731b21] bg-red-50/40'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Current Order
          </button>

          <button
            onClick={() => setActiveTab('online')}
            className={`px-4 sm:px-6 py-2 rounded-t-lg text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'online'
                ? 'border-[#731b21] text-[#731b21] bg-red-50/40'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Online Order
          </button>

          <button
            onClick={() => setActiveTab('advance')}
            className={`px-4 sm:px-6 py-2 rounded-t-lg text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'advance'
                ? 'border-[#731b21] text-[#731b21] bg-red-50/40'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Advance Order
          </button>

        </div>

        {/* Right Action Buttons matching Image 5 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Fetching past settlement logs...')}
            className="px-3.5 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            Get Past Orders
          </button>

          <button
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-lg border border-[#731b21] bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#fdfaf6]" />
            <span>Back</span>
          </button>
        </div>

      </div>

      {/* ========================================================= */}
      {/* SUB-FILTER BAR: All | Dine In | Delivery | Pick Up        */}
      {/* ========================================================= */}
      <div className="bg-[#f9f7f2] border-b border-[#ded5c2] px-4 sm:px-6 py-2 flex items-center gap-2 flex-shrink-0">
        {[
          { id: 'all', label: 'All', icon: Layers },
          { id: 'Dine In', label: 'Dine In', icon: UtensilsCrossed },
          { id: 'Delivery', label: 'Delivery', icon: Bike },
          { id: 'Pick Up', label: 'Pick Up', icon: ShoppingBag },
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = selectedType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedType(item.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                isSelected
                  ? 'bg-[#731b21] text-white border border-[#731b21]'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* SEARCH BAR & STATUS LEGEND ROW matching Image 5           */}
      {/* ========================================================= */}
      <div className="px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 bg-white border-b border-[#ded5c2] flex-shrink-0">
        
        {/* Search Input Box */}
        <div className="relative w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] text-stone-800 font-medium placeholder:text-stone-400 shadow-2xs"
          />
        </div>

        {/* Status Legend Dots matching Image 5 */}
        <div className="flex items-center gap-4 text-xs font-semibold text-stone-700">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white border border-stone-400" />
            <span>Saved Bill</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#55e07e] border border-emerald-600" />
            <span>Printed Bill</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
            <span>Cancelled Bill</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#facc15]" />
            <span>Paid</span>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* MAIN DATA TABLE matching Image 5                          */}
      {/* ========================================================= */}
      <div className="flex-1 overflow-auto min-h-0">
        {filteredOrders.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-stone-500">
            <FileText className="w-8 h-8 text-stone-400 mb-2" />
            <p className="text-sm font-bold">No orders found for selected criteria</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            
            {/* Table Header Columns matching Image 5 */}
            <thead className="bg-[#ede8dd] text-stone-700 font-bold uppercase tracking-wider text-[11px] sticky top-0 z-10 border-b border-[#ded5c2]">
              <tr>
                <th className="py-2.5 px-3">Order No.</th>
                <th className="py-2.5 px-3">Order Type</th>
                <th className="py-2.5 px-3">Customer Phone</th>
                <th className="py-2.5 px-3">Customer Name</th>
                <th className="py-2.5 px-3">Payment Type</th>
                <th className="py-2.5 px-3 text-right">Net Amount (₹)</th>
                <th className="py-2.5 px-3 text-right">Tax (₹)</th>
                <th className="py-2.5 px-3 text-right">Discount (₹)</th>
                <th className="py-2.5 px-3 text-right">Grand Total (₹)</th>
                <th className="py-2.5 px-3">Created</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>

            {/* Table Rows matching Soft Green Rows in Image 5 */}
            <tbody className="divide-y divide-stone-200">
              {filteredOrders.map((ord) => {
                const isPrinted = ord.status === 'printed';
                const isCancelled = ord.status === 'cancelled';
                const isPaid = ord.status === 'paid';

                let rowBgClass = 'hover:bg-amber-50/50';
                if (isPrinted) {
                  // Soft green row matching Image 5
                  rowBgClass = 'bg-[#82d882] text-stone-900 font-medium hover:bg-[#77ce77]';
                } else if (isCancelled) {
                  rowBgClass = 'bg-rose-50 text-rose-950 opacity-80';
                } else if (isPaid) {
                  rowBgClass = 'bg-amber-50/60 text-stone-900';
                }

                return (
                  <tr key={ord.id} className={`transition-colors ${rowBgClass}`}>
                    
                    {/* Order No. */}
                    <td className="py-3 px-3 font-mono font-bold">
                      {ord.orderNo}
                    </td>

                    {/* Order Type */}
                    <td className="py-3 px-3 leading-tight">
                      <div className="font-semibold">{ord.tableOrChannel}</div>
                      <div className="text-[10px] opacity-80">({ord.floorZone})</div>
                    </td>

                    {/* Customer Phone */}
                    <td className="py-3 px-3 font-mono">
                      {ord.customerPhone || '—'}
                    </td>

                    {/* Customer Name */}
                    <td className="py-3 px-3 font-semibold">
                      {ord.customerName || '—'}
                    </td>

                    {/* Payment Type */}
                    <td className="py-3 px-3">
                      <span className="font-semibold">{ord.paymentType}</span>
                    </td>

                    {/* Net Amount */}
                    <td className="py-3 px-3 text-right font-mono font-bold">
                      {ord.netAmount.toFixed(2)}
                    </td>

                    {/* Tax */}
                    <td className="py-3 px-3 text-right font-mono">
                      {ord.tax.toFixed(2)}
                    </td>

                    {/* Discount */}
                    <td className="py-3 px-3 text-right font-mono">
                      ({ord.discount.toFixed(2)})
                    </td>

                    {/* Grand Total */}
                    <td className="py-3 px-3 text-right font-mono font-black">
                      {ord.grandTotal.toFixed(2)}
                    </td>

                    {/* Created */}
                    <td className="py-3 px-3 font-mono text-[11px] whitespace-nowrap">
                      {ord.createdAt}
                    </td>

                    {/* Action Links matching View | Reprint | Cancel in Image 5 */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5 font-bold text-xs">
                        <button
                          onClick={() => setViewingOrder(ord)}
                          className="hover:underline cursor-pointer"
                        >
                          View
                        </button>
                        <span>|</span>
                        <button
                          onClick={() => handleReprintOrder(ord)}
                          className="hover:underline cursor-pointer"
                        >
                          Reprint
                        </button>
                        <span>|</span>
                        <button
                          onClick={() => handleCancelOrder(ord)}
                          className="hover:underline text-rose-900 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>
        )}
      </div>
    </div>
  );
};


import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  Clock,
  CheckCircle2,
  X,
  CreditCard,
  Banknote,
  QrCode,
  User,
  Phone,
  MapPin,
  Calendar,
  Printer,
  Receipt
} from 'lucide-react';

export interface DueCustomerRecord {
  id: string;
  billNo: string;
  customerName: string;
  customerPhone: string;
  customerLocation: string;
  orderType: 'Dine In' | 'Delivery' | 'Pick Up';
  tableOrChannel: string;
  createdAt: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: 'Pending Due' | 'Partially Settled' | 'Settled';
  notes?: string;
  items: Array<{ name: string; quantity: number; price: number; specialNote?: string }>;
}

interface DuePaymentPageProps {
  onBack: () => void;
}

const INITIAL_DUE_DATA: DueCustomerRecord[] = [
  {
    id: 'due-1',
    billNo: '879',
    customerName: 'Rajesh Kulkarni',
    customerPhone: '+91 98220 11442',
    customerLocation: 'Kothrud, Pune',
    orderType: 'Dine In',
    tableOrChannel: 'Dine In (Table A2)',
    createdAt: '2026-11-06 02:45',
    dueDate: '2026-11-10',
    totalAmount: 2450.00,
    paidAmount: 1000.00,
    dueAmount: 1450.00,
    status: 'Partially Settled',
    notes: 'Regular customer. Will settle remaining on Friday.',
    items: [
      { name: 'Paneer Butter Masala', quantity: 2, price: 260, specialNote: 'Less Spicy' },
      { name: 'Butter Naan Basket', quantity: 3, price: 180, specialNote: '--' },
      { name: 'Dal Makhani Handi', quantity: 1, price: 280, specialNote: '--' },
      { name: 'Veg Dum Biryani Special', quantity: 2, price: 320, specialNote: 'With Raita' },
    ],
  },
  {
    id: 'due-2',
    billNo: '876',
    customerName: 'Bharat Miglani',
    customerPhone: '+91 90341 42334',
    customerLocation: 'FC Road, Deccan',
    orderType: 'Dine In',
    tableOrChannel: 'Dine In (Table 7)',
    createdAt: '2026-11-06 02:30',
    dueDate: '2026-11-09',
    totalAmount: 1580.00,
    paidAmount: 500.00,
    dueAmount: 1080.00,
    status: 'Partially Settled',
    notes: 'Monthly corporate account.',
    items: [
      { name: 'Mexican Farm House (Large)', quantity: 2, price: 649, specialNote: 'Pan Base' },
      { name: 'Chilled Cola Can', quantity: 2, price: 50, specialNote: 'With Ice' },
      { name: 'Garlic Bread Cheese', quantity: 1, price: 182, specialNote: '--' },
    ],
  },
  {
    id: 'due-3',
    billNo: '871',
    customerName: 'Anil Deshmukh',
    customerPhone: '+91 98223 19082',
    customerLocation: 'Baner Highway, Pune',
    orderType: 'Delivery',
    tableOrChannel: 'Swiggy Express',
    createdAt: '2026-11-06 01:50',
    dueDate: '2026-11-08',
    totalAmount: 720.00,
    paidAmount: 0.00,
    dueAmount: 720.00,
    status: 'Pending Due',
    notes: 'Home delivery due on delivery confirmation.',
    items: [
      { name: 'Paneer Tikka Masala', quantity: 2, price: 320, specialNote: 'Extra Gravy' },
      { name: 'Tandoori Roti', quantity: 4, price: 20, specialNote: '--' },
    ],
  },
  {
    id: 'due-4',
    billNo: '868',
    customerName: 'Suresh Patil',
    customerPhone: '+91 94220 18833',
    customerLocation: 'Shivajinagar, Pune',
    orderType: 'Dine In',
    tableOrChannel: 'Dine In (Table 14)',
    createdAt: '2026-11-05 21:15',
    dueDate: '2026-11-12',
    totalAmount: 3200.00,
    paidAmount: 1200.00,
    dueAmount: 2000.00,
    status: 'Partially Settled',
    notes: 'Family dinner due to be cleared via Cheque/UPI.',
    items: [
      { name: 'Special Maharashtrian Thali', quantity: 4, price: 350, specialNote: '--' },
      { name: 'Solkadhi Special Glass', quantity: 4, price: 80, specialNote: 'Chilled' },
      { name: 'Gulab Jamun Rabdi', quantity: 4, price: 120, specialNote: '--' },
    ],
  },
  {
    id: 'due-5',
    billNo: '865',
    customerName: 'Pooja Sharma',
    customerPhone: '+91 97654 32109',
    customerLocation: 'Aundh, Pune',
    orderType: 'Dine In',
    tableOrChannel: 'Dine In (Table 4)',
    createdAt: '2026-11-05 19:40',
    dueDate: '2026-11-07',
    totalAmount: 1850.00,
    paidAmount: 0.00,
    dueAmount: 1850.00,
    status: 'Pending Due',
    notes: 'Awaiting online bank transfer.',
    items: [
      { name: 'Kadhai Paneer Handi', quantity: 2, price: 340, specialNote: 'Medium Spicy' },
      { name: 'Butter Naan', quantity: 6, price: 50, specialNote: '--' },
      { name: 'Jeera Rice', quantity: 2, price: 180, specialNote: '--' },
      { name: 'Dal Tadka', quantity: 1, price: 230, specialNote: '--' },
    ],
  },
  {
    id: 'due-6',
    billNo: '860',
    customerName: 'Mahesh Joshi',
    customerPhone: '+91 98901 23456',
    customerLocation: 'Model Colony, Pune',
    orderType: 'Pick Up',
    tableOrChannel: 'Counter Takeaway',
    createdAt: '2026-11-05 14:20',
    dueDate: '2026-11-07',
    totalAmount: 950.00,
    paidAmount: 450.00,
    dueAmount: 500.00,
    status: 'Partially Settled',
    notes: 'Takeaway balance.',
    items: [
      { name: 'Pav Bhaji Special', quantity: 3, price: 150, specialNote: 'Extra Pav' },
      { name: 'Sweet Corn Soup', quantity: 2, price: 140, specialNote: '--' },
      { name: 'Salted Lassi', quantity: 2, price: 110, specialNote: '--' },
    ],
  },
];

export const DuePaymentPage: React.FC<DuePaymentPageProps> = ({ onBack }) => {
  const [dues, setDues] = useState<DueCustomerRecord[]>(INITIAL_DUE_DATA);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selected Record for viewing detail
  const [viewingRecord, setViewingRecord] = useState<DueCustomerRecord | null>(null);

  // Selected Record for settlement modal
  const [settlingRecord, setSettlingRecord] = useState<DueCustomerRecord | null>(null);
  const [settleAmount, setSettleAmount] = useState<string>('');
  const [settleMode, setSettleMode] = useState<'Cash' | 'Online/UPI' | 'Card'>('Cash');
  const [settleNotes, setSettleNotes] = useState<string>('');

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Filter dues
  const filteredDues = useMemo(() => {
    return dues.filter((d) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = d.customerName.toLowerCase().includes(q);
        const matchPhone = d.customerPhone.includes(q);
        const matchBill = d.billNo.toLowerCase().includes(q);
        const matchLoc = d.customerLocation.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchBill && !matchLoc) return false;
      }
      return true;
    });
  }, [dues, searchQuery]);

  // Overall metric totals
  const totalOutstanding = useMemo(() => {
    return dues.reduce((sum, d) => sum + d.dueAmount, 0);
  }, [dues]);

  const totalAccounts = dues.filter((d) => d.dueAmount > 0).length;

  // Open settle modal
  const handleOpenSettle = (rec: DueCustomerRecord) => {
    setSettlingRecord(rec);
    setSettleAmount(rec.dueAmount.toString());
    setSettleNotes(`Settled by ${rec.customerName}`);
  };

  // Confirm settlement
  const handleConfirmSettlement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settlingRecord) return;

    const amountNum = parseFloat(settleAmount) || 0;
    if (amountNum <= 0) {
      alert('Please enter a valid settlement amount greater than 0');
      return;
    }

    setDues((prev) =>
      prev.map((rec) => {
        if (rec.id === settlingRecord.id) {
          const newPaid = rec.paidAmount + amountNum;
          const newDue = Math.max(0, rec.dueAmount - amountNum);
          const newStatus = newDue === 0 ? 'Settled' : 'Partially Settled';
          return {
            ...rec,
            paidAmount: newPaid,
            dueAmount: newDue,
            status: newStatus,
          };
        }
        return rec;
      })
    );

    showToast(`Payment of ₹${amountNum.toFixed(2)} settled for ${settlingRecord.customerName} via ${settleMode}.`);
    setSettlingRecord(null);
  };

  // =========================================================
  // ORDER DETAIL SCREEN (When 'View' is clicked)
  // Simple UI colors: #ede8dd table headers, clean white rows
  // =========================================================
  if (viewingRecord) {
    return (
      <div className="flex-1 flex flex-col bg-[#fdfaf6] h-[calc(100vh-56px)] overflow-y-auto select-none text-stone-800 font-sans p-4 sm:p-6">
        
        {/* Top Header matching reference */}
        <div className="flex items-center justify-between border-b border-[#ded5c2] pb-3 mb-4 flex-shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
              Due Order Detail #{viewingRecord.billNo}
            </h2>
            <span className="text-xs text-stone-500 font-medium">
              Customer: {viewingRecord.customerName} ({viewingRecord.customerPhone})
            </span>
          </div>

          <button
            onClick={() => setViewingRecord(null)}
            className="px-4 py-1.5 rounded border border-[#731b21] bg-white hover:bg-stone-50 text-[#731b21] text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#731b21]" />
            <span>Back to Due Payments</span>
          </button>
        </div>

        {/* Table 1: Primary Order Meta (Simple UI Colors) */}
        <div className="overflow-x-auto border border-stone-300 rounded shadow-2xs bg-white mb-4 flex-shrink-0">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#ede8dd] text-stone-800 font-bold border-b border-stone-300">
              <tr>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">Order No.</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">Customer Name</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">Customer Phone</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">Location</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">Order Type</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap text-right">Total Bill (₹)</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap text-right">Paid (₹)</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap text-right">Due Amount (₹)</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white text-stone-800">
              <tr className="hover:bg-stone-50 transition-colors">
                <td className="py-3 px-3 border-r border-stone-200 font-mono font-bold">{viewingRecord.billNo}</td>
                <td className="py-3 px-3 border-r border-stone-200 font-semibold">{viewingRecord.customerName}</td>
                <td className="py-3 px-3 border-r border-stone-200 font-mono">{viewingRecord.customerPhone}</td>
                <td className="py-3 px-3 border-r border-stone-200">{viewingRecord.customerLocation}</td>
                <td className="py-3 px-3 border-r border-stone-200">{viewingRecord.tableOrChannel}</td>
                <td className="py-3 px-3 border-r border-stone-200 text-right font-mono font-bold">{viewingRecord.totalAmount.toFixed(2)}</td>
                <td className="py-3 px-3 border-r border-stone-200 text-right font-mono">{viewingRecord.paidAmount.toFixed(2)}</td>
                <td className="py-3 px-3 border-r border-stone-200 text-right font-mono font-black text-[#731b21]">{viewingRecord.dueAmount.toFixed(2)}</td>
                <td className="py-3 px-3 font-semibold">{viewingRecord.status}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Table 2: Due Account Notes & Timing */}
        <div className="overflow-x-auto border border-stone-300 rounded shadow-2xs bg-white mb-6 flex-shrink-0">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#ede8dd] text-stone-800 font-bold border-b border-stone-300">
              <tr>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">Created Date</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">Due Date</th>
                <th className="py-2.5 px-3 border-r border-stone-300 whitespace-nowrap">Billing User</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Account Remarks</th>
              </tr>
            </thead>
            <tbody className="bg-white text-stone-800">
              <tr>
                <td className="py-3 px-3 border-r border-stone-200 font-mono">{viewingRecord.createdAt}</td>
                <td className="py-3 px-3 border-r border-stone-200 font-mono font-semibold">{viewingRecord.dueDate}</td>
                <td className="py-3 px-3 border-r border-stone-200">biller (main)</td>
                <td className="py-3 px-3">{viewingRecord.notes || 'No remarks added'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Table 3: Order Items */}
        <div className="mb-6 flex-shrink-0">
          <h3 className="font-bold text-stone-900 text-sm mb-2.5">
            Ordered Items
          </h3>
          <div className="overflow-x-auto border border-stone-300 rounded shadow-2xs bg-white">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-[#ede8dd] text-stone-800 font-bold border-b border-stone-300">
                <tr>
                  <th className="py-2.5 px-3 border-r border-stone-300">Item Name</th>
                  <th className="py-2.5 px-3 border-r border-stone-300">Special Note</th>
                  <th className="py-2.5 px-3 border-r border-stone-300 text-center w-28">Quantity</th>
                  <th className="py-2.5 px-3 border-r border-stone-300 text-right w-32">Unit Price (₹)</th>
                  <th className="py-2.5 px-3 text-right w-32">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-stone-200 text-stone-800">
                {viewingRecord.items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-3 border-r border-stone-200 font-medium">{it.name}</td>
                    <td className="py-3 px-3 border-r border-stone-200 text-stone-600">{it.specialNote || '--'}</td>
                    <td className="py-3 px-3 border-r border-stone-200 text-center font-mono font-bold">{it.quantity}</td>
                    <td className="py-3 px-3 border-r border-stone-200 text-right font-mono">{it.price.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold">{(it.price * it.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="mt-auto pt-4 border-t border-[#ded5c2] flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setViewingRecord(null)}
            className="px-4 py-2 rounded-lg text-xs font-semibold border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            ← Back to Due Payments
          </button>

          <div className="flex items-center gap-2">
            {viewingRecord.dueAmount > 0 && (
              <button
                onClick={() => {
                  handleOpenSettle(viewingRecord);
                  setViewingRecord(null);
                }}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#fdfaf6]" />
                <span>Settle Due Amount (₹{viewingRecord.dueAmount.toFixed(2)})</span>
              </button>
            )}
          </div>
        </div>

      </div>
    );
  }

  // =========================================================
  // MAIN DUE PAYMENT PAGE VIEW
  // Only Due Customers have View and Settle options
  // Simple UI Colors: neutral borders, clean white rows, NO green/orange filters
  // =========================================================
  return (
    <div className="flex-1 flex flex-col bg-[#fdfaf6] h-[calc(100vh-56px)] overflow-hidden select-none text-stone-800 font-sans">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-16 right-6 z-50 bg-[#731b21] text-[#fdfaf6] px-4 py-2 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 border border-amber-300/40 animate-slideIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* TOP BAR: Title & Back Button                              */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-[#ded5c2] px-4 sm:px-6 py-2.5 flex items-center justify-between flex-shrink-0 shadow-2xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#731b21]" />
            <span>Due Payments</span>
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            Manage customer credit accounts, view orders, and settle pending dues
          </span>
        </div>

        <button
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-md border border-[#731b21] bg-white hover:bg-stone-50 text-[#731b21] text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#731b21]" />
          <span>Back</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* SEARCH & METRIC SUMMARY ROW (Simple Neutral UI Colors)    */}
      {/* ========================================================= */}
      <div className="bg-[#f9f7f2] border-b border-[#ded5c2] px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 flex-wrap flex-shrink-0">
        
        {/* Search Input Box */}
        <div className="relative w-72 sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Customer Name, Phone, Bill No..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] text-stone-800 font-medium placeholder:text-stone-400 shadow-2xs"
          />
        </div>

        {/* Metric Summary in Simple Clean Neutral Styling */}
        <div className="flex items-center gap-4 text-xs font-semibold text-stone-700">
          <div className="bg-white px-3 py-1.5 rounded-lg border border-stone-200 shadow-2xs flex items-center gap-2">
            <span className="text-stone-500">Due Accounts:</span>
            <span className="font-bold text-stone-900 font-mono">{totalAccounts}</span>
          </div>

          <div className="bg-white px-3 py-1.5 rounded-lg border border-stone-200 shadow-2xs flex items-center gap-2">
            <span className="text-stone-500">Total Outstanding:</span>
            <span className="font-bold text-[#731b21] font-mono text-sm">
              ₹ {totalOutstanding.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* MAIN DATA TABLE (Simple UI Colors: Clean white, no colors) */}
      {/* ========================================================= */}
      <div className="flex-1 overflow-auto min-h-0 bg-white">
        {filteredDues.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-stone-500">
            <CheckCircle2 className="w-8 h-8 text-stone-300 mb-2" />
            <p className="text-sm font-bold text-stone-800">No due records found</p>
            <p className="text-xs text-stone-500 mt-0.5">All customer dues are cleared or no matches found</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            
            {/* Table Header Columns (Neutral Parchment #ede8dd, border-stone-200) */}
            <thead className="bg-[#ede8dd] text-stone-800 font-bold uppercase tracking-wider text-[11px] sticky top-0 z-10 border-b border-[#ded5c2]">
              <tr>
                <th className="py-2.5 px-3">Bill No.</th>
                <th className="py-2.5 px-3">Customer Name</th>
                <th className="py-2.5 px-3">Phone No.</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Order / Channel</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3 text-right">Total Bill (₹)</th>
                <th className="py-2.5 px-3 text-right">Paid (₹)</th>
                <th className="py-2.5 px-3 text-right">Due Amount (₹)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>

            {/* Table Rows (Simple clean white rows, NO colored backgrounds) */}
            <tbody className="divide-y divide-stone-200 text-stone-800">
              {filteredDues.map((rec) => (
                <tr key={rec.id} className="hover:bg-stone-50 transition-colors">
                  
                  {/* Bill No. */}
                  <td className="py-3 px-3 font-mono font-bold text-stone-900">
                    #{rec.billNo}
                  </td>

                  {/* Customer Name */}
                  <td className="py-3 px-3 font-semibold text-stone-900">
                    {rec.customerName}
                  </td>

                  {/* Phone No. */}
                  <td className="py-3 px-3 font-mono text-stone-700">
                    {rec.customerPhone}
                  </td>

                  {/* Location */}
                  <td className="py-3 px-3 text-stone-600">
                    {rec.customerLocation}
                  </td>

                  {/* Order Type */}
                  <td className="py-3 px-3 text-stone-700 font-medium">
                    {rec.tableOrChannel}
                  </td>

                  {/* Due Date */}
                  <td className="py-3 px-3 font-mono text-stone-600">
                    {rec.dueDate}
                  </td>

                  {/* Total Bill */}
                  <td className="py-3 px-3 text-right font-mono font-semibold">
                    {rec.totalAmount.toFixed(2)}
                  </td>

                  {/* Paid Amount */}
                  <td className="py-3 px-3 text-right font-mono text-stone-600">
                    {rec.paidAmount.toFixed(2)}
                  </td>

                  {/* Due Amount */}
                  <td className="py-3 px-3 text-right font-mono font-extrabold text-[#731b21]">
                    {rec.dueAmount.toFixed(2)}
                  </td>

                  {/* Status (Clean simple text, no bright colors) */}
                  <td className="py-3 px-3 font-medium text-stone-700">
                    {rec.status}
                  </td>

                  {/* Action Column: View and Settle option only */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2 font-bold text-xs">
                      <button
                        onClick={() => setViewingRecord(rec)}
                        className="hover:underline text-stone-800 cursor-pointer"
                        title="View Order Details"
                      >
                        View
                      </button>
                      
                      {rec.dueAmount > 0 && (
                        <>
                          <span className="text-stone-300">|</span>
                          <button
                            onClick={() => handleOpenSettle(rec)}
                            className="hover:underline text-[#731b21] cursor-pointer"
                            title="Settle Due Payment"
                          >
                            Settle
                          </button>
                        </>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>

      {/* ========================================================= */}
      {/* SETTLE DUE PAYMENT MODAL (Simple UI Colors)               */}
      {/* ========================================================= */}
      {settlingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-2xs select-none animate-fadeIn">
          <div className="bg-white w-full max-w-[400px] max-h-[92vh] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-scaleUp">
            
            {/* Header */}
            <div className="px-4 py-2.5 border-b border-stone-200 flex items-center justify-between bg-white flex-shrink-0">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#731b21]" />
                <span>Settle Due · Bill #{settlingRecord.billNo}</span>
              </h3>
              <button
                onClick={() => setSettlingRecord(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleConfirmSettlement} className="p-3.5 space-y-2.5 text-xs overflow-y-auto flex-1">
              
              {/* Customer Info Box */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-semibold">Customer:</span>
                  <span className="font-bold text-stone-900">{settlingRecord.customerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-semibold">Phone:</span>
                  <span className="font-mono text-stone-800">{settlingRecord.customerPhone}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1.5 border-t border-stone-200 text-center font-medium">
                  <div>
                    <span className="text-[10px] text-stone-500 block uppercase">Total Bill</span>
                    <span className="font-mono font-bold text-stone-800">₹{settlingRecord.totalAmount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block uppercase">Paid So Far</span>
                    <span className="font-mono font-bold text-emerald-700">₹{settlingRecord.paidAmount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block uppercase">Due Pending</span>
                    <span className="font-mono font-extrabold text-[#731b21]">₹{settlingRecord.dueAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Settlement Amount */}
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Settlement Amount (₹) *
                </label>
                <input
                  type="number"
                  step="any"
                  min="1"
                  max={settlingRecord.dueAmount}
                  required
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm font-mono font-bold text-stone-900 focus:outline-none focus:border-[#731b21]"
                />
                <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1">
                  <span>Remaining Due After Settlement:</span>
                  <span className="font-mono font-bold text-[#731b21]">
                    ₹{Math.max(0, settlingRecord.dueAmount - (parseFloat(settleAmount) || 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Mode Options */}
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1.5">
                  Payment Mode *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Cash', 'Online/UPI', 'Card'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setSettleMode(mode)}
                      className={`py-2 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        settleMode === mode
                          ? 'border-[#731b21] bg-red-50/40 text-[#731b21]'
                          : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Remarks / Reference */}
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Payment Reference / Remarks
                </label>
                <input
                  type="text"
                  value={settleNotes}
                  onChange={(e) => setSettleNotes(e.target.value)}
                  placeholder="e.g. Paid at counter"
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:border-[#731b21]"
                />
              </div>

              {/* Footer Actions */}
              <div className="pt-2 border-t border-stone-200 flex items-center justify-end gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setSettlingRecord(null)}
                  className="px-3.5 py-1.5 rounded-md text-xs font-semibold border border-stone-300 text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md text-xs font-bold bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  Confirm Settlement
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};


import React, { useState } from 'react';
import {
  X,
  BarChart3,
  Calendar,
  Download,
  Printer,
  TrendingUp,
  Receipt,
  CreditCard,
  Banknote,
  QrCode,
  DollarSign
} from 'lucide-react';
import { Table } from '../types/pos';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tables: Table[];
}

export const ReportsModal: React.FC<ReportsModalProps> = ({ isOpen, onClose, tables }) => {
  if (!isOpen) return null;

  const [dateRange, setDateRange] = useState<'today' | 'yesterday' | 'week'>('today');

  // Realistic mock sales data
  const totalSales = 18450;
  const totalBills = 24;
  const openTablesCount = tables.filter((t) => t.status !== 'blank').length;
  const avgBillValue = Math.round(totalSales / totalBills);
  const gstCollected = Math.round(totalSales * 0.05);

  const paymentBreakdown = [
    { mode: 'Cash', amount: 8200, count: 11, icon: <Banknote className="w-4 h-4 text-emerald-600" /> },
    { mode: 'UPI / QR', amount: 7450, count: 9, icon: <QrCode className="w-4 h-4 text-blue-600" /> },
    { mode: 'Credit/Debit Card', amount: 2800, count: 4, icon: <CreditCard className="w-4 h-4 text-purple-600" /> },
  ];

  const topItems = [
    { name: 'Capsicum & Onion Pizza', qty: 18, total: 4662 },
    { name: 'Solkadhi Signature Kokum', qty: 15, total: 1050 },
    { name: 'Special Maharashtrian Thali', qty: 12, total: 4320 },
    { name: 'Fresh Lime Soda (Sweet & Salt)', qty: 14, total: 840 },
    { name: 'Tandoori Paneer Tikka', qty: 8, total: 1920 },
  ];

  const handlePrintZReport = () => {
    alert('Z-Report Printed to Thermal Receipt Printer #1 successfully!');
  };

  const handleExportCSV = () => {
    alert('Daily Sales Summary exported to daily-sales-report.csv');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-[#f7f4ed] rounded-2xl shadow-2xl border border-stone-300 z-10 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-950 px-5 py-3.5 text-white flex items-center justify-between border-b border-amber-400/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 border border-white/15">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <span>Daily Sales & Business Report</span>
                <span className="text-[10px] font-mono font-bold bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full">
                  SHIFT #2
                </span>
              </h3>
              <p className="text-xs text-amber-200/80">
                जेवण फॅमिली रेस्टॉरंट • Executive Summary
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintZReport}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Z-Report</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Top KPI Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-2xs">
              <div className="text-[11px] font-bold text-stone-500 uppercase">Gross Sales</div>
              <div className="text-xl font-bold font-mono text-stone-900 mt-1">
                ₹{totalSales.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+12.4% vs Yesterday</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-2xs">
              <div className="text-[11px] font-bold text-stone-500 uppercase">Bills Settled</div>
              <div className="text-xl font-bold font-mono text-stone-900 mt-1">
                {totalBills}
              </div>
              <div className="text-[10px] font-medium text-stone-500 mt-1">
                {openTablesCount} tables currently open
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-2xs">
              <div className="text-[11px] font-bold text-stone-500 uppercase">Avg Bill Value</div>
              <div className="text-xl font-bold font-mono text-stone-900 mt-1">
                ₹{avgBillValue}
              </div>
              <div className="text-[10px] font-medium text-stone-500 mt-1">
                Per dine-in customer
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-2xs">
              <div className="text-[11px] font-bold text-stone-500 uppercase">GST (5%)</div>
              <div className="text-xl font-bold font-mono text-maroon-900 mt-1">
                ₹{gstCollected}
              </div>
              <div className="text-[10px] font-medium text-stone-500 mt-1">
                CGST 2.5% + SGST 2.5%
              </div>
            </div>

          </div>

          {/* 2 Columns: Payment Modes & Top Selling Dishes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Payment Modes */}
            <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>Payment Collection Breakdown</span>
                  <span className="text-xs font-mono font-bold text-stone-600">Total: ₹{totalSales}</span>
                </div>
                
                <div className="space-y-2.5">
                  {paymentBreakdown.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[#faf7f2] border border-stone-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-md bg-white border border-stone-200 shadow-2xs">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900">{item.mode}</div>
                          <div className="text-[10px] text-stone-500">{item.count} Transactions</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold font-mono text-stone-900">₹{item.amount.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-stone-500 font-mono">{Math.round((item.amount / totalSales) * 100)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                <span>Cash Register Opening Float:</span>
                <span className="font-mono font-bold text-stone-900">₹2,000.00</span>
              </div>
            </div>

            {/* Top Selling Items */}
            <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs">
              <div className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3">
                Top Selling Items Today
              </div>

              <div className="divide-y divide-stone-100">
                {topItems.map((it, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-stone-100 font-mono font-bold text-[10px] flex items-center justify-center text-stone-600">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-stone-800">{it.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-stone-500">{it.qty} sold</span>
                      <span className="font-mono font-bold text-stone-900 w-16 text-right">
                        ₹{it.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-[#ede8dd] border-t border-stone-300 flex items-center justify-between text-xs">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-700 font-bold hover:bg-stone-50 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV / Excel</span>
          </button>

          <div className="text-stone-500">
            Manager: <strong>Riya Sharma</strong> (Shift: 11:00 AM – 11:30 PM)
          </div>
        </div>

      </div>
    </div>
  );
};


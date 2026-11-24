import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Printer,
  CreditCard,
  Send,
  UserCheck,
  Clock,
  Receipt,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Table, OrderItem, TableStatus } from '../types/pos';
import { MENU_CATALOG } from '../data/mockData';

interface TableDetailModalProps {
  table: Table | null;
  onClose: () => void;
  onUpdateTable: (updated: Table) => void;
  onPrintBill: (table: Table) => void;
}

export const TableDetailModal: React.FC<TableDetailModalProps> = ({
  table,
  onClose,
  onUpdateTable,
  onPrintBill
}) => {
  if (!table) return null;

  const [activeTab, setActiveTab] = useState<'current' | 'add-items'>('current');
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [guestCount, setGuestCount] = useState<number>(table.guests || 2);
  const [serverName, setServerName] = useState<string>(table.serverName || 'Captain Ramesh');

  // Filter menu items
  const filteredCatalog = MENU_CATALOG.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      (item.marathiName && item.marathiName.includes(catalogSearch));
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Calculate totals
  const subtotal = table.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const gst = subtotal * 0.05; // 5% GST
  const grandTotal = Math.round(subtotal + gst);

  // Handlers for modifying items
  const handleAddItem = (catalogItem: OrderItem) => {
    const existingIndex = table.items.findIndex((i) => i.id === catalogItem.id);
    let updatedItems = [...table.items];

    if (existingIndex > -1) {
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + 1
      };
    } else {
      updatedItems.push({
        ...catalogItem,
        quantity: 1,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    const newSubtotal = updatedItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const newTotal = Math.round(newSubtotal * 1.05);

    onUpdateTable({
      ...table,
      status: table.status === 'blank' ? 'running' : table.status,
      durationMinutes: table.durationMinutes || 1,
      guests: guestCount,
      serverName: serverName,
      kotNo: table.kotNo || `KOT-${Math.floor(400 + Math.random() * 90)}`,
      items: updatedItems,
      amount: newTotal
    });
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    const updatedItems = table.items
      .map((it) => {
        if (it.id === itemId) {
          const newQty = it.quantity + delta;
          return newQty > 0 ? { ...it, quantity: newQty } : null;
        }
        return it;
      })
      .filter(Boolean) as OrderItem[];

    const newSubtotal = updatedItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const newTotal = Math.round(newSubtotal * 1.05);

    onUpdateTable({
      ...table,
      status: updatedItems.length === 0 ? 'blank' : table.status,
      items: updatedItems,
      amount: newTotal
    });
  };

  const handleClearTable = () => {
    if (window.confirm(`Vacate and reset Table ${table.id}?`)) {
      onUpdateTable({
        ...table,
        status: 'blank',
        durationMinutes: 0,
        amount: 0,
        guests: 0,
        billNo: undefined,
        kotNo: undefined,
        items: []
      });
      onClose();
    }
  };

  const handleSendKOT = () => {
    onUpdateTable({
      ...table,
      status: 'kot',
      kotNo: table.kotNo || `KOT-${Math.floor(400 + Math.random() * 90)}`
    });
    alert(`KOT for Table ${table.id} successfully sent to Kitchen Display System!`);
  };

  const handlePrintClick = () => {
    onUpdateTable({
      ...table,
      status: 'printed',
      billNo: table.billNo || `B-${Math.floor(1000 + Math.random() * 900)}`
    });
    onPrintBill(table);
  };

  const handleSettlePay = () => {
    onUpdateTable({
      ...table,
      status: 'paid'
    });
    alert(`Payment of ₹${grandTotal} settled successfully for Table ${table.id}!`);
  };

  const categories = ['All', 'Starter', 'Main Course', 'Thali', 'Breads', 'Dessert', 'Beverages'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#fcfaf7] w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-amber-900/20 flex flex-col overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-950 text-white px-5 py-3.5 flex items-center justify-between border-b border-amber-400/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center font-display font-bold text-lg text-amber-200">
              {table.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg tracking-wide text-white">
                  Table {table.id}
                </h3>
                <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded-full bg-white/10 text-amber-200 border border-white/15">
                  {table.zone} Zone
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-400 text-maroon-950 uppercase font-mono">
                  {table.status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-300 mt-0.5 font-mono">
                {table.kotNo && <span>KOT: {table.kotNo}</span>}
                {table.billNo && <span>• Bill: {table.billNo}</span>}
                {table.durationMinutes > 0 && <span>• Time: {table.durationMinutes} mins</span>}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Sub-bar: Navigation Tabs & Table Info Controls */}
        <div className="bg-stone-100/70 border-b border-stone-200 px-5 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-1 bg-stone-200/80 p-0.5 rounded-xl border border-stone-300/60">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'current'
                  ? 'bg-maroon-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-maroon-900'
              }`}
            >
              Current Order ({table.items.length})
            </button>
            <button
              onClick={() => setActiveTab('add-items')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all inline-flex items-center gap-1 ${
                activeTab === 'add-items'
                  ? 'bg-maroon-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-maroon-900'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Add Items from Menu
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500 font-medium">Guests:</span>
              <input
                type="number"
                min={1}
                max={20}
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
                className="w-12 py-1 px-1.5 text-center font-bold bg-white border border-stone-300 rounded-md focus:border-maroon-800"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500 font-medium">Captain:</span>
              <input
                type="text"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                className="w-28 py-1 px-2 font-medium bg-white border border-stone-300 rounded-md focus:border-maroon-800"
              />
            </div>
          </div>

        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {activeTab === 'current' ? (
            <div>
              {table.items.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-14 h-14 rounded-full bg-amber-100 text-maroon-800 flex items-center justify-center mx-auto mb-3">
                    <Receipt className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-stone-800">No active items on Table {table.id}</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                    This table is currently available. Click "Add Items from Menu" below to seat guests and create an order.
                  </p>
                  <button
                    onClick={() => setActiveTab('add-items')}
                    className="mt-4 btn-premium-maroon px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-md"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    Open Menu & Add Items
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Itemized Table */}
                  <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-stone-50 text-stone-600 uppercase font-semibold text-[11px] border-b border-stone-200">
                        <tr>
                          <th className="py-2.5 px-3">Item Details</th>
                          <th className="py-2.5 px-3 text-center">Category</th>
                          <th className="py-2.5 px-3 text-right">Price</th>
                          <th className="py-2.5 px-3 text-center">Qty</th>
                          <th className="py-2.5 px-3 text-right">Total</th>
                          <th className="py-2.5 px-2 text-center w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {table.items.map((item) => (
                          <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-stone-800">{item.name}</div>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                                {item.category}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-semibold text-stone-600">
                              ₹{item.price.toFixed(2)}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, -1)}
                                  className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 active:scale-90"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-mono font-bold text-sm w-5 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, 1)}
                                  className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 active:scale-90"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </td>
                            <td className="py-2.5 px-2 text-center">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, -item.quantity)}
                                title="Remove item"
                                className="text-stone-400 hover:text-rose-600 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Totals Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 space-y-1">
                      <div className="font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                        Kitchen Order Ticket (KOT)
                      </div>
                      <p className="text-[11px] text-amber-800">
                        Kitchen orders are automatically dispatched to the AC & Bar prep stations. Click "Send KOT" to update cooks.
                      </p>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1.5 text-xs sm:text-sm">
                      <div className="flex justify-between text-stone-600">
                        <span>Items Subtotal:</span>
                        <span className="font-mono font-semibold">₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-stone-600">
                        <span>GST (CGST 2.5% + SGST 2.5%):</span>
                        <span className="font-mono font-semibold">₹{gst.toFixed(2)}</span>
                      </div>
                      <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline font-bold text-base text-maroon-900">
                        <span>Grand Total:</span>
                        <span className="font-mono text-lg text-emerald-800">
                          ₹{grandTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Add Items Catalog View */
            <div className="space-y-4">
              {/* Category Pills & Search */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Search menu items..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white rounded-lg border border-stone-300 focus:outline-none focus:border-maroon-800"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedCategory === cat
                          ? 'bg-maroon-800 text-white shadow-xs'
                          : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {filteredCatalog.map((catItem) => {
                  const existing = table.items.find((i) => i.id === catItem.id);
                  return (
                    <div
                      key={catItem.id}
                      onClick={() => handleAddItem(catItem)}
                      className="p-3 rounded-xl bg-white border border-stone-200 hover:border-maroon-800/60 hover:shadow-md cursor-pointer transition-all flex items-center justify-between group active:scale-98"
                    >
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-stone-800 group-hover:text-maroon-900 transition-colors">
                          {catItem.name}
                        </div>
                        <div className="text-xs font-mono font-bold text-emerald-800 mt-1">
                          ₹{catItem.price.toFixed(2)}
                        </div>
                      </div>

                      <div className="flex items-center">
                        {existing ? (
                          <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                            {existing.quantity}
                          </span>
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-amber-50 text-maroon-900 border border-amber-300 flex items-center justify-center group-hover:bg-maroon-800 group-hover:text-white transition-all shadow-2xs">
                            <Plus className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="bg-stone-100/90 border-t border-stone-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {table.items.length > 0 && (
              <button
                onClick={handleClearTable}
                className="px-3 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer"
              >
                Vacate Table
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Send KOT Button */}
            {table.items.length > 0 && (
              <button
                onClick={handleSendKOT}
                className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 hover:border-maroon-800 shadow-xs inline-flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5 text-orange-600" />
                <span>Send KOT</span>
              </button>
            )}

            {/* Print Bill Button */}
            {table.items.length > 0 && (
              <button
                onClick={handlePrintClick}
                className="btn-premium-maroon px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-4 h-4 text-white" />
                <span>Print Bill</span>
              </button>
            )}

            {/* Settle & Pay Button */}
            {table.items.length > 0 && (
              <button
                onClick={handleSettlePay}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-md inline-flex items-center gap-1.5 transition-all active:scale-95"
              >
                <CreditCard className="w-4 h-4 text-emerald-100" />
                <span>Settle ₹{grandTotal}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};


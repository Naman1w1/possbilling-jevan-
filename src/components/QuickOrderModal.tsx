import React, { useState } from 'react';
import { X, Bike, ShoppingBag, CheckCircle, Clock } from 'lucide-react';
import { QuickOrder } from '../types/pos';
import { MOCK_QUICK_ORDERS } from '../data/mockData';

interface QuickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'Delivery' | 'Pick Up';
}

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'Delivery'
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'Delivery' | 'Pick Up'>(defaultType);
  const [orders, setOrders] = useState<QuickOrder[]>(MOCK_QUICK_ORDERS);

  const filtered = orders.filter((o) => o.type === activeTab);

  const handleMarkReady = (id: string) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status: 'Ready' } : o))
    );
  };

  const handleComplete = (id: string) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status: 'Completed' } : o))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#fcfaf7] w-full max-w-2xl rounded-2xl shadow-2xl border border-amber-900/20 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-maroon-900 to-maroon-800 text-white px-5 py-3.5 flex items-center justify-between border-b border-amber-400/20">
          <div className="flex items-center gap-2">
            {activeTab === 'Delivery' ? (
              <Bike className="w-5 h-5 text-white" />
            ) : (
              <ShoppingBag className="w-5 h-5 text-white" />
            )}
            <h3 className="font-display font-bold text-base text-white">
              {activeTab === 'Delivery' ? 'Online Deliveries (Swiggy / Zomato)' : 'Takeaway & Pick Up Orders'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="bg-stone-100 p-2 border-b border-stone-200 flex gap-2">
          <button
            onClick={() => setActiveTab('Delivery')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition-all ${
              activeTab === 'Delivery'
                ? 'bg-maroon-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Delivery Orders (2)</span>
          </button>
          <button
            onClick={() => setActiveTab('Pick Up')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition-all ${
              activeTab === 'Pick Up'
                ? 'bg-maroon-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-50'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pick Up / Takeaway (1)</span>
          </button>
        </div>

        {/* List of Orders */}
        <div className="p-5 overflow-y-auto space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-stone-500 text-xs">
              No active {activeTab} orders at this moment.
            </div>
          ) : (
            filtered.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-xl bg-white border border-stone-200 hover:border-amber-400 transition-all shadow-2xs flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-maroon-900">{ord.id}</span>
                    {ord.platform && (
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          ord.platform === 'Swiggy'
                            ? 'bg-orange-100 text-orange-800'
                            : ord.platform === 'Zomato'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-stone-100 text-stone-800'
                        }`}
                      >
                        {ord.platform}
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-stone-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" /> {ord.createdAt}
                    </span>
                  </div>

                  <div className="text-xs text-stone-700 font-medium mt-1">
                    {ord.customerName} • {ord.customerPhone}
                  </div>

                  <div className="flex items-center gap-3 text-xs mt-1">
                    <span className="font-semibold text-stone-500">{ord.itemsCount} Items</span>
                    <span className="font-bold font-mono text-emerald-800">₹{ord.amount.toFixed(2)}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      {ord.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {ord.status === 'Preparing' && (
                    <button
                      onClick={() => handleMarkReady(ord.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      Mark as Ready
                    </button>
                  )}
                  {ord.status === 'Ready' && (
                    <button
                      onClick={() => handleComplete(ord.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white inline-flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Handover & Settle
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};


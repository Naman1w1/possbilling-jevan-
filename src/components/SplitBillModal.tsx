import React, { useState } from 'react';
import { X, Hexagon, Percent, ListFilter, Check } from 'lucide-react';
import { OrderItem } from '../types/pos';

interface SplitBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  totalAmount: number;
  onConfirmSplit: (splitDetails: { mode: string; portions: number; perPortionAmount: number }) => void;
}

export const SplitBillModal: React.FC<SplitBillModalProps> = ({
  isOpen,
  onClose,
  items,
  totalAmount,
  onConfirmSplit,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'portion' | 'percentage' | 'item'>('portion');
  const [portionCount, setPortionCount] = useState<number>(10);
  const [percent1, setPercent1] = useState<number>(50);
  const [itemSplits, setItemSplits] = useState<Record<string, number>>({});

  const perPortion = portionCount > 0 ? totalAmount / portionCount : totalAmount;

  const handleSave = () => {
    onConfirmSplit({
      mode: activeTab,
      portions: portionCount,
      perPortionAmount: Math.round(perPortion * 100) / 100,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs select-none animate-fadeIn">
      {/* Container matching Image 4 */}
      <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-scaleUp">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-stone-200 flex items-center justify-between bg-white">
          <h3 className="font-bold text-sm sm:text-base text-stone-800">
            Split Bill
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Tabs along top matching Image 4 */}
        <div className="grid grid-cols-3 border-b border-stone-200 bg-stone-50/50">
          
          {/* Portion Wise */}
          <button
            type="button"
            onClick={() => setActiveTab('portion')}
            className={`py-3 px-2 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer border-b-2 ${
              activeTab === 'portion'
                ? 'border-[#731b21] text-[#731b21] bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Hexagon className="w-4 h-4" />
            <span>Portion Wise</span>
          </button>

          {/* Percentage Wise */}
          <button
            type="button"
            onClick={() => setActiveTab('percentage')}
            className={`py-3 px-2 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer border-b-2 ${
              activeTab === 'percentage'
                ? 'border-[#731b21] text-[#731b21] bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>Percentage Wise</span>
          </button>

          {/* Item wise */}
          <button
            type="button"
            onClick={() => setActiveTab('item')}
            className={`py-3 px-2 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer border-b-2 ${
              activeTab === 'item'
                ? 'border-[#731b21] text-[#731b21] bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>Item wise</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 space-y-4 min-h-[220px]">
          
          {/* Tab 1: Portion Wise matching Image 4 */}
          {activeTab === 'portion' && (
            <div className="space-y-4">
              <label className="text-xs sm:text-sm font-bold text-stone-700 block">
                Please enter number in which bill can be splited:
              </label>

              {/* Input row matching 1 / [ 10 ] in Image 4 */}
              <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span className="text-base sm:text-lg font-bold font-mono text-stone-600">
                  1 /
                </span>
                <input
                  type="number"
                  min="2"
                  max="50"
                  value={portionCount}
                  onChange={(e) => setPortionCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-28 px-3 py-1.5 text-base sm:text-lg font-mono font-bold text-stone-900 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-red-600 text-center shadow-2xs"
                />
                <span className="text-xs text-stone-500 font-medium">portions</span>
              </div>

              {/* Breakdown Preview */}
              <div className="bg-[#fffdf5] border border-amber-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                  <span>Total Bill Amount:</span>
                  <span className="font-mono text-sm text-[#731b21]">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800 border-t border-amber-100 pt-2">
                  <span>Each Portion Pays ({portionCount} parts):</span>
                  <span className="font-mono text-sm font-black text-emerald-700">₹{perPortion.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Percentage Wise */}
          {activeTab === 'percentage' && (
            <div className="space-y-4">
              <label className="text-xs sm:text-sm font-bold text-stone-700 block">
                Split percentage between Guest 1 &amp; Guest 2:
              </label>

              <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Guest 1 ({percent1}%):</span>
                  <span className="font-mono text-[#731b21]">₹{((totalAmount * percent1) / 100).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  step="5"
                  value={percent1}
                  onChange={(e) => setPercent1(parseInt(e.target.value, 10))}
                  className="w-full accent-[#731b21] cursor-pointer"
                />
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Guest 2 ({100 - percent1}%):</span>
                  <span className="font-mono text-stone-700">₹{((totalAmount * (100 - percent1)) / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Item Wise */}
          {activeTab === 'item' && (
            <div className="space-y-3">
              <label className="text-xs sm:text-sm font-bold text-stone-700 block">
                Assign items to Sub-Bill 1 or Sub-Bill 2:
              </label>
              <div className="max-h-48 overflow-y-auto divide-y divide-stone-100 border border-stone-200 rounded-xl">
                {items.map((it) => {
                  const billNo = itemSplits[it.id] || 1;
                  return (
                    <div key={it.id} className="p-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-stone-800">{it.quantity}× {it.name}</div>
                        <div className="font-mono text-stone-500">₹{(it.price * it.quantity).toFixed(2)}</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setItemSplits((prev) => ({ ...prev, [it.id]: 1 }))}
                          className={`px-2 py-1 rounded text-xs font-bold cursor-pointer ${
                            billNo === 1 ? 'bg-[#731b21] text-white' : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          Bill 1
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemSplits((prev) => ({ ...prev, [it.id]: 2 }))}
                          className={`px-2 py-1 rounded text-xs font-bold cursor-pointer ${
                            billNo === 2 ? 'bg-[#731b21] text-white' : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          Bill 2
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer matching Image 4 */}
        <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-md text-xs font-semibold border border-stone-300 text-stone-700 hover:bg-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-1.5 rounded-md text-xs font-bold bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
};


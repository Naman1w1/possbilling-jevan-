import React, { useState, useMemo, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { OrderItem, DishVariation, DishAddon } from '../types/pos';
import { PIZZA_DEFAULT_VARIATIONS, PIZZA_DEFAULT_ADDONS } from '../data/mockData';

interface DishVariationModalProps {
  item: OrderItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    item: OrderItem,
    variation: DishVariation,
    addons: DishAddon[],
    totalPrice: number
  ) => void;
}

export const DishVariationModal: React.FC<DishVariationModalProps> = ({
  item,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !item) return null;

  const variations = item.variations && item.variations.length > 0 ? item.variations : PIZZA_DEFAULT_VARIATIONS;
  const availableAddons = item.addonsList && item.addonsList.length > 0 ? item.addonsList : PIZZA_DEFAULT_ADDONS;

  // Default to 'Large' if exists, or first variation
  const defaultVar = variations.find((v) => v.name.toLowerCase().includes('large')) || variations[0];
  const [selectedVariation, setSelectedVariation] = useState<DishVariation>(defaultVar);
  const [selectedAddons, setSelectedAddons] = useState<DishAddon[]>([]);

  // Reset when item changes
  useEffect(() => {
    if (item) {
      const initVar = variations.find((v) => v.name.toLowerCase().includes('large')) || variations[0];
      setSelectedVariation(initVar);
      setSelectedAddons([]);
    }
  }, [item]);

  // Toggle addon selection
  const handleToggleAddon = (addon: DishAddon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons((prev) => prev.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons((prev) => [...prev, addon]);
    }
  };

  // Calculate live total price
  const calculatedTotal = useMemo(() => {
    const varPrice = selectedVariation ? selectedVariation.price : item.price;
    const addonsPrice = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    return varPrice + addonsPrice;
  }, [selectedVariation, selectedAddons, item.price]);

  const handleSave = () => {
    onConfirm(item, selectedVariation, selectedAddons, calculatedTotal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs select-none animate-fadeIn">
      {/* Modal Container matching Image 2 */}
      <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-scaleUp">
        
        {/* Header matching Image 2 */}
        <div className="px-5 py-3.5 border-b border-stone-200 flex items-center justify-between">
          <h3 className="font-bold text-sm sm:text-base text-stone-800">
            {item.name}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 text-xs sm:text-sm">
          
          {/* Variation Section matching Image 2 */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-stone-700 text-xs sm:text-sm">
              Variation
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {variations.map((v) => {
                const isSelected = selectedVariation?.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariation(v)}
                    className={`py-2 px-3 rounded-md flex flex-col items-center justify-center transition-all cursor-pointer shadow-2xs ${
                      isSelected
                        ? 'bg-[#731b21] text-white font-bold ring-2 ring-red-900/40'
                        : 'bg-[#2a2a2a] hover:bg-[#383838] text-white font-semibold'
                    }`}
                  >
                    <span className="text-xs sm:text-[13px]">{v.name}</span>
                    <span className="text-[11px] font-mono mt-0.5 opacity-90">₹ {v.price}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Addons Section matching Image 2 */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-stone-700 text-xs sm:text-sm">
              Pizza Addons {selectedVariation?.name}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {availableAddons.map((addon) => {
                const isChecked = selectedAddons.some((a) => a.id === addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => handleToggleAddon(addon)}
                    className={`relative rounded-md p-2.5 flex flex-col justify-between cursor-pointer border transition-all ${
                      isChecked
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500'
                        : 'border-stone-200 bg-white hover:bg-stone-50 shadow-2xs'
                    }`}
                    style={{
                      borderLeftWidth: '4px',
                      borderLeftColor: '#059669', // Distinct green left border as in Image 2
                    }}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-xs font-semibold text-stone-800 leading-tight">
                        {addon.name}
                      </span>
                      {isChecked && (
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-mono font-bold text-stone-700 mt-2">
                      ₹ {addon.price}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer matching Image 2 */}
        <div className="px-5 py-3.5 bg-stone-50/80 border-t border-stone-200 flex items-center justify-between">
          <div className="text-sm sm:text-base font-extrabold font-mono text-stone-900">
            ₹ {calculatedTotal.toFixed(2)}
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-md text-xs font-semibold border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
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
    </div>
  );
};


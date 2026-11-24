import React, { useState } from 'react';
import { X } from 'lucide-react';
import { OrderItem } from '../types/pos';

interface AppliedDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  subtotal: number;
  currentDiscountValue: number;
  currentDiscountType: 'percentage' | 'fixed';
  onApplyDiscount: (discount: {
    type: 'percentage' | 'fixed';
    value: number;
    reason: string;
    couponCode?: string;
  }) => void;
}

export const AppliedDiscountModal: React.FC<AppliedDiscountModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  currentDiscountValue,
  currentDiscountType,
  onApplyDiscount,
}) => {
  if (!isOpen) return null;

  const [targetScope, setTargetScope] = useState<string>('All');
  const [reason, setReason] = useState<string>('Regular Customer');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(currentDiscountType || 'percentage');
  const [discountValue, setDiscountValue] = useState<string>(
    currentDiscountValue > 0 ? currentDiscountValue.toString() : '10'
  );
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponApplied, setCouponApplied] = useState<string | null>(null);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    const code = couponCode.trim().toUpperCase();
    if (code === 'JEWAN10' || code === 'SAVE10') {
      setDiscountType('percentage');
      setDiscountValue('10');
      setReason(`Coupon: ${code}`);
      setCouponApplied(code);
    } else if (code === 'FLAT100' || code === 'WELCOME100') {
      setDiscountType('fixed');
      setDiscountValue('100');
      setReason(`Coupon: ${code}`);
      setCouponApplied(code);
    } else {
      setDiscountType('percentage');
      setDiscountValue('5');
      setReason(`Coupon: ${code}`);
      setCouponApplied(code);
    }
  };

  const handleClearCoupon = () => {
    setCouponCode('');
    setCouponApplied(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(discountValue) || 0;
    onApplyDiscount({
      type: discountType,
      value: val,
      reason: reason.trim() || 'Custom Discount',
      couponCode: couponApplied || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs select-none animate-fadeIn">
      {/* Container matching Image 1 */}
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-scaleUp">
        
        {/* Header matching Image 1 */}
        <div className="px-5 py-3.5 border-b border-stone-200 flex items-center justify-between bg-white">
          <h3 className="font-bold text-sm sm:text-base text-stone-800">
            Applied Discount
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body matching Image 1 */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
          
          {/* Custom Discount Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 text-xs sm:text-sm">Custom Discount</span>
              <button
                type="button"
                onClick={() => {
                  setDiscountType('percentage');
                  setDiscountValue('15');
                  setReason('Management Special 15%');
                }}
                className="text-xs font-bold text-[#731b21] hover:underline cursor-pointer"
              >
                Add More
              </button>
            </div>

            {/* Scope Dropdown */}
            <div>
              <select
                value={targetScope}
                onChange={(e) => setTargetScope(e.target.value)}
                className="w-full h-9 px-3 bg-white border border-stone-300 rounded-lg text-xs font-medium text-stone-800 focus:outline-none focus:border-[#731b21] cursor-pointer shadow-2xs"
              >
                <option value="All">All</option>
                {items.map((it) => (
                  <option key={it.id} value={it.name}>
                    {it.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Reason Input */}
            <div>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason"
                className="w-full h-9 px-3 bg-white border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:border-[#731b21] placeholder:text-stone-400 shadow-2xs font-medium"
              />
            </div>

            {/* Radio Types & Value Input Row */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-stone-700 hover:text-stone-900">
                  <input
                    type="radio"
                    name="discountType"
                    checked={discountType === 'percentage'}
                    onChange={() => setDiscountType('percentage')}
                    className="accent-[#731b21] w-4 h-4 cursor-pointer"
                  />
                  <span>Percentage</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-stone-700 hover:text-stone-900">
                  <input
                    type="radio"
                    name="discountType"
                    checked={discountType === 'fixed'}
                    onChange={() => setDiscountType('fixed')}
                    className="accent-[#731b21] w-4 h-4 cursor-pointer"
                  />
                  <span>Fixed</span>
                </label>
              </div>

              {/* Value input box */}
              <div className="relative w-28 sm:w-32">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder="0"
                  className="w-full h-9 px-3 text-right font-mono font-bold text-stone-900 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] shadow-2xs"
                />
                <span className="absolute left-2.5 top-2.5 text-xs text-stone-400 font-bold">
                  {discountType === 'percentage' ? '%' : '₹'}
                </span>
              </div>
            </div>
          </div>

          {/* Coupon Code Section matching Image 1 */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <label className="font-bold text-stone-800 text-xs sm:text-sm block">
              Coupon Code
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 h-9 px-3 bg-white border border-stone-300 rounded-lg text-xs font-mono uppercase text-stone-800 focus:outline-none focus:border-[#731b21] placeholder:text-stone-400 placeholder:normal-case shadow-2xs"
              />
              <button
                type="button"
                onClick={handleClearCoupon}
                className="px-3 py-2 text-xs font-bold text-[#731b21] hover:underline cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-lg text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                Apply
              </button>
            </div>
            {couponApplied && (
              <p className="text-[11px] font-semibold text-emerald-700">
                ✓ Coupon {couponApplied} applied successfully!
              </p>
            )}
          </div>

          {/* Footer matching Image 1 */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-bold bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              Save
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};


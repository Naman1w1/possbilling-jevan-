import React, { useState } from 'react';
import { X, DollarSign, User, Phone, MapPin } from 'lucide-react';
import { Table } from '../types/pos';

interface SettleSaveModalProps {
  table: Table | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSettle: (
    table: Table,
    settleData: {
      paymentType: 'Cash' | 'Card' | 'Due' | 'Other' | 'Part';
      customerPaid: number;
      returnAmount: number;
      tip: number;
      settlementAmount: number;
      dueInfo?: {
        name: string;
        phone: string;
        location: string;
      };
    }
  ) => void;
}

export const SettleSaveModal: React.FC<SettleSaveModalProps> = ({
  table,
  isOpen,
  onClose,
  onConfirmSettle,
}) => {
  if (!isOpen || !table) return null;

  const totalAmount = table.amount || 0;
  const [paymentType, setPaymentType] = useState<'Cash' | 'Card' | 'Due' | 'Other' | 'Part'>('Cash');
  const [customerPaid, setCustomerPaid] = useState<string>(totalAmount.toString());
  const [tip, setTip] = useState<string>('0');
  const [settlementAmount, setSettlementAmount] = useState<string>(totalAmount.toString());

  // Due payment fields
  const [dueName, setDueName] = useState<string>(table.customerName || '');
  const [duePhone, setDuePhone] = useState<string>(table.customerPhone || '');
  const [dueLocation, setDueLocation] = useState<string>(table.customerLocation || '');

  // Calculate return to customer
  const paidNum = parseFloat(customerPaid) || 0;
  const settleNum = parseFloat(settlementAmount) || totalAmount;
  const tipNum = parseFloat(tip) || 0;
  const returnToCustomer = Math.max(0, paidNum - settleNum - tipNum);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentType === 'Due') {
      if (!dueName.trim() || !duePhone.trim()) {
        alert('Please enter customer Full Name and Mobile No. for Due Payment');
        return;
      }
    }

    onConfirmSettle(table, {
      paymentType,
      customerPaid: paidNum,
      returnAmount: returnToCustomer,
      tip: tipNum,
      settlementAmount: settleNum,
      dueInfo:
        paymentType === 'Due'
          ? {
              name: dueName,
              phone: duePhone,
              location: dueLocation,
            }
          : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs select-none animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-scaleUp">
        
        {/* Header matching Image 5 */}
        <div className="px-5 py-3.5 border-b border-stone-200 flex items-center justify-between bg-white">
          <h3 className="font-bold text-sm sm:text-base text-stone-800">
            Settle &amp; Save For - {table.id} [ ₹{totalAmount.toFixed(2)} ]
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body matching Image 5 */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs sm:text-sm">
          
          {/* Payment Type Radio Options */}
          <div>
            <label className="font-bold text-stone-700 block mb-2">
              Payment Type
            </label>
            <div className="flex items-center gap-4 flex-wrap">
              {(['Cash', 'Card', 'Due', 'Other', 'Part'] as const).map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-1.5 cursor-pointer font-medium text-stone-700 select-none hover:text-stone-900"
                >
                  <input
                    type="radio"
                    name="paymentType"
                    value={type}
                    checked={paymentType === type}
                    onChange={() => setPaymentType(type)}
                    className="accent-[#731b21] w-4 h-4 cursor-pointer"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Due Payment Fields (required if Due selected) */}
          {paymentType === 'Due' && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 space-y-2.5 animate-fadeIn">
              <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span>Customer Due Details (Required)</span>
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-600 uppercase block mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    required
                    value={dueName}
                    onChange={(e) => setDueName(e.target.value)}
                    placeholder="Enter customer full name"
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-[#731b21]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-stone-600 uppercase block mb-1">
                    Mobile No. *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={duePhone}
                      onChange={(e) => setDuePhone(e.target.value)}
                      placeholder="10-digit mobile"
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-[#731b21]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-stone-600 uppercase block mb-1">
                    Location / Area
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={dueLocation}
                      onChange={(e) => setDueLocation(e.target.value)}
                      placeholder="e.g. MG Road, Pune"
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-[#731b21]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Customer Paid Field */}
          <div className="flex items-center justify-between gap-3">
            <label className="font-semibold text-stone-700 min-w-[140px]">
              Customer Paid
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={customerPaid}
              onChange={(e) => setCustomerPaid(e.target.value)}
              className="w-48 px-3 py-1.5 bg-white border border-stone-300 rounded-lg font-mono font-bold text-right text-stone-900 focus:outline-none focus:border-stone-500 shadow-2xs"
            />
          </div>

          {/* Return to Customer (Red text as in Image 5) */}
          <div className="flex items-center justify-between gap-3">
            <label className="font-semibold text-stone-700 min-w-[140px]">
              Return to Customer
            </label>
            <span className="font-mono font-bold text-red-600 text-sm text-right w-48 px-3 py-1">
              {returnToCustomer.toFixed(2)}
            </span>
          </div>

          {/* Tip Field */}
          <div className="flex items-center justify-between gap-3">
            <label className="font-semibold text-stone-700 min-w-[140px]">
              Tip
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              className="w-48 px-3 py-1.5 bg-white border border-stone-300 rounded-lg font-mono font-bold text-right text-stone-900 focus:outline-none focus:border-stone-500 shadow-2xs"
            />
          </div>

          {/* Settlement Amount */}
          <div className="flex items-center justify-between gap-3">
            <label className="font-semibold text-stone-700 min-w-[140px]">
              Settlement Amount
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={settlementAmount}
              onChange={(e) => setSettlementAmount(e.target.value)}
              className="w-48 px-3 py-1.5 bg-white border border-stone-300 rounded-lg font-mono font-bold text-right text-stone-900 focus:outline-none focus:border-stone-500 shadow-2xs"
            />
          </div>

          {/* Modal Footer matching Image 5 */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] font-bold text-xs tracking-wide shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Settle &amp; Save
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};


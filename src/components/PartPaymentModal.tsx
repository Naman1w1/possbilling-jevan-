import React, { useState } from 'react';
import { X, CreditCard, Wallet, MoreHorizontal, Clock, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export interface PaymentPartEntry {
  id: string;
  mode: string;
  subType?: string;
  amount: number;
}

interface PartPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  billNo: string;
  totalPayable: number;
  onConfirmPartPayment: (parts: PaymentPartEntry[], actionType: 'new' | 'print' | 'ebill') => void;
  onOpenDuePayment?: () => void;
}

export const PartPaymentModal: React.FC<PartPaymentModalProps> = ({
  isOpen,
  onClose,
  billNo,
  totalPayable,
  onConfirmPartPayment,
  onOpenDuePayment,
}) => {
  if (!isOpen) return null;

  // Selected top mode: 'Card' | 'Wallets' | 'Other' | 'Due Payment'
  const [activeMode, setActiveMode] = useState<'Card' | 'Wallets' | 'Other' | 'Due Payment'>('Other');
  const [subType, setSubType] = useState<string>('Paytm');
  const [partAmountInput, setPartAmountInput] = useState<string>('');

  // Payment parts list
  const [paymentParts, setPaymentParts] = useState<PaymentPartEntry[]>([
    {
      id: 'p-1',
      mode: 'Other',
      subType: 'Paytm',
      amount: Math.min(155, Math.round(totalPayable * 0.6)),
    },
  ]);

  // Calculate total paid and remaining
  const totalPaid = paymentParts.reduce((sum, p) => sum + p.amount, 0);
  const remaining = Math.max(0, totalPayable - totalPaid);

  const handleAddPart = () => {
    const amt = parseFloat(partAmountInput);
    if (!amt || amt <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }
    const newEntry: PaymentPartEntry = {
      id: `p-${Date.now()}`,
      mode: activeMode,
      subType: activeMode === 'Other' ? subType : activeMode,
      amount: amt,
    };
    setPaymentParts((prev) => [...prev, newEntry]);
    setPartAmountInput('');
  };

  const handleRemovePart = (id: string) => {
    setPaymentParts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAction = (action: 'new' | 'print' | 'ebill') => {
    onConfirmPartPayment(paymentParts, action);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-2xs select-none animate-fadeIn">
      {/* Container matching Image 3 */}
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-scaleUp">
        
        {/* Header matching Image 3 */}
        <div className="px-6 py-3.5 border-b border-stone-200 flex items-center justify-between bg-white">
          <h2 className="text-base sm:text-lg font-bold text-stone-800">
            Part Payment
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bill No and Payable Amount sub-bar matching Image 3 */}
        <div className="px-6 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs sm:text-sm">
          <div className="font-bold">
            <span className="text-stone-700">Bill No : </span>
            <span className="text-red-700 font-mono font-black">{billNo}</span>
          </div>
          <div className="font-bold">
            <span className="text-stone-700">Payable Amount : </span>
            <span className="text-stone-900 font-mono font-black">₹{totalPayable.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Modes Selector Tabs matching Image 3 */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            
            {/* Card */}
            <button
              type="button"
              onClick={() => setActiveMode('Card')}
              className={`py-3 px-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                activeMode === 'Card'
                  ? 'border-[#731b21] bg-red-50/60 text-[#731b21] font-bold ring-1 ring-[#731b21]/30'
                  : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-semibold'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="text-xs">Card</span>
            </button>

            {/* Wallets */}
            <button
              type="button"
              onClick={() => setActiveMode('Wallets')}
              className={`py-3 px-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                activeMode === 'Wallets'
                  ? 'border-[#731b21] bg-red-50/60 text-[#731b21] font-bold ring-1 ring-[#731b21]/30'
                  : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-semibold'
              }`}
            >
              <Wallet className="w-5 h-5" />
              <span className="text-xs">Wallets</span>
            </button>

            {/* Other */}
            <button
              type="button"
              onClick={() => setActiveMode('Other')}
              className={`py-3 px-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                activeMode === 'Other'
                  ? 'border-[#731b21] bg-red-50/60 text-[#731b21] font-bold ring-1 ring-[#731b21]/30'
                  : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-semibold'
              }`}
            >
              <MoreHorizontal className="w-5 h-5" />
              <span className="text-xs">Other</span>
            </button>

            {/* Due Payment */}
            <button
              type="button"
              onClick={() => {
                setActiveMode('Due Payment');
                if (onOpenDuePayment) onOpenDuePayment();
              }}
              className={`py-3 px-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                activeMode === 'Due Payment'
                  ? 'border-[#731b21] bg-red-50/60 text-[#731b21] font-bold ring-1 ring-[#731b21]/30'
                  : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-semibold'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="text-xs">Due Payment</span>
            </button>
          </div>

          {/* Add Partial Payment Input */}
          <div className="bg-[#faf7f0] border border-[#ded5c2] p-3 sm:p-4 rounded-xl flex flex-wrap items-center gap-3">
            {activeMode === 'Other' && (
              <select
                value={subType}
                onChange={(e) => setSubType(e.target.value)}
                className="px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-bold text-stone-800 focus:outline-none focus:border-[#731b21]"
              >
                <option value="Paytm">Paytm</option>
                <option value="Google Pay">Google Pay</option>
                <option value="PhonePe">PhonePe</option>
                <option value="BHIM UPI">BHIM UPI</option>
                <option value="Direct QR">Direct QR</option>
              </select>
            )}

            <div className="relative flex-1 min-w-[160px]">
              <span className="absolute left-3 top-2 text-stone-400 font-mono font-bold">₹</span>
              <input
                type="number"
                min="1"
                step="any"
                value={partAmountInput}
                onChange={(e) => setPartAmountInput(e.target.value)}
                placeholder={`Enter amount (Remaining: ₹${remaining.toFixed(2)})`}
                className="w-full pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-mono font-bold text-stone-900 focus:outline-none focus:border-[#731b21]"
              />
            </div>

            <button
              type="button"
              onClick={handleAddPart}
              className="px-4 py-2 bg-[#731b21] hover:bg-[#5b1419] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Part</span>
            </button>
          </div>

          {/* Payment Summary matching Image 3 */}
          <div className="border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="bg-[#fff9e6] px-4 py-2.5 border-b border-stone-200 flex items-center justify-between text-xs font-bold text-stone-800">
              <span className="flex items-center gap-1.5">
                <span>Payment Summary</span>
              </span>
              <span className="font-mono text-sm font-black">₹{totalPayable.toFixed(2)}</span>
            </div>

            <div className="divide-y divide-stone-100 bg-[#fffdf5] text-xs">
              {paymentParts.map((part) => (
                <div key={part.id} className="px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemovePart(part.id)}
                      className="p-1 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                      title="Remove part"
                    >
                      <X className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                    <span className="font-semibold text-stone-800">
                      Paid via {part.mode} {part.subType ? `(${part.subType})` : ''}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-stone-900">₹{part.amount.toFixed(2)}</span>
                </div>
              ))}

              {/* Pay via Cash (Remaining balance) */}
              <div className="px-4 py-2.5 flex items-center justify-between bg-white text-stone-600">
                <span className="pl-6 font-semibold">Pay via Cash (Balance)</span>
                <span className="font-mono font-bold text-stone-800">₹{remaining.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Action Buttons matching Image 3 */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-bold border border-stone-300 text-stone-700 hover:bg-white transition-all cursor-pointer"
          >
            Back To Order
          </button>
          <button
            type="button"
            onClick={() => handleAction('new')}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] shadow-xs cursor-pointer active:scale-95"
          >
            Now Order
          </button>
          <button
            type="button"
            onClick={() => handleAction('print')}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] shadow-xs cursor-pointer active:scale-95"
          >
            Print Bill
          </button>
          <button
            type="button"
            onClick={() => handleAction('ebill')}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] shadow-xs cursor-pointer active:scale-95"
          >
            EBill
          </button>
        </div>

      </div>
    </div>
  );
};


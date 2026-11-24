import React, { useState, useEffect } from 'react';
import { X, User, Phone, MapPin, Clock, Banknote } from 'lucide-react';

interface DuePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  initialName?: string;
  initialPhone?: string;
  initialLocation?: string;
  onConfirmDue: (dueData: {
    fullName: string;
    mobileNo: string;
    location: string;
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
    paidMode?: 'Cash' | 'Online/UPI' | 'Card';
    notes?: string;
  }) => void;
}

export const DuePaymentModal: React.FC<DuePaymentModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  initialName = '',
  initialPhone = '',
  initialLocation = '',
  onConfirmDue,
}) => {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState<string>(initialName);
  const [mobileNo, setMobileNo] = useState<string>(initialPhone);
  const [location, setLocation] = useState<string>(initialLocation);
  const [paidAmount, setPaidAmount] = useState<string>('0');
  const [dueAmount, setDueAmount] = useState<string>(totalAmount.toString());
  const [paidMode, setPaidMode] = useState<'Cash' | 'Online/UPI' | 'Card'>('Cash');
  const [notes, setNotes] = useState<string>('');

  // Keep fields synchronized with initial values when modal opens
  useEffect(() => {
    if (isOpen) {
      setFullName(initialName);
      setMobileNo(initialPhone);
      setLocation(initialLocation);
      setPaidAmount('0');
      setDueAmount(totalAmount.toString());
      setPaidMode('Cash');
      setNotes('');
    }
  }, [isOpen, totalAmount, initialName, initialPhone, initialLocation]);

  // When user updates Paid Amount, dynamically recalculate Due Amount
  const handlePaidAmountChange = (val: string) => {
    setPaidAmount(val);
    if (val === '') {
      setDueAmount(totalAmount.toString());
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const remaining = Math.max(0, totalAmount - num);
      setDueAmount(Number.isInteger(remaining) ? remaining.toString() : remaining.toFixed(2));
    }
  };

  // When user updates Due Amount, dynamically recalculate Paid Amount
  const handleDueAmountChange = (val: string) => {
    setDueAmount(val);
    if (val === '') {
      setPaidAmount(totalAmount.toString());
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const paid = Math.max(0, totalAmount - num);
      setPaidAmount(Number.isInteger(paid) ? paid.toString() : paid.toFixed(2));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert('Please enter customer full name');
      return;
    }
    if (!mobileNo.trim()) {
      alert('Please enter customer mobile number');
      return;
    }
    if (!location.trim()) {
      alert('Please enter customer location / address');
      return;
    }

    const dueVal = parseFloat(dueAmount);
    if (isNaN(dueVal) || dueVal < 0) {
      alert('Please enter a valid due amount');
      return;
    }

    const paidVal = parseFloat(paidAmount) || 0;
    if (paidVal < 0) {
      alert('Paid amount cannot be negative');
      return;
    }

    if (paidVal + dueVal === 0 && totalAmount > 0) {
      alert('Paid amount and due amount cannot both be zero');
      return;
    }

    onConfirmDue({
      fullName: fullName.trim(),
      mobileNo: mobileNo.trim(),
      location: location.trim(),
      totalAmount,
      paidAmount: paidVal,
      dueAmount: dueVal,
      paidMode: paidVal > 0 ? paidMode : undefined,
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-2xs select-none animate-fadeIn">
      <div className="bg-white w-full max-w-[420px] max-h-[92vh] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-scaleUp">
        
        {/* Header */}
        <div className="px-4 py-2.5 border-b border-stone-200 flex items-center justify-between bg-stone-50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900 leading-tight">
                Customer Due Payment
              </h3>
              <p className="text-[10px] text-stone-500">Record customer credit / ledger</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-2.5 text-xs overflow-y-auto flex-1">
          
          {/* Bill Breakdown Summary Card */}
          <div className="bg-[#fffdf5] border border-amber-200/90 rounded-xl p-2.5 space-y-2">
            
            {/* Header: Total Bill & Presets */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  Total Bill:
                </span>
                <span className="font-mono text-sm font-extrabold text-stone-900">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setPaidAmount('0');
                    setDueAmount(totalAmount.toString());
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                    (parseFloat(paidAmount) || 0) === 0
                      ? 'bg-[#731b21] text-white border-[#731b21]'
                      : 'bg-white hover:bg-stone-50 text-stone-600 border-stone-200'
                  }`}
                >
                  100% Due
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const half = Math.round(totalAmount / 2);
                    setPaidAmount((totalAmount - half).toString());
                    setDueAmount(half.toString());
                  }}
                  className="px-2 py-0.5 rounded text-[10px] font-bold border bg-white hover:bg-stone-50 text-stone-600 border-stone-200 transition-all cursor-pointer"
                >
                  50% Split
                </button>
              </div>
            </div>

            {/* Paid Amount and Due Amount Inputs */}
            <div className="grid grid-cols-2 gap-2.5 pt-1.5 border-t border-amber-200/60">
              
              {/* Option 1: Paid Amount */}
              <div>
                <label className="text-[10px] font-bold text-stone-700 uppercase flex items-center justify-between mb-1">
                  <span>Paid Amount</span>
                  <span className="text-[9px] font-bold text-emerald-700">₹ Now</span>
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500 font-mono pointer-events-none">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    max={totalAmount}
                    step="any"
                    value={paidAmount}
                    onChange={(e) => handlePaidAmountChange(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 pr-2.5 py-1.5 bg-white border border-stone-300 rounded-md text-xs font-mono font-bold text-stone-900 focus:outline-none focus:border-[#731b21] shadow-2xs placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* Option 2: Due Amount */}
              <div>
                <label className="text-[10px] font-bold text-stone-700 uppercase flex items-center justify-between mb-1">
                  <span>Due Amount</span>
                  <span className="text-[9px] font-bold text-[#731b21]">₹ Pending</span>
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#731b21] font-mono pointer-events-none">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    max={totalAmount}
                    step="any"
                    value={dueAmount}
                    onChange={(e) => handleDueAmountChange(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 pr-2.5 py-1.5 bg-white border border-amber-300 rounded-md text-xs font-mono font-black text-[#731b21] focus:outline-none focus:border-[#731b21] shadow-2xs placeholder:text-stone-400"
                  />
                </div>
              </div>

            </div>

            {/* Paid Via Payment Mode Selector (when Paid Amount > 0) */}
            {(parseFloat(paidAmount) || 0) > 0 && (
              <div className="pt-1.5 border-t border-amber-200/60 flex items-center justify-between gap-1.5 animate-fadeIn">
                <span className="text-[10px] font-bold text-stone-600 whitespace-nowrap flex items-center gap-1">
                  <Banknote className="w-3 h-3 text-stone-500" />
                  <span>Paid Via:</span>
                </span>
                <div className="flex items-center gap-1">
                  {(['Cash', 'Online/UPI', 'Card'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaidMode(mode)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                        paidMode === mode
                          ? 'border-[#731b21] bg-[#731b21] text-white shadow-2xs'
                          : 'border-stone-300 bg-white hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Full Name */}
          <div className="space-y-0.5">
            <label className="text-[10px] font-bold text-stone-700 uppercase flex items-center gap-1">
              <span>Full Name</span>
              <span className="text-red-600 font-black">*</span>
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Patil"
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-300 rounded-md focus:outline-none focus:border-[#731b21] font-medium text-xs placeholder:text-stone-400 shadow-2xs"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div className="space-y-0.5">
            <label className="text-[10px] font-bold text-stone-700 uppercase flex items-center gap-1">
              <span>Mobile Number</span>
              <span className="text-red-600 font-black">*</span>
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="tel"
                required
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-300 rounded-md focus:outline-none focus:border-[#731b21] font-mono font-medium text-xs placeholder:text-stone-400 shadow-2xs"
              />
            </div>
          </div>

          {/* Location / Address */}
          <div className="space-y-0.5">
            <label className="text-[10px] font-bold text-stone-700 uppercase flex items-center gap-1">
              <span>Location / Address</span>
              <span className="text-red-600 font-black">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Near Shivajinagar Station, Pune"
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-300 rounded-md focus:outline-none focus:border-[#731b21] font-medium text-xs placeholder:text-stone-400 shadow-2xs"
              />
            </div>
          </div>

          {/* Remark / Note */}
          <div className="space-y-0.5">
            <label className="text-[10px] font-bold text-stone-700 uppercase">
              Remark / Due Date Note
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Will settle upcoming Friday"
              className="w-full px-3 py-1.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-300 rounded-md focus:outline-none focus:border-[#731b21] font-medium text-xs placeholder:text-stone-400 shadow-2xs"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-stone-200 flex items-center justify-end gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-md text-xs font-semibold border border-stone-300 text-stone-700 hover:bg-stone-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-md text-xs font-bold bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] shadow-xs cursor-pointer active:scale-95"
            >
              Confirm Due Payment
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

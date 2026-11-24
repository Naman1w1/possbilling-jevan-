import React, { useState } from 'react';
import { X } from 'lucide-react';
import { OrderItem } from '../types/pos';

interface CancelItemModalProps {
  item: OrderItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (item: OrderItem, reason: string) => void;
}

export const CancelItemModal: React.FC<CancelItemModalProps> = ({
  item,
  isOpen,
  onClose,
  onConfirmCancel,
}) => {
  const [reason, setReason] = useState<string>('');

  if (!isOpen || !item) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please enter a cancellation reason');
      return;
    }
    onConfirmCancel(item, reason.trim());
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-2xs select-none animate-fadeIn">
      {/* Square Container Modal matching Image 1 */}
      <div className="w-[330px] h-[310px] sm:w-[360px] sm:h-[330px] bg-white rounded-xl shadow-2xl border border-stone-200 flex flex-col justify-between overflow-hidden animate-scaleUp">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-stone-200 flex items-center justify-between">
          <h3 className="font-bold text-sm sm:text-base text-stone-800 truncate pr-2">
            Delete {item.name}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col justify-between p-5 pt-4">
          <div className="space-y-2 flex-1">
            <label className="text-xs sm:text-sm font-bold text-stone-700 flex items-center gap-1">
              <span>Reason</span>
              <span className="text-red-600 font-black">*</span>
            </label>
            <textarea
              autoFocus
              required
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="cust not ordered other table item"
              className="w-full h-28 p-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:border-[#731b21] resize-none text-stone-800 font-medium placeholder:text-stone-400"
            />
          </div>

          {/* Modal Footer matching Image 1 */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-md text-xs font-semibold border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 rounded-md text-xs font-bold bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};


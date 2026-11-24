import React, { useState } from 'react';
import { X, Clock } from 'lucide-react';

interface ItemTurnOffModalProps {
  isOpen: boolean;
  itemName: string;
  onClose: () => void;
  onConfirmOff: (itemName: string, durationLabel: string) => void;
}

export const ItemTurnOffModal: React.FC<ItemTurnOffModalProps> = ({
  isOpen,
  itemName,
  onClose,
  onConfirmOff,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<string>('2 Hours');
  const [customHours, setCustomHours] = useState<string>('12');

  if (!isOpen) return null;

  const durationOptions = [
    '2 Hours',
    '4 Hours',
    '8 Hours',
    '24 Hours',
    'Next Business Day',
    'Custom',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLabel =
      selectedDuration === 'Custom'
        ? `${customHours || '1'} Hours (Custom)`
        : selectedDuration;
    onConfirmOff(itemName, finalLabel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-2xs select-none animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-scaleUp">
        
        {/* Modal Top Header matching Image 3 */}
        <div className="px-5 py-3.5 border-b border-stone-200 flex items-center justify-between bg-white flex-shrink-0">
          <h3 className="font-bold text-stone-900 text-sm sm:text-base tracking-tight flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#731b21]" />
            <span>{itemName}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body matching Image 3 */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          
          {/* Note section */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-stone-800">
              Note :
            </h4>
            <p className="text-xs text-stone-500 font-medium">
              Below are the parameters to mark item off only.
            </p>
          </div>

          {/* Radio Options Grid matching Image 3 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {durationOptions.map((opt) => {
              const isChecked = selectedDuration === opt;
              return (
                <label
                  key={opt}
                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                    isChecked
                      ? 'border-[#731b21] bg-red-50/40 text-[#731b21] font-bold shadow-2xs'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700 font-medium hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="turnOffDuration"
                    value={opt}
                    checked={isChecked}
                    onChange={() => setSelectedDuration(opt)}
                    className="accent-[#731b21] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs">{opt}</span>
                </label>
              );
            })}
          </div>

          {/* Custom Duration Input if selected */}
          {selectedDuration === 'Custom' && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 animate-fadeIn">
              <label className="text-xs font-bold text-amber-900 block">
                Enter Custom Hours to Keep Item Turned Off:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="720"
                  value={customHours}
                  onChange={(e) => setCustomHours(e.target.value)}
                  placeholder="e.g. 12"
                  className="w-28 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold font-mono focus:outline-none focus:border-[#731b21]"
                  autoFocus
                />
                <span className="text-xs font-semibold text-stone-600">Hours</span>
              </div>
            </div>
          )}

          {/* Footer Actions matching Image 3 */}
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
              Save Changes
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};


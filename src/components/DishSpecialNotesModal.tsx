import React, { useState, useEffect } from 'react';
import { X, Flame, Sparkles } from 'lucide-react';
import { OrderItem } from '../types/pos';

interface DishSpecialNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: OrderItem | null;
  onSaveNotes: (item: OrderItem, specialNote: string) => void;
}

export const DishSpecialNotesModal: React.FC<DishSpecialNotesModalProps> = ({
  isOpen,
  onClose,
  item,
  onSaveNotes,
}) => {
  if (!isOpen || !item) return null;

  const [note, setNote] = useState<string>(item.customization || '');

  useEffect(() => {
    if (item) {
      setNote(item.customization || '');
    }
  }, [item]);

  const quickPills = [
    'Less Spicy',
    'Medium Spicy',
    'Extra Spicy',
    'No Onion / Garlic',
    'No Mayo',
    'Less Oil',
    'Extra Crispy',
    'Extra Cheese',
    'Jain Prep',
    'Serve with extra mint chutney',
  ];

  const handleTogglePill = (pill: string) => {
    if (!note.trim()) {
      setNote(pill);
    } else if (note.includes(pill)) {
      const updated = note
        .split(' · ')
        .filter((p) => p.trim() !== pill)
        .join(' · ');
      setNote(updated);
    } else {
      setNote(`${note.trim()} · ${pill}`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveNotes(item, note.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs select-none animate-fadeIn">
      {/* Container matching Image 4 */}
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-scaleUp">
        
        {/* Header matching Image 4 */}
        <div className="px-5 py-3.5 border-b border-stone-200 flex items-center justify-between bg-white">
          <h3 className="font-bold text-sm sm:text-base text-stone-800 truncate pr-2">
            {item.name}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body matching Image 4 */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-stone-800 block">
              Special Notes
            </label>
            <input
              type="text"
              autoFocus
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Less spicy, no onion or garlic"
              className="w-full h-10 px-3.5 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] text-stone-800 font-medium placeholder:text-stone-400 shadow-2xs"
            />
          </div>

          {/* Quick Clickable Suggestions Pills */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Common Preferences</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickPills.map((pill) => {
                const isActive = note.includes(pill);
                return (
                  <button
                    key={pill}
                    type="button"
                    onClick={() => handleTogglePill(pill)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all cursor-pointer active:scale-95 ${
                      isActive
                        ? 'bg-[#731b21] text-[#fdfaf6] border-[#731b21] font-bold shadow-2xs'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    {pill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer matching Image 4 */}
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


import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

interface OrderWiseCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentComment: string;
  onSaveComment: (comment: string) => void;
}

export const OrderWiseCommentsModal: React.FC<OrderWiseCommentsModalProps> = ({
  isOpen,
  onClose,
  currentComment,
  onSaveComment,
}) => {
  if (!isOpen) return null;

  const [comment, setComment] = useState<string>(currentComment || '');

  const quickPhrases = [
    'shezwan souce kdalna',
    'miynoise mat dalna',
    'Less spicy preparation',
    'Extra butter naan crisp',
    'Serve food hot together',
    'Jain food without onion/garlic',
  ];

  const handleAppendPhrase = (phrase: string) => {
    if (!comment.trim()) {
      setComment(phrase);
    } else {
      setComment(`${comment.trim()}, ${phrase}`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveComment(comment.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs select-none animate-fadeIn">
      {/* Container matching Image 3 */}
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-scaleUp">
        
        {/* Header matching Image 3 */}
        <div className="px-5 py-3.5 border-b border-stone-200 flex items-center justify-between bg-white">
          <h3 className="font-bold text-sm sm:text-base text-stone-800">
            Order Wise Comments
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body matching Image 3 */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-3.5">
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-stone-800 block">
              Comment:
            </label>
            <textarea
              autoFocus
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="shezwan souce kdalna&#10;miynoise mat dalna"
              className="w-full p-3 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] resize-none text-stone-800 font-medium placeholder:text-stone-400 shadow-2xs"
            />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Quick Kitchen Instructions</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickPhrases.map((phrase) => (
                <button
                  key={phrase}
                  type="button"
                  onClick={() => handleAppendPhrase(phrase)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 cursor-pointer active:scale-95 transition-all"
                >
                  + {phrase}
                </button>
              ))}
            </div>
          </div>

          {/* Footer matching Image 3 */}
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


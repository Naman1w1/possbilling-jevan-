import React, { useState } from 'react';
import { X, ArrowRightLeft, Check } from 'lucide-react';
import { Table } from '../types/pos';

interface MoveKOTModalProps {
  isOpen: boolean;
  onClose: () => void;
  tables: Table[];
  onTransfer: (fromTableId: string, toTableId: string) => void;
}

export const MoveKOTModal: React.FC<MoveKOTModalProps> = ({
  isOpen,
  onClose,
  tables,
  onTransfer
}) => {
  if (!isOpen) return null;

  const occupiedTables = tables.filter((t) => t.status !== 'blank' && t.items.length > 0);
  const [sourceId, setSourceId] = useState<string>(occupiedTables[0]?.id || '');
  const [targetId, setTargetId] = useState<string>(tables.find((t) => t.id !== sourceId)?.id || '');
  const [error, setError] = useState<string>('');

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !targetId) {
      setError('Please select both source and destination tables.');
      return;
    }
    if (sourceId === targetId) {
      setError('Source and Destination table cannot be identical.');
      return;
    }

    onTransfer(sourceId, targetId);
    alert(`Successfully transferred KOT and orders from Table ${sourceId} to Table ${targetId}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#fcfaf7] w-full max-w-md rounded-2xl shadow-2xl border border-amber-900/20 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-maroon-900 to-maroon-800 text-white px-5 py-3.5 flex items-center justify-between border-b border-amber-400/20">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-white" />
            <h3 className="font-display font-bold text-base text-white">Transfer KOT / Merge Tables</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleTransferSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Source Table (Active Order)
            </label>
            <select
              value={sourceId}
              onChange={(e) => {
                setSourceId(e.target.value);
                setError('');
              }}
              className="w-full p-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:border-maroon-800 font-medium"
            >
              {occupiedTables.length === 0 ? (
                <option value="">No active occupied tables</option>
              ) : (
                occupiedTables.map((t) => (
                  <option key={t.id} value={t.id}>
                    Table {t.id} ({t.zone}) - ₹{t.amount.toFixed(2)} ({t.items.length} items)
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-maroon-900 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Destination Table (Target)
            </label>
            <select
              value={targetId}
              onChange={(e) => {
                setTargetId(e.target.value);
                setError('');
              }}
              className="w-full p-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:border-maroon-800 font-medium"
            >
              {tables
                .filter((t) => t.id !== sourceId)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    Table {t.id} ({t.zone}) - {t.status === 'blank' ? 'Available' : `Occupied (₹${t.amount})`}
                  </option>
                ))}
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={occupiedTables.length === 0}
              className="btn-premium-maroon px-5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              <Check className="w-4 h-4 text-white" />
              <span>Confirm Transfer</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};


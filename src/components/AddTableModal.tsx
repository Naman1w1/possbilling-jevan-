import React, { useState } from 'react';
import { X, Plus, Hash, Layers, Users } from 'lucide-react';
import { Table, ZoneId } from '../types/pos';

interface AddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTable: (newTable: Table) => void;
  existingTableIds: string[];
}

export const AddTableModal: React.FC<AddTableModalProps> = ({
  isOpen,
  onClose,
  onAddTable,
  existingTableIds
}) => {
  if (!isOpen) return null;

  const [tableId, setTableId] = useState<string>('');
  const [zone, setZone] = useState<ZoneId>('AC');
  const [capacity, setCapacity] = useState<number>(4);
  const [error, setError] = useState<string>('');

  const handleSuggestId = (selectedZone: ZoneId) => {
    let prefix = 'A';
    if (selectedZone === 'Garden') prefix = 'G';
    if (selectedZone === 'Non-AC') prefix = 'KL';
    if (selectedZone === 'Smoking-Zone') prefix = 'SZ';

    for (let i = 1; i <= 50; i++) {
      const candidate = `${prefix}${i}`;
      if (!existingTableIds.includes(candidate)) {
        return candidate;
      }
    }
    return `${prefix}99`;
  };

  const handleZoneChange = (z: ZoneId) => {
    setZone(z);
    setTableId(handleSuggestId(z));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = tableId.trim().toUpperCase();

    if (!cleanId) {
      setError('Please enter a valid Table ID');
      return;
    }

    if (existingTableIds.includes(cleanId)) {
      setError(`Table ID "${cleanId}" already exists on the floor plan.`);
      return;
    }

    const newTable: Table = {
      id: cleanId,
      zone: zone,
      status: 'blank',
      durationMinutes: 0,
      amount: 0,
      guests: capacity,
      serverName: '',
      items: []
    };

    onAddTable(newTable);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#fcfaf7] w-full max-w-md rounded-2xl shadow-2xl border border-amber-900/20 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-maroon-900 to-maroon-800 text-white px-5 py-3.5 flex items-center justify-between border-b border-amber-400/20">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-white" />
            <h3 className="font-display font-bold text-base text-white">Add New Dining Table</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Zone Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Select Zone / Floor Section
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['AC', 'Garden', 'Non-AC', 'Smoking-Zone'] as ZoneId[]).map((z) => (
                <button
                  type="button"
                  key={z}
                  onClick={() => handleZoneChange(z)}
                  className={`p-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                    zone === z
                      ? 'bg-maroon-800 text-white border-maroon-900 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>
          </div>

          {/* Table ID */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Table Identifier / Number
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={tableId}
                onChange={(e) => {
                  setTableId(e.target.value);
                  setError('');
                }}
                placeholder="e.g. A11, G1, KL6..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-maroon-800 font-mono font-bold"
              />
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Recommended: {handleSuggestId(zone)}
            </p>
          </div>

          {/* Seating Capacity */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Default Seating Capacity
            </label>
            <div className="flex items-center gap-2">
              {[2, 4, 6, 8, 12].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setCapacity(num)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono border transition-all ${
                    capacity === num
                      ? 'bg-amber-100 text-maroon-900 border-amber-400'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {num}p
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
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
              className="btn-premium-maroon px-5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Create Table</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};


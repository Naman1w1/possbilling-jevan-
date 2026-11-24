import React, { useState } from 'react';
import { X, Calendar, Plus, Phone, User, Clock, CheckCircle, LayoutGrid, Gift } from 'lucide-react';
import { Reservation, Table } from '../types/pos';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tables: Table[];
  onSeatReservation?: (tableId: string, guestName: string, partySize: number) => void;
  onAddReservation?: (res: Reservation) => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  tables,
  onSeatReservation,
  onAddReservation
}) => {
  if (!isOpen) return null;

  // New reservation form states
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [partySize, setPartySize] = useState<number>(4);
  const [resDate, setResDate] = useState<string>('Today, 07 Nov');
  const [resTime, setResTime] = useState<string>('08:30 PM');
  const [selectedTable, setSelectedTable] = useState<string>(tables[0]?.id || 'A1');
  const [occasion, setOccasion] = useState<string>('');
  const [advanceAmount, setAdvanceAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestPhone.trim()) {
      alert('Please fill in guest name and contact number.');
      return;
    }

    const matchedTable = tables.find((t) => t.id === selectedTable);
    const floor = matchedTable ? `${matchedTable.zone} Floor` : 'Main Hall';

    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      guestName: guestName.trim(),
      guestPhone: guestPhone.trim(),
      guestEmail: guestEmail.trim() || undefined,
      partySize: Number(partySize),
      time: resTime,
      date: resDate,
      tableId: selectedTable,
      floorZone: floor,
      occasion: occasion.trim() || undefined,
      advanceAmount: advanceAmount > 0 ? Number(advanceAmount) : undefined,
      source: 'Table Status Quick Booking',
      notes: notes.trim() || undefined,
      status: 'Confirmed'
    };

    if (onAddReservation) {
      onAddReservation(newRes);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-2xs select-none animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col animate-scaleUp">
        
        {/* Header */}
        <div className="bg-[#ede8dd] px-5 py-3.5 border-b border-stone-300 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-stone-300 flex items-center justify-center text-[#731b21] shadow-2xs">
              <Calendar className="w-4 h-4 text-[#731b21]" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-stone-900 tracking-tight">
                New Table Reservation
              </h3>
              <p className="text-[11px] text-stone-600 font-medium">
                Record customer booking details and allot a table
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-3.5 overflow-y-auto max-h-[80vh]">
          
          {/* Customer Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">
                Customer Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Suresh Deshmukh"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] font-semibold text-stone-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">
                Mobile Number <span className="text-rose-600">*</span>
              </label>
              <input
                type="tel"
                required
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] font-mono font-bold"
              />
            </div>
          </div>

          {/* Date, Time & Party Size */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">
                Date
              </label>
              <select
                value={resDate}
                onChange={(e) => setResDate(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg font-medium"
              >
                <option value="Today, 07 Nov">Today, 07 Nov</option>
                <option value="Tomorrow, 08 Nov">Tomorrow, 08 Nov</option>
                <option value="Sunday, 09 Nov">Sunday, 09 Nov</option>
                <option value="Next Week">Next Week</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">
                Time Slot
              </label>
              <select
                value={resTime}
                onChange={(e) => setResTime(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg font-mono font-bold"
              >
                <option value="07:00 PM">07:00 PM</option>
                <option value="07:30 PM">07:30 PM</option>
                <option value="08:00 PM">08:00 PM</option>
                <option value="08:30 PM">08:30 PM</option>
                <option value="09:00 PM">09:00 PM</option>
                <option value="09:30 PM">09:30 PM</option>
                <option value="10:00 PM">10:00 PM</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">
                Party Size (Guests)
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg font-mono font-bold text-stone-900"
                required
              />
            </div>
          </div>

          {/* Table Allotment & Occasion */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">
                Allot Table <span className="text-rose-600">*</span>
              </label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] font-mono font-bold text-stone-900"
              >
                {tables.map((t) => (
                  <option key={t.id} value={t.id}>
                    Table {t.id} ({t.zone}) - {t.status === 'blank' ? 'Available' : 'Occupied'}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">
                Occasion / Special Event
              </label>
              <input
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="e.g. Birthday, Anniversary"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
          </div>

          {/* Advance Deposit & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">
                Advance Deposit (₹)
              </label>
              <input
                type="number"
                min={0}
                value={advanceAmount}
                onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                placeholder="0 if none"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="guest@example.com"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">
              Special Instructions / Food Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Window side preferred, Jain preparation"
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#fdfaf6]" />
              <span>Confirm & Allot Table</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

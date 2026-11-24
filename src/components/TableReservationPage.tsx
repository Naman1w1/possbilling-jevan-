import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  Plus,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Users,
  UtensilsCrossed,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit2,
  Trash2,
  ChevronRight,
  Filter,
  Check,
  X,
  CreditCard,
  Gift,
  LayoutGrid,
  ChevronDown,
  Sliders
} from 'lucide-react';
import { Reservation, Table } from '../types/pos';
import { MOCK_RESERVATIONS } from '../data/mockData';

interface TableReservationPageProps {
  onBack: () => void;
  tables?: Table[];
  reservations?: Reservation[];
  onUpdateReservations?: (reservations: Reservation[]) => void;
  onSeatCustomer?: (tableId: string, guestName: string, partySize: number) => void;
}

export const TableReservationPage: React.FC<TableReservationPageProps> = ({
  onBack,
  tables = [],
  reservations = MOCK_RESERVATIONS,
  onUpdateReservations,
  onSeatCustomer,
}) => {
  const [resList, setResList] = useState<Reservation[]>(reservations);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected reservation for the comprehensive "Details" modal/view
  const [viewingReservation, setViewingReservation] = useState<Reservation | null>(null);

  // Table Allotment modal state
  const [allottingReservation, setAllottingReservation] = useState<Reservation | null>(null);
  const [selectedTableToAllot, setSelectedTableToAllot] = useState<string>('');

  // New Reservation modal state (from this page)
  const [isNewResModalOpen, setIsNewResModalOpen] = useState<boolean>(false);
  const [formGuestName, setFormGuestName] = useState<string>('');
  const [formPhone, setFormPhone] = useState<string>('');
  const [formEmail, setFormEmail] = useState<string>('');
  const [formPartySize, setFormPartySize] = useState<number>(4);
  const [formTime, setFormTime] = useState<string>('08:30 PM');
  const [formDate, setFormDate] = useState<string>('Today, 07 Nov');
  const [formTableId, setFormTableId] = useState<string>('A2');
  const [formOccasion, setFormOccasion] = useState<string>('');
  const [formAdvance, setFormAdvance] = useState<number>(0);
  const [formNotes, setFormNotes] = useState<string>('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered reservations
  const filteredReservations = useMemo(() => {
    return resList.filter((res) => {
      // Unified Filter (Date & Status)
      if (selectedFilter !== 'All') {
        if (selectedFilter === 'Today' && !res.date?.toLowerCase().includes('today')) return false;
        if (selectedFilter === 'Tomorrow' && !res.date?.toLowerCase().includes('tomorrow')) return false;
        if (['Confirmed', 'Seated', 'Pending', 'Cancelled'].includes(selectedFilter) && res.status !== selectedFilter) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = res.guestName.toLowerCase().includes(q);
        const matchPhone = res.guestPhone.includes(q);
        const matchTable = res.tableId.toLowerCase().includes(q);
        const matchNotes = res.notes?.toLowerCase().includes(q) || false;
        if (!matchName && !matchPhone && !matchTable && !matchNotes) return false;
      }

      return true;
    });
  }, [resList, selectedFilter, searchQuery]);

  // Handle Seating customer
  const handleSeat = (res: Reservation) => {
    const updated = resList.map((r) =>
      r.id === res.id ? { ...r, status: 'Seated' as const } : r
    );
    setResList(updated);
    if (onUpdateReservations) onUpdateReservations(updated);

    if (onSeatCustomer) {
      onSeatCustomer(res.tableId, res.guestName, res.partySize);
    }
    setViewingReservation(null);
    showToast(`Customer ${res.guestName} seated at Table ${res.tableId}!`);
  };

  // Handle Table Allotment / Re-allotment
  const handleConfirmAllotTable = () => {
    if (!allottingReservation || !selectedTableToAllot) return;

    const matchedTable = tables.find((t) => t.id === selectedTableToAllot);
    const floor = matchedTable ? `${matchedTable.zone} Floor` : 'Main Hall';

    const updated = resList.map((r) =>
      r.id === allottingReservation.id
        ? { ...r, tableId: selectedTableToAllot, floorZone: floor }
        : r
    );
    setResList(updated);
    if (onUpdateReservations) onUpdateReservations(updated);

    if (viewingReservation && viewingReservation.id === allottingReservation.id) {
      setViewingReservation({
        ...viewingReservation,
        tableId: selectedTableToAllot,
        floorZone: floor,
      });
    }

    showToast(`Table ${selectedTableToAllot} allotted to ${allottingReservation.guestName}`);
    setAllottingReservation(null);
    setSelectedTableToAllot('');
  };

  // Handle Adding New Reservation
  const handleSaveNewReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formGuestName.trim() || !formPhone.trim()) {
      alert('Please fill in guest name and contact number.');
      return;
    }

    const matchedTable = tables.find((t) => t.id === formTableId);
    const floor = matchedTable ? `${matchedTable.zone} Floor` : 'Main Hall';

    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      guestName: formGuestName.trim(),
      guestPhone: formPhone.trim(),
      guestEmail: formEmail.trim() || undefined,
      partySize: Number(formPartySize),
      time: formTime,
      date: formDate,
      tableId: formTableId,
      floorZone: floor,
      occasion: formOccasion.trim() || undefined,
      advanceAmount: formAdvance > 0 ? Number(formAdvance) : undefined,
      source: 'Direct POS Booking',
      notes: formNotes.trim() || undefined,
      status: 'Confirmed',
    };

    const updated = [newRes, ...resList];
    setResList(updated);
    if (onUpdateReservations) onUpdateReservations(updated);

    // Reset form
    setFormGuestName('');
    setFormPhone('');
    setFormEmail('');
    setFormOccasion('');
    setFormAdvance(0);
    setFormNotes('');
    setIsNewResModalOpen(false);

    showToast(`Reservation created for ${newRes.guestName} at Table ${newRes.tableId}!`);
  };

  // Status badge styling helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Seated':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#fdfaf6] h-[calc(100vh-56px)] overflow-hidden select-none text-stone-800 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-5 z-50 bg-[#731b21] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-maroon-600 animate-slideIn">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. TOP HEADER                                             */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-[#ded5c2] px-4 sm:px-6 py-2.5 flex items-center justify-between flex-shrink-0 shadow-2xs">
        <div className="flex items-center">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
            Table Reservations Registry
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewResModalOpen(true)}
            className="px-2.5 py-1 rounded-md bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-semibold transition-all shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#fdfaf6]" />
            <span>New Reservation</span>
          </button>

          <button
            onClick={onBack}
            className="px-2.5 py-1 rounded-md border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-all shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-stone-700" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. SUB-BAR: SEARCH & FILTER (SEARCH ON LEFT SIDE)         */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-[#ded5c2] px-4 sm:px-6 py-2 flex items-center justify-between gap-2.5 flex-shrink-0">
        
        {/* Search Bar - Positioned on Left Side */}
        <div className="relative w-52 sm:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer, phone or table..."
            className="w-full pl-8 pr-2.5 py-1 text-xs bg-stone-50 hover:bg-white focus:bg-white border border-stone-300 rounded-md focus:outline-none focus:border-[#731b21] font-medium transition-all"
          />
        </div>

        {/* Filter Option on Right Side */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedFilter !== 'All'
                ? 'bg-amber-50 border-amber-300 text-[#731b21] font-bold shadow-2xs'
                : 'bg-white hover:bg-stone-50 border-stone-300 text-stone-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-stone-500" />
            <span>Filter{selectedFilter !== 'All' ? `: ${selectedFilter}` : ''}</span>
            <ChevronDown className="w-3 h-3 text-stone-400" />
          </button>

          {isFilterDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsFilterDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-xl border border-stone-200 py-1 z-30 animate-fadeIn text-xs">
                <div className="px-3 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100">
                  Filter by Date & Status
                </div>
                {[
                  { id: 'All', label: 'All Bookings' },
                  { id: 'Today', label: 'Today Only' },
                  { id: 'Tomorrow', label: 'Tomorrow Only' },
                  { id: 'Confirmed', label: 'Confirmed' },
                  { id: 'Seated', label: 'Seated' },
                  { id: 'Pending', label: 'Pending' },
                  { id: 'Cancelled', label: 'Cancelled' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSelectedFilter(opt.id);
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer ${
                      selectedFilter === opt.id
                        ? 'font-bold text-[#731b21] bg-red-50/50'
                        : 'text-stone-700'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {selectedFilter === opt.id && (
                      <Check className="w-3.5 h-3.5 text-[#731b21]" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN TABLE OF RESERVATIONS                             */}
      {/* ========================================================= */}
      <div className="flex-1 overflow-auto bg-white min-h-0">
        {filteredReservations.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center text-stone-500">
            <Calendar className="w-8 h-8 text-stone-300 mb-2" />
            <p className="text-sm font-bold text-stone-700">No reservations found</p>
            <p className="text-xs text-stone-400 mt-1">Try another filter or create a new reservation</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#ede8dd] text-stone-800 font-bold uppercase tracking-wider text-[11px] sticky top-0 z-10 border-b border-[#ded5c2]">
              <tr>
                <th className="py-2.5 px-3 border-r border-[#ded5c2]">Customer Details</th>
                <th className="py-2.5 px-3 border-r border-[#ded5c2]">Guests</th>
                <th className="py-2.5 px-3 border-r border-[#ded5c2]">Date & Time Slot</th>
                <th className="py-2.5 px-3 border-r border-[#ded5c2]">Allotted Table</th>
                <th className="py-2.5 px-3 border-r border-[#ded5c2]">Occasion & Special Notes</th>
                <th className="py-2.5 px-3 border-r border-[#ded5c2] text-center">Status</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredReservations.map((res) => {
                const statClass = getStatusBadge(res.status);

                return (
                  <tr key={res.id} className="hover:bg-amber-50/40 transition-colors">
                    
                    {/* Customer Details */}
                    <td className="py-3 px-3 border-r border-stone-200">
                      <div className="font-bold text-stone-900 text-[13px] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        <span>{res.guestName}</span>
                      </div>
                      <div className="font-mono text-[11px] text-stone-600 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-stone-400" />
                        <span>{res.guestPhone}</span>
                      </div>
                      {res.guestEmail && (
                        <div className="text-[10px] text-stone-500 truncate mt-0.5">
                          {res.guestEmail}
                        </div>
                      )}
                    </td>

                    {/* Guests / Party Size */}
                    <td className="py-3 px-3 border-r border-stone-200">
                      <div className="font-bold text-stone-800 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-stone-500" />
                        <span>{res.partySize} Guests</span>
                      </div>
                    </td>

                    {/* Date & Time Slot */}
                    <td className="py-3 px-3 border-r border-stone-200 whitespace-nowrap leading-tight">
                      <div className="font-bold text-stone-900 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#731b21]" />
                        <span>{res.time}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 font-medium mt-0.5">
                        {res.date || 'Today'}
                      </div>
                    </td>

                    {/* Allotted Table No. */}
                    <td className="py-3 px-3 border-r border-stone-200">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-[#731b21] bg-rose-50 px-2 py-1 rounded border border-rose-200 shadow-2xs">
                          Table {res.tableId}
                        </span>
                        <button
                          onClick={() => {
                            setAllottingReservation(res);
                            setSelectedTableToAllot(res.tableId);
                          }}
                          className="text-[10px] text-[#731b21] hover:underline font-bold"
                          title="Change or Allot another table"
                        >
                          Change Allotment
                        </button>
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5">
                        {res.floorZone || 'Main Dining'}
                      </div>
                    </td>

                    {/* Occasion & Notes */}
                    <td className="py-3 px-3 border-r border-stone-200 max-w-xs">
                      {res.occasion && (
                        <div className="text-xs font-bold text-amber-900 flex items-center gap-1">
                          <Gift className="w-3 h-3 text-amber-600" />
                          <span>{res.occasion}</span>
                        </div>
                      )}
                      <div className="text-[11px] text-stone-600 truncate mt-0.5">
                        {res.notes || 'No special requests'}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 border-r border-stone-200 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-0.8 rounded-full text-[11px] font-bold border ${statClass}`}>
                        {res.status}
                      </span>
                    </td>

                    {/* Actions: View Details, Seat Customer */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        
                        {/* Detail Option in it all about the reservation */}
                        <button
                          onClick={() => setViewingReservation(res)}
                          className="px-2.5 py-1 rounded border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                          title="View all reservation details"
                        >
                          <Eye className="w-3 h-3 text-[#731b21]" />
                          <span>Details</span>
                        </button>

                        {/* Seat Customer button */}
                        {res.status !== 'Seated' && (
                          <button
                            onClick={() => handleSeat(res)}
                            className="px-2.5 py-1 rounded bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95"
                            title="Seat customer at allotted table"
                          >
                            <UtensilsCrossed className="w-3 h-3 text-[#fdfaf6]" />
                            <span>Seat</span>
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ========================================================= */}
      {/* 4. DETAIL MODAL: ALL ABOUT THE RESERVATION               */}
      {/* ========================================================= */}
      {viewingReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs select-none animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col animate-scaleUp">
            
            <div className="bg-[#ede8dd] px-5 py-3.5 border-b border-stone-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#731b21]" />
                <h3 className="font-bold text-sm text-stone-900">
                  Reservation Details ({viewingReservation.guestName})
                </h3>
              </div>
              <button
                onClick={() => setViewingReservation(null)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              
              {/* Primary Cards */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                
                {/* Customer Details */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                    Customer Details
                  </span>
                  <div className="font-bold text-sm text-stone-900">{viewingReservation.guestName}</div>
                  <div className="font-mono text-stone-700 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-stone-400" />
                    {viewingReservation.guestPhone}
                  </div>
                  {viewingReservation.guestEmail && (
                    <div className="text-stone-500 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-stone-400" />
                      {viewingReservation.guestEmail}
                    </div>
                  )}
                  <div className="text-[10px] text-stone-500 pt-1">
                    Booking Source: <strong className="text-stone-700">{viewingReservation.source || 'Phone Booking'}</strong>
                  </div>
                </div>

                {/* Allotted Table & Time */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                    Allotted Seating
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-[#731b21] bg-white px-2 py-0.5 rounded border border-rose-200">
                      Table {viewingReservation.tableId}
                    </span>
                    <button
                      onClick={() => {
                        setAllottingReservation(viewingReservation);
                        setSelectedTableToAllot(viewingReservation.tableId);
                      }}
                      className="text-[10px] text-[#731b21] hover:underline font-bold"
                    >
                      Re-Allot Table
                    </button>
                  </div>
                  <div className="text-stone-700 font-semibold">
                    Floor: {viewingReservation.floorZone || 'Main AC Hall'}
                  </div>
                  <div className="text-stone-700 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    <span>{viewingReservation.time} ({viewingReservation.date || 'Today'})</span>
                  </div>
                  <div className="text-stone-700 font-semibold">
                    Party Size: <strong className="text-stone-900">{viewingReservation.partySize} Guests</strong>
                  </div>
                </div>

              </div>

              {/* Occasion & Special Kitchen Notes */}
              <div className="bg-[#fcfaf7] p-3.5 rounded-xl border border-stone-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-700">Occasion:</span>
                  <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {viewingReservation.occasion || 'Standard Dining'}
                  </span>
                </div>

                {viewingReservation.advanceAmount && viewingReservation.advanceAmount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-700">Advance Deposit Paid:</span>
                    <span className="font-mono font-bold text-emerald-800">
                      ₹{viewingReservation.advanceAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-stone-200">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                    Special Seating / Food Notes
                  </span>
                  <p className="text-stone-700 font-medium italic bg-white p-2 rounded border border-stone-200">
                    "{viewingReservation.notes || 'No special requests submitted'}"
                  </p>
                </div>
              </div>

              {/* Actions Footer in Details Modal */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setViewingReservation(null)}
                  className="px-4 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Close
                </button>

                <div className="flex items-center gap-2">
                  {viewingReservation.status !== 'Seated' && (
                    <button
                      type="button"
                      onClick={() => handleSeat(viewingReservation)}
                      className="px-5 py-2 rounded-lg bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95 flex items-center gap-1.5"
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5 text-[#fdfaf6]" />
                      <span>Seat Customer Now</span>
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. MODAL: ALLOT / CHANGE TABLE                            */}
      {/* ========================================================= */}
      {allottingReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs select-none animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col animate-scaleUp">
            
            <div className="bg-[#ede8dd] px-5 py-3.5 border-b border-stone-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-[#731b21]" />
                <h3 className="font-bold text-sm text-stone-900">
                  Allot Table for {allottingReservation.guestName}
                </h3>
              </div>
              <button
                onClick={() => setAllottingReservation(null)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="text-xs text-stone-600 font-medium">
                Select an available table to allot for <strong>{allottingReservation.partySize} Guests</strong> at <strong>{allottingReservation.time}</strong>:
              </div>

              {/* Table Selector Grid */}
              <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto p-1">
                {tables.map((tbl) => {
                  const isSelected = selectedTableToAllot === tbl.id;
                  const isBlank = tbl.status === 'blank';

                  return (
                    <button
                      key={tbl.id}
                      type="button"
                      onClick={() => setSelectedTableToAllot(tbl.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-[#731b21] text-white border-[#731b21] shadow-md scale-105'
                          : isBlank
                          ? 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-300'
                          : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                      }`}
                    >
                      <span className="font-roman font-bold text-sm leading-none">{tbl.id}</span>
                      <span className="text-[10px] opacity-80 mt-1">{tbl.zone}</span>
                      <span className="text-[9px] opacity-60">
                        {isBlank ? 'Available' : 'Running'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAllottingReservation(null)}
                  className="px-4 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAllotTable}
                  className="px-5 py-2 rounded-lg bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95"
                >
                  Confirm Table Allotment
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. MODAL: CREATE NEW RESERVATION                          */}
      {/* ========================================================= */}
      {isNewResModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs select-none animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col animate-scaleUp">
            
            <div className="bg-[#ede8dd] px-5 py-3.5 border-b border-stone-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#731b21]" />
                <h3 className="font-bold text-sm text-stone-900">
                  New Customer Table Reservation
                </h3>
              </div>
              <button
                onClick={() => setIsNewResModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewReservation} className="p-5 space-y-3.5">
              
              {/* Customer Name & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">
                    Customer Full Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formGuestName}
                    onChange={(e) => setFormGuestName(e.target.value)}
                    placeholder="e.g. Suresh Deshmukh"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] font-semibold text-stone-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">
                    Mobile Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] font-mono"
                    required
                  />
                </div>
              </div>

              {/* Date, Time & Guests */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">
                    Reservation Date
                  </label>
                  <select
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
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
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
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
                    value={formPartySize}
                    onChange={(e) => setFormPartySize(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg font-mono font-bold text-stone-900"
                    required
                  />
                </div>
              </div>

              {/* Allot Table & Occasion */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">
                    Allot Table <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={formTableId}
                    onChange={(e) => setFormTableId(e.target.value)}
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
                    Occasion / Event
                  </label>
                  <input
                    type="text"
                    value={formOccasion}
                    onChange={(e) => setFormOccasion(e.target.value)}
                    placeholder="e.g. Birthday, Anniversary, Business"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Advance Amount & Email */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">
                    Advance Deposit (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formAdvance}
                    onChange={(e) => setFormAdvance(Number(e.target.value))}
                    placeholder="0 if none"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">
                    Customer Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="guest@example.com"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Special Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">
                  Special Notes / Food Instructions
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Window side table, Jain preparation, bring cake"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewResModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-[#fdfaf6]" />
                  <span>Confirm Reservation & Allot Table</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};


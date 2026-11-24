import React from 'react';
import {
  RotateCw,
  Plus,
  ArrowRightLeft,
  QrCode,
  Bike,
  ShoppingBag,
  ChevronDown
} from 'lucide-react';
import { TableStatus } from '../types/pos';

interface SubHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenReservation: () => void;
  onOpenContactless: () => void;
  onOpenMoveKOT: () => void;
  onOpenAddTable: () => void;
  onOpenDelivery: () => void;
  onOpenPickUp: () => void;
  selectedStatus: TableStatus | 'all';
  onSelectStatus: (status: TableStatus | 'all') => void;
  layout: string;
  onChangeLayout: (layout: string) => void;
  activeCounts: {
    blank: number;
    running: number;
    printed: number;
    paid: number;
    kot: number;
    total: number;
  };
}

export const SubHeader: React.FC<SubHeaderProps> = ({
  onRefresh,
  isRefreshing,
  onOpenReservation,
  onOpenContactless,
  onOpenMoveKOT,
  onOpenAddTable,
  onOpenDelivery,
  onOpenPickUp,
  selectedStatus,
  onSelectStatus,
  layout,
  onChangeLayout,
}) => {
  return (
    <div className="bg-[#f7f4ed] border-b border-[#e2d8c3]/80 px-3 sm:px-5 py-2.5 transition-all">
      <div className="max-w-[1920px] mx-auto space-y-2.5">
        
        {/* Row 1: Title on Left, Reload & Action Buttons (Add Table, Delivery, Pick Up) on Right */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Title: Times New Roman font style */}
          <div className="flex items-center">
            <h1 className="text-base sm:text-lg font-roman font-bold tracking-normal text-maroon-900 drop-shadow-2xs">
              Table View
            </h1>
          </div>

          {/* Right: Reload icon, Add Table, Delivery, Pick Up */}
          <div className="flex items-center gap-2">
            
            {/* Reload icon button placed directly to the left side of Add Table */}
            <button
              onClick={onRefresh}
              title="Refresh Floor Status"
              className={`p-2 rounded-xl border border-stone-300 bg-white/90 hover:bg-white text-maroon-900 shadow-2xs hover:shadow active:scale-90 transition-all ${
                isRefreshing ? 'animate-spin text-amber-600' : ''
              }`}
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Add Table Button */}
            <button
              onClick={onOpenAddTable}
              className="btn-premium-maroon px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs text-[#fdfaf6]"
            >
              <Plus className="w-3.5 h-3.5 text-[#fdfaf6]" />
              <span className="text-[#fdfaf6]">Add Table</span>
            </button>

            {/* Delivery Button */}
            <button
              onClick={onOpenDelivery}
              className="btn-premium-maroon px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer relative shadow-xs text-[#fdfaf6]"
            >
              <Bike className="w-3.5 h-3.5 text-[#fdfaf6]" />
              <span className="text-[#fdfaf6]">Delivery</span>
              <span className="bg-white text-maroon-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono shadow-2xs leading-none">
                2
              </span>
            </button>

            {/* Pick Up Button */}
            <button
              onClick={onOpenPickUp}
              className="btn-premium-maroon px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer relative shadow-xs text-[#fdfaf6]"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#fdfaf6]" />
              <span className="text-[#fdfaf6]">Pick Up</span>
              <span className="bg-white text-maroon-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono shadow-2xs leading-none">
                1
              </span>
            </button>

          </div>
        </div>

        {/* Row 2: Same Level:
            Left: Table Reservation & Contactless
            Right: Floor Plan Dropdown (direction unchanged: label on left, select on right)
        */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-stone-200/60">
          
          {/* Left: Table Reservation & Contactless */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenReservation}
              className="btn-premium-maroon px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs text-[#fdfaf6]"
            >
              <Plus className="w-3.5 h-3.5 text-[#fdfaf6]" />
              <span className="text-[#fdfaf6]">Table Reservation</span>
            </button>

            <button
              onClick={onOpenContactless}
              className="btn-premium-maroon px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs text-[#fdfaf6]"
            >
              <QrCode className="w-3.5 h-3.5 text-[#fdfaf6]" />
              <span className="text-[#fdfaf6]">Contactless</span>
            </button>
          </div>

          {/* Right: Floor Plan Selector on the same level as Table Reservation & Contactless */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-xs font-bold text-stone-500">
              Floor Plan
            </span>
            <div className="relative inline-block">
              <select
                value={layout}
                onChange={(e) => onChangeLayout(e.target.value)}
                className="appearance-none pl-2.5 pr-7 py-1.5 text-xs font-semibold bg-white/90 hover:bg-white text-stone-800 border border-stone-300 rounded-lg shadow-2xs focus:outline-none focus:ring-1 focus:ring-maroon-800/30 focus:border-maroon-800 cursor-pointer"
              >
                <option value="Default Layout">Default Layout</option>
                <option value="Compact Grid">Compact Grid</option>
                <option value="Occupied Only">Occupied Tables Only</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2 top-2.5 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Row 3: Below Table Reservation and Contactless:
            Move KOT / Items Button & Table Color Status Symbols
        */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
          
          {/* Move KOT / Items Button */}
          <button
            onClick={onOpenMoveKOT}
            className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/90 hover:bg-white text-maroon-900 border border-[#ded5c2] hover:border-maroon-800 shadow-2xs inline-flex items-center gap-1.5 transition-all hover:shadow hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-maroon-800" />
            <span>Move KOT / Items</span>
          </button>

          {/* Table Color Status Symbols */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-xs">
            
            {/* Blank Table */}
            <button
              onClick={() => onSelectStatus(selectedStatus === 'blank' ? 'all' : 'blank')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedStatus === 'blank'
                  ? 'bg-stone-700 text-white shadow-2xs ring-2 ring-stone-400/40'
                  : 'bg-white/80 hover:bg-white text-stone-700 border border-stone-200'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white border border-stone-400 border-dashed" />
              <span>Blank Table</span>
            </button>

            {/* Running Table */}
            <button
              onClick={() => onSelectStatus(selectedStatus === 'running' ? 'all' : 'running')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedStatus === 'running'
                  ? 'bg-blue-600 text-white shadow-2xs ring-2 ring-blue-500/40'
                  : 'bg-white/80 hover:bg-white text-stone-700 border border-stone-200'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-2xs" />
              <span>Running Table</span>
            </button>

            {/* Printed Table */}
            <button
              onClick={() => onSelectStatus(selectedStatus === 'printed' ? 'all' : 'printed')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedStatus === 'printed'
                  ? 'bg-emerald-600 text-white shadow-2xs ring-2 ring-emerald-500/40'
                  : 'bg-white/80 hover:bg-white text-stone-700 border border-stone-200'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-2xs" />
              <span>Printed Table</span>
            </button>

            {/* Paid Table */}
            <button
              onClick={() => onSelectStatus(selectedStatus === 'paid' ? 'all' : 'paid')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedStatus === 'paid'
                  ? 'bg-amber-600 text-white shadow-2xs ring-2 ring-amber-500/40'
                  : 'bg-white/80 hover:bg-white text-stone-700 border border-stone-200'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-2xs" />
              <span>Paid Table</span>
            </button>

            {/* Running KOT Table */}
            <button
              onClick={() => onSelectStatus(selectedStatus === 'kot' ? 'all' : 'kot')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedStatus === 'kot'
                  ? 'bg-orange-600 text-white shadow-2xs ring-2 ring-orange-500/40'
                  : 'bg-white/80 hover:bg-white text-stone-700 border border-stone-200'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-2xs" />
              <span>Running KOT Table</span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

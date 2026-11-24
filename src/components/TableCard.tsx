import React from 'react';
import { FileText, Eye, Save, UtensilsCrossed } from 'lucide-react';
import { Table } from '../types/pos';

interface TableCardProps {
  table: Table;
  onClick: (table: Table) => void;
  onQuickView: (table: Table, e: React.MouseEvent) => void;
  onQuickBill: (table: Table, e: React.MouseEvent) => void;
  onSettle?: (table: Table, e: React.MouseEvent) => void;
  isMatchedSearch?: boolean;
}

export const TableCard: React.FC<TableCardProps> = ({
  table,
  onClick,
  onQuickView,
  onQuickBill,
  onSettle,
  isMatchedSearch
}) => {
  const isOccupied = table.status !== 'blank';
  const totalItemsCount = table.items ? table.items.reduce((sum, it) => sum + (it.quantity || 1), 0) : 0;

  // Styling based on Table Status
  const getCardStyle = () => {
    switch (table.status) {
      case 'printed':
        return {
          cardBg: 'bg-[#ddf2e4] border-[#8ed4a7] text-[#13623f] shadow-sm hover:border-[#4caf75] hover:shadow-md',
          badgeBg: 'bg-[#c5e9d2] text-[#0d5032]',
          iconBorder: 'border-[#9cdab4] hover:bg-[#c5e9d2] text-[#13623f]',
          priceText: 'text-[#125838]'
        };
      case 'paid':
        return {
          cardBg: 'bg-[#fef1cb] border-[#f6d274] text-[#865108] shadow-sm hover:border-[#e6ad27] hover:shadow-md',
          badgeBg: 'bg-[#fce5a3] text-[#704204]',
          iconBorder: 'border-[#f3ce6f] hover:bg-[#fce5a3] text-[#865108]',
          priceText: 'text-[#7d4b06]'
        };
      case 'running':
        return {
          cardBg: 'bg-[#e4efff] border-[#9bc3fc] text-[#1e40af] shadow-sm hover:border-[#3b82f6] hover:shadow-md',
          badgeBg: 'bg-[#cce1ff] text-[#1e3a8a]',
          iconBorder: 'border-[#a8cbfe] hover:bg-[#cce1ff] text-[#1e40af]',
          priceText: 'text-[#1e3a8a]'
        };
      case 'kot':
        return {
          cardBg: 'bg-[#ffebd9] border-[#fcba8d] text-[#c2410c] shadow-sm hover:border-[#f97316] hover:shadow-md',
          badgeBg: 'bg-[#ffd7b8] text-[#9a3412]',
          iconBorder: 'border-[#fcae7c] hover:bg-[#ffd7b8] text-[#c2410c]',
          priceText: 'text-[#9a3412]'
        };
      case 'blank':
      default:
        return {
          cardBg: 'bg-[#faf7f0]/85 border-2 border-dashed border-[#d8d0c2] text-stone-700 hover:bg-white hover:border-maroon-800/60 hover:shadow-sm',
          badgeBg: 'bg-transparent text-stone-400',
          iconBorder: 'border-stone-200 text-stone-400',
          priceText: 'text-stone-400'
        };
    }
  };

  const style = getCardStyle();

  return (
    <div
      onClick={() => onClick(table)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(table);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Table ${table.id}, Status: ${table.status}, Amount: ₹${table.amount}`}
      className={`group relative flex flex-col justify-between rounded-xl sm:rounded-2xl p-2 sm:p-2.5 min-h-[96px] sm:min-h-[104px] transition-all duration-200 cursor-pointer select-none border outline-none focus:ring-2 focus:ring-maroon-800/30 ${
        style.cardBg
      } ${
        isMatchedSearch
          ? 'ring-4 ring-amber-500 ring-offset-2 scale-105 z-10 animate-pulse'
          : 'hover:-translate-y-1'
      }`}
    >
      {/* Top Header */}
      {isOccupied ? (
        <div className="flex items-center justify-between w-full">
          {/* Duration Badge */}
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold font-mono tracking-tight leading-none ${style.badgeBg}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping opacity-75" />
            {table.durationMinutes} Min
          </span>

          {/* Items Count (shows only number of items, e.g. 2, 3) */}
          {totalItemsCount > 0 && (
            <span
              className="text-[10px] text-stone-800 font-extrabold flex items-center gap-1 bg-white/80 px-1.5 py-0.5 rounded border border-black/10 shadow-2xs font-mono"
              title={`${totalItemsCount} items ordered`}
            >
              <UtensilsCrossed className="w-2.5 h-2.5 text-[#731b21]" />
              <span>{totalItemsCount}</span>
            </span>
          )}
        </div>
      ) : (
        <div className="w-full h-3" />
      )}

      {/* Middle: Table ID in Times New Roman Font & Price / Adjusted Click to Select */}
      <div className="text-center my-auto py-0.5 flex flex-col items-center justify-center">
        {/* Table Number: Times New Roman Font */}
        <h3 className="text-base sm:text-lg md:text-xl font-roman font-bold tracking-normal leading-none drop-shadow-2xs">
          {table.id}
        </h3>

        {isOccupied ? (
          <div className="mt-1">
            <span
              className={`text-xs sm:text-sm font-extrabold font-mono tracking-tight ${style.priceText}`}
            >
              ₹{table.amount.toFixed(2)}
            </span>
          </div>
        ) : (
          /* Adjusted 'Click to Select' smoothly fading in during hover without layout jump */
          <div className="mt-1.5 h-5 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-[10px] font-semibold text-maroon-900 bg-white/95 px-2.5 py-0.5 rounded-full border border-stone-300/80 shadow-2xs whitespace-nowrap">
              Click to Select
            </span>
          </div>
        )}
      </div>

      {/* Bottom: Action Buttons for occupied tables, or clean bottom spacing for blank tables */}
      {isOccupied ? (
        <div className="flex items-center justify-center gap-2 pt-1 border-t border-black/5">
          {/* Bill / KOT Action Button */}
          <button
            onClick={(e) => onQuickBill(table, e)}
            title="View Bill & KOT"
            className={`p-1 rounded-md border bg-white/70 shadow-2xs hover:bg-white active:scale-90 transition-all ${style.iconBorder}`}
          >
            <FileText className="w-3.5 h-3.5" />
          </button>

          {/* Quick View Action Button */}
          <button
            onClick={(e) => onQuickView(table, e)}
            title="Quick View Items"
            className={`p-1 rounded-md border bg-white/70 shadow-2xs hover:bg-white active:scale-90 transition-all ${style.iconBorder}`}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Settle & Save Action Button matching reference image */}
          {onSettle && (
            <button
              onClick={(e) => onSettle(table, e)}
              title="Settle & Save Bill"
              className={`p-1 rounded-md border bg-white/70 shadow-2xs hover:bg-white active:scale-90 transition-all ${style.iconBorder}`}
            >
              <Save className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="w-full h-2" />
      )}
    </div>
  );
};

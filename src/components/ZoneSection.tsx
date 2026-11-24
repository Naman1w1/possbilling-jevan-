import React from 'react';
import { Table, ZoneId } from '../types/pos';
import { TableCard } from './TableCard';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface ZoneSectionProps {
  zone: ZoneId;
  tables: Table[];
  onTableClick: (table: Table) => void;
  onQuickView: (table: Table, e: React.MouseEvent) => void;
  onQuickBill: (table: Table, e: React.MouseEvent) => void;
  onSettle?: (table: Table, e: React.MouseEvent) => void;
  matchedTableIds?: string[];
}

export const ZoneSection: React.FC<ZoneSectionProps> = ({
  zone,
  tables,
  onTableClick,
  onQuickView,
  onQuickBill,
  onSettle,
  matchedTableIds = []
}) => {
  const [collapsed, setCollapsed] = React.useState<boolean>(false);

  return (
    <section className="mb-5 last:mb-2 transition-all">
      {/* Zone Header with Section Line (No icons, No table stats, Times New Roman font) */}
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="group flex items-center gap-1.5 hover:opacity-80 transition-opacity focus:outline-none"
        >
          <div className="p-0.5 rounded text-stone-500 group-hover:text-maroon-900 transition-colors">
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
          
          <h2 className="text-base sm:text-lg font-roman font-bold tracking-normal text-maroon-900">
            {zone}
          </h2>
        </button>

        {/* Decorative divider line matching reference UI */}
        <div className="flex-1 h-px bg-gradient-to-r from-maroon-900/40 via-stone-300 to-transparent ml-1" />
      </div>

      {/* Tables Grid - Fixed to 8 columns maximum on desktop/laptops so cards remain perfect squares */}
      {!collapsed && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-8 2xl:grid-cols-8 gap-2.5 sm:gap-3">
          {tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              onClick={onTableClick}
              onQuickView={onQuickView}
              onQuickBill={onQuickBill}
              onSettle={onSettle}
              isMatchedSearch={matchedTableIds.includes(table.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

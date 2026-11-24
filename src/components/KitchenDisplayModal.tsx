import React, { useState } from 'react';
import {
  X,
  ChefHat,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  Check
} from 'lucide-react';
import { Table } from '../types/pos';

interface KitchenDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  tables: Table[];
}

interface KdsTicket {
  id: string;
  tableId: string;
  zone: string;
  kotNo: string;
  timeElapsedMinutes: number;
  serverName: string;
  status: 'cooking' | 'ready';
  items: {
    name: string;
    qty: number;
    customization?: string;
    done: boolean;
  }[];
}

export const KitchenDisplayModal: React.FC<KitchenDisplayModalProps> = ({
  isOpen,
  onClose,
  tables,
}) => {
  if (!isOpen) return null;

  // Initial active kitchen tickets
  const [tickets, setTickets] = useState<KdsTicket[]>([
    {
      id: 'kds-1',
      tableId: 'A14',
      zone: 'Garden',
      kotNo: 'KOT-415',
      timeElapsedMinutes: 8,
      serverName: 'Vikas M.',
      status: 'cooking',
      items: [
        { name: 'Corn & Jalapeno Pizza', qty: 2, customization: 'Spicy Jalapeno Crunch', done: false },
        { name: 'Solkadhi Signature Kokum', qty: 2, done: true },
      ],
    },
    {
      id: 'kds-2',
      tableId: 'A1',
      zone: 'AC',
      kotNo: 'KOT-408',
      timeElapsedMinutes: 14,
      serverName: 'Ramesh K.',
      status: 'cooking',
      items: [
        { name: 'Capsicum & Onion (Large)', qty: 5, customization: 'Extra Cheese & Crisp crust', done: false },
      ],
    },
    {
      id: 'kds-3',
      tableId: 'SZ2',
      zone: 'Smoking-Zone',
      kotNo: 'KOT-413',
      timeElapsedMinutes: 4,
      serverName: 'Ramesh K.',
      status: 'cooking',
      items: [
        { name: 'Crispy Veg Burger', qty: 2, done: false },
        { name: 'Virgin Blue Curacao Mojito', qty: 2, done: false },
      ],
    },
    {
      id: 'kds-4',
      tableId: 'A2',
      zone: 'AC',
      kotNo: 'KOT-407',
      timeElapsedMinutes: 22,
      serverName: 'Sachin P.',
      status: 'ready',
      items: [
        { name: 'Margherita Pizza', qty: 1, customization: 'Fresh Basil', done: true },
        { name: 'Fresh Lime Soda', qty: 2, done: true },
      ],
    },
  ]);

  const [stationFilter, setStationFilter] = useState<'all' | 'cooking' | 'ready'>('all');

  const handleToggleItem = (ticketId: string, itemIdx: number) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const newItems = [...t.items];
        newItems[itemIdx] = { ...newItems[itemIdx], done: !newItems[itemIdx].done };
        const allDone = newItems.every((it) => it.done);
        return {
          ...t,
          items: newItems,
          status: allDone ? 'ready' : 'cooking',
        };
      })
    );
  };

  const handleMarkTicketReady = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          status: 'ready',
          items: t.items.map((it) => ({ ...it, done: true })),
        };
      })
    );
  };

  const handleBumpTicket = (ticketId: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
  };

  const filteredTickets = tickets.filter((t) => {
    if (stationFilter === 'all') return true;
    return t.status === stationFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-5xl bg-[#f7f4ed] rounded-2xl shadow-2xl border border-stone-300 z-10 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-950 px-5 py-3.5 text-white flex items-center justify-between border-b border-amber-400/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 border border-white/15">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <span>Kitchen Display System (KDS)</span>
                <span className="text-[10px] font-mono font-bold bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full">
                  LIVE TICKETS: {tickets.length}
                </span>
              </h3>
              <p className="text-xs text-amber-200/80">
                जेवण फॅमिली रेस्टॉरंट • Main Kitchen Terminal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter buttons */}
            <div className="hidden sm:flex items-center bg-white/10 rounded-lg p-0.5 border border-white/15 text-xs">
              <button
                onClick={() => setStationFilter('all')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                  stationFilter === 'all' ? 'bg-white text-maroon-950' : 'text-stone-200 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStationFilter('cooking')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                  stationFilter === 'cooking' ? 'bg-amber-400 text-stone-950' : 'text-stone-200 hover:text-white'
                }`}
              >
                Cooking ({tickets.filter((t) => t.status === 'cooking').length})
              </button>
              <button
                onClick={() => setStationFilter('ready')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                  stationFilter === 'ready' ? 'bg-emerald-400 text-stone-950' : 'text-stone-200 hover:text-white'
                }`}
              >
                Ready ({tickets.filter((t) => t.status === 'ready').length})
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tickets Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-20 text-stone-400">
              <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-2 opacity-80" />
              <div className="text-sm font-bold text-stone-700">All Kitchen Orders Clear!</div>
              <div className="text-xs text-stone-400 mt-1">New incoming orders will appear here automatically.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTickets.map((t) => {
                const isReady = t.status === 'ready';
                const isUrgent = t.timeElapsedMinutes >= 15;

                return (
                  <div
                    key={t.id}
                    className={`rounded-xl border shadow-sm flex flex-col justify-between overflow-hidden transition-all bg-white ${
                      isReady
                        ? 'border-emerald-400 ring-2 ring-emerald-400/30'
                        : isUrgent
                        ? 'border-rose-400 ring-2 ring-rose-400/30'
                        : 'border-stone-300'
                    }`}
                  >
                    {/* Ticket Header */}
                    <div
                      className={`px-3.5 py-2.5 flex items-center justify-between border-b ${
                        isReady
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : isUrgent
                          ? 'bg-rose-50 border-rose-200 text-rose-950'
                          : 'bg-[#faf7f2] border-stone-200 text-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-roman font-bold text-sm px-2 py-0.5 rounded bg-maroon-800 text-white">
                          T-{t.tableId}
                        </span>
                        <span className="text-xs font-medium text-stone-500">
                          ({t.zone})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold">
                          {t.kotNo}
                        </span>
                        <div
                          className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            isReady
                              ? 'bg-emerald-600 text-white'
                              : isUrgent
                              ? 'bg-rose-600 text-white animate-pulse'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{t.timeElapsedMinutes}m</span>
                        </div>
                      </div>
                    </div>

                    {/* Server meta */}
                    <div className="px-3.5 py-1 text-[11px] text-stone-500 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
                      <span>Server: <strong>{t.serverName}</strong></span>
                      <span className="capitalize font-semibold">{t.status}</span>
                    </div>

                    {/* Items List */}
                    <div className="p-3.5 space-y-2.5 flex-1 divide-y divide-stone-100">
                      {t.items.map((it, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleToggleItem(t.id, idx)}
                          className={`pt-2 first:pt-0 flex items-start gap-2.5 cursor-pointer select-none group ${
                            it.done ? 'opacity-40 line-through' : ''
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 flex-shrink-0 transition-all ${
                              it.done
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-stone-400 bg-white group-hover:border-maroon-800'
                            }`}
                          >
                            {it.done && <Check className="w-3.5 h-3.5" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between text-xs font-bold text-stone-900">
                              <span>{it.name}</span>
                              <span className="font-mono text-sm px-1.5 py-0.2 bg-stone-100 rounded text-maroon-900 ml-2">
                                ×{it.qty}
                              </span>
                            </div>
                            {it.customization && (
                              <div className="text-[11px] text-amber-800 font-semibold mt-0.5 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 inline-block">
                                Note: {it.customization}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Ticket Action Footer */}
                    <div className="p-2.5 bg-stone-50 border-t border-stone-200 flex items-center gap-2">
                      {isReady ? (
                        <button
                          onClick={() => handleBumpTicket(t.id)}
                          className="w-full py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Bump / Served</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkTicketReady(t.id)}
                          className="w-full py-1.5 rounded-lg text-xs font-bold bg-maroon-800 hover:bg-maroon-900 text-white flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Mark All Items Ready</span>
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-2.5 bg-[#ede8dd] border-t border-stone-300 flex items-center justify-between text-xs text-stone-600">
          <span>KDS Station: <strong>Hot Kitchen & Bar</strong></span>
          <span className="font-mono text-emerald-800 font-bold">● Network Online (Sync 1s)</span>
        </div>

      </div>
    </div>
  );
};


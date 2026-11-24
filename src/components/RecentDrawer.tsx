import React, { useState } from 'react';
import { X, RefreshCw, Clock } from 'lucide-react';

interface RecentItem {
  id: string;
  no: string;
  channel: 'Dine In' | 'Delivery' | 'Pick Up' | 'KOT';
  channelLabel: string;
  status: 'saved' | 'printed' | 'paid';
  itemsCount: number;
  time: string;
  amount: number;
}

interface RecentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrder?: (orderNo: string) => void;
}

const RECENT_ORDERS_DATA: RecentItem[] = [
  // KOT Tab
  { id: 'kot-7', no: '7', channel: 'KOT', channelLabel: 'Delivery', status: 'printed', itemsCount: 5, time: '07:18 PM', amount: 649 },
  { id: 'kot-2', no: 'A2', channel: 'KOT', channelLabel: 'Dine In', status: 'printed', itemsCount: 4, time: '07:12 PM', amount: 480 },
  { id: 'kot-5', no: 'KL16', channel: 'KOT', channelLabel: 'Dine In', status: 'printed', itemsCount: 3, time: '07:05 PM', amount: 890 },
  { id: 'kot-14', no: '14', channel: 'KOT', channelLabel: 'Dine In', status: 'saved', itemsCount: 2, time: '06:55 PM', amount: 350 },
  { id: 'kot-96', no: '96', channel: 'KOT', channelLabel: 'Pick Up', status: 'paid', itemsCount: 3, time: '06:40 PM', amount: 290 },

  // Dine In Tab
  { id: 'di-1', no: 'A1', channel: 'Dine In', channelLabel: 'Dine In (Table A1)', status: 'printed', itemsCount: 4, time: '07:22 PM', amount: 702 },
  { id: 'di-2', no: 'A2', channel: 'Dine In', channelLabel: 'Dine In (Table A2)', status: 'printed', itemsCount: 5, time: '07:15 PM', amount: 1295 },
  { id: 'di-3', no: 'KL16', channel: 'Dine In', channelLabel: 'Dine In (Table KL16)', status: 'printed', itemsCount: 2, time: '07:10 PM', amount: 460 },
  { id: 'di-4', no: 'T5', channel: 'Dine In', channelLabel: 'Dine In (Table T5)', status: 'saved', itemsCount: 3, time: '06:50 PM', amount: 590 },
  { id: 'di-5', no: 'T7', channel: 'Dine In', channelLabel: 'Dine In (Table T7)', status: 'paid', itemsCount: 4, time: '06:30 PM', amount: 1422 },

  // Delivery Tab
  { id: 'del-7', no: '7', channel: 'Delivery', channelLabel: 'Delivery (Swiggy)', status: 'printed', itemsCount: 5, time: '07:18 PM', amount: 649 },
  { id: 'del-871', no: '871', channel: 'Delivery', channelLabel: 'Delivery (Zomato)', status: 'paid', itemsCount: 2, time: '07:02 PM', amount: 706 },
  { id: 'del-874', no: '874', channel: 'Delivery', channelLabel: 'Delivery (Direct)', status: 'saved', itemsCount: 3, time: '06:45 PM', amount: 878 },

  // Pick Up Tab
  { id: 'pu-870', no: '870', channel: 'Pick Up', channelLabel: 'Pick Up (Main Counter)', status: 'saved', itemsCount: 1, time: '07:10 PM', amount: 350 },
  { id: 'pu-96', no: '96', channel: 'Pick Up', channelLabel: 'Pick Up (Takeaway)', status: 'printed', itemsCount: 3, time: '06:40 PM', amount: 290 },
];

export const RecentDrawer: React.FC<RecentDrawerProps> = ({
  isOpen,
  onClose,
  onSelectOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'Dine In' | 'Delivery' | 'Pick Up' | 'KOT'>('KOT');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  if (!isOpen) return null;

  const filteredItems = RECENT_ORDERS_DATA.filter((item) => item.channel === activeTab);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-fadeIn">
      {/* Semi-transparent Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-2xs transition-opacity"
      />

      {/* Drawer Container sliding from right matching Image 1 */}
      <aside
        className="absolute top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-2xl border-l border-stone-200 flex flex-col z-50 transform transition-transform duration-300 ease-out"
        role="dialog"
        aria-modal="true"
        aria-label="Recent Orders and KOTs"
      >
        {/* Top Header matching Image 1 */}
        <div className="px-4 py-3 border-b border-stone-200 flex items-center justify-between bg-white flex-shrink-0">
          <h2 className="text-base font-bold text-stone-800 tracking-tight flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#731b21]" />
            <span>Recent</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close recent drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Tabs matching Image 1: Dine In | Delivery | Pick Up | KOT */}
        <div className="grid grid-cols-4 border-b border-stone-200 bg-white flex-shrink-0 text-center text-xs">
          {(['Dine In', 'Delivery', 'Pick Up', 'KOT'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2.5 px-1 font-bold transition-all cursor-pointer relative ${
                  isActive
                    ? 'text-[#731b21]'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <span>{tab}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.75 bg-[#731b21] rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Sub-Header: No. on left | Items on right */}
        <div className="px-4 py-2 bg-[#fdfaf6] border-b border-stone-200 flex items-center justify-between text-xs font-bold text-stone-600 flex-shrink-0">
          <span>No.</span>
          <span>Items</span>
        </div>

        {/* Items List matching Image 1 */}
        <div className="flex-1 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-stone-400 text-xs font-semibold">
              No recent {activeTab} orders found
            </div>
          ) : (
            <div>
              {/* Channel Section Banner (e.g. Light Green banner for Delivery / Dine In) */}
              <div className="bg-[#86efac] text-emerald-950 px-4 py-1.5 text-xs font-bold tracking-wide border-b border-emerald-300">
                {activeTab === 'KOT' ? 'Delivery' : activeTab}
              </div>

              {/* Rows */}
              <div className="divide-y divide-stone-100">
                {filteredItems.map((item) => {
                  let badgeBg = 'bg-stone-200 text-stone-700'; // Saved
                  let badgeLetter = 'S';
                  if (item.status === 'printed') {
                    badgeBg = 'bg-rose-100 text-[#731b21] border border-rose-300 font-bold';
                    badgeLetter = 'P';
                  } else if (item.status === 'paid') {
                    badgeBg = 'bg-teal-100 text-teal-800 border border-teal-300 font-bold';
                    badgeLetter = 'Paid';
                  }

                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectOrder && onSelectOrder(item.no)}
                      className="px-4 py-3 flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer group"
                    >
                      {/* Left: Order / Table No. */}
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-stone-800 group-hover:text-[#731b21] transition-colors">
                          {item.no}
                        </span>
                        <span className="text-[10px] text-stone-400 font-medium">
                          ({item.time})
                        </span>
                      </div>

                      {/* Center: Status Badge (e.g. 'P' logo in Image 1) */}
                      <div className="flex items-center">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold shadow-2xs ${badgeBg}`}
                          title={`Status: ${item.status}`}
                        >
                          {badgeLetter === 'Paid' ? '✓' : badgeLetter}
                        </span>
                      </div>

                      {/* Right: Items Count */}
                      <div className="font-mono font-bold text-xs text-stone-700">
                        {item.itemsCount}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Status & Sync Footer matching Image 1 */}
        <div className="p-3.5 bg-white border-t border-stone-200 flex-shrink-0 flex flex-col items-center gap-2 text-center">
          {/* Sync warning text with spinning refresh */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold text-rose-600 tracking-tight">
              All Orders Are Not Synced.
            </span>
            <button
              onClick={handleSync}
              title="Click to sync all orders"
              className="p-1 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all cursor-pointer"
            >
              <RefreshCw
                className={`w-4 h-4 text-stone-600 ${isSyncing ? 'animate-spin text-[#731b21]' : ''}`}
              />
            </button>
          </div>

          {/* Status Color Legend matching Image 1 */}
          <div className="flex items-center justify-center gap-3 text-[11px] font-medium text-stone-600 pt-1 border-t border-stone-100 w-full">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#e5e7eb] border border-stone-300" />
              <span>Saved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#86efac] border border-emerald-400" />
              <span>Printed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#2dd4bf] border border-teal-400" />
              <span>Paid</span>
            </div>
          </div>
        </div>

      </aside>
    </div>
  );
};


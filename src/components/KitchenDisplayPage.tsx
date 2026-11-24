import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Clock,
  CheckCircle2,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Check,
  BellRing
} from 'lucide-react';
import { Table } from '../types/pos';

export type KitchenDepartment = 'grill' | 'tandoor' | 'curry' | 'main';

export interface KdsItem {
  id: string;
  name: string;
  qty: number;
  department: KitchenDepartment;
  customization?: string;
  done: boolean;
}

export interface KdsTicketData {
  id: string;
  tableNumber: string; // e.g. "Table 1", "Table 9"
  orderNumber: string; // e.g. "#104"
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  serverName?: string;
  elapsedSeconds: number;
  status: 'pending' | 'cooking' | 'ready' | 'completed';
  completedAt?: string;
  items: KdsItem[];
}

interface KitchenDisplayPageProps {
  tables?: Table[];
  onBackToTables?: () => void;
  onNavigateToBilling?: (table?: Table) => void;
}

// Exactly 8 initial live tickets to fill the 4x2 screen without scrolling
const INITIAL_LIVE_TICKETS: KdsTicketData[] = [
  {
    id: 'kds-tbl-1',
    tableNumber: 'Table 1',
    orderNumber: '#104',
    orderType: 'dine-in',
    serverName: 'Ramesh K.',
    elapsedSeconds: 546,
    status: 'pending',
    items: [
      { id: 't1-1', name: 'Paneer Tikka', qty: 2, department: 'tandoor', customization: 'Less spicy', done: false },
      { id: 't1-2', name: 'Butter Naan', qty: 4, department: 'tandoor', done: false },
      { id: 't1-3', name: 'Dal Makhani', qty: 1, department: 'curry', done: false },
    ],
  },
  {
    id: 'kds-tbl-9',
    tableNumber: 'Table 9',
    orderNumber: '#106',
    orderType: 'dine-in',
    serverName: 'Vikas M.',
    elapsedSeconds: 544,
    status: 'cooking', // Already started: #CC7722 header + Preparing badge + Ready button
    items: [
      { id: 't9-1', name: 'Tawa Chaap Tikka', qty: 2, department: 'grill', customization: 'Crispy roast', done: false },
      { id: 't9-2', name: 'Garlic Butter Naan', qty: 3, department: 'tandoor', done: false },
      { id: 't9-3', name: 'Dal Makhani Handi', qty: 1, department: 'curry', done: false },
    ],
  },
  {
    id: 'kds-tbl-7',
    tableNumber: 'Table 7',
    orderNumber: '#109',
    orderType: 'dine-in',
    serverName: 'Sachin P.',
    elapsedSeconds: 542,
    status: 'pending',
    items: [
      { id: 't7-1', name: 'Paneer Tikka', qty: 2, department: 'grill', customization: 'Less spicy', done: false },
      { id: 't7-2', name: 'Butter Naan', qty: 4, department: 'tandoor', done: false },
      { id: 't7-3', name: 'Dal Makhani', qty: 1, department: 'curry', done: false },
    ],
  },
  {
    id: 'kds-tbl-2',
    tableNumber: 'Table 2',
    orderNumber: '#111',
    orderType: 'dine-in',
    serverName: 'Sachin P.',
    elapsedSeconds: 539,
    status: 'cooking', // Already started: #CC7722 header + Preparing badge + Ready button
    items: [
      { id: 't2-1', name: 'Paneer Malai Tikka', qty: 2, department: 'tandoor', customization: 'Less spicy', done: false },
      { id: 't2-2', name: 'Butter Naan', qty: 4, department: 'tandoor', done: false },
      { id: 't2-3', name: 'Dal Makhani', qty: 1, department: 'curry', done: false },
    ],
  },
  {
    id: 'kds-tbl-5',
    tableNumber: 'Table 5',
    orderNumber: '#112',
    orderType: 'dine-in',
    serverName: 'Ramesh K.',
    elapsedSeconds: 538,
    status: 'pending',
    items: [
      { id: 't5-1', name: 'Paneer Tikka', qty: 2, department: 'grill', customization: 'Less spicy', done: false },
      { id: 't5-2', name: 'Butter Naan', qty: 4, department: 'tandoor', done: false },
      { id: 't5-3', name: 'Dal Makhani', qty: 1, department: 'curry', done: false },
    ],
  },
  {
    id: 'kds-tbl-12',
    tableNumber: 'Table 12',
    orderNumber: '#113',
    orderType: 'dine-in',
    serverName: 'Vikas M.',
    elapsedSeconds: 196,
    status: 'pending',
    items: [
      { id: 't12-1', name: 'Paneer Tikka', qty: 2, department: 'tandoor', customization: 'Less spicy', done: false },
      { id: 't12-2', name: 'Butter Naan', qty: 4, department: 'tandoor', done: false },
      { id: 't12-3', name: 'Dal Makhani', qty: 1, department: 'curry', done: false },
      { id: 't12-4', name: 'Jeera Rice Special', qty: 1, department: 'main', done: false },
    ],
  },
  {
    id: 'kds-tbl-14',
    tableNumber: 'Table 14',
    orderNumber: '#114',
    orderType: 'dine-in',
    serverName: 'Ramesh K.',
    elapsedSeconds: 140,
    status: 'pending',
    items: [
      { id: 't14-1', name: 'Mushroom Tikka', qty: 1, department: 'grill', customization: 'Extra mint chutney', done: false },
      { id: 't14-2', name: 'Paneer Lababdar', qty: 1, department: 'curry', done: false },
      { id: 't14-3', name: 'Veg Dum Biryani', qty: 2, department: 'main', done: false },
    ],
  },
  {
    id: 'kds-tbl-3',
    tableNumber: 'Table 3',
    orderNumber: '#115',
    orderType: 'takeaway',
    serverName: 'Counter',
    elapsedSeconds: 85,
    status: 'pending',
    items: [
      { id: 't3-1', name: 'Tandoori Roti', qty: 6, department: 'tandoor', done: false },
      { id: 't3-2', name: 'Kadhai Paneer', qty: 1, department: 'curry', customization: 'Medium spicy', done: false },
      { id: 't3-3', name: 'Gulab Jamun (2 pcs)', qty: 2, department: 'main', done: false },
    ],
  },
];

const INITIAL_RECENT_TICKETS: KdsTicketData[] = [
  {
    id: 'kds-recent-1',
    tableNumber: 'Table 4',
    orderNumber: '#103',
    orderType: 'dine-in',
    serverName: 'Sachin P.',
    elapsedSeconds: 680,
    completedAt: '07:12 PM',
    status: 'completed',
    items: [
      { id: 'r1-1', name: 'Paneer Tikka', qty: 2, department: 'tandoor', done: true },
      { id: 'r1-2', name: 'Butter Naan', qty: 4, department: 'tandoor', done: true },
      { id: 'r1-3', name: 'Dal Makhani', qty: 1, department: 'curry', done: true },
    ],
  },
  {
    id: 'kds-recent-2',
    tableNumber: 'Table 11',
    orderNumber: '#102',
    orderType: 'dine-in',
    serverName: 'Vikas M.',
    elapsedSeconds: 520,
    completedAt: '07:05 PM',
    status: 'completed',
    items: [
      { id: 'r2-1', name: 'Veg Seekh Kebab', qty: 2, department: 'grill', done: true },
      { id: 'r2-2', name: 'Dal Tadka', qty: 1, department: 'curry', done: true },
      { id: 'r2-3', name: 'Steamed Rice', qty: 1, department: 'main', done: true },
    ],
  },
];

export const KitchenDisplayPage: React.FC<KitchenDisplayPageProps> = () => {
  // Live Tickets state
  const [liveTickets, setLiveTickets] = useState<KdsTicketData[]>(INITIAL_LIVE_TICKETS);
  const [recentTickets, setRecentTickets] = useState<KdsTicketData[]>(INITIAL_RECENT_TICKETS);

  // View mode: 'live' or 'recent'
  const [viewMode, setViewMode] = useState<'live' | 'recent'>('live');

  // Station Filter: 1st Capitalized
  const [selectedStation, setSelectedStation] = useState<'all' | KitchenDepartment>('all');

  // Sound toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);

  // Synthesize authentic 2-tone kitchen order buzzer
  const playKitchenBuzzer = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;

      // Pulse 1: Low-Mid alert tone (659Hz - E5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.16);

      // Pulse 2: High kitchen alert ping (880Hz - A5)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, now + 0.14);
      gain2.gain.setValueAtTime(0.22, now + 0.14);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.14);
      osc2.stop(now + 0.38);
    } catch {
      // Audio autoplay policy handled silently
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Live seconds ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTickets((prev) =>
        prev.map((t) => ({
          ...t,
          elapsedSeconds: t.elapsedSeconds + 1,
        }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format MM:SS
  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Station tabs with 1st Capital Word: All Stations, Grill, Tandoor, Curry, Main
  const stations: { id: 'all' | KitchenDepartment; label: string }[] = [
    { id: 'all', label: 'All Stations' },
    { id: 'grill', label: 'Grill' },
    { id: 'tandoor', label: 'Tandoor' },
    { id: 'curry', label: 'Curry' },
    { id: 'main', label: 'Main' },
  ];

  // Filter tickets based on active station
  const currentTicketList = viewMode === 'live' ? liveTickets : recentTickets;

  const filteredTickets = useMemo(() => {
    if (selectedStation === 'all') return currentTicketList;
    return currentTicketList.filter((ticket) =>
      ticket.items.some((item) => item.department === selectedStation)
    );
  }, [currentTicketList, selectedStation]);

  // Actions on tickets:
  // 1. "Start" button: moves ticket from pending -> cooking
  // Header and Start button change from #fdfaf6 / #731b21 to #CC7722, ticket displays "Preparing"
  const handleStartTicket = (ticketId: string) => {
    setLiveTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'cooking' } : t))
    );
    showToast(`Order #${ticketId.replace('kds-tbl-', '')} is now Preparing`);
  };

  // 2. "Ready" button: completes order and moves it to Recent
  const handleReadyTicket = (ticketId: string) => {
    const target = liveTickets.find((t) => t.id === ticketId);
    if (!target) return;

    const completedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const completedTicket: KdsTicketData = {
      ...target,
      status: 'completed',
      completedAt: completedTime,
      items: target.items.map((it) => ({ ...it, done: true })),
    };

    setLiveTickets((prev) => prev.filter((t) => t.id !== ticketId));
    setRecentTickets((prev) => [completedTicket, ...prev]);
    showToast(`${target.tableNumber} Marked Ready & Moved to Recent`);
  };

  // 3. "Recall to Live" (from recent list)
  const handleRecallTicket = (ticketId: string) => {
    const target = recentTickets.find((t) => t.id === ticketId);
    if (!target) return;

    const recalledTicket: KdsTicketData = {
      ...target,
      status: 'cooking',
    };

    setRecentTickets((prev) => prev.filter((t) => t.id !== ticketId));
    setLiveTickets((prev) => [recalledTicket, ...prev]);
    showToast(`${target.tableNumber} Recalled back to Live Screen`);
  };

  // 4. Toggle single item checkmark/done status
  const handleToggleItem = (ticketId: string, itemId: string) => {
    const updater = (list: KdsTicketData[]) =>
      list.map((t) => {
        if (t.id !== ticketId) return t;
        const updatedItems = t.items.map((item) =>
          item.id === itemId ? { ...item, done: !item.done } : item
        );
        return { ...t, items: updatedItems };
      });

    if (viewMode === 'live') {
      setLiveTickets(updater);
    } else {
      setRecentTickets(updater);
    }
  };

  // Helper to format department name
  const getDepartmentTitle = (dept: KitchenDepartment): string => {
    switch (dept) {
      case 'tandoor':
        return 'Tandoor';
      case 'curry':
        return 'Curry';
      case 'grill':
        return 'Grill';
      case 'main':
        return 'Main Course';
      default:
        return dept;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f7f4ed] h-[calc(100vh-56px)] overflow-hidden select-none text-stone-800 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 right-4 z-50 bg-[#731b21] text-[#fdfaf6] text-xs font-semibold px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 border border-amber-300/40 animate-slideIn">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* TOP KDS BAR: Background color #fdfaf6 as requested        */}
      {/* ========================================================= */}
      <div className="bg-[#fdfaf6] border-b border-[#ded5c2] px-3 sm:px-5 py-2 flex items-center justify-between gap-3 flex-shrink-0 shadow-2xs text-stone-800">
        
        {/* Left Side: Kitchen Font placed at far left + Capitalized Department Tabs */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          
          {/* "Kitchen" Title: Positioned on far left, styled font in #731b21 */}
          <span className="font-roman font-extrabold text-xl sm:text-2xl tracking-wide text-[#731b21] select-none">
            Kitchen
          </span>

          {/* Kitchen Department Tabs: 1st Capital Word */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {stations.map((st) => {
              const isActive = selectedStation === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => setSelectedStation(st.id)}
                  className={`px-3 py-1 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#731b21] text-[#fdfaf6] shadow-xs font-bold ring-1 ring-[#731b21]'
                      : 'bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 border border-[#ded5c2]'
                  }`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Sound Symbol and Recent Button with #fdfaf6 symbols */}
        <div className="flex items-center gap-2">
          
          {/* Sound Buzzer Trigger & Toggle with #fdfaf6 symbol on #731b21 pill */}
          <button
            onClick={() => {
              playKitchenBuzzer();
              setSoundEnabled(!soundEnabled);
              showToast(soundEnabled ? 'Kitchen chime muted' : 'Kitchen buzzer enabled');
            }}
            title={soundEnabled ? 'Click to Test Buzzer (or Mute)' : 'Unmute Kitchen Buzzer'}
            className="p-1.5 rounded-lg bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] border border-[#731b21] transition-all cursor-pointer flex items-center justify-center shadow-2xs"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#fdfaf6]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#fdfaf6]/70" />
            )}
          </button>

          {/* Test Buzzer Button (Simulate incoming order chime) */}
          <button
            onClick={() => {
              playKitchenBuzzer();
              showToast('🔔 New Order Buzzer Alert!');
            }}
            title="Ring Kitchen Buzzer for New Order"
            className="px-2 py-1 rounded-lg text-xs font-semibold text-[#fdfaf6] bg-[#731b21] hover:bg-[#5b1419] border border-[#731b21] transition-all cursor-pointer hidden sm:flex items-center gap-1 shadow-2xs"
          >
            <BellRing className="w-3.5 h-3.5 text-[#fdfaf6]" />
            <span className="text-[#fdfaf6]">Buzzer</span>
          </button>

          {/* Recent / Back to Live Button colored in #fdfaf6 */}
          <button
            onClick={() => setViewMode(viewMode === 'live' ? 'recent' : 'live')}
            className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold active:scale-98 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              viewMode === 'live'
                ? 'bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] border border-[#731b21]'
                : 'bg-emerald-600 hover:bg-emerald-500 text-[#fdfaf6] font-bold shadow-md ring-2 ring-emerald-400/40'
            }`}
          >
            {viewMode === 'live' ? (
              <>
                <Clock className="w-3.5 h-3.5 text-[#fdfaf6]" />
                <span className="text-[#fdfaf6]">Recent</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5 text-[#fdfaf6]" />
                <span className="text-[#fdfaf6]">Back to Live</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 8-TICKET GRID: Fits 8 Tickets on Screen Without Scrolling */}
      {/* Grid: 4 columns x 2 rows = 8 tickets perfectly sized      */}
      {/* ========================================================= */}
      <div className="flex-1 p-2 sm:p-2.5 overflow-hidden flex flex-col min-h-0">
        
        {filteredTickets.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white/80 rounded-xl border border-dashed border-[#ded5c2]">
            <h3 className="text-sm font-bold text-stone-900 mb-1">
              {viewMode === 'live'
                ? selectedStation === 'all'
                  ? 'All KOT orders are cleared!'
                  : `No active orders in ${selectedStation} station`
                : 'No recent served orders found'}
            </h3>
            {viewMode === 'recent' && (
              <button
                onClick={() => setViewMode('live')}
                className="mt-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
              >
                Back to Live KDS
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-2 sm:gap-2.5 h-full w-full">
            {filteredTickets.slice(0, 8).map((ticket) => {
              const isCooking = ticket.status === 'cooking';
              const isCompleted = ticket.status === 'completed';

              // Header Color Rules:
              // - New order / pending: ticket header color remains #fdfaf6
              // - The moment Start button is clicked (cooking): changes to #CC7722
              let headerBgClass = 'bg-[#fdfaf6] text-[#731b21] border-b border-[#e5dccb]';
              let tableTextClass = 'text-[#731b21]';
              let timerTextClass = 'text-[#731b21]';
              let orderMetaClass = 'text-stone-600';

              if (isCooking) {
                headerBgClass = 'bg-[#CC7722] text-[#fdfaf6] border-b border-[#b5671a] shadow-xs';
                tableTextClass = 'text-[#fdfaf6] drop-shadow-xs';
                timerTextClass = 'text-[#fdfaf6]';
                orderMetaClass = 'text-[#fdfaf6]/90';
              } else if (isCompleted) {
                headerBgClass = 'bg-stone-700 text-[#fdfaf6] border-b border-stone-800';
                tableTextClass = 'text-[#fdfaf6]';
                timerTextClass = 'text-[#fdfaf6]';
                orderMetaClass = 'text-[#fdfaf6]/80';
              }

              // Card Border: subtle amber glow when preparing
              const cardBorder = isCooking
                ? 'border-2 border-[#CC7722] shadow-sm ring-1 ring-[#CC7722]/30'
                : 'border border-[#ded5c2] shadow-xs';

              // Filter items by department if station selected
              const itemsToRender = selectedStation === 'all'
                ? ticket.items
                : ticket.items.filter((it) => it.department === selectedStation);

              const departmentsInTicket = Array.from(
                new Set(itemsToRender.map((it) => it.department))
              );

              return (
                <div
                  key={ticket.id}
                  className={`rounded-lg overflow-hidden bg-white flex flex-col justify-between h-full transition-all ${cardBorder}`}
                >
                  
                  {/* ========================================================= */}
                  {/* TICKET HEADER: Color changes #fdfaf6 -> #CC7722 on Start  */}
                  {/* Displays "Preparing" status badge on ticket when active   */}
                  {/* ========================================================= */}
                  <div className={`px-2.5 py-1.5 sm:py-2 flex items-center justify-between flex-shrink-0 transition-colors ${headerBgClass}`}>
                    
                    {/* Left: Table & Order # */}
                    <div className="flex flex-col leading-tight">
                      <div className="flex items-center gap-1.5">
                        <h3 className={`text-sm sm:text-base font-black tracking-tight ${tableTextClass}`}>
                          {ticket.tableNumber}
                        </h3>
                        {/* Status shown on ticket: PREPARING status on KOT ticket when clicked */}
                        {isCooking && (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold uppercase bg-white/20 text-[#fdfaf6] border border-white/40 tracking-wider flex items-center gap-1 shadow-2xs animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            Preparing
                          </span>
                        )}
                      </div>
                      <div className={`text-[10px] font-medium ${orderMetaClass}`}>
                        <span>{ticket.orderNumber}</span>
                        <span> · </span>
                        <span className="capitalize">{ticket.orderType}</span>
                      </div>
                    </div>

                    {/* Right: Digital Timer */}
                    <div className="text-right">
                      {isCompleted ? (
                        <div className="text-right">
                          <span className="text-[9px] font-bold uppercase tracking-wider block opacity-75">Served</span>
                          <span className="font-mono font-bold text-xs">{ticket.completedAt}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end">
                          <span className={`font-mono font-black text-sm sm:text-base tracking-tight leading-none ${timerTextClass}`}>
                            {formatTime(ticket.elapsedSeconds)}
                          </span>
                          {!isCooking && (
                            <span className="text-[8px] font-bold uppercase tracking-wider opacity-70 mt-0.5">
                              Waiting
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ========================================================= */}
                  {/* TICKET BODY: Department divisions with background #fdfaf6 */}
                  {/* ========================================================= */}
                  <div className="px-2.5 py-1.5 flex-1 overflow-y-auto min-h-0 space-y-1.5 bg-[#ffffff]">
                    {departmentsInTicket.map((dept) => {
                      const deptItems = itemsToRender.filter((it) => it.department === dept);

                      return (
                        <div key={dept} className="space-y-1">
                          
                          {/* Department Division: Background changed to #fdfaf6 as requested */}
                          <div className="bg-[#fdfaf6] px-2 py-0.5 rounded border border-[#e8dfcf] flex items-center justify-between shadow-2xs">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#731b21] flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#731b21]" />
                              {getDepartmentTitle(dept)}
                            </span>
                            <span className="text-[9px] font-mono font-bold text-stone-600">
                              {deptItems.length} {deptItems.length === 1 ? 'item' : 'items'}
                            </span>
                          </div>

                          {/* Items List */}
                          <div className="space-y-1 px-0.5">
                            {deptItems.map((item) => (
                              <div
                                key={item.id}
                                onClick={() => handleToggleItem(ticket.id, item.id)}
                                title="Click to strike / mark item done"
                                className={`cursor-pointer group flex items-start justify-between py-0.5 rounded transition-all hover:bg-stone-50 ${
                                  item.done ? 'opacity-40' : ''
                                }`}
                              >
                                <div className="flex-1 pr-1.5 leading-tight">
                                  <div className="flex items-baseline gap-1.5">
                                    {/* Multiplier in bold #731b21 maroon */}
                                    <span className="text-[#731b21] font-black text-xs sm:text-sm leading-none">
                                      {item.qty}×
                                    </span>
                                    {/* Dish Name */}
                                    <span
                                      className={`text-xs font-bold text-stone-900 group-hover:text-[#731b21] transition-colors ${
                                        item.done ? 'line-through text-stone-400' : ''
                                      }`}
                                    >
                                      {item.name}
                                    </span>
                                  </div>

                                  {/* Customization (e.g. Less spicy) */}
                                  {item.customization && (
                                    <div className="text-[10px] text-stone-500 font-normal pl-4 italic leading-tight">
                                      {item.customization}
                                    </div>
                                  )}
                                </div>

                                {/* Strike checkbox */}
                                <div className="pt-0.5 flex-shrink-0">
                                  <span
                                    className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
                                      item.done
                                        ? 'bg-emerald-600 border-emerald-600 text-white'
                                        : 'border-stone-300 group-hover:border-stone-400'
                                    }`}
                                  >
                                    {item.done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                        </div>
                      );
                    })}
                  </div>

                  {/* ========================================================= */}
                  {/* TICKET FOOTER: Action Button (Start / Ready / Recall)     */}
                  {/* Default Start Button: #731b21                             */}
                  {/* When clicked: changes to #CC7722, labeled "Ready"         */}
                  {/* ========================================================= */}
                  <div className="p-1.5 bg-[#ffffff] border-t border-stone-100 flex-shrink-0">
                    {isCompleted ? (
                      <button
                        onClick={() => handleRecallTicket(ticket.id)}
                        className="w-full py-1.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-98 cursor-pointer border border-stone-300"
                      >
                        <RotateCcw className="w-3 h-3 text-maroon-800" />
                        <span>Recall to Live Screen</span>
                      </button>
                    ) : isCooking ? (
                      // Clicked state: Background #55E07E as requested, button text says "Ready" (Preparing status is on the ticket header)
                      <button
                        onClick={() => handleReadyTicket(ticket.id)}
                        className="w-full py-1.5 rounded-md bg-[#55E07E] hover:bg-[#46cc6e] text-emerald-950 font-black text-xs tracking-wide shadow-2xs hover:shadow-xs transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 border border-emerald-400/40"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Ready</span>
                      </button>
                    ) : (
                      // Default state for new/pending order: Background #731b21, button text says "Start"
                      <button
                        onClick={() => handleStartTicket(ticket.id)}
                        className="w-full py-1.5 rounded-md bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-bold tracking-wide shadow-2xs hover:shadow-xs transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>Start</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};

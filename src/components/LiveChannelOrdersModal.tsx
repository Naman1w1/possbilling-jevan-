import React, { useState, useMemo } from 'react';
import {
  X,
  Bike,
  ShoppingBag,
  Search,
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Filter,
  Printer,
  FileText,
  User,
  ArrowRight,
  RefreshCw,
  Plus
} from 'lucide-react';
import { QuickOrder } from '../types/pos';

interface LiveChannelOrdersModalProps {
  channel: 'Delivery' | 'Pick Up';
  isOpen: boolean;
  onClose: () => void;
  orders: QuickOrder[];
  onUpdateOrderStatus?: (orderId: string, newStatus: any) => void;
  onAddNewOrder?: (channel: 'Delivery' | 'Pick Up') => void;
  onPrintOrder?: (order: QuickOrder) => void;
}

export const LiveChannelOrdersModal: React.FC<LiveChannelOrdersModalProps> = ({
  channel,
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  onAddNewOrder,
  onPrintOrder,
}) => {
  if (!isOpen) return null;

  const isDelivery = channel === 'Delivery';

  // Filter and search state
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<QuickOrder | null>(null);

  // Filter orders by channel first, then platform, status, search
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // Must match channel
      if (ord.type !== channel) return false;

      // Platform filter
      if (selectedPlatform !== 'All' && ord.platform !== selectedPlatform) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'All' && ord.status !== selectedStatus) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = ord.id.toLowerCase().includes(q) || (ord.orderNo && ord.orderNo.toLowerCase().includes(q));
        const matchesName = ord.customerName.toLowerCase().includes(q);
        const matchesPhone = ord.customerPhone.includes(q);
        const matchesAddress = ord.customerAddress?.toLowerCase().includes(q) || false;
        if (!matchesId && !matchesName && !matchesPhone && !matchesAddress) return false;
      }

      return true;
    });
  }, [orders, channel, selectedPlatform, selectedStatus, searchQuery]);

  // Platform badges styling helper
  const getPlatformBadge = (platform?: string) => {
    const p = platform?.toLowerCase() || '';
    if (p.includes('swiggy')) {
      return {
        bg: 'bg-orange-50 text-orange-800 border-orange-300',
        dot: 'bg-orange-500',
        label: 'Swiggy'
      };
    }
    if (p.includes('zomato')) {
      return {
        bg: 'bg-red-50 text-red-800 border-red-300',
        dot: 'bg-red-600',
        label: 'Zomato'
      };
    }
    if (p.includes('magicpin')) {
      return {
        bg: 'bg-purple-50 text-purple-800 border-purple-300',
        dot: 'bg-purple-600',
        label: 'Magicpin'
      };
    }
    if (p.includes('counter')) {
      return {
        bg: 'bg-amber-50 text-amber-900 border-amber-300',
        dot: 'bg-amber-600',
        label: 'Takeaway Counter'
      };
    }
    if (p.includes('phone')) {
      return {
        bg: 'bg-sky-50 text-sky-800 border-sky-300',
        dot: 'bg-sky-600',
        label: 'Phone Order'
      };
    }
    return {
      bg: 'bg-rose-50 text-rose-900 border-rose-300',
      dot: 'bg-[#731b21]',
      label: platform || 'Direct Store'
    };
  };

  // Status badge styling helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Preparing':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          dot: 'bg-amber-500 animate-pulse',
          label: 'Preparing in Kitchen'
        };
      case 'Ready':
        return {
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          dot: 'bg-emerald-600',
          label: isDelivery ? 'Ready for Dispatch' : 'Ready for Pick Up'
        };
      case 'Out for Delivery':
        return {
          bg: 'bg-blue-100 text-blue-900 border-blue-300',
          dot: 'bg-blue-600 animate-ping',
          label: 'Out for Delivery'
        };
      case 'Completed':
        return {
          bg: 'bg-stone-100 text-stone-700 border-stone-300',
          dot: 'bg-stone-500',
          label: isDelivery ? 'Delivered' : 'Handed Over'
        };
      default:
        return {
          bg: 'bg-stone-100 text-stone-700 border-stone-200',
          dot: 'bg-stone-400',
          label: status
        };
    }
  };

  const handleAdvanceStatus = (order: QuickOrder) => {
    if (!onUpdateOrderStatus) return;
    if (order.status === 'Preparing') {
      onUpdateOrderStatus(order.id, 'Ready');
    } else if (order.status === 'Ready') {
      onUpdateOrderStatus(order.id, isDelivery ? 'Out for Delivery' : 'Completed');
    } else if (order.status === 'Out for Delivery') {
      onUpdateOrderStatus(order.id, 'Completed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-2xs select-none animate-fadeIn">
      <div className="bg-[#fdfaf6] w-full max-w-5xl rounded-2xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp">
        
        {/* ========================================================= */}
        {/* 1. MODAL TOP HEADER                                       */}
        {/* ========================================================= */}
        <div className="bg-[#ede8dd] px-5 py-3.5 border-b border-stone-300 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white border border-stone-300 flex items-center justify-center text-[#731b21] shadow-2xs">
              {isDelivery ? <Bike className="w-5 h-5 text-[#731b21]" /> : <ShoppingBag className="w-5 h-5 text-[#731b21]" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-stone-900 tracking-tight">
                  {isDelivery ? 'Delivery Live Orders' : 'Pick Up Live Orders'}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#731b21] text-white">
                  {filteredOrders.length} Active
                </span>
              </div>
              <p className="text-[11px] text-stone-600 font-medium">
                {isDelivery
                  ? 'Real-time order tracking, platform integration (Swiggy, Zomato, Direct) & rider dispatch'
                  : 'Real-time pickup counter orders, token tracking & customer hand-over'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onAddNewOrder && (
              <button
                onClick={() => onAddNewOrder(channel)}
                className="px-2.5 py-1 rounded-md bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-semibold transition-all shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 text-[#fdfaf6]" />
                <span>New {channel}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. SUB-BAR: PLATFORM FILTER, STATUS & SEARCH              */}
        {/* ========================================================= */}
        <div className="bg-white border-b border-stone-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          
          {/* Platform Filters */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mr-1">
              Platform:
            </span>
            {(isDelivery
              ? ['All', 'Swiggy', 'Zomato', 'Direct', 'Magicpin']
              : ['All', 'Takeaway Counter', 'Phone Order', 'Direct Web']
            ).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  selectedPlatform === p
                    ? 'bg-[#731b21] text-white shadow-2xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Status Quick Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mr-1">
              Status:
            </span>
            {['All', 'Preparing', 'Ready', isDelivery ? 'Out for Delivery' : null, 'Completed']
              .filter(Boolean)
              .map((st) => (
                <button
                  key={st as string}
                  onClick={() => setSelectedStatus(st as string)}
                  className={`px-2 py-0.8 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    selectedStatus === st
                      ? 'bg-stone-800 text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                  }`}
                >
                  {st}
                </button>
              ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order #, customer, phone..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-stone-400 hover:text-stone-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

        </div>

        {/* ========================================================= */}
        {/* 3. MAIN ORDERS LIST & DETAILS SPLIT                       */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {filteredOrders.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-stone-500">
              {isDelivery ? <Bike className="w-8 h-8 text-stone-300 mb-2" /> : <ShoppingBag className="w-8 h-8 text-stone-300 mb-2" />}
              <p className="text-sm font-bold text-stone-700">No {channel} orders found</p>
              <p className="text-xs text-stone-400 mt-1">Check back soon or create a new order</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredOrders.map((ord) => {
                const platStyle = getPlatformBadge(ord.platform);
                const statStyle = getStatusBadge(ord.status);

                return (
                  <div
                    key={ord.id}
                    className="bg-white rounded-xl border border-stone-200 hover:border-stone-300 shadow-2xs hover:shadow transition-all p-4 flex flex-col justify-between space-y-3"
                  >
                    {/* Top Row: Order ID, Platform Badge, Status */}
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2.5 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-[#731b21] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          {ord.orderNo || ord.id}
                        </span>

                        {/* Platform Badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold border ${platStyle.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${platStyle.dot}`} />
                          <span>{platStyle.label}</span>
                        </span>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statStyle.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statStyle.dot}`} />
                        <span>{statStyle.label}</span>
                      </span>
                    </div>

                    {/* Middle Row: Customer Info & Destination */}
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-stone-900 text-[13px]">
                          <User className="w-3.5 h-3.5 text-stone-400" />
                          <span>{ord.customerName}</span>
                        </div>
                        <span className="font-mono font-bold text-stone-700 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-stone-400" />
                          {ord.customerPhone}
                        </span>
                      </div>

                      {/* Delivery Address or Pickup Slot */}
                      {isDelivery ? (
                        <div className="flex items-start gap-1.5 text-stone-600 text-[11px] pt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{ord.customerAddress || 'No address specified'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-stone-600 text-[11px] pt-0.5">
                          <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                          <span>Pickup Slot: <strong className="text-stone-800">{ord.pickupSlot || 'Immediate'}</strong></span>
                        </div>
                      )}

                      {/* Rider Assignment (For Delivery) */}
                      {isDelivery && ord.riderName && (
                        <div className="text-[11px] text-blue-900 bg-blue-50/70 px-2 py-1 rounded border border-blue-200 mt-1 flex items-center justify-between">
                          <span className="font-semibold">🛵 Rider: {ord.riderName}</span>
                          <span className="font-mono text-[10px]">{ord.riderPhone}</span>
                        </div>
                      )}
                    </div>

                    {/* Items Breakdown */}
                    {ord.items && ord.items.length > 0 && (
                      <div className="bg-[#fcfaf7] p-2.5 rounded-lg border border-stone-200/80 text-xs space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-stone-500 uppercase tracking-wider pb-1 border-b border-stone-200">
                          <span>Items ({ord.itemsCount})</span>
                          <span>Price</span>
                        </div>
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-baseline text-[11px]">
                            <span className="font-medium text-stone-800 truncate pr-2">
                              <strong className="text-[#731b21]">{it.quantity}x</strong> {it.name}
                              {it.notes && <span className="text-rose-700 text-[10px] italic"> ({it.notes})</span>}
                            </span>
                            <span className="font-mono text-stone-700 flex-shrink-0 font-semibold">
                              ₹{it.price * it.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bottom Row: Amount, Payment Mode, Action Buttons */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <div className="text-[10px] text-stone-400 font-medium">
                          Created {ord.createdAt} • <span className="text-emerald-700 font-bold">{ord.paymentType || 'Paid'}</span>
                        </div>
                        <div className="font-mono font-black text-sm text-stone-900">
                          ₹{ord.amount.toFixed(2)}
                        </div>
                      </div>

                      {/* Status Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        {onPrintOrder && (
                          <button
                            onClick={() => onPrintOrder(ord)}
                            className="p-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
                            title="Print KOT / Bill"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {ord.status !== 'Completed' && onUpdateOrderStatus && (
                          <button
                            onClick={() => handleAdvanceStatus(ord)}
                            className="px-3 py-1.5 rounded-lg bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95"
                          >
                            <span>
                              {ord.status === 'Preparing'
                                ? 'Mark Ready'
                                : ord.status === 'Ready'
                                ? isDelivery
                                  ? 'Dispatch Rider'
                                  : 'Hand Over'
                                : 'Mark Delivered'}
                            </span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                        {ord.status === 'Completed' && (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Done</span>
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* 4. MODAL FOOTER                                           */}
        {/* ========================================================= */}
        <div className="bg-[#ede8dd] px-5 py-2.5 border-t border-stone-300 flex items-center justify-between text-xs font-semibold text-stone-700 flex-shrink-0">
          <div>
            Showing {filteredOrders.length} {channel} orders • Total Volume: <strong className="font-mono text-stone-900 font-bold">₹{filteredOrders.reduce((sum, o) => sum + o.amount, 0).toLocaleString('en-IN')}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};


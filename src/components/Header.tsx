import React, { useState } from 'react';
import logoUrl from '../assets/logo.png';
import {
  Menu,
  Search,
  Plus,
  Store,
  Radio,
  FileText,
  Clock,
  PauseCircle,
  Bell,
  LogOut,
  X
} from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  onNewOrder: () => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onOpenOrders: () => void;
  onOpenRecent: () => void;
  onOpenHold: () => void;
  onOpenAlerts: () => void;
  onOpenLiveView?: () => void;
  onOpenItemOnOff?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  onNewOrder,
  searchQuery,
  setSearchQuery,
  onOpenOrders,
  onOpenRecent,
  onOpenHold,
  onOpenAlerts,
  onOpenLiveView,
  onOpenItemOnOff,
}) => {
  const [itemsActive, setItemsActive] = useState<boolean>(true);
  const [mobileSearchOpen, setMobileSearchOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-30 bg-[#f7f4ed]/95 backdrop-blur-md border-b border-[#e6decb] shadow-subtle transition-all flex-shrink-0">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-5 py-2 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Hamburger, Clean Logo & New Order Button */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={onMenuClick}
            aria-label="Toggle navigation drawer"
            className="p-1.5 sm:p-2 rounded-xl text-maroon-900 hover:bg-maroon-100/70 active:scale-95 transition-all duration-150 border border-transparent hover:border-maroon-200"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Clean Logo without box cutout */}
          <div className="flex items-center cursor-pointer">
            <img
              src={logoUrl}
              alt="जेवण फॅमिली रेस्टॉरंट"
              className="h-9 sm:h-10 md:h-11 w-auto object-contain drop-shadow-xs"
            />
          </div>

          {/* New Order Button directly on right side of logo */}
          <button
            onClick={onNewOrder}
            className="btn-premium-maroon h-8 sm:h-9 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 shadow-xs whitespace-nowrap active:scale-95 transition-all cursor-pointer text-[#fdfaf6]"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#fdfaf6]" />
            <span className="text-[#fdfaf6]">New Order</span>
          </button>
        </div>

        {/* Center: Merged Search Bar (Bill No & KOT No merged, size greater than merged size, placed at center) */}
        <div className="hidden md:flex flex-1 justify-center max-w-lg lg:max-w-xl mx-2 sm:mx-4">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 group-focus-within:text-maroon-800">
              <Search className="w-4 h-4 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Bill No. / KOT No."
              className="w-full h-8 sm:h-9 pl-9 pr-8 text-xs sm:text-sm bg-white/95 hover:bg-white focus:bg-white text-stone-800 rounded-lg border border-[#ded5c2] focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/15 focus:outline-none transition-all placeholder:text-stone-400 font-medium shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            aria-label="Toggle search input"
            className="md:hidden p-2 rounded-xl text-maroon-900 hover:bg-maroon-100 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Quick Actions Bar */}
          <div className="flex items-center gap-1 sm:gap-2 px-2 py-1 rounded-xl bg-white/70 border border-[#e8dfcb] shadow-2xs">
            {/* Item On/Off Toggle */}
            <div
              className="flex flex-col items-center justify-center px-1.5 group cursor-pointer"
              onClick={() => {
                if (onOpenItemOnOff) {
                  onOpenItemOnOff();
                } else {
                  setItemsActive(!itemsActive);
                }
              }}
              title="Menu Item On/Off Management"
            >
              <div
                className={`relative inline-flex h-3.5 w-7 items-center rounded-full transition-colors ${
                  itemsActive ? 'bg-emerald-600' : 'bg-stone-300'
                }`}
              >
                <span
                  className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                    itemsActive ? 'translate-x-3.5' : 'translate-x-0.5'
                  }`}
                />
              </div>
              <span className="text-[9px] font-semibold text-stone-600 group-hover:text-maroon-900 transition-colors mt-0.5">
                Item On/Off
              </span>
            </div>

            <div className="h-5 w-px bg-stone-200" />

            {/* Store Status */}
            <button
              title="Store Status: Online"
              className="flex flex-col items-center justify-center p-1 rounded-lg text-stone-700 hover:text-maroon-900 hover:bg-maroon-50/70 transition-all"
            >
              <Store className="w-3.5 h-3.5 text-emerald-700" />
              <span className="text-[9px] font-medium mt-0.5">Store</span>
            </button>

            {/* Live View */}
            <button
              onClick={onOpenLiveView}
              title="Kitchen Display System (KDS Live View)"
              className="flex flex-col items-center justify-center p-1 rounded-lg text-stone-700 hover:text-maroon-900 hover:bg-maroon-50/70 transition-all cursor-pointer"
            >
              <div className="relative">
                <Radio className="w-3.5 h-3.5 text-rose-600" />
                <span className="absolute -top-0.5 -right-0.5 w-1 h-1 rounded-full bg-rose-500 animate-ping" />
              </div>
              <span className="text-[9px] font-medium mt-0.5">Live View</span>
            </button>

            {/* Orders */}
            <button
              onClick={onOpenOrders}
              title="Active Orders List"
              className="relative flex flex-col items-center justify-center p-1 rounded-lg text-stone-700 hover:text-maroon-900 hover:bg-maroon-50/70 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-stone-600" />
              <span className="text-[9px] font-medium mt-0.5">Orders</span>
              <span className="absolute -top-1 -right-1 bg-maroon-800 text-white font-mono text-[8px] font-bold px-1 rounded-full">
                14
              </span>
            </button>

            {/* Recent */}
            <button
              onClick={onOpenRecent}
              title="Recent KOT View"
              className="flex flex-col items-center justify-center p-1 rounded-lg text-stone-700 hover:text-maroon-900 hover:bg-maroon-50/70 transition-all cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-stone-600" />
              <span className="text-[9px] font-medium mt-0.5">Recent</span>
            </button>

            {/* Hold */}
            <button
              onClick={onOpenHold}
              title="Hold Orders"
              className="relative flex flex-col items-center justify-center p-1 rounded-lg text-stone-700 hover:text-maroon-900 hover:bg-maroon-50/70 transition-all"
            >
              <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[9px] font-medium mt-0.5">Hold</span>
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-mono text-[8px] font-bold px-1 rounded-full">
                2
              </span>
            </button>

            {/* Alerts */}
            <button
              onClick={onOpenAlerts}
              title="System Alerts"
              className="relative flex flex-col items-center justify-center p-1 rounded-lg text-stone-700 hover:text-maroon-900 hover:bg-maroon-50/70 transition-all"
            >
              <Bell className="w-3.5 h-3.5 text-stone-600" />
              <span className="text-[9px] font-medium mt-0.5">Alerts</span>
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-mono text-[8px] font-bold px-1 rounded-full animate-pulse">
                3
              </span>
            </button>

            {/* Logout */}
            <button
              title="Logout Session"
              className="flex flex-col items-center justify-center p-1 rounded-lg text-stone-500 hover:text-rose-700 hover:bg-rose-50 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="text-[9px] font-medium mt-0.5">Logout</span>
            </button>
          </div>

        </div>

      </div>

      {/* Mobile Search Accordion */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 bg-[#f7f4ed] border-t border-stone-200">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Bill No. / KOT No."
              className="w-full pl-8 pr-2 py-1.5 text-xs bg-white rounded-lg border border-stone-300 focus:outline-none focus:border-maroon-800"
            />
          </div>
        </div>
      )}
    </header>
  );
};

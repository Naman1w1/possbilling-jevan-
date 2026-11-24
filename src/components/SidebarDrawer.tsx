import React from 'react';
import completeLogoUrl from '../assets/complete-logo.png';
import parchmentTextureUrl from '../assets/parchment-texture.png';
import {
  X,
  Receipt,
  LayoutGrid,
  ChefHat,
  BarChart3,
  Settings,
  LogOut,
  User
} from 'lucide-react';

export type SidebarFeature = 'billing' | 'operations' | 'kitchen-display' | 'report' | 'setting';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeFeature?: SidebarFeature;
  onSelectFeature: (feature: SidebarFeature) => void;
  onLogout: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  activeFeature = 'operations',
  onSelectFeature,
  onLogout,
}) => {
  if (!isOpen) return null;

  const menuItems: { id: SidebarFeature; label: string; icon: React.ReactNode }[] = [
    {
      id: 'billing',
      label: 'Billing',
      icon: <Receipt className="w-4 h-4 sm:w-4.5 sm:h-4.5" />,
    },
    {
      id: 'operations',
      label: 'Operations',
      icon: <LayoutGrid className="w-4 h-4 sm:w-4.5 sm:h-4.5" />,
    },
    {
      id: 'kitchen-display',
      label: 'Kitchen Display',
      icon: <ChefHat className="w-4 h-4 sm:w-4.5 sm:h-4.5" />,
    },
    {
      id: 'report',
      label: 'Report',
      icon: <BarChart3 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />,
    },
    {
      id: 'setting',
      label: 'Setting',
      icon: <Settings className="w-4 h-4 sm:w-4.5 sm:h-4.5" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex select-none animate-fadeIn">
      {/* Dark Ambient Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/65 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Container: Sleek & Compact width (decreased length) */}
      <div className="relative w-56 sm:w-64 max-w-[80vw] h-full bg-[#6d1e1c] text-[#fdfaf6] shadow-2xl z-10 flex flex-col justify-between overflow-hidden border-r border-[#842523]">
        
        {/* ========================================================= */}
        {/* TOP: Curved Header with Authentic Parchment Paper Texture */}
        {/* ========================================================= */}
        <div className="relative rounded-b-[2rem] shadow-md pt-4 pb-4 px-3 flex flex-col items-center justify-center flex-shrink-0 border-b border-amber-950/20 overflow-hidden bg-[#f4ead9]">
          
          {/* Authentic Mottled Parchment Paper Background Texture */}
          <div
            className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-95"
            style={{ backgroundImage: `url(${parchmentTextureUrl})` }}
          />

          {/* Organic paper grain & subtle mottled warm shading */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-stone-900/5 via-transparent to-amber-900/10" />
          
          {/* Subtle perimeter vignette lighting */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_-8px_16px_rgba(109,30,28,0.2),inset_0_2px_6px_rgba(255,255,255,0.4)]" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="absolute top-2 right-2 p-1.5 rounded-full text-stone-600 hover:text-maroon-950 hover:bg-stone-400/25 transition-all cursor-pointer z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Complete Authentic Restaurant Logo (Mandala Crest + Calligraphy) */}
          <div className="relative z-10 flex items-center justify-center px-2 py-1">
            <img
              src={completeLogoUrl}
              alt="जेवण फॅमिली रेस्टॉरंट Logo"
              className="h-24 sm:h-28 w-auto object-contain drop-shadow-sm select-none"
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* MIDDLE: Feature Navigation Items List                    */}
        {/* ========================================================= */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3.5">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = activeFeature === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectFeature(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer text-left select-none ${
                    isActive
                      ? 'bg-[#952f2c] text-[#fdfaf6] shadow-sm font-semibold border border-white/10'
                      : 'text-[#fdfaf6]/90 hover:text-[#fdfaf6] hover:bg-white/10 active:scale-98'
                  }`}
                >
                  <span className={isActive ? 'text-[#fdfaf6]' : 'text-[#fdfaf6]/85'}>
                    {item.icon}
                  </span>
                  <span className="tracking-wide">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM: Profile Bar with Manager & Logout Feature         */}
        {/* ========================================================= */}
        <div className="px-3 pb-4 pt-1 flex-shrink-0">
          <div className="border-t border-white/15 pt-3 flex items-center justify-between">
            {/* User Profile Info */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-[#fdfaf6]">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-semibold text-[#fdfaf6] leading-tight">
                  Riya Sharma
                </div>
                <div className="text-[10px] sm:text-xs text-amber-200/80 font-medium">
                  Manager
                </div>
              </div>
            </div>

            {/* Logout Feature Button */}
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              title="Logout from session"
              className="p-1.5 rounded-lg text-[#fdfaf6]/80 hover:text-[#fdfaf6] hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

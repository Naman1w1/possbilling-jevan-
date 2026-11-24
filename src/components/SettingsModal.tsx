import React, { useState } from 'react';
import {
  X,
  Settings,
  Store,
  Receipt,
  Printer,
  Bell,
  Save,
  Check
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [restaurantName, setRestaurantName] = useState('जेवण फॅमिली रेस्टॉरंट');
  const [gstin, setGstin] = useState('27AABCT1234F1Z5');
  const [phone, setPhone] = useState('07969 223344');
  const [address, setAddress] = useState('Sinhagad Road, Pune, Maharashtra 411030');
  const [gstRate, setGstRate] = useState('5');
  const [serviceCharge, setServiceCharge] = useState('0');
  const [printerIp, setPrinterIp] = useState('192.168.1.100');
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#f7f4ed] rounded-2xl shadow-2xl border border-stone-300 z-10 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-950 px-5 py-3.5 text-white flex items-center justify-between border-b border-amber-400/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 border border-white/15">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                POS & Restaurant Settings
              </h3>
              <p className="text-xs text-amber-200/80">
                System configuration & printer preferences
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Restaurant Profile */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-maroon-900 uppercase tracking-wider">
              <Store className="w-4 h-4 text-maroon-800" />
              <span>Restaurant Identity</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Restaurant Name</label>
                <input
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-maroon-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-maroon-800 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">Helpline / Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-maroon-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">Outlet Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-maroon-800 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Taxation & Charges */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-maroon-900 uppercase tracking-wider">
              <Receipt className="w-4 h-4 text-maroon-800" />
              <span>Taxation & Billing Rates</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">GST Rate (%)</label>
                <input
                  type="number"
                  value={gstRate}
                  onChange={(e) => setGstRate(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-maroon-800 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">Service Charge (%)</label>
                <input
                  type="number"
                  value={serviceCharge}
                  onChange={(e) => setServiceCharge(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-maroon-800 font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Hardware & Preferences */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-maroon-900 uppercase tracking-wider">
              <Printer className="w-4 h-4 text-maroon-800" />
              <span>Hardware & Notification Audio</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Kitchen / Bill Thermal Printer IP</label>
                <input
                  type="text"
                  value={printerIp}
                  onChange={(e) => setPrinterIp(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-maroon-800 font-mono font-bold"
                />
              </div>

              <label className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-200 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-stone-600" />
                  <span className="font-semibold text-stone-800">Play Audio Bell on Incoming KOT & Orders</span>
                </div>
                <input
                  type="checkbox"
                  checked={soundAlerts}
                  onChange={(e) => setSoundAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-maroon-800 focus:ring-maroon-800"
                />
              </label>
            </div>
          </div>

          {/* Save Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-maroon-800 hover:bg-maroon-900 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};


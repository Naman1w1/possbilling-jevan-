import React, { useState } from 'react';
import logoUrl from '../assets/logo.png';
import { X, QrCode, Download, Share2, Smartphone } from 'lucide-react';
import { Table } from '../types/pos';

interface ContactlessModalProps {
  isOpen: boolean;
  onClose: () => void;
  tables: Table[];
}

export const ContactlessModal: React.FC<ContactlessModalProps> = ({
  isOpen,
  onClose,
  tables
}) => {
  if (!isOpen) return null;

  const [selectedTable, setSelectedTable] = useState<string>('A1');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#fcfaf7] w-full max-w-md rounded-2xl shadow-2xl border border-amber-900/20 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-maroon-900 to-maroon-800 text-white px-5 py-3.5 flex items-center justify-between border-b border-amber-400/20">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-white" />
            <h3 className="font-display font-bold text-base text-white">Contactless Table QR Code</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">
              Select Dining Table:
            </label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="p-2 text-xs font-bold bg-white border border-stone-300 rounded-lg focus:border-maroon-800"
            >
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  Table {t.id} ({t.zone})
                </option>
              ))}
            </select>
          </div>

          {/* QR Standee Card Mockup */}
          <div className="p-5 bg-white border-2 border-stone-200 rounded-2xl shadow-sm max-w-xs mx-auto space-y-3">
            <img
              src={logoUrl}
              alt="Logo"
              className="h-9 w-auto mx-auto object-contain"
            />
            <div className="text-xs font-display font-bold text-maroon-900">
              जेवण फॅमिली रेस्टॉरंट
            </div>
            
            <div className="w-40 h-40 mx-auto p-2 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-center">
              {/* Standee QR code vector */}
              <svg viewBox="0 0 100 100" className="w-full h-full text-stone-900">
                <rect width="100" height="100" fill="#fff" />
                <rect x="8" y="8" width="28" height="28" fill="#521317" />
                <rect x="12" y="12" width="20" height="20" fill="#fff" />
                <rect x="16" y="16" width="12" height="12" fill="#521317" />

                <rect x="64" y="8" width="28" height="28" fill="#521317" />
                <rect x="68" y="12" width="20" height="20" fill="#fff" />
                <rect x="72" y="16" width="12" height="12" fill="#521317" />

                <rect x="8" y="64" width="28" height="28" fill="#521317" />
                <rect x="12" y="68" width="20" height="20" fill="#fff" />
                <rect x="16" y="72" width="12" height="12" fill="#521317" />

                <rect x="42" y="16" width="10" height="18" fill="#521317" />
                <rect x="44" y="44" width="14" height="14" fill="#521317" />
                <rect x="64" y="44" width="16" height="8" fill="#521317" />
                <rect x="76" y="58" width="14" height="16" fill="#521317" />
                <rect x="42" y="72" width="12" height="18" fill="#521317" />
              </svg>
            </div>

            <div className="bg-amber-50 py-1 px-3 rounded-lg border border-amber-200 inline-block font-mono font-bold text-xs text-maroon-900">
              TABLE {selectedTable}
            </div>

            <p className="text-[11px] text-stone-500 flex items-center justify-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-stone-400" />
              Scan with smartphone camera to view digital menu & place direct order
            </p>
          </div>

          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={() => alert(`Standee for Table ${selectedTable} downloaded!`)}
              className="btn-premium-maroon px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-md"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Download Standee PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

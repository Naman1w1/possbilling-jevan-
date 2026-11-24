import React from 'react';
import logoUrl from '../assets/logo.png';
import { X, Printer, CheckCircle, Download } from 'lucide-react';
import { Table } from '../types/pos';

interface PrintBillModalProps {
  table: Table | null;
  onClose: () => void;
}

export const PrintBillModal: React.FC<PrintBillModalProps> = ({ table, onClose }) => {
  if (!table) return null;

  const subtotal = table.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const cgst = subtotal * 0.025;
  const sgst = subtotal * 0.025;
  const grandTotal = Math.round(subtotal + cgst + sgst);
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-stone-300 flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-stone-100 px-4 py-3 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-maroon-900" />
            <h3 className="font-display font-bold text-sm text-stone-800">
              Tax Invoice / Bill Preview (Table {table.id})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-200 text-stone-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thermal Bill Content */}
        <div className="p-6 bg-white overflow-y-auto max-h-[70vh] font-mono text-xs text-stone-900 select-all print:p-0">
          <div className="border border-dashed border-stone-300 p-4 rounded-lg bg-[#fffdfa] shadow-inner space-y-3">
            
            {/* Header / Logo */}
            <div className="text-center space-y-1">
              <img
                src={logoUrl}
                alt="जेवण फॅमिली रेस्टॉरंट"
                className="h-10 w-auto mx-auto object-contain mb-1"
              />
              <p className="font-sans font-bold text-sm text-maroon-900">जेवण फॅमिली रेस्टॉरंट</p>
              <p className="text-[10px] text-stone-600">Pure Maharashtrian & Multi-Cuisine Dining</p>
              <p className="text-[10px] text-stone-500">FC Road, Shivajinagar, Pune - 411005</p>
              <p className="text-[10px] text-stone-500">Tel: 07969 223344 • GSTIN: 27AABCT8192K1Z9</p>
              <p className="text-[10px] text-stone-500">FSSAI Lic: 11521034000412</p>
            </div>

            <div className="border-t border-dashed border-stone-400 my-2" />

            {/* Bill Details */}
            <div className="grid grid-cols-2 text-[11px] gap-y-0.5">
              <div><span className="text-stone-500">Bill No:</span> <strong className="font-bold">{table.billNo || 'B-1042'}</strong></div>
              <div className="text-right"><span className="text-stone-500">Table:</span> <strong className="font-bold">{table.id} ({table.zone})</strong></div>
              <div><span className="text-stone-500">Date:</span> {dateStr}</div>
              <div className="text-right"><span className="text-stone-500">Time:</span> {timeStr}</div>
              <div><span className="text-stone-500">KOT No:</span> {table.kotNo || 'KOT-408'}</div>
              <div className="text-right"><span className="text-stone-500">Captain:</span> {table.serverName || 'Ramesh K.'}</div>
            </div>

            <div className="border-t border-dashed border-stone-400 my-2" />

            {/* Items Table */}
            <div>
              <div className="flex justify-between font-bold text-[11px] pb-1 border-b border-stone-300">
                <span className="w-1/2">Item</span>
                <span className="w-12 text-center">Qty</span>
                <span className="w-14 text-right">Rate</span>
                <span className="w-16 text-right">Amount</span>
              </div>

              <div className="divide-y divide-stone-100 py-1 space-y-1">
                {table.items.map((it) => (
                  <div key={it.id} className="flex justify-between items-baseline text-[11px] pt-1">
                    <span className="w-1/2 truncate font-sans font-medium text-stone-800">
                      {it.name}
                    </span>
                    <span className="w-12 text-center">{it.quantity}</span>
                    <span className="w-14 text-right">₹{it.price}</span>
                    <span className="w-16 text-right font-bold">₹{it.price * it.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-dashed border-stone-400 my-2" />

            {/* Totals */}
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>CGST (2.5%):</span>
                <span>₹{cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>SGST (2.5%):</span>
                <span>₹{sgst.toFixed(2)}</span>
              </div>
              <div className="border-t border-stone-800 pt-1 flex justify-between font-bold text-sm text-stone-900">
                <span>NET TOTAL:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-stone-400 my-2" />

            {/* UPI QR Code Mock */}
            <div className="text-center space-y-1 pt-1">
              <div className="w-24 h-24 mx-auto p-1.5 bg-white border border-stone-300 rounded flex items-center justify-center">
                {/* SVG mock QR code */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect width="100" height="100" fill="#fff" />
                  <rect x="10" y="10" width="25" height="25" fill="#000" />
                  <rect x="15" y="15" width="15" height="15" fill="#fff" />
                  <rect x="18" y="18" width="9" height="9" fill="#000" />

                  <rect x="65" y="10" width="25" height="25" fill="#000" />
                  <rect x="70" y="15" width="15" height="15" fill="#fff" />
                  <rect x="73" y="18" width="9" height="9" fill="#000" />

                  <rect x="10" y="65" width="25" height="25" fill="#000" />
                  <rect x="15" y="70" width="15" height="15" fill="#fff" />
                  <rect x="18" y="73" width="9" height="9" fill="#000" />

                  <rect x="42" y="20" width="8" height="16" fill="#000" />
                  <rect x="52" y="32" width="6" height="8" fill="#000" />
                  <rect x="42" y="45" width="16" height="16" fill="#000" />
                  <rect x="65" y="55" width="20" height="8" fill="#000" />
                  <rect x="45" y="72" width="12" height="18" fill="#000" />
                  <rect x="70" y="72" width="18" height="14" fill="#000" />
                </svg>
              </div>
              <p className="text-[10px] text-stone-500 font-sans">Scan with GPay / PhonePe / Paytm</p>
              <p className="font-marathi font-bold text-xs text-maroon-900 pt-1">
                धन्यवाद! पुन्हा अवश्य या!
              </p>
            </div>

          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="bg-stone-50 px-4 py-3 border-t border-stone-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-200"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="btn-premium-maroon px-4 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-white" />
            <span>Print Receipt</span>
          </button>
        </div>

      </div>
    </div>
  );
};

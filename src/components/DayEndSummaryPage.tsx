import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  TrendingUp,
  XCircle,
  Gift,
  RotateCcw,
  Clock,
  FileSpreadsheet,
  CreditCard,
  Banknote,
  Printer,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

interface DayEndSummaryPageProps {
  onBack: () => void;
}

export const DayEndSummaryPage: React.FC<DayEndSummaryPageProps> = ({ onBack }) => {
  // Step in workflow: 'overview' | 'cash' | 'finalize'
  const [activeStep, setActiveStep] = useState<'overview' | 'cash' | 'finalize'>('overview');

  // Cash Denominations
  const [denominations, setDenominations] = useState<{ [key: number]: number }>({
    500: 32, // 16,000
    200: 8,  // 1,600
    100: 7,  // 700
    50: 2,   // 100
    20: 1,   // 20
    10: 0,   // 0
  });
  const [coins, setCoins] = useState<number>(0);
  const [managerRemarks, setManagerRemarks] = useState<string>('Day closed successfully without cash discrepancy.');
  const [isConfirmed, setIsConfirmed] = useState<boolean>(true);
  const [isFinalized, setIsFinalized] = useState<boolean>(false);

  // Total calculated counted cash
  const countedCash = Object.entries(denominations).reduce(
    (sum, [denom, count]) => sum + Number(denom) * (Number(count) || 0),
    0
  ) + (Number(coins) || 0);

  const systemExpectedCash = 18420.00;
  const difference = countedCash - systemExpectedCash;

  const handleDenomChange = (denom: number, value: string) => {
    const val = parseInt(value, 10);
    setDenominations((prev) => ({
      ...prev,
      [denom]: isNaN(val) ? 0 : Math.max(0, val),
    }));
  };

  const handleFinalize = () => {
    setIsFinalized(true);
    alert('Day End Finalized successfully!\nShift closed. Daily sales report sent to management.');
    onBack();
  };

  return (
    <div className="flex-1 flex flex-col bg-[#fdfaf6] h-[calc(100vh-56px)] overflow-y-auto select-none text-stone-800 font-sans p-4 sm:p-6">
      
      {/* ========================================================= */}
      {/* TOP HEADER matching Image 4                               */}
      {/* Day End Summary | Date & Invoice Range | [ ← Back ]       */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-[#ded5c2] rounded-xl px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs flex-shrink-0 flex-wrap gap-2 mb-4">
        
        {/* Left Title */}
        <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
          Day End Summary
        </h2>

        {/* Center: Date & Time + Invoice Range matching Image 4 */}
        <div className="flex items-center gap-2 text-xs font-bold text-stone-700 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
          <Calendar className="w-4 h-4 text-[#731b21]" />
          <span>2026-11-06 | 17:19:32</span>
          <span className="text-stone-400">·</span>
          <span className="text-[#731b21]">(Invoice Range : 7 - 330)</span>
        </div>

        {/* Right Back Button */}
        <button
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-md border border-[#731b21] bg-white hover:bg-stone-50 text-[#731b21] text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#731b21]" />
          <span>Back</span>
        </button>

      </div>

      {/* ========================================================= */}
      {/* BREADCRUMB STEPS matching Image 4                         */}
      {/* Day End Overview > Cash Calculations > Finalize Day-End   */}
      {/* ========================================================= */}
      <div className="bg-white border border-[#ded5c2] rounded-xl px-4 sm:px-6 py-2.5 flex items-center gap-3 text-xs font-bold flex-shrink-0 mb-5 shadow-2xs">
        <button
          onClick={() => setActiveStep('overview')}
          className={`cursor-pointer pb-1 relative transition-colors ${
            activeStep === 'overview'
              ? 'text-[#731b21]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>Day End Overview</span>
          {activeStep === 'overview' && (
            <span className="absolute -bottom-2.5 left-0 right-0 h-0.75 bg-[#731b21] rounded-t-full" />
          )}
        </button>

        <ChevronRight className="w-4 h-4 text-stone-300" />

        <button
          onClick={() => setActiveStep('cash')}
          className={`cursor-pointer pb-1 relative transition-colors ${
            activeStep === 'cash'
              ? 'text-[#731b21]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>Cash Calculations</span>
          {activeStep === 'cash' && (
            <span className="absolute -bottom-2.5 left-0 right-0 h-0.75 bg-[#731b21] rounded-t-full" />
          )}
        </button>

        <ChevronRight className="w-4 h-4 text-stone-300" />

        <button
          onClick={() => setActiveStep('finalize')}
          className={`cursor-pointer pb-1 relative transition-colors ${
            activeStep === 'finalize'
              ? 'text-[#731b21]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>Finalize Day-End</span>
          {activeStep === 'finalize' && (
            <span className="absolute -bottom-2.5 left-0 right-0 h-0.75 bg-[#731b21] rounded-t-full" />
          )}
        </button>
      </div>

      {/* ========================================================= */}
      {/* STEP 1: DAY END OVERVIEW (8 CARDS matching Image 4)       */}
      {/* ========================================================= */}
      {activeStep === 'overview' && (
        <div className="space-y-6 flex-1">
          {/* 8 Metric Cards Grid in 2 rows of 4 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Success Orders */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
              <div className="text-center font-bold text-stone-700 text-xs sm:text-sm">
                Success Orders
              </div>
              <div className="text-center my-3 text-lg sm:text-xl font-extrabold font-mono text-stone-900">
                ₹ 26356.00
              </div>
              <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100 font-medium">
                <span>No of orders: 24</span>
                <span className="text-rose-700 text-sm font-bold">→</span>
              </div>
            </div>

            {/* 2. Cancelled Orders */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
              <div className="text-center font-bold text-stone-700 text-xs sm:text-sm">
                Cancelled Orders
              </div>
              <div className="text-center my-3 text-lg sm:text-xl font-extrabold font-mono text-stone-900">
                ₹ 0.00
              </div>
              <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100 font-medium">
                <span>No of orders: 0</span>
                <span className="text-rose-700 text-sm font-bold">→</span>
              </div>
            </div>

            {/* 3. Complimentary Orders */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
              <div className="text-center font-bold text-stone-700 text-xs sm:text-sm">
                Complimentary Orders
              </div>
              <div className="text-center my-3 text-lg sm:text-xl font-extrabold font-mono text-stone-900">
                ₹ 0.00
              </div>
              <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100 font-medium">
                <span>No of orders: 0</span>
                <span className="text-rose-700 text-sm font-bold">→</span>
              </div>
            </div>

            {/* 4. Sales Return Orders */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
              <div className="text-center font-bold text-stone-700 text-xs sm:text-sm">
                Sales Return Orders
              </div>
              <div className="text-center my-3 text-lg sm:text-xl font-extrabold font-mono text-stone-900">
                ₹ 90.00
              </div>
              <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100 font-medium">
                <span>No of orders: 1</span>
                <span className="text-rose-700 text-sm font-bold">→</span>
              </div>
            </div>

            {/* 5. Success Advance Orders */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
              <div className="text-center font-bold text-stone-700 text-xs sm:text-sm">
                Success Advance Orders
              </div>
              <div className="text-center my-3 text-lg sm:text-xl font-extrabold font-mono text-stone-900">
                ₹ 0.00
              </div>
              <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100 font-medium">
                <span>No of orders: 0</span>
              </div>
            </div>

            {/* 6. Memo Advance Orders */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
              <div className="text-center font-bold text-stone-700 text-xs sm:text-sm">
                Memo Advance Orders
              </div>
              <div className="text-center my-3 text-lg sm:text-xl font-extrabold font-mono text-stone-900">
                ₹ 0.00
              </div>
              <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100 font-medium">
                <span>No of orders: 0</span>
              </div>
            </div>

            {/* 7. Order Payment Details */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
              <div className="text-center font-bold text-stone-700 text-xs sm:text-sm">
                Order Payment Details
              </div>
              <div className="text-center my-3 text-lg sm:text-xl font-extrabold font-mono text-stone-900">
                ₹ 26356.00
              </div>
              <div className="text-[10px] text-stone-500 pt-2 border-t border-stone-100 flex items-center justify-around font-medium">
                <span>Cash: ₹18.4K</span>
                <span>UPI: ₹6.5K</span>
                <span>Card: ₹1.4K</span>
              </div>
            </div>

            {/* 8. Payment Information */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
              <div className="text-center font-bold text-stone-700 text-xs sm:text-sm">
                Payment Information
              </div>
              <div className="text-center my-3 text-lg sm:text-xl font-extrabold font-mono text-stone-900">
                ₹ 26356.00
              </div>
              <div className="text-[10px] text-stone-500 pt-2 border-t border-stone-100 flex items-center justify-between font-medium">
                <span>Settled: ₹26,356</span>
                <span className="text-emerald-700 font-bold">100% Cleared</span>
              </div>
            </div>

          </div>

          {/* Bottom Next Button matching Image 4 */}
          <div className="pt-4 border-t border-[#ded5c2] flex items-center justify-end">
            <button
              onClick={() => setActiveStep('cash')}
              className="px-6 py-2 rounded-lg bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-bold tracking-wide shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4 text-[#fdfaf6]" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 2: CASH CALCULATIONS                                 */}
      {/* ========================================================= */}
      {activeStep === 'cash' && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-6 flex-1">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-stone-900">
              Cash Drawer Denomination Counter
            </h3>
            <p className="text-xs text-stone-500">
              Count physical cash notes in drawer and enter quantities to verify against system sales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Denomination Table */}
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#ede8dd] text-stone-800 font-bold border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-3">Note Denomination</th>
                    <th className="py-2.5 px-3 text-center">Count</th>
                    <th className="py-2.5 px-3 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {[500, 200, 100, 50, 20, 10].map((denom) => {
                    const count = denominations[denom] || 0;
                    const rowTotal = denom * count;
                    return (
                      <tr key={denom} className="hover:bg-stone-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-stone-900">
                          ₹ {denom}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            value={count}
                            onChange={(e) => handleDenomChange(denom, e.target.value)}
                            className="w-20 px-2 py-1 text-center bg-stone-50 border border-stone-300 rounded font-mono font-bold text-xs focus:outline-none focus:border-[#731b21]"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold">
                          ₹ {rowTotal.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="hover:bg-stone-50">
                    <td className="py-2.5 px-3 font-bold text-stone-900">Coins Total</td>
                    <td className="py-2.5 px-3 text-center">—</td>
                    <td className="py-2.5 px-3 text-right">
                      <input
                        type="number"
                        min="0"
                        value={coins}
                        onChange={(e) => setCoins(parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1 text-right bg-stone-50 border border-stone-300 rounded font-mono font-bold text-xs focus:outline-none focus:border-[#731b21]"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Reconciliation Summary Card */}
            <div className="bg-[#fdfaf6] border border-[#ded5c2] p-5 rounded-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="font-bold text-stone-800 text-xs sm:text-sm border-b border-stone-200 pb-2">
                  Cash Reconciliation
                </h4>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600 font-semibold">Physical Counted Cash:</span>
                  <span className="font-mono font-bold text-stone-900">₹ {countedCash.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600 font-semibold">System Expected Cash:</span>
                  <span className="font-mono font-bold text-stone-900">₹ {systemExpectedCash.toFixed(2)}</span>
                </div>

                <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-sm">
                  <span className="font-bold text-stone-800">Difference:</span>
                  <span
                    className={`font-mono font-black ${
                      difference === 0
                        ? 'text-emerald-700'
                        : difference > 0
                        ? 'text-blue-700'
                        : 'text-rose-700'
                    }`}
                  >
                    {difference === 0
                      ? '₹ 0.00 (Balanced ✓)'
                      : difference > 0
                      ? `+₹ ${difference.toFixed(2)} (Excess)`
                      : `-₹ ${Math.abs(difference).toFixed(2)} (Shortage)`}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200 text-[11px] text-stone-600">
                Opening Cash Float: <span className="font-bold font-mono">₹ 2,000.00</span> · Today's Cash Sale: <span className="font-bold font-mono">₹ 18,420.00</span>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <button
              onClick={() => setActiveStep('overview')}
              className="px-4 py-2 rounded-lg text-xs font-semibold border border-stone-300 text-stone-700 hover:bg-stone-50 cursor-pointer"
            >
              ← Back to Overview
            </button>
            <button
              onClick={() => setActiveStep('finalize')}
              className="px-6 py-2 rounded-lg bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-bold tracking-wide shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Next: Finalize Day-End</span>
              <ChevronRight className="w-4 h-4 text-[#fdfaf6]" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 3: FINALIZE DAY-END                                  */}
      {/* ========================================================= */}
      {activeStep === 'finalize' && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-5 flex-1">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-stone-900">
              Finalize Day-End Shift Closure
            </h3>
            <p className="text-xs text-stone-500">
              Verify day end totals and perform shift close out. Once closed, invoice sequence resets for the next business day.
            </p>
          </div>

          {/* Summary Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
            <div>
              <span className="text-stone-500 block">Total Sales</span>
              <span className="text-base font-extrabold font-mono text-[#731b21]">₹ 26,356.00</span>
            </div>
            <div>
              <span className="text-stone-500 block">Total Orders</span>
              <span className="text-base font-extrabold font-mono text-stone-800">24 Bills (Range 7 - 330)</span>
            </div>
            <div>
              <span className="text-stone-500 block">Register Status</span>
              <span className="text-base font-extrabold font-mono text-emerald-700">Balanced &amp; Ready</span>
            </div>
          </div>

          {/* Manager Remarks */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block">
              Shift Closing Remarks:
            </label>
            <textarea
              rows={2}
              value={managerRemarks}
              onChange={(e) => setManagerRemarks(e.target.value)}
              className="w-full p-2.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] font-medium"
            />
          </div>

          {/* Verification Checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-stone-800 p-2 rounded-lg bg-amber-50/70 border border-amber-200">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="accent-[#731b21] w-4 h-4 cursor-pointer"
            />
            <span>I confirm that all active orders are settled, cash drawer is verified, and day-end report is generated.</span>
          </label>

          {/* Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between flex-wrap gap-2">
            <button
              onClick={() => setActiveStep('cash')}
              className="px-4 py-2 rounded-lg text-xs font-semibold border border-stone-300 text-stone-700 hover:bg-stone-50 cursor-pointer"
            >
              ← Back to Cash Calculations
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Printing Day End Z-Report on thermal receipt printer...')}
                className="px-4 py-2 rounded-lg text-xs font-bold border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-stone-700" />
                <span>Print Day End Report</span>
              </button>

              <button
                disabled={!isConfirmed}
                onClick={handleFinalize}
                className={`px-5 py-2 rounded-lg text-xs font-bold text-[#fdfaf6] shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-2 ${
                  isConfirmed
                    ? 'bg-[#731b21] hover:bg-[#5b1419]'
                    : 'bg-stone-400 opacity-60 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-[#fdfaf6]" />
                <span>Close Shift &amp; Finalize Day-End</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};


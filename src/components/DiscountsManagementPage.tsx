import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Plus,
  Percent,
  Tag,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  Clock,
  Sparkles,
  ShieldCheck,
  Check,
  DollarSign,
  ChevronDown,
  Sliders
} from 'lucide-react';
import { DiscountRule } from '../types/pos';
import { MOCK_DISCOUNT_RULES } from '../data/mockData';

interface DiscountsManagementPageProps {
  onBack: () => void;
  discountRules?: DiscountRule[];
  onUpdateDiscountRules?: (rules: DiscountRule[]) => void;
}

export const DiscountsManagementPage: React.FC<DiscountsManagementPageProps> = ({
  onBack,
  discountRules = MOCK_DISCOUNT_RULES,
  onUpdateDiscountRules,
}) => {
  const [discounts, setDiscounts] = useState<DiscountRule[]>(discountRules);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);

  // Modal states for Create & Edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingDiscount, setEditingDiscount] = useState<DiscountRule | null>(null);

  // Form Fields
  const [formName, setFormName] = useState<string>('');
  const [formCode, setFormCode] = useState<string>('');
  const [formType, setFormType] = useState<'percentage' | 'fixed'>('percentage');
  const [formValue, setFormValue] = useState<number>(10);
  const [formMinOrder, setFormMinOrder] = useState<number>(300);
  const [formMaxCap, setFormMaxCap] = useState<number>(200);
  const [formApplicability, setFormApplicability] = useState<string>('All');
  const [formValidityTime, setFormValidityTime] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formIsActive, setFormIsActive] = useState<boolean>(true);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenCreate = () => {
    setEditingDiscount(null);
    setFormName('');
    setFormCode('');
    setFormType('percentage');
    setFormValue(10);
    setFormMinOrder(300);
    setFormMaxCap(200);
    setFormApplicability('All');
    setFormValidityTime('');
    setFormDescription('');
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (disc: DiscountRule) => {
    setEditingDiscount(disc);
    setFormName(disc.name);
    setFormCode(disc.code);
    setFormType(disc.type);
    setFormValue(disc.value);
    setFormMinOrder(disc.minOrderAmount);
    setFormMaxCap(disc.maxDiscountCap || 0);
    setFormApplicability(disc.applicability);
    setFormValidityTime(disc.validityTime || '');
    setFormDescription(disc.description || '');
    setFormIsActive(disc.isActive);
    setIsModalOpen(true);
  };

  const handleSaveDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Please enter a discount program name.');
      return;
    }

    if (editingDiscount) {
      const updated = discounts.map((d) =>
        d.id === editingDiscount.id
          ? {
              ...d,
              name: formName.trim(),
              code: formCode.trim().toUpperCase() || d.code,
              type: formType,
              value: Number(formValue),
              minOrderAmount: Number(formMinOrder),
              maxDiscountCap: formMaxCap > 0 ? Number(formMaxCap) : undefined,
              applicability: formApplicability,
              validityTime: formValidityTime.trim() || undefined,
              description: formDescription.trim() || undefined,
              isActive: formIsActive,
            }
          : d
      );
      setDiscounts(updated);
      if (onUpdateDiscountRules) onUpdateDiscountRules(updated);
      showToast(`Discount "${formName}" updated successfully!`);
    } else {
      const newDisc: DiscountRule = {
        id: `disc-${Date.now()}`,
        name: formName.trim(),
        code: formCode.trim().toUpperCase() || `OFF-${Math.floor(10 + Math.random() * 90)}`,
        type: formType,
        value: Number(formValue),
        minOrderAmount: Number(formMinOrder),
        maxDiscountCap: formMaxCap > 0 ? Number(formMaxCap) : undefined,
        applicability: formApplicability,
        validityTime: formValidityTime.trim() || undefined,
        description: formDescription.trim() || undefined,
        isActive: formIsActive,
      };
      const updated = [newDisc, ...discounts];
      setDiscounts(updated);
      if (onUpdateDiscountRules) onUpdateDiscountRules(updated);
      showToast(`Discount "${newDisc.name}" created successfully!`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteDiscount = (disc: DiscountRule) => {
    if (confirm(`Are you sure you want to delete discount rule "${disc.name}"?`)) {
      const updated = discounts.filter((d) => d.id !== disc.id);
      setDiscounts(updated);
      if (onUpdateDiscountRules) onUpdateDiscountRules(updated);
      showToast(`Deleted discount rule "${disc.name}".`);
    }
  };

  const handleToggleActive = (discId: string) => {
    const updated = discounts.map((d) =>
      d.id === discId ? { ...d, isActive: !d.isActive } : d
    );
    setDiscounts(updated);
    if (onUpdateDiscountRules) onUpdateDiscountRules(updated);
  };

  // Filtered dataset
  const filteredDiscounts = discounts.filter((d) => {
    if (selectedFilter !== 'All') {
      if (selectedFilter === 'Active' && !d.isActive) return false;
      if (selectedFilter === 'Inactive' && d.isActive) return false;
      if (selectedFilter === 'Percentage' && d.type !== 'percentage') return false;
      if (selectedFilter === 'Flat' && d.type !== 'fixed') return false;
      if (selectedFilter === 'Dine In' && !d.applicability.toLowerCase().includes('dine in') && d.applicability !== 'All Orders') return false;
      if (selectedFilter === 'Delivery' && !d.applicability.toLowerCase().includes('delivery') && d.applicability !== 'All Orders') return false;
      if (selectedFilter === 'Takeaway' && !d.applicability.toLowerCase().includes('takeaway') && d.applicability !== 'All Orders') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = d.name.toLowerCase().includes(q);
      const matchCode = d.code.toLowerCase().includes(q);
      const matchApp = d.applicability.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchApp) return false;
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#fdfaf6] h-[calc(100vh-56px)] overflow-hidden select-none text-stone-800 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-5 z-50 bg-[#731b21] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-maroon-600 animate-slideIn">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. TOP HEADER                                             */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-[#ded5c2] px-4 sm:px-6 py-2.5 flex items-center justify-between flex-shrink-0 shadow-2xs">
        <div className="flex items-center">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
            Discount & Coupon Rules
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCreate}
            className="px-2.5 py-1 rounded-md bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-semibold transition-all shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#fdfaf6]" />
            <span>Add Discount</span>
          </button>

          <button
            onClick={onBack}
            className="px-2.5 py-1 rounded-md border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-all shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-stone-700" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. SUB-BAR: SEARCH & FILTER (SEARCH ON LEFT SIDE)         */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-[#ded5c2] px-4 sm:px-6 py-2 flex items-center justify-between gap-2.5 flex-shrink-0">
        
        {/* Search Bar - Positioned on Left Side */}
        <div className="relative w-52 sm:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discount..."
            className="w-full pl-8 pr-2.5 py-1 text-xs bg-stone-50 hover:bg-white focus:bg-white border border-stone-300 rounded-md focus:outline-none focus:border-[#731b21] font-medium transition-all"
          />
        </div>

        {/* Filter Option on Right Side */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedFilter !== 'All'
                ? 'bg-amber-50 border-amber-300 text-[#731b21] font-bold shadow-2xs'
                : 'bg-white hover:bg-stone-50 border-stone-300 text-stone-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-stone-500" />
            <span>Filter{selectedFilter !== 'All' ? `: ${selectedFilter}` : ''}</span>
            <ChevronDown className="w-3 h-3 text-stone-400" />
          </button>

          {isFilterDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsFilterDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-xl border border-stone-200 py-1 z-30 animate-fadeIn text-xs">
                <div className="px-3 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100">
                  Filter by Status & Type
                </div>
                {[
                  { id: 'All', label: 'All Discounts' },
                  { id: 'Active', label: 'Active Only' },
                  { id: 'Inactive', label: 'Inactive Only' },
                  { id: 'Percentage', label: 'Percentage (%)' },
                  { id: 'Flat', label: 'Flat (₹)' },
                  { id: 'Dine In', label: 'Dine In Only' },
                  { id: 'Delivery', label: 'Delivery Only' },
                  { id: 'Takeaway', label: 'Takeaway Only' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSelectedFilter(opt.id);
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer ${
                      selectedFilter === opt.id
                        ? 'font-bold text-[#731b21] bg-red-50/50'
                        : 'text-stone-700'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {selectedFilter === opt.id && (
                      <Check className="w-3.5 h-3.5 text-[#731b21]" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN DISCOUNTS TABLE                                   */}
      {/* ========================================================= */}
      <div className="flex-1 overflow-auto bg-white min-h-0">
        {filteredDiscounts.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center text-stone-500">
            <Tag className="w-8 h-8 text-stone-300 mb-2" />
            <p className="text-sm font-bold text-stone-700">No discount programs match your search</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#ede8dd] text-stone-800 font-bold uppercase tracking-wider text-[11px] sticky top-0 z-10 border-b border-[#ded5c2]">
              <tr>
                <th className="py-2.5 px-3 border-r border-[#ded5c2]">Offer Name</th>
                <th className="py-2.5 px-3 border-r border-[#ded5c2]">Coupon Code</th>
                <th className="py-2.5 px-3 border-r border-[#ded5c2] text-center">Discount Value</th>
                <th className="py-2.5 px-3 border-r border-[#ded5c2]">Specific Applicability</th>
                <th className="py-2.5 px-3 border-r border-[#ded5c2]">Min Bill / Max Cap</th>
                <th className="py-2.5 px-3 border-r border-[#ded5c2] text-center">Status</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredDiscounts.map((disc) => {
                const isSpecific = disc.applicability !== 'All';

                return (
                  <tr
                    key={disc.id}
                    className={`hover:bg-amber-50/40 transition-colors ${
                      !disc.isActive ? 'opacity-60 bg-stone-50' : ''
                    }`}
                  >
                    {/* Offer Name */}
                    <td className="py-3 px-3 border-r border-stone-200">
                      <div className="font-bold text-stone-900 text-[13px]">{disc.name}</div>
                      {disc.description && (
                        <div className="text-[11px] text-stone-500 mt-0.5">{disc.description}</div>
                      )}
                      {disc.validityTime && (
                        <div className="text-[10px] text-amber-800 font-medium mt-0.5 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-amber-600" />
                          <span>{disc.validityTime}</span>
                        </div>
                      )}
                    </td>

                    {/* Coupon Code */}
                    <td className="py-3 px-3 border-r border-stone-200">
                      <span className="font-mono font-black text-xs text-[#731b21] bg-rose-50 px-2 py-0.8 rounded border border-rose-200 shadow-2xs">
                        {disc.code}
                      </span>
                    </td>

                    {/* Value */}
                    <td className="py-3 px-3 border-r border-stone-200 text-center">
                      <span className="font-mono font-black text-sm text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                        {disc.type === 'percentage' ? `${disc.value}% OFF` : `₹${disc.value} FLAT`}
                      </span>
                    </td>

                    {/* Applicability */}
                    <td className="py-3 px-3 border-r border-stone-200">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.8 rounded-full text-xs font-bold border ${
                          isSpecific
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : 'bg-stone-100 text-stone-800 border-stone-300'
                        }`}
                      >
                        {disc.applicability}
                      </span>
                    </td>

                    {/* Min Bill / Max Cap */}
                    <td className="py-3 px-3 border-r border-stone-200 text-[11px] leading-tight">
                      <div>Min: <strong className="font-mono text-stone-800 font-bold">₹{disc.minOrderAmount}</strong></div>
                      {disc.maxDiscountCap ? (
                        <div className="text-stone-500">Cap: <strong className="font-mono text-stone-700">₹{disc.maxDiscountCap}</strong></div>
                      ) : (
                        <div className="text-stone-400">No Max Cap</div>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-3 border-r border-stone-200 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(disc.id)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                          disc.isActive
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${disc.isActive ? 'bg-emerald-600' : 'bg-stone-400'}`} />
                        <span>{disc.isActive ? 'Active' : 'Disabled'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(disc)}
                          className="p-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
                          title="Edit Discount"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#731b21]" />
                        </button>

                        <button
                          onClick={() => handleDeleteDiscount(disc)}
                          className="p-1.5 rounded-lg border border-stone-300 bg-white hover:bg-rose-50 text-rose-700 transition-colors cursor-pointer"
                          title="Delete Discount"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ========================================================= */}
      {/* 4. MODAL: ADD / EDIT DISCOUNT                             */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs select-none animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col animate-scaleUp">
            
            <div className="bg-[#ede8dd] px-5 py-3.5 border-b border-stone-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#731b21]" />
                <h3 className="font-bold text-sm text-stone-900">
                  {editingDiscount ? 'Edit Discount Rule' : 'Create New Discount Rule'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDiscount} className="p-5 space-y-4">
              
              {/* Discount Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">
                  Discount Offer Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. 10% Happy Hours, Weekend Special, Flat 100 Off"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] font-semibold text-stone-900"
                  required
                />
              </div>

              {/* Coupon Code & Value */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    placeholder="e.g. HAPPY10, FLAT100"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] font-mono font-bold uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">
                    Discount Value ({formType === 'percentage' ? '%' : '₹'}) <span className="text-rose-600">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="1"
                      min={0}
                      value={formValue}
                      onChange={(e) => setFormValue(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] font-mono font-bold text-stone-900"
                      required
                    />
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as any)}
                      className="px-2 py-2 text-xs bg-stone-100 border border-stone-300 rounded-lg font-bold"
                    >
                      <option value="percentage">% OFF</option>
                      <option value="fixed">₹ Flat</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Specific Applicability */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">
                  Set Discount for Specific (Applicability) <span className="text-rose-600">*</span>
                </label>
                <select
                  value={formApplicability}
                  onChange={(e) => setFormApplicability(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] font-semibold text-stone-900"
                >
                  <option value="All">All Orders & Channels</option>
                  <option value="Dine In">Dine In Tables Only</option>
                  <option value="Delivery">Delivery Orders Only</option>
                  <option value="Pick Up">Pick Up Orders Only</option>
                  <option value="Food Only">Food Category Items Only</option>
                  <option value="Beverages Only">Mocktails & Beverages Only</option>
                </select>
              </div>

              {/* Min Bill & Max Cap */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">
                    Min Order Bill (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formMinOrder}
                    onChange={(e) => setFormMinOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formMaxCap}
                    onChange={(e) => setFormMaxCap(Number(e.target.value))}
                    placeholder="0 for unlimited"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] font-mono"
                  />
                </div>
              </div>

              {/* Validity Slot */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">
                  Happy Hours / Day Validity Slot
                </label>
                <input
                  type="text"
                  value={formValidityTime}
                  onChange={(e) => setFormValidityTime(e.target.value)}
                  placeholder="e.g. 04:00 PM - 07:00 PM (Mon-Fri) or All Day"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21]"
                />
              </div>

              {/* Terms & Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">
                  Terms & Description
                </label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g. Applicable on food bill before taxes"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21]"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                <span className="text-xs font-bold text-stone-700">Discount Offer Active</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#731b21]"></div>
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-[#fdfaf6]" />
                  <span>{editingDiscount ? 'Update Discount' : 'Save Discount'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};


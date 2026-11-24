import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Plus,
  Percent,
  Edit2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  X,
  FileText,
  Sliders,
  DollarSign,
  ShieldCheck,
  Check,
  ToggleLeft,
  ToggleRight,
  ChevronDown
} from 'lucide-react';
import { TaxRule } from '../types/pos';
import { MOCK_TAX_RULES } from '../data/mockData';

interface TaxesManagementPageProps {
  onBack: () => void;
  taxRules?: TaxRule[];
  onUpdateTaxRules?: (rules: TaxRule[]) => void;
}

export const TaxesManagementPage: React.FC<TaxesManagementPageProps> = ({
  onBack,
  taxRules = MOCK_TAX_RULES,
  onUpdateTaxRules,
}) => {
  const [taxes, setTaxes] = useState<TaxRule[]>(taxRules);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);

  // Modal states for Create and Edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTax, setEditingTax] = useState<TaxRule | null>(null);

  // Form Fields
  const [formName, setFormName] = useState<string>('');
  const [formCode, setFormCode] = useState<string>('');
  const [formRate, setFormRate] = useState<number>(2.5);
  const [formType, setFormType] = useState<'percentage' | 'fixed'>('percentage');
  const [formApplicability, setFormApplicability] = useState<string>('All');
  const [formTaxNumber, setFormTaxNumber] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formIsActive, setFormIsActive] = useState<boolean>(true);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenCreate = () => {
    setEditingTax(null);
    setFormName('');
    setFormCode('');
    setFormRate(2.5);
    setFormType('percentage');
    setFormApplicability('All');
    setFormTaxNumber('GSTIN: 27AABCT8192K1Z9');
    setFormDescription('');
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tax: TaxRule) => {
    setEditingTax(tax);
    setFormName(tax.name);
    setFormCode(tax.code);
    setFormRate(tax.rate);
    setFormType(tax.type);
    setFormApplicability(tax.applicability);
    setFormTaxNumber(tax.taxNumber || '');
    setFormDescription(tax.description || '');
    setFormIsActive(tax.isActive);
    setIsModalOpen(true);
  };

  const handleSaveTax = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Please enter a tax name.');
      return;
    }

    if (editingTax) {
      // Update existing tax
      const updated = taxes.map((t) =>
        t.id === editingTax.id
          ? {
              ...t,
              name: formName.trim(),
              code: formCode.trim() || t.code,
              rate: Number(formRate),
              type: formType,
              applicability: formApplicability,
              taxNumber: formTaxNumber.trim() || undefined,
              description: formDescription.trim() || undefined,
              isActive: formIsActive,
            }
          : t
      );
      setTaxes(updated);
      if (onUpdateTaxRules) onUpdateTaxRules(updated);
      showToast(`Tax "${formName}" updated successfully!`);
    } else {
      // Create new tax
      const newTax: TaxRule = {
        id: `tax-${Date.now()}`,
        name: formName.trim(),
        code: formCode.trim() || `TAX-${Math.floor(100 + Math.random() * 900)}`,
        rate: Number(formRate),
        type: formType,
        applicability: formApplicability,
        taxNumber: formTaxNumber.trim() || undefined,
        description: formDescription.trim() || undefined,
        isActive: formIsActive,
      };
      const updated = [newTax, ...taxes];
      setTaxes(updated);
      if (onUpdateTaxRules) onUpdateTaxRules(updated);
      showToast(`Tax "${newTax.name}" added successfully!`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteTax = (tax: TaxRule) => {
    if (confirm(`Are you sure you want to delete "${tax.name}"? This action cannot be undone.`)) {
      const updated = taxes.filter((t) => t.id !== tax.id);
      setTaxes(updated);
      if (onUpdateTaxRules) onUpdateTaxRules(updated);
      showToast(`Deleted tax rule "${tax.name}".`);
    }
  };

  const handleToggleActive = (taxId: string) => {
    const updated = taxes.map((t) =>
      t.id === taxId ? { ...t, isActive: !t.isActive } : t
    );
    setTaxes(updated);
    if (onUpdateTaxRules) onUpdateTaxRules(updated);
  };

  // Filtered dataset
  const filteredTaxes = taxes.filter((t) => {
    if (selectedFilter !== 'All') {
      if (selectedFilter === 'Active' && !t.isActive) return false;
      if (selectedFilter === 'Inactive' && t.isActive) return false;
      if (selectedFilter === 'GST' && !t.name.toLowerCase().includes('gst')) return false;
      if (selectedFilter === 'Specific' && t.applicability === 'All') return false;
      if (selectedFilter === 'Food' && !t.applicability.toLowerCase().includes('food')) return false;
      if (selectedFilter === 'Alcohol' && !t.applicability.toLowerCase().includes('alcohol')) return false;
      if (selectedFilter === 'Dine In' && !t.applicability.toLowerCase().includes('dine in')) return false;
      if (selectedFilter === 'Delivery' && !t.applicability.toLowerCase().includes('delivery')) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = t.name.toLowerCase().includes(q);
      const matchCode = t.code.toLowerCase().includes(q);
      const matchApp = t.applicability.toLowerCase().includes(q);
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
            Taxation & GST Setup
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCreate}
            className="px-2.5 py-1 rounded-md bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-semibold transition-all shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#fdfaf6]" />
            <span>Add Tax</span>
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
            placeholder="Search tax rule..."
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

          {/* Dropdown Menu when clicked on filter showing all, active, inactive, and more */}
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
                  { id: 'All', label: 'All' },
                  { id: 'Active', label: 'Active' },
                  { id: 'Inactive', label: 'Inactive' },
                  { id: 'GST', label: 'GST Slabs' },
                  { id: 'Specific', label: 'Specific Applicability' },
                  { id: 'Food', label: 'Food Only' },
                  { id: 'Alcohol', label: 'Alcohol Only' },
                  { id: 'Dine In', label: 'Dine In Only' },
                  { id: 'Delivery', label: 'Delivery Only' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSelectedFilter(opt.id);
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer ${
                      selectedFilter === opt.id ? 'font-bold text-[#731b21] bg-red-50/50' : 'text-stone-700'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {selectedFilter === opt.id && <Check className="w-3.5 h-3.5 text-[#731b21]" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

      </div>

      {/* ========================================================= */}
      {/* 3. MAIN TAX RULES TABLE                                   */}
      {/* ========================================================= */}
      <div className="flex-1 overflow-auto bg-white min-h-0">
        {filteredTaxes.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center text-stone-500">
            <Percent className="w-8 h-8 text-stone-300 mb-2" />
            <p className="text-sm font-bold text-stone-700">No tax rules match your criteria</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#ede8dd] text-stone-800 font-bold uppercase tracking-wider text-[11px] sticky top-0 z-10 border-b border-[#ded5c2]">
              <tr>
                <th className="py-2.5 px-3 border-r border-[#ded5c2]">Tax Rule Name</th>
                <th className="py-2.5 px-3 border-r border-[#ded5c2]">Tax Code</th>
                <th className="py-2.5 px-3 border-r border-[#ded5c2] text-center">Tax Rate</th>
                <th className="py-2.5 px-3 border-r border-[#ded5c2]">Specific Applicability</th>
                <th className="py-2.5 px-3 border-r border-[#ded5c2]">Tax / GSTIN Number</th>
                <th className="py-2.5 px-3 border-r border-[#ded5c2] text-center">Status</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredTaxes.map((tax) => {
                const isSpecific = tax.applicability !== 'All';

                return (
                  <tr
                    key={tax.id}
                    className={`hover:bg-amber-50/40 transition-colors ${
                      !tax.isActive ? 'opacity-60 bg-stone-50' : ''
                    }`}
                  >
                    {/* Tax Name & Description */}
                    <td className="py-3 px-3 border-r border-stone-200">
                      <div className="font-bold text-stone-900 text-[13px]">{tax.name}</div>
                      {tax.description && (
                        <div className="text-[11px] text-stone-500 mt-0.5">{tax.description}</div>
                      )}
                    </td>

                    {/* Tax Code */}
                    <td className="py-3 px-3 border-r border-stone-200 font-mono font-bold text-stone-700">
                      {tax.code}
                    </td>

                    {/* Rate & Type */}
                    <td className="py-3 px-3 border-r border-stone-200 text-center">
                      <span className="font-mono font-black text-sm text-[#731b21] bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
                        {tax.type === 'percentage' ? `${tax.rate}%` : `₹${tax.rate}`}
                      </span>
                    </td>

                    {/* Specific Applicability */}
                    <td className="py-3 px-3 border-r border-stone-200">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.8 rounded-full text-xs font-bold border ${
                          isSpecific
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        }`}
                      >
                        <span>{tax.applicability}</span>
                        {tax.specificCategory && (
                          <span className="text-[10px] opacity-80">({tax.specificCategory})</span>
                        )}
                      </span>
                    </td>

                    {/* GSTIN / Number */}
                    <td className="py-3 px-3 border-r border-stone-200 font-mono text-[11px] text-stone-600">
                      {tax.taxNumber || '—'}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-3 border-r border-stone-200 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(tax.id)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                          tax.isActive
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${tax.isActive ? 'bg-emerald-600' : 'bg-stone-400'}`} />
                        <span>{tax.isActive ? 'Active' : 'Disabled'}</span>
                      </button>
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(tax)}
                          className="p-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
                          title="Edit Tax Details"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#731b21]" />
                        </button>

                        <button
                          onClick={() => handleDeleteTax(tax)}
                          className="p-1.5 rounded-lg border border-stone-300 bg-white hover:bg-rose-50 text-rose-700 transition-colors cursor-pointer"
                          title="Delete Tax Rule"
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
      {/* 4. MODAL: ADD / EDIT TAX RULE                             */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs select-none animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col animate-scaleUp">
            
            <div className="bg-[#ede8dd] px-5 py-3.5 border-b border-stone-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-[#731b21]" />
                <h3 className="font-bold text-sm text-stone-900">
                  {editingTax ? 'Edit Tax Rule' : 'Add New Tax Rule'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTax} className="p-5 space-y-4">
              
              {/* Tax Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">
                  Tax Rule Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. CGST, SGST, Alcohol VAT, Service Charge"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] font-semibold text-stone-900"
                  required
                />
              </div>

              {/* Tax Code & Rate */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">
                    Tax Code
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    placeholder="e.g. CGST-2.5, VAT-10"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] font-mono font-bold uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">
                    Tax Rate ({formType === 'percentage' ? '%' : '₹'}) <span className="text-rose-600">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      value={formRate}
                      onChange={(e) => setFormRate(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] font-mono font-bold text-stone-900"
                      required
                    />
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as any)}
                      className="px-2 py-2 text-xs bg-stone-100 border border-stone-300 rounded-lg font-bold"
                    >
                      <option value="percentage">%</option>
                      <option value="fixed">₹ Fixed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Specific Applicability */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">
                  Set Tax for Specific (Applicability) <span className="text-rose-600">*</span>
                </label>
                <select
                  value={formApplicability}
                  onChange={(e) => setFormApplicability(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] font-semibold text-stone-900"
                >
                  <option value="All">All Items & Orders (Standard GST)</option>
                  <option value="Food">Food Items Only</option>
                  <option value="Beverages">Beverages & Soft Drinks Only</option>
                  <option value="Alcohol">Alcohol & Bar Beverages (Excise VAT)</option>
                  <option value="Dine In">Dine In Tables Only (Service Charge)</option>
                  <option value="Delivery">Delivery Orders Only (Packaging Fee)</option>
                  <option value="Pick Up">Pick Up Orders Only</option>
                </select>
              </div>

              {/* GSTIN / Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">
                  Tax Number / GSTIN (Print on Invoices)
                </label>
                <input
                  type="text"
                  value={formTaxNumber}
                  onChange={(e) => setFormTaxNumber(e.target.value)}
                  placeholder="e.g. GSTIN: 27AABCT8192K1Z9"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] font-mono"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">
                  Description / Legal Citation
                </label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g. Central GST applicable under restaurant category"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21]"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                <span className="text-xs font-bold text-stone-700">Tax Rule Active</span>
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

              {/* Action Buttons */}
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
                  <span>{editingTax ? 'Update Tax' : 'Save Tax'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};


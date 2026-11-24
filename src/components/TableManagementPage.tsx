import React, { useState, useMemo } from 'react';
import { Table, OrderItem, Floor, ZoneId } from '../types/pos';

interface TableManagementPageProps {
  tables: Table[];
  onBack: () => void;
  onNavigateToBilling: (table?: Table) => void;
  onUpdateTables?: (tables: Table[]) => void;
  onPrintBill?: (table: Table) => void;
}

export type DateFilterPeriod = 'today' | 'yesterday' | '7days' | '1month' | '6months' | 'custom';

interface TableKotRecord {
  id: string;
  tableId: string;
  floorZone: string;
  kotNo: string;
  billNo: string;
  seatedAt: string;
  dateIso: string;
  periodCategory: DateFilterPeriod;
  serverName: string;
  amount: number;
  guests: number;
  customerName?: string;
  customerPhone?: string;
  customerLocation?: string;
  orderType?: 'Dine In' | 'Delivery' | 'Pick Up';
  items: OrderItem[];
}

const INITIAL_FLOORS: Floor[] = [
  { id: 'AC', name: 'AC Hall', code: 'A', type: 'Indoor AC', description: 'Central air-conditioned family dining area' },
  { id: 'Garden', name: 'Garden Area', code: 'G', type: 'Open Air', description: 'Outdoor open-air garden terrace seating' },
  { id: 'Non-AC', name: 'Non-AC Section', code: 'NAC', type: 'Indoor', description: 'Regular main dining area' },
  { id: 'Smoking-Zone', name: 'Smoking Zone', code: 'SZ', type: 'Outdoor', description: 'Designated outdoor smoking lounge' },
];

const HISTORICAL_TABLE_KOTS: TableKotRecord[] = [
  // Yesterday (2026-11-06)
  {
    id: 'hist-1',
    tableId: 'G2',
    floorZone: 'Garden',
    kotNo: 'KOT-398',
    billNo: 'B-1035',
    seatedAt: 'Yesterday, 08:45 PM',
    dateIso: '2026-11-06',
    periodCategory: 'yesterday',
    serverName: 'Vikas M.',
    amount: 1450.00,
    guests: 4,
    customerName: 'Suresh Patil',
    customerPhone: '+91 94220 18833',
    customerLocation: 'Shivajinagar, Pune',
    orderType: 'Dine In',
    items: [
      { id: 'h-1', name: 'Paneer Butter Masala Handi', price: 290, quantity: 2, category: 'Main Course', notes: 'Medium Spicy' },
      { id: 'h-2', name: 'Butter Naan Basket', price: 180, quantity: 3, category: 'Breads' },
      { id: 'h-3', name: 'Dal Makhani Special', price: 270, quantity: 1, category: 'Main Course' },
    ],
  },
  {
    id: 'hist-2',
    tableId: 'A5',
    floorZone: 'AC',
    kotNo: 'KOT-395',
    billNo: 'B-1031',
    seatedAt: 'Yesterday, 07:20 PM',
    dateIso: '2026-11-06',
    periodCategory: 'yesterday',
    serverName: 'Captain Ramesh',
    amount: 2180.00,
    guests: 6,
    customerName: 'Meera Rao',
    customerPhone: '+91 98221 55667',
    customerLocation: 'Prabhat Road, Pune',
    orderType: 'Dine In',
    items: [
      { id: 'h-4', name: 'Special Maharashtrian Thali', price: 350, quantity: 4, category: 'Thali' },
      { id: 'h-5', name: 'Solkadhi Special Glass', price: 80, quantity: 4, category: 'Beverages', notes: 'Chilled' },
      { id: 'h-6', name: 'Gulab Jamun Rabdi', price: 120, quantity: 3, category: 'Dessert' },
    ],
  },
  // 7 Days
  {
    id: 'hist-3',
    tableId: 'G4',
    floorZone: 'Garden',
    kotNo: 'KOT-382',
    billNo: 'B-1018',
    seatedAt: 'Nov 04, 2026, 09:10 PM',
    dateIso: '2026-11-04',
    periodCategory: '7days',
    serverName: 'Mahesh G.',
    amount: 1640.00,
    guests: 4,
    customerName: 'Anil Deshmukh',
    customerPhone: '+91 98223 19082',
    customerLocation: 'Baner Highway, Pune',
    orderType: 'Dine In',
    items: [
      { id: 'h-7', name: 'Mexican Farm House (Large)', price: 649, quantity: 2, category: 'Freshly made Pizzas', customization: 'Pan Base' },
      { id: 'h-8', name: 'Garlic Bread Cheese', price: 182, quantity: 1, category: 'Sides' },
      { id: 'h-9', name: 'Chilled Cola Can', price: 50, quantity: 3, category: 'Beverages' },
    ],
  },
  {
    id: 'hist-4',
    tableId: 'NAC1',
    floorZone: 'Non-AC',
    kotNo: 'KOT-378',
    billNo: 'B-1012',
    seatedAt: 'Nov 02, 2026, 02:15 PM',
    dateIso: '2026-11-02',
    periodCategory: '7days',
    serverName: 'Sachin P.',
    amount: 890.00,
    guests: 3,
    customerName: 'Neha Joshi',
    customerPhone: '+91 91580 44556',
    customerLocation: 'Swargate, Pune',
    orderType: 'Dine In',
    items: [
      { id: 'h-10', name: 'Pav Bhaji Special', price: 150, quantity: 3, category: 'Snacks', notes: 'Extra Butter Pav' },
      { id: 'h-11', name: 'Salted Lassi Handi', price: 110, quantity: 4, category: 'Beverages' },
    ],
  },
  // 1 Month
  {
    id: 'hist-5',
    tableId: 'T10',
    floorZone: 'AC',
    kotNo: 'KOT-340',
    billNo: 'B-980',
    seatedAt: 'Oct 22, 2026, 08:30 PM',
    dateIso: '2026-10-22',
    periodCategory: '1month',
    serverName: 'Captain Ramesh',
    amount: 3850.00,
    guests: 8,
    customerName: 'Rajesh Kulkarni',
    customerPhone: '+91 98220 11442',
    customerLocation: 'Kothrud, Pune',
    orderType: 'Dine In',
    items: [
      { id: 'h-12', name: 'Kadhai Paneer Handi', price: 340, quantity: 3, category: 'Main Course' },
      { id: 'h-13', name: 'Veg Dum Biryani Special', price: 320, quantity: 3, category: 'Rice & Biryani' },
      { id: 'h-14', name: 'Butter Naan Basket', price: 180, quantity: 6, category: 'Breads' },
      { id: 'h-15', name: 'Dal Tadka Double Fry', price: 230, quantity: 2, category: 'Main Course' },
    ],
  },
  {
    id: 'hist-6',
    tableId: 'SZ2',
    floorZone: 'Smoking-Zone',
    kotNo: 'KOT-332',
    billNo: 'B-972',
    seatedAt: 'Oct 18, 2026, 10:15 PM',
    dateIso: '2026-10-18',
    periodCategory: '1month',
    serverName: 'Vikas M.',
    amount: 750.00,
    guests: 2,
    customerName: 'Karan Mehta',
    customerPhone: '+91 99230 44112',
    customerLocation: 'Koregaon Park, Pune',
    orderType: 'Dine In',
    items: [
      { id: 'h-16', name: 'Tandoori Paneer Tikka', price: 290, quantity: 1, category: 'Appetizers' },
      { id: 'h-17', name: 'Fresh Lime Soda', price: 60, quantity: 2, category: 'Beverages' },
      { id: 'h-18', name: 'Fry Masala Papad', price: 40, quantity: 2, category: 'Sides' },
    ],
  },
  // 6 Months
  {
    id: 'hist-7',
    tableId: 'G6',
    floorZone: 'Garden',
    kotNo: 'KOT-210',
    billNo: 'B-820',
    seatedAt: 'Aug 14, 2026, 08:00 PM',
    dateIso: '2026-08-14',
    periodCategory: '6months',
    serverName: 'Captain Ramesh',
    amount: 5400.00,
    guests: 10,
    customerName: 'Dr. Sameer Shinde',
    customerPhone: '+91 98500 77889',
    customerLocation: 'Aundh, Pune',
    orderType: 'Dine In',
    items: [
      { id: 'h-19', name: 'Veggie Supreme (Large)', price: 649, quantity: 4, category: 'Freshly made Pizzas', customization: 'Cheese Burst' },
      { id: 'h-20', name: 'Garlic Bread Cheese', price: 182, quantity: 4, category: 'Sides' },
      { id: 'h-21', name: 'Chocolate Brownie Sizzler', price: 220, quantity: 6, category: 'Dessert' },
    ],
  },
  {
    id: 'hist-8',
    tableId: 'A3',
    floorZone: 'AC',
    kotNo: 'KOT-185',
    billNo: 'B-790',
    seatedAt: 'Jun 28, 2026, 01:30 PM',
    dateIso: '2026-06-28',
    periodCategory: '6months',
    serverName: 'Mahesh G.',
    amount: 1820.00,
    guests: 4,
    customerName: 'Pooja Sharma',
    customerPhone: '+91 97654 32109',
    customerLocation: 'Kalyani Nagar, Pune',
    orderType: 'Dine In',
    items: [
      { id: 'h-22', name: 'Paneer Delight Pizza', price: 289, quantity: 2, category: 'Freshly made Pizzas' },
      { id: 'h-23', name: 'Veg Spring Roll Special', price: 160, quantity: 2, category: 'Snacks' },
      { id: 'h-24', name: 'Sweet Corn Soup', price: 140, quantity: 4, category: 'Soups' },
    ],
  },
];

export const TableManagementPage: React.FC<TableManagementPageProps> = ({
  tables,
  onBack,
  onNavigateToBilling,
  onUpdateTables,
  onPrintBill,
}) => {
  // Navigation & View Mode: 'setup' (Floors & Tables) vs 'table-kots' (Table-wise Dishes & KOT)
  const [activeTab, setActiveTab] = useState<'setup' | 'table-kots'>('setup');

  // Floors state
  const [floors, setFloors] = useState<Floor[]>(INITIAL_FLOORS);
  const [selectedFloorId, setSelectedFloorId] = useState<string>('All');

  // Filter Dropdown state & period
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<DateFilterPeriod>('today');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-11-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-11-07');

  // Search input
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Modals state
  const [isCreateFloorOpen, setIsCreateFloorOpen] = useState<boolean>(false);
  const [isCreateTableOpen, setIsCreateTableOpen] = useState<boolean>(false);
  const [customerModalTable, setCustomerModalTable] = useState<Table | null>(null);

  // Form states for Create Floor
  const [newFloorName, setNewFloorName] = useState<string>('');
  const [newFloorCode, setNewFloorCode] = useState<string>('');
  const [newFloorType, setNewFloorType] = useState<string>('Open Air');

  // Form states for Create Table
  const [tableTargetFloor, setTableTargetFloor] = useState<string>('Garden');
  const [newTableNumber, setNewTableNumber] = useState<string>('');
  const [newTableGuests, setNewTableGuests] = useState<number>(4);
  const [newTableServer, setNewTableServer] = useState<string>('Captain Ramesh');

  // Customer Edit Form states
  const [custFormName, setCustFormName] = useState<string>('');
  const [custFormPhone, setCustFormPhone] = useState<string>('');
  const [custFormLocation, setCustFormLocation] = useState<string>('');
  const [custFormGuests, setCustFormGuests] = useState<number>(2);

  // Helper: Get floor name by zone id/name
  const getFloorName = (zone: string) => {
    const f = floors.find(
      (fl) => fl.id.toLowerCase() === zone.toLowerCase() || fl.name.toLowerCase() === zone.toLowerCase()
    );
    return f ? f.name : zone;
  };

  // Group floors to display (either single selected floor or all floors)
  const displayFloors = useMemo(() => {
    if (selectedFloorId === 'All') {
      return floors;
    }
    return floors.filter(
      (f) => f.name.toLowerCase() === selectedFloorId.toLowerCase() || f.id.toLowerCase() === selectedFloorId.toLowerCase()
    );
  }, [floors, selectedFloorId]);

  // Filtered tables for Tab 1 (NO status filtering - only search filter)
  const getTablesForFloor = (floor: Floor) => {
    return tables.filter((t) => {
      const matchesFloor =
        t.zone.toLowerCase() === floor.id.toLowerCase() ||
        t.zone.toLowerCase() === floor.name.toLowerCase() ||
        getFloorName(t.zone).toLowerCase() === floor.name.toLowerCase();

      if (!matchesFloor) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = t.id.toLowerCase().includes(q);
        const matchServer = t.serverName?.toLowerCase().includes(q);
        const matchFloor = floor.name.toLowerCase().includes(q);
        if (!matchId && !matchServer && !matchFloor) return false;
      }

      return true;
    });
  };

  // Convert current active tables to TableKotRecord format for today
  const currentActiveTableKots: TableKotRecord[] = useMemo(() => {
    return tables
      .filter((t) => t.items.length > 0 || Boolean(t.customerName))
      .map((t) => ({
        id: `live-${t.id}`,
        tableId: t.id,
        floorZone: t.zone,
        kotNo: t.kotNo || 'KOT-408',
        billNo: t.billNo || 'B-1042',
        seatedAt: t.seatedAt ? `Today, ${t.seatedAt}` : 'Today, 03:24 PM',
        dateIso: '2026-11-07',
        periodCategory: 'today' as DateFilterPeriod,
        serverName: t.serverName || 'Captain Ramesh',
        amount: t.amount,
        guests: t.guests,
        customerName: t.customerName,
        customerPhone: t.customerPhone,
        customerLocation: t.customerLocation,
        orderType: t.orderType || 'Dine In',
        items: t.items,
      }));
  }, [tables]);

  // Filtered Table-wise KOTs & Dishes based on Date Filter Period, Floor, and Search
  const filteredTableKots = useMemo(() => {
    let pool: TableKotRecord[] = [];

    if (dateFilter === 'today') {
      pool = currentActiveTableKots;
    } else if (dateFilter === 'yesterday') {
      pool = HISTORICAL_TABLE_KOTS.filter((h) => h.periodCategory === 'yesterday');
    } else if (dateFilter === '7days') {
      pool = [
        ...currentActiveTableKots,
        ...HISTORICAL_TABLE_KOTS.filter((h) => h.periodCategory === 'yesterday' || h.periodCategory === '7days'),
      ];
    } else if (dateFilter === '1month') {
      pool = [
        ...currentActiveTableKots,
        ...HISTORICAL_TABLE_KOTS.filter(
          (h) => h.periodCategory === 'yesterday' || h.periodCategory === '7days' || h.periodCategory === '1month'
        ),
      ];
    } else if (dateFilter === '6months') {
      pool = [...currentActiveTableKots, ...HISTORICAL_TABLE_KOTS];
    } else if (dateFilter === 'custom') {
      pool = [...currentActiveTableKots, ...HISTORICAL_TABLE_KOTS].filter((r) => {
        if (!customStartDate && !customEndDate) return true;
        if (customStartDate && r.dateIso < customStartDate) return false;
        if (customEndDate && r.dateIso > customEndDate) return false;
        return true;
      });
    }

    // Apply Floor filter
    if (selectedFloorId !== 'All') {
      pool = pool.filter((r) => {
        const floorName = getFloorName(r.floorZone);
        return (
          r.floorZone.toLowerCase() === selectedFloorId.toLowerCase() ||
          floorName.toLowerCase() === selectedFloorId.toLowerCase()
        );
      });
    }

    // Apply Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      pool = pool.filter((r) => {
        const matchTable = r.tableId.toLowerCase().includes(q);
        const matchCust = r.customerName?.toLowerCase().includes(q);
        const matchPhone = r.customerPhone?.includes(q);
        const matchKot = r.kotNo.toLowerCase().includes(q);
        const matchBill = r.billNo.toLowerCase().includes(q);
        const matchDish = r.items.some((it) => it.name.toLowerCase().includes(q));
        return matchTable || matchCust || matchPhone || matchKot || matchBill || matchDish;
      });
    }

    return pool;
  }, [dateFilter, customStartDate, customEndDate, currentActiveTableKots, selectedFloorId, searchQuery, floors]);

  // 1. Create Floor Handler
  const handleCreateFloorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFloorName.trim()) {
      alert('Please enter a floor name (e.g. Garden Area, Rooftop)');
      return;
    }

    const trimmedName = newFloorName.trim();
    if (floors.some((f) => f.name.toLowerCase() === trimmedName.toLowerCase())) {
      alert(`Floor "${trimmedName}" already exists!`);
      return;
    }

    const createdFloor: Floor = {
      id: trimmedName.replace(/\s+/g, '-'),
      name: trimmedName,
      code: newFloorCode.trim() || trimmedName.substring(0, 2).toUpperCase(),
      type: newFloorType,
    };

    setFloors((prev) => [...prev, createdFloor]);
    setSelectedFloorId(createdFloor.name);
    setTableTargetFloor(createdFloor.id);
    setIsCreateFloorOpen(false);
    setNewFloorName('');
    setNewFloorCode('');
    showToast(`Floor "${trimmedName}" created.`);
  };

  // 2. Delete Floor Handler
  const handleDeleteFloor = (floorToDelete: Floor) => {
    const floorTables = tables.filter(
      (t) =>
        t.zone.toLowerCase() === floorToDelete.id.toLowerCase() ||
        t.zone.toLowerCase() === floorToDelete.name.toLowerCase()
    );

    if (floorTables.length > 0) {
      if (
        !confirm(
          `Floor "${floorToDelete.name}" has ${floorTables.length} tables. Deleting this floor will also delete all its tables. Are you sure?`
        )
      ) {
        return;
      }
    } else {
      if (!confirm(`Are you sure you want to delete floor "${floorToDelete.name}"?`)) {
        return;
      }
    }

    setFloors((prev) => prev.filter((f) => f.id !== floorToDelete.id));

    const updatedTables = tables.filter(
      (t) =>
        t.zone.toLowerCase() !== floorToDelete.id.toLowerCase() &&
        t.zone.toLowerCase() !== floorToDelete.name.toLowerCase()
    );
    if (onUpdateTables) onUpdateTables(updatedTables);

    setSelectedFloorId('All');
    showToast(`Floor "${floorToDelete.name}" deleted.`);
  };

  // 3. Create Table Handler
  const handleCreateTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNumber.trim()) {
      alert('Please enter table number (e.g. G1, T12)');
      return;
    }

    const tableId = newTableNumber.trim().toUpperCase();
    if (tables.some((t) => t.id.toLowerCase() === tableId.toLowerCase())) {
      alert(`Table "${tableId}" already exists!`);
      return;
    }

    const newTbl: Table = {
      id: tableId,
      zone: tableTargetFloor as ZoneId,
      status: 'blank',
      durationMinutes: 0,
      amount: 0,
      guests: newTableGuests,
      serverName: newTableServer,
      items: [],
    };

    const updated = [...tables, newTbl];
    if (onUpdateTables) onUpdateTables(updated);

    setIsCreateTableOpen(false);
    setNewTableNumber('');
    showToast(`Table ${tableId} added.`);
  };

  // 4. Delete Table Handler
  const handleDeleteTable = (tableId: string) => {
    if (confirm(`Are you sure you want to delete Table ${tableId}?`)) {
      const updated = tables.filter((t) => t.id !== tableId);
      if (onUpdateTables) onUpdateTables(updated);
      showToast(`Table ${tableId} deleted.`);
    }
  };

  // 5. Save Customer Details
  const handleSaveCustomerDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerModalTable) return;

    const updated = tables.map((t) => {
      if (t.id === customerModalTable.id) {
        return {
          ...t,
          customerName: custFormName.trim() || undefined,
          customerPhone: custFormPhone.trim() || undefined,
          customerLocation: custFormLocation.trim() || undefined,
          guests: custFormGuests,
        };
      }
      return t;
    });

    if (onUpdateTables) onUpdateTables(updated);
    setCustomerModalTable(null);
    showToast(`Customer details updated for Table ${customerModalTable.id}`);
  };

  const openCustomerModal = (tbl: Table) => {
    setCustomerModalTable(tbl);
    setCustFormName(tbl.customerName || '');
    setCustFormPhone(tbl.customerPhone || '');
    setCustFormLocation(tbl.customerLocation || '');
    setCustFormGuests(tbl.guests || 2);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#fdfaf6] h-[calc(100vh-56px)] overflow-hidden select-none text-stone-800 font-sans">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-16 right-6 z-50 bg-[#731b21] text-[#fdfaf6] px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-2xl border border-amber-300/40 animate-slideIn">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. TOP HEADER BAR (Compact Breadth, NO icons)             */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-[#ded5c2] px-4 sm:px-6 py-2.5 flex items-center justify-between flex-shrink-0 shadow-2xs">
        
        {/* Left: Category Navigation Tabs (Same position & style as OrdersPage) */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('setup')}
            className={`px-3 sm:px-4 py-1.5 rounded-t-lg text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'setup'
                ? 'border-[#731b21] text-[#731b21] bg-red-50/40'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Floors & Tables
          </button>

          <button
            onClick={() => setActiveTab('table-kots')}
            className={`px-3 sm:px-4 py-1.5 rounded-t-lg text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'table-kots'
                ? 'border-[#731b21] text-[#731b21] bg-red-50/40'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Table KOTs & Dishes
          </button>
        </div>

        {/* Right: Reduced Breadth Action Buttons (NO icons) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateFloorOpen(true)}
            className="px-2.5 py-1 rounded border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            + Add Floor
          </button>

          <button
            onClick={() => {
              setTableTargetFloor(selectedFloorId === 'All' ? floors[0]?.id || 'Garden' : selectedFloorId);
              setIsCreateTableOpen(true);
            }}
            className="px-2.5 py-1 rounded bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            + Add Table
          </button>

          <button
            onClick={onBack}
            className="px-2.5 py-1 rounded border border-[#731b21] bg-white hover:bg-stone-50 text-[#731b21] text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            Back
          </button>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 2. SUB-BAR: SEARCH & FLOOR SELECTOR (NO status badges)    */}
      {/* ========================================================= */}
      <div className="bg-[#f9f7f2] border-b border-[#ded5c2] px-4 sm:px-6 py-2 flex items-center justify-between gap-3 flex-wrap flex-shrink-0">
        
        {/* Search Input Box */}
        <div className="relative w-64 sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search table, floor, customer, dish..."
            className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-md focus:outline-none focus:border-[#731b21] text-stone-800 font-medium placeholder:text-stone-400 shadow-2xs"
          />
        </div>

        {/* Floor Selection Filters (NO live status filters!) */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mr-1">
            Floor:
          </span>

          <button
            onClick={() => setSelectedFloorId('All')}
            className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer text-xs ${
              selectedFloorId === 'All'
                ? 'bg-[#731b21] text-white shadow-2xs'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-300'
            }`}
          >
            All Floors
          </button>

          {floors.map((fl) => {
            const isSelected = selectedFloorId === fl.name || selectedFloorId === fl.id;
            return (
              <button
                key={fl.id}
                onClick={() => setSelectedFloorId(fl.name)}
                className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer text-xs whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#731b21] text-white shadow-2xs'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-300'
                }`}
              >
                {fl.name}
              </button>
            );
          })}
        </div>

      </div>

      {/* ========================================================= */}
      {/* 3. MAIN BODY CONTENT                                      */}
      {/* ========================================================= */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 bg-[#faf7f2]/60">
        
        {/* ========================================================= */}
        {/* TAB 1: ALL TABLES FLOOR-WISE (NO table status!)           */}
        {/* ========================================================= */}
        {activeTab === 'setup' && (
          <div className="space-y-6">
            
            {displayFloors.map((floor) => {
              const floorTables = getTablesForFloor(floor);
              return (
                <div
                  key={floor.id}
                  className="bg-white rounded-xl border border-stone-300 shadow-2xs overflow-hidden"
                >
                  {/* Floor Header with Delete Floor & Add Table option */}
                  <div className="bg-[#ede8dd] border-b border-[#ded5c2] px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-stone-900">
                        {floor.name}
                      </h3>
                      <span className="text-xs text-stone-600 font-medium">
                        {floorTables.length} Tables
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setTableTargetFloor(floor.id);
                          setIsCreateTableOpen(true);
                        }}
                        className="px-2.5 py-1 rounded bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-bold transition-all cursor-pointer"
                      >
                        + Add Table
                      </button>

                      <button
                        onClick={() => handleDeleteFloor(floor)}
                        className="px-2.5 py-1 rounded border border-stone-300 bg-white hover:bg-rose-50 hover:text-rose-700 text-stone-700 text-xs font-bold transition-all cursor-pointer"
                        title={`Delete ${floor.name} and all its tables`}
                      >
                        Delete Floor
                      </button>
                    </div>
                  </div>

                  {/* Floor Tables Grid (Pure Tables, NO status like available/occupied) */}
                  <div className="p-4">
                    {floorTables.length === 0 ? (
                      <div className="py-8 text-center text-stone-500 text-xs">
                        <p className="font-semibold">No tables in {floor.name}</p>
                        <button
                          onClick={() => {
                            setTableTargetFloor(floor.id);
                            setIsCreateTableOpen(true);
                          }}
                          className="mt-2 text-[#731b21] font-bold hover:underline cursor-pointer"
                        >
                          + Create Table in this floor
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {floorTables.map((tbl) => (
                          <div
                            key={tbl.id}
                            className="bg-white border border-stone-200 hover:border-stone-400 rounded-lg p-3 flex flex-col justify-between shadow-2xs transition-all"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-base font-black text-stone-900">
                                  {tbl.id}
                                </span>
                                <span className="text-[11px] font-semibold text-stone-500">
                                  {tbl.guests} Seats
                                </span>
                              </div>
                              <div className="text-[11px] text-stone-600 truncate mb-2">
                                {tbl.serverName || 'No server'}
                              </div>
                            </div>

                            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                              <button
                                onClick={() => onNavigateToBilling(tbl)}
                                className="text-stone-700 hover:text-[#731b21] font-bold cursor-pointer text-[11px]"
                              >
                                Billing
                              </button>
                              <button
                                onClick={() => handleDeleteTable(tbl.id)}
                                className="text-stone-400 hover:text-rose-700 cursor-pointer font-semibold text-[11px]"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              );
            })}

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: TABLE-WISE DISHES & KOT LIVE MONITOR               */}
        {/* WITH ONLY FILTER OPTION -> OPENS DROPDOWN ON CLICK       */}
        {/* ========================================================= */}
        {activeTab === 'table-kots' && (
          <div className="space-y-4">
            
            {/* Header Bar with ONLY the Filter option button */}
            <div className="bg-white border border-stone-300 rounded-xl px-4 py-2.5 flex items-center justify-between flex-wrap gap-3 shadow-2xs">
              <div>
                <h3 className="font-bold text-sm text-stone-900">
                  Table-Wise KOT & Ordered Dishes
                </h3>
                <span className="text-xs text-stone-600 font-medium">
                  {filteredTableKots.length} Tables with KOTs & Orders
                </span>
              </div>

              {/* Only Filter Button -> Click opens dropdown with Today, Yesterday, 7 Days, 1 Month, 6 Months, Custom Date */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                    isFilterDropdownOpen || dateFilter !== 'today'
                      ? 'bg-[#731b21] text-white'
                      : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-300'
                  }`}
                >
                  <span>
                    {dateFilter === 'today'
                      ? 'Filter'
                      : dateFilter === 'yesterday'
                      ? 'Filter: Yesterday'
                      : dateFilter === '7days'
                      ? 'Filter: 7 Days'
                      : dateFilter === '1month'
                      ? 'Filter: 1 Month'
                      : dateFilter === '6months'
                      ? 'Filter: 6 Months'
                      : 'Filter: Custom Date'}
                  </span>
                  <span className="text-[10px]">▾</span>
                </button>

                {/* Filter Dropdown Popover */}
                {isFilterDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsFilterDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-2xl border border-stone-300 p-2.5 z-40 animate-fadeIn text-xs">
                      
                      <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider px-2 py-1 mb-1">
                        Select Filter Period
                      </div>

                      {/* Dropdown Options: Today, Yesterday, 7 Days, 1 Month, 6 Months, Custom Date */}
                      <div className="space-y-0.5">
                        {(
                          [
                            { key: 'today', label: 'Today' },
                            { key: 'yesterday', label: 'Yesterday' },
                            { key: '7days', label: '7 Days' },
                            { key: '1month', label: '1 Month' },
                            { key: '6months', label: '6 Months' },
                            { key: 'custom', label: 'Custom Date' },
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => {
                              setDateFilter(opt.key);
                              if (opt.key !== 'custom') {
                                setIsFilterDropdownOpen(false);
                              }
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                              dateFilter === opt.key
                                ? 'bg-red-50 text-[#731b21] font-bold'
                                : 'text-stone-700 hover:bg-stone-50'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {dateFilter === opt.key && <span className="text-[#731b21] font-bold">✓</span>}
                          </button>
                        ))}
                      </div>

                      {/* Custom Date Form (between two dates) */}
                      {dateFilter === 'custom' && (
                        <div className="mt-2 pt-2 border-t border-stone-200 space-y-2">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-stone-600 block uppercase">From:</span>
                            <input
                              type="date"
                              value={customStartDate}
                              onChange={(e) => setCustomStartDate(e.target.value)}
                              className="w-full px-2 py-1 bg-stone-50 border border-stone-300 rounded text-xs font-mono"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-stone-600 block uppercase">To:</span>
                            <input
                              type="date"
                              value={customEndDate}
                              onChange={(e) => setCustomEndDate(e.target.value)}
                              className="w-full px-2 py-1 bg-stone-50 border border-stone-300 rounded text-xs font-mono"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsFilterDropdownOpen(false)}
                            className="w-full mt-1 py-1 rounded bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] font-bold text-xs cursor-pointer shadow-2xs"
                          >
                            Apply Filter
                          </button>
                        </div>
                      )}

                    </div>
                  </>
                )}
              </div>

            </div>

            {/* List of Table KOTs */}
            {filteredTableKots.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500 text-xs">
                <p className="font-bold text-sm text-stone-800">No table KOT orders found</p>
                <p className="mt-1">
                  There are no tables with KOTs or dishes for the selected filter and floor.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTableKots.map((record) => (
                  <div
                    key={record.id}
                    className="bg-white rounded-xl border border-stone-300 shadow-2xs overflow-hidden flex flex-col"
                  >
                    {/* Table Header Row */}
                    <div className="bg-[#ede8dd] border-b border-[#ded5c2] px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-base font-black text-[#731b21] bg-white px-2.5 py-1 rounded border border-stone-300 shadow-2xs">
                          {record.tableId}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-stone-900">
                            Table {record.tableId} · {getFloorName(record.floorZone)}
                          </h4>
                          <span className="text-xs text-stone-600 font-medium">
                            KOT #{record.kotNo} • Bill #{record.billNo} • Seated: {record.seatedAt} • Server: {record.serverName}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-base font-black text-[#731b21]">
                          ₹{record.amount.toFixed(2)}
                        </span>
                        <button
                          onClick={() => {
                            const foundTbl = tables.find((t) => t.id === record.tableId) || tables[0];
                            onNavigateToBilling(foundTbl);
                          }}
                          className="px-3 py-1 rounded bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-bold cursor-pointer"
                        >
                          Billing
                        </button>
                      </div>
                    </div>

                    {/* Customer Details Section (If entered while billing) */}
                    <div className="p-3 bg-[#fdfaf6] border-b border-stone-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                          Customer Billing Details
                        </span>
                        <button
                          onClick={() => {
                            const liveTbl = tables.find((t) => t.id === record.tableId);
                            if (liveTbl) openCustomerModal(liveTbl);
                            else alert('Historical record details cannot be edited.');
                          }}
                          className="text-[11px] font-semibold text-[#731b21] hover:underline cursor-pointer"
                        >
                          {record.customerName ? 'Edit' : '+ Add Details'}
                        </button>
                      </div>

                      {record.customerName || record.customerPhone ? (
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-white p-2.5 rounded-lg border border-stone-200 text-xs">
                          <div>
                            <span className="text-[10px] text-stone-400 uppercase font-semibold block">Name</span>
                            <span className="font-bold text-stone-900">{record.customerName || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-400 uppercase font-semibold block">Mobile</span>
                            <span className="font-mono font-bold text-stone-800">{record.customerPhone || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-400 uppercase font-semibold block">Location</span>
                            <span className="text-stone-700 truncate block">{record.customerLocation || 'Dine In Table'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-400 uppercase font-semibold block">Guests</span>
                            <span className="text-stone-800 font-semibold">{record.guests} Persons</span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white p-2 rounded-lg border border-dashed border-stone-300 text-xs text-stone-500 flex items-center justify-between">
                          <span className="italic">Walk-in Diner (No customer info recorded)</span>
                          <button
                            onClick={() => {
                              const liveTbl = tables.find((t) => t.id === record.tableId);
                              if (liveTbl) openCustomerModal(liveTbl);
                            }}
                            className="text-xs font-bold text-[#731b21] hover:underline cursor-pointer"
                          >
                            + Attach Info
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Ordered Dishes Table */}
                    <div className="p-3">
                      <div className="overflow-x-auto border border-stone-200 rounded-lg bg-white">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead className="bg-[#ede8dd] text-stone-800 font-bold border-b border-stone-200 uppercase text-[10px]">
                            <tr>
                              <th className="py-2 px-3">Dish Item</th>
                              <th className="py-2 px-3">Note</th>
                              <th className="py-2 px-3 text-center w-20">Qty</th>
                              <th className="py-2 px-3 text-right w-24">Price</th>
                              <th className="py-2 px-3 text-right w-24">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100 text-stone-800">
                            {record.items.map((it, idx) => (
                              <tr key={idx} className="hover:bg-stone-50">
                                <td className="py-2 px-3 font-semibold text-stone-900">
                                  {it.name}
                                </td>
                                <td className="py-2 px-3 text-stone-500 italic">
                                  {it.customization || it.notes || '--'}
                                </td>
                                <td className="py-2 px-3 text-center font-mono font-bold">
                                  {it.quantity}
                                </td>
                                <td className="py-2 px-3 text-right font-mono">
                                  ₹{it.price.toFixed(2)}
                                </td>
                                <td className="py-2 px-3 text-right font-mono font-bold">
                                  ₹{(it.price * it.quantity).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* 4. CREATE FLOOR MODAL                                     */}
      {/* ========================================================= */}
      {isCreateFloorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs select-none">
          <div className="bg-white w-full max-w-[380px] rounded-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
            <div className="px-4 py-2.5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-sm text-stone-900">
                Create Floor
              </h3>
              <button
                onClick={() => setIsCreateFloorOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-base font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFloorSubmit} className="p-4 space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-700 uppercase">
                  Floor Name *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newFloorName}
                  onChange={(e) => {
                    setNewFloorName(e.target.value);
                    if (!newFloorCode && e.target.value.length >= 2) {
                      setNewFloorCode(e.target.value.substring(0, 2).toUpperCase());
                    }
                  }}
                  placeholder="e.g. Garden Area, Rooftop"
                  className="w-full px-3 py-1.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-300 rounded-md focus:outline-none focus:border-[#731b21] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700 uppercase">
                    Code
                  </label>
                  <input
                    type="text"
                    value={newFloorCode}
                    onChange={(e) => setNewFloorCode(e.target.value.toUpperCase())}
                    placeholder="e.g. GA"
                    maxLength={4}
                    className="w-full px-3 py-1.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-300 rounded-md focus:outline-none focus:border-[#731b21] font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700 uppercase">
                    Type
                  </label>
                  <select
                    value={newFloorType}
                    onChange={(e) => setNewFloorType(e.target.value)}
                    className="w-full px-3 py-1.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-300 rounded-md focus:outline-none focus:border-[#731b21]"
                  >
                    <option value="Open Air">Open Air</option>
                    <option value="Indoor AC">Indoor AC</option>
                    <option value="Rooftop">Rooftop</option>
                    <option value="Banquet">Banquet</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateFloorOpen(false)}
                  className="px-3 py-1.5 rounded border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] font-bold cursor-pointer"
                >
                  Save Floor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. CREATE TABLE MODAL                                     */}
      {/* ========================================================= */}
      {isCreateTableOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs select-none">
          <div className="bg-white w-full max-w-[380px] rounded-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
            <div className="px-4 py-2.5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-sm text-stone-900">
                Create Table
              </h3>
              <button
                onClick={() => setIsCreateTableOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-base font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTableSubmit} className="p-4 space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-700 uppercase">
                  Floor *
                </label>
                <select
                  value={tableTargetFloor}
                  onChange={(e) => setTableTargetFloor(e.target.value)}
                  className="w-full px-3 py-1.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-300 rounded-md focus:outline-none focus:border-[#731b21] font-bold text-stone-900 cursor-pointer"
                >
                  {floors.map((fl) => (
                    <option key={fl.id} value={fl.id}>
                      {fl.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700 uppercase">
                    Table No. *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newTableNumber}
                    onChange={(e) => setNewTableNumber(e.target.value)}
                    placeholder="e.g. G1, 14"
                    className="w-full px-3 py-1.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-300 rounded-md focus:outline-none focus:border-[#731b21] font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700 uppercase">
                    Capacity
                  </label>
                  <select
                    value={newTableGuests}
                    onChange={(e) => setNewTableGuests(parseInt(e.target.value) || 2)}
                    className="w-full px-3 py-1.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-300 rounded-md focus:outline-none focus:border-[#731b21] font-mono font-bold"
                  >
                    {[2, 4, 6, 8, 10, 12].map((cap) => (
                      <option key={cap} value={cap}>
                        {cap} Seats
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-700 uppercase">
                  Server / Captain
                </label>
                <input
                  type="text"
                  value={newTableServer}
                  onChange={(e) => setNewTableServer(e.target.value)}
                  placeholder="e.g. Captain Ramesh"
                  className="w-full px-3 py-1.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-300 rounded-md focus:outline-none focus:border-[#731b21] font-medium"
                />
              </div>

              <div className="pt-2 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateTableOpen(false)}
                  className="px-3 py-1.5 rounded border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] font-bold cursor-pointer"
                >
                  Save Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. CUSTOMER DETAILS EDIT MODAL                            */}
      {/* ========================================================= */}
      {customerModalTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs select-none">
          <div className="bg-white w-full max-w-[380px] rounded-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
            <div className="px-4 py-2.5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-sm text-stone-900">
                Customer Details · Table {customerModalTable.id}
              </h3>
              <button
                onClick={() => setCustomerModalTable(null)}
                className="text-stone-400 hover:text-stone-700 text-base font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomerDetails} className="p-4 space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-700 uppercase">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={custFormName}
                  onChange={(e) => setCustFormName(e.target.value)}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full px-3 py-1.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-300 rounded-md focus:outline-none focus:border-[#731b21]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-700 uppercase">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={custFormPhone}
                  onChange={(e) => setCustFormPhone(e.target.value)}
                  placeholder="10-digit number"
                  className="w-full px-3 py-1.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-300 rounded-md focus:outline-none focus:border-[#731b21] font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-700 uppercase">
                  Location / Address
                </label>
                <input
                  type="text"
                  value={custFormLocation}
                  onChange={(e) => setCustFormLocation(e.target.value)}
                  placeholder="e.g. Near Station, Pune"
                  className="w-full px-3 py-1.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-300 rounded-md focus:outline-none focus:border-[#731b21]"
                />
              </div>

              <div className="pt-2 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCustomerModalTable(null)}
                  className="px-3 py-1.5 rounded border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] font-bold cursor-pointer"
                >
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

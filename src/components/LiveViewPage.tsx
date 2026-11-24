import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Utensils,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  RefreshCw,
  Maximize2,
  X,
  CreditCard,
  Banknote,
  QrCode,
  DollarSign,
  User,
  Sparkles,
  Check,
  Calendar,
  RotateCcw,
  Printer
} from 'lucide-react';
import { Table } from '../types/pos';
import { KitchenDepartment, KdsTicketData } from './KitchenDisplayPage';

export type DateFilterOption = 'today' | 'yesterday' | '7days' | '1month' | 'custom';

// Order View Ticket Interface (Orders where food is served but payment is pending)
export interface ServedOrderTicket {
  id: string;
  billNo: string;
  tableId: string;
  kotNo: string;
  orderType: 'Dine In' | 'Delivery' | 'Pickup';
  billerName: string;
  durationMinutes: number;
  elapsedSeconds: number;
  totalAmount: number;
  items: {
    name: string;
    qty: number;
    price: number;
    customization?: string;
    department?: KitchenDepartment;
  }[];
}

interface LiveViewPageProps {
  tables?: Table[];
  onBackToTables: () => void;
  onNavigateToBilling?: (table?: Table) => void;
  onOpenKds?: () => void;
  onSettleTable?: (tableId: string, paymentMode: string) => void;
  initialTab?: 'order-view' | 'kot-view';
  initialKdsMode?: 'live' | 'recent';
}

// Initial Served Orders for "Order View" (Orders awaiting payment settlement)
const INITIAL_SERVED_ORDERS: ServedOrderTicket[] = [
  {
    id: 'ord-573',
    billNo: '573',
    tableId: 'A1',
    kotNo: '1',
    orderType: 'Dine In',
    billerName: 'Captain Ramesh',
    durationMinutes: 267,
    elapsedSeconds: 267 * 60 + 59,
    totalAmount: 702.00,
    items: [
      { name: 'Bhel Puri (12 Pieces Chaat)', qty: 4, price: 120, department: 'grill', customization: 'With Chaat: Extra Chutney(4)' },
      { name: 'Sev Puri (24 Pieces)', qty: 1, price: 222, department: 'grill' },
    ],
  },
  {
    id: 'ord-574',
    billNo: '574',
    tableId: 'KL16',
    kotNo: '5',
    orderType: 'Dine In',
    billerName: 'Captain Vikas',
    durationMinutes: 184,
    elapsedSeconds: 184 * 60 + 20,
    totalAmount: 1295.00,
    items: [
      { name: 'Capsicum & Onion (Large (11 inch))', qty: 5, price: 259, department: 'tandoor', customization: 'Freshly Made Pizzas · Extra Cheeses(5)' },
    ],
  },
  {
    id: 'ord-575',
    billNo: '575',
    tableId: 'A14',
    kotNo: '415',
    orderType: 'Dine In',
    billerName: 'Captain Sachin',
    durationMinutes: 45,
    elapsedSeconds: 45 * 60 + 12,
    totalAmount: 838.00,
    items: [
      { name: 'Corn & Jalapeno Pizza', qty: 2, price: 279, department: 'tandoor', customization: 'Spicy Jalapeno Crunch' },
      { name: 'Paneer Delight Pizza', qty: 1, price: 280, department: 'tandoor' },
    ],
  },
  {
    id: 'ord-576',
    billNo: '576',
    tableId: 'SZ2',
    kotNo: '413',
    orderType: 'Dine In',
    billerName: 'Captain Ramesh',
    durationMinutes: 32,
    elapsedSeconds: 32 * 60 + 44,
    totalAmount: 499.00,
    items: [
      { name: 'Crispy Veg Burger', qty: 2, price: 180, department: 'grill' },
      { name: 'Virgin Blue Curacao Mojito', qty: 2, price: 139, department: 'main' },
    ],
  },
];

// Initial KDS Tickets for KOT View (Exactly matching KDS UI)
const INITIAL_KDS_KOTS: KdsTicketData[] = [
  {
    id: 'kds-tbl-1',
    tableNumber: 'Table 1',
    orderNumber: '#104',
    orderType: 'dine-in',
    serverName: 'Ramesh K.',
    elapsedSeconds: 546,
    status: 'pending',
    items: [
      { id: 't1-1', name: 'Paneer Tikka', qty: 2, department: 'tandoor', customization: 'Less spicy', done: false },
      { id: 't1-2', name: 'Butter Naan', qty: 4, department: 'tandoor', done: false },
      { id: 't1-3', name: 'Dal Makhani', qty: 1, department: 'curry', done: false },
    ],
  },
  {
    id: 'kds-tbl-9',
    tableNumber: 'Table 9',
    orderNumber: '#106',
    orderType: 'dine-in',
    serverName: 'Vikas M.',
    elapsedSeconds: 544,
    status: 'cooking', // Already preparing: #CC7722 header + Preparing badge + Ready button (#55E07E)
    items: [
      { id: 't9-1', name: 'Tawa Chaap Tikka', qty: 2, department: 'grill', customization: 'Crispy roast', done: false },
      { id: 't9-2', name: 'Garlic Butter Naan', qty: 3, department: 'tandoor', done: false },
      { id: 't9-3', name: 'Dal Makhani Handi', qty: 1, department: 'curry', done: false },
    ],
  },
  {
    id: 'kds-tbl-7',
    tableNumber: 'Table 7',
    orderNumber: '#109',
    orderType: 'dine-in',
    serverName: 'Sachin P.',
    elapsedSeconds: 542,
    status: 'pending',
    items: [
      { id: 't7-1', name: 'Paneer Tikka', qty: 2, department: 'grill', customization: 'Less spicy', done: false },
      { id: 't7-2', name: 'Butter Naan', qty: 4, department: 'tandoor', done: false },
      { id: 't7-3', name: 'Dal Makhani', qty: 1, department: 'curry', done: false },
    ],
  },
  {
    id: 'kds-tbl-2',
    tableNumber: 'Table 2',
    orderNumber: '#111',
    orderType: 'dine-in',
    serverName: 'Sachin P.',
    elapsedSeconds: 539,
    status: 'cooking', // #CC7722 header + Preparing badge + Ready button (#55E07E)
    items: [
      { id: 't2-1', name: 'Paneer Malai Tikka', qty: 2, department: 'tandoor', customization: 'Less spicy', done: false },
      { id: 't2-2', name: 'Butter Naan', qty: 4, department: 'tandoor', done: false },
      { id: 't2-3', name: 'Dal Makhani', qty: 1, department: 'curry', done: false },
    ],
  },
  {
    id: 'kds-tbl-5',
    tableNumber: 'Table 5',
    orderNumber: '#112',
    orderType: 'dine-in',
    serverName: 'Ramesh K.',
    elapsedSeconds: 538,
    status: 'pending',
    items: [
      { id: 't5-1', name: 'Paneer Tikka', qty: 2, department: 'grill', customization: 'Less spicy', done: false },
      { id: 't5-2', name: 'Butter Naan', qty: 4, department: 'tandoor', done: false },
      { id: 't5-3', name: 'Dal Makhani', qty: 1, department: 'curry', done: false },
    ],
  },
  {
    id: 'kds-tbl-12',
    tableNumber: 'Table 12',
    orderNumber: '#113',
    orderType: 'dine-in',
    serverName: 'Vikas M.',
    elapsedSeconds: 196,
    status: 'pending',
    items: [
      { id: 't12-1', name: 'Paneer Tikka', qty: 2, department: 'tandoor', customization: 'Less spicy', done: false },
      { id: 't12-2', name: 'Butter Naan', qty: 4, department: 'tandoor', done: false },
      { id: 't12-3', name: 'Dal Makhani', qty: 1, department: 'curry', done: false },
      { id: 't12-4', name: 'Jeera Rice Special', qty: 1, department: 'main', done: false },
    ],
  },
  {
    id: 'kds-tbl-14',
    tableNumber: 'Table 14',
    orderNumber: '#114',
    orderType: 'dine-in',
    serverName: 'Ramesh K.',
    elapsedSeconds: 140,
    status: 'pending',
    items: [
      { id: 't14-1', name: 'Mushroom Tikka', qty: 1, department: 'grill', customization: 'Extra mint chutney', done: false },
      { id: 't14-2', name: 'Paneer Lababdar', qty: 1, department: 'curry', done: false },
      { id: 't14-3', name: 'Veg Dum Biryani', qty: 2, department: 'main', done: false },
    ],
  },
  {
    id: 'kds-tbl-3',
    tableNumber: 'Table 3',
    orderNumber: '#115',
    orderType: 'takeaway',
    serverName: 'Counter',
    elapsedSeconds: 85,
    status: 'pending',
    items: [
      { id: 't3-1', name: 'Tandoori Roti', qty: 6, department: 'tandoor', done: false },
      { id: 't3-2', name: 'Kadhai Paneer', qty: 1, department: 'curry', customization: 'Medium spicy', done: false },
      { id: 't3-3', name: 'Gulab Jamun (2 pcs)', qty: 2, department: 'main', done: false },
    ],
  },
];

const INITIAL_KDS_RECENT_TICKETS: KdsTicketData[] = [
  {
    id: 'kds-recent-1',
    tableNumber: 'Table 4',
    orderNumber: '#103',
    orderType: 'dine-in',
    serverName: 'Sachin P.',
    elapsedSeconds: 680,
    completedAt: '07:12 PM',
    status: 'completed',
    items: [
      { id: 'r1-1', name: 'Paneer Tikka', qty: 2, department: 'tandoor', done: true },
      { id: 'r1-2', name: 'Butter Naan', qty: 4, department: 'tandoor', done: true },
      { id: 'r1-3', name: 'Dal Makhani', qty: 1, department: 'curry', done: true },
    ],
  },
  {
    id: 'kds-recent-2',
    tableNumber: 'Table 11',
    orderNumber: '#102',
    orderType: 'dine-in',
    serverName: 'Vikas M.',
    elapsedSeconds: 520,
    completedAt: '07:05 PM',
    status: 'completed',
    items: [
      { id: 'r2-1', name: 'Veg Seekh Kebab', qty: 2, department: 'grill', done: true },
      { id: 'r2-2', name: 'Dal Tadka', qty: 1, department: 'curry', done: true },
      { id: 'r2-3', name: 'Steamed Rice', qty: 1, department: 'main', done: true },
    ],
  },
  {
    id: 'kds-recent-3',
    tableNumber: 'Table A2',
    orderNumber: '#101',
    orderType: 'dine-in',
    serverName: 'Captain Ramesh',
    elapsedSeconds: 430,
    completedAt: '06:58 PM',
    status: 'completed',
    items: [
      { id: 'r3-1', name: 'Bhel Puri (24 Pieces)', qty: 1, department: 'grill', done: true },
      { id: 'r3-2', name: 'Pineapple Passion', qty: 1, department: 'main', done: true },
      { id: 'r3-3', name: 'Samosa (Aloo)', qty: 2, department: 'grill', done: true },
      { id: 'r3-4', name: 'Butter Naan', qty: 2, department: 'tandoor', done: true },
    ],
  },
  {
    id: 'kds-recent-4',
    tableNumber: 'Table KL16',
    orderNumber: '#100',
    orderType: 'dine-in',
    serverName: 'Captain Vikas',
    elapsedSeconds: 380,
    completedAt: '06:50 PM',
    status: 'completed',
    items: [
      { id: 'r4-1', name: 'Capsicum & Onion (Large)', qty: 2, department: 'main', customization: 'Extra Cheeses', done: true },
      { id: 'r4-2', name: 'Mexican Farm House', qty: 1, department: 'main', done: true },
      { id: 'r4-3', name: 'Chilled Cola Can', qty: 2, department: 'main', done: true },
    ],
  },
  {
    id: 'kds-recent-5',
    tableNumber: 'Swiggy Delivery',
    orderNumber: '#99',
    orderType: 'delivery',
    serverName: 'Dispatch Counter',
    elapsedSeconds: 310,
    completedAt: '06:42 PM',
    status: 'completed',
    items: [
      { id: 'r5-1', name: 'Paneer Butter Masala', qty: 1, department: 'curry', done: true },
      { id: 'r5-2', name: 'Butter Naan Basket', qty: 2, department: 'tandoor', done: true },
      { id: 'r5-3', name: 'Jeera Rice Special', qty: 1, department: 'main', done: true },
    ],
  },
  {
    id: 'kds-recent-6',
    tableNumber: 'Table 5',
    orderNumber: '#98',
    orderType: 'dine-in',
    serverName: 'Sachin P.',
    elapsedSeconds: 270,
    completedAt: '06:35 PM',
    status: 'completed',
    items: [
      { id: 'r6-1', name: 'Kadhai Paneer Handi', qty: 1, department: 'curry', customization: 'Medium spicy', done: true },
      { id: 'r6-2', name: 'Tandoori Roti', qty: 4, department: 'tandoor', done: true },
      { id: 'r6-3', name: 'Gulab Jamun (2 pcs)', qty: 2, department: 'main', done: true },
    ],
  },
  {
    id: 'kds-recent-7',
    tableNumber: 'Table 7',
    orderNumber: '#97',
    orderType: 'dine-in',
    serverName: 'Vikas M.',
    elapsedSeconds: 220,
    completedAt: '06:28 PM',
    status: 'completed',
    items: [
      { id: 'r7-1', name: 'Veg Dum Biryani Special', qty: 2, department: 'main', customization: 'With Raita', done: true },
      { id: 'r7-2', name: 'Mushroom Tikka', qty: 1, department: 'grill', done: true },
    ],
  },
  {
    id: 'kds-recent-8',
    tableNumber: 'Takeaway Counter',
    orderNumber: '#96',
    orderType: 'takeaway',
    serverName: 'Main Counter',
    elapsedSeconds: 180,
    completedAt: '06:20 PM',
    status: 'completed',
    items: [
      { id: 'r8-1', name: 'Pav Bhaji Special', qty: 2, department: 'main', customization: 'Extra Butter', done: true },
      { id: 'r8-2', name: 'Sweet Corn Soup', qty: 1, department: 'curry', done: true },
      { id: 'r8-3', name: 'Salted Lassi', qty: 2, department: 'main', done: true },
    ],
  },
];

export const LiveViewPage: React.FC<LiveViewPageProps> = ({
  tables,
  onBackToTables,
  onNavigateToBilling,
  onSettleTable,
  initialTab,
  initialKdsMode,
}) => {
  // Active Tab: 'order-view' or 'kot-view'
  const [activeTab, setActiveTab] = useState<'order-view' | 'kot-view'>(initialTab || 'order-view');

  // Search query (shared or per tab)
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Day-wise Date Filter: 'today' | 'yesterday' | '7days' | '1month' | 'custom'
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('today');
  const [customFromDate, setCustomFromDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [customToDate, setCustomToDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  // 2. Kitchen Departments Filter: 'tandoor' | 'curry' | 'grill' | 'main'
  const [selectedDepartments, setSelectedDepartments] = useState<KitchenDepartment[]>([
    'tandoor',
    'curry',
    'grill',
    'main',
  ]);

  // 3. Order Type Filters: 'Dine In' | 'Delivery' | 'Pickup'
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Dine In', 'Delivery', 'Pickup']);

  // Filter Popover Open State
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);

  // Tickets state for Order View
  const [servedOrders, setServedOrders] = useState<ServedOrderTicket[]>(INITIAL_SERVED_ORDERS);

  // Tickets state for Kot View (KDS UI)
  const [kdsTickets, setKdsTickets] = useState<KdsTicketData[]>(INITIAL_KDS_KOTS);
  const [recentKdsTickets, setRecentKdsTickets] = useState<KdsTicketData[]>(INITIAL_KDS_RECENT_TICKETS);
  const [kdsViewMode, setKdsViewMode] = useState<'live' | 'recent'>(initialKdsMode || 'live');

  // Sync props changes if navigated from header
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (initialKdsMode) {
      setKdsViewMode(initialKdsMode);
    }
  }, [initialKdsMode]);

  // Settle Payment Modal state
  const [settlingOrder, setSettlingOrder] = useState<ServedOrderTicket | null>(null);
  const [paymentMode, setPaymentMode] = useState<'cash' | 'card' | 'upi' | 'split'>('cash');
  const [receivedCash, setReceivedCash] = useState<string>('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Live timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setServedOrders((prev) =>
        prev.map((o) => ({ ...o, elapsedSeconds: o.elapsedSeconds + 1 }))
      );
      setKdsTickets((prev) =>
        prev.map((k) => ({ ...k, elapsedSeconds: k.elapsedSeconds + 1 }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle order type filter
  const toggleTypeFilter = (type: string) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length === 1) return;
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  // Toggle kitchen department filter
  const toggleDepartmentFilter = (dept: KitchenDepartment) => {
    if (selectedDepartments.includes(dept)) {
      if (selectedDepartments.length === 1) return; // keep at least 1
      setSelectedDepartments(selectedDepartments.filter((d) => d !== dept));
    } else {
      setSelectedDepartments([...selectedDepartments, dept]);
    }
  };

  // Reset all filters to default
  const handleResetFilters = () => {
    setDateFilter('today');
    setSelectedDepartments(['tandoor', 'curry', 'grill', 'main']);
    setSelectedTypes(['Dine In', 'Delivery', 'Pickup']);
    showToast('Filters reset to default');
  };

  // Count active filter deviations from default
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (dateFilter !== 'today') count++;
    if (selectedDepartments.length < 4) count++;
    if (selectedTypes.length < 3) count++;
    return count;
  }, [dateFilter, selectedDepartments, selectedTypes]);

  // Filter served orders for Order View
  const filteredServedOrders = useMemo(() => {
    return servedOrders.filter((ord) => {
      // 1. Order Type filter
      if (!selectedTypes.includes(ord.orderType)) return false;

      // 2. Department filter: show order if any item matches selected departments
      if (selectedDepartments.length < 4) {
        const hasMatchingDept = ord.items.some((item) =>
          item.department ? selectedDepartments.includes(item.department) : true
        );
        if (!hasMatchingDept) return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesBill = ord.billNo.toLowerCase().includes(q);
        const matchesTable = ord.tableId.toLowerCase().includes(q);
        const matchesKot = ord.kotNo.toLowerCase().includes(q);
        const matchesItem = ord.items.some((it) => it.name.toLowerCase().includes(q));
        if (!matchesBill && !matchesTable && !matchesKot && !matchesItem) return false;
      }
      return true;
    });
  }, [servedOrders, selectedTypes, selectedDepartments, searchQuery]);

  // Filter KDS tickets for Kot View
  const currentKdsList = kdsViewMode === 'live' ? kdsTickets : recentKdsTickets;
  const filteredKdsTickets = useMemo(() => {
    return currentKdsList.filter((ticket) => {
      // 1. Kitchen Department filter
      if (selectedDepartments.length < 4) {
        if (selectedDepartments.length === 0) return false;
        const hasMatchingDept = ticket.items.some((item) =>
          selectedDepartments.includes(item.department)
        );
        if (!hasMatchingDept) return false;
      }

      // 2. Order type filter (Dine In, Delivery, Pickup)
      const mappedType = ticket.orderType === 'dine-in' ? 'Dine In' : ticket.orderType === 'takeaway' ? 'Pickup' : 'Delivery';
      if (!selectedTypes.includes(mappedType)) return false;

      // 3. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTable = ticket.tableNumber.toLowerCase().includes(q);
        const matchesOrder = ticket.orderNumber.toLowerCase().includes(q);
        const matchesItem = ticket.items.some((it) => it.name.toLowerCase().includes(q));
        if (!matchesTable && !matchesOrder && !matchesItem) return false;
      }

      return true;
    });
  }, [currentKdsList, selectedDepartments, selectedTypes, searchQuery]);

  // Settle bill action
  const handleConfirmSettlement = () => {
    if (!settlingOrder) return;
    showToast(`Bill #${settlingOrder.billNo} Settled (₹${settlingOrder.totalAmount.toFixed(2)} via ${paymentMode.toUpperCase()})`);
    if (onSettleTable) {
      onSettleTable(settlingOrder.tableId, paymentMode);
    }
    setServedOrders((prev) => prev.filter((o) => o.id !== settlingOrder.id));
    setSettlingOrder(null);
  };

  // KDS Ticket Actions
  const handleStartKdsTicket = (ticketId: string) => {
    setKdsTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'cooking' } : t))
    );
    showToast(`Order #${ticketId.replace('kds-tbl-', '')} is now Preparing`);
  };

  const handleReadyKdsTicket = (ticketId: string) => {
    const target = kdsTickets.find((t) => t.id === ticketId);
    if (!target) return;

    const completedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const completedTicket: KdsTicketData = {
      ...target,
      status: 'completed',
      completedAt: completedTime,
      items: target.items.map((it) => ({ ...it, done: true })),
    };

    setKdsTickets((prev) => prev.filter((t) => t.id !== ticketId));
    setRecentKdsTickets((prev) => [completedTicket, ...prev]);

    // Also add to Served Orders awaiting settlement in Order View
    const newItems = target.items.map((it) => ({
      name: it.name,
      qty: it.qty,
      price: 180,
      customization: it.customization,
      department: it.department,
    }));
    const totalAmt = newItems.reduce((acc, it) => acc + it.price * it.qty, 0);

    const newServedOrder: ServedOrderTicket = {
      id: `ord-${Date.now().toString().slice(-4)}`,
      billNo: `57${Math.floor(7 + Math.random() * 20)}`,
      tableId: target.tableNumber.replace('Table ', 'T'),
      kotNo: target.orderNumber.replace('#', ''),
      orderType: target.orderType === 'dine-in' ? 'Dine In' : target.orderType === 'takeaway' ? 'Pickup' : 'Delivery',
      billerName: target.serverName || 'Captain Ramesh',
      durationMinutes: Math.floor(target.elapsedSeconds / 60),
      elapsedSeconds: target.elapsedSeconds,
      totalAmount: totalAmt,
      items: newItems,
    };
    setServedOrders((prev) => [newServedOrder, ...prev]);

    showToast(`${target.tableNumber} Food is Ready! Moved to Recent & Order View`);
  };

  const handleRecallKdsTicket = (ticketId: string) => {
    const target = recentKdsTickets.find((t) => t.id === ticketId);
    if (!target) return;

    const recalledTicket: KdsTicketData = {
      ...target,
      status: 'cooking',
    };

    setRecentKdsTickets((prev) => prev.filter((t) => t.id !== ticketId));
    setKdsTickets((prev) => [recalledTicket, ...prev]);
    showToast(`${target.tableNumber} Recalled back to Live Screen`);
  };

  const handleToggleKdsItem = (ticketId: string, itemId: string) => {
    const updater = (list: KdsTicketData[]) =>
      list.map((t) => {
        if (t.id !== ticketId) return t;
        const updatedItems = t.items.map((item) =>
          item.id === itemId ? { ...item, done: !item.done } : item
        );
        return { ...t, items: updatedItems };
      });

    if (kdsViewMode === 'live') {
      setKdsTickets(updater);
    } else {
      setRecentKdsTickets(updater);
    }
  };

  const getDepartmentTitle = (dept: KitchenDepartment): string => {
    switch (dept) {
      case 'tandoor':
        return 'Tandoor';
      case 'curry':
        return 'Curry';
      case 'grill':
        return 'Grill';
      case 'main':
        return 'Main Course';
      default:
        return dept;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f7f4ed] h-[calc(100vh-56px)] overflow-hidden select-none text-stone-800 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 right-4 z-50 bg-[#731b21] text-[#fdfaf6] text-xs font-semibold px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 border border-amber-300/40 animate-slideIn">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Backdrop to close filter dropdown when clicked outside */}
      {isFilterDropdownOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/10 backdrop-blur-2xs"
          onClick={() => setIsFilterDropdownOpen(false)}
        />
      )}

      {/* ========================================================= */}
      {/* TOP SUB-BAR: Clean layout with Order View & Kot View      */}
      {/* Kitchen department buttons removed from header            */}
      {/* Filter Popover includes Date, Department, and Order Type  */}
      {/* ========================================================= */}
      <div className="bg-[#fdfaf6] border-b border-[#ded5c2] px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 shadow-2xs z-40 relative">
        
        {/* Left: View Tabs (Order View & Kot View) colored in #731b21 when active */}
        <div className="flex items-center gap-2">
          
          <button
            onClick={() => {
              setActiveTab('order-view');
              setIsFilterDropdownOpen(false);
            }}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
              activeTab === 'order-view'
                ? 'bg-[#731b21] text-[#fdfaf6] border border-[#731b21]'
                : 'bg-white hover:bg-stone-50 text-stone-700 border border-[#ded5c2]'
            }`}
          >
            Order View
          </button>

          <button
            onClick={() => {
              setActiveTab('kot-view');
              setIsFilterDropdownOpen(false);
            }}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
              activeTab === 'kot-view'
                ? 'bg-[#731b21] text-[#fdfaf6] border border-[#731b21]'
                : 'bg-white hover:bg-stone-50 text-stone-700 border border-[#ded5c2]'
            }`}
          >
            Kot View
          </button>
        </div>

        {/* Right Controls: Search + Refresh + Comprehensive Filter Dropdown + (Recent toggle in Kot View) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          
          {/* Search Box */}
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'order-view' ? 'Please enter order no.' : 'Enter kot/Order no.'}
              className="w-40 sm:w-52 h-8 pl-3 pr-12 text-xs bg-white text-stone-800 rounded-lg border border-[#ded5c2] focus:border-[#731b21] focus:outline-none placeholder:text-stone-400 font-medium shadow-2xs"
            />
            <span className="absolute right-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-[#731b21] pointer-events-none">
              MFR
            </span>
          </div>

          {/* Refresh button */}
          <button
            onClick={() => showToast(activeTab === 'order-view' ? 'Orders refreshed' : 'KOTs refreshed')}
            title="Refresh Feed"
            className="p-1.5 rounded-lg bg-white hover:bg-stone-50 text-stone-700 border border-[#ded5c2] transition-all cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-4 h-4 text-stone-600" />
          </button>

          {/* COMPREHENSIVE FILTER DROPDOWN: Day Wise, Kitchen Dept, and Order Type */}
          <div className="relative">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shadow-2xs transition-all active:scale-95 ${
                isFilterDropdownOpen || activeFilterCount > 0
                  ? 'bg-[#731b21] text-[#fdfaf6] border border-[#731b21]'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border border-[#ded5c2]'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#fdfaf6] text-[#731b21] text-[10px] flex items-center justify-center font-bold shadow-2xs">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Filter Popover Dropdown */}
            {isFilterDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-stone-300 p-3.5 z-40 animate-fadeIn space-y-3">
                
                {/* Popover Header */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                    <Filter className="w-3.5 h-3.5 text-[#731b21]" />
                    <span>Filter & Refine</span>
                  </div>
                  <button
                    onClick={() => setIsFilterDropdownOpen(false)}
                    className="p-1 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 1. Day-Wise Filtration */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Date Range</span>
                    <span className="text-[10px] text-[#731b21] font-bold capitalize">
                      {dateFilter === '7days' ? 'Last 7 Days' : dateFilter === '1month' ? 'Last 1 Month' : dateFilter}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1">
                    {[
                      { id: 'today', label: 'Today' },
                      { id: 'yesterday', label: 'Yesterday' },
                      { id: '7days', label: '7 Days' },
                      { id: '1month', label: '1 Month' },
                      { id: 'custom', label: 'Custom' },
                    ].map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setDateFilter(d.id as DateFilterOption)}
                        className={`py-1 px-1.5 rounded-md text-[11px] font-semibold border transition-all cursor-pointer text-center ${
                          dateFilter === d.id
                            ? 'bg-[#731b21] text-[#fdfaf6] border-[#731b21] shadow-2xs font-bold'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom Date Range Inputs */}
                  {dateFilter === 'custom' && (
                    <div className="grid grid-cols-2 gap-2 pt-1.5 bg-[#fdfaf6] p-2 rounded-lg border border-[#e8dfcf]">
                      <div>
                        <label className="text-[9px] text-stone-500 font-bold uppercase block mb-0.5">From Date</label>
                        <input
                          type="date"
                          value={customFromDate}
                          onChange={(e) => setCustomFromDate(e.target.value)}
                          className="w-full h-7 px-2 text-[11px] bg-white border border-stone-300 rounded text-stone-800"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-stone-500 font-bold uppercase block mb-0.5">To Date</label>
                        <input
                          type="date"
                          value={customToDate}
                          onChange={(e) => setCustomToDate(e.target.value)}
                          className="w-full h-7 px-2 text-[11px] bg-white border border-stone-300 rounded text-stone-800"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Kitchen Department Wise Filtration */}
                <div className="space-y-1.5 pt-2 border-t border-stone-100">
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Kitchen Departments</span>
                    <button
                      onClick={() => {
                        if (selectedDepartments.length === 4) {
                          setSelectedDepartments([]);
                        } else {
                          setSelectedDepartments(['tandoor', 'curry', 'grill', 'main']);
                        }
                      }}
                      className="text-[10px] text-[#731b21] font-bold hover:underline cursor-pointer"
                    >
                      {selectedDepartments.length === 4 ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'tandoor', label: 'Tandoor' },
                      { id: 'curry', label: 'Curry' },
                      { id: 'grill', label: 'Grill' },
                      { id: 'main', label: 'Main Course' },
                    ].map((dept) => {
                      const isSelected = selectedDepartments.includes(dept.id as KitchenDepartment);
                      return (
                        <label
                          key={dept.id}
                          onClick={() => toggleDepartmentFilter(dept.id as KitchenDepartment)}
                          className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-amber-50/80 border-[#731b21] text-[#731b21]'
                              : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="accent-[#731b21] w-3.5 h-3.5 rounded cursor-pointer"
                          />
                          <span>{dept.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Order Type Filtration */}
                <div className="space-y-1.5 pt-2 border-t border-stone-100">
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                    Order Type
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Dine In', 'Delivery', 'Pickup'].map((type) => {
                      const isSelected = selectedTypes.includes(type);
                      return (
                        <label
                          key={type}
                          onClick={() => toggleTypeFilter(type)}
                          className={`flex items-center justify-center gap-1.5 py-1 px-1 rounded-lg border text-xs font-semibold cursor-pointer transition-all text-center ${
                            isSelected
                              ? 'bg-amber-50/80 border-[#731b21] text-[#731b21]'
                              : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="accent-[#731b21] w-3.5 h-3.5 rounded cursor-pointer"
                          />
                          <span>{type}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Popover Footer */}
                <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                  <button
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
                  >
                    Reset All
                  </button>
                  <button
                    onClick={() => {
                      setIsFilterDropdownOpen(false);
                      showToast('Filters applied');
                    }}
                    className="px-4 py-1.5 rounded-lg bg-[#731b21] text-[#fdfaf6] text-xs font-bold shadow-xs hover:bg-[#5b1419] cursor-pointer"
                  >
                    Apply Filters
                  </button>
                </div>

              </div>
            )}
          </div>

          {/* Recent / Back to Live Button (in Kot View) */}
          {activeTab === 'kot-view' && (
            <button
              onClick={() => setKdsViewMode(kdsViewMode === 'live' ? 'recent' : 'live')}
              className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold active:scale-98 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                kdsViewMode === 'live'
                  ? 'bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] border border-[#731b21]'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-[#fdfaf6] font-bold shadow-md ring-2 ring-emerald-400/40'
              }`}
            >
              {kdsViewMode === 'live' ? (
                <>
                  <Clock className="w-3.5 h-3.5 text-[#fdfaf6]" />
                  <span className="text-[#fdfaf6]">Recent</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5 text-[#fdfaf6]" />
                  <span className="text-[#fdfaf6]">Back to Live</span>
                </>
              )}
            </button>
          )}

        </div>

      </div>

      {/* ========================================================= */}
      {/* MAIN VIEW AREA                                            */}
      {/* ========================================================= */}
      {activeTab === 'order-view' ? (
        /* ========================================================= */
        /* TAB 1: ORDER VIEW (Served Orders Pending Payment)         */
        /* ========================================================= */
        <div className="flex-1 overflow-y-auto p-3 sm:p-5">
          {filteredServedOrders.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-8 bg-white/70 rounded-2xl border border-dashed border-[#ded5c2]">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3 text-emerald-800">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 mb-1">
                All served orders are fully settled!
              </h3>
              <p className="text-xs text-stone-500 max-w-sm">
                When a KOT order is prepared and served, it will appear here for payment settlement.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
              {filteredServedOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-[#ded5c2] shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  
                  {/* Ticket Header */}
                  <div className="bg-[#dcfce7] border-b border-[#bbf7d0] px-3.5 py-2.5 flex items-center justify-between text-stone-900">
                    <div>
                      <div className="text-sm sm:text-base font-black tracking-tight text-emerald-950">
                        BILL: {order.billNo}
                      </div>
                      <div className="text-[10px] text-emerald-800 font-medium">
                        जेवण रेस्टॉरंट · Station-01
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-[#22c55e] text-white flex items-center justify-center shadow-2xs">
                      <Utensils className="w-4 h-4" />
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black tracking-tight text-emerald-950">
                        TABLE : {order.tableId} | KOT: {order.kotNo}
                      </div>
                      <div className="text-[10px] text-emerald-800 font-bold">
                        {order.orderType}
                      </div>
                    </div>
                  </div>

                  {/* Ticket Body */}
                  <div className="p-3.5 space-y-2.5 text-xs">
                    
                    <div className="flex items-center gap-1.5 text-stone-600 font-medium pb-2 border-b border-stone-100">
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      <span>{order.billerName}</span>
                    </div>

                    <div className="flex items-center justify-between font-bold text-stone-800">
                      <span>Order Details ({order.items.length} {order.items.length === 1 ? 'Item' : 'Items'})</span>
                      <span className="text-sm font-black text-[#731b21]">₹{order.totalAmount.toFixed(2)}</span>
                    </div>

                    <div className="space-y-1.5 pt-0.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="leading-tight">
                          <div className="flex items-baseline justify-between font-semibold text-stone-900">
                            <span>{item.qty} × {item.name}</span>
                            <span className="font-mono text-stone-500">₹{item.price * item.qty}</span>
                          </div>
                          {item.customization && (
                            <div className="text-[10px] text-stone-500 italic pl-3 mt-0.5">
                              {item.customization}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Ticket Footer */}
                  <div className="px-3.5 py-2.5 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between">
                    
                    <div className="font-mono text-xs font-bold text-stone-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{formatTime(order.elapsedSeconds)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (onNavigateToBilling) {
                            const tbl = tables?.find((t) => t.id === order.tableId);
                            onNavigateToBilling(tbl);
                          }
                        }}
                        title="Open in POS Billing Screen"
                        className="p-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-600 border border-stone-200 transition-all cursor-pointer shadow-2xs"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          setSettlingOrder(order);
                          setReceivedCash(order.totalAmount.toString());
                        }}
                        className="px-4 py-1.5 rounded-lg bg-[#334155] hover:bg-[#1e293b] text-white text-xs font-bold tracking-wide shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Settle</span>
                      </button>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ========================================================= */
        /* TAB 2: KOT VIEW (Matching KDS UI, Cleaned-up Header)      */
        /* 8-Ticket Grid (No scroll) + #fdfaf6->#CC7722 header +     */
        /* Preparing status + #fdfaf6 department division +          */
        /* #731b21 Start button + #55E07E Ready button               */
        /* ========================================================= */
        <div className="flex-1 p-2 sm:p-2.5 overflow-hidden flex flex-col min-h-0">
          {/* Banner indicator when in Recent KOTs mode */}
          {kdsViewMode === 'recent' && (
            <div className="mb-2 px-3 py-1.5 bg-amber-50/90 border border-amber-200/90 rounded-lg flex items-center justify-between shadow-2xs flex-shrink-0 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-xs font-bold text-amber-950">
                  Recent KOTs (Served &amp; Dispatched Orders History)
                </span>
                <span className="hidden sm:inline text-[11px] text-stone-500 font-medium">
                  Showing latest 8 completed KOT tickets
                </span>
              </div>
              <button
                onClick={() => setKdsViewMode('live')}
                className="px-2.5 py-1 rounded bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-bold transition-all shadow-2xs flex items-center gap-1 active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-[#fdfaf6]" />
                <span>Back to Live Screen</span>
              </button>
            </div>
          )}

          {filteredKdsTickets.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white/80 rounded-xl border border-dashed border-[#ded5c2]">
              <h3 className="text-sm font-bold text-stone-900 mb-1">
                {kdsViewMode === 'live'
                  ? 'All KOT orders are cleared for selected filters!'
                  : 'No recent served orders found'}
              </h3>
              {kdsViewMode === 'recent' && (
                <button
                  onClick={() => setKdsViewMode('live')}
                  className="mt-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
                >
                  Back to Live Screen
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-2 sm:gap-2.5 h-full w-full">
              {filteredKdsTickets.slice(0, 8).map((ticket) => {
                const isCooking = ticket.status === 'cooking';
                const isCompleted = ticket.status === 'completed';

                let headerBgClass = 'bg-[#fdfaf6] text-[#731b21] border-b border-[#e5dccb]';
                let tableTextClass = 'text-[#731b21]';
                let timerTextClass = 'text-[#731b21]';
                let orderMetaClass = 'text-stone-600';

                if (isCooking) {
                  headerBgClass = 'bg-[#CC7722] text-[#fdfaf6] border-b border-[#b5671a] shadow-xs';
                  tableTextClass = 'text-[#fdfaf6] drop-shadow-xs';
                  timerTextClass = 'text-[#fdfaf6]';
                  orderMetaClass = 'text-[#fdfaf6]/90';
                } else if (isCompleted) {
                  headerBgClass = 'bg-stone-700 text-[#fdfaf6] border-b border-stone-800';
                  tableTextClass = 'text-[#fdfaf6]';
                  timerTextClass = 'text-[#fdfaf6]';
                  orderMetaClass = 'text-[#fdfaf6]/80';
                }

                const cardBorder = isCooking
                  ? 'border-2 border-[#CC7722] shadow-sm ring-1 ring-[#CC7722]/30'
                  : 'border border-[#ded5c2] shadow-xs';

                // Items filtered by selected departments if not all selected
                const itemsToRender = selectedDepartments.length < 4
                  ? ticket.items.filter((it) => selectedDepartments.includes(it.department))
                  : ticket.items;

                const departmentsInTicket = Array.from(
                  new Set(itemsToRender.map((it) => it.department))
                );

                return (
                  <div
                    key={ticket.id}
                    className={`rounded-lg overflow-hidden bg-white flex flex-col justify-between h-full transition-all ${cardBorder}`}
                  >
                    
                    {/* Header: Displays Preparing badge on ticket when cooking */}
                    <div className={`px-2.5 py-1.5 sm:py-2 flex items-center justify-between flex-shrink-0 transition-colors ${headerBgClass}`}>
                      <div className="flex flex-col leading-tight">
                        <div className="flex items-center gap-1.5">
                          <h3 className={`text-sm sm:text-base font-black tracking-tight ${tableTextClass}`}>
                            {ticket.tableNumber}
                          </h3>
                          {isCooking && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold uppercase bg-white/20 text-[#fdfaf6] border border-white/40 tracking-wider flex items-center gap-1 shadow-2xs animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-white" />
                              Preparing
                            </span>
                          )}
                        </div>
                        <div className={`text-[10px] font-medium ${orderMetaClass}`}>
                          <span>{ticket.orderNumber}</span>
                          <span> · </span>
                          <span className="capitalize">{ticket.orderType}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        {isCompleted ? (
                          <div className="text-right">
                            <span className="text-[9px] font-bold uppercase tracking-wider block opacity-75">Served</span>
                            <span className="font-mono font-bold text-xs">{ticket.completedAt}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-end">
                            <span className={`font-mono font-black text-sm sm:text-base tracking-tight leading-none ${timerTextClass}`}>
                              {formatTime(ticket.elapsedSeconds)}
                            </span>
                            {!isCooking && (
                              <span className="text-[8px] font-bold uppercase tracking-wider opacity-70 mt-0.5">
                                Waiting
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Body: Department division background #fdfaf6 */}
                    <div className="px-2.5 py-1.5 flex-1 overflow-y-auto min-h-0 space-y-1.5 bg-[#ffffff]">
                      {departmentsInTicket.map((dept) => {
                        const deptItems = itemsToRender.filter((it) => it.department === dept);

                        return (
                          <div key={dept} className="space-y-1">
                            
                            {/* Department Header with background #fdfaf6 */}
                            <div className="bg-[#fdfaf6] px-2 py-0.5 rounded border border-[#e8dfcf] flex items-center justify-between shadow-2xs">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#731b21] flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#731b21]" />
                                {getDepartmentTitle(dept)}
                              </span>
                              <span className="text-[9px] font-mono font-bold text-stone-600">
                                {deptItems.length} {deptItems.length === 1 ? 'item' : 'items'}
                              </span>
                            </div>

                            {/* Items List */}
                            <div className="space-y-1 px-0.5">
                              {deptItems.map((item) => (
                                <div
                                  key={item.id}
                                  onClick={() => handleToggleKdsItem(ticket.id, item.id)}
                                  title="Click to strike / mark item done"
                                  className={`cursor-pointer group flex items-start justify-between py-0.5 rounded transition-all hover:bg-stone-50 ${
                                    item.done ? 'opacity-40' : ''
                                  }`}
                                >
                                  <div className="flex-1 pr-1.5 leading-tight">
                                    <div className="flex items-baseline gap-1.5">
                                      <span className="text-[#731b21] font-black text-xs sm:text-sm leading-none">
                                        {item.qty}×
                                      </span>
                                      <span
                                        className={`text-xs font-bold text-stone-900 group-hover:text-[#731b21] transition-colors ${
                                          item.done ? 'line-through text-stone-400' : ''
                                        }`}
                                      >
                                        {item.name}
                                      </span>
                                    </div>
                                    {item.customization && (
                                      <div className="text-[10px] text-stone-500 font-normal pl-4 italic leading-tight">
                                        {item.customization}
                                      </div>
                                    )}
                                  </div>

                                  <div className="pt-0.5 flex-shrink-0">
                                    <span
                                      className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
                                        item.done
                                          ? 'bg-emerald-600 border-emerald-600 text-white'
                                          : 'border-stone-300 group-hover:border-stone-400'
                                      }`}
                                    >
                                      {item.done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>

                          </div>
                        );
                      })}
                    </div>

                    {/* Footer: Action button (Start: #731b21, Ready: #55E07E) */}
                    <div className="p-1.5 bg-[#ffffff] border-t border-stone-100 flex-shrink-0">
                      {isCompleted ? (
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => showToast(`Reprinting KOT ${ticket.orderNumber} for ${ticket.tableNumber}...`)}
                            className="py-1 px-2 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-bold flex items-center justify-center gap-1 transition-all active:scale-98 cursor-pointer border border-stone-300 shadow-2xs"
                          >
                            <Printer className="w-3 h-3 text-stone-700" />
                            <span>Reprint KOT</span>
                          </button>
                          <button
                            onClick={() => handleRecallKdsTicket(ticket.id)}
                            className="py-1 px-2 rounded-md bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-[11px] font-bold flex items-center justify-center gap-1 transition-all active:scale-98 cursor-pointer shadow-2xs"
                          >
                            <RotateCcw className="w-3 h-3 text-[#fdfaf6]" />
                            <span>Recall</span>
                          </button>
                        </div>
                      ) : isCooking ? (
                        <button
                          onClick={() => handleReadyKdsTicket(ticket.id)}
                          className="w-full py-1.5 rounded-md bg-[#55E07E] hover:bg-[#46cc6e] text-emerald-950 font-black text-xs tracking-wide shadow-2xs hover:shadow-xs transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 border border-emerald-400/40"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Ready</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartKdsTicket(ticket.id)}
                          className="w-full py-1.5 rounded-md bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-bold tracking-wide shadow-2xs hover:shadow-xs transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1"
                        >
                          <span>Start</span>
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* PAYMENT SETTLEMENT MODAL (Settle Down Payment)             */}
      {/* ========================================================= */}
      {settlingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs select-none animate-fadeIn">
          <div className="bg-[#fdfaf6] w-full max-w-lg rounded-2xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-maroon-900 to-maroon-800 px-5 py-3.5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-300" />
                  <span>Settle Bill #{settlingOrder.billNo} · Table {settlingOrder.tableId}</span>
                </h3>
                <span className="text-[11px] text-amber-100 opacity-90">
                  {settlingOrder.orderType} · Server: {settlingOrder.billerName}
                </span>
              </div>
              <button
                onClick={() => setSettlingOrder(null)}
                className="p-1 rounded-full text-stone-300 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              
              {/* Grand Total Display */}
              <div className="bg-white p-4 rounded-xl border border-[#ded5c2] flex items-center justify-between shadow-2xs">
                <div>
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                    Amount to Settle
                  </span>
                  <span className="text-2xl font-black text-[#731b21]">
                    ₹{settlingOrder.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-500 font-mono">
                    Total Items: {settlingOrder.items.length}
                  </span>
                </div>
              </div>

              {/* Payment Mode Selection */}
              <div>
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 block">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => setPaymentMode('cash')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      paymentMode === 'cash'
                        ? 'bg-amber-50 border-maroon-800 text-maroon-950 font-bold shadow-xs ring-1 ring-maroon-800'
                        : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs">Cash</span>
                  </button>

                  <button
                    onClick={() => setPaymentMode('card')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      paymentMode === 'card'
                        ? 'bg-amber-50 border-maroon-800 text-maroon-950 font-bold shadow-xs ring-1 ring-maroon-800'
                        : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span className="text-xs">Card</span>
                  </button>

                  <button
                    onClick={() => setPaymentMode('upi')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      paymentMode === 'upi'
                        ? 'bg-amber-50 border-maroon-800 text-maroon-950 font-bold shadow-xs ring-1 ring-maroon-800'
                        : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-purple-600" />
                    <span className="text-xs">UPI / QR</span>
                  </button>

                  <button
                    onClick={() => setPaymentMode('split')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      paymentMode === 'split'
                        ? 'bg-amber-50 border-maroon-800 text-maroon-950 font-bold shadow-xs ring-1 ring-maroon-800'
                        : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 text-amber-600" />
                    <span className="text-xs">Split</span>
                  </button>
                </div>
              </div>

              {/* Cash Denominations (if cash selected) */}
              {paymentMode === 'cash' && (
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-600 mb-1.5">
                    <span>Cash Tendered</span>
                    <span>Change: ₹{Math.max(0, Number(receivedCash) - settlingOrder.totalAmount).toFixed(2)}</span>
                  </div>
                  <input
                    type="number"
                    value={receivedCash}
                    onChange={(e) => setReceivedCash(e.target.value)}
                    className="w-full h-10 px-3 text-base font-bold bg-white text-stone-900 rounded-lg border border-stone-300 focus:border-maroon-800 focus:outline-none"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => setReceivedCash(settlingOrder.totalAmount.toString())}
                      className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700 cursor-pointer"
                    >
                      Exact (₹{settlingOrder.totalAmount})
                    </button>
                    <button
                      onClick={() => setReceivedCash((Math.ceil(settlingOrder.totalAmount / 100) * 100).toString())}
                      className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700 cursor-pointer"
                    >
                      Round 100
                    </button>
                    <button
                      onClick={() => setReceivedCash((Math.ceil(settlingOrder.totalAmount / 500) * 500).toString())}
                      className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700 cursor-pointer"
                    >
                      Round 500
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 bg-stone-100/70 border-t border-stone-200 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setSettlingOrder(null)}
                className="px-4 py-2 rounded-lg bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSettlement}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-maroon-900 to-maroon-800 hover:from-maroon-950 hover:to-maroon-900 text-white text-xs font-bold tracking-wide shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Confirm & Settle Payment</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  Printer,
  FileText,
  UtensilsCrossed,
  Bike,
  ShoppingBag,
  Layers,
  Clock,
  Calendar,
  User,
  Phone,
  MapPin,
  CheckCircle,
  Eye,
  Receipt,
  Download,
  X,
  Share2
} from 'lucide-react';
import logoUrl from '../assets/logo.png';
import { Table, OrderItem } from '../types/pos';

export type DateFilterPeriod = 'today' | 'yesterday' | '7days' | '1month' | '6months' | 'custom';

export interface KotPrintRecord {
  id: string;
  kotNo: string;
  billNo: string;
  tableId: string;
  tableOrChannel: string;
  floorZone: string;
  orderType: 'Dine In' | 'Delivery' | 'Pick Up';
  seatedAt: string;
  time: string;
  dateStr: string;
  dateIso: string;
  periodCategory: DateFilterPeriod;
  serverName: string;
  billerName: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  notes?: string;
  paymentType: 'Cash' | 'Card' | 'Online/UPI' | 'Due' | 'Split';
  status: 'printed' | 'saved' | 'paid';
  subtotal: number;
  cgst: number;
  sgst: number;
  discount: number;
  grandTotal: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    category?: string;
    notes?: string;
    customization?: string;
  }>;
}

interface BillKotPrintPageProps {
  tables?: Table[];
  onBack: () => void;
  onNavigateToBilling?: (table?: Table) => void;
  onPrintBill?: (table: Table) => void;
}

const HISTORICAL_KOT_RECORDS: KotPrintRecord[] = [
  // Today's records (2026-11-07)
  {
    id: 'kot-rec-408',
    kotNo: 'KOT-408',
    billNo: 'B-1042',
    tableId: 'A1',
    tableOrChannel: 'Table A1',
    floorZone: 'AC Hall',
    orderType: 'Dine In',
    seatedAt: '07:18 PM',
    time: '07:18 PM',
    dateStr: 'Today, 07 Nov 2026',
    dateIso: '2026-11-07',
    periodCategory: 'today',
    serverName: 'Captain Rahul',
    billerName: 'Cashier 1',
    customerName: 'Ramesh Patil',
    customerPhone: '+91 98220 12345',
    customerAddress: 'Near Shivajinagar Station, Pune',
    notes: 'Regular guest - Preferred less spicy',
    paymentType: 'Due',
    status: 'printed',
    subtotal: 1295.24,
    cgst: 32.38,
    sgst: 32.38,
    discount: 0,
    grandTotal: 1360.00,
    items: [
      { id: 'it-1', name: 'Mexican Farm House (Large 11")', quantity: 1, price: 649, category: 'Freshly Made Pizzas', customization: 'Extra Cheese, Thin Crust' },
      { id: 'it-2', name: 'Margherita Regular', quantity: 2, price: 239, category: 'Freshly Made Pizzas', notes: 'Well baked' },
      { id: 'it-3', name: 'Chilled Solkadhi Glass', quantity: 2, price: 80, category: 'Beverages', notes: 'Extra cold' }
    ]
  },
  {
    id: 'kot-rec-407',
    kotNo: 'KOT-407',
    billNo: 'B-1041',
    tableId: 'G3',
    tableOrChannel: 'Table G3',
    floorZone: 'Garden Area',
    orderType: 'Dine In',
    seatedAt: '06:50 PM',
    time: '06:50 PM',
    dateStr: 'Today, 07 Nov 2026',
    dateIso: '2026-11-07',
    periodCategory: 'today',
    serverName: 'Captain Vikas',
    billerName: 'Cashier 2',
    customerName: 'Pooja Kulkarni',
    customerPhone: '+91 94223 99881',
    customerAddress: 'Prabhat Road, Deccan, Pune',
    notes: 'Family dinner table',
    paymentType: 'Online/UPI',
    status: 'paid',
    subtotal: 847.62,
    cgst: 21.19,
    sgst: 21.19,
    discount: 0,
    grandTotal: 890.00,
    items: [
      { id: 'it-4', name: 'Paneer Tikka Masala Handi', quantity: 1, price: 320, category: 'Main Course', notes: 'Medium Gravy' },
      { id: 'it-5', name: 'Butter Naan Basket', quantity: 3, price: 60, category: 'Breads' },
      { id: 'it-6', name: 'Jeera Rice Special', quantity: 1, price: 190, category: 'Rice' },
      { id: 'it-7', name: 'Masala Papad Crispy', quantity: 4, price: 50, category: 'Starters' }
    ]
  },
  {
    id: 'kot-rec-406',
    kotNo: 'KOT-406',
    billNo: 'B-1040',
    tableId: 'KL16',
    tableOrChannel: 'Table KL16',
    floorZone: 'Non-AC',
    orderType: 'Dine In',
    seatedAt: '06:20 PM',
    time: '06:20 PM',
    dateStr: 'Today, 07 Nov 2026',
    dateIso: '2026-11-07',
    periodCategory: 'today',
    serverName: 'Mahesh G.',
    billerName: 'Cashier 1',
    paymentType: 'Cash',
    status: 'printed',
    subtotal: 438.10,
    cgst: 10.95,
    sgst: 10.95,
    discount: 0,
    grandTotal: 460.00,
    items: [
      { id: 'it-8', name: 'Pav Bhaji Special', quantity: 2, price: 150, category: 'Street Food', notes: 'Extra Butter Pav' },
      { id: 'it-9', name: 'Masala Chaas Pot', quantity: 2, price: 80, category: 'Beverages' }
    ]
  },
  {
    id: 'kot-rec-405',
    kotNo: 'KOT-405',
    billNo: 'B-1039',
    tableId: 'DEL-7',
    tableOrChannel: 'Delivery #7',
    floorZone: 'Swiggy Online',
    orderType: 'Delivery',
    seatedAt: '05:45 PM',
    time: '05:45 PM',
    dateStr: 'Today, 07 Nov 2026',
    dateIso: '2026-11-07',
    periodCategory: 'today',
    serverName: 'Online Dispatcher',
    billerName: 'Swiggy Bridge',
    customerName: 'Sameer Khan',
    customerPhone: '+91 97654 32100',
    customerAddress: 'Flat 304, Model Colony, Pune',
    notes: 'Leave parcel at front security desk',
    paymentType: 'Online/UPI',
    status: 'paid',
    subtotal: 791.43,
    cgst: 19.78,
    sgst: 19.78,
    discount: 0,
    grandTotal: 831.00,
    items: [
      { id: 'it-10', name: 'Mexican Farm House (Large 11")', quantity: 1, price: 649, category: 'Freshly Made Pizzas' },
      { id: 'it-11', name: 'Garlic Bread Cheese', quantity: 1, price: 182, category: 'Sides' }
    ]
  },
  {
    id: 'kot-rec-404',
    kotNo: 'KOT-404',
    billNo: 'B-1038',
    tableId: 'PU-96',
    tableOrChannel: 'Pick Up #96',
    floorZone: 'Takeaway Counter',
    orderType: 'Pick Up',
    seatedAt: '05:10 PM',
    time: '05:10 PM',
    dateStr: 'Today, 07 Nov 2026',
    dateIso: '2026-11-07',
    periodCategory: 'today',
    serverName: 'Counter Staff',
    billerName: 'Cashier 2',
    customerName: 'Anita Shinde',
    customerPhone: '+91 91234 56789',
    customerAddress: 'FC Road, Pune',
    notes: 'Packing parcel tightly with foil',
    paymentType: 'Cash',
    status: 'saved',
    subtotal: 447.62,
    cgst: 11.19,
    sgst: 11.19,
    discount: 0,
    grandTotal: 470.00,
    items: [
      { id: 'it-12', name: 'Special Maharashtrian Thali', quantity: 1, price: 350, category: 'Thali' },
      { id: 'it-13', name: 'Gulab Jamun Rabdi (2 pcs)', quantity: 1, price: 120, category: 'Dessert' }
    ]
  },

  // Yesterday's records (2026-11-06)
  {
    id: 'kot-rec-398',
    kotNo: 'KOT-398',
    billNo: 'B-1035',
    tableId: 'G2',
    tableOrChannel: 'Table G2',
    floorZone: 'Garden Area',
    orderType: 'Dine In',
    seatedAt: '08:45 PM',
    time: '08:45 PM',
    dateStr: 'Yesterday, 06 Nov 2026',
    dateIso: '2026-11-06',
    periodCategory: 'yesterday',
    serverName: 'Vikas M.',
    billerName: 'Cashier 1',
    customerName: 'Suresh Patil',
    customerPhone: '+91 94220 18833',
    customerAddress: 'Shivajinagar, Pune',
    notes: 'Outdoor family dinner',
    paymentType: 'Card',
    status: 'paid',
    subtotal: 1380.95,
    cgst: 34.52,
    sgst: 34.52,
    discount: 0,
    grandTotal: 1450.00,
    items: [
      { id: 'it-14', name: 'Paneer Butter Masala Handi', quantity: 2, price: 290, category: 'Main Course', notes: 'Medium Spicy' },
      { id: 'it-15', name: 'Butter Naan Basket', quantity: 3, price: 180, category: 'Breads' },
      { id: 'it-16', name: 'Dal Makhani Special', quantity: 1, price: 270, category: 'Main Course' },
      { id: 'it-17', name: 'Steam Basmati Rice', quantity: 1, price: 140, category: 'Rice' }
    ]
  },
  {
    id: 'kot-rec-395',
    kotNo: 'KOT-395',
    billNo: 'B-1031',
    tableId: 'A5',
    tableOrChannel: 'Table A5',
    floorZone: 'AC Hall',
    orderType: 'Dine In',
    seatedAt: '07:20 PM',
    time: '07:20 PM',
    dateStr: 'Yesterday, 06 Nov 2026',
    dateIso: '2026-11-06',
    periodCategory: 'yesterday',
    serverName: 'Captain Ramesh',
    billerName: 'Cashier 2',
    customerName: 'Meera Rao',
    customerPhone: '+91 98221 55667',
    customerAddress: 'Prabhat Road, Pune',
    notes: 'VIP Birthday Celebration Table',
    paymentType: 'Online/UPI',
    status: 'paid',
    subtotal: 2076.19,
    cgst: 51.90,
    sgst: 51.90,
    discount: 0,
    grandTotal: 2180.00,
    items: [
      { id: 'it-18', name: 'Special Maharashtrian Thali', quantity: 4, price: 350, category: 'Thali' },
      { id: 'it-19', name: 'Solkadhi Special Glass', quantity: 4, price: 80, category: 'Beverages', notes: 'Extra Chilled' },
      { id: 'it-20', name: 'Gulab Jamun Rabdi', quantity: 3, price: 120, category: 'Dessert' }
    ]
  },
  {
    id: 'kot-rec-392',
    kotNo: 'KOT-392',
    billNo: 'B-1028',
    tableId: 'DEL-14',
    tableOrChannel: 'Delivery #14',
    floorZone: 'Zomato Online',
    orderType: 'Delivery',
    seatedAt: '06:15 PM',
    time: '06:15 PM',
    dateStr: 'Yesterday, 06 Nov 2026',
    dateIso: '2026-11-06',
    periodCategory: 'yesterday',
    serverName: 'Online Dispatcher',
    billerName: 'Zomato Bridge',
    customerName: 'Nilesh Pawar',
    customerPhone: '+91 98901 23456',
    customerAddress: 'Bhandarkar Road, Pune',
    notes: 'Extra tissue paper & spoon set',
    paymentType: 'Online/UPI',
    status: 'paid',
    subtotal: 590.48,
    cgst: 14.76,
    sgst: 14.76,
    discount: 0,
    grandTotal: 620.00,
    items: [
      { id: 'it-21', name: 'Hyderabadi Veg Biryani Handi', quantity: 1, price: 320, category: 'Rice' },
      { id: 'it-22', name: 'Boondi Raita Bowl', quantity: 1, price: 90, category: 'Sides' },
      { id: 'it-23', name: 'Chilled Cola Can 300ml', quantity: 2, price: 50, category: 'Beverages' }
    ]
  },

  // 7 Days records
  {
    id: 'kot-rec-385',
    kotNo: 'KOT-385',
    billNo: 'B-1021',
    tableId: 'A3',
    tableOrChannel: 'Table A3',
    floorZone: 'AC Hall',
    orderType: 'Dine In',
    seatedAt: '08:15 PM',
    time: '08:15 PM',
    dateStr: '04 Nov 2026',
    dateIso: '2026-11-04',
    periodCategory: '7days',
    serverName: 'Captain Rahul',
    billerName: 'Cashier 1',
    customerName: 'Rajesh Kadam',
    customerPhone: '+91 98220 66778',
    customerAddress: 'Kothrud, Pune',
    paymentType: 'Card',
    status: 'paid',
    subtotal: 1066.67,
    cgst: 26.67,
    sgst: 26.67,
    discount: 0,
    grandTotal: 1120.00,
    items: [
      { id: 'it-24', name: 'Kadhai Paneer Special', quantity: 2, price: 290, category: 'Main Course' },
      { id: 'it-25', name: 'Tandoori Roti Basket', quantity: 6, price: 30, category: 'Breads' },
      { id: 'it-26', name: 'Veg Pulao with Raita', quantity: 1, price: 240, category: 'Rice' }
    ]
  },
  {
    id: 'kot-rec-382',
    kotNo: 'KOT-382',
    billNo: 'B-1018',
    tableId: 'G4',
    tableOrChannel: 'Table G4',
    floorZone: 'Garden Area',
    orderType: 'Dine In',
    seatedAt: '09:10 PM',
    time: '09:10 PM',
    dateStr: '04 Nov 2026',
    dateIso: '2026-11-04',
    periodCategory: '7days',
    serverName: 'Mahesh G.',
    billerName: 'Cashier 1',
    customerName: 'Anil Deshmukh',
    customerPhone: '+91 98223 19082',
    customerAddress: 'Baner Highway, Pune',
    paymentType: 'Online/UPI',
    status: 'paid',
    subtotal: 1561.90,
    cgst: 39.05,
    sgst: 39.05,
    discount: 0,
    grandTotal: 1640.00,
    items: [
      { id: 'it-27', name: 'Mexican Farm House (Large 11")', quantity: 2, price: 649, category: 'Freshly Made Pizzas' },
      { id: 'it-28', name: 'Garlic Bread Cheese', quantity: 1, price: 182, category: 'Sides' },
      { id: 'it-29', name: 'Chilled Cola Can', quantity: 3, price: 50, category: 'Beverages' }
    ]
  },
  {
    id: 'kot-rec-378',
    kotNo: 'KOT-378',
    billNo: 'B-1012',
    tableId: 'NAC1',
    tableOrChannel: 'Table NAC1',
    floorZone: 'Non-AC',
    orderType: 'Dine In',
    seatedAt: '02:15 PM',
    time: '02:15 PM',
    dateStr: '02 Nov 2026',
    dateIso: '2026-11-02',
    periodCategory: '7days',
    serverName: 'Sachin P.',
    billerName: 'Cashier 2',
    customerName: 'Neha Joshi',
    customerPhone: '+91 91580 44556',
    customerAddress: 'Swargate, Pune',
    paymentType: 'Cash',
    status: 'paid',
    subtotal: 847.62,
    cgst: 21.19,
    sgst: 21.19,
    discount: 0,
    grandTotal: 890.00,
    items: [
      { id: 'it-30', name: 'Pav Bhaji Special', quantity: 3, price: 150, category: 'Street Food', notes: 'Extra Butter Pav' },
      { id: 'it-31', name: 'Salted Lassi Handi', quantity: 4, price: 110, category: 'Beverages' }
    ]
  },

  // 1 Month records
  {
    id: 'kot-rec-340',
    kotNo: 'KOT-340',
    billNo: 'B-980',
    tableId: 'T10',
    tableOrChannel: 'Table T10',
    floorZone: 'AC Hall',
    orderType: 'Dine In',
    seatedAt: '08:30 PM',
    time: '08:30 PM',
    dateStr: '22 Oct 2026',
    dateIso: '2026-10-22',
    periodCategory: '1month',
    serverName: 'Captain Ramesh',
    billerName: 'Cashier 1',
    customerName: 'Vikram Singhania',
    customerPhone: '+91 98225 11223',
    customerAddress: 'Aundh, Pune',
    paymentType: 'Card',
    status: 'paid',
    subtotal: 1857.14,
    cgst: 46.43,
    sgst: 46.43,
    discount: 0,
    grandTotal: 1950.00,
    items: [
      { id: 'it-32', name: 'Mutton Sukka Masala', quantity: 2, price: 420, category: 'Main Course' },
      { id: 'it-33', name: 'Jowar Bhakri Fresh', quantity: 6, price: 40, category: 'Breads' },
      { id: 'it-34', name: 'Solkadhi Pitcher', quantity: 1, price: 280, category: 'Beverages' },
      { id: 'it-35', name: 'Indrayani Steamed Rice', quantity: 2, price: 160, category: 'Rice' }
    ]
  },
  {
    id: 'kot-rec-332',
    kotNo: 'KOT-332',
    billNo: 'B-972',
    tableId: 'G1',
    tableOrChannel: 'Table G1',
    floorZone: 'Garden Area',
    orderType: 'Dine In',
    seatedAt: '07:45 PM',
    time: '07:45 PM',
    dateStr: '18 Oct 2026',
    dateIso: '2026-10-18',
    periodCategory: '1month',
    serverName: 'Vikas M.',
    billerName: 'Cashier 1',
    customerName: 'Sunita Shinde',
    customerPhone: '+91 94220 77889',
    customerAddress: 'Erandwane, Pune',
    paymentType: 'Online/UPI',
    status: 'paid',
    subtotal: 1219.05,
    cgst: 30.48,
    sgst: 30.48,
    discount: 0,
    grandTotal: 1280.00,
    items: [
      { id: 'it-36', name: 'Butter Chicken Handi', quantity: 2, price: 340, category: 'Main Course' },
      { id: 'it-37', name: 'Garlic Butter Naan', quantity: 4, price: 70, category: 'Breads' },
      { id: 'it-38', name: 'Jeera Rice Bowl', quantity: 1, price: 180, category: 'Rice' }
    ]
  },

  // 6 Months records
  {
    id: 'kot-rec-210',
    kotNo: 'KOT-210',
    billNo: 'B-820',
    tableId: 'A2',
    tableOrChannel: 'Table A2',
    floorZone: 'AC Hall',
    orderType: 'Dine In',
    seatedAt: '08:00 PM',
    time: '08:00 PM',
    dateStr: '14 Aug 2026',
    dateIso: '2026-08-14',
    periodCategory: '6months',
    serverName: 'Captain Rahul',
    billerName: 'Cashier 1',
    customerName: 'Rohit Shirodkar',
    customerPhone: '+91 98229 33445',
    customerAddress: 'Koregaon Park, Pune',
    notes: 'Anniversary Dinner Party',
    paymentType: 'Card',
    status: 'paid',
    subtotal: 4142.86,
    cgst: 103.57,
    sgst: 103.57,
    discount: 0,
    grandTotal: 4350.00,
    items: [
      { id: 'it-39', name: 'Family Banquet Platter', quantity: 2, price: 1200, category: 'Starters' },
      { id: 'it-40', name: 'Dal Tadka & Steamed Rice', quantity: 3, price: 290, category: 'Main Course' },
      { id: 'it-41', name: 'Assorted Mocktails Pitcher', quantity: 2, price: 450, category: 'Beverages' },
      { id: 'it-42', name: 'Sizzling Brownie with Ice Cream', quantity: 3, price: 180, category: 'Dessert' }
    ]
  },
  {
    id: 'kot-rec-184',
    kotNo: 'KOT-184',
    billNo: 'B-780',
    tableId: 'G5',
    tableOrChannel: 'Table G5',
    floorZone: 'Garden Area',
    orderType: 'Dine In',
    seatedAt: '09:00 PM',
    time: '09:00 PM',
    dateStr: '28 Jul 2026',
    dateIso: '2026-07-28',
    periodCategory: '6months',
    serverName: 'Mahesh G.',
    billerName: 'Cashier 2',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98900 12344',
    customerAddress: 'Kalyani Nagar, Pune',
    paymentType: 'Online/UPI',
    status: 'paid',
    subtotal: 2752.38,
    cgst: 68.81,
    sgst: 68.81,
    discount: 0,
    grandTotal: 2890.00,
    items: [
      { id: 'it-43', name: 'Tandoori Starter Platter', quantity: 2, price: 550, category: 'Starters' },
      { id: 'it-44', name: 'Veg Dum Biryani Family Pot', quantity: 2, price: 650, category: 'Rice' },
      { id: 'it-45', name: 'Chilled Mocktails Glass', quantity: 4, price: 120, category: 'Beverages' }
    ]
  }
];

export const BillKotPrintPage: React.FC<BillKotPrintPageProps> = ({
  tables = [],
  onBack,
  onNavigateToBilling,
  onPrintBill,
}) => {
  // Navigation & Search State
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Filter Dropdown state (matching requested single filter button with options)
  const [dateFilter, setDateFilter] = useState<DateFilterPeriod>('today');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const [customStartDate, setCustomStartDate] = useState<string>('2026-11-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-11-07');

  // Drilldown Selected KOT for Details View
  const [selectedKot, setSelectedKot] = useState<KotPrintRecord | null>(null);

  // Active Thermal Print Preview Modal: 'kot' | 'bill' | null
  const [printModalState, setPrintModalState] = useState<{
    type: 'kot' | 'bill';
    record: KotPrintRecord;
  } | null>(null);

  // Merge live tables from POS state with historical KOT records
  const allRecords = useMemo(() => {
    // Generate live KOT records from active tables in state
    const liveRecords: KotPrintRecord[] = tables
      .filter((t) => t.items && t.items.length > 0)
      .map((t, idx) => {
        const subtotal = t.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
        const cgst = subtotal * 0.025;
        const sgst = subtotal * 0.025;
        const grandTotal = Math.round(subtotal + cgst + sgst);

        return {
          id: `live-kot-${t.id}-${idx}`,
          kotNo: t.kotNo || `KOT-${420 + idx}`,
          billNo: t.billNo || `B-${1050 + idx}`,
          tableId: t.id,
          tableOrChannel: `Table ${t.id}`,
          floorZone: `${t.zone} Floor`,
          orderType: 'Dine In' as const,
          seatedAt: 'Just Now',
          time: '07:30 PM',
          dateStr: 'Today, 07 Nov 2026',
          dateIso: '2026-11-07',
          periodCategory: 'today' as const,
          serverName: t.serverName || 'Captain Rahul',
          billerName: 'Main POS Terminal',
          customerName: t.dueCustomer?.name || (t.id === 'A1' ? 'Ramesh Patil' : undefined),
          customerPhone: t.dueCustomer?.phone || (t.id === 'A1' ? '+91 98220 12345' : undefined),
          customerAddress: t.dueCustomer?.location || (t.id === 'A1' ? 'Shivajinagar, Pune' : undefined),
          notes: t.dueCustomer?.notes,
          paymentType: (t.dueCustomer ? 'Due' : 'Cash') as any,
          status: (t.status === 'printed' ? 'printed' : t.status === 'paid' ? 'paid' : 'saved') as any,
          subtotal: Math.round(subtotal * 100) / 100,
          cgst: Math.round(cgst * 100) / 100,
          sgst: Math.round(sgst * 100) / 100,
          discount: 0,
          grandTotal: grandTotal,
          items: t.items.map((it) => ({
            id: it.id,
            name: it.name,
            quantity: it.quantity,
            price: it.price,
            category: it.category,
            notes: it.notes,
            customization: it.customization,
          })),
        };
      });

    // Combine live and historical, avoiding duplicates if any
    const existingKots = new Set(liveRecords.map((r) => r.kotNo));
    const dedupedHistorical = HISTORICAL_KOT_RECORDS.filter((r) => !existingKots.has(r.kotNo));

    return [...liveRecords, ...dedupedHistorical];
  }, [tables]);

  // Apply filters: Search, Channel, Status, and Date (including Custom Date range)
  const filteredRecords = useMemo(() => {
    return allRecords.filter((rec) => {
      // 1. Channel Filter (All | Dine In | Delivery | Pick Up)
      if (selectedChannel !== 'all' && rec.orderType !== selectedChannel) {
        return false;
      }

      // 2. Status Filter
      if (selectedStatus !== 'all' && rec.status !== selectedStatus) {
        return false;
      }

      // 3. Search Query Filter (KOT No, Bill No, Table, Customer Name, Phone)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchKot = rec.kotNo.toLowerCase().includes(q);
        const matchBill = rec.billNo.toLowerCase().includes(q);
        const matchTable = rec.tableOrChannel.toLowerCase().includes(q);
        const matchFloor = rec.floorZone.toLowerCase().includes(q);
        const matchCust = rec.customerName?.toLowerCase().includes(q) || false;
        const matchPhone = rec.customerPhone?.includes(q) || false;

        if (!matchKot && !matchBill && !matchTable && !matchFloor && !matchCust && !matchPhone) {
          return false;
        }
      }

      // 4. Date Filter (Today, Yesterday, 7 Days, 1 Month, 6 Months, Custom Date)
      if (dateFilter === 'today') {
        return rec.dateIso === '2026-11-07';
      }
      if (dateFilter === 'yesterday') {
        return rec.dateIso === '2026-11-06';
      }
      if (dateFilter === '7days') {
        return rec.dateIso >= '2026-10-31' && rec.dateIso <= '2026-11-07';
      }
      if (dateFilter === '1month') {
        return rec.dateIso >= '2026-10-07' && rec.dateIso <= '2026-11-07';
      }
      if (dateFilter === '6months') {
        return rec.dateIso >= '2026-05-07' && rec.dateIso <= '2026-11-07';
      }
      if (dateFilter === 'custom') {
        return rec.dateIso >= customStartDate && rec.dateIso <= customEndDate;
      }

      return true;
    });
  }, [allRecords, selectedChannel, selectedStatus, searchQuery, dateFilter, customStartDate, customEndDate]);

  // Aggregate stats
  const totalAmount = useMemo(() => {
    return filteredRecords.reduce((sum, r) => sum + r.grandTotal, 0);
  }, [filteredRecords]);

  // Trigger Native Print Dialog
  const handleTriggerPrint = (type: 'kot' | 'bill', record: KotPrintRecord) => {
    setPrintModalState({ type, record });
  };

  // =========================================================================
  // VIEW SPECIFIC KOT DETAILS PAGE (When a specific KOT is selected)
  // Shows: Table No., Time, Item details, Customer Name if available, Bill,
  // and options to Print KOT / Print Bill.
  // =========================================================================
  if (selectedKot) {
    const isPrinted = selectedKot.status === 'printed';
    const isPaid = selectedKot.status === 'paid';

    return (
      <div className="flex-1 flex flex-col bg-[#fdfaf6] h-[calc(100vh-56px)] overflow-y-auto select-none text-stone-800 font-sans p-4 sm:p-6">
        
        {/* Top Header: KOT Details on left, Print actions & Back on right */}
        <div className="flex items-center justify-between border-b border-[#ded5c2] pb-3 mb-4 flex-shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedKot(null)}
              className="p-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer shadow-2xs"
              title="Back to KOT List"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-lg text-[#731b21] tracking-tight">
                  {selectedKot.kotNo}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#ede8dd] text-stone-700 border border-stone-300">
                  {selectedKot.tableOrChannel}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isPaid
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : isPrinted
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {selectedKot.status}
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                Bill No: <span className="font-mono font-bold text-stone-700">{selectedKot.billNo}</span> • Created at: {selectedKot.time} ({selectedKot.dateStr})
              </p>
            </div>
          </div>

          {/* Quick Print Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTriggerPrint('kot', selectedKot)}
              className="px-3.5 py-1.5 rounded-lg border border-[#731b21] bg-white hover:bg-stone-50 text-[#731b21] text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <Printer className="w-3.5 h-3.5 text-[#731b21]" />
              <span>Print KOT Slip</span>
            </button>

            <button
              onClick={() => handleTriggerPrint('bill', selectedKot)}
              className="px-3.5 py-1.5 rounded-lg bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <Receipt className="w-3.5 h-3.5 text-[#fdfaf6]" />
              <span>Print Bill Invoice</span>
            </button>

            <button
              onClick={() => setSelectedKot(null)}
              className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              Back
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TOP SUMMARY CARDS: Table Details, Customer Details, Bill  */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-5">
          
          {/* 1. Table & Timing Details */}
          <div className="bg-white p-3.5 rounded-xl border border-stone-300 shadow-2xs space-y-2">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <UtensilsCrossed className="w-3.5 h-3.5 text-[#731b21]" />
                Table & Floor Information
              </span>
              <span className="text-xs font-bold font-mono text-[#731b21]">
                {selectedKot.tableId}
              </span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">Table No:</span>
                <span className="font-bold text-stone-800">{selectedKot.tableOrChannel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">Floor Zone:</span>
                <span className="font-semibold text-stone-700">{selectedKot.floorZone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">Order Type:</span>
                <span className="font-bold text-stone-800">{selectedKot.orderType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">Order Time:</span>
                <span className="font-mono text-stone-800 font-bold">{selectedKot.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">Order Date:</span>
                <span className="font-medium text-stone-700">{selectedKot.dateStr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">Captain / Server:</span>
                <span className="font-semibold text-stone-800">{selectedKot.serverName}</span>
              </div>
            </div>
          </div>

          {/* 2. Customer Name & Contact (If available) */}
          <div className="bg-white p-3.5 rounded-xl border border-stone-300 shadow-2xs space-y-2">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#731b21]" />
                Customer Details
              </span>
              {selectedKot.customerName ? (
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200">
                  Registered
                </span>
              ) : (
                <span className="text-[10px] font-medium bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">
                  Walk-in
                </span>
              )}
            </div>
            
            {selectedKot.customerName ? (
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="text-stone-500 font-medium">Customer Name:</span>
                  <span className="font-bold text-stone-900 text-[13px]">{selectedKot.customerName}</span>
                </div>
                {selectedKot.customerPhone && (
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 font-medium">Mobile No:</span>
                    <span className="font-mono font-bold text-stone-800 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-stone-400" />
                      {selectedKot.customerPhone}
                    </span>
                  </div>
                )}
                {selectedKot.customerAddress && (
                  <div className="flex justify-between items-baseline">
                    <span className="text-stone-500 font-medium">Location:</span>
                    <span className="text-stone-700 text-right max-w-[180px] truncate">{selectedKot.customerAddress}</span>
                  </div>
                )}
                {selectedKot.notes && (
                  <div className="mt-1 pt-1 border-t border-stone-100 text-[11px] text-stone-600 bg-stone-50 p-1.5 rounded">
                    <span className="font-bold text-stone-700">Note: </span>
                    {selectedKot.notes}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-5 text-center text-stone-400 text-xs">
                <User className="w-6 h-6 mx-auto mb-1 text-stone-300" />
                <p className="font-semibold text-stone-600">Walk-in Dining Guest</p>
                <p className="text-[11px] text-stone-400">No customer contact recorded during billing</p>
              </div>
            )}
          </div>

          {/* 3. Bill & Payment Summary */}
          <div className="bg-white p-3.5 rounded-xl border border-stone-300 shadow-2xs space-y-2">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-[#731b21]" />
                Bill & Financials
              </span>
              <span className="font-mono font-bold text-xs text-stone-700">
                {selectedKot.billNo}
              </span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">Items Subtotal:</span>
                <span className="font-mono text-stone-800">₹{selectedKot.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">CGST (2.5%):</span>
                <span className="font-mono text-stone-800">₹{selectedKot.cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">SGST (2.5%):</span>
                <span className="font-mono text-stone-800">₹{selectedKot.sgst.toFixed(2)}</span>
              </div>
              {selectedKot.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount:</span>
                  <span className="font-mono">-₹{selectedKot.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-stone-200 text-sm font-black text-[#731b21]">
                <span>Grand Total:</span>
                <span className="font-mono">₹{selectedKot.grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] pt-0.5">
                <span className="text-stone-500">Payment Mode:</span>
                <span className="font-bold text-stone-700">{selectedKot.paymentType}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* DISHES / ITEMS TABLE FOR THIS SPECIFIC KOT               */}
        {/* ========================================================= */}
        <div className="bg-white border border-stone-300 rounded-xl overflow-hidden shadow-2xs mb-5 flex-1">
          <div className="bg-[#ede8dd] px-4 py-2.5 border-b border-stone-300 flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-800 flex items-center gap-2">
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#731b21]" />
              <span>Ordered Dishes in {selectedKot.kotNo}</span>
              <span className="bg-white px-2 py-0.2 rounded-full text-[10px] font-black text-[#731b21] border border-stone-200">
                {selectedKot.items.length} Items ({selectedKot.items.reduce((s, it) => s + it.quantity, 0)} Units)
              </span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#f7f4ed] text-stone-700 font-bold border-b border-stone-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 border-r border-stone-200 w-12 text-center">#</th>
                  <th className="py-2.5 px-3 border-r border-stone-200">Item Name</th>
                  <th className="py-2.5 px-3 border-r border-stone-200">Category</th>
                  <th className="py-2.5 px-3 border-r border-stone-200 text-center w-16">Qty</th>
                  <th className="py-2.5 px-3 border-r border-stone-200 text-right w-24">Rate (₹)</th>
                  <th className="py-2.5 px-3 border-r border-stone-200">Kitchen Notes / Addons</th>
                  <th className="py-2.5 px-3 text-right w-28">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {selectedKot.items.map((it, idx) => {
                  const lineTotal = it.price * it.quantity;
                  return (
                    <tr key={it.id || idx} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3 px-3 border-r border-stone-100 text-center font-mono font-bold text-stone-500">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3 border-r border-stone-100 font-bold text-stone-900">
                        {it.name}
                      </td>
                      <td className="py-3 px-3 border-r border-stone-100 text-stone-600">
                        {it.category || 'General'}
                      </td>
                      <td className="py-3 px-3 border-r border-stone-100 text-center font-mono font-extrabold text-[#731b21] bg-red-50/30">
                        {it.quantity}
                      </td>
                      <td className="py-3 px-3 border-r border-stone-100 text-right font-mono text-stone-700">
                        ₹{it.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 border-r border-stone-100 text-stone-600">
                        {it.notes || it.customization ? (
                          <span className="inline-block bg-amber-50 text-amber-900 px-2 py-0.5 rounded text-[11px] font-medium border border-amber-200">
                            {it.notes || it.customization}
                          </span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-stone-900">
                        ₹{lineTotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between border-t border-[#ded5c2] pt-3 flex-wrap gap-2">
          <div className="text-xs text-stone-500">
            KOT Record ID: <span className="font-mono text-stone-700 font-bold">{selectedKot.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTriggerPrint('kot', selectedKot)}
              className="px-4 py-2 rounded-lg border border-[#731b21] bg-white hover:bg-stone-50 text-[#731b21] text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-[#731b21]" />
              <span>Print Kitchen KOT Slip</span>
            </button>
            <button
              onClick={() => handleTriggerPrint('bill', selectedKot)}
              className="px-4 py-2 rounded-lg bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Receipt className="w-4 h-4 text-[#fdfaf6]" />
              <span>Print Customer Bill (Tax Invoice)</span>
            </button>
          </div>
        </div>

        {/* Modal Print Preview when triggered */}
        {printModalState && (
          <ThermalPrintModal
            state={printModalState}
            onClose={() => setPrintModalState(null)}
          />
        )}

      </div>
    );
  }

  // =========================================================================
  // MAIN ORDER-LIKE KOT & BILL PRINT LIST PAGE
  // Features:
  // - KOT No. prominent in table
  // - Table No., Time, Item Count, Customer Name if available, Bill
  // - Option of Print (Print KOT & Print Bill)
  // - Day-wise Filter dropdown including Custom Date
  // =========================================================================
  return (
    <div className="flex-1 flex flex-col bg-[#fdfaf6] h-[calc(100vh-56px)] overflow-hidden select-none text-stone-800 font-sans">
      
      {/* ========================================================= */}
      {/* 1. TOP HEADER: Title, Record Count, and Back Button       */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-[#ded5c2] px-4 sm:px-6 py-2.5 flex items-center justify-between flex-shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-maroon-100/80 border border-maroon-300 flex items-center justify-center text-maroon-900 shadow-2xs">
            <Printer className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <span>Bill / KOT Print</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#ede8dd] text-stone-700 border border-stone-300">
                {filteredRecords.length} KOT Records
              </span>
            </h2>
            <p className="text-[11px] text-stone-500 font-medium hidden sm:block">
              Order-wise Kitchen Order Tickets & Customer Tax Invoice registry with day-wise filter
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Refresh */}
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedChannel('all');
              setSelectedStatus('all');
              setDateFilter('today');
            }}
            className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
            title="Reset Filters to Today"
          >
            Reset Filter
          </button>

          {/* Back Button returning to Operations */}
          <button
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-lg border border-[#731b21] bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#fdfaf6]" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. CHANNEL SUB-FILTER TABS (All | Dine In | Delivery | PU) */}
      {/* ========================================================= */}
      <div className="bg-[#f9f7f2] border-b border-[#ded5c2] px-4 sm:px-6 py-2 flex items-center justify-between flex-wrap gap-2 flex-shrink-0">
        
        {/* Channel Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {[
            { id: 'all', label: 'All Orders', icon: Layers },
            { id: 'Dine In', label: 'Dine In', icon: UtensilsCrossed },
            { id: 'Delivery', label: 'Delivery', icon: Bike },
            { id: 'Pick Up', label: 'Pick Up', icon: ShoppingBag },
          ].map((ch) => {
            const Icon = ch.icon;
            const isSelected = selectedChannel === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setSelectedChannel(ch.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'bg-[#731b21] text-white border border-[#731b21]'
                    : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{ch.label}</span>
              </button>
            );
          })}
        </div>

        {/* Status Quick Filter (All | Printed | Saved | Paid) */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mr-1">
            Status:
          </span>
          {[
            { id: 'all', label: 'All' },
            { id: 'printed', label: 'Printed' },
            { id: 'saved', label: 'Saved' },
            { id: 'paid', label: 'Paid' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`px-2 py-0.8 rounded text-[11px] font-bold transition-all cursor-pointer ${
                selectedStatus === st.id
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

      </div>

      {/* ========================================================= */}
      {/* 3. SEARCH BAR & SINGLE FILTER OPTION BUTTON WITH DROPDOWN  */}
      {/* ========================================================= */}
      <div className="px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 bg-white border-b border-[#ded5c2] flex-shrink-0">
        
        {/* Search Input Box */}
        <div className="relative w-72 sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search KOT No., Table, Bill No., Customer..."
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#731b21] text-stone-800 font-medium placeholder:text-stone-400 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Right side: Day-wise Filter Option Button with Dropdown (Today, Yesterday, 7 Days, 1 Month, 6 Months, Custom Date) */}
        <div className="flex items-center gap-3">
          
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-2xs ${
                isFilterDropdownOpen || dateFilter !== 'today'
                  ? 'bg-[#731b21] text-white border border-[#731b21]'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-300'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {dateFilter === 'today'
                  ? 'Filter: Today'
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
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-2xl border border-stone-300 p-2.5 z-40 animate-fadeIn text-xs">
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider px-2 py-1 mb-1">
                    Select Filter Period
                  </div>

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

                  {/* Custom Date Form (Between two dates) */}
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

          {/* Quick Stats Pill */}
          <div className="hidden md:flex items-center gap-3 text-xs bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200 font-semibold text-stone-700">
            <span>
              Total Value: <strong className="font-mono text-stone-900 font-bold">₹{totalAmount.toLocaleString('en-IN')}</strong>
            </span>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* 4. MAIN DATA TABLE (Order-like KOT list with KOT No.)     */}
      {/* ========================================================= */}
      <div className="flex-1 overflow-auto min-h-0 bg-white">
        {filteredRecords.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-stone-500">
            <Printer className="w-8 h-8 text-stone-300 mb-2" />
            <p className="text-sm font-bold text-stone-700">No KOT or Bill records found</p>
            <p className="text-xs text-stone-400 mt-1">Try selecting a different date period or clearing your search</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            
            {/* Table Header Columns */}
            <thead className="bg-[#ede8dd] text-stone-800 font-bold uppercase tracking-wider text-[11px] sticky top-0 z-10 border-b border-[#ded5c2] shadow-2xs">
              <tr>
                <th className="py-2.5 px-3 border-r border-[#ded5c2] whitespace-nowrap">KOT No.</th>
                <th className="py-2.5 px-3 border-r border-[#ded5c2] whitespace-nowrap">Bill No.</th>
                <th className="py-2.5 px-3 border-r border-[#ded5c2] whitespace-nowrap">Table / Channel</th>
                <th className="py-2.5 px-3 border-r border-[#ded5c2] whitespace-nowrap">Order Time</th>
                <th className="py-2.5 px-3 border-r border-[#ded5c2] whitespace-nowrap">Customer Name</th>
                <th className="py-2.5 px-3 border-r border-[#ded5c2] whitespace-nowrap">Items Summary</th>
                <th className="py-2.5 px-3 border-r border-[#ded5c2] whitespace-nowrap text-right">Amount (₹)</th>
                <th className="py-2.5 px-3 border-r border-[#ded5c2] whitespace-nowrap text-center">Status</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-center">Print Actions</th>
              </tr>
            </thead>

            {/* Table Rows */}
            <tbody className="divide-y divide-stone-200">
              {filteredRecords.map((rec) => {
                const totalUnits = rec.items.reduce((acc, it) => acc + it.quantity, 0);
                const isPrinted = rec.status === 'printed';
                const isPaid = rec.status === 'paid';

                let rowBgClass = 'hover:bg-amber-50/50';
                if (isPrinted) {
                  rowBgClass = 'bg-[#edf9ee] hover:bg-[#e4f6e6] text-stone-900';
                } else if (isPaid) {
                  rowBgClass = 'bg-[#fefce8] hover:bg-[#fef9c3] text-stone-900';
                }

                return (
                  <tr
                    key={rec.id}
                    className={`transition-colors ${rowBgClass}`}
                  >
                    
                    {/* 1. KOT No. (Prominently displayed) */}
                    <td className="py-3 px-3 border-r border-stone-200/80">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-xs text-[#731b21] bg-white px-2 py-0.5 rounded border border-rose-200 shadow-2xs">
                          {rec.kotNo}
                        </span>
                      </div>
                    </td>

                    {/* 2. Bill No. */}
                    <td className="py-3 px-3 border-r border-stone-200/80 font-mono font-bold text-stone-700">
                      {rec.billNo}
                    </td>

                    {/* 3. Table / Channel */}
                    <td className="py-3 px-3 border-r border-stone-200/80 leading-tight">
                      <div className="font-bold text-stone-900 flex items-center gap-1">
                        {rec.orderType === 'Delivery' && <Bike className="w-3.5 h-3.5 text-blue-600" />}
                        {rec.orderType === 'Pick Up' && <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />}
                        {rec.orderType === 'Dine In' && <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-600" />}
                        <span>{rec.tableOrChannel}</span>
                      </div>
                      <div className="text-[10px] text-stone-500 font-medium mt-0.5">
                        {rec.floorZone} • {rec.serverName}
                      </div>
                    </td>

                    {/* 4. Order Time & Date */}
                    <td className="py-3 px-3 border-r border-stone-200/80 whitespace-nowrap leading-tight">
                      <div className="font-mono font-bold text-stone-800">{rec.time}</div>
                      <div className="text-[10px] text-stone-500">{rec.dateStr}</div>
                    </td>

                    {/* 5. Customer Name (If Available) */}
                    <td className="py-3 px-3 border-r border-stone-200/80 leading-tight">
                      {rec.customerName ? (
                        <div>
                          <div className="font-bold text-stone-900">{rec.customerName}</div>
                          {rec.customerPhone && (
                            <div className="font-mono text-[10px] text-stone-500 flex items-center gap-1">
                              <Phone className="w-2.5 h-2.5 text-stone-400" />
                              {rec.customerPhone}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-stone-400 italic text-[11px]">— Walk-in Guest —</span>
                      )}
                    </td>

                    {/* 6. Items Summary */}
                    <td className="py-3 px-3 border-r border-stone-200/80 max-w-xs">
                      <div className="font-bold text-stone-800 text-[11px]">
                        {rec.items.length} dishes ({totalUnits} pcs)
                      </div>
                      <div className="text-[10px] text-stone-600 truncate mt-0.5">
                        {rec.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                      </div>
                    </td>

                    {/* 7. Amount (₹) */}
                    <td className="py-3 px-3 border-r border-stone-200/80 text-right font-mono font-extrabold text-stone-900">
                      ₹{rec.grandTotal.toFixed(2)}
                    </td>

                    {/* 8. Status */}
                    <td className="py-3 px-3 border-r border-stone-200/80 text-center whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : isPrinted
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>

                    {/* 9. Actions: View Details, Print KOT, Print Bill */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        
                        {/* View Specific KOT Details */}
                        <button
                          onClick={() => setSelectedKot(rec)}
                          className="px-2 py-1 rounded border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                          title="View detailed table, time, customer, dishes and bill"
                        >
                          <Eye className="w-3 h-3 text-[#731b21]" />
                          <span>Details</span>
                        </button>

                        {/* Print KOT */}
                        <button
                          onClick={() => handleTriggerPrint('kot', rec)}
                          className="px-2 py-1 rounded border border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                          title="Print Kitchen Order Ticket"
                        >
                          <Printer className="w-3 h-3 text-amber-800" />
                          <span>KOT</span>
                        </button>

                        {/* Print Bill */}
                        <button
                          onClick={() => handleTriggerPrint('bill', rec)}
                          className="px-2 py-1 rounded bg-[#731b21] hover:bg-[#5b1419] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                          title="Print Customer Tax Invoice"
                        >
                          <Receipt className="w-3 h-3 text-white" />
                          <span>Bill</span>
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
      {/* 5. BOTTOM STATUS BAR & LEGEND                             */}
      {/* ========================================================= */}
      <div className="bg-[#ede8dd] border-t border-[#ded5c2] px-4 sm:px-6 py-2 flex items-center justify-between flex-wrap gap-2 flex-shrink-0 text-xs font-semibold text-stone-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white border border-stone-400" />
            <span>Saved ({allRecords.filter((r) => r.status === 'saved').length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#82d882] border border-emerald-600" />
            <span>Printed ({allRecords.filter((r) => r.status === 'printed').length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#facc15] border border-amber-500" />
            <span>Paid ({allRecords.filter((r) => r.status === 'paid').length})</span>
          </div>
        </div>

        <div className="text-[11px] text-stone-500 font-medium">
          Showing {filteredRecords.length} of {allRecords.length} total KOTs • Filter: <strong className="text-stone-800 uppercase">{dateFilter}</strong>
        </div>
      </div>

      {/* Modal Print Preview when triggered */}
      {printModalState && (
        <ThermalPrintModal
          state={printModalState}
          onClose={() => setPrintModalState(null)}
        />
      )}

    </div>
  );
};

// =========================================================================
// THERMAL PRINT MODAL (Supports both Kitchen KOT & Customer Tax Invoice)
// =========================================================================
interface ThermalPrintModalProps {
  state: {
    type: 'kot' | 'bill';
    record: KotPrintRecord;
  };
  onClose: () => void;
}

const ThermalPrintModal: React.FC<ThermalPrintModalProps> = ({ state, onClose }) => {
  const { type, record } = state;
  const isKot = type === 'kot';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-stone-300 flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-[#ede8dd] px-4 py-3 border-b border-stone-300 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            {isKot ? (
              <Printer className="w-4 h-4 text-[#731b21]" />
            ) : (
              <Receipt className="w-4 h-4 text-[#731b21]" />
            )}
            <h3 className="font-bold text-sm text-stone-900">
              {isKot ? `Kitchen Order Ticket (${record.kotNo})` : `Tax Invoice (${record.billNo})`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thermal Slip Content */}
        <div className="p-5 bg-[#faf8f5] overflow-y-auto flex-1 font-mono text-xs text-stone-900 select-all">
          <div className="border border-dashed border-stone-400 p-4 rounded-lg bg-white shadow-2xs space-y-3">
            
            {/* Header info */}
            {isKot ? (
              /* Kitchen Copy Header */
              <div className="text-center space-y-0.5 border-b border-dashed border-stone-400 pb-2">
                <span className="bg-stone-900 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase">
                  *** KITCHEN ORDER TICKET ***
                </span>
                <h4 className="text-xl font-black text-stone-900 mt-1">
                  {record.kotNo}
                </h4>
                <p className="text-[11px] font-bold text-stone-700">
                  {record.tableOrChannel} ({record.floorZone})
                </p>
                <p className="text-[10px] text-stone-500">
                  Order Type: <strong className="text-stone-800">{record.orderType}</strong>
                </p>
              </div>
            ) : (
              /* Customer Bill Header */
              <div className="text-center space-y-1 border-b border-dashed border-stone-400 pb-2">
                <img
                  src={logoUrl}
                  alt="जेवण फॅमिली रेस्टॉरंट"
                  className="h-10 w-auto mx-auto object-contain mb-1"
                />
                <p className="font-sans font-black text-sm text-[#731b21]">जेवण फॅमिली रेस्टॉरंट</p>
                <p className="text-[10px] text-stone-600 font-medium">Pure Maharashtrian & Multi-Cuisine Dining</p>
                <p className="text-[9px] text-stone-500">FC Road, Shivajinagar, Pune - 411005</p>
                <p className="text-[9px] text-stone-500">GSTIN: 27AABCT8192K1Z9 • FSSAI: 11521034000412</p>
              </div>
            )}

            {/* Meta details */}
            <div className="grid grid-cols-2 text-[11px] gap-y-0.5 border-b border-dashed border-stone-400 pb-2">
              <div><span className="text-stone-500">KOT No:</span> <strong>{record.kotNo}</strong></div>
              <div className="text-right"><span className="text-stone-500">Bill No:</span> <strong>{record.billNo}</strong></div>
              <div><span className="text-stone-500">Table:</span> <strong>{record.tableOrChannel}</strong></div>
              <div className="text-right"><span className="text-stone-500">Server:</span> <strong>{record.serverName}</strong></div>
              <div><span className="text-stone-500">Date:</span> {record.dateStr}</div>
              <div className="text-right"><span className="text-stone-500">Time:</span> {record.time}</div>
              
              {/* Customer details if available */}
              {record.customerName && (
                <>
                  <div className="col-span-2 pt-1 border-t border-dotted border-stone-300">
                    <span className="text-stone-500">Customer:</span> <strong className="text-stone-900">{record.customerName}</strong>
                    {record.customerPhone && <span className="text-stone-500"> ({record.customerPhone})</span>}
                  </div>
                </>
              )}
            </div>

            {/* Items list */}
            <div>
              <div className="flex justify-between font-bold text-[11px] pb-1 border-b border-stone-300">
                <span className="w-10 text-center">Qty</span>
                <span className="flex-1 px-1">Item</span>
                {!isKot && <span className="w-14 text-right">Rate</span>}
                {!isKot && <span className="w-16 text-right">Amount</span>}
              </div>

              <div className="divide-y divide-stone-100 py-1 space-y-1">
                {record.items.map((it, idx) => (
                  <div key={idx} className="pt-1">
                    <div className="flex justify-between items-baseline text-[11px]">
                      <span className="w-10 text-center font-extrabold text-[#731b21] bg-stone-100 rounded">
                        {it.quantity}x
                      </span>
                      <span className="flex-1 px-1 font-bold text-stone-900">
                        {it.name}
                      </span>
                      {!isKot && <span className="w-14 text-right text-stone-600">₹{it.price}</span>}
                      {!isKot && <span className="w-16 text-right font-bold text-stone-900">₹{it.price * it.quantity}</span>}
                    </div>
                    {(it.notes || it.customization) && (
                      <div className="pl-11 text-[10px] text-rose-700 italic font-semibold">
                        * {it.notes || it.customization}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Financial calculation (Only on Bill, not on KOT) */}
            {!isKot ? (
              <div className="border-t border-dashed border-stone-400 pt-2 space-y-1 text-[11px]">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span>₹{record.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>CGST (2.5%):</span>
                  <span>₹{record.cgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>SGST (2.5%):</span>
                  <span>₹{record.sgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-black text-sm pt-1 border-t border-stone-300 text-stone-900">
                  <span>Grand Total:</span>
                  <span>₹{record.grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-stone-500 pt-0.5">
                  <span>Payment Mode:</span>
                  <span className="font-bold text-stone-700">{record.paymentType} ({record.status.toUpperCase()})</span>
                </div>
              </div>
            ) : (
              <div className="border-t border-dashed border-stone-400 pt-2 text-[10px] text-stone-500 flex justify-between">
                <span>Total Dishes: <strong>{record.items.length}</strong></span>
                <span>Total Quantity: <strong>{record.items.reduce((s, it) => s + it.quantity, 0)} Units</strong></span>
              </div>
            )}

            {/* Footer */}
            <div className="text-center pt-2 border-t border-dashed border-stone-400 text-[10px] text-stone-500 space-y-0.5">
              <p className="font-bold text-stone-700">
                {isKot ? '*** FOR KITCHEN USE ONLY ***' : 'THANK YOU! VISIT AGAIN'}
              </p>
              <p className="text-[9px]">www.jevanrestaurant.com</p>
            </div>

          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-[#ede8dd] px-4 py-3 border-t border-stone-300 flex items-center justify-between flex-shrink-0">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            Close
          </button>
          
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-lg bg-[#731b21] hover:bg-[#5b1419] text-[#fdfaf6] text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <Printer className="w-3.5 h-3.5 text-[#fdfaf6]" />
            <span>Print Thermal Slip</span>
          </button>
        </div>

      </div>
    </div>
  );
};


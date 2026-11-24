export type TableStatus = 'blank' | 'running' | 'printed' | 'paid' | 'kot';

export type ZoneId = 'AC' | 'Garden' | 'Non-AC' | 'Smoking-Zone' | string;

export interface Floor {
  id: string;
  name: string;
  code?: string;
  type?: string;
  description?: string;
}

export interface DishVariation {
  id: string;
  name: string;
  price: number;
}

export interface DishAddon {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  id: string;
  name: string;
  marathiName?: string;
  price: number;
  quantity: number;
  category: string;
  notes?: string;
  timestamp?: string;
  image?: string;
  isVeg?: boolean;
  shortCode?: string;
  customization?: string;
  hasVariations?: boolean;
  variations?: DishVariation[];
  addonsList?: DishAddon[];
  selectedVariation?: string;
  selectedAddons?: string[];
  cancelReason?: string;
}

export interface Table {
  id: string;
  zone: ZoneId;
  status: TableStatus;
  durationMinutes: number;
  amount: number;
  guests: number;
  serverName: string;
  billNo?: string;
  kotNo?: string;
  seatedAt?: string;
  items: OrderItem[];
  customerName?: string;
  customerPhone?: string;
  customerLocation?: string;
  orderType?: 'Dine In' | 'Delivery' | 'Pick Up';
  paymentMode?: string;
  dueCustomer?: {
    name: string;
    phone: string;
    location: string;
    totalAmount?: number;
    paidAmount?: number;
    dueAmount?: number;
    paidMode?: string;
    notes?: string;
  };
}

export interface Reservation {
  id: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  tableId: string;
  floorZone?: string;
  partySize: number;
  time: string;
  date?: string;
  occasion?: string;
  advanceAmount?: number;
  source?: string;
  notes?: string;
  status: 'Confirmed' | 'Pending' | 'Seated' | 'Cancelled';
}

export interface QuickOrder {
  id: string;
  orderNo?: string;
  type: 'Delivery' | 'Pick Up';
  platform?: 'Swiggy' | 'Zomato' | 'Direct' | 'Magicpin' | 'Dunzo' | 'Takeaway Counter' | 'Phone Order' | string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  pickupSlot?: string;
  amount: number;
  itemsCount: number;
  items?: Array<{ name: string; quantity: number; price: number; notes?: string }>;
  paymentType?: 'Paid Online' | 'Cash on Delivery' | 'UPI' | 'Paid' | 'Pending';
  riderName?: string;
  riderPhone?: string;
  status: 'Preparing' | 'Ready' | 'Out for Delivery' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface TaxRule {
  id: string;
  name: string;
  code: string;
  rate: number;
  type: 'percentage' | 'fixed';
  applicability: 'All' | 'Food' | 'Beverages' | 'Alcohol' | 'Dine In' | 'Delivery' | 'Pick Up' | string;
  specificCategory?: string;
  taxNumber?: string;
  isActive: boolean;
  description?: string;
}

export interface DiscountRule {
  id: string;
  name: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  maxDiscountCap?: number;
  applicability: 'All' | 'Dine In' | 'Delivery' | 'Pick Up' | 'Food Only' | 'Beverages Only' | string;
  validityTime?: string;
  isActive: boolean;
  description?: string;
}

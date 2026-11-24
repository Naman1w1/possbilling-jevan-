import { Table, OrderItem, QuickOrder, Reservation, DishVariation, DishAddon, TaxRule, DiscountRule } from '../types/pos';

export const PIZZA_DEFAULT_VARIATIONS: DishVariation[] = [
  { id: 'v-sm', name: 'Small', price: 220 },
  { id: 'v-med', name: 'Medium', price: 410 },
  { id: 'v-lg', name: 'Large', price: 649 },
  { id: 'v-xl', name: 'Extra Large', price: 749 },
];

export const PIZZA_DEFAULT_ADDONS: DishAddon[] = [
  { id: 'a-ec', name: 'Extra Cheese', price: 80 },
  { id: 'a-tc', name: 'Thin Crust', price: 60 },
  { id: 'a-pb', name: 'Pan Base', price: 50 },
  { id: 'a-et', name: 'Extra Toppings', price: 50 },
  { id: 'a-cb', name: 'Cheese Burst', price: 160 },
];

export const INITIAL_TABLES: Table[] = [
  // AC Zone
  {
    id: 'A1',
    zone: 'AC',
    status: 'printed',
    durationMinutes: 268,
    amount: 1295.00,
    guests: 3,
    serverName: 'Ramesh K.',
    billNo: 'B-1042',
    kotNo: 'KOT-408',
    seatedAt: '03:24 PM',
    orderType: 'Dine In',
    customerName: 'Aditya Patil',
    customerPhone: '+91 98220 11442',
    customerLocation: 'Kothrud, Pune',
    items: [
      {
        id: 'p-1',
        name: 'Capsicum & Onion (Large (11 inch))',
        price: 259,
        quantity: 5,
        category: 'Freshly made Pizzas',
        customization: 'Freshly Made Pizzas: Extra Cheeses',
        isVeg: true,
        shortCode: 'P01',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'A2',
    zone: 'AC',
    status: 'paid',
    durationMinutes: 264,
    amount: 379.00,
    guests: 2,
    serverName: 'Sachin P.',
    billNo: 'B-1041',
    kotNo: 'KOT-407',
    seatedAt: '03:28 PM',
    orderType: 'Dine In',
    items: [
      {
        id: 'p-3',
        name: 'Margherita',
        price: 239,
        quantity: 1,
        category: 'Freshly made Pizzas',
        customization: 'Fresh Basil & Mozzarella',
        isVeg: true,
        shortCode: 'P03',
        image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=200&auto=format&fit=crop&q=80'
      },
      {
        id: 'sd-1',
        name: 'Fresh Lime Soda',
        price: 60,
        quantity: 2,
        category: 'Soft Drink',
        isVeg: true,
        shortCode: 'SD01'
      }
    ]
  },
  { id: 'A3', zone: 'AC', status: 'blank', durationMinutes: 0, amount: 0, guests: 2, serverName: '', items: [] },
  { id: 'A4', zone: 'AC', status: 'blank', durationMinutes: 0, amount: 0, guests: 4, serverName: '', items: [] },
  { id: 'A5', zone: 'AC', status: 'blank', durationMinutes: 0, amount: 0, guests: 4, serverName: '', items: [] },
  { id: 'A6', zone: 'AC', status: 'blank', durationMinutes: 0, amount: 0, guests: 6, serverName: '', items: [] },
  { id: 'A7', zone: 'AC', status: 'blank', durationMinutes: 0, amount: 0, guests: 2, serverName: '', items: [] },
  { id: 'A8', zone: 'AC', status: 'blank', durationMinutes: 0, amount: 0, guests: 4, serverName: '', items: [] },
  { id: 'A9', zone: 'AC', status: 'blank', durationMinutes: 0, amount: 0, guests: 4, serverName: '', items: [] },
  { id: 'A10', zone: 'AC', status: 'blank', durationMinutes: 0, amount: 0, guests: 8, serverName: '', items: [] },

  // Garden Zone
  { id: 'A12', zone: 'Garden', status: 'blank', durationMinutes: 0, amount: 0, guests: 2, serverName: '', items: [] },
  { id: 'A13', zone: 'Garden', status: 'blank', durationMinutes: 0, amount: 0, guests: 4, serverName: '', items: [] },
  {
    id: 'A14',
    zone: 'Garden',
    status: 'kot',
    durationMinutes: 45,
    amount: 838.00,
    guests: 5,
    serverName: 'Vikas M.',
    kotNo: 'KOT-415',
    seatedAt: '07:15 PM',
    orderType: 'Dine In',
    customerName: 'Pooja Kulkarni',
    customerPhone: '+91 94223 99881',
    customerLocation: 'FC Road, Deccan, Pune',
    items: [
      {
        id: 'p-2',
        name: 'Corn & Jalapeno',
        price: 279,
        quantity: 2,
        category: 'Freshly made Pizzas',
        customization: 'Spicy Jalapeno Crunch',
        isVeg: true,
        shortCode: 'P02',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&auto=format&fit=crop&q=80'
      },
      {
        id: 'p-4',
        name: 'Paneer Delight',
        price: 280,
        quantity: 1,
        category: 'Freshly made Pizzas',
        isVeg: true,
        shortCode: 'P04',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&auto=format&fit=crop&q=80'
      }
    ]
  },
  { id: 'A15', zone: 'Garden', status: 'blank', durationMinutes: 0, amount: 0, guests: 4, serverName: '', items: [] },
  {
    id: 'A16',
    zone: 'Garden',
    status: 'running',
    durationMinutes: 82,
    amount: 588.00,
    guests: 4,
    serverName: 'Mahesh G.',
    kotNo: 'KOT-411',
    seatedAt: '06:38 PM',
    orderType: 'Dine In',
    customerName: 'Rohan Deshmukh',
    customerPhone: '+91 98812 33455',
    customerLocation: 'Baner, Pune',
    items: [
      {
        id: 'p-5',
        name: 'Veggie Supreme',
        price: 299,
        quantity: 1,
        category: 'Freshly made Pizzas',
        isVeg: true,
        shortCode: 'P05',
        image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=200&auto=format&fit=crop&q=80'
      },
      {
        id: 'p-4',
        name: 'Paneer Delight',
        price: 289,
        quantity: 1,
        category: 'Freshly made Pizzas',
        isVeg: true,
        shortCode: 'P04',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&auto=format&fit=crop&q=80'
      }
    ]
  },
  { id: 'A17', zone: 'Garden', status: 'blank', durationMinutes: 0, amount: 0, guests: 4, serverName: '', items: [] },
  { id: 'A18', zone: 'Garden', status: 'blank', durationMinutes: 0, amount: 0, guests: 2, serverName: '', items: [] },
  { id: 'A19', zone: 'Garden', status: 'blank', durationMinutes: 0, amount: 0, guests: 6, serverName: '', items: [] },
  { id: 'A20', zone: 'Garden', status: 'blank', durationMinutes: 0, amount: 0, guests: 8, serverName: '', items: [] },

  // Non-AC Zone
  { id: 'KL1', zone: 'Non-AC', status: 'blank', durationMinutes: 0, amount: 0, guests: 2, serverName: '', items: [] },
  {
    id: 'KL2',
    zone: 'Non-AC',
    status: 'running',
    durationMinutes: 38,
    amount: 540.00,
    guests: 2,
    serverName: 'Sunil T.',
    kotNo: 'KOT-417',
    seatedAt: '07:22 PM',
    orderType: 'Dine In',
    items: [
      {
        id: 'm-5',
        name: 'Special Maharashtrian Thali',
        marathiName: 'महाराष्ट्रीयन थाळी',
        price: 360,
        quantity: 1,
        category: 'Street Side Favs',
        isVeg: true,
        shortCode: 'TH01'
      },
      {
        id: 'm-16',
        name: 'Puran Poli with Ghee',
        marathiName: 'पुरणपोळी',
        price: 180,
        quantity: 1,
        category: 'Chaat Special',
        isVeg: true,
        shortCode: 'PP01'
      }
    ]
  },
  { id: 'KL3', zone: 'Non-AC', status: 'blank', durationMinutes: 0, amount: 0, guests: 2, serverName: '', items: [] },
  { id: 'KL4', zone: 'Non-AC', status: 'blank', durationMinutes: 0, amount: 0, guests: 4, serverName: '', items: [] },
  { id: 'KL5', zone: 'Non-AC', status: 'blank', durationMinutes: 0, amount: 0, guests: 4, serverName: '', items: [] },

  // Smoking-Zone
  { id: 'SZ1', zone: 'Smoking-Zone', status: 'blank', durationMinutes: 0, amount: 0, guests: 2, serverName: '', items: [] },
  {
    id: 'SZ2',
    zone: 'Smoking-Zone',
    status: 'running',
    durationMinutes: 52,
    amount: 680.00,
    guests: 3,
    serverName: 'Ramesh K.',
    kotNo: 'KOT-413',
    seatedAt: '07:08 PM',
    orderType: 'Dine In',
    items: [
      {
        id: 'b-1',
        name: 'Crispy Veg Burger',
        price: 190,
        quantity: 2,
        category: 'Burgers',
        isVeg: true,
        shortCode: 'BG01'
      },
      {
        id: 'mock-1',
        name: 'Virgin Blue Curacao Mojito',
        price: 150,
        quantity: 2,
        category: 'Moktails G',
        isVeg: true,
        shortCode: 'MK01'
      }
    ]
  },
  { id: 'SZ3', zone: 'Smoking-Zone', status: 'blank', durationMinutes: 0, amount: 0, guests: 4, serverName: '', items: [] },
  { id: 'SZ4', zone: 'Smoking-Zone', status: 'blank', durationMinutes: 0, amount: 0, guests: 6, serverName: '', items: [] }
];

export const MENU_CATEGORIES = [
  'Favorite Items',
  'Soft Drink',
  'Fine Pizza',
  'Chaat Special',
  'Street Side Favs',
  'Tandoori Starters',
  'Freshly made Pizzas',
  'Moktails G',
  'Cocktails',
  'Burgers'
];

export const MENU_GROUPS = [
  'Globel Grills',
  'Main Kitchen',
  'Bar & Beverages',
  'Bakery & Desserts'
];

export const MENU_CATALOG: OrderItem[] = [
  // Freshly made Pizzas (Exact as in reference image)
  {
    id: 'p-mex',
    name: 'Mexican Farm House',
    price: 649,
    quantity: 1,
    category: 'Freshly made Pizzas',
    customization: 'Large (11 inch) · Extra Cheeses',
    hasVariations: true,
    variations: PIZZA_DEFAULT_VARIATIONS,
    addonsList: PIZZA_DEFAULT_ADDONS,
    isVeg: true,
    shortCode: 'MFH01',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-1',
    name: 'Capsicum & Onion',
    price: 259,
    quantity: 1,
    category: 'Freshly made Pizzas',
    customization: 'Large (11 inch) - Extra Cheeses',
    hasVariations: true,
    variations: [
      { id: 'v-sm', name: 'Small', price: 180 },
      { id: 'v-med', name: 'Medium', price: 220 },
      { id: 'v-lg', name: 'Large', price: 259 },
      { id: 'v-xl', name: 'Extra Large', price: 349 },
    ],
    addonsList: PIZZA_DEFAULT_ADDONS,
    isVeg: true,
    shortCode: 'P01',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-2',
    name: 'Corn & Jalapeno',
    price: 279,
    quantity: 1,
    category: 'Freshly made Pizzas',
    customization: 'Medium (9 inch) - Spicy Salsa',
    isVeg: true,
    shortCode: 'P02',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-3',
    name: 'Margherita',
    price: 239,
    quantity: 1,
    category: 'Freshly made Pizzas',
    customization: 'Regular (7 inch) - Fresh Basil',
    hasVariations: true,
    variations: PIZZA_DEFAULT_VARIATIONS,
    addonsList: PIZZA_DEFAULT_ADDONS,
    isVeg: true,
    shortCode: 'P03',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-4',
    name: 'Paneer Delight',
    price: 289,
    quantity: 1,
    category: 'Freshly made Pizzas',
    customization: 'Large (11 inch) - Tandoori Paneer',
    hasVariations: true,
    variations: PIZZA_DEFAULT_VARIATIONS,
    addonsList: PIZZA_DEFAULT_ADDONS,
    isVeg: true,
    shortCode: 'P04',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-5',
    name: 'Veggie Supreme',
    price: 299,
    quantity: 1,
    category: 'Freshly made Pizzas',
    customization: 'Large (11 inch) - Black Olives & Peppers',
    hasVariations: true,
    variations: PIZZA_DEFAULT_VARIATIONS,
    addonsList: PIZZA_DEFAULT_ADDONS,
    isVeg: true,
    shortCode: 'P05',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=200&auto=format&fit=crop&q=80'
  },

  // Fine Pizza
  {
    id: 'fp-1',
    name: 'Four Cheese Special',
    price: 349,
    quantity: 1,
    category: 'Fine Pizza',
    hasVariations: true,
    variations: PIZZA_DEFAULT_VARIATIONS,
    addonsList: PIZZA_DEFAULT_ADDONS,
    isVeg: true,
    shortCode: 'FP01',
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'fp-2',
    name: 'Gourmet Truffle Mushroom',
    price: 379,
    quantity: 1,
    category: 'Fine Pizza',
    hasVariations: true,
    variations: PIZZA_DEFAULT_VARIATIONS,
    addonsList: PIZZA_DEFAULT_ADDONS,
    isVeg: true,
    shortCode: 'FP02',
    image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=200&auto=format&fit=crop&q=80'
  },

  // Favorite Items
  {
    id: 'fav-1',
    name: 'Paneer Butter Masala',
    marathiName: 'पनीर बटर मसाला',
    price: 260,
    quantity: 1,
    category: 'Favorite Items',
    isVeg: true,
    shortCode: 'FAV01',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'fav-2',
    name: 'Special Maharashtrian Thali',
    marathiName: 'महाराष्ट्रीयन थाळी',
    price: 360,
    quantity: 1,
    category: 'Favorite Items',
    isVeg: true,
    shortCode: 'FAV02',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&auto=format&fit=crop&q=80'
  },

  // Soft Drink
  {
    id: 'sd-1',
    name: 'Fresh Lime Soda (Sweet & Salt)',
    price: 60,
    quantity: 1,
    category: 'Soft Drink',
    isVeg: true,
    shortCode: 'SD01',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'sd-2',
    name: 'Chilled Cola Can (300ml)',
    price: 50,
    quantity: 1,
    category: 'Soft Drink',
    isVeg: true,
    shortCode: 'SD02'
  },

  // Chaat Special
  {
    id: 'cht-1',
    name: 'Dahi Puri Chatpata',
    price: 110,
    quantity: 1,
    category: 'Chaat Special',
    isVeg: true,
    shortCode: 'CH01',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'cht-2',
    name: 'Sev Puri Mumbai Style',
    price: 90,
    quantity: 1,
    category: 'Chaat Special',
    isVeg: true,
    shortCode: 'CH02'
  },

  // Street Side Favs
  {
    id: 'st-gs',
    name: 'Green Salad',
    price: 90,
    quantity: 1,
    category: 'Street Side Favs',
    isVeg: true,
    shortCode: 'GS01',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'st-1',
    name: 'Special Pav Bhaji with Amul Butter',
    price: 170,
    quantity: 1,
    category: 'Street Side Favs',
    isVeg: true,
    shortCode: 'ST01',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'st-2',
    name: 'Kothimbir Vadi (Crispy)',
    price: 150,
    quantity: 1,
    category: 'Street Side Favs',
    isVeg: true,
    shortCode: 'ST02'
  },

  // Tandoori Starters
  {
    id: 'tan-bn',
    name: 'Butter Naan',
    marathiName: 'बटर नान',
    price: 45,
    quantity: 1,
    category: 'Tandoori Starters',
    isVeg: true,
    shortCode: 'BN01',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'tan-1',
    name: 'Tandoori Paneer Tikka Angara',
    price: 240,
    quantity: 1,
    category: 'Tandoori Starters',
    isVeg: true,
    shortCode: 'TN01',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'tan-2',
    name: 'Murgh Tandoori (Half)',
    price: 290,
    quantity: 1,
    category: 'Tandoori Starters',
    isVeg: false,
    shortCode: 'TN02'
  },

  // Moktails G
  {
    id: 'mok-1',
    name: 'Solkadhi Signature Kokum',
    price: 70,
    quantity: 1,
    category: 'Moktails G',
    isVeg: true,
    shortCode: 'MK01',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'mok-2',
    name: 'Virgin Mojito Mint Cooler',
    price: 130,
    quantity: 1,
    category: 'Moktails G',
    isVeg: true,
    shortCode: 'MK02'
  },

  // Cocktails
  {
    id: 'ck-1',
    name: 'Classic Mojito (Rum)',
    price: 280,
    quantity: 1,
    category: 'Cocktails',
    isVeg: true,
    shortCode: 'CK01'
  },
  {
    id: 'ck-2',
    name: 'Smoked Whiskey Sour',
    price: 340,
    quantity: 1,
    category: 'Cocktails',
    isVeg: true,
    shortCode: 'CK02'
  },

  // Burgers
  {
    id: 'bg-1',
    name: 'Classic Veg Aloo Tikki Burger',
    price: 140,
    quantity: 1,
    category: 'Burgers',
    isVeg: true,
    shortCode: 'BG01',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'bg-2',
    name: 'Paneer Crispy Double Patty Burger',
    price: 190,
    quantity: 1,
    category: 'Burgers',
    isVeg: true,
    shortCode: 'BG02'
  }
];

export const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 'res-1',
    guestName: 'Adv. Suresh Deshmukh',
    guestPhone: '+91 98220 12345',
    guestEmail: 'suresh.deshmukh@gmail.com',
    tableId: 'A5',
    floorZone: 'AC Hall',
    partySize: 6,
    time: '08:30 PM',
    date: 'Today, 07 Nov',
    occasion: '25th Wedding Anniversary',
    advanceAmount: 1000,
    source: 'Phone Booking',
    status: 'Confirmed',
    notes: 'Window side table requested, bring flower bouquet on arrival, less spicy food.'
  },
  {
    id: 'res-2',
    guestName: 'Dr. Anita Kulkarni',
    guestPhone: '+91 98221 67890',
    guestEmail: 'anita.kulkarni@apollo.org',
    tableId: 'G3',
    floorZone: 'Garden Area',
    partySize: 4,
    time: '09:00 PM',
    date: 'Today, 07 Nov',
    occasion: 'Family Dinner',
    advanceAmount: 500,
    source: 'Zomato Dining',
    status: 'Confirmed',
    notes: 'Outdoor garden corner table, quiet ambiance required.'
  },
  {
    id: 'res-3',
    guestName: 'Vikram Singhania',
    guestPhone: '+91 98225 11223',
    guestEmail: 'vikram@singhaniagroup.in',
    tableId: 'A1',
    floorZone: 'AC Hall',
    partySize: 8,
    time: '09:30 PM',
    date: 'Today, 07 Nov',
    occasion: 'Corporate Dinner',
    advanceAmount: 2000,
    source: 'Direct Website',
    status: 'Confirmed',
    notes: 'VIP guest table, pre-arranged Maharashtrian Thali menu.'
  },
  {
    id: 'res-4',
    guestName: 'Neha & Rahul Joshi',
    guestPhone: '+91 91580 44556',
    tableId: 'G1',
    floorZone: 'Garden Area',
    partySize: 2,
    time: '07:45 PM',
    date: 'Today, 07 Nov',
    occasion: 'Birthday Celebration',
    source: 'Walk-in Advance',
    status: 'Seated',
    notes: 'Candle setup and complimentary pastry requested.'
  },
  {
    id: 'res-5',
    guestName: 'Rajesh Patil',
    guestPhone: '+91 94220 77889',
    tableId: 'A8',
    floorZone: 'AC Hall',
    partySize: 5,
    time: '08:00 PM',
    date: 'Tomorrow, 08 Nov',
    occasion: 'Family Gathering',
    source: 'Phone Booking',
    status: 'Confirmed',
    notes: 'High chair needed for 1 toddler.'
  }
];

export const MOCK_QUICK_ORDERS: QuickOrder[] = [
  // Delivery live orders with platforms (Swiggy, Zomato, Direct, Magicpin)
  {
    id: 'ORD-9081',
    orderNo: 'SW-4091',
    type: 'Delivery',
    platform: 'Swiggy',
    customerName: 'Pranav Patil',
    customerPhone: '+91 99230 44123',
    customerAddress: 'Flat 402, Mayur Colony, Kothrud, Pune',
    amount: 840,
    itemsCount: 3,
    items: [
      { name: 'Paneer Butter Masala Handi', quantity: 1, price: 290, notes: 'Medium spicy' },
      { name: 'Butter Naan Basket', quantity: 3, price: 180 },
      { name: 'Dal Makhani Special', quantity: 1, price: 270 }
    ],
    paymentType: 'Paid Online',
    riderName: 'Mahesh Kamble',
    riderPhone: '+91 98765 11223',
    status: 'Preparing',
    createdAt: '12 min ago'
  },
  {
    id: 'ORD-9082',
    orderNo: 'ZM-1022',
    type: 'Delivery',
    platform: 'Zomato',
    customerName: 'Sneha Shinde',
    customerPhone: '+91 98229 11982',
    customerAddress: 'B-12, Rohan Ashoka, Model Colony, Shivajinagar, Pune',
    amount: 590,
    itemsCount: 2,
    items: [
      { name: 'Mexican Farm House (Large 11")', quantity: 1, price: 649, notes: 'Extra cheese, thin crust' },
      { name: 'Garlic Bread Cheese', quantity: 1, price: 182 }
    ],
    paymentType: 'Paid Online',
    riderName: 'Ajay Shirole',
    riderPhone: '+91 91234 56789',
    status: 'Ready',
    createdAt: '18 min ago'
  },
  {
    id: 'ORD-9084',
    orderNo: 'DIR-7712',
    type: 'Delivery',
    platform: 'Direct',
    customerName: 'Sameer Inamdar',
    customerPhone: '+91 97654 32100',
    customerAddress: 'Plot 45, Prabhat Road, Deccan, Pune',
    amount: 1120,
    itemsCount: 4,
    items: [
      { name: 'Chicken Dum Biryani Family Pot', quantity: 1, price: 650 },
      { name: 'Chicken Tikka Angara', quantity: 1, price: 340, notes: 'Crispy well roasted' },
      { name: 'Chilled Solkadhi Bottle (500ml)', quantity: 2, price: 160 }
    ],
    paymentType: 'Cash on Delivery',
    riderName: 'Store Rider - Rahul',
    riderPhone: '+91 98220 99887',
    status: 'Out for Delivery',
    createdAt: '24 min ago'
  },
  {
    id: 'ORD-9085',
    orderNo: 'MP-3341',
    type: 'Delivery',
    platform: 'Magicpin',
    customerName: 'Pooja Kadam',
    customerPhone: '+91 98901 23456',
    customerAddress: 'Flat 101, Sagar Arcade, FC Road, Pune',
    amount: 460,
    itemsCount: 2,
    items: [
      { name: 'Pav Bhaji Special (2 Plates)', quantity: 2, price: 300, notes: 'Extra butter pav' },
      { name: 'Special Masala Chaas Pot', quantity: 2, price: 160 }
    ],
    paymentType: 'Paid Online',
    status: 'Preparing',
    createdAt: '6 min ago'
  },

  // Pick Up live orders with ordering platforms/channels
  {
    id: 'ORD-9083',
    orderNo: 'PU-96',
    type: 'Pick Up',
    platform: 'Takeaway Counter',
    customerName: 'Anil Joshi',
    customerPhone: '+91 94220 88219',
    pickupSlot: '07:45 PM (In 5 mins)',
    amount: 380,
    itemsCount: 2,
    items: [
      { name: 'Special Maharashtrian Thali', quantity: 1, price: 350, notes: 'Pack separate sweet box' },
      { name: 'Solkadhi Glass', quantity: 1, price: 80 }
    ],
    paymentType: 'Paid',
    status: 'Ready',
    createdAt: '15 min ago'
  },
  {
    id: 'ORD-9086',
    orderNo: 'PU-97',
    type: 'Pick Up',
    platform: 'Phone Order',
    customerName: 'Meera Rao',
    customerPhone: '+91 98221 55667',
    pickupSlot: '08:15 PM (Scheduled)',
    amount: 720,
    itemsCount: 3,
    items: [
      { name: 'Veg Dum Biryani Handi', quantity: 1, price: 320 },
      { name: 'Paneer Tikka Masala', quantity: 1, price: 290 },
      { name: 'Butter Roti (4 pcs)', quantity: 4, price: 120 }
    ],
    paymentType: 'UPI',
    status: 'Preparing',
    createdAt: '8 min ago'
  },
  {
    id: 'ORD-9087',
    orderNo: 'PU-98',
    type: 'Pick Up',
    platform: 'Direct Web',
    customerName: 'Rohit Kunte',
    customerPhone: '+91 91580 99881',
    pickupSlot: '08:00 PM',
    amount: 490,
    itemsCount: 2,
    items: [
      { name: 'Capsicum & Onion Pizza (Medium)', quantity: 1, price: 349 },
      { name: 'Cold Coffee with Ice Cream', quantity: 1, price: 140 }
    ],
    paymentType: 'Paid Online',
    status: 'Preparing',
    createdAt: '4 min ago'
  }
];

export const MOCK_TAX_RULES: TaxRule[] = [
  {
    id: 'tax-cgst',
    name: 'CGST (Central Goods and Services Tax)',
    code: 'CGST-2.5',
    rate: 2.5,
    type: 'percentage',
    applicability: 'All',
    taxNumber: 'GSTIN: 27AABCT8192K1Z9',
    isActive: true,
    description: 'Central GST applicable on restaurant food & beverage supplies'
  },
  {
    id: 'tax-sgst',
    name: 'SGST (State Goods and Services Tax)',
    code: 'SGST-2.5',
    rate: 2.5,
    type: 'percentage',
    applicability: 'All',
    taxNumber: 'GSTIN: 27AABCT8192K1Z9',
    isActive: true,
    description: 'Maharashtra State GST applicable on restaurant food & beverage supplies'
  },
  {
    id: 'tax-vat-bar',
    name: 'VAT on Alcoholic Beverages',
    code: 'VAT-ALCOHOL-10',
    rate: 10.0,
    type: 'percentage',
    applicability: 'Alcohol',
    specificCategory: 'Cocktails & Spirits',
    isActive: true,
    description: 'State excise VAT applied specifically to alcoholic bar beverages'
  },
  {
    id: 'tax-srv-chg',
    name: 'Discretionary Service Charge',
    code: 'SRV-CHG-5',
    rate: 5.0,
    type: 'percentage',
    applicability: 'Dine In',
    isActive: false,
    description: 'Voluntary dining room service charge applied specifically to Dine In tables'
  },
  {
    id: 'tax-pkg',
    name: 'Packaging & Container Cess',
    code: 'PKG-CESS-15',
    rate: 15.0,
    type: 'fixed',
    applicability: 'Delivery',
    isActive: true,
    description: 'Eco-friendly food grade packaging and foil container charge for Delivery orders'
  }
];

export const MOCK_DISCOUNT_RULES: DiscountRule[] = [
  {
    id: 'disc-flat100',
    name: 'Welcome Flat ₹100 Off',
    code: 'WELCOME100',
    type: 'fixed',
    value: 100,
    minOrderAmount: 500,
    applicability: 'All',
    isActive: true,
    description: 'Flat ₹100 deduction on minimum bill value of ₹500 across all channels'
  },
  {
    id: 'disc-happy10',
    name: '10% Happy Hours Dining',
    code: 'HAPPY10',
    type: 'percentage',
    value: 10,
    minOrderAmount: 300,
    maxDiscountCap: 200,
    applicability: 'Dine In',
    validityTime: '04:00 PM - 07:00 PM (Mon-Fri)',
    isActive: true,
    description: 'Special 10% afternoon discount on food and mocktails for Dine In guests'
  },
  {
    id: 'disc-vip15',
    name: '15% Gold Privilege Card',
    code: 'VIPGOLD15',
    type: 'percentage',
    value: 15,
    minOrderAmount: 800,
    maxDiscountCap: 350,
    applicability: 'All',
    isActive: true,
    description: 'Loyalty card discount for registered frequent patrons and members'
  },
  {
    id: 'disc-weekend20',
    name: '20% Weekend Family Feast',
    code: 'FEAST20',
    type: 'percentage',
    value: 20,
    minOrderAmount: 1500,
    maxDiscountCap: 500,
    applicability: 'Food Only',
    validityTime: 'Saturday & Sunday All Day',
    isActive: true,
    description: 'Weekend celebration discount on group dining and family food orders'
  },
  {
    id: 'disc-staff100',
    name: '100% Complimentary Staff / Management Meal',
    code: 'STAFF100',
    type: 'percentage',
    value: 100,
    minOrderAmount: 0,
    applicability: 'All',
    isActive: true,
    description: 'Official manager authorization code for internal testing and staff rations'
  }
];

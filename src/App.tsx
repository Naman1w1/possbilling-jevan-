import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { SubHeader } from './components/SubHeader';
import { ZoneSection } from './components/ZoneSection';
import { MandalaBackground } from './components/MandalaBackground';
import { PosBillingPage } from './components/PosBillingPage';
import { OperationsPage } from './components/OperationsPage';
import { TableDetailModal } from './components/TableDetailModal';
import { PrintBillModal } from './components/PrintBillModal';
import { AddTableModal } from './components/AddTableModal';
import { ReservationModal } from './components/ReservationModal';
import { ContactlessModal } from './components/ContactlessModal';
import { MoveKOTModal } from './components/MoveKOTModal';
import { QuickOrderModal } from './components/QuickOrderModal';
import { SidebarDrawer, SidebarFeature } from './components/SidebarDrawer';
import { KitchenDisplayModal } from './components/KitchenDisplayModal';
import { KitchenDisplayPage } from './components/KitchenDisplayPage';
import { LiveViewPage } from './components/LiveViewPage';
import { OrdersPage } from './components/OrdersPage';
import { ReportsModal } from './components/ReportsModal';
import { SettingsModal } from './components/SettingsModal';
import { SettleSaveModal } from './components/SettleSaveModal';
import { RecentDrawer } from './components/RecentDrawer';
import { ItemOnOffPage } from './components/ItemOnOffPage';
import { DayEndSummaryPage } from './components/DayEndSummaryPage';
import { LiveChannelOrdersModal } from './components/LiveChannelOrdersModal';
import { INITIAL_TABLES, MOCK_RESERVATIONS, MOCK_QUICK_ORDERS, MOCK_TAX_RULES, MOCK_DISCOUNT_RULES } from './data/mockData';
import { Table, TableStatus, ZoneId, Reservation, QuickOrder, TaxRule, DiscountRule } from './types/pos';

export const App: React.FC = () => {
  // State
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<TableStatus | 'all'>('all');
  const [layout, setLayout] = useState<string>('Default Layout');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Active table for POS Billing Page redirect
  const [billingTable, setBillingTable] = useState<Table | null>(null);
  const [currentView, setCurrentView] = useState<'tables' | 'operations' | 'kds' | 'live-view' | 'orders' | 'item-on-off' | 'day-end'>('tables');
  const [liveViewTab, setLiveViewTab] = useState<'order-view' | 'kot-view'>('order-view');
  const [liveViewKdsMode, setLiveViewKdsMode] = useState<'live' | 'recent'>('live');
  const [isRecentDrawerOpen, setIsRecentDrawerOpen] = useState<boolean>(false);

  // Modals state
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [tableForPrint, setTableForPrint] = useState<Table | null>(null);
  const [tableToSettle, setTableToSettle] = useState<Table | null>(null);
  const [isAddTableOpen, setIsAddTableOpen] = useState<boolean>(false);
  const [isReservationOpen, setIsReservationOpen] = useState<boolean>(false);
  const [isContactlessOpen, setIsContactlessOpen] = useState<boolean>(false);
  const [isMoveKOTOpen, setIsMoveKOTOpen] = useState<boolean>(false);
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState<boolean>(false);
  const [quickOrderType, setQuickOrderType] = useState<'Delivery' | 'Pick Up'>('Delivery');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isKdsOpen, setIsKdsOpen] = useState<boolean>(false);
  const [isReportsOpen, setIsReportsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [operationsInitialSection, setOperationsInitialSection] = useState<'tables' | 'menu' | 'reservation' | 'taxes' | 'discounts' | null>(null);
  const [liveChannelModal, setLiveChannelModal] = useState<'Delivery' | 'Pick Up' | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
  const [quickOrders, setQuickOrders] = useState<QuickOrder[]>(MOCK_QUICK_ORDERS);
  const [taxRules, setTaxRules] = useState<TaxRule[]>(MOCK_TAX_RULES);
  const [discountRules, setDiscountRules] = useState<DiscountRule[]>(MOCK_DISCOUNT_RULES);

  // Active counts for legend and badges
  const activeCounts = useMemo(() => {
    const counts = {
      blank: 0,
      running: 0,
      printed: 0,
      paid: 0,
      kot: 0,
      total: tables.length,
      totalSales: 0
    };
    tables.forEach((t) => {
      counts[t.status] = (counts[t.status] || 0) + 1;
      if (t.status !== 'blank') {
        counts.totalSales += t.amount;
      }
    });
    return counts;
  }, [tables]);

  // Match search tables by Bill No, KOT No, or Table ID
  const matchedTableIds = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    return tables
      .filter((t) => {
        if (t.billNo?.toLowerCase().includes(q)) return true;
        if (t.kotNo?.toLowerCase().includes(q)) return true;
        if (t.id.toLowerCase() === q) return true;
        if (t.serverName?.toLowerCase().includes(q)) return true;
        return false;
      })
      .map((t) => t.id);
  }, [tables, searchQuery]);

  // Filtered tables based on Status & Layout
  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      // Status filter
      if (selectedStatus !== 'all' && table.status !== selectedStatus) {
        return false;
      }
      // Layout filter
      if (layout === 'Occupied Only' && table.status === 'blank') {
        return false;
      }
      return true;
    });
  }, [tables, selectedStatus, layout]);

  // Group by Zones
  const zones: ZoneId[] = ['AC', 'Garden', 'Non-AC', 'Smoking-Zone'];

  // Table action handlers
  const handleUpdateTable = (updated: Table) => {
    setTables((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setSelectedTable(updated);
  };

  const handleAddTable = (newTable: Table) => {
    setTables((prev) => [...prev, newTable]);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleSeatReservation = (tableId: string, guestName: string, partySize: number) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === tableId) {
          return {
            ...t,
            status: 'running',
            guests: partySize,
            serverName: 'Captain Ramesh',
            durationMinutes: 1,
            seatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            kotNo: `KOT-${Math.floor(420 + Math.random() * 50)}`,
            amount: 0,
            items: []
          };
        }
        return t;
      })
    );
  };

  const handleTransferKOT = (fromTableId: string, toTableId: string) => {
    setTables((prev) => {
      const source = prev.find((t) => t.id === fromTableId);
      const target = prev.find((t) => t.id === toTableId);

      if (!source || !target) return prev;

      const mergedItems = [...target.items, ...source.items];
      const mergedAmount = mergedItems.reduce((acc, it) => acc + it.price * it.quantity, 0) * 1.05;

      return prev.map((t) => {
        if (t.id === toTableId) {
          return {
            ...t,
            status: 'running',
            amount: Math.round(mergedAmount),
            items: mergedItems,
            kotNo: target.kotNo || source.kotNo,
            guests: Math.max(target.guests, source.guests)
          };
        }
        if (t.id === fromTableId) {
          return {
            ...t,
            status: 'blank',
            durationMinutes: 0,
            amount: 0,
            guests: 0,
            billNo: undefined,
            kotNo: undefined,
            items: []
          };
        }
        return t;
      });
    });
  };

  const handleConfirmSettle = (
    tbl: Table,
    settleData: {
      paymentType: 'Cash' | 'Card' | 'Due' | 'Other' | 'Part';
      customerPaid: number;
      returnAmount: number;
      tip: number;
      settlementAmount: number;
      dueInfo?: { name: string; phone: string; location: string };
    }
  ) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === tbl.id) {
          return {
            ...t,
            status: 'blank', // Table automatically becomes blank table after Settle & Save
            amount: 0,
            durationMinutes: 0,
            guests: 0,
            billNo: undefined,
            kotNo: undefined,
            seatedAt: undefined,
            items: [],
            customerName: undefined,
            customerPhone: undefined,
            customerLocation: undefined,
            paymentMode: settleData.paymentType,
          };
        }
        return t;
      })
    );
    alert(`Table ${tbl.id} settled successfully (₹${settleData.settlementAmount.toFixed(2)} via ${settleData.paymentType}).\nTable ${tbl.id} is now blank and ready for next guests.`);
  };

  // Redirect to home page (table page) when New Order button is clicked
  const handleNewOrder = () => {
    setBillingTable(null);
    setCurrentView('tables');
  };

  // Sidebar Feature Navigation
  const activeSidebarFeature: SidebarFeature = billingTable
    ? 'billing'
    : currentView === 'operations'
    ? 'operations'
    : currentView === 'kds'
    ? 'kitchen-display'
    : 'operations';

  const handleSelectSidebarFeature = (feature: SidebarFeature) => {
    if (feature === 'billing') {
      if (!billingTable) {
        // Pick first occupied table or first table
        const targetTable = tables.find((t) => t.status !== 'blank') || tables[0];
        setBillingTable(targetTable);
      }
    } else if (feature === 'operations') {
      setBillingTable(null);
      setCurrentView('operations');
    } else if (feature === 'kitchen-display') {
      setBillingTable(null);
      setCurrentView('kds');
    } else if (feature === 'report') {
      setIsReportsOpen(true);
    } else if (feature === 'setting') {
      setIsSettingsOpen(true);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out from Manager session (Riya Sharma)?')) {
      alert('Logged out successfully. Returning to Home Tables view.');
      setBillingTable(null);
      setCurrentView('tables');
    }
  };

  return (
    <div className={`relative ${billingTable || currentView === 'operations' || currentView === 'kds' || currentView === 'live-view' ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-[#f7f4ed] text-stone-800 font-sans flex flex-col antialiased selection:bg-maroon-800 selection:text-white`}>
      
      {/* Decorative Traditional Indian Mandala Ambient Watermarks */}
      <MandalaBackground />

      {/* Top Main Navigation Header - Same Across Whole Software */}
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onNewOrder={handleNewOrder}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenLiveView={() => {
          setBillingTable(null);
          setLiveViewTab('order-view');
          setLiveViewKdsMode('live');
          setCurrentView('live-view');
        }}
        onOpenOrders={() => {
          setBillingTable(null);
          setCurrentView('orders');
        }}
        onOpenRecent={() => {
          setIsRecentDrawerOpen(true);
        }}
        onOpenItemOnOff={() => {
          setBillingTable(null);
          setCurrentView('item-on-off');
        }}
        onOpenHold={() => {
          alert('Hold Orders:\n• HOLD-01: Table A14 (Awaiting dessert choice)\n• HOLD-02: Counter Order (Cash mismatch check)');
        }}
        onOpenAlerts={() => {
          alert('System Alerts:\n• Table A1 seated > 4 hours\n• Low inventory warning: Solkadhi (4 units left)\n• Swiggy incoming delivery order pending accept');
        }}
      />

      {/* Conditional View: When table is clicked, redirect to POS Billing Page, else Operations or Table View */}
      {billingTable ? (
        <PosBillingPage
          table={billingTable}
          onBackToTables={() => {
            setBillingTable(null);
            setCurrentView('tables');
          }}
          onUpdateTable={(updated) => {
            handleUpdateTable(updated);
            setBillingTable(updated);
          }}
          onPrintBill={(tbl) => {
            setBillingTable(null);
            setTableForPrint(tbl);
          }}
        />
      ) : currentView === 'operations' ? (
        <OperationsPage
          tables={tables}
          onUpdateTables={(newTables) => setTables(newTables)}
          onNavigateToBilling={(target) => {
            const tbl = target || tables.find((t) => t.status !== 'blank') || tables[0];
            setBillingTable(tbl);
          }}
          onNavigateToTables={() => {
            setBillingTable(null);
            setCurrentView('tables');
          }}
          onOpenReservation={() => setIsReservationOpen(true)}
          onOpenKds={() => {
            setBillingTable(null);
            setCurrentView('kds');
          }}
          onOpenLiveView={() => {
            setBillingTable(null);
            setCurrentView('live-view');
          }}
          onOpenOrders={() => {
            setBillingTable(null);
            setCurrentView('orders');
          }}
          onOpenReports={() => setIsReportsOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onPrintBill={(tbl) => setTableForPrint(tbl)}
          initialOpenSection={operationsInitialSection}
          reservations={reservations}
          onUpdateReservations={(newRes) => setReservations(newRes)}
          onSeatCustomer={(tableId, guestName, partySize) => {
            setTables((prev) =>
              prev.map((t) =>
                t.id === tableId
                  ? {
                      ...t,
                      status: 'running',
                      guests: partySize,
                      dueCustomer: {
                        name: guestName,
                        phone: '',
                        location: '',
                      },
                    }
                  : t
              )
            );
          }}
          taxRules={taxRules}
          onUpdateTaxRules={(newRules) => setTaxRules(newRules)}
          discountRules={discountRules}
          onUpdateDiscountRules={(newRules) => setDiscountRules(newRules)}
        />
      ) : currentView === 'kds' ? (
        <KitchenDisplayPage
          tables={tables}
          onBackToTables={() => {
            setBillingTable(null);
            setCurrentView('tables');
          }}
          onNavigateToBilling={(target) => {
            const tbl = target || tables.find((t) => t.status !== 'blank') || tables[0];
            setBillingTable(tbl);
          }}
        />
      ) : currentView === 'live-view' ? (
        <LiveViewPage
          tables={tables}
          initialTab={liveViewTab}
          initialKdsMode={liveViewKdsMode}
          onBackToTables={() => {
            setBillingTable(null);
            setCurrentView('tables');
          }}
          onNavigateToBilling={(target) => {
            const tbl = target || tables.find((t) => t.status !== 'blank') || tables[0];
            setBillingTable(tbl);
          }}
          onOpenKds={() => {
            setBillingTable(null);
            setCurrentView('kds');
          }}
          onSettleTable={(tableId, paymentMode) => {
            setTables((prev) =>
              prev.map((t) => {
                if (t.id.toLowerCase() === tableId.toLowerCase() || t.id.includes(tableId)) {
                  return {
                    ...t,
                    status: 'blank',
                    amount: 0,
                    durationMinutes: 0,
                    guests: 0,
                    billNo: undefined,
                    kotNo: undefined,
                    seatedAt: undefined,
                    items: [],
                    customerName: undefined,
                    customerPhone: undefined,
                    customerLocation: undefined,
                    paymentMode: paymentMode as any,
                  };
                }
                return t;
              })
            );
          }}
        />
      ) : currentView === 'orders' ? (
        <OrdersPage
          tables={tables}
          onBack={() => {
            setCurrentView('tables');
          }}
          onNavigateToBilling={(target) => {
            const tbl = target || tables.find((t) => t.status !== 'blank') || tables[0];
            setBillingTable(tbl);
          }}
          onPrintBill={(tbl) => setTableForPrint(tbl)}
        />
      ) : currentView === 'item-on-off' ? (
        <ItemOnOffPage
          onBack={() => {
            setCurrentView('tables');
          }}
        />
      ) : currentView === 'day-end' ? (
        <DayEndSummaryPage
          onBack={() => {
            setCurrentView('operations');
          }}
        />
      ) : (
        <>
          {/* SubHeader: Table View Title, Action Buttons, and Status Legend Filters */}
          <SubHeader
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            onOpenReservation={() => setIsReservationOpen(true)}
            onOpenContactless={() => setIsContactlessOpen(true)}
            onOpenMoveKOT={() => setIsMoveKOTOpen(true)}
            onOpenAddTable={() => {
              setOperationsInitialSection('tables');
              setCurrentView('operations');
            }}
            onOpenDelivery={() => {
              setLiveChannelModal('Delivery');
            }}
            onOpenPickUp={() => {
              setLiveChannelModal('Pick Up');
            }}
            selectedStatus={selectedStatus}
            onSelectStatus={setSelectedStatus}
            layout={layout}
            onChangeLayout={setLayout}
            activeCounts={activeCounts}
          />

          {/* Main Floor Plan Area */}
          <main className="flex-1 max-w-[1920px] w-full mx-auto px-3 sm:px-5 py-4 z-10">

            {/* Floor Zones Grid - Full width, clean, NO camera square */}
            <div className="space-y-3">
              {zones.map((zone) => {
                const zoneTables = filteredTables.filter((t) => t.zone === zone);
                if (zoneTables.length === 0 && selectedStatus !== 'all') return null;

                return (
                  <ZoneSection
                    key={zone}
                    zone={zone}
                    tables={zoneTables}
                    onTableClick={(tbl) => setBillingTable(tbl)}
                    onQuickView={(tbl, e) => {
                      e.stopPropagation();
                      setBillingTable(tbl);
                    }}
                    onQuickBill={(tbl, e) => {
                      e.stopPropagation();
                      setTableForPrint(tbl);
                    }}
                    onSettle={(tbl, e) => {
                      e.stopPropagation();
                      setTableToSettle(tbl);
                    }}
                    matchedTableIds={matchedTableIds}
                  />
                );
              })}
            </div>

          </main>
        </>
      )}

      {/* Modals & Drawers */}
      <TableDetailModal
        table={selectedTable}
        onClose={() => setSelectedTable(null)}
        onUpdateTable={handleUpdateTable}
        onPrintBill={(tbl) => {
          setSelectedTable(null);
          setTableForPrint(tbl);
        }}
      />

      <PrintBillModal
        table={tableForPrint}
        onClose={() => setTableForPrint(null)}
      />

      <SettleSaveModal
        isOpen={Boolean(tableToSettle)}
        table={tableToSettle}
        onClose={() => setTableToSettle(null)}
        onConfirmSettle={handleConfirmSettle}
      />

      <AddTableModal
        isOpen={isAddTableOpen}
        onClose={() => setIsAddTableOpen(false)}
        onAddTable={handleAddTable}
        existingTableIds={tables.map((t) => t.id)}
      />

      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        tables={tables}
        onSeatReservation={handleSeatReservation}
        onAddReservation={(newRes) => setReservations((prev) => [newRes, ...prev])}
      />

      {liveChannelModal && (
        <LiveChannelOrdersModal
          channel={liveChannelModal}
          isOpen={Boolean(liveChannelModal)}
          onClose={() => setLiveChannelModal(null)}
          orders={quickOrders}
          onUpdateOrderStatus={(orderId, newStatus) => {
            setQuickOrders((prev) =>
              prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
            );
          }}
          onAddNewOrder={(ch) => {
            setQuickOrderType(ch);
            setIsQuickOrderOpen(true);
            setLiveChannelModal(null);
          }}
          onPrintOrder={(ord) => {
            alert(`Printing Bill & KOT for Order #${ord.orderNo || ord.id}...`);
          }}
        />
      )}

      <ContactlessModal
        isOpen={isContactlessOpen}
        onClose={() => setIsContactlessOpen(false)}
        tables={tables}
      />

      <MoveKOTModal
        isOpen={isMoveKOTOpen}
        onClose={() => setIsMoveKOTOpen(false)}
        tables={tables}
        onTransfer={handleTransferKOT}
      />

      <QuickOrderModal
        isOpen={isQuickOrderOpen}
        onClose={() => setIsQuickOrderOpen(false)}
        defaultType={quickOrderType}
      />

      <KitchenDisplayModal
        isOpen={isKdsOpen}
        onClose={() => setIsKdsOpen(false)}
        tables={tables}
      />

      <ReportsModal
        isOpen={isReportsOpen}
        onClose={() => setIsReportsOpen(false)}
        tables={tables}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeFeature={activeSidebarFeature}
        onSelectFeature={handleSelectSidebarFeature}
        onLogout={handleLogout}
      />

      {/* Recent Drawer matching Image 1 */}
      <RecentDrawer
        isOpen={isRecentDrawerOpen}
        onClose={() => setIsRecentDrawerOpen(false)}
        onSelectOrder={(orderNo) => {
          setIsRecentDrawerOpen(false);
          const matched = tables.find((t) => t.id === orderNo || t.billNo === orderNo);
          if (matched) {
            setBillingTable(matched);
          } else {
            setCurrentView('orders');
          }
        }}
      />

    </div>
  );
};

export default App;


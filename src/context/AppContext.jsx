import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation State: 'cashierLogin', 'cashier', 'pingate', 'owner'
  const [currentScreen, setCurrentScreen] = useState('cashierLogin');
  
  // State Initialization from LocalStorage
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [shifts, setShifts] = useState(() => {
    const saved = localStorage.getItem('shifts');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeShift, setActiveShift] = useState(() => {
    const saved = localStorage.getItem('activeShift');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [unsyncedCount, setUnsyncedCount] = useState(() => {
    const saved = localStorage.getItem('unsyncedCount');
    return saved ? JSON.parse(saved) : 0;
  });

  const [activeBatch, setActiveBatch] = useState(() => {
    const saved = localStorage.getItem('activeBatch');
    return saved ? JSON.parse(saved) : {
      id: 'BATCH-001',
      startTime: new Date().toISOString(),
      digitalRemaining: 1000
    };
  });

  const [pricePerLiter, setPricePerLiter] = useState(() => {
    const saved = localStorage.getItem('pricePerLiter');
    return saved ? JSON.parse(saved) : 10000;
  });

  // Persist State Effect
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('shifts', JSON.stringify(shifts));
    localStorage.setItem('activeShift', JSON.stringify(activeShift));
    localStorage.setItem('activeBatch', JSON.stringify(activeBatch));
    localStorage.setItem('unsyncedCount', JSON.stringify(unsyncedCount));
    localStorage.setItem('pricePerLiter', JSON.stringify(pricePerLiter));
  }, [transactions, shifts, activeShift, activeBatch, unsyncedCount, pricePerLiter]);

  const [printReceipt, setPrintReceipt] = useState(true);

  const addTransaction = (amount) => {
    const volume = amount / pricePerLiter;
    
    // Create new transaction
    const newTx = {
      id: Date.now().toString(),
      amount,
      volume,
      createdAt: new Date().toISOString()
    };
    
    // Update State
    setTransactions(prev => [newTx, ...prev]);
    setActiveBatch(prev => ({
      ...prev,
      digitalRemaining: Math.max(0, prev.digitalRemaining - volume)
    }));
    
    if (activeShift) {
      setActiveShift(prev => ({
        ...prev,
        transactions: prev.transactions + 1,
        totalSales: prev.totalSales + amount
      }));
    }
    
    setUnsyncedCount(prev => prev + 1);
  };

  const openShift = (pin) => {
    let cashierName = 'Kasir Default';
    if (pin === '111111') cashierName = 'Kasir 1 (Andi)';
    if (pin === '222222') cashierName = 'Kasir 2 (Budi)';

    if (activeShift) {
      if (activeShift.cashierId === cashierName) {
        // Resume active shift for the same cashier
        return;
      } else {
        // Different cashier logged in, auto-close the previous shift
        setShifts(prev => [{...activeShift, endTime: new Date().toISOString()}, ...prev]);
      }
    }

    // Open new shift
    setActiveShift({
      id: `SHF-${Math.floor(Math.random() * 10000)}`,
      cashierId: cashierName,
      startTime: new Date().toISOString(),
      transactions: 0,
      totalSales: 0
    });
  };

  const closeShift = () => {
    if (activeShift) {
      setShifts(prev => [{...activeShift, endTime: new Date().toISOString()}, ...prev]);
      setActiveShift(null);
    }
  };

  const closeBatch = () => {
    setActiveBatch(prev => ({
      ...prev,
      status: 'CLOSED'
    }));
  };

  const openBatch = (volume) => {
    if (!volume || isNaN(volume) || volume <= 0) return;
    setActiveBatch({
      id: `BATCH-00${Math.floor(Math.random() * 100) + 2}`,
      startTime: new Date().toISOString(),
      initialVolume: volume,
      digitalRemaining: volume,
      status: 'ACTIVE'
    });
  };

  const resetDaily = () => {
    setShifts([]);
    setTransactions([]);
    if (activeShift) {
      setActiveShift(prev => ({...prev, transactions: 0, totalSales: 0}));
    }
  };

  const value = {
    currentScreen,
    setCurrentScreen,
    activeBatch,
    transactions,
    unsyncedCount,
    setUnsyncedCount,
    printReceipt,
    setPrintReceipt,
    addTransaction,
    closeBatch,
    openBatch,
    resetDaily,
    pricePerLiter,
    setPricePerLiter,
    shifts,
    activeShift,
    openShift,
    closeShift
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext);

import React from 'react';
import { useAppContext } from './context/AppContext';
import CashierScreen from './screens/CashierScreen';
import PinGateScreen from './screens/PinGateScreen';
import OwnerDashboard from './screens/OwnerDashboard';
import CashierLoginScreen from './screens/CashierLoginScreen';

function AppContent() {
  const { currentScreen } = useAppContext();

  return (
    <div className="mobile-wrapper">
      {currentScreen === 'cashierLogin' && <CashierLoginScreen />}
      {currentScreen === 'cashier' && <CashierScreen />}
      {currentScreen === 'pingate' && <PinGateScreen />}
      {currentScreen === 'owner' && <OwnerDashboard />}
    </div>
  );
}

export default function App() {
  return <AppContent />;
}

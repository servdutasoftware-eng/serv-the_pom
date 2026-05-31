import { useState } from 'react';
import { UserCircle, ShieldAlert } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Numpad from '../components/Numpad';

export default function CashierLoginScreen() {
  const { setCurrentScreen, openShift } = useAppContext();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const VALID_PINS = ['111111', '222222'];

  const handleInput = (val) => {
    if (pin.length < 6) {
      const newPin = pin + val;
      setPin(newPin);
      setError(false);
      
      if (newPin.length === 6) {
        if (VALID_PINS.includes(newPin)) {
          openShift(newPin);
          setTimeout(() => setCurrentScreen('cashier'), 300);
        } else {
          setError(true);
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="screen-container animate-fade-in" style={{ position: 'relative', justifyContent: 'center', alignItems: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <button 
        onClick={() => setCurrentScreen('pingate')}
        style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--border-color)', cursor: 'pointer' }}
        title="Akses Owner"
      >
        <ShieldAlert size={24} />
      </button>

      <img src="/src/assets/logo.png" alt="Logo" style={{ height: '48px', objectFit: 'contain', marginBottom: '32px' }} />
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px', width: '100%' }}>
        <div style={{ 
          width: '64px', height: '64px', borderRadius: '50%', 
          background: 'rgba(255,255,255,0.05)', display: 'flex', 
          justifyContent: 'center', alignItems: 'center', marginBottom: '16px'
        }}>
          <UserCircle size={32} color={error ? 'var(--danger)' : 'var(--primary-color)'} />
        </div>
        <h2 style={{ marginBottom: '8px' }}>Login Kasir</h2>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px', textAlign: 'center' }}>
          <p>Kasir 1: 111111</p>
          <p>Kasir 2: 222222</p>
        </div>

        {/* PIN Dots */}
        <div style={{ display: 'flex', gap: '16px' }}>
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              style={{
                width: '16px', height: '16px', borderRadius: '50%',
                background: i < pin.length ? 'var(--primary-color)' : 'transparent',
                border: `2px solid ${i < pin.length ? 'var(--primary-color)' : 'var(--border-color)'}`,
                transition: 'all 0.2s',
                boxShadow: i < pin.length ? '0 0 10px var(--primary-glow)' : 'none',
                transform: error ? 'translateX(0)' : 'none'
              }}
            />
          ))}
        </div>
        
        {error && <p style={{ color: 'var(--danger)', marginTop: '16px', animation: 'fadeIn 0.3s' }}>PIN Salah</p>}
      </div>

      <div style={{ width: '100%', marginTop: '16px' }}>
        <Numpad onInput={handleInput} onDelete={handleDelete} mode="pin" />
      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: '16px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>
        SERV the Pom v1.01
      </div>
    </div>
  );
}

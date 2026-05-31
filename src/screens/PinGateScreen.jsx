import { useState } from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Numpad from '../components/Numpad';

export default function PinGateScreen() {
  const { setCurrentScreen } = useAppContext();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const MOCK_PIN = '123456';

  const handleInput = (val) => {
    if (pin.length < 6) {
      const newPin = pin + val;
      setPin(newPin);
      setError(false);
      
      if (newPin.length === 6) {
        if (newPin === MOCK_PIN) {
          setTimeout(() => setCurrentScreen('owner'), 300);
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
    <div className="screen-container animate-fade-in" style={{ justifyContent: 'space-between' }}>
      <div className="header" style={{ marginBottom: '0' }}>
        <button 
          onClick={() => setCurrentScreen('cashierLogin')}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '40px 0' }}>
        <div style={{ 
          width: '64px', height: '64px', borderRadius: '50%', 
          background: 'rgba(255,255,255,0.05)', display: 'flex', 
          justifyContent: 'center', alignItems: 'center', marginBottom: '24px'
        }}>
          <Lock size={32} color={error ? 'var(--danger)' : 'var(--primary-color)'} />
        </div>
        <h2 style={{ marginBottom: '8px' }}>Masukan PIN Owner</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px' }}>PIN Default: 123456</p>

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
                transform: error ? 'translateX(0)' : 'none' // We can add shake animation via CSS if desired
              }}
            />
          ))}
        </div>
        
        {error && <p style={{ color: 'var(--danger)', marginTop: '16px', animation: 'fadeIn 0.3s' }}>PIN Salah</p>}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <Numpad onInput={handleInput} onDelete={handleDelete} mode="pin" />
      </div>
    </div>
  );
}

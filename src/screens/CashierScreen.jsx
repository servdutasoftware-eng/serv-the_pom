import { useState } from 'react';
import { Cloud, CloudOff, Printer, CheckCircle2, Lock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Numpad from '../components/Numpad';

export default function CashierScreen() {
  const { 
    setCurrentScreen, 
    unsyncedCount, 
    printReceipt, 
    setPrintReceipt,
    addTransaction,
    pricePerLiter
  } = useAppContext();

  const [amountStr, setAmountStr] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [lastProcessed, setLastProcessed] = useState(null);
  const [confirmAmount, setConfirmAmount] = useState(null);
  const [inputType, setInputType] = useState('rupiah'); // 'rupiah' or 'liter'

  const formatRupiah = (numStr) => {
    if (!numStr) return '0';
    return parseInt(numStr, 10).toLocaleString('id-ID');
  };

  const handleInput = (val) => {
    if (inputType === 'liter') {
      if (val === '.' && amountStr.includes('.')) return;
      if (amountStr.length < 6) {
        setAmountStr(prev => prev === '0' && val !== '.' ? String(val) : prev + val);
      }
    } else {
      if (amountStr.length < 9) {
        setAmountStr(prev => prev === '0' && val !== '000' ? String(val) : prev + val);
      }
    }
  };

  const handleDelete = () => {
    setAmountStr(prev => prev.slice(0, -1));
  };

  const processTransaction = (finalAmount) => {
    setConfirmAmount(null);
    if (!finalAmount || finalAmount < 1000) return;
    addTransaction(finalAmount);
    setAmountStr('');
    setIsCustom(false);
    
    setLastProcessed({
      amount: finalAmount,
      volume: (finalAmount / pricePerLiter).toFixed(2)
    });

    // Show success animation
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };

  const requestConfirmation = (amount) => {
    if (!amount || amount < 1000) return;
    setConfirmAmount(amount);
  };

  const handleQuickAmount = (val) => {
    requestConfirmation(val);
  };

  const handleProcessCustom = () => {
    const calculatedRupiah = inputType === 'liter' 
      ? Math.round(parseFloat(amountStr || '0') * pricePerLiter)
      : parseInt(amountStr || '0', 10);
    requestConfirmation(calculatedRupiah);
  };

  return (
    <div className="screen-container animate-fade-in" style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* Success Overlay */}
      {showSuccess && lastProcessed && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', zIndex: 50,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)'
        }}>
          <CheckCircle2 size={80} color="var(--success)" className="animate-slide-up" />
          <h2 style={{marginTop: '16px', color: 'var(--success)'}} className="animate-slide-up">Transaksi Berhasil</h2>
          <div className="animate-slide-up" style={{ animationDelay: '0.1s', textAlign: 'center', marginTop: '24px' }}>
            <p style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>Rp{lastProcessed.amount.toLocaleString('id-ID')}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px', background: 'rgba(255,255,255,0.1)', padding: '8px 24px', borderRadius: '30px' }}>
              <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Volume:</span>
              <span style={{ fontSize: '1.5rem', color: 'var(--primary-color)', fontWeight: 800 }}>{lastProcessed.volume} L</span>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Overlay */}
      {confirmAmount && !showSuccess && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', zIndex: 40,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)', padding: '24px'
        }}>
          <div className="glass animate-slide-up" style={{ width: '100%', padding: '32px', borderRadius: '24px', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Konfirmasi Transaksi</h3>
            <p style={{ fontSize: '3rem', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
              Rp{confirmAmount.toLocaleString('id-ID')}
            </p>
            <p style={{ fontSize: '1.2rem', color: 'var(--primary-color)', marginBottom: '32px', fontWeight: 600 }}>
              {(confirmAmount / pricePerLiter).toFixed(2)} Liter
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button className="btn btn-secondary" style={{ padding: '16px' }} onClick={() => setConfirmAmount(null)}>
                BATAL
              </button>
              <button className="btn btn-primary" style={{ padding: '16px' }} onClick={() => processTransaction(confirmAmount)}>
                PROSES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/src/assets/logo.png" alt="Logo" style={{ height: '36px', objectFit: 'contain' }} />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Sync Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: unsyncedCount > 0 ? 'var(--warning)' : 'var(--success)' }}>
            {unsyncedCount > 0 ? <CloudOff size={20} /> : <Cloud size={20} />}
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{unsyncedCount}</span>
          </div>

          {/* Hidden Admin Access */}
          <button 
            onClick={() => setCurrentScreen('cashierLogin')}
            style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
            title="Kunci Layar"
          >
            <Lock size={20} />
          </button>
        </div>
      </div>

      {/* Main Display */}
      <div className="glass" style={{ padding: '12px 16px', borderRadius: '16px', marginBottom: '12px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '2px' }}>
          {inputType === 'rupiah' ? 'Nominal Transaksi (Rp)' : 'Volume Transaksi (Liter)'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {inputType === 'rupiah' && <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>Rp</span>}
          <input 
            type="text" 
            className="amount-display" 
            value={inputType === 'rupiah' ? formatRupiah(amountStr) : (amountStr || '0')} 
            readOnly 
          />
          {inputType === 'liter' && <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)', marginLeft: '8px' }}>L</span>}
        </div>
        
        {/* Live Conversion Display */}
        <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
           <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
             {inputType === 'rupiah' ? `Estimasi Volume (${(pricePerLiter/1000)}k/L):` : 'Estimasi Biaya:'}
           </span>
           <span style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '1.1rem' }}>
             {inputType === 'rupiah' 
                ? `${((parseInt(amountStr || '0', 10)) / pricePerLiter).toFixed(2)} L`
                : `Rp${Math.round(parseFloat(amountStr || '0') * pricePerLiter).toLocaleString('id-ID')}`}
           </span>
        </div>
      </div>

      {/* Toggles & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: printReceipt ? 'var(--primary-color)' : 'var(--text-muted)' }}
             onClick={() => setPrintReceipt(!printReceipt)}
             style={{ cursor: 'pointer' }}>
          <Printer size={20} color={printReceipt ? 'var(--primary-color)' : 'var(--text-muted)'} />
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Cetak Struk {printReceipt ? 'ON' : 'OFF'}</span>
        </div>
      </div>

      {/* Quick Buttons or Numpad */}
      {!isCustom ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flex: 1 }}>
          <button className="quick-btn animate-slide-up" style={{ animationDelay: '0.1s' }} onClick={() => handleQuickAmount(10000)}>
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Rp</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>10k</span>
          </button>
          <button className="quick-btn animate-slide-up" style={{ animationDelay: '0.2s' }} onClick={() => handleQuickAmount(15000)}>
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Rp</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>15k</span>
          </button>
          <button className="quick-btn animate-slide-up" style={{ animationDelay: '0.3s' }} onClick={() => handleQuickAmount(20000)}>
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Rp</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>20k</span>
          </button>
          <button className="quick-btn animate-slide-up" style={{ animationDelay: '0.4s' }} onClick={() => handleQuickAmount(50000)}>
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Rp</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>50k</span>
          </button>
          
          <button className="btn btn-secondary animate-slide-up" style={{ gridColumn: 'span 2', padding: '16px', animationDelay: '0.5s' }} onClick={() => setIsCustom(true)}>
            Input Nominal Custom
          </button>
        </div>
      ) : (
        <div className="animate-slide-up" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
             <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '4px' }}>
               <button 
                 onClick={() => { setInputType('rupiah'); setAmountStr(''); }}
                 style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: inputType === 'rupiah' ? 'var(--primary-color)' : 'transparent', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
               >Rp</button>
               <button 
                 onClick={() => { setInputType('liter'); setAmountStr(''); }}
                 style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: inputType === 'liter' ? 'var(--primary-color)' : 'transparent', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
               >Liter</button>
             </div>
             <button style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer' }} onClick={() => { setIsCustom(false); setAmountStr(''); setInputType('rupiah'); }}>
               Batal
             </button>
          </div>
          <Numpad onInput={handleInput} onDelete={handleDelete} mode={inputType} />
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: 'auto', padding: '14px', fontSize: '1rem' }}
            onClick={handleProcessCustom}
          >
            PROSES TRANSAKSI
          </button>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { ArrowLeft, LogOut, Database, CloudUpload, History, Settings, Droplet, FileText } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function OwnerDashboard() {
  const { 
    setCurrentScreen, 
    activeBatch, 
    transactions, 
    closeBatch, 
    openBatch,
    resetDaily,
    unsyncedCount,
    setUnsyncedCount,
    shifts,
    activeShift,
    pricePerLiter,
    setPricePerLiter
  } = useAppContext();

  const [newVolume, setNewVolume] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null); // 'reset' or 'batch'
  const [editPrice, setEditPrice] = useState(false);
  const [tempPrice, setTempPrice] = useState(pricePerLiter ? pricePerLiter.toString() : '10000');

  const totalFromClosedShifts = shifts.reduce((sum, s) => sum + s.totalSales, 0);
  const totalActiveShift = activeShift ? activeShift.totalSales : 0;
  const totalUangLaci = totalFromClosedShifts + totalActiveShift;

  const formatRp = (num) => `Rp${num.toLocaleString('id-ID')}`;

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setUnsyncedCount(0);
      setIsSyncing(false);
    }, 1500);
  };

  return (
    <div className="screen-container animate-fade-in" style={{ position: 'relative', overflowY: 'auto', paddingBottom: '40px' }}>
      {/* Confirmation Overlay */}
      {confirmModal && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', zIndex: 50,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)', padding: '24px'
        }}>
          <div className="glass animate-slide-up" style={{ width: '100%', padding: '32px', borderRadius: '24px', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Konfirmasi Aksi</h3>
            
            {confirmModal === 'reset' && (
              <p style={{ color: 'white', marginBottom: '32px', lineHeight: '1.5' }}>
                Anda yakin ingin menarik uang dan mereset laporan hari ini? Seluruh riwayat sesi kasir akan dihapus dari layar ini.
              </p>
            )}

            {confirmModal === 'price' && (
              <p style={{ color: 'white', marginBottom: '32px', lineHeight: '1.5' }}>
                Anda yakin ingin mengubah harga bensin dari <strong style={{ color: 'var(--danger)' }}>{formatRp(pricePerLiter)}</strong> menjadi <strong style={{ color: 'var(--success)' }}>{formatRp(parseInt(tempPrice))}</strong> per liter?
              </p>
            )}

            {confirmModal === 'batch' && (() => {
              const initial = activeBatch.initialVolume || 1000;
              const remaining = activeBatch.digitalRemaining;
              const shrinkagePercent = (remaining / initial) * 100;
              const isFraud = shrinkagePercent > 1.0;

              return (
                <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '16px', marginBottom: '32px' }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontWeight: 600, textAlign: 'center' }}>Rekonsiliasi Tangki Habis</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Stok Awal Batch:</span>
                    <span style={{ fontWeight: 600 }}>{initial} L</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Sisa Digital (Sistem):</span>
                    <span style={{ fontWeight: 600 }}>{remaining.toFixed(2)} L</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px dashed rgba(255,255,255,0.2)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Fisik Tangki Aktual:</span>
                    <span style={{ fontWeight: 600 }}>0 L (Habis)</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Total Penyusutan:</span>
                    <span style={{ fontWeight: 800, color: isFraud ? 'var(--danger)' : 'var(--warning)', fontSize: '1.2rem' }}>
                      {remaining.toFixed(2)} L <span style={{ fontSize: '0.9rem' }}>({shrinkagePercent.toFixed(2)}%)</span>
                    </span>
                  </div>

                  <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', background: isFraud ? 'rgba(255,59,48,0.15)' : 'rgba(52,199,89,0.15)', border: `1px solid ${isFraud ? 'var(--danger)' : 'var(--success)'}`, textAlign: 'center' }}>
                    <span style={{ fontWeight: 700, color: isFraud ? 'var(--danger)' : 'var(--success)' }}>
                      {isFraud ? '⚠️ INDIKASI FRAUD / KEBOCORAN' : '✅ PENYUSUTAN WAJAR'}
                    </span>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                      {isFraud ? 'Selisih melebihi batas toleransi penguapan 1%.' : 'Selisih berada di bawah batas toleransi penguapan normal (1%).'}
                    </p>
                  </div>
                </div>
              );
            })()}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button className="btn btn-secondary" style={{ padding: '16px' }} onClick={() => setConfirmModal(null)}>
                Batal
              </button>
              <button 
                className="btn btn-primary" 
                style={{ padding: '16px', background: 'var(--primary-color)', border: 'none' }} 
                onClick={() => {
                  if (confirmModal === 'reset') {
                    resetDaily();
                  } else if (confirmModal === 'batch') {
                    closeBatch();
                    setNewVolume('');
                  } else if (confirmModal === 'price') {
                    setPricePerLiter(parseInt(tempPrice));
                    setEditPrice(false);
                  }
                  setConfirmModal(null);
                }}
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => setCurrentScreen('cashierLogin')}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
          >
            <ArrowLeft size={24} />
          </button>
          <h2>Dasbor Owner</h2>
        </div>
        <button 
          onClick={() => setCurrentScreen('cashierLogin')}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <LogOut size={20} />
        </button>
      </div>



      {/* Sync Status Card */}
      <div className="glass" style={{ borderRadius: '20px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Data Tersinkronisasi</h4>
          <p style={{ fontSize: '0.9rem' }}>{unsyncedCount === 0 ? 'Semua data aman di cloud' : `${unsyncedCount} transaksi belum diunggah`}</p>
        </div>
        <button 
          className="btn btn-primary" 
          style={{ padding: '12px', borderRadius: '12px' }}
          onClick={() => {
            setIsSyncing(true);
            setTimeout(() => {
              setIsSyncing(false);
              setUnsyncedCount(0);
            }, 1500);
          }}
        >
          <CloudUpload className={isSyncing ? "animate-spin" : ""} size={24} />
        </button>
      </div>

      {/* Fuel Indicator (Horizontal Diagram) */}
      <div className="glass animate-slide-up" style={{ borderRadius: '20px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Droplet size={18} color="var(--primary-color)" /> Sisa Bensin (Sistem)
          </h4>
          <span style={{ fontWeight: 700, color: 'white', fontSize: '1.2rem' }}>{activeBatch.digitalRemaining.toFixed(2)} L</span>
        </div>
        
        {/* Progress Bar */}
        <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ 
            width: `${Math.max(0, Math.min(100, (activeBatch.digitalRemaining / (activeBatch.initialVolume || 1000)) * 100))}%`, 
            height: '100%', 
            background: (activeBatch.digitalRemaining / (activeBatch.initialVolume || 1000)) > 0.2 ? 'var(--primary-color)' : 'var(--danger)',
            borderRadius: '6px',
            transition: 'width 0.5s ease-out'
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>Habis</span>
          <span>{activeBatch.initialVolume || 1000} L (Penuh)</span>
        </div>
      </div>

      {/* Active Batch Summary */}
      <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Database size={20} /> Batch & Stok
      </h3>
      
      <div className="glass" style={{ borderRadius: '20px', padding: '24px', marginBottom: '24px' }}>
        {activeBatch.status === 'ACTIVE' ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: 'var(--text-muted)' }}>ID Batch</span>
              <span style={{ fontWeight: 600 }}>{activeBatch.id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Stok Awal</span>
              <span style={{ fontWeight: 600 }}>{activeBatch.initialVolume} L</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimasi Sisa Digital</span>
              <span style={{ fontWeight: 800, color: 'var(--primary-color)', fontSize: '1.2rem' }}>
                {activeBatch.digitalRemaining.toFixed(2)} L
              </span>
            </div>
            <button className="btn btn-secondary" style={{ width: '100%', borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => setConfirmModal('batch')}>
              TUTUP BATCH (TANGKI HABIS)
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Tidak ada batch aktif. Silakan isi tangki dan buka batch baru.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input 
                type="number" 
                placeholder="Volume (Liter)" 
                value={newVolume}
                onChange={(e) => setNewVolume(e.target.value)}
                style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
              />
              <button className="btn btn-primary" onClick={() => openBatch(parseFloat(newVolume))}>
                Buka Batch
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Shift Financials */}
      <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <History size={20} /> Laporan Uang Tunai
      </h3>

      <div className="glass" style={{ borderRadius: '20px', padding: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Total Uang di Laci Kasir</p>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--success)' }}>{formatRp(totalUangLaci)}</h2>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', marginBottom: '16px' }}>
           <h4 style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>Riwayat Sesi Kasir</h4>
           {activeShift && (
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
               <span>{activeShift.cashierId} <span style={{fontSize:'0.8rem', color:'var(--success)'}}>(Aktif)</span></span>
               <span style={{ fontWeight: 600 }}>{formatRp(activeShift.totalSales)}</span>
             </div>
           )}
           {shifts.map((s, i) => (
             <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
               <span>{s.cashierId} <span style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>(Selesai)</span></span>
               <span style={{ fontWeight: 600 }}>{formatRp(s.totalSales)}</span>
             </div>
           ))}
           {shifts.length === 0 && !activeShift && (
             <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Belum ada data shift</p>
           )}
        </div>

        <button 
          className="btn btn-secondary" 
          style={{ width: '100%', color: 'var(--warning)', borderColor: 'var(--warning)' }}
          onClick={() => setConfirmModal('reset')}
        >
          TARIK UANG & RESET HARIAN
        </button>
      </div>

      {/* Transaction History Report */}
      <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FileText size={20} /> Riwayat Transaksi Terakhir
      </h3>

      <div className="glass" style={{ borderRadius: '20px', padding: '24px', marginBottom: '24px' }}>
        {transactions.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada transaksi tercatat</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {transactions.slice(0, 10).map((tx) => (
              <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--primary-color)' }}>{formatRp(tx.amount)}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{tx.volume.toFixed(2)} Liter</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{tx.time}</span>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>{tx.id}</span>
                </div>
              </div>
            ))}
            {transactions.length > 10 && (
              <p style={{ textAlign: 'center', color: 'var(--primary-color)', fontSize: '0.9rem', marginTop: '8px', fontWeight: 600 }}>
                Menampilkan 10 dari {transactions.length} transaksi
              </p>
            )}
          </div>
        )}
      </div>

      {/* Settings / Harga Bensin */}
      <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Settings size={20} /> Pengaturan Sistem
      </h3>

      <div className="glass" style={{ borderRadius: '20px', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Harga per Liter</span>
            {editPrice ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>Rp</span>
                <input 
                  type="number"
                  value={tempPrice}
                  onChange={e => setTempPrice(e.target.value)}
                  style={{ width: '100px', padding: '8px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--primary-color)', color: 'white', outline: 'none' }}
                  autoFocus
                />
              </div>
            ) : (
              <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'white' }}>{formatRp(pricePerLiter)}</span>
            )}
          </div>
          
          <button 
            className={`btn ${editPrice ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '0.9rem' }}
            onClick={() => {
              if (editPrice) {
                const newPrice = parseInt(tempPrice);
                if (newPrice > 0 && newPrice !== pricePerLiter) {
                  setConfirmModal('price');
                } else {
                  setEditPrice(false);
                  setTempPrice(pricePerLiter.toString());
                }
              } else {
                setEditPrice(true);
              }
            }}
          >
            {editPrice ? 'Simpan' : 'Ubah Harga'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '32px', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span>SERV the Pom v1.01</span>
        <span>Offline-First Anti-Fraud Engine</span>
      </div>

    </div>
  );
}

import React from 'react';
import { Delete } from 'lucide-react';

export default function Numpad({ onInput, onDelete, mode = 'rupiah' }) {
  let extraKey = '';
  if (mode === 'rupiah') extraKey = '000';
  else if (mode === 'liter') extraKey = '.';
  
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, extraKey, 0];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
      padding: '4px 0 12px 0'
    }}>
      {digits.map((digit, i) => (
        <button
          key={i}
          className="numpad-btn glass"
          onClick={() => digit !== '' && onInput(digit)}
          style={{ visibility: digit === '' ? 'hidden' : 'visible' }}
        >
          {digit}
        </button>
      ))}
      <button className="numpad-btn glass" onClick={onDelete} style={{ color: 'var(--danger)' }}>
        <Delete size={28} />
      </button>
    </div>
  );
}

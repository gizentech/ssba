import { useState, useEffect } from 'react';

const CORRECT_PIN = '1223';
const SESSION_KEY = 'ssba_admin_auth';

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['clear', '0', 'back'],
];

export default function AdminAuth({ children }) {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      setAuthed(true);
    }
    setChecked(true);
  }, []);

  const handleKey = (key) => {
    if (key === 'back') {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (key === 'clear') {
      setPin('');
      return;
    }
    const next = pin + key;
    if (next.length > 4) return;
    setPin(next);

    if (next.length === 4) {
      if (next === CORRECT_PIN) {
        sessionStorage.setItem(SESSION_KEY, '1');
        setAuthed(true);
      } else {
        setShake(true);
        setTimeout(() => {
          setPin('');
          setShake(false);
        }, 600);
      }
    }
  };

  if (!checked) return null;
  if (authed) return children;

  return (
    <div style={{
      minHeight: '100vh', background: '#111',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      {/* ロゴ・タイトル */}
      <p style={{ color: '#888', fontSize: 12, letterSpacing: 3, marginBottom: 8 }}>SSBA</p>
      <h1 style={{ color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 40, letterSpacing: 1 }}>
        管理画面
      </h1>

      {/* PINドット表示 */}
      <div
        style={{
          display: 'flex', gap: 16, marginBottom: 40,
          animation: shake ? 'shake 0.5s ease' : 'none',
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: 14, height: 14, borderRadius: '50%',
              background: pin.length > i ? '#fff' : 'transparent',
              border: '2px solid',
              borderColor: shake ? '#ef4444' : pin.length > i ? '#fff' : '#555',
              transition: 'background 0.15s, border-color 0.15s',
            }}
          />
        ))}
      </div>

      {/* 数字キーパッド */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {KEYS.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: 12 }}>
            {row.map((key) => {
              const isSpecial = key === 'back' || key === 'clear';
              return (
                <button
                  key={key}
                  onClick={() => handleKey(key)}
                  style={{
                    width: 72, height: 72, borderRadius: '50%', border: 'none',
                    background: isSpecial ? 'transparent' : '#2a2a2a',
                    color: isSpecial ? '#aaa' : '#fff',
                    fontSize: isSpecial ? 13 : 24,
                    fontWeight: isSpecial ? 500 : 400,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                  onTouchStart={(e) => {
                    if (!isSpecial) e.currentTarget.style.background = '#3a3a3a';
                  }}
                  onTouchEnd={(e) => {
                    if (!isSpecial) e.currentTarget.style.background = '#2a2a2a';
                  }}
                  onMouseDown={(e) => {
                    if (!isSpecial) e.currentTarget.style.background = '#3a3a3a';
                  }}
                  onMouseUp={(e) => {
                    if (!isSpecial) e.currentTarget.style.background = '#2a2a2a';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSpecial) e.currentTarget.style.background = '#2a2a2a';
                  }}
                >
                  {key === 'back' ? '⌫' : key === 'clear' ? 'C' : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';

type CatInstance = {
  id: string;
  top: number;
  startLeft: number;
  endLeft: number;
  durationMs: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const CatWalkOverlay: React.FC = () => {
  const [cats, setCats] = useState<CatInstance[]>([]);
  const clickBufferRef = useRef<Array<{ t: number; y: number }>>([]);
  const lastSpawnRef = useRef(0);

  useEffect(() => {
    const handleTrigger = (clientX: number, clientY: number) => {
      // Slightly wider "secret" area so it's actually hittable on mobile + with page padding
      if (clientX > 140) return;

      const now = Date.now();
      clickBufferRef.current = clickBufferRef.current.filter(c => now - c.t < 900);
      clickBufferRef.current.push({ t: now, y: clientY });

      // Lower threshold so it triggers reliably without needing superhuman CPS
      if (clickBufferRef.current.length < 4) return;
      if (now - lastSpawnRef.current < 1200) return;

      lastSpawnRef.current = now;
      const y = clickBufferRef.current[clickBufferRef.current.length - 1]?.y ?? 0;
      clickBufferRef.current = [];

      const catWidth = 120;
      const catHeight = 90;
      const top = clamp(y - catHeight / 2, 8, window.innerHeight - catHeight - 8);

      const startLeft = -catWidth - 20;
      const endLeft = window.innerWidth + catWidth + 20;
      const speedPxPerSec = 220;
      const durationMs = Math.max(1200, Math.round(((endLeft - startLeft) / speedPxPerSec) * 1000));

      const id = `${now}-${Math.random().toString(16).slice(2)}`;
      const instance: CatInstance = { id, top, startLeft, endLeft, durationMs };

      setCats(prev => [...prev, instance]);
      window.setTimeout(() => {
        setCats(prev => prev.filter(c => c.id !== id));
      }, durationMs + 250);
    };

    const handlePointerDown = (e: PointerEvent) => {
      handleTrigger(e.clientX, e.clientY);
    };

    const handleClick = (e: MouseEvent) => {
      handleTrigger(e.clientX, e.clientY);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60]">
      {cats.map(cat => (
        <CatWalker key={cat.id} cat={cat} />
      ))}
    </div>
  );
};

const CatWalker: React.FC<{ cat: CatInstance }> = ({ cat }) => {
  const [left, setLeft] = useState(cat.startLeft);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => setLeft(cat.endLeft));
    return () => window.cancelAnimationFrame(raf);
  }, [cat.endLeft]);

  return (
    <img
      src={`${import.meta.env.BASE_URL}cat-walk.gif`}
      alt="Walking cat"
      style={{
        position: 'fixed',
        top: cat.top,
        left,
        width: 120,
        height: 'auto',
        transitionProperty: 'left',
        transitionDuration: `${cat.durationMs}ms`,
        transitionTimingFunction: 'linear',
        zIndex: 60
      }}
      draggable={false}
    />
  );
};

export default CatWalkOverlay;

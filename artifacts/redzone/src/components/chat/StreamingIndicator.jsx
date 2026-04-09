import { useMemo } from 'react';

const KEYFRAMES = `
@keyframes rzs-bounce {
  0%, 100% { transform: translateY(0px) rotate(-8deg); }
  50%       { transform: translateY(-8px) rotate(8deg); }
}
@keyframes rzs-wave {
  0%, 100% { transform: rotate(-18deg); }
  50%       { transform: rotate(18deg); }
}
@keyframes rzs-pulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.25); }
}
@keyframes rzs-spin-wobble {
  0%   { transform: rotate(0deg) scale(1); }
  25%  { transform: rotate(15deg) scale(1.1); }
  50%  { transform: rotate(0deg) scale(1); }
  75%  { transform: rotate(-15deg) scale(1.1); }
  100% { transform: rotate(0deg) scale(1); }
}
`;

const ICONS = [
  { emoji: '🏈', animation: 'rzs-bounce 0.9s ease-in-out infinite',       label: 'football' },
  { emoji: '⛑️', animation: 'rzs-wave 0.75s ease-in-out infinite',         label: 'helmet' },
  { emoji: '☝️', animation: 'rzs-wave 0.8s ease-in-out infinite',          label: 'foam-finger' },
  { emoji: '🏆', animation: 'rzs-pulse 1s ease-in-out infinite',           label: 'trophy' },
  { emoji: '🎯', animation: 'rzs-spin-wobble 1.1s ease-in-out infinite',   label: 'target' },
];

export default function StreamingIndicator() {
  const icon = useMemo(() => ICONS[Math.floor(Math.random() * ICONS.length)], []);

  return (
    <>
      <style>{KEYFRAMES}</style>
      <span
        className="inline-flex items-center justify-center ml-2 align-middle"
        style={{ animation: icon.animation, display: 'inline-block', fontSize: '28px', lineHeight: 1 }}
        title="Coaching in progress..."
        aria-label={icon.label}
      >
        {icon.emoji}
      </span>
    </>
  );
}

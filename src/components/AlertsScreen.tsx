import React, { useState } from 'react';
import { SystemAlert } from '../types/facility';

interface AlertsScreenProps {
  alerts: SystemAlert[];
  onAcknowledgeAlert: (id: string) => void;
  onClearAll: () => void;
}

export const AlertsScreen: React.FC<AlertsScreenProps> = ({
  alerts,
  onAcknowledgeAlert,
  onClearAll,
}) => {
  const [filter, setFilter] = useState<'all' | 'unack' | 'critical'>('all');

  const filtered = alerts.filter((a) => {
    if (filter === 'unack') return !a.acknowledged;
    if (filter === 'critical') return a.level === 'critical';
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto px-4 space-y-4 pt-2 pb-24">
      <div className="p-4 rounded-xl bg-[#1c2028] shadow-sm flex flex-col gap-3 border border-[#31353e]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd6fb] text-[20px]">shield</span>
            <h2 className="text-sm text-[#dfe2ee] font-semibold">Active System Alarms</h2>
          </div>
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-[#4cd6fb] hover:underline cursor-pointer"
          >
            Ack All
          </button>
        </div>

        {/* Filter buttons */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#0a0e16] rounded-lg border border-[#31353e]/60 text-xs font-mono">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`py-1.5 px-2 rounded text-center transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#262a33] text-[#4cd6fb] font-semibold shadow-sm'
                : 'text-[#bcc9ce] hover:text-[#dfe2ee]'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unack')}
            className={`py-1.5 px-2 rounded text-center transition-all cursor-pointer ${
              filter === 'unack'
                ? 'bg-[#262a33] text-[#ffb86b] font-semibold shadow-sm'
                : 'text-[#bcc9ce] hover:text-[#dfe2ee]'
            }`}
          >
            Pending ({alerts.filter((a) => !a.acknowledged).length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('critical')}
            className={`py-1.5 px-2 rounded text-center transition-all cursor-pointer ${
              filter === 'critical'
                ? 'bg-[#262a33] text-[#ffb4ab] font-semibold shadow-sm'
                : 'text-[#bcc9ce] hover:text-[#dfe2ee]'
            }`}
          >
            Critical ({alerts.filter((a) => a.level === 'critical').length})
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        {filtered.map((alert) => {
          const isCrit = alert.level === 'critical';
          const isWarn = alert.level === 'warning';

          return (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl bg-[#262a33] border transition-all ${
                alert.acknowledged
                  ? 'border-[#31353e]/60 opacity-80'
                  : isCrit
                  ? 'border-[#ffb4ab]/60 shadow-[0_0_12px_rgba(255,180,171,0.15)]'
                  : 'border-[#ffb86b]/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <span
                    className={`material-symbols-outlined text-[20px] mt-0.5 shrink-0 ${
                      isCrit ? 'text-[#ffb4ab]' : isWarn ? 'text-[#ffb86b]' : 'text-[#4cd6fb]'
                    }`}
                  >
                    {isCrit ? 'error' : isWarn ? 'warning' : 'info'}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-[#dfe2ee]">{alert.title}</div>
                    <div className="text-[11px] text-[#bcc9ce] font-mono mt-0.5">
                      {alert.source}
                    </div>
                    {alert.value && (
                      <div className="text-[11px] text-[#4cd6fb] font-mono mt-1 bg-[#0a0e16] px-2 py-0.5 rounded inline-block">
                        {alert.value}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0 font-mono text-[10px]">
                  <span className="text-[#869398]">{alert.timestamp}</span>
                  {!alert.acknowledged ? (
                    <button
                      type="button"
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className="px-2 py-1 rounded bg-[#31353e] hover:bg-[#353942] text-[#4cd6fb] hover:text-[#b3ebff] transition-colors cursor-pointer border border-[#869398]/30 font-sans font-semibold mt-1"
                    >
                      Acknowledge
                    </button>
                  ) : (
                    <span className="text-[#4edea3] flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[13px]">check</span>
                      Ack'd
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

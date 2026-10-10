import React, { useState } from 'react';
import { MOCK_ZONES } from '../data/mockFacilityData';
import { ZoneData } from '../types/facility';

interface ZonesScreenProps {
  onSelectZoneNode: (nodeId: string) => void;
}

export const ZonesScreen: React.FC<ZonesScreenProps> = ({ onSelectZoneNode }) => {
  const [filter, setFilter] = useState<'all' | 'nominal' | 'optimizing' | 'review'>('all');
  const [search, setSearch] = useState('');

  const filteredZones = MOCK_ZONES.filter((z) => {
    const matchesFilter = filter === 'all' || z.status === filter;
    const matchesSearch =
      z.name.toLowerCase().includes(search.toLowerCase()) ||
      z.floor.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto px-4 space-y-4 pt-2 pb-24">
      {/* Zone Overview Header */}
      <div className="p-4 rounded-xl bg-[#1c2028] shadow-sm flex flex-col gap-3 border border-[#31353e]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd6fb] text-[20px]">grid_view</span>
            <h2 className="text-sm text-[#dfe2ee] font-semibold">Zone &amp; Plenum Matrix</h2>
          </div>
          <span className="text-xs text-[#bcc9ce] font-mono">8 Operational Zones</span>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined text-[#869398] text-[18px] absolute left-3 top-1/2 -translate-y-1/2">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search zones, floors, or plenums..."
            className="w-full bg-[#0a0e16] text-[#dfe2ee] placeholder:text-[#869398] text-xs rounded-lg pl-9 pr-3 py-2 border border-[#31353e]/60 focus:outline-none focus:ring-1 focus:ring-[#4cd6fb]"
          />
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-[#0a0e16] rounded-lg border border-[#31353e]/60 text-xs">
          {(['all', 'nominal', 'optimizing', 'review'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setFilter(mode)}
              className={`py-1.5 px-1 rounded text-center uppercase tracking-wider text-[10px] font-semibold transition-all cursor-pointer ${
                filter === mode
                  ? 'bg-[#262a33] text-[#4cd6fb] shadow-sm'
                  : 'text-[#bcc9ce] hover:text-[#dfe2ee]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Zones List */}
      <div className="space-y-2.5">
        {filteredZones.map((zone) => {
          const isReview = zone.status === 'review';
          const isOptimizing = zone.status === 'optimizing';

          return (
            <div
              key={zone.id}
              onClick={() => onSelectZoneNode(zone.primaryNodeId)}
              className="p-3.5 rounded-xl bg-[#262a33] hover:bg-[#31353e] transition-colors border border-[#31353e]/80 cursor-pointer flex flex-col gap-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isReview ? 'bg-[#ffb4ab]' : isOptimizing ? 'bg-[#ffb86b]' : 'bg-[#4edea3]'
                    }`}
                  ></span>
                  <div className="text-xs font-bold text-[#dfe2ee]">{zone.name}</div>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-semibold ${
                    isReview
                      ? 'bg-[#93000a]/30 text-[#ffb4ab]'
                      : isOptimizing
                      ? 'bg-[#ec9000]/20 text-[#ffb86b]'
                      : 'bg-[#00a572]/20 text-[#4edea3]'
                  }`}
                >
                  {zone.status}
                </span>
              </div>

              <div className="text-[11px] text-[#bcc9ce] flex items-center justify-between">
                <span>{zone.floor}</span>
                <span className="font-mono text-[#869398]">{zone.vavControllers} VAV Units</span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
                <div className="bg-[#0a0e16] p-2 rounded border border-[#31353e]/50">
                  <div className="text-[10px] text-[#869398]">Temp</div>
                  <div className="text-sm font-bold text-[#dfe2ee]">
                    {zone.temp}°C
                    <span className="text-[10px] font-normal text-[#869398] ml-1">
                      /{zone.setpoint}°C
                    </span>
                  </div>
                </div>
                <div className="bg-[#0a0e16] p-2 rounded border border-[#31353e]/50">
                  <div className="text-[10px] text-[#869398]">RH%</div>
                  <div className="text-sm font-bold text-[#4cd6fb]">{zone.humidity}%</div>
                </div>
                <div className="bg-[#0a0e16] p-2 rounded border border-[#31353e]/50">
                  <div className="text-[10px] text-[#869398]">Plenum P</div>
                  <div className="text-sm font-bold text-[#dfe2ee]">{zone.pressurePa} Pa</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

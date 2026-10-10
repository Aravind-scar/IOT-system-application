import React from 'react';
import { FacilityNode } from '../types/facility';

interface DashboardScreenProps {
  activeNode: FacilityNode;
  onNavigateToDevice: () => void;
  onNavigateToSettings: () => void;
  onNavigateToAlerts: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  activeNode,
  onNavigateToDevice,
  onNavigateToSettings,
  onNavigateToAlerts,
}) => {
  return (
    <div className="flex flex-col w-full max-w-lg mx-auto px-4 space-y-4 pt-2 pb-24">
      {/* Top Facility KPI Summary Banner */}
      <div className="relative overflow-hidden rounded-xl bg-[#262a33] p-4 shadow-md border border-[#31353e]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#4cd6fb] text-[18px]">
              analytics
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#bcc9ce]">
              Facility Core Telemetry
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#4edea3] bg-[#00a572]/20 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
            All Plenums Balanced
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="p-2.5 rounded-lg bg-[#0a0e16] border border-[#31353e]/60">
            <div className="text-[10px] uppercase font-semibold text-[#869398]">Facility Power</div>
            <div className="text-xl font-bold font-mono text-[#dfe2ee] mt-0.5">1.42 MW</div>
            <div className="text-[10px] text-[#4edea3] font-mono">94.2% Power Factor</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#0a0e16] border border-[#31353e]/60">
            <div className="text-[10px] uppercase font-semibold text-[#869398]">Plenum Avg Temp</div>
            <div className="text-xl font-bold font-mono text-[#dfe2ee] mt-0.5">21.8°C</div>
            <div className="text-[10px] text-[#4cd6fb] font-mono">Target ±0.3°C drift</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#0a0e16] border border-[#31353e]/60">
            <div className="text-[10px] uppercase font-semibold text-[#869398]">Chiller COP</div>
            <div className="text-xl font-bold font-mono text-[#4edea3] mt-0.5">4.82</div>
            <div className="text-[10px] text-[#bcc9ce] font-mono">Design: 4.60 COP</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#0a0e16] border border-[#31353e]/60">
            <div className="text-[10px] uppercase font-semibold text-[#869398]">Active Gateways</div>
            <div className="text-xl font-bold font-mono text-[#4cd6fb] mt-0.5">142 / 142</div>
            <div className="text-[10px] text-[#bcc9ce] font-mono">Mesh Latency 14ms</div>
          </div>
        </div>
      </div>

      {/* Primary Hardware Unit Spotlight (NODE-8812) */}
      <div className="rounded-xl bg-[#1c2028] p-4 shadow-sm flex flex-col gap-3 border border-[#31353e]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd6fb] text-[20px]">
              precision_manufacturing
            </span>
            <h2 className="text-sm text-[#dfe2ee] font-semibold">Primary Actuator Spotlight</h2>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-[#4edea3]/10 text-[#4edea3] font-mono font-medium">
            Nominal
          </span>
        </div>

        <div
          onClick={onNavigateToDevice}
          className="p-3.5 rounded-lg bg-[#262a33] hover:bg-[#31353e] transition-colors cursor-pointer border border-[#31353e]/80 flex flex-col gap-2.5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4cd6fb] animate-pulse"></span>
              <div>
                <div className="text-xs font-bold text-[#dfe2ee] font-mono">
                  NODE-8812 • AHU-07 Loop
                </div>
                <div className="text-[11px] text-[#bcc9ce]">
                  North Riser Refrigerant Compressor VFD
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#4cd6fb]">
              arrow_forward
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
            <div className="bg-[#0a0e16] p-2 rounded border border-[#31353e]/60">
              <div className="text-[10px] text-[#869398]">Disch. P</div>
              <div className="text-sm font-bold text-[#4cd6fb]">4.20 Bar</div>
            </div>
            <div className="bg-[#0a0e16] p-2 rounded border border-[#31353e]/60">
              <div className="text-[10px] text-[#869398]">Motor RPM</div>
              <div className="text-sm font-bold text-[#dfe2ee]">3,450</div>
            </div>
            <div className="bg-[#0a0e16] p-2 rounded border border-[#31353e]/60">
              <div className="text-[10px] text-[#869398]">Temp Out</div>
              <div className="text-sm font-bold text-[#ffb86b]">72.4°C</div>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Health & Network Architecture */}
      <div className="rounded-xl bg-[#1c2028] p-4 shadow-sm flex flex-col gap-3 border border-[#31353e]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd6fb] text-[20px]">hub</span>
            <h2 className="text-sm text-[#dfe2ee] font-semibold">Active Industrial Buses</h2>
          </div>
          <button
            type="button"
            onClick={onNavigateToSettings}
            className="text-xs text-[#4cd6fb] hover:underline cursor-pointer"
          >
            Configure
          </button>
        </div>

        <div className="space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between p-2.5 rounded bg-[#262a33] border border-[#31353e]/60">
            <span className="text-[#dfe2ee] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
              BACnet/SC Secure (UDP 47808)
            </span>
            <span className="text-[#4edea3]">100% Up</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded bg-[#262a33] border border-[#31353e]/60">
            <span className="text-[#dfe2ee] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
              Modbus RTU RS-485 (19200 Baud)
            </span>
            <span className="text-[#4edea3]">36 VAV OK</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded bg-[#262a33] border border-[#31353e]/60">
            <span className="text-[#dfe2ee] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4cd6fb]"></span>
              MQTT Sparkplug B (TLS 1.3)
            </span>
            <span className="text-[#4cd6fb]">QoS 1 Synced</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded bg-[#262a33] border border-[#31353e]/60">
            <span className="text-[#dfe2ee] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ffb86b]"></span>
              Zigbee 3.0 Mesh Coordinator
            </span>
            <span className="text-[#ffb86b]">74 Sensors</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Action Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onNavigateToDevice}
          className="p-3 rounded-xl bg-[#262a33] hover:bg-[#31353e] text-left border border-[#31353e] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#4cd6fb] text-[24px] mb-1">tune</span>
          <div className="text-xs font-semibold text-[#dfe2ee]">Remote Actuator</div>
          <div className="text-[11px] text-[#bcc9ce]">PID Setpoint &amp; VFD</div>
        </button>
        <button
          type="button"
          onClick={onNavigateToAlerts}
          className="p-3 rounded-xl bg-[#262a33] hover:bg-[#31353e] text-left border border-[#31353e] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#ffb86b] text-[24px] mb-1">
            warning
          </span>
          <div className="text-xs font-semibold text-[#dfe2ee]">System Alerts</div>
          <div className="text-[11px] text-[#bcc9ce]">2 Active Notices</div>
        </button>
      </div>
    </div>
  );
};

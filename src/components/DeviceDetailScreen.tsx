import React, { useState, useEffect } from 'react';
import { DriveControlMode } from '../types/facility';

interface DeviceDetailScreenProps {
  onBack: () => void;
  onOpenRegisters: () => void;
  onOpenDiagnostics: () => void;
}

export const DeviceDetailScreen: React.FC<DeviceDetailScreenProps> = ({
  onBack,
  onOpenRegisters,
  onOpenDiagnostics,
}) => {
  // Actuator slider value: 60% to 100%
  const [setpoint, setSetpoint] = useState<number>(82);
  const [driveMode, setDriveMode] = useState<DriveControlMode>('AUTO LOGIC');
  const [relayArmed, setRelayArmed] = useState<boolean>(true);
  const [activeChartTab, setActiveChartTab] = useState<'temp' | 'fft' | 'pf'>('temp');

  // Dynamic live metric simulation based on setpoint
  const [pressure, setPressure] = useState<number>(4.20);
  const [motorRpm, setMotorRpm] = useState<number>(3450);
  const [activeKw, setActiveKw] = useState<number>(18.6);
  const [tempOut, setTempOut] = useState<number>(72.4);
  const [inverterHz, setInverterHz] = useState<number>(58.2);

  // Self test action state
  const [isSelfTesting, setIsSelfTesting] = useState(false);
  const [selfTestMessage, setSelfTestMessage] = useState('Run Self-Test');

  useEffect(() => {
    // Calculate live telemetry when setpoint changes
    const ratio = setpoint / 100;
    const baseRpm = Math.round(ratio * 4200);
    const baseHz = parseFloat((ratio * 71.0).toFixed(1));
    const baseKw = parseFloat((ratio * 22.8).toFixed(1));
    const basePressure = parseFloat((3.7 + ratio * 0.6).toFixed(2));
    const baseTemp = parseFloat((65 + ratio * 9.2).toFixed(1));

    setMotorRpm(baseRpm);
    setInverterHz(baseHz);
    setActiveKw(baseKw);
    setPressure(basePressure);
    setTempOut(baseTemp);
  }, [setpoint]);

  const handleStepDown = () => {
    if (setpoint > 60) setSetpoint(prev => prev - 1);
  };

  const handleStepUp = () => {
    if (setpoint < 100) setSetpoint(prev => prev + 1);
  };

  const handleRunSelfTest = () => {
    if (isSelfTesting) return;
    setIsSelfTesting(true);
    setSelfTestMessage('Testing...');

    setTimeout(() => {
      setSelfTestMessage('All 24 Coils Passed');
      setTimeout(() => {
        setSelfTestMessage('Run Self-Test');
        setIsSelfTesting(false);
      }, 2500);
    }, 1200);
  };

  // Calculate circular SVG gauge progress based on pressure (0 to 6 Bar)
  // Max stroke dasharray ~ 320. 4.2 Bar is 70% of 6 Bar => dashoffset ~ 95
  const strokeOffset = Math.max(20, Math.min(300, 320 - (pressure / 6.0) * 225));
  // Needle circle position approx along arc
  const angleRad = ((pressure / 6.0) * 240 - 120) * (Math.PI / 180);
  const needleX = 100 + 78 * Math.cos(angleRad);
  const needleY = 100 + 78 * Math.sin(angleRad);

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto px-4 py-3 space-y-4 pb-24">
      {/* System Status Strip & Meta Badge */}
      <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-[#181c24] shadow-sm border border-[#31353e]/60">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full bg-[#00a572]/20 text-[#4edea3] text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
              Running Nominal • 480V 3Φ
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#262a33] text-[#bcc9ce] text-[11px] font-mono border border-[#31353e]">
              FW v4.2.1-SEC
            </span>
            <span className="flex items-center gap-1 text-[#bcc9ce] text-[11px] font-mono">
              <span className="material-symbols-outlined text-[14px] text-[#4cd6fb]">wifi</span>
              -54 dBm • 12ms
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-[#bcc9ce] text-xs pt-1 font-mono">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-[#4cd6fb]">hub</span>
            <span className="text-[11px] text-[#dfe2ee] font-semibold">NODE-8812</span>
            <span className="text-[#869398] text-[11px]">• BACnet/IP AHU-07 Loop</span>
          </div>
          <div className="text-[11px] text-[#869398]">UPTIME: 142d 18h</div>
        </div>
      </div>

      {/* Primary Pressure Telemetry Gauge Hero */}
      <div className="p-4 rounded-xl bg-[#1c2028] flex flex-col items-center relative overflow-hidden shadow-md border border-[#31353e]">
        <div className="w-full flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4cd6fb] shadow-[0_0_8px_rgba(76,214,251,0.8)]"></span>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#bcc9ce]">
              Primary Refrigerant Discharge
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#4cd6fb]/10 text-[#4cd6fb] text-[11px] font-mono font-medium border border-[#4cd6fb]/30">
            Envelope Safe
          </span>
        </div>

        {/* Gauge Ring Viz */}
        <div className="relative w-56 h-48 flex items-center justify-center mt-1">
          <svg className="w-56 h-48 overflow-visible" viewBox="0 0 200 160">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4edea3" />
                <stop offset="65%" stopColor="#4cd6fb" />
                <stop offset="85%" stopColor="#ffb86b" />
                <stop offset="100%" stopColor="#ffb4ab" />
              </linearGradient>
              <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#4cd6fb" floodOpacity="0.6" />
              </filter>
            </defs>

            {/* Gauge Track */}
            <path
              d="M 30 140 A 78 78 0 1 1 170 140"
              fill="none"
              stroke="#31353e"
              strokeWidth="12"
              strokeLinecap="round"
            />

            {/* Active Arc */}
            <path
              d="M 30 140 A 78 78 0 1 1 170 140"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="320"
              strokeDashoffset={strokeOffset}
              filter="url(#cyanGlow)"
              className="transition-all duration-300"
            />

            {/* Needle Pip Indicator */}
            <circle
              cx={needleX || 152}
              cy={needleY || 74}
              r="6"
              fill="#0f131c"
              stroke="#4cd6fb"
              strokeWidth="3"
              className="animate-pulse"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center top-6 pointer-events-none">
            <span className="text-[#dfe2ee] text-3xl font-bold tracking-tight font-mono">
              {pressure.toFixed(2)}
            </span>
            <span className="text-[#4cd6fb] text-[11px] font-semibold tracking-wider uppercase font-mono">
              Bar • Disch. P
            </span>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-[#4edea3] font-mono">
              <span className="material-symbols-outlined text-[13px]">arrow_upward</span>
              <span>+0.04 Bar/min</span>
            </div>
          </div>
        </div>

        {/* Range Indicator Scale */}
        <div className="w-full flex items-center justify-between text-[#bcc9ce] text-xs px-4 pt-1 font-mono">
          <div className="flex flex-col items-start">
            <span className="text-[#869398]">0.0 Bar</span>
            <span className="text-[10px] text-[#869398]">Low Cutoff</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#262a33]/80 text-[#4edea3] text-[11px] border border-[#31353e]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
            Target 4.10 - 4.45 Bar
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[#869398]">6.0 Bar</span>
            <span className="text-[10px] text-[#ffb4ab]">Trip Limit</span>
          </div>
        </div>
      </div>

      {/* Secondary Live Metrics Quad Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Metric 1: Temp Out */}
        <div className="p-3.5 rounded-xl bg-[#181c24] shadow-sm flex flex-col justify-between border border-[#31353e]/60">
          <div className="flex items-center justify-between">
            <span className="text-[#bcc9ce] text-[11px] uppercase font-semibold">Temp Out</span>
            <span className="material-symbols-outlined text-[#4cd6fb] text-[18px]">thermostat</span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1">
              <span className="text-[#dfe2ee] text-xl font-bold font-mono">{tempOut}</span>
              <span className="text-[#bcc9ce] text-xs">°C</span>
            </div>
            <span className="text-[#4edea3] text-[11px] font-mono">Normal (&lt;85.0°C)</span>
          </div>
          <div className="h-6 w-full flex items-end">
            <svg className="w-full h-5 overflow-visible" viewBox="0 0 100 24" preserveAspectRatio="none">
              <path
                d="M0,18 Q15,14 30,16 T60,10 T85,12 T100,8"
                fill="none"
                stroke="#4cd6fb"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Metric 2: Motor Speed */}
        <div className="p-3.5 rounded-xl bg-[#181c24] shadow-sm flex flex-col justify-between border border-[#31353e]/60">
          <div className="flex items-center justify-between">
            <span className="text-[#bcc9ce] text-[11px] uppercase font-semibold">Motor Speed</span>
            <span className="material-symbols-outlined text-[#4cd6fb] text-[18px]">speed</span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1">
              <span className="text-[#dfe2ee] text-xl font-bold font-mono">
                {motorRpm.toLocaleString()}
              </span>
              <span className="text-[#bcc9ce] text-xs">RPM</span>
            </div>
            <span className="text-[#bcc9ce] text-[11px] font-mono">{inverterHz} Hz Inverter</span>
          </div>
          <div className="w-full bg-[#31353e] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#4cd6fb] h-full rounded-full transition-all duration-300"
              style={{ width: `${setpoint}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 3: Active Load */}
        <div className="p-3.5 rounded-xl bg-[#181c24] shadow-sm flex flex-col justify-between border border-[#31353e]/60">
          <div className="flex items-center justify-between">
            <span className="text-[#bcc9ce] text-[11px] uppercase font-semibold">Active Load</span>
            <span className="material-symbols-outlined text-[#ffb86b] text-[18px]">bolt</span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1">
              <span className="text-[#dfe2ee] text-xl font-bold font-mono">{activeKw}</span>
              <span className="text-[#bcc9ce] text-xs">kW</span>
            </div>
            <span className="text-[#bcc9ce] text-[11px] font-mono">28.4 A • PF 0.94</span>
          </div>
          <div className="flex items-center justify-between text-[#869398] text-[11px] font-mono">
            <span>Cap: 25 kW</span>
            <span className="text-[#4edea3]">74%</span>
          </div>
        </div>

        {/* Metric 4: Vibration RMS */}
        <div className="p-3.5 rounded-xl bg-[#181c24] shadow-sm flex flex-col justify-between border border-[#31353e]/60">
          <div className="flex items-center justify-between">
            <span className="text-[#bcc9ce] text-[11px] uppercase font-semibold">Vib RMS</span>
            <span className="material-symbols-outlined text-[#4edea3] text-[18px]">vibration</span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1">
              <span className="text-[#dfe2ee] text-xl font-bold font-mono">0.14</span>
              <span className="text-[#bcc9ce] text-xs">mm/s</span>
            </div>
            <span className="text-[#4edea3] text-[11px] font-mono">ISO 10816 Cl. I</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#bcc9ce] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
            <span>Axial OK</span>
          </div>
        </div>
      </div>

      {/* Interactive Actuator Controls Section */}
      <div className="p-4 rounded-xl bg-[#1c2028] flex flex-col space-y-4 shadow-md border border-[#31353e]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd6fb] text-[20px]">tune</span>
            <span className="text-sm font-semibold text-[#dfe2ee]">Actuator Setpoint</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#262a33] text-[#4cd6fb] text-[11px] font-mono border border-[#31353e]">
            PID Loop Locked
          </span>
        </div>

        {/* Speed Setpoint Stepped Slider */}
        <div className="p-3 rounded-lg bg-[#262a33]/60 flex flex-col gap-2.5 border border-[#31353e]/60">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#bcc9ce]">Target Variable Frequency Output</span>
            <span className="text-base font-bold text-[#4cd6fb] font-mono">{setpoint}%</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleStepDown}
              className="w-10 h-10 rounded-lg bg-[#31353e] text-[#dfe2ee] hover:text-[#4cd6fb] active:scale-95 transition flex items-center justify-center shrink-0 cursor-pointer border border-[#869398]/20"
            >
              <span className="material-symbols-outlined text-[20px]">remove</span>
            </button>
            <div className="relative w-full flex items-center">
              <input
                type="range"
                min="60"
                max="100"
                step="1"
                value={setpoint}
                onChange={(e) => setSetpoint(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-[#0a0e16] rounded-lg appearance-none cursor-pointer accent-[#00b4d8]"
              />
            </div>
            <button
              type="button"
              onClick={handleStepUp}
              className="w-10 h-10 rounded-lg bg-[#31353e] text-[#dfe2ee] hover:text-[#4cd6fb] active:scale-95 transition flex items-center justify-center shrink-0 cursor-pointer border border-[#869398]/20"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
            </button>
          </div>

          <div className="flex justify-between text-[#869398] text-[11px] font-mono px-1">
            <span>60% Min Safe</span>
            <span>80% Design Point</span>
            <span>100% Max Boost</span>
          </div>
        </div>

        {/* Operational Mode Segmented Pills */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] uppercase tracking-wider text-[#bcc9ce] font-semibold">
            Drive Control Mode
          </label>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {(['AUTO LOGIC', 'MANUAL', 'STANDBY', 'CUTOFF'] as DriveControlMode[]).map((mode) => {
              const isActive = driveMode === mode;
              const isCutoff = mode === 'CUTOFF';
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setDriveMode(mode)}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer font-mono ${
                    isActive
                      ? isCutoff
                        ? 'bg-[#93000a] text-[#ffdad6] shadow-[0_0_10px_rgba(255,180,171,0.3)]'
                        : 'bg-[#4cd6fb] text-[#003642] shadow-[0_0_10px_rgba(76,214,251,0.3)] font-bold'
                      : isCutoff
                      ? 'bg-[#262a33] text-[#ffb4ab] hover:bg-[#93000a]/40 border border-[#31353e]'
                      : 'bg-[#262a33] text-[#dfe2ee] hover:text-[#4cd6fb] border border-[#31353e]'
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>
        </div>

        {/* Safety Relay Power Interlock Physical Style Toggle */}
        <div className="p-3 rounded-lg bg-[#181c24] flex items-center justify-between gap-3 border border-[#31353e]/60">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className={`material-symbols-outlined text-[18px] ${relayArmed ? 'text-[#4edea3]' : 'text-[#ffb4ab]'}`}>
                verified_user
              </span>
              <span className="text-xs font-semibold text-[#dfe2ee] truncate">
                Safety Relay Contactor
              </span>
            </div>
            <span
              className={`text-[11px] truncate font-mono ${
                relayArmed ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
              }`}
            >
              {relayArmed
                ? 'Main Line Contactor: ARMED & CLOSED'
                : 'Main Line Contactor: DISENGAGED (OPEN)'}
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={relayArmed}
              onChange={(e) => setRelayArmed(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-12 h-7 bg-[#31353e] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[3px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#00a572] shadow-inner"></div>
          </label>
        </div>
      </div>

      {/* Historical Telemetry Analysis (Last 12 Hours) */}
      <div className="p-4 rounded-xl bg-[#1c2028] flex flex-col space-y-3 shadow-md border border-[#31353e]">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#4cd6fb] text-[20px]">
              monitoring
            </span>
            <span className="text-sm font-semibold text-[#dfe2ee]">Thermal Drift Curve</span>
          </div>
          <span className="text-[#bcc9ce] text-xs font-mono">Window: 12h</span>
        </div>

        {/* Chart Metric Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#0a0e16] rounded-lg overflow-x-auto border border-[#31353e]/60">
          <button
            type="button"
            onClick={() => setActiveChartTab('temp')}
            className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeChartTab === 'temp'
                ? 'bg-[#262a33] text-[#4cd6fb] shadow-sm font-semibold'
                : 'text-[#bcc9ce] hover:text-[#dfe2ee]'
            }`}
          >
            Temp vs Limit
          </button>
          <button
            type="button"
            onClick={() => setActiveChartTab('fft')}
            className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeChartTab === 'fft'
                ? 'bg-[#262a33] text-[#4cd6fb] shadow-sm font-semibold'
                : 'text-[#bcc9ce] hover:text-[#dfe2ee]'
            }`}
          >
            Vibration FFT
          </button>
          <button
            type="button"
            onClick={() => setActiveChartTab('pf')}
            className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeChartTab === 'pf'
                ? 'bg-[#262a33] text-[#4cd6fb] shadow-sm font-semibold'
                : 'text-[#bcc9ce] hover:text-[#dfe2ee]'
            }`}
          >
            Power Factor
          </button>
        </div>

        {/* Detailed 12-Hour SVG Line Chart with Tooltip Indicator */}
        <div className="relative w-full h-44 pt-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 340 140" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4cd6fb" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#4cd6fb" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal grid guides */}
            <line x1="0" y1="20" x2="340" y2="20" stroke="#31353e" strokeDasharray="3,3" strokeWidth="1" />
            <line x1="0" y1="60" x2="340" y2="60" stroke="#31353e" strokeDasharray="3,3" strokeWidth="1" />
            <line x1="0" y1="100" x2="340" y2="100" stroke="#31353e" strokeDasharray="3,3" strokeWidth="1" />

            {/* Upper Safety Trip Limit (80°C threshold line) */}
            <line x1="0" y1="28" x2="340" y2="28" stroke="#ffb4ab" strokeDasharray="4,4" strokeWidth="1.5" />
            <text x="4" y="24" fill="#ffb4ab" className="text-[9px] font-mono">
              80.0°C High Alarm Cutoff
            </text>

            {/* Area Fill */}
            <polygon
              points="0,130 0,95 30,90 60,84 90,88 120,78 150,82 180,68 210,72 240,64 270,60 300,66 340,54 340,130"
              fill="url(#chartGradient)"
            />

            {/* Primary Telemetry Trend Path */}
            <path
              d="M 0 95 Q 30 88, 60 84 T 120 78 T 180 68 T 240 64 T 300 66 T 340 54"
              fill="none"
              stroke="#4cd6fb"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Live Cursor Point */}
            <circle cx="340" cy="54" r="5" fill="#0f131c" stroke="#4cd6fb" strokeWidth="2.5" />
            <circle cx="340" cy="54" r="8" fill="#4cd6fb" opacity="0.25" className="animate-ping" />
          </svg>

          {/* Real-time overlay pin marker */}
          <div className="absolute right-0 top-3 flex flex-col items-end pointer-events-none font-mono">
            <span className="px-2 py-0.5 rounded bg-[#31353e] text-[#4cd6fb] text-xs font-semibold shadow border border-[#4cd6fb]/30">
              Now: {tempOut}°C
            </span>
          </div>
        </div>

        {/* Time Axis Legend */}
        <div className="flex justify-between text-[#869398] text-[11px] font-mono pt-1">
          <span>-12h (04:00)</span>
          <span>-8h (08:00)</span>
          <span>-4h (12:00)</span>
          <span>Current (16:00)</span>
        </div>
      </div>

      {/* Hardware Diagnostic & Service Drawer */}
      <div className="p-4 rounded-xl bg-[#181c24] flex flex-col space-y-3 shadow-sm border border-[#31353e]/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#bcc9ce] text-[20px]">terminal</span>
            <span className="text-xs font-semibold text-[#dfe2ee]">Field Diagnostics &amp; Bus</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
        </div>

        {/* Diagnostic Details List */}
        <div className="p-3 rounded-lg bg-[#0a0e16] text-[#bcc9ce] text-xs space-y-1.5 font-mono border border-[#31353e]/60">
          <div className="flex items-center justify-between">
            <span>BACnet Polling Rate:</span>
            <span className="text-[#4edea3]">100ms [0 drops]</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Inverter Carrier Freq:</span>
            <span className="text-[#dfe2ee]">8.0 kHz PWM</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Last Sensor Calibration:</span>
            <span className="text-[#dfe2ee]">4d ago (Tech #409)</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Thermal Margin:</span>
            <span className="text-[#4cd6fb] font-semibold">+7.6°C safe headroom</span>
          </div>
        </div>

        {/* Hardware Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleRunSelfTest}
            disabled={isSelfTesting}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#262a33] text-[#dfe2ee] hover:text-[#4cd6fb] active:scale-[0.98] transition text-xs font-semibold cursor-pointer border border-[#31353e]"
          >
            <span className={`material-symbols-outlined text-[16px] text-[#4cd6fb] ${isSelfTesting ? 'animate-spin' : ''}`}>
              {isSelfTesting ? 'refresh' : 'play_circle'}
            </span>
            <span>{selfTestMessage}</span>
          </button>
          <button
            type="button"
            onClick={onOpenRegisters}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#262a33] text-[#dfe2ee] hover:text-[#4edea3] active:scale-[0.98] transition text-xs font-semibold cursor-pointer border border-[#31353e]"
          >
            <span className="material-symbols-outlined text-[16px] text-[#4edea3]">
              file_download
            </span>
            <span>Export Registers</span>
          </button>
        </div>
      </div>
    </div>
  );
};

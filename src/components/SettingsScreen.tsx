import React, { useState } from 'react';
import { SamplingRate, FacilityNode } from '../types/facility';

interface SettingsScreenProps {
  activeNode: FacilityNode;
  onOpenAuditLogs: () => void;
  onRevokeKeys: () => void;
  onDisconnectSession: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  activeNode,
  onOpenAuditLogs,
  onRevokeKeys,
  onDisconnectSession,
}) => {
  const [samplingRate, setSamplingRate] = useState<SamplingRate>('standard');
  const [bandwidth, setBandwidth] = useState('1.4 MB/min');
  const [sigma, setSigma] = useState(3.2);
  const [sessionTimeoutIdx, setSessionTimeoutIdx] = useState(1);
  const [failSafeMode, setFailSafeMode] = useState('last-state');

  // Interactive states
  const [isPinging, setIsPinging] = useState(false);
  const [pingLatency, setPingLatency] = useState('±0.8ms');
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationLabel, setCalibrationLabel] = useState('Calibrate Floor Sensors');
  const [calibrationSuccess, setCalibrationSuccess] = useState(false);

  // Relay self test state
  const [isTestingRelays, setIsTestingRelays] = useState(false);
  const [relayProgress, setRelayProgress] = useState(0);
  const [relayStatusText, setRelayStatusText] = useState('Ready');
  const [relayStepText, setRelayStepText] = useState('24/24 Solid-State Triacs Verified');

  // Firmware check state
  const [isCheckingPatches, setIsCheckingPatches] = useState(false);
  const [patchButtonText, setPatchButtonText] = useState('Check for Security Patches');
  const [patchSuccess, setPatchSuccess] = useState(false);

  const timeoutLabels = ['15 Minutes', '30 Minutes', '1 Hour', '8 Hours (Shift)'];

  const handleSamplingChange = (rate: SamplingRate, bw: string) => {
    setSamplingRate(rate);
    setBandwidth(bw);
  };

  const handlePing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      const newLat = (0.6 + Math.random() * 0.4).toFixed(1);
      setPingLatency(`±${newLat}ms`);
    }, 450);
  };

  const handleCalibrate = () => {
    if (isCalibrating) return;
    setIsCalibrating(true);
    setCalibrationSuccess(false);
    setCalibrationLabel('Zero-Referencing Pressure Transducers...');

    setTimeout(() => {
      setCalibrationLabel('Calibrating Thermistor Bridges (Floor 1–44)...');
      setTimeout(() => {
        setCalibrationLabel('Calibration Locked (Zero Offset ±0.00%)');
        setCalibrationSuccess(true);
        setTimeout(() => {
          setCalibrationLabel('Calibrate Floor Sensors');
          setCalibrationSuccess(false);
          setIsCalibrating(false);
        }, 3200);
      }, 1200);
    }, 1000);
  };

  const handleRunRelayTest = () => {
    if (isTestingRelays) return;
    setIsTestingRelays(true);
    setRelayStatusText('Testing...');
    setRelayProgress(0);

    let progress = 0;
    const timer = setInterval(() => {
      progress += 25;
      setRelayProgress(progress);

      if (progress === 50) {
        setRelayStepText('12/24 Coil Continuity Passed');
      } else if (progress === 100) {
        clearInterval(timer);
        setRelayStatusText('All Relays Nominal');
        setRelayStepText('24/24 Relays Checked • 0 Resistive Faults');
        setTimeout(() => {
          setIsTestingRelays(false);
        }, 1500);
      }
    }, 380);
  };

  const handlePatchCheck = () => {
    if (isCheckingPatches) return;
    setIsCheckingPatches(true);
    setPatchSuccess(false);
    setPatchButtonText('Querying Apex Cryptographic OTA Vault...');

    setTimeout(() => {
      setPatchButtonText('All Security Hashes Signed & Verified (v4.18.2)');
      setPatchSuccess(true);
      setTimeout(() => {
        setPatchButtonText('Check for Security Patches');
        setPatchSuccess(false);
        setIsCheckingPatches(false);
      }, 3000);
    }, 1400);
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto px-4 space-y-4 pt-2 pb-24">
      {/* Gateway Hub Header Card */}
      <div className="relative overflow-hidden rounded-xl bg-[#262a33] p-4 shadow-md border border-[#31353e]">
        <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-[#4cd6fb]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="material-symbols-outlined text-[#4cd6fb] text-[18px] shrink-0">
              router
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#bcc9ce] truncate">
              Gateway Hub #09
            </span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00a572]/20 text-[#4edea3] text-[11px] font-semibold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
            Online
          </span>
        </div>

        <div className="flex flex-col gap-1 mb-3">
          <div className="text-sm text-[#dfe2ee] font-semibold tracking-tight">
            System Bus &amp; Mesh Synced
          </div>
          <p className="text-xs text-[#bcc9ce]">
            Real-time edge telemetry bridge for Zone 1–8 mechanical plenums.
          </p>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0a0e16] border border-[#31353e]/60">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#4edea3]/10 flex items-center justify-center text-[#4edea3]">
              <span className={`material-symbols-outlined text-[16px] ${isPinging ? 'animate-spin' : ''}`}>
                sync
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold text-[#dfe2ee]">
                {activeNode.gatewaysActive} of {activeNode.totalGateways} Nodes Synced
              </div>
              <div className="text-[11px] text-[#bcc9ce]">
                Mesh Latency {pingLatency} • 0 Drift
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handlePing}
            disabled={isPinging}
            className="px-2.5 py-1 rounded bg-[#262a33] text-[#4cd6fb] hover:text-[#b3ebff] text-xs font-semibold transition-all active:scale-95 flex items-center gap-1 cursor-pointer border border-[#31353e]"
          >
            <span className={`material-symbols-outlined text-[14px] ${isPinging ? 'rotate-180 transition-transform duration-300' : ''}`}>
              refresh
            </span>
            <span>Ping</span>
          </button>
        </div>
      </div>

      {/* Gateway Protocol Stack */}
      <div className="rounded-xl bg-[#1c2028] p-4 shadow-sm flex flex-col gap-3 border border-[#31353e]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd6fb] text-[20px]">hub</span>
            <h2 className="text-sm text-[#dfe2ee] font-semibold">Gateway Protocol Stack</h2>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-[#31353e] text-[#bcc9ce] font-mono">
            4 Active Bus
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {/* Protocol 1: BACnet/SC */}
          <div className="p-3 rounded-lg bg-[#262a33] flex flex-col gap-2 border border-[#31353e]/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
                <span className="text-xs text-[#dfe2ee] font-semibold">BACnet/SC</span>
              </div>
              <span className="text-[11px] text-[#4edea3] bg-[#00a572]/20 px-2 py-0.5 rounded-full font-mono">
                Encrypted • TLS
              </span>
            </div>
            <div className="flex items-center justify-between text-[#bcc9ce] text-xs font-mono">
              <span>Port 47808 (UDP/IP Secure)</span>
              <span className="text-[#dfe2ee]">Device ID #80901</span>
            </div>
          </div>

          {/* Protocol 2: Modbus RTU / TCP */}
          <div className="p-3 rounded-lg bg-[#262a33] flex flex-col gap-2 border border-[#31353e]/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
                <span className="text-xs text-[#dfe2ee] font-semibold">
                  Modbus RTU / TCP Gateway
                </span>
              </div>
              <span className="text-[11px] text-[#bcc9ce] bg-[#31353e] px-2 py-0.5 rounded font-mono">
                RS-485 Opto
              </span>
            </div>
            <div className="flex items-center justify-between text-[#bcc9ce] text-xs font-mono">
              <span>Baud 19200 • 8-N-1 Parity</span>
              <span className="text-[#dfe2ee]">36 VAV Controllers</span>
            </div>
          </div>

          {/* Protocol 3: MQTT Sparkplug B */}
          <div className="p-3 rounded-lg bg-[#262a33] flex flex-col gap-2 border border-[#31353e]/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4cd6fb]"></span>
                <span className="text-xs text-[#dfe2ee] font-semibold">
                  MQTT Sparkplug B Broker
                </span>
              </div>
              <span className="text-[11px] text-[#4cd6fb] bg-[#4cd6fb]/10 px-2 py-0.5 rounded-full font-mono">
                v3.1.1 • TLS 1.3
              </span>
            </div>
            <div className="flex items-center justify-between text-[#bcc9ce] text-xs font-mono">
              <span className="truncate max-w-[210px]">mqtt.apexiot.internal:8883</span>
              <span className="text-[#dfe2ee]">QoS 1</span>
            </div>
          </div>

          {/* Protocol 4: Zigbee 3.0 Mesh */}
          <div className="p-3 rounded-lg bg-[#262a33] flex flex-col gap-2 border border-[#31353e]/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ffb86b]"></span>
                <span className="text-xs text-[#dfe2ee] font-semibold">
                  Zigbee 3.0 Mesh Coordinator
                </span>
              </div>
              <span className="text-[11px] text-[#ffb86b] bg-[#ec9000]/20 px-2 py-0.5 rounded-full font-mono">
                Ch 15 (2.4GHz)
              </span>
            </div>
            <div className="flex items-center justify-between text-[#bcc9ce] text-xs font-mono">
              <span>TX Power +20dBm</span>
              <span className="text-[#dfe2ee]">74 Wireless Sensors</span>
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry Polling & Edge Filter */}
      <div className="rounded-xl bg-[#1c2028] p-4 shadow-sm flex flex-col gap-4 border border-[#31353e]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd6fb] text-[20px]">speed</span>
            <h2 className="text-sm text-[#dfe2ee] font-semibold">
              Telemetry Polling &amp; Edge Filter
            </h2>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#bcc9ce] font-mono">
            <span className="material-symbols-outlined text-[15px] text-[#4cd6fb]">data_usage</span>
            <span>{bandwidth}</span>
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-[#bcc9ce] uppercase font-semibold mb-2">
            Sampling Frequency
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-[#0a0e16] border border-[#31353e]/60">
            <button
              type="button"
              onClick={() => handleSamplingChange('ultra', '4.8 MB/min')}
              className={`py-2 px-2 rounded-md text-xs transition-all text-center cursor-pointer ${
                samplingRate === 'ultra'
                  ? 'bg-[#4cd6fb] text-[#003642] font-bold shadow-sm'
                  : 'text-[#bcc9ce] hover:text-[#dfe2ee]'
              }`}
            >
              Ultra{' '}
              <span className="block text-[10px] opacity-80 font-normal font-mono">100ms</span>
            </button>
            <button
              type="button"
              onClick={() => handleSamplingChange('standard', '1.4 MB/min')}
              className={`py-2 px-2 rounded-md text-xs transition-all text-center cursor-pointer ${
                samplingRate === 'standard'
                  ? 'bg-[#4cd6fb] text-[#003642] font-bold shadow-sm'
                  : 'text-[#bcc9ce] hover:text-[#dfe2ee]'
              }`}
            >
              Standard{' '}
              <span className="block text-[10px] opacity-90 font-normal font-mono">1.0s</span>
            </button>
            <button
              type="button"
              onClick={() => handleSamplingChange('eco', '0.3 MB/min')}
              className={`py-2 px-2 rounded-md text-xs transition-all text-center cursor-pointer ${
                samplingRate === 'eco'
                  ? 'bg-[#4cd6fb] text-[#003642] font-bold shadow-sm'
                  : 'text-[#bcc9ce] hover:text-[#dfe2ee]'
              }`}
            >
              Eco{' '}
              <span className="block text-[10px] opacity-80 font-normal font-mono">5.0s</span>
            </button>
          </div>
        </div>

        {/* Adaptive Z-Score Filtering */}
        <div className="p-3 rounded-lg bg-[#262a33] flex flex-col gap-2.5 border border-[#31353e]/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#ffb86b]">analytics</span>
              <span className="text-xs text-[#dfe2ee] font-semibold">
                Adaptive Z-Score Filtering
              </span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-[#31353e] text-[#4cd6fb] font-mono font-bold">
              {sigma.toFixed(1)}σ
            </span>
          </div>
          <p className="text-xs text-[#bcc9ce]">
            Spike rejection threshold for static air dampers &amp; chilled water valves.
          </p>
          <div className="pt-1">
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.1"
              value={sigma}
              onChange={(e) => setSigma(parseFloat(e.target.value))}
              className="w-full accent-[#4cd6fb] h-1.5 rounded-lg bg-[#0a0e16] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#bcc9ce] mt-1.5 font-mono">
              <span>Aggressive (1.0σ)</span>
              <span>Permissive (5.0σ)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calibration & Diagnostics */}
      <div className="rounded-xl bg-[#1c2028] p-4 shadow-sm flex flex-col gap-4 border border-[#31353e]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#4cd6fb] text-[20px]">
            build_circle
          </span>
          <h2 className="text-sm text-[#dfe2ee] font-semibold">Calibration &amp; Diagnostics</h2>
        </div>

        {/* Item 1: Floor Sensor Drift */}
        <div className="p-3.5 rounded-lg bg-[#262a33] flex flex-col gap-3 border border-[#31353e]/60">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-xs text-[#dfe2ee] font-medium">
                Floor Sensor Zero-Point Drift Offset
              </div>
              <div className="text-[11px] text-[#bcc9ce] mt-0.5">
                Auto-correct pressure transducers and calibrated thermistors.
              </div>
            </div>
            <span className="material-symbols-outlined text-[20px] text-[#4edea3] shrink-0">
              check_circle
            </span>
          </div>
          <div className="flex items-center justify-between text-[#bcc9ce] text-xs pt-1 font-mono">
            <span>Last completed: 4d ago</span>
            <span className="text-[#dfe2ee]">Δ &lt; 0.04%</span>
          </div>
          <button
            type="button"
            onClick={handleCalibrate}
            disabled={isCalibrating}
            className={`w-full py-2.5 px-3 rounded-lg bg-[#31353e] hover:bg-[#353942] font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-xs cursor-pointer border border-[#869398]/20 ${
              calibrationSuccess ? 'text-[#4edea3]' : 'text-[#dfe2ee] hover:text-[#4cd6fb]'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${isCalibrating ? 'animate-spin' : ''}`}>
              straighten
            </span>
            <span>{calibrationLabel}</span>
          </button>
        </div>

        {/* Item 2: Hardware Relay Self-Test */}
        <div className="p-3.5 rounded-lg bg-[#262a33] flex flex-col gap-2.5 border border-[#31353e]/60">
          <div className="flex items-center justify-between">
            <div className="text-xs text-[#dfe2ee] font-medium">Hardware Relay Self-Test</div>
            <span
              className={`text-xs font-mono font-medium ${
                relayStatusText === 'All Relays Nominal'
                  ? 'text-[#4edea3]'
                  : relayStatusText === 'Testing...'
                  ? 'text-[#4cd6fb]'
                  : 'text-[#bcc9ce]'
              }`}
            >
              {relayStatusText}
            </span>
          </div>
          <div className="w-full bg-[#0a0e16] h-2 rounded-full overflow-hidden border border-[#31353e]/50">
            <div
              className="h-full bg-[#4cd6fb] transition-all duration-300"
              style={{ width: `${relayProgress}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[#bcc9ce] font-mono">{relayStepText}</span>
            <button
              type="button"
              onClick={handleRunRelayTest}
              disabled={isTestingRelays}
              className="px-3 py-1.5 rounded bg-[#4cd6fb] text-[#003642] text-xs font-bold active:scale-95 transition-transform flex items-center gap-1 cursor-pointer disabled:opacity-75"
            >
              <span className="material-symbols-outlined text-[15px]">play_arrow</span>
              Run Test
            </button>
          </div>
        </div>

        {/* Item 3: Autonomous Offline Fail-Safe */}
        <div className="p-3.5 rounded-lg bg-[#262a33] flex flex-col gap-2 border border-[#31353e]/60">
          <label htmlFor="failsafeSelect" className="text-xs text-[#dfe2ee] font-medium">
            Autonomous Offline Fail-Safe
          </label>
          <p className="text-xs text-[#bcc9ce]">
            Behavior applied immediately if WAN link drops for &gt;45s.
          </p>
          <div className="relative mt-1">
            <select
              id="failsafeSelect"
              value={failSafeMode}
              onChange={(e) => setFailSafeMode(e.target.value)}
              className="w-full appearance-none bg-[#0a0e16] text-[#dfe2ee] text-xs py-2.5 px-3 pr-9 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4cd6fb] border border-[#31353e]/70 cursor-pointer font-mono"
            >
              <option value="last-state">Maintain Last Known Good State</option>
              <option value="eco-100">Default to 100% Eco Safety Profile</option>
              <option value="interlock">Hard Hardware Interlock (Dampers 0%)</option>
            </select>
            <span className="material-symbols-outlined text-[20px] text-[#bcc9ce] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Cluster Firmware & OTA */}
      <div className="rounded-xl bg-[#1c2028] p-4 shadow-sm flex flex-col gap-3 border border-[#31353e]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd6fb] text-[20px]">
              system_update
            </span>
            <h2 className="text-sm text-[#dfe2ee] font-semibold">Cluster Firmware &amp; OTA</h2>
          </div>
          <span className="material-symbols-outlined text-[#4edea3] text-[20px]">verified</span>
        </div>

        <div className="p-3 rounded-lg bg-[#262a33] flex flex-col gap-2 border border-[#31353e]/60">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#dfe2ee] font-semibold">
              Gateway Hub Controller
            </span>
            <span className="text-[11px] text-[#dfe2ee] bg-[#31353e] px-2 py-0.5 rounded font-mono">
              {activeNode.firmware}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-[#bcc9ce]">
            <span>Security baseline signature</span>
            <span className="text-[#4edea3] flex items-center gap-1 font-mono text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span> Validated
            </span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#262a33] flex flex-col gap-2 border border-[#31353e]/60">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#dfe2ee] font-semibold">
              Downstream Node Firmware
            </span>
            <span className="text-[11px] text-[#ffb86b] font-mono">4 Pending Window</span>
          </div>
          <div className="w-full bg-[#0a0e16] h-2 rounded-full overflow-hidden border border-[#31353e]/50">
            <div className="h-full bg-[#4edea3] rounded-full" style={{ width: '97.1%' }}></div>
          </div>
          <div className="flex items-center justify-between text-xs text-[#bcc9ce] font-mono">
            <span>138 / 142 Nodes on v4.18.2</span>
            <span className="text-[11px]">OTA Queue: 02:00 UTC</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePatchCheck}
          disabled={isCheckingPatches}
          className={`w-full py-2.5 px-3 rounded-lg bg-[#31353e] hover:bg-[#353942] text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer border border-[#869398]/20 ${
            patchSuccess ? 'text-[#4edea3]' : 'text-[#dfe2ee] hover:text-[#4cd6fb]'
          }`}
        >
          <span className={`material-symbols-outlined text-[18px] ${isCheckingPatches ? 'animate-spin' : ''}`}>
            security_update_good
          </span>
          <span>{patchButtonText}</span>
        </button>
      </div>

      {/* Session & Security Clearance */}
      <div className="rounded-xl bg-[#1c2028] p-4 shadow-sm flex flex-col gap-4 border border-[#31353e]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd6fb] text-[20px]">
              admin_panel_settings
            </span>
            <h2 className="text-sm text-[#dfe2ee] font-semibold">
              Session &amp; Security Clearance
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#4cd6fb]/10 text-[#4cd6fb] text-xs font-bold font-mono">
            Tier 3 Root
          </span>
        </div>

        <div className="p-3 rounded-lg bg-[#262a33] flex items-center gap-3 border border-[#31353e]/60">
          <div className="w-10 h-10 rounded-full bg-[#0a0e16] flex items-center justify-center text-[#4cd6fb] shrink-0 border border-[#31353e]">
            <span className="material-symbols-outlined text-[20px]">engineering</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-[#dfe2ee] font-semibold truncate">Alex Mercer</div>
            <div className="text-[11px] text-[#bcc9ce] truncate">
              Lead Field Engineer • Smart Infra
            </div>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-[11px] text-[#4edea3] font-mono font-semibold">2FA Active</span>
            <span className="text-[11px] text-[#bcc9ce] font-mono">ID: #9942</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#262a33] flex flex-col gap-2.5 border border-[#31353e]/60">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#dfe2ee] font-medium">Hardware Session Timeout</span>
            <span className="text-xs text-[#4cd6fb] font-mono font-bold">
              {timeoutLabels[sessionTimeoutIdx]}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="3"
            step="1"
            value={sessionTimeoutIdx}
            onChange={(e) => setSessionTimeoutIdx(parseInt(e.target.value, 10))}
            className="w-full accent-[#4cd6fb] h-1.5 rounded-lg bg-[#0a0e16] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[#bcc9ce] font-mono">
            <span>15m</span>
            <span>30m</span>
            <span>1h</span>
            <span>8h (Shift)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onOpenAuditLogs}
            className="py-2.5 px-3 rounded-lg bg-[#262a33] hover:bg-[#31353e] text-[#dfe2ee] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors active:scale-95 cursor-pointer border border-[#31353e]"
          >
            <span className="material-symbols-outlined text-[17px] text-[#4cd6fb]">download</span>
            <span>Audit Logs</span>
          </button>
          <button
            type="button"
            onClick={onRevokeKeys}
            className="py-2.5 px-3 rounded-lg bg-[#262a33] hover:bg-[#93000a]/40 text-[#dfe2ee] hover:text-[#ffb4ab] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors active:scale-95 cursor-pointer border border-[#31353e]"
          >
            <span className="material-symbols-outlined text-[17px]">lock_reset</span>
            <span>Revoke Keys</span>
          </button>
        </div>

        {/* Disconnect/Switch Node button */}
        <button
          type="button"
          onClick={onDisconnectSession}
          className="w-full py-2.5 px-3 rounded-lg bg-[#0a0e16] hover:bg-[#181c24] text-[#bcc9ce] hover:text-[#4cd6fb] text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#31353e]/60"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span>Disconnect Hardware Session (Return to Login Screen)</span>
        </button>
      </div>

      {/* Industrial Kernel OS Footer Stamp */}
      <div className="flex items-center justify-center gap-2 py-3 text-[#bcc9ce] text-[11px] opacity-80 font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
        <span>Apex Hardware OS • Kernel v6.1-rt-industrial</span>
      </div>
    </div>
  );
};

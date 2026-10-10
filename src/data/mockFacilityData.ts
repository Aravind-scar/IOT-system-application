import { FacilityNode, SystemAlert, ZoneData } from '../types/facility';

export const FACILITY_NODES: FacilityNode[] = [
  {
    id: 'apex-north',
    name: 'Apex Tower — North',
    cluster: 'Cluster #09-Prod',
    region: 'Region US-East',
    status: 'synced',
    gatewaysActive: 142,
    totalGateways: 142,
    latencyMs: 14,
    firmware: 'v4.18.2-rt'
  },
  {
    id: 'apex-south',
    name: 'Apex Tower — South Wing',
    cluster: 'Cluster #12-Prod',
    region: 'Region US-East',
    status: 'synced',
    gatewaysActive: 128,
    totalGateways: 128,
    latencyMs: 16,
    firmware: 'v4.18.2-rt'
  },
  {
    id: 'dc-west',
    name: 'Mission Data Center 04',
    cluster: 'Cluster #02-Ultra',
    region: 'Region US-West',
    status: 'synced',
    gatewaysActive: 310,
    totalGateways: 310,
    latencyMs: 8,
    firmware: 'v4.19.0-rc2'
  },
  {
    id: 'thermal-hub',
    name: 'Chilled Water Central Plant',
    cluster: 'Cluster #04-Industrial',
    region: 'Region US-Central',
    status: 'synced',
    gatewaysActive: 88,
    totalGateways: 88,
    latencyMs: 11,
    firmware: 'v4.18.0'
  }
];

export const MOCK_ALERTS: SystemAlert[] = [
  {
    id: 'alt-1',
    level: 'warning',
    title: 'Static Plenum Pressure Variance',
    source: 'AHU-07 Loop • Node-8812',
    timestamp: '12m ago',
    acknowledged: false,
    value: 'Δ +42 Pa over setpoint'
  },
  {
    id: 'alt-2',
    level: 'critical',
    title: 'RS-485 Opto Parity CRC Mismatch',
    source: 'Modbus Bus #2 • VAV-18',
    timestamp: '34m ago',
    acknowledged: false,
    value: '4 packet drops in 60s'
  },
  {
    id: 'alt-3',
    level: 'info',
    title: 'Automated Z-Score Spike Suppressed',
    source: 'Chilled Water Actuator CHW-03',
    timestamp: '1h 14m ago',
    acknowledged: true,
    value: '3.4σ spike filtered'
  },
  {
    id: 'alt-4',
    level: 'info',
    title: 'Firmware Baseline Cryptographic Attestation',
    source: 'Apex Gateway Hub #09',
    timestamp: '3h ago',
    acknowledged: true,
    value: 'ECDSA SHA-256 Validated'
  }
];

export const MOCK_ZONES: ZoneData[] = [
  {
    id: 'z-1',
    name: 'Zone 1: Executive Suites & Boardroom',
    floor: 'Floor 42–44',
    temp: 21.4,
    setpoint: 21.5,
    humidity: 44,
    vavControllers: 18,
    pressurePa: 125,
    status: 'nominal',
    primaryNodeId: 'NODE-8812'
  },
  {
    id: 'z-2',
    name: 'Zone 2: Core Engineering & Lab Plenums',
    floor: 'Floor 38–41',
    temp: 20.8,
    setpoint: 21.0,
    humidity: 42,
    vavControllers: 24,
    pressurePa: 140,
    status: 'nominal',
    primaryNodeId: 'NODE-8812'
  },
  {
    id: 'z-3',
    name: 'Zone 3: Central Atrium & Mechanical Core',
    floor: 'Floor 20–37',
    temp: 22.1,
    setpoint: 22.0,
    humidity: 48,
    vavControllers: 32,
    pressurePa: 110,
    status: 'optimizing',
    primaryNodeId: 'NODE-8812'
  },
  {
    id: 'z-4',
    name: 'Zone 4: Server Room & Micro Data Rack',
    floor: 'Sub-Level 2',
    temp: 19.2,
    setpoint: 19.0,
    humidity: 38,
    vavControllers: 12,
    pressurePa: 165,
    status: 'nominal',
    primaryNodeId: 'NODE-8812'
  },
  {
    id: 'z-5',
    name: 'Zone 5: North Riser Air Handling Unit (AHU-07)',
    floor: 'Roof Mechanical Penthouse',
    temp: 23.4,
    setpoint: 22.5,
    humidity: 46,
    vavControllers: 16,
    pressurePa: 185,
    status: 'review',
    primaryNodeId: 'NODE-8812'
  },
  {
    id: 'z-6',
    name: 'Zone 6: Lower Concourse & Retail Galleria',
    floor: 'Level 1–3',
    temp: 22.8,
    setpoint: 22.5,
    humidity: 50,
    vavControllers: 20,
    pressurePa: 105,
    status: 'nominal',
    primaryNodeId: 'NODE-8812'
  },
  {
    id: 'z-7',
    name: 'Zone 7: South Perimeter Variable Volume',
    floor: 'Floor 4–19',
    temp: 21.9,
    setpoint: 22.0,
    humidity: 45,
    vavControllers: 28,
    pressurePa: 130,
    status: 'nominal',
    primaryNodeId: 'NODE-8812'
  },
  {
    id: 'z-8',
    name: 'Zone 8: Chilled Plant Inverter Header',
    floor: 'Sub-Level 3',
    temp: 18.5,
    setpoint: 18.5,
    humidity: 40,
    vavControllers: 10,
    pressurePa: 210,
    status: 'nominal',
    primaryNodeId: 'NODE-8812'
  }
];

export const MOCK_AUDIT_LOGS = [
  { id: 'LOG-9942-01', timestamp: '2026-10-09 22:45:10 UTC', operator: 'Alex Mercer (#9942)', action: 'VFD Setpoint Adjusted to 82%', status: 'Committed' },
  { id: 'LOG-9942-02', timestamp: '2026-10-09 21:12:04 UTC', operator: 'Alex Mercer (#9942)', action: 'Hardware Relay Self-Test (24 Triacs)', status: 'Success' },
  { id: 'LOG-8810-09', timestamp: '2026-10-09 18:30:19 UTC', operator: 'System Daemon (Root)', action: 'BACnet/SC Token Rotation Loop', status: 'Verified' },
  { id: 'LOG-7721-14', timestamp: '2026-10-09 14:02:55 UTC', operator: 'Sarah Jenkins (#7721)', action: 'Z-Score Filter Calibrated to 3.2σ', status: 'Applied' },
  { id: 'LOG-8810-08', timestamp: '2026-10-09 09:15:00 UTC', operator: 'OTA Coordinator', action: 'Firmware Staging Window Queued', status: 'Pending' },
  { id: 'LOG-9942-00', timestamp: '2026-10-09 08:00:22 UTC', operator: 'Alex Mercer (#9942)', action: 'WebAuthn Hardware Credential Handshake', status: 'Authenticated' }
];

export const MOCK_REGISTERS = [
  { address: '0x3001', name: 'DISCHARGE_PRESSURE_BAR', value: '4.20', type: 'Float32 (IEEE 754)', access: 'R' },
  { address: '0x3003', name: 'MOTOR_OUTPUT_FREQ_HZ', value: '58.20', type: 'Float32', access: 'R/W' },
  { address: '0x3005', name: 'ACTIVE_LOAD_KW', value: '18.64', type: 'Float32', access: 'R' },
  { address: '0x3007', name: 'THERMAL_DISCHARGE_CELSIUS', value: '72.40', type: 'Float32', access: 'R' },
  { address: '0x3009', name: 'VIBRATION_RMS_AXIAL', value: '0.142', type: 'Float32', access: 'R' },
  { address: '0x4001', name: 'SAFETY_RELAY_CONTACTOR_STATE', value: '0x0001 (ARMED)', type: 'UInt16', access: 'R/W' },
  { address: '0x4002', name: 'DRIVE_MODE_STATUS', value: '0x0001 (AUTO)', type: 'UInt16', access: 'R/W' },
  { address: '0x4003', name: 'FAILSAFE_BEHAVIOR_CODE', value: '0x0000 (MAINTAIN)', type: 'UInt16', access: 'R/W' },
  { address: '0x4010', name: 'SAMPLING_RATE_INTERVAL_MS', value: '1000', type: 'UInt32', access: 'R/W' }
];

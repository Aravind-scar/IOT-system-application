export type NavigationTab = 'dashboard' | 'zones' | 'hvac' | 'alerts' | 'settings';

export type SamplingRate = 'ultra' | 'standard' | 'eco';

export type DriveControlMode = 'AUTO LOGIC' | 'MANUAL' | 'STANDBY' | 'CUTOFF';

export interface TelemetryMetric {
  value: number;
  unit: string;
  label: string;
  subtext?: string;
  statusText?: string;
  statusType?: 'nominal' | 'warning' | 'alert';
}

export interface FacilityNode {
  id: string;
  name: string;
  cluster: string;
  region: string;
  status: 'synced' | 'connecting' | 'offline';
  gatewaysActive: number;
  totalGateways: number;
  latencyMs: number;
  firmware: string;
}

export interface SystemAlert {
  id: string;
  level: 'info' | 'warning' | 'critical';
  title: string;
  source: string;
  timestamp: string;
  acknowledged: boolean;
  value?: string;
}

export interface ZoneData {
  id: string;
  name: string;
  floor: string;
  temp: number;
  setpoint: number;
  humidity: number;
  vavControllers: number;
  pressurePa: number;
  status: 'nominal' | 'optimizing' | 'review';
  primaryNodeId: string;
}

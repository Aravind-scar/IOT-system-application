/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavigationTab, FacilityNode, SystemAlert } from './types/facility';
import { FACILITY_NODES, MOCK_ALERTS } from './data/mockFacilityData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { AuthScreen } from './components/AuthScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { DeviceDetailScreen } from './components/DeviceDetailScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { ZonesScreen } from './components/ZonesScreen';
import { AlertsScreen } from './components/AlertsScreen';
import {
  NodeSwitcherModal,
  ProfileModal,
  AuditLogsModal,
  RegistersModal,
  OfflineDiagnosticsModal,
} from './components/Modals';

export default function App() {
  // Session Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  // Navigation tab: 'dashboard' | 'zones' | 'hvac' | 'alerts' | 'settings'
  const [currentTab, setCurrentTab] = useState<NavigationTab>('settings');
  // History tracking for back button in HVAC screen
  const [previousTab, setPreviousTab] = useState<NavigationTab>('dashboard');

  // Active facility node
  const [activeNode, setActiveNode] = useState<FacilityNode>(FACILITY_NODES[0]);

  // System alerts state
  const [alerts, setAlerts] = useState<SystemAlert[]>(MOCK_ALERTS);

  // Modal states
  const [isNodeSwitcherOpen, setIsNodeSwitcherOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuditLogsOpen, setIsAuditLogsOpen] = useState(false);
  const [isRegistersOpen, setIsRegistersOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);

  const handleTabChange = (tab: NavigationTab) => {
    if (currentTab !== 'hvac') {
      setPreviousTab(currentTab);
    }
    setCurrentTab(tab);
  };

  const handleBack = () => {
    setCurrentTab(previousTab || 'settings');
  };

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const handleClearAllAlerts = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })));
  };

  const handleRevokeKeys = () => {
    if (confirm('Revoke all hardware cryptographic session keys for Alex Mercer (#9942)?')) {
      alert('Keys revoked. Redirecting to Hardware Authentication Gateway.');
      setIsAuthenticated(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f131c] text-[#dfe2ee] font-sans flex flex-col selection:bg-[#4cd6fb] selection:text-[#003642] relative">
      {/* Quick Screen Switcher Bar for Easy Review of all 3 prompt screens */}
      <div className="bg-[#0a0e16] border-b border-[#31353e]/80 py-1.5 px-3 flex items-center justify-between text-xs z-50">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4cd6fb] animate-pulse"></span>
          <span className="text-[11px] font-mono text-[#869398] uppercase tracking-wider hidden sm:inline">
            Screen Quick View:
          </span>
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => {
                setIsAuthenticated(true);
                setCurrentTab('settings');
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                isAuthenticated && currentTab === 'settings'
                  ? 'bg-[#4cd6fb] text-[#003642] font-bold'
                  : 'text-[#bcc9ce] hover:text-[#dfe2ee] bg-[#181c24]'
              }`}
            >
              1: Settings &amp; Calib
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAuthenticated(false);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                !isAuthenticated
                  ? 'bg-[#4cd6fb] text-[#003642] font-bold'
                  : 'text-[#bcc9ce] hover:text-[#dfe2ee] bg-[#181c24]'
              }`}
            >
              2: Connect / Login
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAuthenticated(true);
                setCurrentTab('hvac');
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                isAuthenticated && currentTab === 'hvac'
                  ? 'bg-[#4cd6fb] text-[#003642] font-bold'
                  : 'text-[#bcc9ce] hover:text-[#dfe2ee] bg-[#181c24]'
              }`}
            >
              3: Hardware Telemetry
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsNodeSwitcherOpen(true)}
          className="text-[11px] text-[#4cd6fb] hover:underline flex items-center gap-1 font-mono shrink-0 ml-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[14px]">tune</span>
          <span className="hidden xs:inline">{activeNode.cluster}</span>
        </button>
      </div>

      {!isAuthenticated ? (
        /* Screen 2: Authentication / Connect (Image 3) */
        <AuthScreen
          activeNode={activeNode}
          onOpenNodeSwitcher={() => setIsNodeSwitcherOpen(true)}
          onAuthenticate={() => setIsAuthenticated(true)}
          onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        />
      ) : (
        /* Connected Facility OS App */
        <div className="flex flex-col flex-1 min-h-screen">
          {/* Top Sticky Header */}
          <Header
            currentTab={currentTab}
            activeNode={activeNode}
            alerts={alerts}
            onBackToPrevious={handleBack}
            onOpenNodeSwitcher={() => setIsNodeSwitcherOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenNotifications={() => setCurrentTab('alerts')}
          />

          {/* Screen Content */}
          <main className="flex-1 w-full pt-16 pb-20">
            {currentTab === 'settings' && (
              /* Screen 1: Facility Settings & Calibration (Image 1) */
              <SettingsScreen
                activeNode={activeNode}
                onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
                onRevokeKeys={handleRevokeKeys}
                onDisconnectSession={() => setIsAuthenticated(false)}
              />
            )}

            {currentTab === 'hvac' && (
              /* Screen 3: Hardware Telemetry / Remote Actuator (Image 6) */
              <DeviceDetailScreen
                onBack={handleBack}
                onOpenRegisters={() => setIsRegistersOpen(true)}
                onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
              />
            )}

            {currentTab === 'dashboard' && (
              <DashboardScreen
                activeNode={activeNode}
                onNavigateToDevice={() => {
                  setPreviousTab('dashboard');
                  setCurrentTab('hvac');
                }}
                onNavigateToSettings={() => setCurrentTab('settings')}
                onNavigateToAlerts={() => setCurrentTab('alerts')}
              />
            )}

            {currentTab === 'zones' && (
              <ZonesScreen
                onSelectZoneNode={() => {
                  setPreviousTab('zones');
                  setCurrentTab('hvac');
                }}
              />
            )}

            {currentTab === 'alerts' && (
              <AlertsScreen
                alerts={alerts}
                onAcknowledgeAlert={handleAcknowledgeAlert}
                onClearAll={handleClearAllAlerts}
              />
            )}
          </main>

          {/* Bottom Navigation */}
          <BottomNav currentTab={currentTab} onSelectTab={handleTabChange} />
        </div>
      )}

      {/* Global Modals */}
      <NodeSwitcherModal
        isOpen={isNodeSwitcherOpen}
        activeNode={activeNode}
        onSelectNode={(node) => setActiveNode(node)}
        onClose={() => setIsNodeSwitcherOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onDisconnect={() => setIsAuthenticated(false)}
        onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
      />

      <AuditLogsModal
        isOpen={isAuditLogsOpen}
        onClose={() => setIsAuditLogsOpen(false)}
      />

      <RegistersModal
        isOpen={isRegistersOpen}
        onClose={() => setIsRegistersOpen(false)}
      />

      <OfflineDiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
      />
    </div>
  );
}

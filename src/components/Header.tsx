import React, { useState } from 'react';
import { NavigationTab, FacilityNode, SystemAlert } from '../types/facility';

interface HeaderProps {
  currentTab: NavigationTab;
  activeNode: FacilityNode;
  alerts: SystemAlert[];
  onBackToPrevious?: () => void;
  onOpenNodeSwitcher: () => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  activeNode,
  alerts,
  onBackToPrevious,
  onOpenNodeSwitcher,
  onOpenProfile,
  onOpenNotifications,
}) => {
  const unreadAlerts = alerts.filter(a => !a.acknowledged).length;

  if (currentTab === 'hvac') {
    return (
      <header className="fixed top-0 inset-x-0 z-40 bg-[#0f131c]/85 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.4)] border-b border-[#31353e]/40">
        <div className="h-16 px-4 flex items-center justify-between gap-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              aria-label="Go Back"
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#262a33]/60 text-[#dfe2ee] hover:text-[#4cd6fb] active:scale-95 transition-all shrink-0 cursor-pointer"
              onClick={onBackToPrevious}
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4cd6fb] shadow-[0_0_8px_rgba(76,214,251,0.7)] shrink-0"></span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#bcc9ce] truncate">
                  Hardware Telemetry
                </span>
              </div>
              <span className="text-sm font-semibold text-[#dfe2ee] truncate">
                Device Detail &amp; Remote Actuator
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              aria-label="Node actions"
              onClick={onOpenProfile}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#262a33]/60 text-[#dfe2ee] hover:text-[#4cd6fb] active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">more_vert</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Primary Header (Settings, Dashboard, Zones, Alerts) - matches Image 1
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#0f131c]/85 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.4)] border-b border-[#31353e]/40">
      <div className="h-16 px-4 flex items-center justify-between gap-3 max-w-4xl mx-auto">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            alt="AetherPulse Logo"
            className="h-8 w-auto object-contain shrink-0"
            src="https://lh3.googleusercontent.com/aida/AEtjO1XV_Y1UFCh-zOmKPBWtKhPhYZm_CnCRS5SN0HMA9Bf50Q4FGiUhHIthPzBXQdlUfNj0OmW3tn1p9Ij3yqCRYNi-qLZFNjd-ESpDEA8ltJfbA_BfzoE8PxoY7ar_hU5Hd73eDjlhhI_eYbKtbU3M7dHruCayzAYAlNe_CDt1wHOhdxGeho4gfKvTbCY9xkYO8lGQ_VrzyezmV3mY_q77liFfGo4VzdsvmXL0dF-sjX-EaxZK23d_G0x07-Q"
          />
          <div className="flex flex-col min-w-0 cursor-pointer" onClick={onOpenNodeSwitcher}>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] shadow-[0_0_8px_rgba(78,222,163,0.7)] animate-pulse shrink-0"></span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#bcc9ce] truncate">
                {activeNode.name}
              </span>
            </div>
            <span className="text-sm font-semibold text-[#dfe2ee] truncate">
              {currentTab === 'settings'
                ? 'Facility Settings & Calibration'
                : currentTab === 'dashboard'
                ? 'Facility Overview & Metrics'
                : currentTab === 'zones'
                ? 'Plenums & IoT Node Matrix'
                : 'Active System Alarms & Safety'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            aria-label="Emergency Notifications"
            onClick={onOpenNotifications}
            className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-[#262a33]/60 text-[#dfe2ee] hover:text-[#4cd6fb] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadAlerts > 0 && (
              <span className="absolute top-2 right-2 flex h-2.5 w-2.5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffb4ab] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffb4ab]"></span>
              </span>
            )}
          </button>
          
          <button
            type="button"
            aria-label="Open User Profile"
            onClick={onOpenProfile}
            className="rounded-full ring-1 ring-[#869398]/30 hover:ring-[#4cd6fb] transition-all cursor-pointer overflow-hidden active:scale-95"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover shrink-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAx7nfL70jAEjAvvUxVPH5Yc9aA-0ce-Z7yuFU1XhEC6lgP1EF-VrRoYdWa_dTEg-Vj1RJM0mZuCxWt0-KQlzxvVCP4aQNRZBojegrzjF3VOZjGcvA2d0hOZv6X1gkq3LkIYLBzLdIcOVrMBqKZvR3XNn5b-6WcBxe65-MIe1JCfvHqOfAFk9kI6luBAu-VV6QI7zADGRjhGe_8y2uZCzZw16YRQewtdhcjmtsep7LXEE8JudaIJo7e"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

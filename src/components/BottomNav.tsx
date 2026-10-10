import React from 'react';
import { NavigationTab } from '../types/facility';

interface BottomNavProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const navItems: { id: NavigationTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'zones', label: 'Zones', icon: 'grid_view' },
    { id: 'hvac', label: 'HVAC', icon: 'tune' },
    { id: 'alerts', label: 'Alerts', icon: 'shield' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-[#0f131c]/90 backdrop-blur-xl border-t border-[#31353e]/40 shadow-[0_-2px_12px_rgba(0,0,0,0.45)]">
      <div className="grid grid-cols-5 items-center h-16 max-w-4xl mx-auto px-1.5">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 h-full transition-all select-none cursor-pointer ${
                isActive
                  ? 'text-[#4cd6fb] [&>span.material-symbols-outlined]:drop-shadow-[0_0_8px_rgba(76,214,251,0.55)] font-medium'
                  : 'text-[#bcc9ce] hover:text-[#dfe2ee]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px] transition-transform active:scale-90">
                {item.icon}
              </span>
              <span className="text-[11px] font-medium tracking-wide truncate">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

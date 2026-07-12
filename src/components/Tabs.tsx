import React from 'react';
import { DashboardIcon, SanBoxIcon, SettingsIcon } from '../lib/icons';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface TabsProps {
  activeTab: string;
  onChange: (id: string) => void;
}

export default function Tabs({ activeTab, onChange }: TabsProps) {
  return (
    <nav
      aria-label="Primary navigation"
      className="flex gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-white/10 dark:bg-white/5"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-2 text-[11px] font-bold transition focus-visible:outline-2 focus-visible:outline-slate-500 ${
              isActive
                ? 'bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950'
                : 'border border-transparent text-slate-500 hover:bg-white/70 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-slate-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'sandbox', label: 'Sandbox', icon: <SanBoxIcon /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon /> }
] satisfies Tab[];

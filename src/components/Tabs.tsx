import type { ReactNode } from 'react';
import { DownloadIcon, SettingsIcon } from '../lib/icons';
import type { AppTabs } from '../App';

interface Tab {
  id: AppTabs;
  label: string;
  icon: ReactNode;
}

interface TabsProps {
  activeTab: AppTabs;
  onChange: (id: AppTabs) => void;
}

export default function Tabs({ activeTab, onChange }: TabsProps) {
  return (
    <nav
      aria-label="Primary navigation"
      className="flex flex-col gap-1"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            aria-current={isActive ? 'page' : undefined}
            className={`group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-[10px] font-black uppercase tracking-[.08em] transition focus-visible:outline-2 focus-visible:outline-[#eefb7a] ${
              isActive
                ? 'bg-white text-[#101416] shadow-sm'
                : 'text-white/35 hover:bg-white/5 hover:text-white/75'
            }`}
          >
            <span className={`w-5 font-mono text-[8px] ${isActive ? 'text-black/40' : 'text-white/20'}`}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

const tabs = [
  { id: 'files', label: 'Files', icon: '01' },
  { id: 'image', label: 'Optimize', icon: '02' },
  { id: 'redaction', label: 'Redact', icon: '03' },
  { id: 'watermark', label: 'Watermark', icon: '04' },
  { id: 'upscale', label: 'Upscale', icon: '05' },
  { id: 'downloads', label: 'Downloads', icon: <DownloadIcon /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon /> }
] satisfies Tab[];

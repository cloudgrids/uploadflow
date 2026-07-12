import { GeneralSettings } from './GeneralSettings';
import { ImageSettings } from './ImageSettings';
import { TextRedactSettings } from './TextRedactSettings';
import type { UploadFlowSettings } from './UploadFlowSettings';
import { WatermarkSettings } from './WatermarkSettings';

interface SettingsProps {
  settings: UploadFlowSettings;
  onUpdate: (updatedSettings: UploadFlowSettings) => void;
  onResetStats: () => Promise<void>;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onUpdate, onResetStats }) => {
  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <GeneralSettings settings={settings} onUpdate={onUpdate} onResetStats={onResetStats} />
      <ImageSettings settings={settings} onUpdate={onUpdate} />
      <TextRedactSettings settings={settings} onUpdate={onUpdate} />
      <WatermarkSettings settings={settings} onUpdate={onUpdate} />
    </div>
  );
};

export type UploadFlowSettingsTab = 'image' | 'redaction' | 'upscale' | 'watermark';

export class ImageSettings {
  enableAutoOptimize: boolean;
  defaultFormat: string;
  defaultQuality: number;

  constructor(enableAutoOptimize: boolean = true, defaultFormat: string = 'image/jpeg', defaultQuality: number = 0.8) {
    this.enableAutoOptimize = enableAutoOptimize;
    this.defaultFormat = defaultFormat;
    this.defaultQuality = defaultQuality;
  }
}

export class RedactionSettings {
  enableRedaction: boolean;
  redactEmail: boolean;
  redactPhone: boolean;
  redactCard: boolean;
  redactIP: boolean;

  constructor(
    enableRedaction: boolean = true,
    redactEmail: boolean = true,
    redactPhone: boolean = true,
    redactCard: boolean = true,
    redactIP: boolean = false
  ) {
    this.enableRedaction = enableRedaction;
    this.redactEmail = redactEmail;
    this.redactPhone = redactPhone;
    this.redactCard = redactCard;
    this.redactIP = redactIP;
  }
}

export class UpscaleSettings {
  enableUpscaling: boolean;
  upscaleFactor: number;

  constructor(enableUpscaling: boolean = false, upscaleFactor: number = 2) {
    this.enableUpscaling = enableUpscaling;
    this.upscaleFactor = upscaleFactor;
  }
}

export class WatermarkSettings {
  enableWatermark: boolean;
  text: string;
  position: string | { x: number; y: number };
  font: string;
  fontSize: number;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  fillStyle: string;

  constructor(
    enableWatermark: boolean = false,
    text: string = 'UploadFlow',
    position: string | { x: number; y: number } = 'bottom-right',
    font: string = 'Arial',
    fontSize: number = 20,
    textAlign: CanvasTextAlign = 'center',
    textBaseline: CanvasTextBaseline = 'middle',
    fillStyle: string = 'rgba(255, 255, 255, 0.8)'
  ) {
    this.enableWatermark = enableWatermark;
    this.text = text;
    this.position = position;
    this.font = font;
    this.fontSize = fontSize;
    this.textAlign = textAlign;
    this.textBaseline = textBaseline;
    this.fillStyle = fillStyle;
  }
}

export class GeneralSettings {
  enableUploadFlow: boolean;
  defaultTab: UploadFlowSettingsTab;
  theme: 'light' | 'dark' | 'system';

  constructor(
    enableUploadFlow: boolean = true,
    defaultTab: UploadFlowSettingsTab = 'image',
    theme: 'light' | 'dark' | 'system' = 'system'
  ) {
    this.enableUploadFlow = enableUploadFlow;
    this.defaultTab = defaultTab;
    this.theme = theme;
  }
}

export class UploadFlowSettings {
  imageSettings: ImageSettings;
  redactionSettings: RedactionSettings;
  upscaleSettings: UpscaleSettings;
  watermarkSettings: WatermarkSettings;
  generalSettings: GeneralSettings;

  constructor(
    imageSettings: ImageSettings = new ImageSettings(),
    redactionSettings: RedactionSettings = new RedactionSettings(),
    upscaleSettings: UpscaleSettings = new UpscaleSettings(),
    watermarkSettings: WatermarkSettings = new WatermarkSettings(),
    generalSettings: GeneralSettings = new GeneralSettings()
  ) {
    this.imageSettings = imageSettings;
    this.redactionSettings = redactionSettings;
    this.upscaleSettings = upscaleSettings;
    this.watermarkSettings = watermarkSettings;
    this.generalSettings = generalSettings;
  }
}

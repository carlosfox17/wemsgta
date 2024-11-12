import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings } from '../types';

interface SettingsState {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const defaultSettings: AppSettings = {
  appName: 'SGP',
  logoUrl: '',
  primaryColor: '#4F46E5',
  companyName: 'Minha Empresa',
  contactEmail: 'contato@empresa.com',
  dateFormat: 'DD/MM/YYYY',
  timezone: 'Africa/Luanda',
  smtp: {
    host: '',
    port: 587,
    secure: false,
    username: '',
    password: '',
    fromEmail: '',
    fromName: '',
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
            smtp: {
              ...state.settings.smtp,
              ...(newSettings.smtp || {}),
            },
          },
        })),
    }),
    {
      name: 'app-settings',
    }
  )
);
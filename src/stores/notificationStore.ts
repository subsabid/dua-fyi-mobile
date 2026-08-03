import { create } from 'zustand';
import { notificationService } from '@/src/lib/notifications';

interface NotificationState {
  dailyReminderEnabled: boolean;
  dailyReminderHour: number;
  dailyReminderMinute: number;
  duaOfTheDayEnabled: boolean;
  permissionGranted: boolean;

  // Actions
  initialize: () => Promise<void>;
  toggleDailyReminder: (enabled: boolean) => Promise<void>;
  setReminderTime: (hour: number, minute: number) => Promise<void>;
  toggleDuaOfTheDay: (enabled: boolean) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  dailyReminderEnabled: false,
  dailyReminderHour: 6,
  dailyReminderMinute: 0,
  duaOfTheDayEnabled: false,
  permissionGranted: false,

  initialize: async () => {
    // Just set defaults for now - persistence will be added later
    set({ dailyReminderEnabled: false, duaOfTheDayEnabled: false });
  },

  toggleDailyReminder: async (enabled: boolean) => {
    if (enabled) {
      const granted = await notificationService.requestPermissions();
      if (!granted) {
        set({ permissionGranted: false });
        return;
      }
      set({ permissionGranted: true });
      const { dailyReminderHour, dailyReminderMinute } = get();
      await notificationService.scheduleDailyReminder(dailyReminderHour, dailyReminderMinute);
    } else {
      await notificationService.cancelDailyReminder();
    }
    set({ dailyReminderEnabled: enabled });
  },

  setReminderTime: async (hour: number, minute: number) => {
    set({ dailyReminderHour: hour, dailyReminderMinute: minute });
    const { dailyReminderEnabled } = get();
    if (dailyReminderEnabled) {
      await notificationService.scheduleDailyReminder(hour, minute);
    }
  },

  toggleDuaOfTheDay: async (enabled: boolean) => {
    if (enabled) {
      const granted = await notificationService.requestPermissions();
      if (!granted) {
        set({ permissionGranted: false });
        return;
      }
      set({ permissionGranted: true });
      await notificationService.scheduleDuaOfTheDay(8, 0);
    } else {
      await notificationService.cancelDuaOfTheDay();
    }
    set({ duaOfTheDayEnabled: enabled });
  },
}));

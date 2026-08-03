import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: Platform.OS !== 'web',
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notificationService = {
  // Request permissions
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  },

  // Schedule daily dua reminder
  async scheduleDailyReminder(hour: number = 6, minute: number = 0): Promise<string> {
    // Cancel existing daily reminders first
    await this.cancelDailyReminder();
    
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🤲 Time for Remembrance',
        body: 'Start your day with duas from Fortress of the Muslim',
        data: { type: 'daily_reminder' },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
    
    return id;
  },

  // Cancel daily reminder
  async cancelDailyReminder(): Promise<void> {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of scheduled) {
      if (notification.content.data?.type === 'daily_reminder') {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  },

  // Schedule Dua of the Day notification
  async scheduleDuaOfTheDay(hour: number = 8, minute: number = 0): Promise<string> {
    await this.cancelDuaOfTheDay();
    
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📖 Dua of the Day',
        body: 'Discover today\'s supplication from Hisn al-Muslim',
        data: { type: 'dua_of_the_day' },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
    
    return id;
  },

  // Cancel Dua of the Day
  async cancelDuaOfTheDay(): Promise<void> {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of scheduled) {
      if (notification.content.data?.type === 'dua_of_the_day') {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  },

  // Cancel all scheduled notifications
  async cancelAll(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  // Get all scheduled notifications (for debugging)
  async getScheduled() {
    return await Notifications.getAllScheduledNotificationsAsync();
  },
};

import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';

export function useNotificationHandler() {
  const router = useRouter();

  useEffect(() => {
    // Handle notification tap (when app is in background/killed)
    const listener = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      
      if (data?.type === 'daily_reminder' || data?.type === 'dua_of_the_day') {
        // Navigate to home screen
        router.push('/(tabs)');
      }
      
      if (data?.chapterId) {
        // Navigate to specific chapter
        router.push(`/chapter/${data.chapterId}`);
      }
    });

    return () => {
      listener.remove();
    };
  }, [router]);
}

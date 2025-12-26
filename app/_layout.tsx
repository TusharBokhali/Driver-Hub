import AdminContext from '@/src/context/AdminContext';
import ToastContext from '@/src/context/ToastContext';
import UserContext from '@/src/context/UserContext';
import * as Notifications from "expo-notifications";
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from "expo-updates";
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import LayoutMain from './LayoutMain';
SplashScreen.preventAutoHideAsync();


Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {

  async function setupAndroidChannel() {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.MAX,
        sound: "default",
        vibrationPattern: [0, 250, 250, 250],
        enableLights: true,
        lightColor: "#FF231F7C",
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }
  }

  useEffect(() => {
    setupAndroidChannel();
    const prepare = async () => {
      try {
        if (!__DEV__) {
          const update = await Updates.checkForUpdateAsync();
            
          if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
          }
        }
      } catch (e) {
        console.log("Startup error:", e);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    prepare();


   const notificationListener =
    Notifications.addNotificationReceivedListener((notification:any) => {
      if (notification.request.trigger?.type !== "push") {
        return;
      }

      const title = notification.request.content.title ?? "Notification";
      const body = notification.request.content.body ?? "";

      
      Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: "default",
        },
        trigger: null,
      });
    });

  const responseListener =
    Notifications.addNotificationResponseReceivedListener(response => {
      console.log("Clicked:", response.notification.request.content.data);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);


  return (
    <MenuProvider>
      <ToastContext>
        <AdminContext>
          <LayoutMain>
            <UserContext>
              <Stack screenOptions={{ headerShown: false }} />
            </UserContext>
          </LayoutMain>
        </AdminContext>
      </ToastContext>
    </MenuProvider>
  );
}

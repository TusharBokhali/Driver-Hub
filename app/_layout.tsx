import AdminContext from '@/src/context/AdminContext';
import ToastContext from '@/src/context/ToastContext';
import UserContext from '@/src/context/UserContext';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from "expo-updates";
import { useEffect } from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import LayoutMain from './LayoutMain';
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
 

    useEffect(() => {
    const prepare = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (e) {
        console.log("Update check failed:", e);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    prepare();
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

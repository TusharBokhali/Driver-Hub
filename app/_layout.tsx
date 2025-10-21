
import { useFonts } from "expo-font";
import { Stack } from 'expo-router';

export default function RootLayout() {

 const [fontsLoaded] = useFonts({
        regular: require("@/assets/fonts/Lexend-Regular.ttf"),
        SemiBold: require("@/assets/fonts/Lexend-SemiBold.ttf"),
        Medium: require("@/assets/fonts/Lexend-Medium.ttf"),
        Bold: require("@/assets/fonts/Lexend-Bold.ttf"),
    });

  return (

    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>


  );
}

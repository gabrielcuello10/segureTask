import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
SplashScreen.preventAutoHideAsync();

export default function RootLayout(): JSX.Element | null {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect((): void => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
          headerTintColor: Colors[colorScheme ?? "light"].tint,
        }}
        initialRouteName="index"
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Tareas Pendientes",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 24,
              color: Colors[colorScheme ?? "light"].tint,
            },
          }}
        />
        <Stack.Screen
          name="create-task"
          options={{
            title: "Crear Tarea",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 24,
              color: Colors[colorScheme ?? "light"].tint,
            },
            headerTintColor: Colors[colorScheme ?? "light"].tint,
          }}
        />
        <Stack.Screen
          name="view-task"
          options={{
            title: "Ver Tarea",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 24,
              color: Colors[colorScheme ?? "light"].tint,
            },
            headerTintColor: Colors[colorScheme ?? "light"].tint,
          }}
        />
        <Stack.Screen
          name="edit-task"
          options={{
            title: "Editar Tarea",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 24,
              color: Colors[colorScheme ?? "light"].tint,
            },
            headerTintColor: Colors[colorScheme ?? "light"].tint,
          }}
        />
        <Stack.Screen
          name="+not-found"
          options={{
            title: "¡Ups!",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 24,
              color: Colors[colorScheme ?? "light"].tint,
            },
            headerTintColor: Colors[colorScheme ?? "light"].tint,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}

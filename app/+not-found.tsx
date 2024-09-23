import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "¡Ups!" }} />
      <ThemedView style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="alert-circle-outline" size={100} color="#FF6B6B" />
        </View>
        <ThemedText type="title" style={styles.title}>
          Esta pantalla no existe.
        </ThemedText>
        <Link href="/" style={styles.link}>
          <View style={styles.linkContent}>
            <Ionicons name="home-outline" size={24} color="#4A90E2" />
            <ThemedText type="link" style={styles.linkText}>
              ¡Ir a la pantalla de inicio!
            </ThemedText>
          </View>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  linkText: {
    marginLeft: 10,
    fontSize: 18,
    color: "#4A90E2",
  },
});

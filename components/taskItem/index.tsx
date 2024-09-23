import React from "react";
import { View, StyleSheet, useColorScheme, Pressable } from "react-native";
import { Link } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface Task {
  id: string;
  title: string;
  description: string;
  isPrivate: boolean;
}

interface ItemTaskProps {
  task: Task;
  onPress: () => void;
}

const ItemTask: React.FC<ItemTaskProps> = ({ task, onPress }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <Pressable
      style={[
        styles.containerLink,
        {
          backgroundColor: task.isPrivate
            ? colors.backgroundTwo
            : colors.background,
        },
      ]}
      onPress={onPress}
    >
      <View style={{ flex: 1 }}>
        {task.isPrivate ? (
          <View style={styles.privateContent}>
            <Ionicons name="lock-closed" size={24} color={colors.tint} />
            <ThemedText style={styles.privateMessage}>
              Contenido privado
            </ThemedText>
          </View>
        ) : (
          <>
            <ThemedText style={styles.title} numberOfLines={1}>
              {task.title}
            </ThemedText>
            <ThemedText style={styles.description} numberOfLines={2}>
              {task.description}
            </ThemedText>
          </>
        )}
      </View>
      <Ionicons name="chevron-forward" size={24} color={colors.tint} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  containerLink: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: "#ccc",
    borderTopColor: "#ccc",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
  },
  privateTag: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  privateText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  privateContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  privateMessage: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ItemTask;

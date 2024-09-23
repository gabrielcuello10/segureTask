import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Colors } from "@/constants/Colors";

interface Task {
  id: string;
  title: string;
  description: string;
  isPrivate: boolean;
  createdAt: string;
}

type RootStackParamList = {
  "edit-task": { task: Task };
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "edit-task"
>;

export default function ViewTask(): JSX.Element {
  const navigation = useNavigation<NavigationProp>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const params = useLocalSearchParams();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    if (params.task) {
      const parsedTask = JSON.parse(params.task as string) as Task;
      setTask(parsedTask);
    }
  }, [params.task]);

  const handleEditTask = (): void => {
    if (task) {
      navigation.navigate("edit-task", { task });
    }
  };

  if (!task) {
    return (
      <LinearGradient
        colors={[
          Colors[colorScheme ?? "light"].background,
          Colors[colorScheme ?? "light"].backgroundTwo,
        ]}
        style={styles.container}
      >
        <ThemedText style={[styles.title, { color: colors.text }]}>
          Cargando tarea...
        </ThemedText>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundTwo]}
      style={styles.container}
    >
      <ThemedText style={[styles.title, { color: colors.text }]}>
        {task.title}
      </ThemedText>
      <ThemedText style={[styles.description, { color: colors.text }]}>
        {task.description}
      </ThemedText>
      <View style={styles.infoContainer}>
        <Ionicons
          name={task.isPrivate ? "lock-closed" : "lock-open"}
          size={24}
          color={colors.tint}
        />
        <ThemedText style={[styles.infoText, { color: colors.text }]}>
          Privada: {task.isPrivate ? "Sí" : "No"}
        </ThemedText>
      </View>
      <ThemedText style={[styles.infoText, { color: colors.text }]}>
        Creada: {new Date(task.createdAt).toLocaleString()}
      </ThemedText>
      <TouchableOpacity style={styles.editButton} onPress={handleEditTask}>
        <ThemedText style={styles.editButtonText}>Editar Tarea</ThemedText>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 10,
    marginBottom: 30,
    fontFamily: "SpaceMono",
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
  },
  editButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  editButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

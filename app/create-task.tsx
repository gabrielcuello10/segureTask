import React, { useState } from "react";
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/themedTextInput";
import { Colors } from "@/constants/Colors";

interface Task {
  id: number;
  title: string;
  description: string;
  isPrivate: boolean;
  createdAt: string;
}

export default function CreateTask(): JSX.Element {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const handleSaveTask = async (): Promise<void> => {
    try {
      const newTask: Task = {
        id: Date.now(),
        title,
        description,
        isPrivate,
        createdAt: new Date().toISOString(),
      };

      const storedTasks = await AsyncStorage.getItem("tasks");
      const tasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
      tasks.push(newTask);

      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
      navigation.goBack();
    } catch (error) {
      console.error("Error al guardar la tarea:", error);
    }
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundTwo]}
      style={styles.container}
    >
      <ThemedTextInput
        style={
          [styles.input, { backgroundColor: colors.backgroundTwo }] as TextStyle
        }
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      <ThemedTextInput
        style={
          [
            styles.input,
            styles.descriptionInput,
            { backgroundColor: colors.backgroundTwo },
          ] as TextStyle
        }
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity
        style={styles.privateToggle}
        onPress={() => setIsPrivate(!isPrivate)}
      >
        <Ionicons
          name={isPrivate ? "lock-closed" : "lock-open"}
          size={24}
          color={colors.tint}
        />
        <ThemedText style={styles.privateText}>
          Tarea privada: {isPrivate ? "Sí" : "No"}
        </ThemedText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
        <ThemedText style={styles.saveButtonText}>Guardar Tarea</ThemedText>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: "25%",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "SpaceMono",
  },
  input: {
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 0,
  },
  descriptionInput: {
    height: 120,
    padding: 10,
    textAlignVertical: "top",
  },
  privateToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  privateText: {
    marginLeft: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

import React, { useState } from "react";
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/themedTextInput";
import { Colors } from "@/constants/Colors";

interface Task {
  id: string | number;
  title: string;
  description: string;
  isPrivate: boolean;
  createdAt: string;
}

type RootStackParamList = {
  "edit-task": { task: Task };
  "view-task": { task: string };
};

type EditTaskRouteProp = RouteProp<RootStackParamList, "edit-task">;
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "edit-task"
>;

export default function EditTask(): JSX.Element {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<EditTaskRouteProp>();
  const { task } = route.params;
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [title, setTitle] = useState<string>(task.title);
  const [description, setDescription] = useState<string>(task.description);
  const [isPrivate, setIsPrivate] = useState<boolean>(task.isPrivate);

  const handleSaveTask = async (): Promise<void> => {
    try {
      const updatedTask: Task = {
        ...task,
        title,
        description,
        isPrivate,
      };

      const storedTasks = await AsyncStorage.getItem("tasks");
      console.log("Tareas almacenadas:", storedTasks);

      let tasks: Task[] = [];
      if (storedTasks) {
        try {
          tasks = JSON.parse(storedTasks);
        } catch (parseError) {
          console.error(
            "Error al analizar las tareas almacenadas:",
            parseError
          );
          Alert.alert(
            "Error",
            "Hubo un problema al cargar las tareas existentes."
          );
          return;
        }
      }

      tasks = tasks.map((t) => (t.id === task.id ? updatedTask : t));

      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
      navigation.navigate("view-task", { task: JSON.stringify(updatedTask) });
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo guardar la tarea. Por favor, intente de nuevo."
      );
    }
  };

  return (
    <LinearGradient
      colors={[
        Colors[colorScheme ?? "light"].background,
        Colors[colorScheme ?? "light"].backgroundTwo,
      ]}
      style={styles.container}
    >
      <ThemedTextInput
        style={
          [
            styles.input,
            {
              color: colors.text,
              backgroundColor: colors.backgroundTwo,
            },
          ] as TextStyle
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
            {
              color: colors.text,
              backgroundColor: colors.backgroundTwo,
            },
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
        <ThemedText style={[styles.privateText, { color: colors.text }]}>
          Tarea privada: {isPrivate ? "Sí" : "No"}
        </ThemedText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
        <ThemedText style={styles.saveButtonText}>Guardar Cambios</ThemedText>
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
    color: "#FFF",
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

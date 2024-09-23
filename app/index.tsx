import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Alert,
  useColorScheme,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { SwipeListView } from "react-native-swipe-list-view";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import TaskItem from "@/components/taskItem";
import { Colors } from "@/constants/Colors";
import { Link, useNavigation, useFocusEffect } from "expo-router";
import { NavigationProp } from "@react-navigation/native";

interface Task {
  id: string;
  title: string;
  description: string;
  isPrivate: boolean;
  createdAt: string;
}

type RootStackParamList = {
  "view-task": { task: string };
};

export default function HomeScreen(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const colorScheme = useColorScheme();

  const loadTasks = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Error al cargar tareas:", error);
      setError("Error al cargar tareas. Por favor, intente de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const authenticate = async (): Promise<boolean> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert(
          "Error",
          "Tu dispositivo no soporta autenticación biométrica"
        );
        return false;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert("Error", "No hay huellas registradas en este dispositivo");
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autenticación con huella dactilar",
        fallbackLabel: "Usar PIN",
      });

      setIsAuthenticated(result.success);
      return result.success;
    } catch (error) {
      console.error("Error de autenticación:", error);
      Alert.alert(
        "Error",
        "No se pudo autenticar. Por favor, intente de nuevo."
      );
      return false;
    }
  };

  const handleViewTask = async (task: Task): Promise<void> => {
    if (task.isPrivate && !isAuthenticated) {
      const authSuccess = await authenticate();
      if (authSuccess) {
        navigation.navigate("view-task", { task: JSON.stringify(task) });
      } else {
        Alert.alert(
          "Error",
          "Autenticación requerida para ver tareas privadas"
        );
      }
    } else {
      navigation.navigate("view-task", { task: JSON.stringify(task) });
    }
  };

  const handleDeleteTask = async (taskId: string): Promise<void> => {
    try {
      const taskToDelete = tasks.find((task) => task.id === taskId);
      if (taskToDelete && taskToDelete.isPrivate && !isAuthenticated) {
        const authSuccess = await authenticate();
        if (!authSuccess) {
          Alert.alert(
            "Error",
            "Autenticación requerida para eliminar tareas privadas"
          );
          return;
        }
      }
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
      Alert.alert("Error", "No se pudo eliminar la tarea. Intente de nuevo.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  const renderItem = ({ item }: { item: Task }): JSX.Element => (
    <TaskItem task={item} onPress={() => handleViewTask(item)} />
  );

  const renderHiddenItem = (data: { item: Task }): JSX.Element => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDeleteTask(data.item.id)}
    >
      <Ionicons name="trash-outline" size={24} color="#FFF" />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <LinearGradient
        colors={[
          Colors[colorScheme ?? "light"].background,
          Colors[colorScheme ?? "light"].backgroundTwo,
        ]}
        style={styles.container}
      >
        <ThemedText style={styles.loadingText}>Cargando tareas...</ThemedText>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient
        colors={[
          Colors[colorScheme ?? "light"].background,
          Colors[colorScheme ?? "light"].backgroundTwo,
        ]}
        style={styles.container}
      >
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={loadTasks}>
          <ThemedText style={styles.retryButtonText}>
            Intentar de nuevo
          </ThemedText>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[
        Colors[colorScheme ?? "light"].background,
        Colors[colorScheme ?? "light"].backgroundTwo,
      ]}
      style={styles.container}
    >
      <SwipeListView
        data={tasks}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
        disableRightSwipe
        keyExtractor={(item: Task) => item.id}
      />
      <Link style={styles.addButton} href={`/create-task`} asChild>
        <TouchableOpacity>
          <Ionicons
            name="add"
            style={{ margin: "auto" }}
            size={30}
            color="#FFFF"
          />
        </TouchableOpacity>
      </Link>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    fontSize: 18,
    color: "#FFF",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#FFF",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
    alignSelf: "center",
  },
  retryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    display: "flex",
    position: "absolute",
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
    backgroundColor: "#FF3B30",
    right: 0,
  },
});

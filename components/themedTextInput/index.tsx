import React from "react";
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  TextStyle,
  useColorScheme,
} from "react-native";
import { Colors } from "@/constants/Colors";

interface ThemedTextInputProps extends TextInputProps {
  style?: TextStyle;
}

export const ThemedTextInput: React.FC<ThemedTextInputProps> = (props) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <TextInput
      {...props}
      style={[
        styles.input,
        {
          color: colors.text,
          backgroundColor: colors.background,
          borderColor: colors.tint,
        },
        props.style,
      ]}
      placeholderTextColor={colors.text + "80"} // 80 es para agregar 50% de opacidad
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

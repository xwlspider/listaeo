import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { X } from "lucide-react-native";
import { Button } from "./Button";

interface ErrorScreenProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorScreen({ message, onRetry }: ErrorScreenProps) {
  return (
    <View style={styles.container}>
      <X size={48} color="#ef4444" style={styles.icon} />
      <Text style={styles.text}>{message}</Text>
      {onRetry && (
        <Button onPress={onRetry} variant="primary" style={styles.button}>
          Reintentar
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    marginTop: 0,
  },
});
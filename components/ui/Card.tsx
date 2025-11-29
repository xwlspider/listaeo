import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "success";
  style?: ViewStyle;
}

export function Card({ children, variant = "default", style }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        variant === "success" && styles.cardSuccess,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardSuccess: {
    backgroundColor: "#f0fdf4",
    borderColor: "#86efac",
  },
});
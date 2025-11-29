import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface StatusDotProps {
  variant: "success" | "warning";
  style?: ViewStyle;
}

export function StatusDot({ variant, style }: StatusDotProps) {
  return (
    <View
      style={[
        styles.dot,
        variant === "success" ? styles.dotSuccess : styles.dotWarning,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotSuccess: {
    backgroundColor: "#10b981",
  },
  dotWarning: {
    backgroundColor: "#f59e0b",
  },
});
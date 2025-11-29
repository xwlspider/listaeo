import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp } from "react-native";

// Tipo para iconos de lucide-react-native
type LucideIconComponent = React.ComponentType<{
  size?: number;
  color?: string;
  style?: any;
}>;

interface ButtonProps {
  onPress: () => void;
  children: string;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  icon?: LucideIconComponent;
  iconSize?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  onPress,
  children,
  variant = "primary",
  icon: Icon,
  iconSize = 20,
  disabled = false,
  style,
}: ButtonProps) {
  return (
    <Pressable
      style={[
        styles.btn,
        variant === "primary" && styles.btnPrimary,
        variant === "secondary" && styles.btnSecondary,
        variant === "success" && styles.btnSuccess,
        variant === "warning" && styles.btnWarning,
        variant === "danger" && styles.btnDanger,
        variant === "info" && styles.btnInfo,
        disabled && styles.btnDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {Icon && <Icon size={iconSize} color="#fff" style={styles.icon} />}
      <Text style={styles.btnTxt}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },
  icon: {
    marginRight: 4,
  },
  btnPrimary: {
    backgroundColor: "#3b82f6",
  },
  btnSecondary: {
    backgroundColor: "#6b7280",
  },
  btnSuccess: {
    backgroundColor: "#10b981",
  },
  btnWarning: {
    backgroundColor: "#f59e0b",
  },
  btnDanger: {
    backgroundColor: "#ef4444",
  },
  btnInfo: {
    backgroundColor: "#6b7280",
  },
  btnDisabled: {
    backgroundColor: "#9ca3af",
    opacity: 0.6,
  },
  btnTxt: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

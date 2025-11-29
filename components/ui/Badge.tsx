import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";

type LucideIconComponent = React.ComponentType<{
  size?: number;
  color?: string;
  style?: any;
}>;

interface BadgeProps {
  children: string;
  variant?: "success" | "warning" | "danger" | "info";
  icon?: LucideIconComponent;
  iconSize?: number;
  style?: ViewStyle;
}

export function Badge({
  children,
  variant = "info",
  icon: Icon,
  iconSize = 14,
  style,
}: BadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        variant === "success" && styles.badgeSuccess,
        variant === "warning" && styles.badgeWarning,
        variant === "danger" && styles.badgeDanger,
        variant === "info" && styles.badgeInfo,
        style,
      ]}
    >
      {Icon && <Icon size={iconSize} color="#fff" style={styles.icon} />}
      <Text style={styles.badgeText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  icon: {
    marginRight: 2,
  },
  badgeSuccess: {
    backgroundColor: "#10b981",
  },
  badgeWarning: {
    backgroundColor: "#f59e0b",
  },
  badgeDanger: {
    backgroundColor: "#ef4444",
  },
  badgeInfo: {
    backgroundColor: "#6b7280",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});
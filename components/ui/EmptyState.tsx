import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "./Button";

type LucideIconComponent = React.ComponentType<{
  size?: number;
  color?: string;
  style?: any;
}>;

interface EmptyStateProps {
  icon: LucideIconComponent;
  title: string;
  subtitle: string;
  buttonText?: string;
  onButtonPress?: () => void;
  buttonIcon?: LucideIconComponent;
}

export function EmptyState({
  icon: Icon,
  title,
  subtitle,
  buttonText,
  onButtonPress,
  buttonIcon,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Icon size={72} color="#d1d5db" style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {buttonText && onButtonPress && (
        <Button
          onPress={onButtonPress}
          variant="primary"
          icon={buttonIcon}
          style={styles.button}
        >
          {buttonText}
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
    paddingVertical: 80,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
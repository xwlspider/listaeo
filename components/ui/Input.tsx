import React from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";
import { AlertCircle } from "lucide-react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  showCharCount?: boolean;
  currentLength?: number;
}

export function Input({
  label,
  error,
  required = false,
  optional = false,
  showCharCount = false,
  currentLength = 0,
  maxLength,
  style,
  ...props
}: InputProps) {
  return (
    <View style={styles.field}>
      {label && (
        <Text style={styles.label}>
          {label}{" "}
          {required && <Text style={styles.required}>*</Text>}
          {optional && <Text style={styles.optional}>(opcional)</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor="#9ca3af"
        maxLength={maxLength}
        {...props}
      />
      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={16} color="#dc2626" style={styles.errorIcon} />
          <Text style={styles.err}>{error}</Text>
        </View>
      )}
      {showCharCount && maxLength && (
        <Text style={styles.charCount}>
          {currentLength}/{maxLength}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  required: {
    color: "#ef4444",
    fontWeight: "700",
  },
  optional: {
    color: "#9ca3af",
    fontWeight: "400",
    fontSize: 14,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    color: "#111",
  },
  inputError: {
    borderColor: "#ef4444",
    borderWidth: 2,
  },
  charCount: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "right",
    marginTop: 4,
  },
  errorContainer: {
    backgroundColor: "#fee2e2",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  errorIcon: {
    marginRight: 2,
  },
  err: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
});
import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';

export default function HeaderBack({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onBack}
        style={styles.button}
        accessibilityLabel="Volver"
        accessibilityRole="button"
      >
        <Text style={styles.text}>←</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 16, left: 16 },
  button: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 }
  },
  text: { fontSize: 18 }
});

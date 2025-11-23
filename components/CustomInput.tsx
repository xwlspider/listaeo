import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';


type Props = {
    label: string;
    value: string;
    onChange: (v: string) => void;
    secure?: boolean; 
    error?: string;
    placeholder?: string;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad"; 
  };
  


  export default function CustomInput({
    label,
    value,
    onChange,
    secure,
    error,
    placeholder,
    keyboardType = "default",
  }: Props) {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.label}>{label}</Text>
  
        <TextInput
          value={value}
          placeholder={placeholder}
          onChangeText={onChange}
          secureTextEntry={!!secure}
          keyboardType={keyboardType}
          style={[styles.input, error ? styles.inputError : null]}
          accessibilityLabel={label}
        />
  
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );
  }
  


const styles = StyleSheet.create({
wrapper: { marginBottom: 12 },
label: { fontWeight: '600', marginBottom: 6 },
input: {
borderWidth: 1,
borderColor: '#d0d6e0',
padding: 10,
borderRadius: 8,
backgroundColor: 'white'
},
inputError: { borderColor: '#e05a4f' },
error: { color: '#e05a4f', marginTop: 6 }
});

import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';


export default function ButtonPrimary({ onPress, label }: { onPress: () => void; label: string }) {
return (
<Pressable style={styles.btn} onPress={onPress}>
<Text style={styles.txt}>{label}</Text>
</Pressable>
);
}


const styles = StyleSheet.create({
btn: {
marginTop: 10,
backgroundColor: '#3b82f6',
paddingVertical: 12,
borderRadius: 10,
alignItems: 'center'
},
txt: { color: 'white', fontWeight: '700' }
});
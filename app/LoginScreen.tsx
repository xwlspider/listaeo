import React, { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import CustomInput from "../components/CustomInput";
import { emailSchema, nameSchema, passwordSchema } from "../lib/shemas/TextShemas";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [errors, setErrors] = useState<any>({});

  const handleSubmit = () => {
    try {
      setErrors({});

      nameSchema.parse(name);
      emailSchema.parse(email);
      passwordSchema.parse(pass);

      Alert.alert("Éxito", "Registro exitoso!");
    } catch (err: any) {
      const field = err?.issues?.[0]?.path?.[0];
      const message = err?.issues?.[0]?.message;

      setErrors({ [field]: message });
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 20 }}>
        Registro
      </Text>

      <CustomInput label="Nombre" value={name} onChange={setName} error={errors.name} />

      <CustomInput label="Correo" value={email} onChange={setEmail} error={errors.email} />

      <CustomInput
        label="Contraseña"
        value={pass}
        onChange={setPass}
        error={errors.password}
        secure
      />

      <Pressable
        onPress={handleSubmit}
        style={{
          backgroundColor: "#3b82f6",
          padding: 12,
          borderRadius: 10,
          marginTop: 12,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "700" }}>
          Registrarme
        </Text>
      </Pressable>
    </View>
  );
}


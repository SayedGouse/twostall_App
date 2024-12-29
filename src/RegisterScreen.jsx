import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Base_url } from "./Base_URL";
import axios from "axios";

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister =  async() => {
    if (formData.Password !== formData.ConfirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
    try {
        if (
            formData.FullName &&
            formData.Email &&
            formData.Password ) {
            const response =await axios.post(`${Base_url}/api/userAppointment/register`, formData);
        
            if (response.status === 200) {
             
                Alert.alert("Success", "User registered successfully!");
                navigation.navigate("Login"); // Navigate to Login on successful registration
            }
          } else {
            Alert.alert("Error", "Please fill in all fields!");
            return;
          }
       
        
    } catch (error) {
        console.log("error",error);
        
    }
   
  };

  return (
    <ScrollView>

    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        onChangeText={(value) => handleInputChange("FullName", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={(value) => handleInputChange("Email", value)}
      />
      
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          onChangeText={(value) => handleInputChange("Password", value)}
          />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#6c757d"
            />
        </TouchableOpacity>
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          onChangeText={(value) =>
            handleInputChange("ConfirmPassword", value)
        }
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
          <Icon
            name={showConfirmPassword ? "eye-off" : "eye"}
            size={24}
            color="#6c757d"
            />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  </ScrollView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#ffffff",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#ffffff",
  },
  passwordInput: {
    flex: 1,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    marginTop: 15,
    color: "#007BFF",
  },
});
